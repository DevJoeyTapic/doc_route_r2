from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    bucket_name = "doc-route-bucket"
    location = "invoices/pdfs"  # subdirectory inside the bucket
    default_acl = "public-read"
    custom_domain = f"localhost:4566/{bucket_name}"

    # Use container hostname instead of localhost
    endpoint_url = "http://doc_localstack:4566"

    @property
    def custom_domain(self):
        # Force Django to generate working URLs
        return f"http://localhost:4566/{self.bucket_name}"