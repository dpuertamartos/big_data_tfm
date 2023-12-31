##  Scraper Container Guide
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

- Access to the scrapper container's source code and Dockerfile.
- Ensure you have a volume for the logs (only once)

`docker volume create logs`


### How to launch the container

1. TO BUILD THE CONTAINER
  - Navigate to the directory containing the Dockerfile `cd path/to/etl/project/ETL`
  - Build the Docker image `docker build -t scraper .`

cd path/to/etl/project`
2. TO RUN THE CONTAINER for **ingestion**

First run (clear mongo db)

`docker run --rm --name my-scraper -v logs:/usr/src/app/logs -e SCRIPT_NAME=ingestion_script.sh -e UPDATE_MODE=False --network custom-network scraper`

Succesive run or using a mongodb backup

`docker run --rm --name my-scraper -v logs:/usr/src/app/logs -e SCRIPT_NAME=ingestion_script.sh --network custom-network scraper`

3. TO RUN THE CONTAINER to **check if ads are still up**

`docker run --rm --name my-scraper -v logs:/usr/src/app/logs -e SCRIPT_NAME=ad_up_checking_script.sh --network custom-network scraper`
