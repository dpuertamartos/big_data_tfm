#!/bin/bash
# Read the app path from the file
APP_PATH=$(cat app_path.txt)
source $APP_PATH/venv/bin/activate
cd $APP_PATH/ingestion_scrapper
# Run scrapy with logging
scrapy crawl general -a update_mode=True >> $APP_PATH/ingestion_logs/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
