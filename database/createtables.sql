CREATE TABLE
  CalendarDates (
    service_id VARCHAR(30) NOT NULL,
    service_date TIMESTAMP NOT NULL,
    exception_type INT,
    PRIMARY KEY (service_id, service_date)
  );

CREATE TABLE
  Routes (
    route_id INT NOT NULL PRIMARY KEY,
    route_long_name VARCHAR(50),
    route_type INT,
  );

CREATE TABLE
  Stops (
    stop_id INT NOT NULL PRIMARY KEY,
    stop_name VARCHAR(50),
    location_type INT,
    wheelchair_boarding INT
  );

CREATE TABLE
  Trips (
    route_id INT NOT NULL,
    service_id INT NOT NULL,
    trip_id INT NOT NULL,
    trip_headsign VARCHAR(50),
    PRIMARY KEY (route_id, service_id, trip_id),
    FOREIGN KEY (route_id) REFERENCES Routes (route_id),
    FOREIGN KEY (service_id) REFERENCES CalendarDates (service_id)
  );

CREATE TABLE
  StopTimes (
    trip_id INT NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    stop_id INT NOT NULL,
    stop_sequence INT NOT NULL,
    PRIMARY KEY (trip_id, stop_sequence),
    FOREIGN KEY (trip_id) REFERENCES Trips (trip_id),
    FOREIGN KEY (stop_id) REFERENCES Stops (stop_id)
  );