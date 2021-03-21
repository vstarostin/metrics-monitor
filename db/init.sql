CREATE TABLE devices(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    temp_enabled BOOLEAN NOT NULL DEFAULT 'TRUE', 
    humidity_enabled BOOLEAN NOT NULL DEFAULT 'TRUE', 
    noisiness_enabled BOOLEAN NOT NULL DEFAULT 'TRUE'
);

CREATE TABLE metrics(
    id SERIAL PRIMARY KEY,
    device_id INT NOT NULL REFERENCES devices (id) ON DELETE CASCADE,
    temp INT,
    humidity INT,
    noisiness INT,
    time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



