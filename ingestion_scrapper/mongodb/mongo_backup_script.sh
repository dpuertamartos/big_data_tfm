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

tar -czvf "$BASE_DIR/$SUBFOLDER.tar.gz" -C "$BASE_DIR" "$SUBFOLDER"

# Check if the tar command was successful

if [ $? -eq 0 ]; then

    # Remove the non-compressed backup folder
    rm -rf "$BASE_DIR/$SUBFOLDER"
    echo "Backup compressed and original folder removed successfully."

else

    echo "Error in compressing backup, original folder not removed."

fi
