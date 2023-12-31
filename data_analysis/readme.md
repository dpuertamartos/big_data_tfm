##  ML Container Guide
This guide explains how to build and run the ML container for training and prediction tasks. 
The container interacts with a SQLite database, which should be mounted as a volume.


Prerequisites
- Docker installed on your machine.

- Access to the ML container's source code and Dockerfile.
- Ensure you have a volume for the SQLite database containing the db file in the root: `pisos.db`

`docker volume create sqlite-db-volume`

- Ensure you have a volume for the logs  (only once)

`docker volume create logs`

- Ensure you have a volume for the models (only once)

`docker volume create models`

### How to launch the container

1. TO BUILD THE CONTAINER
  - Navigate to the directory containing the Dockerfile `cd path/to/project/data_analysis`
  - Build the Docker image `docker build -t ml-container .`
  
2. TO RUN THE CONTAINER for training

`docker run --rm --name my_ml -v models:/usr/src/app/models -v logs:/usr/src/app/logs -v sqlite-db-volume:/usr/src/app/database -e SCRIPT_NAME=train.sh ml-container`

3.TO RUN THE CONTAINER for prediction

`docker run --rm --name my_ml -v models:/usr/src/app/models -v logs:/usr/src/app/logs -v sqlite-db-volume:/usr/src/app/database -e SCRIPT_NAME=predict.sh ml-container`