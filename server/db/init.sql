CREATE TABLE devices(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    temperature_enabled BOOLEAN NOT NULL DEFAULT 'TRUE', 
    humidity_enabled BOOLEAN NOT NULL DEFAULT 'TRUE', 
    noisiness_enabled BOOLEAN NOT NULL DEFAULT 'TRUE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE metrics(
    id SERIAL PRIMARY KEY,
    device_id INT NOT NULL REFERENCES devices (id) ON DELETE CASCADE,
    temperature INT,
    humidity INT,
    noisiness INT,
    time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO users (name, password, email) VALUES ('John', '123', 'J@j.com');



