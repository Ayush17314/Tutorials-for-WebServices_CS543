# Campus Library - GraphQL Web Application (TUT-7_CS543_Web Services)
# Ayush Kumar Dubey--  20251651030

A full-stack, end-to-end web application demonstrating GraphQL fundamentals with Node.js, Apollo Server, and MySQL.

---

## 📌 Project Overview

This project implements a complete **Campus Library** system where users can:
- Query all authors and their nested books in a single GraphQL request.
- Add a new book for a specific author via GraphQL mutations.
- Delete an existing book by its ID.

### Architecture

```
[ Browser (Frontend) ] ──( HTTP POST / GraphQL Query & Mutation )──> [ GraphQL API (Node.js + Apollo Server) ] ──( SQL Queries )──> [ MySQL Database ]
     public/index.html                                                               server.js                                             schema.sql
```

1. **Frontend**: Pure HTML5, CSS3, and modern Vanilla JavaScript using `fetch()` POST requests to communicate with the GraphQL endpoint.
2. **GraphQL API**: Built with Apollo Server 4 (`@apollo/server`), defining custom schema types, resolvers, and nested relationship mappings.
3. **Database**: MySQL database (`TUT7`) with normalized relational tables (`authors` and `books`) linked via foreign key.

---

## 📁 Project Structure

```text
TUT-7/
├── db.js                 # MySQL connection pool configuration (mysql2/promise)
├── package.json          # Node.js project manifest & dependencies
├── schema.sql            # Database creation, table schemas, and initial seed data
├── server.js             # Apollo Server definition, GraphQL schema (typeDefs), & resolvers
├── public/
│   ├── index.html        # Web interface with dynamic GraphQL queries & mutations
│   └── style.css         # Styling for the library UI and cards
└── Screensshots/         # Demonstration media and execution proof
    ├── Before Mutation.png
    ├── After the Mutation.png
    ├── Localhost for Grapghql API check.png
    └── TUT-7 Demonstration.mp4
```

---

## 🛠️ Prerequisites

- **Node.js** (v18 or newer)
- **npm** (v9 or newer)
- **MySQL Community Server** (v8.x)
- *(Optional)* **VS Code** with the **Live Server** extension

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)

Open your MySQL command line or MySQL Workbench and execute [`schema.sql`](schema.sql):

```sql
SOURCE C:/Users/USER/Desktop/TUT-7/schema.sql;
```

Or execute directly inside MySQL:

```sql
CREATE DATABASE IF NOT EXISTS TUT7;
USE TUT7;

CREATE TABLE authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50)
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  year INT,
  author_id INT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO authors (name, country) VALUES
  ('Asha Patel', 'India'),
  ('Ravi Kumar', 'India');

INSERT INTO books (title, year, author_id) VALUES
  ('Databases 101', 2020, 1),
  ('SQL in Practice', 2022, 1),
  ('Web Services Basics', 2023, 2);
```

### 2. Configure Database Connection

Check [`db.js`](db.js) and make sure your MySQL password and database match your setup:

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD',
    database: 'TUT7',
});

module.exports = pool;
```

### 3. Install Dependencies

Install the required packages (`@apollo/server`, `graphql`, `mysql2`):

```bash
npm install
```

### 4. Start the GraphQL API Server

Run the Apollo Server:

```bash
node server.js
```

You should see:
```text
GraphQL API ready at http://localhost:4000/
```

### 5. Launch the Frontend

- Open [`public/index.html`](public/index.html) using VS Code's **Live Server** extension (typically `http://127.0.0.1:5500/public/index.html`).
- The page will automatically fetch and display all authors and their books.

---

## 🧪 GraphQL API Operations

You can test queries and mutations interactively using the **Apollo Sandbox** at `http://localhost:4000/`.

### 1. Query Authors with Nested Books

```graphql
query GetAuthorsWithBooks {
  authors {
    id
    name
    country
    books {
      id
      title
      year
    }
  }
}
```

### 2. Mutation: Add a New Book

```graphql
mutation AddNewBook($title: String!, $year: Int, $authorId: ID!) {
  addBook(title: $title, year: $year, authorId: $authorId) {
    id
    title
    year
    author {
      name
    }
  }
}
```
**Variables:**
```json
{
  "title": "GraphQL for Beginners",
  "year": 2025,
  "authorId": "2"
}
```

### 3. Mutation: Delete a Book

```graphql
mutation DeleteBook($id: ID!) {
  deleteBook(id: $id)
}
```
**Variables:**
```json
{
  "id": "1"
}
```

---

## 📸 Demonstration & Media

Screenshots and screen recordings verifying functionality are located in the `Screensshots/` folder:
- **`Localhost for Grapghql API check.png`**: Apollo Studio/Sandbox verification.
- **`Before Mutation.png`**: Initial client view before adding a book.
- **`After the Mutation.png`**: Client view showing newly added book data dynamically rendered.
- **`TUT-7 Demonstration.mp4`**: Full walkthrough video of the app and operations.
