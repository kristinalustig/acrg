import json
import os
import io
from data.db import c
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

db = c.cursor()

canonical_itemtypes = ['Clothing','Consumable','Decor','Currency','Fish','Forage','Fossil','Handheld','Insect','Mineral','Music','Award']
month_bitmasks = [0b000000000001,0b000000000010,0b000000000100,0b000000001000,0b000000010000,0b000000100000,0b000001000000,0b000010000000,0b000100000000,0b001000000000,0b010000000000,0b100000000000]
months = ["J","F","M","A","M","J","J","A","S","O","N","D"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/items', methods=['GET'])
def items_get():
    global canonical_itemtypes
    global month_bitmasks
    global months

    query = request.args.get('search','')
    itemtype = tuple(request.args.getlist('type[]'))
    subtype = tuple(request.args.getlist('subtype[]'))
    sort_method = request.args.get('sort','')
    sort_direction = request.args.get('dir','')
    timeofday = request.args.get('time','')
    timeofyear = request.args.get('month','')
    page = request.args.get('page','')

    cursor = c.cursor()

    if len(itemtype) == 0:
        itemtype = tuple(canonical_itemtypes)
    else:
        itemtype = tuple(map(lambda x:x.capitalize(), itemtype))

    print(itemtype)
    
    #FILTERING BEGINS HERE
    sqlquery = """
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
        WHERE
            type IN %s"""
    paramtuple = (itemtype,)

    if len(query) != 0:
        sqlquery += """
            AND position(LOWER(%s)in LOWER(name))>0"""
        paramtuple += (query,)
        
    if len(subtype) != 0:
        sqlquery += """
            AND subtype IN %s"""
        paramtuple += (subtype,)
    
    if len(timeofday) != 0:
        timeofday = int(timeofday)
        sqlquery += """
            AND CASE 
                    WHEN time_start < time_end THEN 
                        (time_start <= %s AND time_end >= %s)
                    ELSE 
                        (time_start <= %s OR %s <= time_end)
                END"""
        paramtuple += (timeofday, timeofday, timeofday,  timeofday)

    if len(timeofyear) != 0:
        timeofyear = int(timeofyear)
        bitmask = month_bitmasks[timeofyear-1]
        sqlquery += """
            AND (CAST(months_available AS INTEGER) & %s) > 0"""
        paramtuple += (bitmask,)
    
    # SORTING STARTS HERE
    if len(sort_method) != 0:
        if sort_method == 'cost':
            sqlquery += """
            ORDER BY cost"""

        elif sort_method == 'name':
            sqlquery += """
            ORDER BY name"""

        elif sort_method == 'sell':
            sqlquery += """
            ORDER BY sell_price"""

        if sort_direction == 'desc':
            sqlquery += " DESC NULLS LAST"
        else:
            sqlquery += " ASC NULLS LAST"
    else:
        sqlquery += """
        ORDER BY id DESC"""

    # PAGINATION HERE
    sqlquery += """
        OFFSET %s ROWS
        FETCH FIRST 50 ROW ONLY;"""
    paramtuple += (int(page)*50,)

    print(sqlquery)

    cursor.execute(sqlquery, paramtuple)
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

    for i in items_to_return:
        tempmonths = "<div class='months'>"
        if i['months_available'] == None:
            i['months_available'] = 0
        for j in range(len(month_bitmasks)):
            if int(i['months_available']) & month_bitmasks[j]:
                tempmonths += """
                    <span class="is-present">%s </span>
                """ %(months[j])
            else:
                tempmonths += """
                    <span class="not-present">%s </span>
                """ %(months[j])
        tempmonths += """
            </div>"""
        i['months_available'] = tempmonths


    return jsonify(items_to_return), 200

@app.route('/api/items/<int:id>', methods=['GET'])
def item_get_by_id():
    #this will load the details expansion
    return jsonify(item_details), 200

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
