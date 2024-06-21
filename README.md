GRT Schedule Application
The GRT Schedule Application is designed to interface with a Windows native database server, with data visualization and management facilitated through SQL Server Management Studio (SSMS). This guide provides an overview of the application's setup, functionality, and usage.

Database Setup
The application's database is initialized using two SQL scripts: createtables.sql and populatesampletables.sql. These scripts handle the creation and population of the necessary tables.

Table Creation: Run createtables.sql to set up the database schema.
Data Population: Run populatesampletables.sql to populate the tables with sample data from CSV files. The data from the CSV files will be automatically parsed and imported into the corresponding tables.
Application Functionality
The application establishes a connection to the database using a connection string at launch. It supports the execution of SQL queries, allowing for dynamic data retrieval and error handling. The response from the server, whether it is data or an error message, is formatted and printed out neatly.

Key Features
Database Connection: On startup, the application connects to the database using a predefined connection string.
Query Execution: Users can input SQL queries, which the application will execute against the database.
Response Handling: The application captures the server's response (data or error) and displays it in a readable format.
API Integration: The application is designed to be modular and can be packaged into APIs for front-end integration. Currently, it accepts input from the keyboard for testing purposes.
