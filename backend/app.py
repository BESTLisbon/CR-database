from datetime import timedelta
from flask import Flask, g, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required
import psycopg2
from flask_cors import CORS
from .db import get_cursor
from .auth import authbp

app = Flask(__name__)
app.register_blueprint(authbp)
app.config["JWT_SECRET_KEY"] = "secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)
CORS(app)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_db", None)
    if db is not None:
        db.close()


app.config["DATABASE"] = {
    "host": "db",
    "port": "5432",
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
}


@app.route("/companies", methods=["GET"])
@jwt_required()
def list_companies():
    with get_cursor() as cur:
        cur.execute("SELECT name FROM company")
        companies = cur.fetchall()
    
    return jsonify({"companies": [company[0] for company in companies]})


@app.route("/companies", methods=["POST"])
@jwt_required()
def add_company():
    data = request.json
    name = data.get("name")
    abbreviation = data.get("abbreviation")
    website = data.get("website")
    if not name or not website:
        return jsonify({"error": "Name and website are required"}), 400

    try:
        with get_cursor() as cur:
            cur.execute(
                "INSERT INTO company (name, abbreviation, website) VALUES (%s, %s, %s)",
                (name, abbreviation, website),
            )
            cur.connection.commit()
        return jsonify({"message": "Company added successfully"}), 201
    except psycopg2.IntegrityError as e:
        return jsonify({"error": "Company with this name already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/company/<string:company_name>")
@jwt_required()
def get_company_info(company_name):
    with get_cursor() as cur:
        cur.execute(
            """
            SELECT c.name, m.address, co.type, co.contact
            FROM company c
            LEFT JOIN morada m ON c.company_id = m.company_id
            LEFT JOIN contact co ON c.company_id = co.company_id
            WHERE c.name = %s
        """,
            (company_name,),
        )
        company_data = cur.fetchall()

    if not company_data:
        return jsonify({"error": "Company not found"}), 404

    company_info = {
        "name": company_data[0][0],
        "addresses": list(set([address[1] for address in company_data if address[1]])),
        "contacts": [
            {"type": contact[2], "value": contact[3]}
            for contact in company_data
            if contact[2] and contact[3]
        ],
    }
    return jsonify(company_info)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
