#!/bin/bash
# Read the app path from the file
APP_PATH=$(cat app_path.txt)
LOG_DIR="$APP_PATH/logs/ingestion_logs"
# Use the UPDATE_MODE environment variable, default to True if not set
UPDATE_MOD="${UPDATE_MODE:-True}"
# Ensure log directory exists
mkdir -p $LOG_DIR

source $APP_PATH/venv/bin/activate
cd $APP_PATH/ingestion_scrapper
# Run scrapy with logging
scrapy crawl general -a update_mode=$UPDATE_MOD >> $LOG_DIR/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
