
#!/bin/bash
set -e

BUCKET_NAME="doc-route-bucket"

if ! awslocal s3 ls | grep -q "$BUCKET_NAME"; then
  echo "Creating S3 bucket: $BUCKET_NAME"
  awslocal s3 mb s3://$BUCKET_NAME
else
  echo "Bucket already exists: $BUCKET_NAME"
fi
