CREATE TYPE itemtype AS ENUM ('Music','etc');
CREATE TYPE subtype AS ENUM ('Flooring', 'etc');
CREATE TYPE timeofday AS ENUM ('Daytime', 'Afternoon', 'Evening');
CREATE TYPE month as ENUM ('January', 'etc');
-- CREATE TYPE source AS ENUM ('Nook Store', 'etc');

CREATE TABLE items (
    id serial PRIMARY KEY,
    name text,
    type itemtype,
    subtype subtype,
    notes text,
    sell_price int,
    cost int
    times_available text,
    months_available text
);

CREATE TABLE items_properties (
    id serial PRIMARY KEY,
    items_id int REFERENCES items(id),
    name text,
    value text
);



