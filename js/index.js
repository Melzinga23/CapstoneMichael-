const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken"); // Import the jwt module
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(__dirname + "/public"));
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Authentication middleware
const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
});
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // You'll need a users table with hashed passwords
    const { username, password } = req.body;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = userResult.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken });
    } else {
      res.send("Username or password incorrect");
    }
  })
);

app.get("/api/headphones", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT product_id, name, brand, description, price, stock_quantity, image_url FROM public.products;"
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/headphones/:id", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT product_id, name, brand, description, price, stock_quantity, image_url FROM public.products WHERE product_id = $1;",
      [req.params.id]
    );
    res.json(result.rows[0]);
    console.log(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/categories", async (req, res) => {
  const result = await db.query(
    "SELECT category_id, name FROM public.categories;"
  );
  res.json(result.rows);
});
app.get("/api/customers", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT customer_id, name, email, phone_number FROM public.customers;"
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/order-items", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT order_id, product_id, quantity, price_at_purchase FROM public.order_items;"
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/orders", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT order_id, customer_id, order_date, order_status, total_amount FROM public.orders;"
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/product-categories", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT product_id, category_id FROM public.product_category;"
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

// get products by category
app.get("/api/headphones/category/:category", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT product_id, name, brand, description, price, stock_quantity, image_url FROM public.products WHERE product_id IN (SELECT product_id FROM public.product_category WHERE category_id = $1);",
      [req.params.category]
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/product-spec", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT product_id, specification_id, value FROM public.product_spec;"
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/specifications", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT specification_id, name, description FROM public.specifications;"
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});
