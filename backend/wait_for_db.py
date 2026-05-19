import socket
import os
import time
from urllib.parse import urlparse

def wait_for_db():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("No DATABASE_URL found, skipping wait.")
        return

    url = urlparse(db_url)
    host = url.hostname
    port = url.port or 5432

    print(f"Waiting for database at {host}:{port}...")
    
    retries = 30
    while retries > 0:
        try:
            with socket.create_connection((host, port), timeout=1):
                print("Database is ready!")
                return
        except (socket.error, socket.timeout):
            retries -= 1
            print(f"Database not ready yet... ({retries} retries left)")
            time.sleep(1)
    
    print("Could not connect to database. Exiting.")
    exit(1)

if __name__ == "__main__":
    wait_for_db()
