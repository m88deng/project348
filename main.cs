using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace test
{
    internal class Program{
       static void Main(string[] args){
        SqlConnection conn = new SqlConnection();
        conn.ConnectionString= "Server=localhost;Database=testTable;Trusted_Connection=true;";
        conn.Open();

        SqlCommand cmd = new SqlCommand();
        cmd.Connection = conn;
        cmd.CommandText="select OBJECTID from bus_routes;";
        cmd.CommandText="select Direction from bus_routes;";
        cmd.CommandText="select * from bus_routes where Length>10;";
        cmd.CommandText="select City from bus_routes;"; //test commands

        SqlDataAdapter adapter = new SqlDataAdapter();
        adapter.SelectCommand = cmd;

        DataSet ds = new DataSet();
        adapter.Fill(ds); //container
        
        DataTable table = ds.Tables[0];

        conn.Close();


        Console.ReadKey();
    } 
    }
    
    
}
