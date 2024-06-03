from flask import current_app
import psycopg2


def get_db():
    conn = psycopg2.connect(**current_app.config["DATABASE"])
    return conn.cursor()
