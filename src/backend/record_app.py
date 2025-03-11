from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# SQLite Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///records.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Data file for JSON storage
DATA_FILE = "data.json"


# ===================== MODELS =====================
class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), default="Client")
    name = db.Column(db.String(100), nullable=False)
    address_line_1 = db.Column(db.String(200))
    address_line_2 = db.Column(db.String(200))
    address_line_3 = db.Column(db.String(200))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    zip_code = db.Column(db.String(20))
    country = db.Column(db.String(50))
    phone_number = db.Column(db.String(20))


class Airline(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), default="Airline")
    company_name = db.Column(db.String(100), nullable=False)


class Flight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    airline_id = db.Column(db.Integer, db.ForeignKey('airline.id'), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    start_city = db.Column(db.String(50), nullable=False)
    end_city = db.Column(db.String(50), nullable=False)


# Create tables
with app.app_context():
    db.create_all()


# ===================== JSON SYNC FUNCTION =====================
def save_to_json():
    data = {
        "clients": [client.__dict__ for client in Client.query.all()],
        "airlines": [airline.__dict__ for airline in Airline.query.all()],
        "flights": [flight.__dict__ for flight in Flight.query.all()]
    }

    # Remove SQLAlchemy internal attributes
    for records in data.values():
        for record in records:
            record.pop("_sa_instance_state", None)

    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)


# ===================== CRUD OPERATIONS =====================
# CLIENTS CRUD
@app.route("/clients", methods=["POST"])
def add_client():
    data = request.json
    new_client = Client(**data)
    db.session.add(new_client)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Client added successfully"}), 201


def serialize_client(client):
    return {
        "id": client.id,
        "type": client.type,
        "name": client.name,
        "address_line_1": client.address_line_1,
        "address_line_2": client.address_line_2,
        "address_line_3": client.address_line_3,
        "city": client.city,
        "state": client.state,
        "zip_code": client.zip_code,
        "country": client.country,
        "phone_number": client.phone_number
    }

@app.route("/clients", methods=["GET"])
def get_clients():
    clients = Client.query.all()
    return jsonify([serialize_client(client) for client in clients])


@app.route("/clients/<int:id>", methods=["PUT"])
def update_client(id):
    client = Client.query.get(id)
    if not client:
        return jsonify({"message": "Client not found"}), 404
    data = request.json
    for key, value in data.items():
        setattr(client, key, value)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Client updated successfully"})


@app.route("/clients/<int:id>", methods=["DELETE"])
def delete_client(id):
    client = Client.query.get(id)
    if not client:
        return jsonify({"message": "Client not found"}), 404
    db.session.delete(client)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Client deleted successfully"})


# AIRLINES CRUD
@app.route("/airlines", methods=["POST"])
def add_airline():
    data = request.json
    new_airline = Airline(**data)
    db.session.add(new_airline)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Airline added successfully"}), 201


def serialize_airline(airline):
    return {
        "id": airline.id,
        "type": airline.type,
        "company_name": airline.company_name
    }

@app.route("/airlines", methods=["GET"])
def get_airlines():
    airlines = Airline.query.all()
    return jsonify([serialize_airline(airline) for airline in airlines])


@app.route("/airlines/<int:id>", methods=["PUT"])
def update_airline(id):
    airline = Airline.query.get(id)
    if not airline:
        return jsonify({"message": "Airline not found"}), 404
    data = request.json
    for key, value in data.items():
        setattr(airline, key, value)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Airline updated successfully"})


@app.route("/airlines/<int:id>", methods=["DELETE"])
def delete_airline(id):
    airline = Airline.query.get(id)
    if not airline:
        return jsonify({"message": "Airline not found"}), 404
    db.session.delete(airline)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Airline deleted successfully"})


# FLIGHTS CRUD
@app.route("/flights", methods=["POST"])
def add_flight():
    data = request.json
    new_flight = Flight(**data)
    db.session.add(new_flight)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Flight added successfully"}), 201


def serialize_flight(flight):
    return {
        "id": flight.id,
        "client_id": flight.client_id,
        "airline_id": flight.airline_id,
        "date": flight.date,
        "start_city": flight.start_city,
        "end_city": flight.end_city
    }

@app.route("/flights", methods=["GET"])
def get_flights():
    flights = Flight.query.all()
    return jsonify([serialize_flight(flight) for flight in flights])


@app.route("/flights/<int:id>", methods=["PUT"])
def update_flight(id):
    flight = Flight.query.get(id)
    if not flight:
        return jsonify({"message": "Flight not found"}), 404
    data = request.json
    for key, value in data.items():
        setattr(flight, key, value)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Flight updated successfully"})


@app.route("/flights/<int:id>", methods=["DELETE"])
def delete_flight(id):
    flight = Flight.query.get(id)
    if not flight:
        return jsonify({"message": "Flight not found"}), 404
    db.session.delete(flight)
    db.session.commit()
    save_to_json()
    return jsonify({"message": "Flight deleted successfully"})


# Run Flask
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
