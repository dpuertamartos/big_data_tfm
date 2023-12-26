#!/bin/bash

# Check if the mode is provided as an argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 [all|new]"
    exit 1
fi

MODE=$1

# Activate the virtual environment and change to folder
source /home/ubuntu/big_data_tfm/venv/bin/activate
cd /home/ubuntu/big_data_tfm/data_analysis/

# Run the Python script with the specified mode
python3.11 /home/ubuntu/big_data_tfm/data_analysis/generate_predictions.py --mode $MODE >> /home/ubuntu/Desktop/prediction_logs/cron_log_$(date +%Y%m%d%H%M%S).log 2>&1
