WITH TempRoutes AS ( 
SELECT r.route_id, r.route_long_name 
FROM Routes r JOIN Trips t ON t.route_id = r.route_id 
JOIN StopTimes st ON st.trip_id = t.trip_id 
WHERE stop_id = 2675 
), TempTrips AS ( 
SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign 
FROM Trips t 
JOIN CalendarDates cd ON cd.service_id = t.service_id 
WHERE cd.service_date = 20240701 
AND cd.exception_type = 1 
) 

SELECT DISTINCT TOP 1 tr.route_id, tr.route_long_name, tt.trip_headsign, st.arrival_time
FROM StopTimes st 
JOIN TempTrips tt ON tt.trip_id = st.trip_id 
JOIN TempRoutes tr ON tr.route_id = tt.route_id
WHERE st.stop_id = 2675 AND st.arrival_time > CONVERT(TIME, '10:02:32')
ORDER BY st.arrival_time ASC;
