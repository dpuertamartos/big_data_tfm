from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'ingestion_dag',
    default_args=default_args,
    description='Run ingestion_script.sh at 10:00 and 22:00 daily',
    schedule_interval='0 10,22 * * *',  # Set to run at both 10:00 and 22:00
    start_date=datetime(2023, 9, 23),
    catchup=False,
)

run_script = BashOperator(
    task_id='run_ingestion_script',
    bash_command="home/ubuntu/big_data_tfm/ingestion_scrapper/ingestion_scrapper/ingestion_script.sh ",
    dag=dag,
)
