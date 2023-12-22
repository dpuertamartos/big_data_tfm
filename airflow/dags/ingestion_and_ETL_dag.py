from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.operators.python_operator import BranchPythonOperator
from airflow.utils.dates import days_ago

def _choose_task_to_run():
    current_hour = datetime.now().hour
    if current_hour < 15:  # Assuming 10:00 run is the first run of the day
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

# Branching Task
branch_task = BranchPythonOperator(
    task_id='branch_task',
    python_callable=_choose_task_to_run,
    dag=dag,
)

# Checking Deletes Task (run only once per day)
checking_deletes_task = BashOperator(
    task_id='run_checking_deletes_task',
    bash_command="/home/ubuntu/big_data_tfm/ingestion_scrapper/ingestion_scrapper/ad_up_checking_script.sh ",
    dag=dag,
)

# Transformation Task
transformation_task = BashOperator(
    task_id='run_transformation_script',
    bash_command="/home/ubuntu/big_data_tfm/ETL/transformation_script.sh ",
    dag=dag,
)

# Setting Task Dependencies
ingestion_task >> branch_task
branch_task >> checking_deletes_task >> transformation_task
branch_task >> transformation_task

