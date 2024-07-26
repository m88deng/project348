-- Feature 1 
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

-- Feature 2 
SELECT DISTINCT t.trip_headsign
FROM Routes r JOIN Trips t ON r.route_id = t.route_id
WHERE t.route_id = 12;

-- Feature 3
SELECT DISTINCT stop_name
FROM Stops
ORDER BY stop_name;

-- Feature 4
WITH StopIds AS (
    SELECT stop_id
    FROM Stops
    WHERE stop_name = 'Conestoga Station'
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
    WHERE cd.service_date = '20240722' AND cd.exception_type = 1
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

--Feature 5
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
WHERE arrival_time > CONVERT(TIME, '03:00:00')
ORDER BY arrival_time;

--Feature 6
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