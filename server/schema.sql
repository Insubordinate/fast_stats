DROP TABLE IF EXISTS data;

CREATE TABLE data (
    id TEXT PRIMARY KEY NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    filename TEXT NOT NULL,
    location TEXT,
    flag_raised BOOLEAN
);