CREATE TABLE
    products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INTEGER DEFAULT 0 NOT NULL,
        image_url VARCHAR(255)
    );

CREATE TABLE
    categories (
        category_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

CREATE TABLE
    customers (
        customer_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(20)
    );

CREATE TABLE
    product_category (
        product_id INTEGER REFERENCES products (product_id),
        category_id INTEGER REFERENCES categories (category_id),
        PRIMARY KEY (product_id, category_id)
    );

CREATE TABLE
    specifications (
        specification_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
    );

CREATE TABLE
    product_spec (
        product_id INTEGER REFERENCES products (product_id),
        specification_id INTEGER REFERENCES specifications (specification_id),
        value VARCHAR(255),
        PRIMARY KEY (product_id, specification_id)
    );

CREATE TABLE
    orders (
        order_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers (customer_id),
        order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        order_status VARCHAR(50) DEFAULT 'placed',
        total_amount DECIMAL(10, 2) NOT NULL
    );

CREATE TABLE
    order_items (
        order_id INTEGER REFERENCES orders (order_id),
        product_id INTEGER REFERENCES products (product_id),
        quantity INTEGER NOT NULL,
        price_at_purchase DECIMAL(10, 2) NOT NULL,
        PRIMARY KEY (order_id, product_id)
    );

INSERT INTO
    products (
        name,
        brand,
        description,
        price,
        stock_quantity,
        image_url
    )
VALUES
    (
        'Sony WH-1000XM4',
        'Sony',
        'Wireless Noise-Cancelling Headphones with Industry-Leading NC and Hi-Fi Audio',
        399.99,
        50,
        'https://example.com/sony-wh1000xm4.jpg'
    ),
    (
        'Bose QuietComfort 45',
        'Bose',
        'Wireless Noise Cancelling Headphones with Superior Comfort and Crystal Clear Calls',
        379.00,
        75,
        'https://example.com/bose-qc45.jpg'
    ),
    (
        'Sennheiser Momentum 3 Wireless',
        'Sennheiser',
        'Over-Ear Wireless Headphones with Superior Sound and Personalized ANC',
        349.99,
        25,
        'https://example.com/sennheiser-momentum3.jpg'
    );

(
    'Apple AirPods Max',
    'Apple',
    'Over-Ear Wireless Headphones with Active Noise Cancellation, Transparency Mode, and Spatial Audio',
    549.00,
    100,
    'https://example.com/apple-airpodsmax.jpg'
),
(
    'Sony WH-CH710N',
    'Sony',
    'Wireless Noise Cancelling Headphones with Up to 35 Hours of Battery Life',
    179.99,
    125,
    'https://example.com/sony-whch710n.jpg'
),
(
    'Audio-Technica ATH-M50x',
    'Audio-Technica',
    'Professional Studio Monitor Headphones with Superior Sound Isolation and Detailed Audio Reproduction',
    149.99,
    80,
    'https://example.com/audio-technica-m50x.jpg'
),
(
    'Sennheiser HD 660S',
    'Sennheiser',
    'Open-Back Over-Ear Headphones with Detailed Audio Performance and Comfortable Design',
    499.99,
    40,
    'https://example.com/sennheiser-hd660s.jpg'
),
(
    'AKG K271 MK II',
    'AKG',
    'Professional Studio Headphones with High-Fidelity Sound and Closed-Back Design',
    199.99,
    60,
    'https://example.com/akg-k271-mk2.jpg'
);

INSERT INTO
    categories (name)
VALUES
    ('Noise Cancelling'),
    ('Wireless');

INSERT INTO
    product_category (product_id, category_id)
VALUES
    (1, 1), -- Sony WH-1000XM4 - Noise Cancelling
    (2, 1), -- Bose QuietComfort 45 - Noise Cancelling
    (1, 2), -- Sony WH-1000XM4 - Wireless
    (2, 2) -- Bose QuietComfort 45