bulk insert dbo.CalendarDates
from
    '\var\opt\mssql\data\project348\database\sample_calendar_dates.csv'
with
    (format = 'csv', firstrow = 2) bulk insert dbo.Routes
from
    '\var\opt\mssql\data\project348\database\sample_routes.csv'
with
    (format = 'csv', firstrow = 2) bulk insert dbo.Stops
from
    '\var\opt\mssql\data\project348\database\sample_stops.csv'
with
    (format = 'csv', firstrow = 2) bulk insert dbo.Trips
from
    '\var\opt\mssql\data\project348\database\sample_trips.csv'
with
    (format = 'csv', firstrow = 2) bulk insert dbo.StopTimes
from
    '\var\opt\mssql\data\project348\database\sample_stop_times.csv'
with
    (format = 'csv', firstrow = 2)