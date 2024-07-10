
bulk insert dbo.CalendarDates
from '\var\opt\mssql\data\project348\database\calendar_dates.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Routes
from '\var\opt\mssql\data\project348\database\routes.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Stops
from '\var\opt\mssql\data\project348\database\stops.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.Trips
from '\var\opt\mssql\data\project348\database\trips.csv'
with(
format='csv',firstrow=2
)

bulk insert dbo.StopTimes
from '\var\opt\mssql\data\project348\database\stop_times.csv'
with(
format='csv',firstrow=2
)

