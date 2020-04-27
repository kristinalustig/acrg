import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

info = urlparse(os.getenv('DATABASE_URL'))

username = info.username
password = info.password
database = info.path[1:]
hostname = info.hostname
c = psycopg2.connect(
    database = database,
    user = username,
    password = password,
    host = hostname
)