# CR-database

## Setup Guide

This guide will walk you through the necessary steps to setting up and running the software.

### Prerequisites

- Docker installed on your machine. Find the installation here at [https://www.docker.com/get-started/](https://www.docker.com/get-started/)

### Instructions

1. Clone the repository to your local machine:

```bash
git clone https://github.com/BESTLisbon/CR-database
```

2. Navigate to the directory of the repository:

```bash
cd /path/to/bd_proj_e2
```

3. Start the Docker containers using Docker Compose:

```bash
docker-compose up --build -d
```
This will build and run the containers and now the application should be running on you local machine.

#### React Verification

- Visit http://localhost:3000/ to visit the React app

#### Flask Verification

- Visit http://localhost:5001/ to verify that the is successfully up and running

#### Postgres Database Verification

1. Once the containers are up and running, access the PostgreSQL container by executing the following in your terminal:

```bash
docker exec -it cr-database bash
```

2. Within the container, login to the PostgreSQL database using the following command:

```bash
psql -U postgres
```

3. You are now logged into the PostgreSQL database. Now you can see the tables populated in the database, execute the following command:

```sql
\dt
```
This command will display a list of all tables in the database. You should see the companies table.

## Contribution Guide

1. Do not change the any of the docker files or docker compose files

2. You can update the container locally to view any changes you made in the application files using the following command:
```bash
docker-compose up --build -d
```

3. Once you're changes are ready, commit and push them to the repository.

### Postgres contributions

1. Note that `psql` commands will only affect the instance of the database that you are connected to locally. psql can be used to interact with the PostgreSQL database for testing purposes and will not be recorded into version control.

2. To contribute, place SQL queries in existing SQL files or create a new SQL file in the `data/` folder.

3. You can verify the changes made through your added SQL code by restarting the container. 

4. Once you're changes are ready, commit and push them to this repository.

