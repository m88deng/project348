
bulk insert dbo.CalendarDates
from 'D:\Codes\repos\project348\database\sample_calendar_dates.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Routes
from 'D:\Codes\repos\project348\database\sample_routes.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Stops
from 'D:\Codes\repos\project348\database\sample_stops.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Trips
from 'D:\Codes\repos\project348\database\sample_trips.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.StopTimes
from 'D:\Codes\repos\project348\database\sample_stop_times.csv'
with(
format='csv',firstrow=2
)

