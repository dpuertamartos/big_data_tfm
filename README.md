# big_data_tfm

overleaf link to memory https://www.overleaf.com/read/vjjqftkqphwy

## Prerequisitos

- Docker instalado
- WSL (en el caso de utilizar windows)

## Set up

Este proyecto se lanza utilizando Docker containers para mayor facilidad.

Los comandos mostrados en este readme requieren un sistema Unix o WSL si se está utilizando windows

Guia:

1. Clona el proyecto y accede al folder principal `cd big_data_tfm`
2. Inicia la base de datos de airflow:

`docker-compose run --rm airflow_webserver airflow db init`

3. Crea un usuario para tu aiflow web (en el comando se predefine admin/admin):

`
docker-compose run --rm airflow_webserver airflow users create \
    --username admin \
    --firstname FIRST_NAME \
    --lastname LAST_NAME \
    --role Admin \
    --email admin@example.org \
    --password admin
`

4. Lanza la mongodb, airflow y el sitio web:

`docker-compose up -d mongodb airflow_webserver airflow_scheduler web`

5. Construye las imágenes para el scraper, etl y análisis de datos. Estos servicios son lanzados en batch y no estan continuamente corriendo:

`docker-compose build scraper etl data_analysis`

## 1. Ingestion

###Primera ejecución

`docker-compose run --rm -e SCRIPT_NAME=ingestion_script.sh -e UPDATE_MODE=False scraper`

Este modo scrappeará los 3000 inmuebles más recientes de cada localización.
(Del más nuevo al más viejo).
Guardará la fecha del más reciente scrappeado por localización

TIEMPO ESTIMADO: 10 inmuebles / s

###Sucesivas ejuciones del scrapper

`docker-compose run --rm -e SCRIPT_NAME=ingestion_script.sh scraper`

Este modo utilizará la última fecha de update cada región. Con límite en 3000 inmuebles/ciudad.

Buscará inmuebles hasta encontrar alguno más antiguo que esa fecha, tras lo cual parará.

Por ejemplo si la fecha es 08/08/2023 para "Jaen", al encontrar alguno de 07/08/2023 o más antiguo, parará 
el scrapping para "Jaén", tomando ventaja de su orden por fecha.

###Checkeo de si los pisos de la database siguen activos

`docker-compose run --rm -e SCRIPT_NAME=ad_up_checking_script.sh scraper`

### Recomendaciones de uso del scrapper

Debido a la flexibilidad del scrapper se puede ejecutar con la frecuencia que se desee. 

Debido al hardcap de 3000 inmuebles / ciudad, se recomienda ejecutarlo al menos una vez a la semana. Para evitar perdida de datos de ciudades que tengan +200 anuncios nuevos por día.

### mongo-db backup

1. `chmod +x /path/to/project/ingestion_scrapper/mongodb/mongo_backup_script.sh`
2. configure airflow to run `mongo_backup_dag.py`

3. to restore

`mongorestore --host <your_mongodb_host> --port <your_mongodb_port> /path/to/your/mongodb-dump/`

## 2. ETL

### Limpieza y transformación de datos a formato tabular 

Se pasaran los datos de la mongo.db a la SQLite limpios y listos para usar por la web y por el proceso de ML

`docker-compose run --rm -e SCRIPT_NAME=transformation_script.sh etl`

### Agregación de los datos 

`docker-compose run --rm -e SCRIPT_NAME=aggregation_script.sh etl`

## 3. Machine learning

### Training

TO RUN THE CONTAINER for training

`docker-compose run --rm -e SCRIPT_NAME=train.sh data_analysis`

### Predicción y asignación de rating

TO RUN THE CONTAINER for prediction

`docker-compose run --rm -e SCRIPT_NAME=predict.sh data_analysis`

## 4. Orquestación


## 5. Web


## 6. Mongodb 


## 7. SQLite


### purpose

...

## DEV-UTILS

### How to copy the pisos.db file into the volume

1. Ensure you know the path to your pisos.db file on your host machine. For example, it might be at /path/to/pisos.db.

2. Run a temporary container with the sqlite-db-volume volume mounted.

`docker run -it --rm --name temp-container -v sqlite-db:/tmp/volume alpine`

3. Open another terminal. Use the docker cp command to copy the pisos.db file from your host to the temporary container's mounted volume.

`docker cp /path/to/pisos.db temp-container:/tmp/volume/`

4. Exit the temporary container. `exit` It will autodelete

## arquitecture 

![image](https://github.com/dpuertamartos/big_data_tfm/assets/92330952/a4a6c333-3fe6-4846-8ec7-ade61d227462)


