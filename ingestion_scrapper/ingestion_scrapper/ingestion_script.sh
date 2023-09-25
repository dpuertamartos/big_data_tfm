#!/bin/bash
source /home/ubuntu/big_data_tfm/venv/bin/activate
cd /home/ubuntu/big_data_tfm/ingestion_scrapper
scrapy crawl general -a update_mode=True >> /path/to/ingestion_logs/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
#uncomment the following line to activate ETL in case you want both in the same script
#python3.11 /home/ubuntu/big_data_tfm/ETL/main.py --sql_uri=/path/to/your/sqllite/db/pisos.db >> /path/to/ETL_logs/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
