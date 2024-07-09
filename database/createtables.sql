CREATE TABLE
  CalendarDates (
    service_id VARCHAR(30) NOT NULL,
    service_date VARCHAR(30) NOT NULL,
    exception_type INT,
    PRIMARY KEY (service_id, service_date)
  );

CREATE TABLE
  Routes (
    route_id INT NOT NULL PRIMARY KEY,
    route_long_name VARCHAR(50),
    route_type INT
  );

CREATE TABLE
  Stops (
    stop_id VARCHAR(10) NOT NULL PRIMARY KEY,
    stop_name VARCHAR(50),
    location_type INT,
    wheelchair_boarding INT
  );

CREATE TABLE
  Trips (
    route_id INT NOT NULL,
    service_id VARCHAR(30) NOT NULL,
    trip_id INT NOT NULL PRIMARY KEY,
    trip_headsign VARCHAR(50),
    direction_id INT,
    FOREIGN KEY (route_id) REFERENCES Routes (route_id),
  );

CREATE TABLE
  StopTimes (
    trip_id INT NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    stop_id VARCHAR(10),
    stop_sequence INT NOT NULL,
    PRIMARY KEY (trip_id, stop_sequence),
    FOREIGN KEY (trip_id) REFERENCES Trips (trip_id),
    FOREIGN KEY (stop_id) REFERENCES Stops (stop_id)
  );