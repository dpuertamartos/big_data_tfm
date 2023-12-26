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
    'training_dag',
    default_args=default_args,
    description='Run train.sh and predict.sh all every month',
    schedule_interval='0 15 1 * *',
    start_date=datetime(2023, 12, 31),
    catchup=False,
)

# Prediction Task
training_task = BashOperator(
    task_id='run_training_script',
    bash_command="/home/ubuntu/big_data_tfm/data_analysis/train.sh",
    dag=dag,
)

# Prediction Task
prediction_task = BashOperator(
    task_id='run_prediction_script',
    bash_command="/home/ubuntu/big_data_tfm/data_analysis/predict.sh new",
    dag=dag,
)

# Setting Task Dependencies
training_task >> prediction_task