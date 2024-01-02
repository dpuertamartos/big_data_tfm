#!/bin/bash
# Read the app path from the file
APP_PATH=$(cat app_path.txt)
LOG_DIR="$APP_PATH/logs/checking_logs"
# Ensure log directory exists
mkdir -p $LOG_DIR

source $APP_PATH/venv/bin/activate
cd $APP_PATH/ingestion_scrapper
scrapy crawl ad_up_checking -a request_limit=5000 -a pause_time=60 >> $LOG_DIR/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
