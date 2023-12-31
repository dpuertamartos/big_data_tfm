##  ETL Container Guide
This guide explains how to build and run the ETL container for transformation and aggregation tasks. 
The container interacts with a SQLite database, which should be mounted as a volume.


Prerequisites
- Docker installed on your machine.
- Create a custom network (only once)

`docker network create custom-network`

- Ensure MongoDB Container is Running

Firts run:

`docker run --name mongodb-container --network custom-network -d -p 27017:27017 mongo`

Later runs:

`docker start mongodb-container`

- Access to the ETL container's source code and Dockerfile.
- Ensure you have a volume for the SQLite database containing the db file: `pisos.db`

`docker volume create sqlite-db-volume`

- Ensure you have a volume for the logs  (only once)

`docker volume create logs`

### How to copy the pisos.db file into the volume

1. Ensure you know the path to your pisos.db file on your host machine. For example, it might be at /path/to/pisos.db.

2. Run a temporary container with the sqlite-db-volume volume mounted.

`docker run -it --rm --name temp-container -v sqlite-db-volume:/tmp/volume alpine`

3. Open another terminal. Use the docker cp command to copy the pisos.db file from your host to the temporary container's mounted volume.

`docker cp /path/to/pisos.db temp-container:/tmp/volume/`

4. Exit the temporary container. `exit` It will autodelete

### How to launch the container

1. TO BUILD THE CONTAINER
  - Navigate to the directory containing the Dockerfile `cd path/to/etl/project/ETL`
  - Build the Docker image `docker build -t etl-container .`
  
2. TO RUN THE CONTAINER for transformation

`docker run --rm -v logs:/usr/src/app/logs -v sqlite-db-volume:/usr/src/app/database -e SQL_URI=/database/pisos.db -e SCRIPT_NAME=transformation_script.sh --network custom-network etl-container`

3.TO RUN THE CONTAINER for aggregation

`docker run --rm -v logs:/usr/src/app/logs -v sqlite-db-volume:/usr/src/app/database -e SQL_URI=/database/pisos.db -e SCRIPT_NAME=aggregation_script.sh --network custom-network etl-container`

