from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from config import project

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'mongo_backup_dag',
    default_args=default_args,
    description='Run mongo_backup_script.sh every 3 days at 02:00',
    schedule_interval='0 2 */3 * *',
    start_date=datetime(2023, 9, 23),
    catchup=False,
)

run_script = BashOperator(
    task_id='run_mongo_backup',
    bash_command='/home/ubuntu/big_data_tfm/ingestion_scrapper/mongodb/mongo_backup_script.sh >> /home/ubuntu/Desktop/backup_logs/cron_log_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1',
    dag=dag,
)
