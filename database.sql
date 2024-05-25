-- Connect to PostgreSQL
psql -U postgres

-- Create a new database
CREATE DATABASE grt_schedule;

-- Connect to the new database
\c grt_schedule

-- Create a sample table
CREATE TABLE bus_routes (
    OBJECTID INTEGER PRIMARY KEY,
    Route INTEGER,
    FullName VARCHAR(100),
    Direction VARCHAR(50),
    Length FLOAT8,
    City VARCHAR(100),
    Type INTEGER,
    RouteID INTEGER
);


-- Insert some sample data
COPY bus_routes(OBJECTID, Route, FullName, Direction, Length, City, Type, RouteID)
FROM 'GRT_Routes_sample.csv'
DELIMITER ','
CSV HEADER;

