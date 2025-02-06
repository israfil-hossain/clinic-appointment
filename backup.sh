#!/bin/bash

# Source environment variables
source /app/.env

# Define the backup directory
BACKUP_DIR="/app/mongo-backup-data"
DATE=$(date +"%Y-%m-%d-%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.tar.gz"

# Create the backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run the MongoDB backup using mongodump
mongodump --uri="$MONGO_URI" --archive="$BACKUP_FILE" --gzip

# Check and log the result
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
else
  echo "Backup failed"
  exit 1
fi