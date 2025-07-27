import psycopg2
import os

conn = psycopg2.connect(os.environ['DATABASE_URL'])
cur = conn.cursor()
schema = os.environ.get('SCHEMA', 'yelp_schema')

# Create tables directly with SQL
cur.execute(f'CREATE SCHEMA IF NOT EXISTS {schema}')

# Drop tables in correct order (reverse dependency order)
cur.execute(f'DROP TABLE IF EXISTS {schema}.review_images CASCADE')
cur.execute(f'DROP TABLE IF EXISTS {schema}.reviews CASCADE')
cur.execute(f'DROP TABLE IF EXISTS {schema}.business_images CASCADE')
cur.execute(f'DROP TABLE IF EXISTS {schema}.business_categories CASCADE')
cur.execute(f'DROP TABLE IF EXISTS {schema}.businesses CASCADE')
cur.execute(f'DROP TABLE IF EXISTS {schema}.users CASCADE')
cur.execute(f'DROP TABLE IF EXISTS {schema}.categories CASCADE')

# Create all tables
cur.execute(f'''
CREATE TABLE {schema}.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')

cur.execute(f'''
CREATE TABLE {schema}.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(40) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')

cur.execute(f'''
CREATE TABLE {schema}.businesses (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES {schema}.users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(255),
    email VARCHAR(100),
    price_range INTEGER,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    hours_monday VARCHAR(50),
    hours_tuesday VARCHAR(50),
    hours_wednesday VARCHAR(50),
    hours_thursday VARCHAR(50),
    hours_friday VARCHAR(50),
    hours_saturday VARCHAR(50),
    hours_sunday VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')

cur.execute(f'''
CREATE TABLE {schema}.business_categories (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES {schema}.businesses(id),
    category_id INTEGER REFERENCES {schema}.categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(business_id, category_id)
)''')

cur.execute(f'''
CREATE TABLE {schema}.business_images (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES {schema}.businesses(id),
    uploaded_by_user_id INTEGER REFERENCES {schema}.users(id),
    image_url VARCHAR(255) NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')

cur.execute(f'''
CREATE TABLE {schema}.reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES {schema}.users(id),
    business_id INTEGER REFERENCES {schema}.businesses(id),
    rating INTEGER NOT NULL,
    title VARCHAR(100),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')

cur.execute(f'''
CREATE TABLE {schema}.review_images (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES {schema}.reviews(id),
    uploaded_by_user_id INTEGER REFERENCES {schema}.users(id),
    image_url VARCHAR(255) NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')

conn.commit()
conn.close()
print("All tables created successfully!")
