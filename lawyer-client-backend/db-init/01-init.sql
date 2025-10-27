-- Create user and database (if not exists)
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'myuser') THEN
      CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
   END IF;
END
$do$;

-- Create database (if not exists)
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lawyer_client_db') THEN
      CREATE DATABASE lawyer_client_db OWNER myuser;
   END IF;
END
$do$;
