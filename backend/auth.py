from functools import wraps
from flask import Blueprint, current_app, jsonify, request
import psycopg2
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

from .user import User

from .db import get_cursor


authbp = Blueprint("auth", __name__, url_prefix="/auth")


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        with get_cursor() as cur:
            cur.execute("SELECT role FROM users WHERE email=%s;", (identity,))
            role = cur.fetchone()

        if not role or role[0] != "Admin":
            return jsonify({"msg": "Admin privileges required!"}), 401
        return fn(args, kwargs)

    return wrapper


def coordie_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        with get_cursor() as cur:
            cur.execute("SELECT role FROM users WHERE email=%s;", (identity,))
            role = cur.fetchone()

        if not role or role[0] not in ["Admin", "Coordie"]:
            return jsonify({"msg": "Coordie privileges required!"}), 401
        return fn(args, kwargs)

    return wrapper


@authbp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Invalid email or password!"}), 401

    with get_cursor() as cur:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

    stored_password_hash = user[3]
    if not user or not check_password_hash(stored_password_hash, password):
        return jsonify({"error": "Invalid email or password!"}), 401

    user = User.user_from_query(user)
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    return jsonify(
        {
            "user": user.to_dict(),
            "auth": {
                "accessToken": access_token,
                "refreshToken": refresh_token,
            },
        }
    )


@authbp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password or not name:
        return jsonify({"error": "Please provide all the fields required"}), 400

    if not User.valid_password(password):
        return jsonify({"error": "Invalid password"}), 400

    if not User.valid_email(email):
        return jsonify({"error": "Invalid email"}), 400

    if not User.valid_name(name):
        return jsonify({"error": "Invalid name"}), 400

    hashed_password = generate_password_hash(password)

    # Is the user invited?
    try:
        with get_cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email=%s;", (email,))
            user = cur.fetchone()
            if not user:  # Is not invited
                return (
                    jsonify(
                        {"error": f"User with email {email} has not been invited yet"}
                    ),
                    401,
                )
            if user[-1]:  # Is already active
                return (
                    jsonify(
                        {
                            "error": f"User with email {email} has already been registered"
                        }
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
                SET name=%s, password=%s, role='Member', active=TRUE
                WHERE email=%s;
                """,
                (name, hashed_password, email),
            )
            cur.connection.commit()
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        user = User.user_from_register_form(email, name)
        return (
            jsonify(
                {
                    "user": user.to_dict(),
                    "auth": {
                        "accessToken": access_token,
                        "refreshToken": refresh_token,
                    },
                }
            ),
            201,
        )
    except psycopg2.Error as e:
        return jsonify({"error": "An error occurred: {}".format(str(e))}), 500


@authbp.route("/invite", methods=["POST"])
@coordie_required
def invite():
    data = request.json
    email = data.get("email")
    current_app.logger.info(email)

    if not email:
        return jsonify({"error": "Email is required!"}), 400

    if not User.valid_email(email):
        return jsonify({"error": "Invalid email address!"}), 400

    try:
        with get_cursor() as cur:
            cur.execute(
                "INSERT INTO users (email) VALUES (%s)",
                (email,),
            )
            cur.connection.commit()
        return jsonify({"email": email}), 200
    except psycopg2.IntegrityError:
        return jsonify({"error": "Email already invited!"}), 400
    except psycopg2.Error as e:
        return jsonify({"error": "An error occurred: {}".format(str(e))}), 500


@authbp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)
