#!/bin/bash

# Set variables
HOST="localhost"
PORT="27017"
BASE_DIR="/home/ubuntu/Desktop/backups_mongo/"
# Generate the subfolder name in the format YYYYMMDD

SUBFOLDER=$(date +"%Y%m%d")

# Run mongodump command and save to the subfolder

mongodump --host $HOST --port $PORT --out "$BASE_DIR/$SUBFOLDER"
# Print message to confirm backup was created

echo "MongoDB backup created at $BASE_DIR/$SUBFOLDER on $(date)"
