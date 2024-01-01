from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from docker.types import Mount

project = 'big_data_tfm'

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'INITIAL_INGESTION_DAG',
    default_args=default_args,
    description='Manually run the first launch of the process. First ingestion, transformation, aggregation, training and prediction',
    schedule_interval=None,  # This DAG will not be scheduled automatically
    start_date=datetime(2023, 9, 23),
    catchup=False,
)

# Ingestion Task
ingestion_task = DockerOperator(
    task_id='run_ingestion_script',
    image='scraper',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}_logs", target="/usr/src/app/logs", type="volume")
    ],
    environment={
        'SCRIPT_NAME': 'ingestion_script.sh ',
        'UPDATE_MODE': 'False'
    },
    network_mode=f'{project}_custom-network',
    dag=dag,
)

