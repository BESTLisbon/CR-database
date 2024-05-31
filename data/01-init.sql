DROP TABLE IF EXISTS contact;
DROP TABLE IF EXISTS morada;
DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    nome VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT NULL,
    active BOOLEAN DEFAULT FALSE
);

CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(255) DEFAULT NULL,
    website VARCHAR(255) NOT NULL,
    UNIQUE (name)
);

CREATE TABLE morada (
    morada_id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    company_id INT,
    FOREIGN KEY (company_id) REFERENCES company(company_id)
);

CREATE TABLE contact (
    contact_id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    company_id INT,
    FOREIGN KEY (company_id) REFERENCES company(company_id)
);
