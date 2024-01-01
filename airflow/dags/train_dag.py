from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from docker.types import Mount
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
    'training_dag',
    default_args=default_args,
    description='Run train.sh and predict.sh all every month',
    schedule_interval='0 15 1 * *',
    start_date=datetime(2023, 12, 31),
    catchup=False,
)

# Training Task
training_task = DockerOperator(
    task_id='run_training_script',
    image='data_analysis',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}logs", target="/usr/src/app/logs", type="volume"),
        Mount(source=f"{project}sqlite-db", target="/usr/src/app/database", type="volume"),
        Mount(source=f"{project}ml-models", target="/usr/src/app/models", type="volume")
    ],
    environment={'SCRIPT_NAME': 'train.sh '},
    network_mode=f'{project}custom-network',
    dag=dag,
)

# Prediction Task
prediction_task = DockerOperator(
    task_id='run_prediction_script',
    image='data_analysis',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}logs", target="/usr/src/app/logs", type="volume"),
        Mount(source=f"{project}sqlite-db", target="/usr/src/app/database", type="volume"),
        Mount(source=f"{project}ml-models", target="/usr/src/app/models", type="volume")
    ],
    environment={'SCRIPT_NAME': 'predict.sh '},
    network_mode=f'{project}custom-network',
    dag=dag,
)

# Setting Task Dependencies
training_task >> prediction_task