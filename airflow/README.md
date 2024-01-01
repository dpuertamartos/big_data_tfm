### How to launch docker airflow 

1. Initialize database (only once)

`docker-compose run webserver airflow db init` 

2. Create user (only once): 

`docker-compose run webserver airflow users create \
    --username admin \
    --firstname FIRST_NAME \
    --lastname LAST_NAME \
    --role Admin \
    --email admin@example.org \
    --password your_password`

3. to launch `docker-compose up -d`
3. to stop `docker-compose down`