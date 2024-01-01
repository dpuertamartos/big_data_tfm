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
    'mongo_backup_dag',
    default_args=default_args,
    description='Backup MongoDB every 3 days',
    schedule_interval='0 2 */3 * *',
    start_date=datetime(2023, 9, 23),
    catchup=False,
)

mongo_backup_task = DockerOperator(
    task_id='mongo_backup',
    image='mongo:latest',  # Imagen de MongoDB
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    mounts=[
        Mount(source=f"{project}_mongodb-data", target="/data/db", type="volume"),
        Mount(source=f"{project}_mongodb-backups", target="/backups", type="volume"),
    ],
    command='sh -c "mongodump --host mongodb-container --port 27017 --out=/tmp/mongo_backup && tar -czvf /backups/mongo_backup_$(date +\\"%Y%m%d\\").tar.gz -C /tmp mongo_backup && rm -rf /tmp/mongo_backup"',  # Comando de backup
    network_mode=f'{project}_custom-network',
    dag=dag,
)

mongo_backup_task
