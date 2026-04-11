-- -------------------------------
-- TABUĽKA USERS
-- -------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- -------------------------------
-- TABUĽKA STATS_WCST
-- -------------------------------
CREATE TABLE stats_wcst (
    id SERIAL PRIMARY KEY,
    time TIMESTAMP,
    categories_completed SMALLINT,
    trials_administered SMALLINT,
    total_correct SMALLINT,
    total_error SMALLINT,
    perseverative_responses SMALLINT,
    perseverative_errors SMALLINT,
    non_perseverative_errors SMALLINT,
    failure_to_maintain_set SMALLINT,
    trials_to_first_category SMALLINT,
    perseverativePercent NUMERIC(5,2),
    perseverativeErrorPercent NUMERIC(5,2),
    nonPerseverativeErrorPercent NUMERIC(5,2),
    errorPercent NUMERIC(5,2),
    user_id INT,
    CONSTRAINT fk_stats_wcst_user_id
        FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- -------------------------------
-- TABUĽKA STATS_KNOX
-- -------------------------------
CREATE TABLE stats_knox (
    id SERIAL PRIMARY KEY,
    time TIMESTAMP,
    threeStepSequencesCorrect SMALLINT,
    fourStepSequencesCorrect SMALLINT,
    fiveStepSequencesCorrect SMALLINT,
    sixStepSequencesCorrect SMALLINT,
    sevenStepSequencesCorrect SMALLINT,
    eightStepSequencesCorrect SMALLINT,
    totalCorrect SMALLINT,
    user_id INT,
    CONSTRAINT fk_stats_knox_user_id
        FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE stats_knox
ADD COLUMN totalScore SMALLINT;

ALTER TABLE stats_knox
ALTER COLUMN totalScore TYPE FLOAT;


-- -------------------------------
-- TABUĽKA STATS_TOL
-- -------------------------------
CREATE TABLE stats_tol (
    id SERIAL PRIMARY KEY,
    time TIMESTAMP,
    fourMovesSequencesCorrect SMALLINT,
    fiveMovesSequencesCorrect SMALLINT,
    sixMovesSequencesCorrect SMALLINT,
    totalCorrect SMALLINT,
    user_id SMALLINT,
    totalScore FLOAT,
    CONSTRAINT fk_stats_tol_user_id
        FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- CREATE TABLE users (
-- 	id SERIAL PRIMARY KEY,
-- 	username VARCHAR(50) NOT NULL UNIQUE,
-- 	password TEXT NOT NULL
-- );

-- CREATE TABLE stats (
-- 	id SERIAL PRIMARY KEY,
-- 	time TIMESTAMP,
-- 	number_of_categories_completed SMALLINT,
-- 	total_number_of_trials_administrated SMALLINT,
-- 	correct_trials SMALLINT,
-- 	errors_trials SMALLINT,
-- 	user_id INT,
-- 	CONSTRAINT fk_user_id
-- 		FOREIGN KEY(user_id) REFERENCES users(id)
-- 		ON DELETE CASCADE
-- 		ON UPDATE CASCADE
-- );

-- CREATE TABLE leaderboard (
-- 	id SERIAL PRIMARY KEY,
-- 	user_id INT,
-- 	stats_id INT,
-- 	CONSTRAINT fk_user_id
-- 		FOREIGN KEY(user_id) REFERENCES users(id)
-- 		ON DELETE CASCADE
-- 		ON UPDATE CASCADE,
-- 	CONSTRAINT fk_stats_id
-- 		FOREIGN KEY(stats_id) REFERENCES stats(id)
-- 		ON DELETE CASCADE
-- 		ON UPDATE CASCADE
-- );


-- ALTER TABLE stats
-- DROP CONSTRAINT fk_username;

-- ALTER TABLE stats 
-- DROP COLUMN user_username;

-- ALTER TABLE stats
-- ADD COLUMN perseverative_responses SMALLINT,
-- ADD COLUMN perseverative_errors SMALLINT,
-- ADD COLUMN non_perseverative_errors SMALLINT,
-- ADD COLUMN failure_to_maintain_set SMALLINT,
-- ADD COLUMN trials_to_first_category SMALLINT,
-- ADD COLUMN perseverative_percent NUMERIC(5,2),
-- ADD COLUMN perseverative_error_percent NUMERIC(5,2),
-- ADD COLUMN non_perseverative_error_percent NUMERIC(5,2),
-- ADD COLUMN error_percent NUMERIC(5,2);

ALTER TABLE stats RENAME COLUMN correct_trials TO total_correct;
ALTER TABLE stats RENAME COLUMN errors_trials TO total_error;
ALTER TABLE stats RENAME COLUMN number_of_categories_completed TO categories_completed;
ALTER TABLE stats RENAME COLUMN total_number_of_trials_administrated TO trials_administered;

ALTER TABLE stats RENAME TO stats_wcst;


-- CREATE TABLE stats (
--     id SERIAL PRIMARY KEY,
--     time TIMESTAMP,
--     categories_completed SMALLINT,
--     trials_administered SMALLINT,
--     total_correct SMALLINT,
--     total_error SMALLINT,
--     perseverative_responses SMALLINT,
--     perseverative_errors SMALLINT,
--     non_perseverative_errors SMALLINT,
--     failure_to_maintain_set SMALLINT,
--     trials_to_first_category SMALLINT,
--     perseverative_percent NUMERIC(5,2),
--     perseverative_error_percent NUMERIC(5,2),
--     non_perseverative_error_percent NUMERIC(5,2),
--     error_percent NUMERIC(5,2),
--     user_id INT,
--     CONSTRAINT fk_user_id
--         FOREIGN KEY(user_id) REFERENCES users(id)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE
-- );