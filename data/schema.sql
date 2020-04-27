--CREATE TYPE itemtype AS ENUM ('Clothing','Consumable','Decor','Currency','Fish','Forage','Fossil','Handheld','Insect','Mineral','Music','Award');

CREATE TABLE items (
    id serial PRIMARY KEY,
    name text,
    type itemtype,
    subtype text,
    notes text,
    is_recipe boolean,
    has_recipe boolean,
    sell_price int,
    cost int,
    cost_currency text,
    time_start int,
    time_end int,
    months_available text
);

CREATE TABLE items_properties (
    id serial PRIMARY KEY,
    items_id int REFERENCES items(id),
    name text,
    value text
);

-- DROP TABLE items CASCADE;
-- DROP TABLE items_properties CASCADE;