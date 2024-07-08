using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;
using Formatting = Newtonsoft.Json.Formatting;

namespace testAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class testTableController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post(string sentence)
        {
            try
            {
                using var conn = new SqlConnection(
                new SqlConnectionStringBuilder()
                {
                    DataSource = "MIKU39",
                    InitialCatalog = "testDB",
                    UserID = "root",
                    Password = "123456",
                    Encrypt = true,
                    TrustServerCertificate = true
                }.ConnectionString
                );
                var sql = "INSERT INTO testTable(sentence) VALUES (@sentence);";
                var command = new SqlCommand(sql, conn);
                command.Parameters.Add("@sentence", SqlDbType.VarChar);
                command.Parameters["@sentence"].Value = sentence;

                conn.Open();
                var row = command.ExecuteNonQuery();
                if (row == 1)
                {
                    return StatusCode(201);
                }
                else
                {
                    return UnprocessableEntity();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{query}")]
        public IActionResult GetByQuery(string query)
        {
            using var conn = new SqlConnection(
                new SqlConnectionStringBuilder()
                {
                    DataSource = "MIKU39",
                    InitialCatalog = "testDB",
                    UserID = "root",
                    Password = "123456",
                    Encrypt = true,
                    TrustServerCertificate = true
                }.ConnectionString
                );
            var command = new SqlCommand(query, conn);

            conn.Open();
            DataTable dataTable = new DataTable();
            SqlDataAdapter dataAdapter = new SqlDataAdapter(query, conn);
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
