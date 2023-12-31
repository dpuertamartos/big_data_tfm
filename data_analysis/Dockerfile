# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Create a file with the WORKDIR path
RUN echo "/usr/src/app" > app_path.txt

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN python -m venv venv
RUN . venv/bin/activate && pip install --no-cache-dir -r ./requirements.txt
# Create a directory for the SQLite database and logs in case volume is not correctly provided
RUN mkdir database
RUN mkdir logs
RUN mkdir logs/training_logs
RUN mkdir logs/prediction_logs

# Grant execution rights on your scripts
RUN chmod +x ./train.sh
RUN chmod +x ./predict.sh

# Define an environment variable with a default script
ENV SCRIPT_NAME=prediction.sh
ENV SQL_URI=/usr/src/app/database/pisos.db
ENV MODE=new

# Run the specified script when the container launches
CMD ./$SCRIPT_NAME