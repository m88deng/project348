-- Feature 1 : Get routes that pass by a stop
-- input: stop_name
-- output: route_id, route_long_name
WITH StopIds AS (
    SELECT stop_id
    FROM Stops
    WHERE stop_name = 'King / Grand River Hospital - Freeport Campus'
)
SELECT DISTINCT r.route_id, r.route_long_name
FROM Routes r
JOIN Trips t ON r.route_id = t.route_id
JOIN StopTimes st ON st.trip_id = t.trip_id
WHERE st.stop_id IN (SELECT stop_id FROM StopIds);


-- Feature 2 : Get directions of a route
-- input: route_id
-- output: trip_headsign 
SELECT DISTINCT t.trip_headsign
FROM Routes r JOIN Trips t ON r.route_id = t.route_id
WHERE t.route_id = 12;

-- Feature 3 : Get all stops by name
-- input: none
-- output: stop_name
SELECT DISTINCT stop_name
FROM Stops
ORDER BY stop_name;

-- Feature 4: Get upcoming transit at a stop
-- input: stop_name, date, time
-- output:route_id, route_long_name, trip_headsign, arrival_time
WITH StopIds AS (
    SELECT stop_id
    FROM Stops
    WHERE stop_name = 'University / Phillip'
), TempRoutes AS (
    SELECT r.route_id, r.route_long_name
    FROM Routes r
    JOIN Trips t ON t.route_id = r.route_id
    JOIN StopTimes st ON st.trip_id = t.trip_id
    WHERE stop_id IN (SELECT stop_id FROM StopIds)
), TempTrips AS (
    SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign
    FROM Trips t
    JOIN CalendarDates cd ON cd.service_id = t.service_id
    WHERE cd.service_date = '20240701' AND cd.exception_type = 1
),
RouteTrips AS (
    SELECT DISTINCT tr.route_id, tr.route_long_name, tt.trip_headsign, st.arrival_time,
    ROW_NUMBER() OVER (PARTITION BY tr.route_id ORDER BY st.arrival_time) AS rn
    FROM StopTimes st
    JOIN TempTrips tt ON tt.trip_id = st.trip_id
    JOIN TempRoutes tr ON tr.route_id = tt.route_id
    WHERE st.stop_id IN (SELECT stop_id FROM StopIds)
        AND st.arrival_time > CONVERT(TIME, '10:00:00')
)
SELECT route_id, route_long_name, trip_headsign, arrival_time
FROM RouteTrips
WHERE rn = 1
ORDER BY route_id, arrival_time;


--Feature 5:
WITH FirstTrip AS (
    SELECT TOP 1 t.trip_id
    FROM Trips t
    JOIN StopTimes st ON st.trip_id = t.trip_id
    JOIN CalendarDates cd ON cd.service_id = t.service_id
    WHERE cd.service_date = '20240711'
        AND st.stop_id = 4046
        AND st.arrival_time > '09:01:00'
    ORDER BY st.arrival_time
), TmpSecondTrip AS (
    SELECT TOP 1 t.trip_id
    FROM Trips t
    JOIN StopTimes st ON st.trip_id = t.trip_id
    JOIN CalendarDates cd ON cd.service_id = t.service_id
    WHERE cd.service_date = '20240711'
        AND st.stop_id = 2826
        AND st.arrival_time > '09:01:00'
    ORDER BY st.arrival_time
), FirstStopInfo AS (
    SELECT TOP 1 st.stop_sequence, st.arrival_time
    FROM StopTimes st
    JOIN Trips t ON t.trip_id = st.trip_id
    WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip)
        AND st.stop_id = 4046
    ORDER BY arrival_time
), SecondStopSequence AS (
    SELECT TOP 1 st.stop_sequence
    FROM StopTimes st JOIN Trips t ON t.trip_id = st.trip_id
    WHERE t.trip_id IN (SELECT trip_id FROM TmpSecondTrip)
        AND st.stop_id = 2826
    ORDER by arrival_time
), Intersection AS (
    SELECT DISTINCT s.stop_name
    FROM StopTimes st
    JOIN FirstTrip ft ON ft.trip_id = st.trip_id
    JOIN Stops s ON st.stop_id = s.stop_id
    WHERE st.stop_sequence >= (SELECT stop_sequence FROM FirstStopInfo)
    INTERSECT
    SELECT DISTINCT s.stop_name
    FROM StopTimes st
    JOIN TmpSecondTrip sct ON sct.trip_id = st.trip_id
    JOIN Stops s ON st.stop_id = s.stop_id
    WHERE st.stop_sequence <= (SELECT stop_sequence FROM SecondStopSequence)
), Mid1StopInfo AS (
    SELECT st.stop_id, st.arrival_time
    FROM StopTimes st
    JOIN Stops s ON s.stop_id = st.stop_id
    WHERE st.trip_id IN (SELECT trip_id FROM FirstTrip)
        AND s.stop_name IN (SELECT stop_name FROM Intersection)
), Mid2StopInfo AS (
    SELECT st.stop_id
    FROM StopTimes st
    JOIN Stops s ON s.stop_id = st.stop_id
    WHERE st.trip_id IN (SELECT trip_id FROM TmpSecondTrip)
        AND s.stop_name IN (SELECT stop_name FROM Intersection)
), SpecialView AS (
    SELECT t.trip_id, st.stop_id, st.stop_sequence, st.arrival_time
    FROM Trips t
    JOIN StopTimes st ON st.trip_id = t.trip_id
    JOIN CalendarDates cd ON cd.service_id = t.service_id
    WHERE cd.service_date = '20240711'
), SecondTripOptions AS ( 
    SELECT sv1.trip_id
    FROM SpecialView sv1
    JOIN SpecialView sv2 ON sv2.trip_id = sv1.trip_id
    WHERE sv1.stop_id IN (SELECT stop_id FROM Mid2StopInfo)
        AND sv2.stop_id = 2826
        AND sv1.arrival_time > (SELECT MAX(arrival_time) FROM Mid1StopInfo)
), SecondTrip AS (
    SELECT TOP 1 sto.trip_id
    FROM SecondTripOptions sto
    JOIN StopTimes st ON st.trip_id = sto.trip_id
    WHERE st.stop_id IN (SELECT stop_id FROM Mid2StopInfo)
        AND st.arrival_time > (SELECT MAX(arrival_time) FROM Mid1StopInfo)
        ORDER BY arrival_time
), RankedStops1 AS (
    SELECT t.route_id, t.trip_headsign, st.stop_id, st.arrival_time, st.stop_sequence, 
    ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
    FROM Trips t
    JOIN StopTimes t1 ON t1.trip_id = t.trip_id
    JOIN StopTimes t2 ON t2.trip_id = t.trip_id
    JOIN StopTimes st ON st.trip_id = t.trip_id
    WHERE t.trip_id IN ( SELECT trip_id FROM FirstTrip)
        AND t1.stop_id = 4046
        AND t2.stop_id IN (SELECT stop_id FROM Mid1StopInfo)
        AND t1.stop_sequence < t2.stop_sequence
        AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
), RankedStops2 AS (
        SELECT t.route_id, t.trip_headsign, st.stop_id, st.arrival_time, st.stop_sequence, 
        ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
        FROM Trips t
        JOIN StopTimes t1 ON t1.trip_id = t.trip_id
        JOIN StopTimes t2 ON t2.trip_id = t.trip_id
        JOIN StopTimes st ON st.trip_id = t.trip_id
        WHERE t.trip_id IN (SELECT trip_id FROM SecondTrip)
            AND t1.stop_id IN (SELECT stop_id FROM Mid2StopInfo)
            AND t2.stop_id = 2826
            AND t1.stop_sequence < t2.stop_sequence
            AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
), AllStops AS (
        SELECT * FROM RankedStops1 WHERE rn = 1
        UNION
        SELECT * FROM RankedStops2 WHERE rn = 1
)
SELECT al.route_id, al.trip_headsign, al.stop_id, s.stop_name, al.arrival_time, al.stop_sequence
FROM AllStops al
JOIN Stops s ON s.stop_id = al.stop_id
ORDER BY  arrival_time, stop_sequence;

-- Feature 6 : 
-- input : 
-- output : 
WITH FirstTrip AS (
    SELECT TOP 1 t.trip_id
    FROM Trips t
    JOIN StopTimes st ON st.trip_id = t.trip_id
    JOIN CalendarDates cd ON cd.service_id = t.service_id
    WHERE cd.service_date = '20240701'
        AND st.stop_id = 3909
        AND st.arrival_time > CONVERT(TIME, '11:42:00')
    ORDER BY st.arrival_time
), RankedStops AS (
    SELECT t.route_id, t.trip_headsign, st.stop_id, st.arrival_time, st.stop_sequence,
    ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
    FROM Trips t
    JOIN StopTimes t1 ON t1.trip_id = t.trip_id
    JOIN StopTimes t2 ON t2.trip_id = t.trip_id
    JOIN StopTimes st ON st.trip_id = t.trip_id
    WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip)
        AND t1.stop_id = 3909
        AND t2.stop_id = 2773
        AND t1.stop_sequence < t2.stop_sequence
        AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
)
SELECT rs.route_id, rs.trip_headsign, rs.stop_id, s.stop_name, rs.arrival_time, rs.stop_sequence
FROM RankedStops rs
JOIN Stops s ON s.stop_id = rs.stop_id
WHERE rn = 1
ORDER BY stop_sequence;

-- Feature 7
-- input : 
-- output : 
WITH oneTrip AS (
    SELECT TOP 1 t.trip_id
    FROM Routes r
    JOIN Trips t ON r.route_id = t.route_id
    WHERE r.route_id = 12
        AND t.trip_headsign = 'Fairway Station'
)
SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence, s.location_type, s.wheelchair_boarding
FROM StopTimes st
JOIN oneTrip ot ON ot.trip_id = st.trip_id
JOIN Stops s ON st.stop_id = s.stop_id
ORDER BY stop_sequence;

-- Feature 8 : With wheelchair
-- input:
-- output:
WITH oneTrip AS (
    SELECT TOP 1 t.trip_id
    FROM Routes r
    JOIN Trips t ON r.route_id = t.route_id
    WHERE r.route_id = 12
        AND t.trip_headsign = 'Fairway Station'
), routeStops AS (
    SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence, s.location_type, s.wheelchair_boarding
    FROM StopTimes st
    JOIN oneTrip ot ON ot.trip_id = st.trip_id
    JOIN Stops s ON st.stop_id = s.stop_id
)
SELECT stop_id, stop_name, stop_sequence, location_type, wheelchair_boarding
FROM routeStops
WHERE wheelchair_boarding = 2
ORDER BY stop_sequence;

--  Feature 9 :
--  input
--  output:
SELECT stop_id
FROM Stops
WHERE stop_name = 'University Ave. / Phillip';

-- Feature 10
-- input
-- output
SELECT r.route_id, r.route_long_name
FROM Routes r;

-- Feature 11 
-- input 
-- output
WITH TempTrips AS (
    SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign
    FROM Trips t
    JOIN CalendarDates cd ON cd.service_id = t.service_id
    WHERE cd.service_date = '20240701'
        AND cd.exception_type = 1
        AND t.route_id = 12
        AND t.trip_headsign = 'University/King'
),
RouteTrips AS ( 
    SELECT DISTINCT tt.route_id, tt.trip_headsign, st.arrival_time
    FROM StopTimes st
    JOIN TempTrips tt ON tt.trip_id = st.trip_id
    WHERE st.stop_id = 2772
)
SELECT arrival_time
FROM RouteTrips
WHERE arrival_time > CONVERT(TIME, '10:00:00')
ORDER BY arrival_time;

