CREATE TYPE itemtype AS ENUM ('Music','etc');
CREATE TYPE subtype AS ENUM ('Flooring', 'etc');

CREATE TABLE items (
    id serial PRIMARY KEY,
    name text,
    type itemtype,
    subtype subtype,
    notes text,
    is_recipe boolean,
    has_reciple boolean,
    sell_price int,
    cost int
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



