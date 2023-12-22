# big_data_tfm

overleaf link to memory https://www.overleaf.com/read/vjjqftkqphwy

## 1. Ingestion

in root of project 

**cd ./ingestion_scrapper**

###Primera ejecución
**scrapy crawl general**

Este modo scrappeará los 3000 inmuebles más recientes de cada localización.
(Del más nuevo al más viejo).
Guardará la fecha del más reciente scrappeado por localización

TIEMPO ESTIMADO: 10 inmuebles / s

###Sucesivas ejuciones del scrapper

**scrapy crawl general -a update_mode=True**

Este modo utilizará la última fecha de update cada región. Con límite en 3000 inmuebles/ciudad.

Buscará inmuebles hasta encontrar alguno más antiguo que esa fecha, tras lo cual parará.

Por ejemplo si la fecha es 08/08/2023 para "Jaen", al encontrar alguno de 07/08/2023 o más antiguo, parará 
el scrapping para "Jaén", tomando ventaja de su orden por fecha.

### Recomendaciones de uso del scrapper

Debido a la flexibilidad del scrapper se puede ejecutar con la frecuencia que se desee. 

Debido al hardcap de 3000 inmuebles / ciudad, se recomienda ejecutarlo al menos una vez a la semana. Para evitar perdida de datos de ciudades que tengan +200 anuncios nuevos por día.

### Automatización en servidor 

0. install mongodb...
1. `sudo add-apt-repository ppa:deadsnakes/ppa`
2. `sudo apt update`
3. `sudo apt install python3.11 python3.11-venv`
4. `git clone https://github.com/dpuertamartos/big_data_tfm.git`
5. `cd big_data_tfm`
6. `python3.11 -m venv venv`
7. `source ./venv/bin/activate`
8. `pip install -r ./ingestion_scrapper/requirements.txt`
9. `chmod +x /home/ubuntu/big_data_tfm/ingestion_scrapper/ingestion_scrapper/ingestion_script.sh`
10. `chmod +x /home/ubuntu/big_data_tfm/ingestion_scrapper/ingestion_scrapper/ad_up_checking_script.sh`
11. configure airflow to run `ingestion_and_ETL_dag.py`

### mongo-db backup

1. `chmod +x /home/ubuntu/big_data_tfm/ingestion_scrapper/mongodb/mongo_backup_script.sh`
2. configure airflow to run `mongo_backup_dag.py`


3. to restore

`mongorestore --host <your_mongodb_host> --port <your_mongodb_port> /path/to/your/mongodb-dump/`

## 2. ETL

### install

0. have python3.11 and repository with venv (follow guide from ingestion)
1. `chmod +x /path/to/repo/main.py`
2. `source /path/to/repo/venv/bin/activate`
3. `pip install -r /path/to/repo/ETL/requirements.txt`
4. configure SQLuri `/path/to/repo/ETL/transformation_script.sh`
5. configure airflow to run `ingestion_and_ETL_dag.py`


Change sql_uri and logs to whatever path you want

### purpose

...

## arquitecture 

![image](https://github.com/dpuertamartos/big_data_tfm/assets/92330952/a4a6c333-3fe6-4846-8ec7-ade61d227462)


