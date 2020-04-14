import pool from "./pool";

pool.on("connect", () => {
  console.log("connected to the db");
});

const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
    (id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    created_on DATE NOT NULL)`;

  pool
    .query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createCandidatesTable = () => {
  const candidatesCreateQuery = `
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE IF NOT EXISTS candidates
      (id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(100),
      about TEXT,
      about_tokens TSVECTOR,
      experience TEXT,
      experience_tokens TSVECTOR,
      years_of_Experience INTEGER,
      skills TEXT ARRAY,
      education TEXT,
      education_tokens TSVECTOR,
      certifications TEXT,
      certifications_tokens TSVECTOR,
      profile_image VARCHAR(1000),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `;

  pool
    .query(candidatesCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropUserTable = () => {
  const usersDropQuery = "DROP TABLE IF EXISTS users;";
  pool
    .query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropCandidatesTable = () => {
  const usersDropQuery = "DROP TABLE IF EXISTS candidates;";
  pool
    .query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createCandidatesTable();
};

const dropAllTables = () => {
  dropUserTable();
  dropCandidatesTable();
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

export { createAllTables, dropAllTables };

require("make-runnable");
