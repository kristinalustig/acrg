import json
import os
import io
from data.db import c
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

db = c.cursor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', methods=['GET'])
def items_get():

    query = request.args.get('search','')
    cursor = c.cursor()

    if len(query) > 0:
        continue
    else:
        cursor.execute("""
            SELECT
                id,
                name,
                type,
                subtype,
                notes,
                is_recipe,
                has_recipe,
                sell_price,
                cost,
                cost_currency,
                time_start,
                time_end,
                months_available
            FROM
                items
        """)
        items = cursor.fetchall()
        c.commit()

    formatted_results = lambda i: {
        'id':i[0],
        'name':i[1],
        'type':i[2],
        'subtype':i[3],
        'notes':i[4],
        'is_recipe':i[5],
        'has_recipe':i[6],
        'sell_price':i[7],
        'cost':i[8],
        'cost_currency':i[9],
        'time_start':i[10],
        'time_end':i[11],
        'months_available':i[12]
    }

    items_to_return = list(map(formatted_results, items))

    return jsonify(items_to_return), 200

@app.route('/initialize')
def initialize_db():

    acdata = open('data/acdata.json')
    JSON = json.load(acdata)

    with c as conn:
        cursor = conn.cursor()
        cursor.execute(open("data/schema.sql", "r").read())
        conn.commit()
    
    for item in JSON['items']:
        db.execute("""
            INSERT INTO
                items (name, type, subtype, notes, is_recipe, has_recipe, sell_price, cost, cost_currency, time_start, time_end, months_available)
            VALUES
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (item['name'], item['type'], item['subtype'], item['notes'], item['is_recipe'], item['has_recipe'], item['sell_price'], item['cost'],item['cost_currency'], item['time_start'], item['time_end'], item['months_available']))
        c.commit()

    return "you did it!", 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
