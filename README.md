# GRT Schedule Application

The GRT Schedule Application interfaces with a SQL Server deployed locally, with data visualization and management facilitated through SQL Server Management Studio (SSMS). This guide provides an overview of the application's setup, functionality, and usage.
https://docs.google.com/document/d/1YLzvpp_1gnoKm4L1ihELy7x9BDWS8ZpEHP51xSu5D3U/edit?usp=sharing

## Database Setup

Scripts located in `./database`.
1. **Table Creation**: Execute `createtables.sql` to set up the database schema.
2. **Sample Data Population**: Execute `populatesampletables.sql` to populate the tables with sample data from CSV files. The data from the CSV files will be automatically parsed and imported into the corresponding tables.
3. **Production Data Population**: Execute `populatetables.sql` to populate the tables with production data from CSV files. The data from the CSV files will be automatically parsed and imported into the corresponding tables.

## Application Functionality

The application features a user interface that allows users to select the desired information. The front-end framework submits requests using POST and GET methods to the backend. The backend, implemented in .NET, processes the request parameters, plugs them into corresponding SQL query templates, establishes a connection with the database, retrieves the information, and returns it to the front end in JSON format. The front end then displays the results to the user.

Backend solution is located in `./Controller/tableController.cs`, with functions corresponding to various features.

### Key Features

1. **Database Connection**: On startup, the application connects to the database using a predefined connection string.
2. **Query Execution**: Users can input SQL queries, which the application will execute against the database.
3. **Response Handling**: The application captures the server's response (data or error) and displays it in a readable format.
4. **API Integration**: The application is designed to be modular and can be packaged into APIs for front-end integration. Currently, it accepts input from the keyboard for testing purposes.

## Usage

To use the GRT Schedule Application, follow these steps:

1. **Set Up the Database**: Run the provided SQL scripts to create tables and populate them with sample or production data.
2. **Launch the Application**: Start the application to establish a connection with the database.
3. **Look Up Information**: Use the user interface to look up information.
4. **View Results**: The application will display the query results or any error messages in a readable format.

By following these steps, users can effectively manage and visualize data using the GRT Schedule Application.
