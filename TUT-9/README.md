# Secured Catalogue — API Security Tutorial (TUT-9)
**CS543 · Web Services · Securing the API**

**Student Name:** Ayush Kumar Dubey  
**Roll No:** 20251651030  

---

## 📌 Overview

This tutorial demonstrates how to secure a REST API (Node.js & Express) using industry-standard security practices:
1. **Password Hashing with `bcryptjs`**: Never storing passwords in plain text, using salted one-way hashes (`bcrypt.hashSync` & `bcrypt.compareSync`).
2. **Token-based Authentication with `jsonwebtoken`**: Issuing signed JSON Web Tokens (`jwt.sign`) that encode user identity (`sub`) and role (`role`).
3. **Authentication Middleware (`auth`)**: Verifying incoming JWT tokens in the `Authorization: Bearer <token>` header, returning **401 Unauthorized** if invalid or missing.
4. **Role-Based Authorization Middleware (`requireRole`)**: Restricting access to sensitive operations (e.g., adding dishes) to authorized roles, returning **403 Forbidden** if the user lacks permissions.

---

## 🎯 401 Unauthorized vs. 403 Forbidden

| Status Code | Meaning | Explanation |
| :--- | :--- | :--- |
| **`401 Unauthorized`** | *"I don't know who you are"* | Missing, tampered, or expired token. The request failed authentication. |
| **`403 Forbidden`** | *"I know who you are, but you're not allowed"* | The token is valid and authenticated, but the user's role (e.g. `customer`) lacks permission for this endpoint. |

---

## 📁 Project Structure

```text
TUT-9/
├── server.js             # Express API with bcrypt, JWT, auth & requireRole middleware
├── package.json          # Project metadata and dependencies (express, jsonwebtoken, bcryptjs)
├── .gitignore            # Excludes node_modules and video demonstration files
├── README.md             # Complete documentation, setup, and testing guide
├── public/
│   ├── index.html        # Interactive front-end for visual authentication & role testing
│   └── style.css         # Clean UI styles for cards, badges, and response boxes
└── Screenshots/          # Execution screenshots and demonstration recording
```

---

## 👥 Seed Users & Credentials

Passwords are automatically hashed once at startup with bcrypt:

| Email | Plain Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `asha@campus.edu` | `customer123` | `customer` | View menu (`GET /items`) |
| `mealhub@campus.edu` | `resto123` | `restaurant` | View menu (`GET /items`) & Add dishes (`POST /items`) |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

Installed packages:
- `express` — Web framework
- `jsonwebtoken` — Generates and verifies signed JWT tokens
- `bcryptjs` — Secure one-way password hashing and verification

### 2. Start the Server

```bash
node server.js
```
Output:
```text
Secured Catalogue on http://localhost:3000
```

---

## 🧪 Testing the API via Command Line (curl)

### Step 1: Read Menu without Token (Expect 401 Unauthorized)
```bash
curl -i http://localhost:3000/items
```
**Expected Response:**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{"error":"invalid or missing token"}
```

---

### Step 2: Login as Restaurant to Get a JWT
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mealhub@campus.edu","password":"resto123"}'
```
**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save the token in an environment variable:
- **Bash / Linux / macOS:**
  ```bash
  export RESTO_TOKEN="<paste_token_here>"
  ```
- **PowerShell:**
  ```powershell
  $RESTO_TOKEN = "<paste_token_here>"
  ```

---

### Step 3: Read Menu with the Restaurant Token (Expect 200 OK)
```bash
curl -i http://localhost:3000/items -H "Authorization: Bearer $RESTO_TOKEN"
```
**Expected Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"name":"Veg Thali","price":90},{"id":2,"name":"Paneer Roll","price":70}]
```

---

### Step 4: Add a Dish as Restaurant (Expect 201 Created)
```bash
curl -i -X POST http://localhost:3000/items \
  -H "Authorization: Bearer $RESTO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Masala Dosa","price":60}'
```
**Expected Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":3,"name":"Masala Dosa","price":60}
```

---

### Step 5: Login as Customer
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@campus.edu","password":"customer123"}'
```

Save the customer token:
- **Bash:** `export CUST_TOKEN="<paste_token_here>"`
- **PowerShell:** `$CUST_TOKEN = "<paste_token_here>"`

---

### Step 6: Customer Tries to Add a Dish (Expect 403 Forbidden)
```bash
curl -i -X POST http://localhost:3000/items \
  -H "Authorization: Bearer $CUST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Hack Burger","price":99}'
```
**Expected Response:**
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8

{"error":"forbidden"}
```
*(Customer is authenticated, but not authorized to modify the catalogue!)*

---

## 🌐 Interactive Web Interface

Open `http://localhost:3000` in your web browser:
1. Click **"Fetch Menu Without Token"** to see the `401 Unauthorized` response.
2. Click **"Quick Login: Asha (Customer)"** to authenticate as customer.
   - Click **"Fetch Menu with Token"** &rarr; successfully displays the dishes.
   - Try adding a dish &rarr; shows **403 Forbidden** (Role `customer` cannot add items).
3. Click **"Quick Login: MealHub (Restaurant)"** to authenticate as restaurant.
   - Try adding a dish &rarr; successfully adds the dish with **201 Created** and updates the menu!
4. Click **"Logout"** to clear the token and return to guest status.
