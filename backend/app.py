from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)

app.config['DATABASE'] = {
    'host': 'db',
    'port': '5432',
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'postgres'
}

def get_db():
    conn = psycopg2.connect(**app.config['DATABASE'])
    return conn.cursor()

@app.route('/test')
def test():
    return jsonify(success=True)

@app.route('/companies', methods=['GET'])
def list_companies():
    cur = get_db()
    cur.execute('SELECT name FROM company')
    companies = cur.fetchall()
    cur.close()
    return jsonify({'companies': [company[0] for company in companies]})

@app.route('/companies', methods=['POST'])
def add_company():
    data = request.json
    name = data.get('name')
    abbreviation = data.get('abbreviation')
    website = data.get('website')
    if not name or not website:
        return jsonify({'error': 'Name and website are required'}), 400
    
    try:
        cur = get_db()
        cur.execute('INSERT INTO company (name, abbreviation, website) VALUES (%s, %s, %s)', 
                    (name, abbreviation, website))
        cur.connection.commit()
        cur.close()
        return jsonify({'message': 'Company added successfully'}), 201
    except psycopg2.IntegrityError as e:
        return jsonify({'error': 'Company with this name already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/company/<string:company_name>')
def get_company_info(company_name):
    cur = get_db()
    cur.execute('''
        SELECT c.name, m.address, co.type, co.contact
        FROM company c
        LEFT JOIN morada m ON c.company_id = m.company_id
        LEFT JOIN contact co ON c.company_id = co.company_id
        WHERE c.name = %s
    ''', (company_name,))
    company_data = cur.fetchall()
    cur.close()

    if not company_data:
        return jsonify({'error': 'Company not found'}), 404

    company_info = {
        'name': company_data[0][0],
        'addresses': list(set([address[1] for address in company_data if address[1]])),
        'contacts': [{'type': contact[2], 'value': contact[3]} for contact in company_data if contact[2] and contact[3]]
    }
    return jsonify(company_info)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Could not verify!'}), 401

    conn = psycopg2.connect(**app.config['DATABASE'])
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user or not check_password_hash(user[1], password):
        return jsonify({'error': 'Invalid email or password!'}), 401

    access_token = create_access_token(identity=email)
    return jsonify({'access_token': access_token})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
