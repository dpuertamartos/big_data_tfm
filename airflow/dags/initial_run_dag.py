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
    'initial_dag',
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
        Mount(source=f"{project}logs", target="/usr/src/app/logs", type="volume")
    ],
    environment={
        'SCRIPT_NAME': 'ingestion_script.sh ',
        'UPDATE_MODE': 'False'
    },
    network_mode=f'{project}custom-network',
    dag=dag,
)

# Transformation Task
transformation_task = DockerOperator(
    task_id='run_transformation_script',
    image='etl',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}logs", target="/usr/src/app/logs", type="volume"),
        Mount(source=f"{project}sqlite-db", target="/usr/src/app/database", type="volume")
    ],
    environment={'SCRIPT_NAME': 'transformation_script.sh '},
    network_mode=f'{project}custom-network',
    dag=dag,
)

# Aggregation Task
aggregation_task = DockerOperator(
    task_id='run_aggregation_script',
    image='etl',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}logs", target="/usr/src/app/logs", type="volume"),
        Mount(source=f"{project}sqlite-db", target="/usr/src/app/database", type="volume")
    ],
    environment={'SCRIPT_NAME': 'aggregation_script.sh '},
    network_mode=f'{project}custom-network',
    dag=dag,
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

ingestion_task >> transformation_task >> aggregation_task >> training_task >> prediction_task