WITH FirstTrip AS(
 SELECT TOP 1 t.trip_id           
 FROM Trips t           
 JOIN StopTimes st ON st.trip_id = t.trip_id            
 JOIN CalendarDates cd ON cd.service_id = t.service_id            
 WHERE cd.service_date = '20240701'
 AND st.stop_id = 3909 
 AND st.arrival_time > CONVERT(TIME, '11:42:00')            
 ORDER BY st.arrival_time
), RankedStops AS(
 SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence,
                      ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
 FROM Trips t
 JOIN StopTimes t1 ON t1.trip_id = t.trip_id
 JOIN StopTimes t2 ON t2.trip_id = t.trip_id
 JOIN StopTimes st ON st.trip_id = t.trip_id
 WHERE t.trip_id IN(SELECT trip_id FROM FirstTrip)
     AND t1.stop_id = 3909 
     AND t2.stop_id = 2773 
     AND t1.stop_sequence < t2.stop_sequence
     AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
)
SELECT rs.route_id, rs.stop_id, s.stop_name, rs.arrival_time, rs.stop_sequence
FROM RankedStops rs
JOIN Stops s ON s.stop_id = rs.stop_id
WHERE rn = 1
ORDER BY stop_sequence;

SELECT stop_id FROM Stops WHERE stop_name = 'Westmount / Erb';
SELECT stop_id FROM Stops WHERE stop_name = 'Bleams / Fallowfield';
