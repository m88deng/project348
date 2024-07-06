SELECT TOP 1 t.trip_id, t.trip_headsign, st.arrival_time FROM StopTimes st JOIN Trips t ON st.trip_id = t.trip_id WHERE st.stop_id = '1642'  ORDER BY st.arrival_time ASC;

SELECT stop_id, stop_name, location_type FROM Stops WHERE wheelchair_boarding = 2;

SELECT DISTINCT r.route_id, r.route_long_name FROM Routes r JOIN Trips t ON r.route_id = t.route_id JOIN CalendarDates cd ON t.service_id = cd.service_id WHERE cd.service_id LIKE '%Saturday%' OR cd.service_id LIKE '%Sunday%'

SELECT r.route_id, r.route_long_name FROM Routes r JOIN Trips t ON r.route_id = t.route_id JOIN StopTimes s ON s.trip_id = t.trip_id WHERE stop_id = 1642;