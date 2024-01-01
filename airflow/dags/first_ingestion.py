from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'test_ingestion_dag',
    default_args=default_args,
    description='Manually run ingestion_script.sh',
    schedule_interval=None,  # This DAG will not be scheduled automatically
    start_date=datetime(2023, 9, 23),
    catchup=False,
)

# Ingestion Task
ingestion_task = DockerOperator(
    task_id='run_ingestion_script',
    image='scraper-container',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    environment={
        'SCRIPT_NAME': 'ingestion_script.sh',
        'UPDATE_MODE': 'False'
    },
    network_mode='custom-network',
    dag=dag,
)

