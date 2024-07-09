using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;
using Formatting = Newtonsoft.Json.Formatting;

namespace testAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class cs348Controller : ControllerBase
    {
        protected SqlConnection GetConnectionString()
        {
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
        }


        //[HttpPost]
        //public IActionResult Post(string sentence)
        //{
        //    try
        //    {
        //        var sql = "INSERT INTO testTable(sentence) VALUES (@sentence);";
        //        var conn = GetConnectionString();
        //        var command = new SqlCommand(sql, conn);
        //        command.Parameters.Add("@sentence", SqlDbType.VarChar);
        //        command.Parameters["@sentence"].Value = sentence;

        //        conn.Open();
        //        var row = command.ExecuteNonQuery();
        //        if (row == 1)
        //        {
        //            return StatusCode(201);
        //        }
        //        else
        //        {
        //            return UnprocessableEntity();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, ex.Message);
        //    }
        //}

        [HttpGet("{query}")]
        public IActionResult GetByQuery(string query)
        {
            using var conn = GetConnectionString();

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(query, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }

        [HttpGet("{ID:int}")]
        public IActionResult GetByID(int ID)
        {
            using var conn = GetConnectionString();

            //              SELECT trip_id, departure_time
            //              FROM Trip_Table
            //              WHERE stop_id = 1001;
            var command = "SELECT trip_id, departure_time FROM StopTimes WHERE stop_id = " + ID + ";";

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(command, conn);
            dataAdapter.Fill(dataTable);

            return Ok(ConvertDataTableToJson(dataTable));
        }


        [HttpGet]
        [Route("api/info/[controller]")]
        public IActionResult GetBusOperatesOnWeekend()
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

        protected string ConvertDataTableToJson(DataTable dataTable)
        {
            string jsonString = string.Empty;

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                jsonString = JsonConvert.SerializeObject(dataTable, Formatting.Indented);
            }

            return jsonString;
        }
    }
}
