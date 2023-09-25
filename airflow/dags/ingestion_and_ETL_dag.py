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
    'ingestion_transformation_dag',
    default_args=default_args,
    description='Run ingestion_script.sh and transformation_script.sh at 10:00 and 22:00 daily',
    schedule_interval='0 10,22 * * *',
    start_date=datetime(2023, 9, 23),
    catchup=False,
)

# Ingestion Task
ingestion_task = BashOperator(
    task_id='run_ingestion_script',
    bash_command="/home/ubuntu/big_data_tfm/ingestion_scrapper/ingestion_scrapper/ingestion_script.sh ",
    dag=dag,
)

# Transformation Task
transformation_task = BashOperator(
    task_id='run_transformation_script',
    bash_command="/home/ubuntu/big_data_tfm/ETL/transformation_script.sh ",
    dag=dag,
)

# Setting Task Dependencies
ingestion_task >> transformation_task  # Run transformation_task after ingestion_task completes
