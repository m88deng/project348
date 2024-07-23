//Functionality 11
        [HttpGet("/11/{stop_id}/{route_id:int}/{head}/{date}")]
        public IActionResult GetSchedule(string stop_id, int route_id, string head, string date)
        {
            using var conn = GetConnectionString();

            // WITH TempTrips AS(
            // SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign
            // FROM Trips t
            // JOIN CalendarDates cd ON cd.service_id = t.service_id
            // WHERE cd.service_date = 20240722 AND cd.exception_type = 1 AND t.route_id = 12 AND t.trip_headsign = 'Fairway Station'
            // ), RouteTrips AS(
            // SELECT DISTINCT tt.route_id, tt.trip_headsign, st.arrival_time
            // FROM StopTimes st
            // JOIN TempTrips tt ON tt.trip_id = st.trip_id
            // WHERE st.stop_id = '2675'
            // )
            // SELECT arrival_time
            // FROM RouteTrips
            // WHERE arrival_time > CONVERT(TIME, '03:00:00')
            // ORDER BY arrival_time;

            var command = "WITH TempTrips AS( SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign FROM Trips t JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = "+date+" AND cd.exception_type = 1 AND t.route_id = "+route_id+" AND t.trip_headsign = '"+head.Replace("%2F", "/")+"' ), RouteTrips AS( SELECT DISTINCT tt.route_id, tt.trip_headsign, st.arrival_time FROM StopTimes st JOIN TempTrips tt ON tt.trip_id = st.trip_id WHERE st.stop_id = '"+stop_id+"' ) SELECT arrival_time FROM RouteTrips WHERE arrival_time > CONVERT(TIME, '03:00:00') ORDER BY arrival_time;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }