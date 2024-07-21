SELECT DISTINCT
    r.route_id,
    r.route_long_name
FROM
    Routes r
    JOIN Trips t ON r.route_id = t.route_id
    JOIN stopTimes s ON s.trip_id = t.trip_id
WHERE
    stop_id = 2675;

SELECT DISTINCT
    r.route_id,
    r.route_long_name
FROM
    Routes r
    JOIN Trips t ON r.route_id = t.route_id
    JOIN CalendarDates cd ON t.service_id = cd.service_id
WHERE
    cd.service_date = '20240701'
    AND cd.exception_type = 1;

SELECT
    stop_id,
    stop_name,
    location_type
FROM
    Stops
WHERE
    wheelchair_boarding = 2;

WITH
    TempRoutes AS (
        SELECT
            r.route_id,
            r.route_long_name
        FROM
            Routes r
            JOIN Trips t ON t.route_id = r.route_id
            JOIN StopTimes st ON st.trip_id = t.trip_id
        WHERE
            stop_id = 2675
    ),
    TempTrips AS (
        SELECT DISTINCT
            route_id,
            t.service_id,
            trip_id,
            trip_headsign
        FROM
            Trips t
            JOIN CalendarDates cd ON cd.service_id = t.service_id
        WHERE
            cd.service_date = 20240701
            AND cd.exception_type = 1
    ),
    RouteTrips AS (
        SELECT DISTINCT
            tr.route_id,
            tr.route_long_name,
            tt.trip_headsign,
            st.arrival_time,
            ROW_NUMBER() OVER (
                PARTITION BY
                    tr.route_id
                ORDER BY
                    st.arrival_time
            ) AS rn
        FROM
            StopTimes st
            JOIN TempTrips tt ON tt.trip_id = st.trip_id
            JOIN TempRoutes tr ON tr.route_id = tt.route_id
        WHERE
            st.stop_id = 2675
            AND st.arrival_time > CONVERT(TIME, '10:02:32')
    )
SELECT
    route_id,
    route_long_name,
    trip_headsign,
    arrival_time
FROM
    RouteTrips
WHERE
    rn = 1
ORDER BY
    route_id,
    arrival_time;

SELECT
    r.route_id,
    r.route_long_name,
    r.route_type
FROM
    Routes r
WHERE
    r.route_type = 3;

WITH
    FirstTrip AS (
        SELECT
            TOP 1 t.trip_id
        FROM
            Trips t
            JOIN StopTimes st ON st.trip_id = t.trip_id
            JOIN CalendarDates cd ON cd.service_id = t.service_id
        WHERE
            cd.service_date = '20240701'
            AND st.stop_id = 3909
            AND st.arrival_time > '11:42:00'
        ORDER BY
            st.arrival_time
    ),
    RankedStops AS (
        SELECT
            t.route_id,
            st.stop_id,
            st.arrival_time,
            st.stop_sequence,
            ROW_NUMBER() OVER (
                PARTITION BY
                    st.stop_sequence
                ORDER BY
                    st.arrival_time
            ) AS rn
        FROM
            Trips t
            JOIN StopTimes t1 ON t1.trip_id = t.trip_id
            JOIN StopTimes t2 ON t2.trip_id = t.trip_id
            JOIN StopTimes st ON st.trip_id = t.trip_id
        WHERE
            t.trip_id IN (
                SELECT
                    trip_id
                FROM
                    FirstTrip
            )
            AND t1.stop_id = 3909
            AND t2.stop_id = 2773
            AND t1.stop_sequence < t2.stop_sequence
            AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
    )
SELECT
    rs.route_id,
    rs.stop_id,
    s.stop_name,
    rs.arrival_time,
    rs.stop_sequence
FROM
    RankedStops rs
    JOIN Stops s ON s.stop_id = rs.stop_id
WHERE
    rn = 1
ORDER BY
    stop_sequence;

WITH
    oneTrip AS (
        SELECT
            TOP 1 t.trip_id
        FROM
            Routes r
            JOIN Trips t ON r.route_id = t.route_id
        WHERE
            r.route_id = '202'
            AND t.trip_headsign = 'The Boardwalk Station'
    )
SELECT DISTINCT
    s.stop_id,
    s.stop_name,
    st.stop_sequence
FROM
    StopTimes st
    JOIN oneTrip ot ON ot.trip_id = st.trip_id
    JOIN Stops s ON st.stop_id = s.stop_id
ORDER BY
    st.stop_sequence;