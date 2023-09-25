#!/bin/bash
source /home/ubuntu/big_data_tfm/venv/bin/activate
python3.11 /home/ubuntu/big_data_tfm/ETL/main.py --sql_uri=/home/ubuntu/Desktop/pisos.db >> /home/ubuntu/Desktop/ETL_logs/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1
