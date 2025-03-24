# ✈️ Record Management System

This is a full-stack **Record Management System** for a travel agency. It allows users to manage:

- ✅ Clients
- ✅ Airlines
- ✅ Flights (linked to clients and airlines)

Built with:
- **Flask + SQLAlchemy** (backend)
- **SQLite** (database)
- **React + MUI** (frontend)
- **JSON** (automatic data export)

---


---

## 🚀 Features

### 🔹 Clients
- Add / Edit / Delete
- Search by name
- View client list
- Auto-remove flights if client is deleted

### 🔹 Airlines
- Add / Edit / Delete
- Search by company name
- View airline list
- Auto-remove flights if airline is deleted

### 🔹 Flights
- Link to existing clients and airlines via dropdown
- View / Edit / Delete flights
- Search by Client ID or Airline ID
- Client and airline names shown in dropdown

---

# 🧑‍💻 Getting Started

## 1. Clone the repo

### bash

    git clone https://github.com/prime97/record_management_system.git
    cd record-management-system

## 2. Setup Backend (Flask + SQLite)
### 📦 Install dependencies

    cd backend
    python -m venv venv
    venv\Scripts\activate  # On Windows
    source venv/bin/activate  # On Mac/Linux
    
    pip install -r requirements.txt
### ▶️ Start Flask server
    python record_app.py
Runs on: http://localhost:5000

## 3. Setup Frontend (React + MUI)
### 📦 Install dependencies

    cd frontend/react-records
    npm install

### ▶️ Start React app
    npm start
Runs on: http://localhost:3000

## Testing
### run backend tests
* Note: passes if no records exist
  
    cd backend
    python unit_tests.py

### run frontend tests

    cd backend
    npx jest


## 💾 Data Handling
* All records are stored in SQLite
* On every add/update/delete, the entire data is synced to data.json

## 📦 API Endpoints

| Method | Endpoint                      | Description      |
| ------ | ----------------------------- | ---------------- |
| GET    | /clients                      | List all clients |
| POST   | /clients                      | Add a new client |
| PUT    | /clients/<id>                 | Update a client  |
| DELETE | /clients/<id>                 | Delete a client  |
| ...    | Same for airlines and flights |                  |

## 🧠 Notes
* If you change models (fields), delete records.db and restart Flask to regenerate the schema.
* Frontend and backend must both be running for full functionality.

## 📷 UI Preview
* Clean form-based UI
* Search + edit in-place
* Dropdown selection using MUI components
* Lists of clients and airlines shown in Flights tab

## 📌 Requirements
* Python 3.8+
* Node.js 16 or 18 (avoid Node 20+ without config)
* Flask, SQLAlchemy, React, MUI


## 🛠️ Future Improvements
* Authentication
* Form validation
* Dark mode toggle
* Export/import CSV
