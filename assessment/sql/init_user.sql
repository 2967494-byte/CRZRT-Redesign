CREATE USER asmt WITH PASSWORD 'asmt_secret';
CREATE DATABASE asmt OWNER asmt;
\c asmt
GRANT ALL ON SCHEMA public TO asmt;
ALTER SCHEMA public OWNER TO asmt;
