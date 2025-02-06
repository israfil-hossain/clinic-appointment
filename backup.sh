#!/bin/sh
# backup.sh
# This script will back up the MongoDB database to a file

# Define backup file location
BACKUP_DIR="/backups"
BACKUP_FILE="${BACKUP_DIR}/backup_$(date +\%Y-\%m-\%d_\%H-\%M).gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run the backup using `mongodump`
mongodump --uri=$MONGO_URI --archive=$BACKUP_FILE --gzip

# Print a success message
echo "MongoDB backup completed at $BACKUP_FILE"
