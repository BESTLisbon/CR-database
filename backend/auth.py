from flask import Blueprint, jsonify, request
import psycopg2
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import (
    create_access_token,
)

from .db import get_db


authbp = Blueprint("auth", __name__, url_prefix="/auth")


@authbp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Could not verify!"}), 401

    cur = get_db()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    stored_password_hash = user[3]
    if not user or not check_password_hash(stored_password_hash, password):
        return jsonify({"error": "Invalid email or password!"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"access_token": access_token})


@authbp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    hashed_password = generate_password_hash(password)

    try:
        cur = get_db()
        cur.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s)",
            (email, hashed_password),
        )
        cur.connection.commit()
        cur.close()
        return jsonify({"message": "User registered successfully!"}), 201
    except psycopg2.IntegrityError:
        return jsonify({"error": "Email already exists!"}), 400
    except Exception as e:
        return jsonify({"error": "An error occurred: {}".format(str(e))}), 500
