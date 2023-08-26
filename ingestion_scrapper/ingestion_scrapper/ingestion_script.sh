#!/bin/bash
source /home/ubuntu/big_data_tfm/venv/bin/activate
cd /home/ubuntu/big_data_tfm/ingestion_scrapper
scrapy crawl general -a update_mode=True

