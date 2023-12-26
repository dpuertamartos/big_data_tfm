#!/bin/bash
source /home/ubuntu/big_data_tfm/venv/bin/activate
cd /home/ubuntu/big_data_tfm/data_analysis/
python3.11 /home/ubuntu/big_data_tfm/data_analysis/train.py >> /home/ubuntu/Desktop/training_logs/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
