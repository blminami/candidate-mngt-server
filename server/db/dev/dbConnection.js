import pool from './pool';

pool.on('connect', () => {
  console.log('connected to the db');
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
      user_id INTEGER,
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

const createInterviewsTable = () => {
  const interviewsCreateQuery = `
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE IF NOT EXISTS interviews
      (id SERIAL PRIMARY KEY,
      user_id INTEGER,
      candidate_id INTEGER,
      job_id INTEGER,
      title VARCHAR(200),
      notes VARCHAR(500),
      status TEXT ARRAY,
      tags TEXT ARRAY,
      start_date TIMESTAMPTZ NOT NULL,
      start_time VARCHAR(100),
      due_date TIMESTAMPTZ NOT NULL,
      end_time VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON interviews
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `;
  pool
    .query(interviewsCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createJobsTable = () => {
  const jobsCreateQuery = `
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE IF NOT EXISTS jobs
      (id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title VARCHAR(200),
      description VARCHAR(500),
      status VARCHAR(100),
      required_resources INTEGER,
      hired_resources INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `;
  pool
    .query(jobsCreateQuery)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createTagsTable = () => {
  const tagsCreateQuery = `
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE IF NOT EXISTS tags
      (id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title VARCHAR(100),
      color VARCHAR(10),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `;
  pool
    .query(tagsCreateQuery)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createEventsTable = () => {
  const eventsCreateQuery = `
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TABLE IF NOT EXISTS events
      (id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title VARCHAR(100),
      color VARCHAR(10),
      start_date TIMESTAMPTZ NOT NULL,
      start_time VARCHAR(100),
      due_date TIMESTAMPTZ NOT NULL,
      end_time VARCHAR(100),
      location VARCHAR(100),
      notes VARCHAR(500),
      type VARCHAR(20),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `;
  pool
    .query(eventsCreateQuery)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createSubscriptionsTable = () => {
  const subscriptionsCreateQuery = `
    CREATE TABLE IF NOT EXISTS subscriptions
      (id SERIAL PRIMARY KEY,
      user_id INTEGER,
      endpoint VARCHAR(500),
      expirationTime VARCHAR(100),
      p256dh VARCHAR(200),
      auth VARCHAR(100));
  `;
  pool
    .query(subscriptionsCreateQuery)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createUploadsTable = () => {
  const uploadsCreateQuery = `
    CREATE TABLE IF NOT EXISTS uploads
      (id SERIAL PRIMARY KEY,
      user_id INTEGER,
      type VARCHAR(20),
      name VARCHAR(100),
      size VARCHAR(10),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
  `;
  pool
    .query(uploadsCreateQuery)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createEmailsTable = () => {
  const emailsCreateQuery = `
    CREATE TABLE IF NOT EXISTS emails
      (id SERIAL PRIMARY KEY,
      user_id INTEGER,
      email VARCHAR(100),
      type VARCHAR(20),
      subject VARCHAR(300),
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
  `;
  pool
    .query(emailsCreateQuery)
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropUserTable = () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS users;';
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
  const candidatesDropQuery = 'DROP TABLE IF EXISTS candidates;';
  pool
    .query(candidatesDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropInterviewsTable = () => {
  const interviewsDropQuery = 'DROP TABLE IF EXISTS interviews;';
  pool
    .query(interviewsDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropJobsTable = () => {
  const jobsDropQuery = 'DROP TABLE IF EXISTS jobs;';
  pool
    .query(jobsDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropTagsTable = () => {
  const tagsDropQuery = 'DROP TABLE IF EXISTS tags;';
  pool
    .query(tagsDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropEventsTable = () => {
  const eventsDropQuery = 'DROP TABLE IF EXISTS events;';
  pool
    .query(eventsDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropSubscriptionsTable = () => {
  const subscriptionsDropQuery = 'DROP TABLE IF EXISTS subscriptions;';
  pool
    .query(subscriptionsDropQuery)
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
  createInterviewsTable();
  createJobsTable();
  createTagsTable();
  createEventsTable();
  createSubscriptionsTable();
  createUploadsTable();
  createEmailsTable();
};

const dropAllTables = () => {
  dropUserTable();
  dropCandidatesTable();
  dropInterviewsTable();
  dropJobsTable();
  dropTagsTable();
  dropEventsTable();
  dropSubscriptionsTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

export { createAllTables, dropAllTables };

require('make-runnable');
