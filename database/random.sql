WITH oneTrip AS (
SELECT TOP 1 t.trip_id
FROM Routes r
 JOIN Trips t ON r.route_id = t.route_id
 WHERE r.route_id = '12' AND t.trip_headsign = 'Fairway Station'
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