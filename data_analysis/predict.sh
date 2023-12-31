#!/bin/bash
APP_PATH=$(cat app_path.txt)
LOG_DIR="$APP_PATH/logs/prediction_logs"
# Ensure log directory exists
mkdir -p $LOG_DIR

# Activate the virtual environment and change to folder
source $APP_PATH/venv/bin/activate
# Run the Python script with the specified mode
python3.11 $APP_PATH/generate_predictions.py --mode $MODE >> $LOG_DIR/prediction_logs/cron_log_$(date +%Y%m%d%H%M%S).log 2>&1
