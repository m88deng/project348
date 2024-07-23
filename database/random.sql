WITH FirstTrip AS (
                SELECT TOP 1 t.trip_id
                FROM Trips t
                JOIN StopTimes st ON st.trip_id = t.trip_id
                JOIN CalendarDates cd ON cd.service_id = t.service_id
                WHERE cd.service_date = '20240711'
                    AND st.stop_id = 3910
                    AND st.arrival_time > '09:01:00'
                ORDER BY st.arrival_time
            ), TmpSecondTrip AS (
                SELECT TOP 1 t.trip_id
                FROM Trips t
                JOIN StopTimes st ON st.trip_id = t.trip_id
                JOIN CalendarDates cd ON cd.service_id = t.service_id
                WHERE cd.service_date = '20240701'
                    AND st.stop_id = 2675
                    AND st.arrival_time > '11:42:00'
                ORDER BY st.arrival_time
            ), FirstStopInfo AS (
                SELECT TOP 1 st.stop_sequence, st.arrival_time
                FROM StopTimes st
                JOIN Trips t ON t.trip_id = st.trip_id
                WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip) AND st.stop_id = 3910
                ORDER BY arrival_time
            ), SecondStopSequence AS (
                SELECT TOP 1 st.stop_sequence
                FROM StopTimes st
                JOIN Trips t ON t.trip_id = st.trip_id
                WHERE t.trip_id IN(SELECT trip_id FROM TmpSecondTrip) AND st.stop_id = 2675
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
                WHERE st.stop_sequence <=(SELECT stop_sequence FROM SecondStopSequence)
            ), Mid1StopInfo AS(
                SELECT st.stop_id, st.arrival_time
                FROM StopTimes st 
                JOIN Stops s ON s.stop_id = st.stop_id
                WHERE st.trip_id IN (SELECT trip_id FROM FirstTrip) AND s.stop_name IN (SELECT stop_name FROM Intersection)
            ), Mid2StopInfo AS(
                SELECT st.stop_id
                FROM StopTimes st 
                JOIN Stops s ON s.stop_id = st.stop_id
                WHERE st.trip_id IN (SELECT trip_id FROM TmpSecondTrip) AND s.stop_name IN (SELECT stop_name FROM Intersection)
            )
            , SpecialView AS (
                SELECT t.trip_id, st.stop_id, st.stop_sequence, st.arrival_time
                FROM Trips t
                JOIN StopTimes st ON st.trip_id = t.trip_id
                JOIN CalendarDates cd ON cd.service_id = t.service_id
                WHERE cd.service_date = '20240701'
            ), SecondTripOptions AS(
                SELECT sv1.trip_id
                FROM SpecialView sv1
                JOIN SpecialView sv2 ON sv2.trip_id = sv1.trip_id
                WHERE sv1.stop_id IN (SELECT stop_id FROM Mid2StopInfo)
                AND sv2.stop_id = 2675
                AND sv1.arrival_time > (SELECT MAX(arrival_time) FROM Mid1StopInfo)
            ), SecondTrip AS(
                SELECT TOP 1 sto.trip_id
                FROM SecondTripOptions sto
                JOIN StopTimes st ON st.trip_id = sto.trip_id
                WHERE st.stop_id IN (SELECT stop_id FROM Mid2StopInfo) AND st.arrival_time > (SELECT MAX(arrival_time) FROM Mid1StopInfo)
                ORDER BY arrival_time
            ),     RankedStops1 AS (
                SELECT t.route_id, t.trip_headsign, st.stop_id, st.arrival_time, st.stop_sequence,
                                       ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
                FROM Trips t
                JOIN StopTimes t1 ON t1.trip_id = t.trip_id
                JOIN StopTimes t2 ON t2.trip_id = t.trip_id
                JOIN StopTimes st ON st.trip_id = t.trip_id
                WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip)
                AND t1.stop_id = 3910 
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
                    AND t2.stop_id = 2675
                    AND t1.stop_sequence < t2.stop_sequence
                    AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
            ), AllStops AS ( 
                SELECT * FROM RankedStops1 WHERE rn = 1 UNION SELECT * FROM RankedStops2 WHERE rn = 1
            )
            SELECT al.route_id, al.trip_headsign, al.stop_id, s.stop_name, al.arrival_time, al.stop_sequence 
            FROM AllStops al
            JOIN Stops s ON s.stop_id = al.stop_id
            ORDER BY arrival_time, stop_sequence;