from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import uuid
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests


# Database setup
def init_db():
    conn = sqlite3.connect('automotive_parts.db')
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS parts (
        part_id TEXT PRIMARY KEY,
        part_name TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        production_date TEXT NOT NULL,
        quality_status TEXT NOT NULL,
        current_location TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()


# Generate unique part ID
def generate_part_id(prefix="PT"):
    unique_id = str(uuid.uuid4())[:8]
    return f"{prefix}-{unique_id}"


# Routes
@app.route('/api/parts', methods=['GET'])
def get_parts():
    conn = sqlite3.connect('automotive_parts.db')
    parts_df = pd.read_sql_query("SELECT * FROM parts", conn)
    conn.close()
    return jsonify(parts_df.to_dict(orient='records'))


@app.route('/api/parts', methods=['POST'])
def add_part():
    data = request.json
    part_id = generate_part_id()
    timestamp = datetime.datetime.now().isoformat()

    conn = sqlite3.connect('automotive_parts.db')
    c = conn.cursor()
    c.execute('''
    INSERT INTO parts (part_id, part_name, manufacturer, production_date, 
                     quality_status, current_location, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        part_id,
        data['part_name'],
        data['manufacturer'],
        data['production_date'],
        data['quality_status'],
        data['current_location'],
        timestamp
    ))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "part_id": part_id})


@app.route('/api/parts/<part_id>', methods=['GET'])
def get_part(part_id):
    conn = sqlite3.connect('automotive_parts.db')
    c = conn.cursor()
    c.execute("SELECT * FROM parts WHERE part_id = ?", (part_id,))
    part = c.fetchone()
    conn.close()

    if part:
        columns = ['part_id', 'part_name', 'manufacturer', 'production_date',
                   'quality_status', 'current_location', 'timestamp']
        part_dict = {columns[i]: part[i] for i in range(len(columns))}
        return jsonify(part_dict)
    else:
        return jsonify({"error": "Part not found"}), 404


@app.route('/api/parts/<part_id>', methods=['PUT'])
def update_part(part_id):
    data = request.json
    timestamp = datetime.datetime.now().isoformat()

    conn = sqlite3.connect('automotive_parts.db')
    c = conn.cursor()
    c.execute('''
    UPDATE parts 
    SET part_name = ?, manufacturer = ?, production_date = ?, 
        quality_status = ?, current_location = ?, timestamp = ?
    WHERE part_id = ?
    ''', (
        data['part_name'],
        data['manufacturer'],
        data['production_date'],
        data['quality_status'],
        data['current_location'],
        timestamp,
        part_id
    ))
    conn.commit()
    conn.close()

    return jsonify({"success": True})


@app.route('/api/search', methods=['GET'])
def search_parts():
    query = request.args.get('q', '')
    field = request.args.get('field', 'part_name')

    conn = sqlite3.connect('automotive_parts.db')
    c = conn.cursor()
    c.execute(f"SELECT * FROM parts WHERE {field} LIKE ?", (f'%{query}%',))
    parts = c.fetchall()
    conn.close()

    if parts:
        columns = ['part_id', 'part_name', 'manufacturer', 'production_date',
                   'quality_status', 'current_location', 'timestamp']
        result = []
        for part in parts:
            part_dict = {columns[i]: part[i] for i in range(len(columns))}
            result.append(part_dict)
        return jsonify(result)
    else:
        return jsonify([])


@app.route('/api/reports/summary', methods=['GET'])
def get_summary_report():
    conn = sqlite3.connect('automotive_parts.db')
    parts_df = pd.read_sql_query("SELECT * FROM parts", conn)
    conn.close()

    if parts_df.empty:
        return jsonify({
            "total_parts": 0,
            "manufacturers": [],
            "quality_status": {}
        })

    summary = {
        "total_parts": len(parts_df),
        "manufacturers": parts_df['manufacturer'].unique().tolist(),
        "quality_status": parts_df['quality_status'].value_counts().to_dict(),
        "locations": parts_df['current_location'].value_counts().to_dict()
    }

    return jsonify(summary)


if __name__ == '__main__':
    init_db()
    app.run(debug=True)