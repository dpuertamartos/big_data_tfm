#!/bin/bash
APP_PATH=$(cat app_path.txt)
LOG_DIR="$APP_PATH/logs/ETL_logs"

# Ensure log directory exists
mkdir -p $LOG_DIR

source $APP_PATH/venv/bin/activate
python3.11 $APP_PATH/main.py --sql_uri=${SQL_URI:-database/pisos.db} >> $LOG_DIR/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
