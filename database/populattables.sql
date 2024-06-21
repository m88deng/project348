
bulk insert dbo.CalendarDates
from 'D:\Codes\project348\database\calendar_dates.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Routes
from 'D:\Codes\project348\database\routes.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Stops
from 'D:\Codes\project348\database\stops.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Trips
from 'D:\Codes\project348\database\trips.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.StopTimes
from 'D:\Codes\project348\database\stop_times.csv'
with(
format='csv',firstrow=2
)

