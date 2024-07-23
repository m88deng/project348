

WITH StopIds AS (SELECT stop_id
FROM Stops
WHERE stop_name = 'Conestoga Station'
)
SELECT DISTINCT r.route_id, r.route_long_name
 FROM Routes r
 JOIN Trips t ON r.route_id = t.route_id
 JOIN StopTimes st ON st.trip_id = t.trip_id
WHERE st.stop_id IN (SELECT stop_id FROM StopIds);

WITH StopIds AS (
SELECT stop_id
FROM Stops
WHERE stop_name = 'University Ave. / Phillip'
), TempRoutes AS(
SELECT r.route_id, r.route_long_name
FROM Routes r JOIN Trips t ON t.route_id = r.route_id
JOIN StopTimes st ON st.trip_id = t.trip_id
WHERE stop_id IN (SELECT stop_id FROM StopIds)
), TempTrips AS(
SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign
FROM Trips t
JOIN CalendarDates cd ON cd.service_id = t.service_id
WHERE cd.service_date = 20240722 AND cd.exception_type = 1
), RouteTrips AS(
SELECT DISTINCT tr.route_id, tr.route_long_name, tt.trip_headsign, st.arrival_time, ROW_NUMBER() OVER (PARTITION BY tr.route_id ORDER BY st.arrival_time) AS rn
FROM StopTimes st
JOIN TempTrips tt ON tt.trip_id = st.trip_id
JOIN TempRoutes tr ON tr.route_id = tt.route_id
WHERE st.stop_id IN (SELECT stop_id FROM StopIds) AND st.arrival_time > CONVERT(TIME, '16:37:32')
)
SELECT route_id, route_long_name, trip_headsign, arrival_time
FROM RouteTrips
WHERE rn = 1
ORDER BY route_id, arrival_time;