### Configuration of airflow server

### Pre-requisites

They were performed as pip install apache-airflow was crashing

`sudo apt-get update`
`sudo apt-get install python3.11-dev`
`sudo apt-get install build-essential`

Install airflow in the virtual enviroment `source /home/ubuntu/big_data_tfm/venv/bin/activate`

`pip install apache-airflow`

### Airflow configuration and first launch

1. `airflow db init`

2. `airflow users create \
    --username admin \
    --firstname YOUR_FIRSTNAME \
    --lastname YOUR_LASTNAME \
    --role Admin \
    --email admin@example.com`

3. `airflow webserver -p 8080`

4. `airflow scheduler`

5. move dags in /big_data_tfm/airflow/dags to /home/ubuntu/airflow/dags 


### Stablish airflow as a service 

1. copy content of /big_data_tfm/airflow/systemd_services/airflow-webserver.service

`sudo nano /etc/systemd/system/airflow-webserver.service`

2. copy content of /big_data_tfm/airflow/systemd_services/airflow-scheduler.service

`sudo nano /etc/systemd/system/airflow-scheduler.service`

3. reload systemd `sudo systemctl daemon-reload`

4. start the services `sudo systemctl start airflow-webserver.service` `sudo systemctl start airflow-scheduler.service`

5. enable them on system start `sudo systemctl enable airflow-webserver.service` `sudo systemctl enable airflow-scheduler.service`

### Accessing web interface

When both services are active and running open browser and load http://0.0.0.0:8080
