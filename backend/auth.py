from flask import Blueprint, jsonify, request
import psycopg2
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import (
    create_access_token,
)

from .db import get_cursor


authbp = Blueprint("auth", __name__, url_prefix="/auth")


@authbp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Could not verify!"}), 401

    with get_cursor() as cur:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

    stored_password_hash = user[3]
    if not user or not check_password_hash(stored_password_hash, password):
        return jsonify({"error": "Invalid email or password!"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"email": email, "access_token": access_token})


@authbp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password or not name:
        return jsonify({"error": "Email and password are required!"}), 400

    hashed_password = generate_password_hash(password)

    # Is the user invited?
    try:
        with get_cursor() as cur:
            cur.execute("SELECT email FROM users WHERE email=%s;", (email))
            if not cur.fetchone():
                return (
                    jsonify(
                        {"error": f"User with email {email} has not been invited yet"}
                    ),
                    401,
                )

    except psycopg2.Error as e:
        return jsonify({"error": "An error occurred: {}".format(str(e))}), 500

    # Yes -> update the user info with the actual values
    try:
        with get_cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET
                name = %s
                email = %s
                password = %s
                role = 'Member'
                active = TRUE
                """,
                (name, email, hashed_password),
            )
            cur.connection.commit()
        access_token = create_access_token(identity=email)
        return jsonify({"email": email, "access_token": access_token}), 201
    except psycopg2.IntegrityError:
        return jsonify({"error": "Email already exists!"}), 400
    except psycopg2.Error as e:
        return jsonify({"error": "An error occurred: {}".format(str(e))}), 500


@authbp.route("/invite", methods=["POST"])
def invite():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required!"}), 400

    try:
        with get_cursor() as cur:
            cur.execute(
                "INSERT INTO users (email) VALUES (%s)",
                (email),
            )
            cur.connection.commit()
        return jsonify({"email": email}), 201
    except psycopg2.IntegrityError:
        return jsonify({"error": "Email already exists!"}), 400
    except psycopg2.Error as e:
        return jsonify({"error": "An error occurred: {}".format(str(e))}), 500
