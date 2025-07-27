FROM python:3.9.18-alpine3.18

RUN apk add build-base

RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .

RUN python -c "
import os
import psycopg2
try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute('DELETE FROM alembic_version')
    cur.execute(\"INSERT INTO alembic_version (version_num) VALUES ('d7084aac5330')\")
    conn.commit()
    conn.close()
    print('Database reset successful')
except Exception as e:
    print(f'Database reset failed: {e}')
"
RUN flask db upgrade d7084aac5330
RUN flask db upgrade bc5fb14b4bbc
RUN flask seed all
CMD gunicorn app:app
