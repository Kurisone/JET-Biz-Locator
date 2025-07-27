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

RUN python -c "import psycopg2,os; c=psycopg2.connect(os.environ['DATABASE_URL']); c.cursor().execute('DELETE FROM alembic_version'); c.cursor().execute(\"INSERT INTO alembic_version VALUES ('d7084aac5330')\"); c.commit(); c.close()"
RUN flask db upgrade d7084aac5330
RUN flask db upgrade bc5fb14b4bbc
RUN flask seed all
CMD gunicorn app:app
