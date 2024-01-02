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
RUN mkdir logs
RUN mkdir logs/ingestion_logs
RUN mkdir logs/checking_logs
# Define environment variable
# ENV NAME Value

# Grant execution rights on your scripts
RUN chmod +x ./ingestion_scrapper/ingestion_script.sh
RUN chmod +x ./ingestion_scrapper/ad_up_checking_script.sh

# Define an environment variable with a default script
ENV SCRIPT_NAME=ingestion_script.sh
ENV UPDATE_MODE=True

# Run the specified script when the container launches
CMD ./ingestion_scrapper/$SCRIPT_NAME