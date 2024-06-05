from flask import current_app, g
from contextlib import contextmanager
import psycopg2


def get_db() -> psycopg2.extensions.connection:
    db = getattr(g, "_db", None)
    if db is None:
        db = g._db = psycopg2.connect(**current_app.config["DATABASE"])
    return db


@contextmanager
def get_cursor():
    cursor = get_db().cursor()
    try:
        yield cursor
    finally:
        cursor.close()
