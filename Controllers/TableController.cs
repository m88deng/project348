using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using Formatting = Newtonsoft.Json.Formatting;
using SqlConnection = Microsoft.Data.SqlClient.SqlConnection;
using SqlConnectionStringBuilder = Microsoft.Data.SqlClient.SqlConnectionStringBuilder;
using SqlDataAdapter = Microsoft.Data.SqlClient.SqlDataAdapter;
using System.Text.RegularExpressions;
using System.Linq.Expressions;

namespace testAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CS348Controller : ControllerBase
    {
        //login func
        [HttpGet("/login/{user_email}/{pwd}")]
        public IActionResult GetLogin(string user_email, string pwd)
        {
            if (!IsSafeString(user_email) || !IsSafeString(pwd))
            {
                return StatusCode(111, new { message = "SQL injection detected" });
            }
            using var conn = GetConnection();
            var command = " SELECT user_id FROM Users WHERE user_email = '" + user_email + "' AND pwd = '" + pwd + "';";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);
            if (dataTable.Rows.Count == 0)
            {
                return StatusCode(222, new { message = "Email or password is wrong" });
            }
            else
            { return Ok(ConvertDataTableToJson(dataTable)); }

        }


        //Functionality 1
        [HttpGet("/1/{name}")]
        public IActionResult GetRoutesOfStop(string name)
        {
            using var conn = GetConnection();

            // WITH StopIds AS (
            //  SELECT stop_id 
            //  FROM Stops 
            //  WHERE stop_name = '"+name+"' 
            // ) 
            // SELECT DISTINCT r.route_id, r.route_long_name 
            // FROM Routes r JOIN Trips t ON r.route_id = t.route_id 
            // JOIN StopTimes st ON st.trip_id = t.trip_id 
            // WHERE st.stop_id IN (SELECT stop_id FROM StopIds);

            var command = " WITH StopIds AS (SELECT stop_id FROM Stops WHERE stop_name = '" + name + "' ) SELECT DISTINCT r.route_id, r.route_long_name FROM Routes r JOIN Trips t ON r.route_id = t.route_id JOIN StopTimes st ON st.trip_id = t.trip_id WHERE st.stop_id IN (SELECT stop_id FROM StopIds);";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 2
        [HttpGet("/2/{route_id:int}")]
        public IActionResult GetRouteHeadsign(int route_id)
        {
            using var conn = GetConnection();

            // SELECT DISTINCT t.trip_headsign
            // FROM Routes r
            // JOIN Trips t ON r.route_id = t.route_id
            // WHERE t.route_id = 12;

            var command = "SELECT DISTINCT t.trip_headsign FROM Routes r JOIN Trips t ON r.route_id = t.route_id WHERE t.route_id = " + route_id + ";";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 3
        [HttpGet("/3/")]
        public IActionResult GetAllStops()
        {
            using var conn = GetConnection();

            // SELECT DISTINCT stop_name
            // FROM Stops
            // ORDER BY stop_name;

            var command = "SELECT DISTINCT stop_name FROM Stops ORDER BY stop_name;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 4
        [HttpGet("/4/{stop_name}/{date}/{time}")]
        public IActionResult Get4(string stop_name, string date, string time)
        {
            using var conn = GetConnection();

            // WITH StopIds AS (
            // SELECT stop_id
            // FROM Stops
            // WHERE stop_name = 'University Ave. / Phillip'
            // ), TempRoutes AS(
            // SELECT r.route_id, r.route_long_name
            // FROM Routes r JOIN Trips t ON t.route_id = r.route_id
            // JOIN StopTimes st ON st.trip_id = t.trip_id
            // WHERE stop_id IN (SELECT stop_id FROM StopIds)
            // ), TempTrips AS(
            // SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign
            // FROM Trips t
            // JOIN CalendarDates cd ON cd.service_id = t.service_id
            // WHERE cd.service_date = 20240722 AND cd.exception_type = 1
            // ), RouteTrips AS(
            // SELECT DISTINCT tr.route_id, tr.route_long_name, tt.trip_headsign, st.arrival_time, ROW_NUMBER() OVER (PARTITION BY tr.route_id ORDER BY st.arrival_time) AS rn
            // FROM StopTimes st
            // JOIN TempTrips tt ON tt.trip_id = st.trip_id
            // JOIN TempRoutes tr ON tr.route_id = tt.route_id
            // WHERE st.stop_id IN (SELECT stop_id FROM StopIds) AND st.arrival_time > CONVERT(TIME, '16:37:32')
            // )
            // SELECT route_id, route_long_name, trip_headsign, arrival_time
            // FROM RouteTrips
            // WHERE rn = 1
            // ORDER BY route_id, arrival_time;

            var command = "WITH StopIds AS ( SELECT stop_id FROM Stops WHERE stop_name = '" + stop_name.Replace("%2F", "/") + "' ), TempRoutes AS( SELECT r.route_id, r.route_long_name FROM Routes r JOIN Trips t ON t.route_id = r.route_id JOIN StopTimes st ON st.trip_id = t.trip_id WHERE stop_id IN (SELECT stop_id FROM StopIds) ), TempTrips AS( SELECT DISTINCT route_id, t.service_id, trip_id, trip_headsign FROM Trips t JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = " + date + " AND cd.exception_type = 1 ), RouteTrips AS( SELECT DISTINCT tr.route_id, tr.route_long_name, tt.trip_headsign, st.arrival_time, ROW_NUMBER() OVER (PARTITION BY tr.route_id ORDER BY st.arrival_time) AS rn FROM StopTimes st JOIN TempTrips tt ON tt.trip_id = st.trip_id JOIN TempRoutes tr ON tr.route_id = tt.route_id WHERE st.stop_id IN (SELECT stop_id FROM StopIds) AND st.arrival_time > CONVERT(TIME, '" + time + "') ) SELECT route_id, route_long_name, trip_headsign, arrival_time FROM RouteTrips WHERE rn = 1 ORDER BY route_id, arrival_time;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 5
        [HttpGet("/5/{start:int}/{end:int}/{date}/{time}")]
        public IActionResult Get5(int start, int end, string date, string time)
        {
            using var conn = GetConnection();

            // WITH FirstTrip AS (
            //     SELECT TOP 1 t.trip_id
            //     FROM Trips t
            //     JOIN StopTimes st ON st.trip_id = t.trip_id
            //     JOIN CalendarDates cd ON cd.service_id = t.service_id
            //     WHERE cd.service_date = '20240701'
            //       AND st.stop_id = 3899
            //       AND st.arrival_time > '11:42:00'
            //     ORDER BY st.arrival_time
            // ), TmpSecondTrip AS (
            //     SELECT TOP 1 t.trip_id
            //     FROM Trips t
            //     JOIN StopTimes st ON st.trip_id = t.trip_id
            //     JOIN CalendarDates cd ON cd.service_id = t.service_id
            //     WHERE cd.service_date = '20240701'
            //       AND st.stop_id = 2670
            //       AND st.arrival_time > '11:42:00'
            //     ORDER BY st.arrival_time
            // ), FirstStopInfo AS (
            //     SELECT st.stop_sequence, st.arrival_time
            //     FROM StopTimes st
            //     JOIN Trips t ON t.trip_id = st.trip_id
            //     WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip) AND st.stop_id = 3899
            // ), SecondStopSequence AS (
            //     SELECT st.stop_sequence
            //     FROM StopTimes st
            //     JOIN Trips t ON t.trip_id = st.trip_id
            //     WHERE t.trip_id IN(SELECT trip_id FROM TmpSecondTrip) AND st.stop_id = 2670
            // ), Intersection AS (
            //     SELECT DISTINCT s.stop_name
            //     FROM StopTimes st
            //     JOIN FirstTrip ft ON ft.trip_id = st.trip_id
            //     JOIN Stops s ON st.stop_id = s.stop_id
            //     WHERE st.stop_sequence >= (SELECT stop_sequence FROM FirstStopInfo)
            //     INTERSECT 
            //     SELECT DISTINCT s.stop_name
            //     FROM StopTimes st
            //     JOIN TmpSecondTrip sct ON sct.trip_id = st.trip_id
            //     JOIN Stops s ON st.stop_id = s.stop_id
            //     WHERE st.stop_sequence <=(SELECT stop_sequence FROM SecondStopSequence)
            // ), Mid1StopInfo AS(
            //     SELECT st.stop_id, st.arrival_time
            //     FROM StopTimes st 
            //     JOIN Stops s ON s.stop_id = st.stop_id
            //     WHERE st.trip_id IN (SELECT trip_id FROM FirstTrip) AND s.stop_name IN (SELECT stop_name FROM Intersection)
            // ), Mid2StopInfo AS(
            //     SELECT st.stop_id
            //     FROM StopTimes st 
            //     JOIN Stops s ON s.stop_id = st.stop_id
            //     WHERE st.trip_id IN (SELECT trip_id FROM TmpSecondTrip) AND s.stop_name IN (SELECT stop_name FROM Intersection)
            // ), SpecialView AS (
            //     SELECT t.trip_id, st.stop_id, st.stop_sequence, st.arrival_time
            //     FROM Trips t
            //     JOIN StopTimes st ON st.trip_id = t.trip_id
            //     JOIN CalendarDates cd ON cd.service_id = t.service_id
            //     WHERE cd.service_date = '20240701'
            // ), SecondTripOptions AS(
            //     SELECT sv1.trip_id
            //     FROM SpecialView sv1
            //     JOIN SpecialView sv2 ON sv2.trip_id = sv1.trip_id
            //     WHERE sv1.stop_id IN (SELECT stop_id FROM Mid2StopInfo)
            //     AND sv2.stop_id = 2670
            //     AND sv1.arrival_time > (SELECT arrival_time FROM Mid1StopInfo)
            // ), SecondTrip AS(
            //     SELECT TOP 1 sto.trip_id
            //     FROM SecondTripOptions sto
            //     JOIN StopTimes st ON st.trip_id = sto.trip_id
            //     WHERE st.stop_id IN (SELECT stop_id FROM Mid2StopInfo) AND st.arrival_time > (SELECT arrival_time FROM Mid1StopInfo)
            //     ORDER BY arrival_time
            // ), 
            // RankedStops1 AS (
            //     SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence,
            //            ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
            //     FROM Trips t
            //     JOIN StopTimes t1 ON t1.trip_id = t.trip_id
            //     JOIN StopTimes t2 ON t2.trip_id = t.trip_id
            //     JOIN StopTimes st ON st.trip_id = t.trip_id
            //     WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip)
            //       AND t1.stop_id = 3899 
            //       AND t2.stop_id IN (SELECT stop_id FROM Mid1StopInfo)
            //       AND t1.stop_sequence < t2.stop_sequence
            //       AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
            // ), RankedStops2 AS (
            //     SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence,
            //            ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn
            //     FROM Trips t
            //     JOIN StopTimes t1 ON t1.trip_id = t.trip_id
            //     JOIN StopTimes t2 ON t2.trip_id = t.trip_id
            //     JOIN StopTimes st ON st.trip_id = t.trip_id
            //     WHERE t.trip_id IN (SELECT trip_id FROM SecondTrip)
            //       AND t1.stop_id IN (SELECT stop_id FROM Mid2StopInfo) 
            //       AND t2.stop_id = 2670
            //       AND t1.stop_sequence < t2.stop_sequence
            //       AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence
            // ), AllStops AS ( 
            //     SELECT * FROM RankedStops1 WHERE rn = 1 UNION SELECT * FROM RankedStops2 WHERE rn = 1
            // )
            // SELECT route_id, stop_id, arrival_time 
            // FROM AllStops
            // ORDER BY arrival_time, stop_sequence;

            var command = " WITH FirstTrip AS ( SELECT TOP 1 t.trip_id FROM Trips t JOIN StopTimes st ON st.trip_id = t.trip_id JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = '" + date + "' AND st.stop_id = " + start + " AND st.arrival_time > '" + time + "' ORDER BY st.arrival_time ), TmpSecondTrip AS ( SELECT TOP 1 t.trip_id FROM Trips t JOIN StopTimes st ON st.trip_id = t.trip_id JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = '" + date + "' AND st.stop_id = " + end + " AND st.arrival_time > '" + time + "' ORDER BY st.arrival_time ), FirstStopInfo AS ( SELECT st.stop_sequence, st.arrival_time FROM StopTimes st JOIN Trips t ON t.trip_id = st.trip_id WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip) AND st.stop_id = " + start + " ), SecondStopSequence AS ( SELECT st.stop_sequence FROM StopTimes st JOIN Trips t ON t.trip_id = st.trip_id WHERE t.trip_id IN(SELECT trip_id FROM TmpSecondTrip) AND st.stop_id = " + end + " ), Intersection AS ( SELECT DISTINCT s.stop_name FROM StopTimes st JOIN FirstTrip ft ON ft.trip_id = st.trip_id JOIN Stops s ON st.stop_id = s.stop_id WHERE st.stop_sequence >= (SELECT stop_sequence FROM FirstStopInfo) INTERSECT  SELECT DISTINCT s.stop_name FROM StopTimes st JOIN TmpSecondTrip sct ON sct.trip_id = st.trip_id JOIN Stops s ON st.stop_id = s.stop_id WHERE st.stop_sequence <=(SELECT stop_sequence FROM SecondStopSequence) ), Mid1StopInfo AS( SELECT st.stop_id, st.arrival_time FROM StopTimes st  JOIN Stops s ON s.stop_id = st.stop_id WHERE st.trip_id IN (SELECT trip_id FROM FirstTrip) AND s.stop_name IN (SELECT stop_name FROM Intersection) ), Mid2StopInfo AS( SELECT st.stop_id FROM StopTimes st  JOIN Stops s ON s.stop_id = st.stop_id WHERE st.trip_id IN (SELECT trip_id FROM TmpSecondTrip) AND s.stop_name IN (SELECT stop_name FROM Intersection) ), SpecialView AS ( SELECT t.trip_id, st.stop_id, st.stop_sequence, st.arrival_time FROM Trips t JOIN StopTimes st ON st.trip_id = t.trip_id JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = '" + date + "' ), SecondTripOptions AS( SELECT sv1.trip_id FROM SpecialView sv1 JOIN SpecialView sv2 ON sv2.trip_id = sv1.trip_id WHERE sv1.stop_id IN (SELECT stop_id FROM Mid2StopInfo) AND sv2.stop_id = " + end + " AND sv1.arrival_time > (SELECT arrival_time FROM Mid1StopInfo) ), SecondTrip AS( SELECT TOP 1 sto.trip_id FROM SecondTripOptions sto JOIN StopTimes st ON st.trip_id = sto.trip_id WHERE st.stop_id IN (SELECT stop_id FROM Mid2StopInfo) AND st.arrival_time > (SELECT arrival_time FROM Mid1StopInfo) ORDER BY arrival_time ),  RankedStops1 AS ( SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence, ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn FROM Trips t JOIN StopTimes t1 ON t1.trip_id = t.trip_id JOIN StopTimes t2 ON t2.trip_id = t.trip_id JOIN StopTimes st ON st.trip_id = t.trip_id WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip) AND t1.stop_id = " + start + "  AND t2.stop_id IN (SELECT stop_id FROM Mid1StopInfo) AND t1.stop_sequence < t2.stop_sequence AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence ), RankedStops2 AS ( SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence, ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn FROM Trips t JOIN StopTimes t1 ON t1.trip_id = t.trip_id JOIN StopTimes t2 ON t2.trip_id = t.trip_id JOIN StopTimes st ON st.trip_id = t.trip_id WHERE t.trip_id IN (SELECT trip_id FROM SecondTrip) AND t1.stop_id IN (SELECT stop_id FROM Mid2StopInfo)  AND t2.stop_id = " + end + " AND t1.stop_sequence < t2.stop_sequence AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence ), AllStops AS (  SELECT * FROM RankedStops1 WHERE rn = 1 UNION SELECT * FROM RankedStops2 WHERE rn = 1 ) SELECT route_id, stop_id, arrival_time  FROM AllStops ORDER BY arrival_time, stop_sequence;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 6
        [HttpGet("/6/{start:int}/{end:int}/{date}/{time}")]
        public IActionResult Get6(int start, int end, string date, string time)
        {
            using var conn = GetConnection();

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

            var command = "WITH FirstTrip AS (SELECT TOP 1 t.trip_id FROM Trips t JOIN StopTimes st ON st.trip_id = t.trip_id JOIN CalendarDates cd ON cd.service_id = t.service_id WHERE cd.service_date = '" + date + "' AND st.stop_id = " + start + " AND st.arrival_time > CONVERT(TIME, '" + time + "') ORDER BY st.arrival_time), RankedStops AS (SELECT t.route_id, st.stop_id, st.arrival_time, st.stop_sequence, ROW_NUMBER() OVER (PARTITION BY st.stop_sequence ORDER BY st.arrival_time) AS rn FROM Trips t JOIN StopTimes t1 ON t1.trip_id = t.trip_id JOIN StopTimes t2 ON t2.trip_id = t.trip_id JOIN StopTimes st ON st.trip_id = t.trip_id WHERE t.trip_id IN (SELECT trip_id FROM FirstTrip) AND t1.stop_id = " + start + " AND t2.stop_id = " + end + " AND t1.stop_sequence < t2.stop_sequence AND st.stop_sequence BETWEEN t1.stop_sequence AND t2.stop_sequence) SELECT rs.route_id, rs.stop_id, s.stop_name, rs.arrival_time, rs.stop_sequence FROM RankedStops rs JOIN Stops s ON s.stop_id = rs.stop_id WHERE rn = 1 ORDER BY stop_sequence;";
            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 7
        [HttpGet("/7/{id:int}/{head}")]
        public IActionResult Get7(int id, string head)
        {
            using var conn = GetConnection();

            // WITH oneTrip AS (
            //  SELECT TOP 1 t.trip_id
            //  FROM Routes r
            //  JOIN Trips t ON r.route_id = t.route_id
            //  WHERE r.route_id = '12' AND t.trip_headsign = 'Fairway Station'
            // )
            //  SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence, s.location_type, s.wheelchair_boarding
            //  FROM StopTimes st
            //  JOIN oneTrip ot ON ot.trip_id = st.trip_id
            //  JOIN Stops s ON st.stop_id = s.stop_id;


            var command = "WITH oneTrip AS ( SELECT TOP 1 t.trip_id FROM Routes r  JOIN Trips t ON r.route_id = t.route_id  WHERE r.route_id = '" + id + "' AND t.trip_headsign = '" + head + "' )  SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence, s.location_type, s.wheelchair_boarding  FROM StopTimes st  JOIN oneTrip ot ON ot.trip_id = st.trip_id  JOIN Stops s ON st.stop_id = s.stop_id;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }


        //Functionality 8
        [HttpGet("/8/{id:int}/{head}")]
        public IActionResult Get8(int id, string head)
        {
            using var conn = GetConnection();

            // WITH oneTrip AS (
            //  SELECT TOP 1 t.trip_id
            //  FROM Routes r
            //  JOIN Trips t ON r.route_id = t.route_id
            //  WHERE r.route_id = '12' AND t.trip_headsign = 'Fairway Station'
            // ), routeStops AS (
            //  SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence, s.location_type, s.wheelchair_boarding
            //  FROM StopTimes st
            //  JOIN oneTrip ot ON ot.trip_id = st.trip_id
            //  JOIN Stops s ON st.stop_id = s.stop_id
            // )
            // SELECT stop_id, stop_name, stop_sequence, location_type, wheelchair_boarding
            // FROM routeStops 
            // WHERE wheelchair_boarding = 2
            // ORDER BY stop_sequence;

            var command = "WITH oneTrip AS ( SELECT TOP 1 t.trip_id FROM Routes r  JOIN Trips t ON r.route_id = t.route_id  WHERE r.route_id = '" + id + "' AND t.trip_headsign = '" + head + "' ), routeStops AS (  SELECT DISTINCT s.stop_id, s.stop_name, st.stop_sequence, s.location_type, s.wheelchair_boarding  FROM StopTimes st  JOIN oneTrip ot ON ot.trip_id = st.trip_id  JOIN Stops s ON st.stop_id = s.stop_id ) SELECT stop_id, stop_name, stop_sequence, location_type, wheelchair_boarding FROM routeStops  WHERE wheelchair_boarding = 2 ORDER BY stop_sequence;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 9
        [HttpGet("/9/{name}")]
        public IActionResult Get9(string name)
        {
            using var conn = GetConnection();

            // SELECT stop_id FROM Stops WHERE stop_name = 'Westmount / Erb';
            var command = "SELECT stop_id FROM Stops WHERE stop_name = '" + name.Replace("%2F", "/") + "';";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        //Functionality 10
        [HttpGet("/10/")]
        public IActionResult GetRoutes()
        {
            using var conn = GetConnection();

            //SELECT r.route_id, r.route_long_name
            //FROM Routes r;

            var command = "SELECT r.route_id, r.route_long_name FROM Routes r;";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }


        [HttpGet("/register/{user_email}/{pwd}")]
        public IActionResult Register(string user_email, string pwd)
        {
            if (!IsSafeString(user_email) || !IsSafeString(pwd))
            {
                return StatusCode(111, new { message = "SQL injection detected" });
            }
            int new_user_id;
            using var conn = GetConnection();

                var command = "SELECT MAX(user_id) AS largest_user_id FROM Users;";
                conn.Open();
                DataTable dataTable = new DataTable();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
                dataAdapter.Fill(dataTable);
                if(dataTable.Rows[0].IsNull("largest_user_id"))
                    new_user_id = 0;
                else
                new_user_id = (int)dataTable.Rows[0]["largest_user_id"] + 1;
                var insertcommand = "INSERT INTO Users (user_id, user_email, pwd) VALUES (" + new_user_id + ", '" + user_email + "', '" + pwd + "');";
                SqlCommand cmd = new SqlCommand(insertcommand, conn);
                cmd.ExecuteNonQuery();

            return StatusCode(666, new { message = "register successful" });
        }
        //      For early testing
        //[HttpGet("{query}")]
        //public IActionResult GetByQuery(string query)
        //{
        //    using var conn = GetConnection();

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
        protected bool IsSafeString(string inputString)
        {
            string pattern = @"(')|(--)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT|MERGE|SELECT|UPDATE|UNION|USE)\b)|(;)|(\bOR\b)|(\bAND\b)";
            Regex sqlInjectionPattern = new Regex(pattern, RegexOptions.IgnoreCase);

            return !sqlInjectionPattern.IsMatch(inputString);
        }


        [NonAction]
        protected SqlConnection GetConnection()
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

            // Melissa connection string
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
