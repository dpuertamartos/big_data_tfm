#!/bin/bash
source /home/ubuntu/big_data_tfm/venv/bin/activate
cd /home/ubuntu/big_data_tfm/ingestion_scrapper
scrapy crawl ad_up_checking -a request_limit=5000 -a pause_time=60 >> /home/ubuntu/Desktop/checking_logs/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
