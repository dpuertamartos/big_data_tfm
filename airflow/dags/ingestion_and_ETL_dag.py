from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.docker_operator import DockerOperator
from airflow.operators.python_operator import BranchPythonOperator
from airflow.utils.trigger_rule import TriggerRule
from docker.types import Mount
from config import project


def _choose_task_to_run():
    current_hour = datetime.now().hour
    if current_hour < 15:
        return 'run_checking_deletes_task'
    else:
        return 'run_transformation_script'


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
    description='Run ingestion and transformation at 10:00 and 22:00 daily',
    schedule_interval='0 10,22 * * *',
    start_date=datetime(2023, 9, 23),
    catchup=False,
)

# Ingestion Task
ingestion_task = DockerOperator(
    task_id='run_ingestion_script',
    image=f'{project}-scraper',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}_logs", target="/usr/src/app/logs", type="volume")
    ],
    environment={
        'SCRIPT_NAME': 'ingestion_script.sh ',
        'UPDATE_MODE': 'True'
    },
    network_mode=f'{project}_custom-network',
    dag=dag,
)

# Branching Task
branch_task = BranchPythonOperator(
    task_id='branch_task',
    python_callable=_choose_task_to_run,
    dag=dag,
)

# Checking Deletes Task
checking_deletes_task = DockerOperator(
    task_id='run_checking_deletes_task',
    image=f'{project}-scraper',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}_logs", target="/usr/src/app/logs", type="volume")
    ],
    environment={'SCRIPT_NAME': 'ad_up_checking_script.sh '},
    network_mode=f'{project}_custom-network',
    dag=dag,
)

# Transformation Task
transformation_task = DockerOperator(
    task_id='run_transformation_script',
    image=f'{project}-etl',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}_logs", target="/usr/src/app/logs", type="volume"),
        Mount(source=f"{project}_sqlite-db", target="/usr/src/app/database", type="volume")
    ],
    environment={'SCRIPT_NAME': 'transformation_script.sh '},
    trigger_rule=TriggerRule.ONE_SUCCESS,
    network_mode=f'{project}_custom-network',
    dag=dag,
)

# Aggregation Task
aggregation_task = DockerOperator(
    task_id='run_aggregation_script',
    image=f'{project}-etl',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}_logs", target="/usr/src/app/logs", type="volume"),
        Mount(source=f"{project}_sqlite-db", target="/usr/src/app/database", type="volume")
    ],
    environment={'SCRIPT_NAME': 'aggregation_script.sh '},
    network_mode=f'{project}_custom-network',
    dag=dag,
)

# Prediction Task
prediction_task = DockerOperator(
    task_id='run_prediction_script',
    image=f'{project}-data_analysis',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}_logs", target="/usr/src/app/logs", type="volume"),
        Mount(source=f"{project}_sqlite-db", target="/usr/src/app/database", type="volume"),
        Mount(source=f"{project}_ml-models", target="/usr/src/app/models", type="volume")
    ],
    environment={'SCRIPT_NAME': 'predict.sh '},
    network_mode=f'{project}_custom-network',
    dag=dag,
)

# Setting Task Dependencies
ingestion_task >> branch_task
branch_task >> [checking_deletes_task, transformation_task]
checking_deletes_task >> transformation_task
transformation_task >> aggregation_task >> prediction_task

