import os
from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    bucket_name = "doc-route-bucket"
    location = "invoices/pdfs"  # subdirectory inside the bucket
    default_acl = "public-read"
     # Use environment variable to switch between Docker and host
    endpoint_url = os.getenv("AWS_S3_ENDPOINT_URL", "http://localhost:4566")

    # Use container hostname instead of localhost
    endpoint_url = "http://doc_localstack:4566"

    @property
    def custom_domain(self):
        # Force Django to generate working URLs
        return f"http://localhost:4566/{self.bucket_name}"