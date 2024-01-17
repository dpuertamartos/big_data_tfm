# big_data_tfm

overleaf link to memory https://www.overleaf.com/read/vjjqftkqphwy

## Prerequisitos

- Docker instalado
- WSL (en el caso de utilizar windows)
- Dar permisos de escritura y lectura en el socket de docker para todos los usuarios:

`sudo chmod 666 /var/run/docker.sock` (Necesario para que lo utilice airflow)

Se puede revertir con

`sudo chmod 660 /var/run/docker.sock`

- (Opcional: Activar docker al inicio de sistema. Nota: Si se usa WSL hay que activar WSL al inicio de sistema) `sudo systemctl enable docker`

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

3.b. (OPCIONAL) Restaura el volumen de mongodb siguiendo las intrucciones al final de este README en dev-utils


4. Lanza la mongodb, airflow y el sitio web:

`docker-compose up -d mongodb airflow_webserver airflow_scheduler web`

5. Construye las imágenes para el scraper, etl y análisis de datos. Estos servicios son lanzados en batch y no estan continuamente corriendo:

`docker-compose build scraper etl data_analysis`

6. Lanza el DAG 'restore_from_mongodb_volume_dag' o 'initial_run_dag' manualmente desde airflow

7. Cuando hayan acabado (pueden tardar varias horas estos dag iniciales) activa el resto de dag y el proyecto funcionará con normalidad

## 1. Ingestion

###Primera ejecución

`docker-compose run --rm -e SCRIPT_NAME=ingestion_script.sh -e UPDATE_MODE=False scraper`

Este modo scrappeará los 3000 inmuebles más recientes de cada localización.
(Del más nuevo al más viejo).
Guardará la fecha del más reciente scrappeado por localización

TIEMPO ESTIMADO: 10 inmuebles / s

###Sucesivas ejuciones del scrapper o si 

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

### For dev mode

Si queremos node_modules montado variablemente en el container, necesitamos npm en local

1. Borra el volumen `- /usr/src/app/node_modules` de app y backend en docker-compose-web.dev.yaml
2. Run `npm install` en backend
3. Run `npm install` en frontend
4. Run `docker compose -f docker-compose-web.dev.yaml up --build`

Si no queremos instalar nada en local (tendremos que actualizar package.json cuando queramos usar alguna libreria adicional):

1. Run `docker compose -f docker-compose-web.dev.yaml up --build`


## 6. Mongodb 

### Restaurar copia de mongodb (Para usarla de base del proyecto) - No obligatorio, podemos partir de 0

1. Si existe previamente un volumen con datos de mongodb lo borramos

`docker volume remove big_data_tfm_mongodb-data`

2. Lanzamos el contenedor de mongodb, se creara un nuevo volumen big_data_tfm_mongodb-data

`docker-compose up -d mongodb`

3. Copiamos el backup (cambiar /path/to/backup/)

`docker cp /path/to/backup/20231209/ mongodb-container:/tmp/bkup`

4. Lo restauramos 

`docker exec -it mongodb-container mongorestore /tmp/bkup`

5. Eliminamos el backup

`docker exec mongodb-container rm -rf /tmp/bkup`

### Hacer copia de seguridad cada 3 días.

AÑADIR INSTRUCCIONES


## 7. SQLite

### How to restore the database file (named pisos.db) into the volume

1. Ensure you know the path to your pisos.db file on your host machine. For example, it might be at /path/to/pisos.db.

2. Run a temporary container with the sqlite-db-volume volume mounted.

`docker run -it --rm -d --name temp-container -v sqlite-db:/volume alpine`

3. Open another terminal. Use the docker cp command to copy the pisos.db file from your host to the temporary container's mounted volume.

`docker cp /path/to/pisos.db temp-container:/volume/ && docker stop temp-container`


## DEV-UTILS

### Inspect volume contents

`docker run -it --rm --name temp-container -v big_data_tfm_logs:/data alpine sh`

### Copy data from volume to local file system

1. `docker run --rm -d -v [VOLUME_NAME]:/data --name temp-container alpine`

2. `docker cp temp-container:/data /path/to/local/destination && docker stop temp-container`

### Exporting the mongodb volume (or any) to another machine

1. `docker run --rm -v big_data_tfm_mongodb-data:/data -v $(pwd):/backup ubuntu tar czvf /backup/mongodb-volume-backup.tar.gz -C /data .`

In a new machine:

2. `docker volume create big_data_tfm_mongodb-data`
3. `docker run --rm -v big_data_tfm_mongodb-data:/data -v /path/where/backup/is/stored:/backup ubuntu tar xzvf /backup/volume-backup.tar.gz -C /data`


## arquitecture 

![image](https://github.com/dpuertamartos/big_data_tfm/assets/92330952/a4a6c333-3fe6-4846-8ec7-ade61d227462)


