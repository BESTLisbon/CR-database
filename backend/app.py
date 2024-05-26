from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

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

@app.route('/companies')
def list_companies():
    cur = get_db()
    cur.execute('SELECT name FROM company')
    companies = cur.fetchall()
    cur.close()
    return jsonify({'companies': [company[0] for company in companies]})

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
