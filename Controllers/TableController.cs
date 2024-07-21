using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using Formatting = Newtonsoft.Json.Formatting;
using SqlConnection = Microsoft.Data.SqlClient.SqlConnection;
using SqlConnectionStringBuilder = Microsoft.Data.SqlClient.SqlConnectionStringBuilder;
using SqlDataAdapter = Microsoft.Data.SqlClient.SqlDataAdapter;
namespace testAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CS348Controller : ControllerBase
    {
        //Functionality 1
        [HttpGet("/1/{ID:int}")]
        public IActionResult GetRouteByStopID(int ID)
        {
            using var conn = GetConnectionString();

            //SELECT r.route_id, r.route_long_name
            //FROM Routes r
            //JOIN Trips t ON r.route_id = t.route_id
            //JOIN stop_times s ON s.trip_id = t.trip_id
            //WHERE stop_id = ID;

            var command = "SELECT r.route_id, r.route_long_name FROM Routes r JOIN Trips t ON r.route_id = t.route_id JOIN StopTimes s ON s.trip_id = t.trip_id WHERE stop_id =" + ID + ";";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 2
        [HttpGet("/2/{date}")]
        public IActionResult GetBusOperatesOnWeekend(string date)
        {
            using var conn = GetConnectionString();

            //SELECT DISTINCT r.route_id, r.route_long_name
            //FROM Routes r
            //JOIN Trips t ON r.route_id = t.route_id
            //JOIN CalendarDates cd ON t.service_id = cd.service_id
            //WHERE cd.service_date = '20240701'
            //AND cd.exception_type = 1;

            var command = "SELECT DISTINCT r.route_id, r.route_long_name FROM Routes r JOIN Trips t ON r.route_id = t.route_id JOIN CalendarDates cd ON t.service_id = cd.service_id WHERE cd.service_date = '" + date + "' AND cd.exception_type = 1;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 3
        [HttpGet("/3/")]
        public IActionResult Get3()
        {
            using var conn = GetConnectionString();

            //SELECT stop_id, stop_name, location_type
            //FROM Stops
            //WHERE wheelchair_boarding = 2

            var command = "SELECT stop_id, stop_name, location_type FROM Stops WHERE wheelchair_boarding = 2;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 4
        [HttpGet("/4/{stop_id:int}/{time}/{date}")]
        public IActionResult Get4(int stop_id, string time,string date)
        {
            using var conn = GetConnectionString();

            // WITH TempRoutes AS(
            //  SELECT r.route_id, r.route_long_name
            //  FROM Routes r JOIN Trips t ON t.route_id = r.route_id
            //  JOIN StopTimes st ON st.trip_id = t.trip_id
            //  WHERE stop_id = 2675
            // ), TempTrips AS(
            //  SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign
            //  FROM Trips t
            //  JOIN CalendarDates cd ON cd.service_id = t.service_id
            //  WHERE cd.service_date = 20240701 AND cd.exception_type = 1
            // ), RouteTrips AS(
            //  SELECT DISTINCT tr.route_id, tr.route_long_name, tt.trip_headsign, st.arrival_time, ROW_NUMBER() OVER (PARTITION BY tr.route_id ORDER BY st.arrival_time) AS rn
            //  FROM StopTimes st
            //  JOIN TempTrips tt ON tt.trip_id = st.trip_id
            //  JOIN TempRoutes tr ON tr.route_id = tt.route_id
            //  WHERE st.stop_id = 2675 AND st.arrival_time > CONVERT(TIME, '10:02:32')
            // )
            // SELECT route_id, route_long_name, trip_headsign, arrival_time
            // FROM RouteTrips
            // WHERE rn = 1
            // ORDER BY route_id, arrival_time;

            var command = "WITH TempRoutes AS (SELECT r.route_id, r.route_long_name FROM Routes r JOIN Trips t ON t.route_id = r.route_id JOIN StopTimes st ON st.trip_id = t.trip_id WHERE stop_id = " + stop_id + "), TempTrips AS (SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign FROM Trips t JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = "+date+" AND cd.exception_type = 1), RouteTrips AS (SELECT DISTINCT tr.route_id, tr.route_long_name, tt.trip_headsign, st.arrival_time, ROW_NUMBER() OVER (PARTITION BY tr.route_id ORDER BY st.arrival_time) AS rn FROM StopTimes st JOIN TempTrips tt ON tt.trip_id = st.trip_id JOIN TempRoutes tr ON tr.route_id = tt.route_id WHERE st.stop_id = "+stop_id+" AND st.arrival_time > CONVERT(TIME, '"+time+"')) SELECT route_id, route_long_name, trip_headsign, arrival_time FROM RouteTrips WHERE rn = 1 ORDER BY route_id, arrival_time;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 5
        [HttpGet("/5/{type:int}")]
        public IActionResult Get5(int type)
        {
            using var conn = GetConnectionString();

            // SELECT r.route_id, r.route_long_name, r.route_type
            // FROM Routes r
            // WHERE r.route_type = 3

            var command = "SELECT r.route_id, r.route_long_name, r.route_type FROM Routes r WHERE r.route_type = "+type+";";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 6
        [HttpGet("/6/{start:int}/{end:int}/{date}/{time}")]
        public IActionResult Get6(int start,int end,string date, string time)
        {
            using var conn = GetConnectionString();

            // WITH FirstTrip AS(
            //  SELECT TOP 1 t.trip_id           
            //  FROM Trips t           
            //  JOIN StopTimes st ON st.trip_id = t.trip_id            
            //  JOIN CalendarDates cd ON cd.service_id = t.service_id            
            //  WHERE cd.service_date = '20240701'
            //  AND st.stop_id = 3909 AND st.arrival_time > CONVERT(TIME, '11:42:00')            
            //  ORDER BY st.arrival_time
            // ), RankedStops AS(
            //  SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence,
            //                       ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
            //  FROM Trips t
            //  JOIN StopTimes t1 ON t1.trip_id = t.trip_id
            //  JOIN StopTimes t2 ON t2.trip_id = t.trip_id
            //  JOIN StopTimes st ON st.trip_id = t.trip_id
            //  WHERE t.trip_id IN(SELECT trip_id FROM FirstTrip)
            //      AND t1.stop_id = 3909 AND t2.stop_id = 2773 AND t1.stop_sequence < t2.stop_sequence
            //      AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
            // )
            // SELECT rs.route_id, rs.stop_id, s.stop_name, rs.arrival_time, rs.stop_sequence
            // FROM RankedStops rs
            // JOIN Stops s ON s.stop_id = rs.stop_id
            // WHERE rn = 1
            // ORDER BY stop_sequence;

            var command = "WITH FirstTrip AS (SELECT TOP 1 t.trip_id FROM Trips t JOIN StopTimes st ON st.trip_id = t.trip_id JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = '"+date+"' AND st.stop_id = "+start+" AND st.arrival_time > CONVERT(TIME, '"+time+"') ORDER BY st.arrival_time), RankedStops AS (SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence, ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn FROM Trips t JOIN StopTimes t1 ON t1.trip_id = t.trip_id JOIN StopTimes t2 ON t2.trip_id = t.trip_id JOIN StopTimes st ON st.trip_id = t.trip_id WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip) AND t1.stop_id = "+start+" AND t2.stop_id = "+end+" AND t1.stop_sequence < t2.stop_sequence AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence) SELECT rs.route_id, rs.stop_id, s.stop_name, rs.arrival_time, rs.stop_sequence FROM RankedStops rs JOIN Stops s ON s.stop_id = rs.stop_id WHERE rn = 1 ORDER BY stop_sequence;";
            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 7
        [HttpGet("/7/{id:int}/{head}")]
        public IActionResult Get7(int id,string head)
        {
            using var conn = GetConnectionString();

            // WITH oneTrip AS (
            // SELECT TOP 1 t.trip_id
            // 	FROM Routes r
            // JOIN Trips t ON r.route_id = t.route_id
            // WHERE r.route_id = ‘202’
            // 	AND t.trip_headsign = ‘The Boardwalk Station’
            // )
            // SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence
            // FROM StopTimes st
            // JOIN oneTrip ot ON ot.trip_id = st.trip_id
            // JOIN Stops s ON st.stop_id = s.stop_id
            // ORDER BY st.stop_sequence;



            var command = "WITH oneTrip AS (SELECT TOP 1 t.trip_id FROM Routes r JOIN Trips t ON r.route_id = t.route_id WHERE r.route_id = '"+id+"' AND t.trip_headsign = '"+head+"') SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence FROM StopTimes st JOIN oneTrip ot ON ot.trip_id = st.trip_id JOIN Stops s ON st.stop_id = s.stop_id ORDER BY st.stop_sequence;";
            // var command = "SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence FROM Routes r JOIN Trips t ON r.route_id = t.route_id JOIN StopTimes st ON t.trip_id = st.trip_id JOIN Stops s ON st.stop_id = s.stop_id WHERE r.route_id = '"+id+"' AND t.trip_headsign = '"+head+"' ORDER BY st.stop_sequence;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }


        //Functionality 8
        [HttpGet("/8/{id:int}/{head}")]
        public IActionResult Get8(int id,string head)
        {
            using var conn = GetConnectionString();

            //              SELECT service_id, start_date, end_date
            //              FROM Calendar_Table
            //              WHERE saturday = 1 AND sunday = 1;
            var command = "SELECT service_id FROM CalendarDates WHERE service_id LIKE 'saturday' AND service_id LIKE 'sunday'; ";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //      For early testing
        //[HttpGet("{query}")]
        //public IActionResult GetByQuery(string query)
        //{
        //    using var conn = GetConnectionString();

        //    conn.Open();
        //    DataTable dataTable = new DataTable();
        //    SqlDataAdapter dataAdapter = new SqlDataAdapter(query, conn);
        //    dataAdapter.Fill(dataTable);

        //    return Ok(ConvertDataTableToJson(dataTable));
        //}
        [NonAction]
        protected string ConvertDataTableToJson(DataTable dataTable)
        {
            string jsonString = string.Empty;

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                jsonString = JsonConvert.SerializeObject(dataTable, Formatting.Indented);
            }
            return jsonString;
        }

        [NonAction]
        protected SqlConnection GetConnectionString()
        {
            //setup connection to the database

            //Percy connection string
            var conn = new SqlConnection(
            new SqlConnectionStringBuilder()
            {
                DataSource = "MIKU39",
                InitialCatalog = "cs348",
                UserID = "root",
                Password = "123456",
                Encrypt = true,
                TrustServerCertificate = true
            }.ConnectionString
            );
            return conn;   
            
            //Melissa connection string
            // var conn = new SqlConnection(
            // new SqlConnectionStringBuilder()
            // {
            //     DataSource = "localhost",
            //     InitialCatalog = "master",
            //     UserID = "sa",
            //     Password = "dockerStrongPwd123",
            //     Encrypt = true,
            //     TrustServerCertificate = true
            // }.ConnectionString
            // );
            // return conn;

        }
    }
}
