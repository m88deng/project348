using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Security;

namespace test
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string ConnectionString = "Server=localhost;Database=sample;Trusted_Connection=true;";
            System.Console.WriteLine("ConnectionString is presetted for local tesst");
            while (true)
            {

                // Read the SQL query from the user
                Console.WriteLine("Enter the SQL query (or type 'exit' to quit):");
                string query = Console.ReadLine();

                // Exit the loop if the user types 'exit'
                if (query.Trim().ToLower() == "exit")
                {
                    break;
                }
                try
                {
                    FetchAndPrintDataTable(ConnectionString, query);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");
                }

            }

            static void FetchAndPrintDataTable(string connectionString, string query)
            {
                DataTable dataTable = new DataTable();

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(query, connection);
                    dataAdapter.Fill(dataTable);
                }

                PrintDataTable(dataTable);
            }

            static void PrintDataTable(DataTable table)
            {
                // Extra formatting added
                // Determine the maximum length of each column
                int[] columnWidths = new int[table.Columns.Count];

                for (int i = 0; i < table.Columns.Count; i++)
                {
                    columnWidths[i] = table.Columns[i].ColumnName.Length;
                    foreach (DataRow row in table.Rows)
                    {
                        int length = row[table.Columns[i]].ToString().Length;
                        if (length > columnWidths[i])
                        {
                            columnWidths[i] = length;
                        }
                    }
                }

                // Print column headers
                for (int i = 0; i < table.Columns.Count; i++)
                {
                    Console.Write("| " + table.Columns[i].ColumnName.PadRight(columnWidths[i] + 2));
                }
                Console.Write("|");
                Console.WriteLine();

                // Print rows
                foreach (DataRow row in table.Rows)
                {
                    for (int i = 0; i < table.Columns.Count; i++)
                    {
                        Console.Write("| " + row[table.Columns[i]].ToString().PadRight(columnWidths[i] + 2));
                    }
                    Console.Write("|");
                    Console.WriteLine();
                }
            }
        }

    }
}