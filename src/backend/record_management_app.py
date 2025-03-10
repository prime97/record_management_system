from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "records.json"


# ------------------ Utilities ------------------ #

def load_records():
    """Load the records from the JSON file."""
    if not os.path.exists(DATA_FILE):
        # If file doesn't exist, create basic template
        with open(DATA_FILE, "w") as f:
            json.dump({"clients": [], "airlines": [], "flights": []}, f)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {"clients": [], "airlines": [], "flights": []}


def save_records(data):
    """Save the updated records to the JSON file."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


# ------------------ CLIENT ROUTES ------------------ #
@app.route("/clients", methods=["GET"])
def get_clients():
    """Return the list of all client records."""
    data = load_records()
    return jsonify(data["clients"])

@app.route("/clients/<int:client_id>", methods=["GET"])
def get_client(client_id):
    """Get a single client by ID."""
    data = load_records()
    for client in data["clients"]:
        if client["ID"] == client_id:
            return jsonify(client)
    return jsonify({"message": "Client not found"}), 404

@app.route("/clients", methods=["POST"])
def create_client():
    """Add a new client record."""
    records = load_records()
    new_client = request.json

    # Generate a simple auto-incremental ID
    new_client["ID"] = len(records["clients"]) + 1
    new_client["Type"] = "Client"
    records["clients"].append(new_client)

    save_records(records)
    return jsonify({"message": "Client created", "data": new_client}), 201

@app.route("/clients/<int:client_id>", methods=["PUT"])
def update_client(client_id):
    """Update a client record by ID."""
    records = load_records()
    updated = request.json
    for client in records["clients"]:
        if client["ID"] == client_id:
            client.update(updated)
            save_records(records)
            return jsonify({"message": "Client updated", "data": client})

    return jsonify({"message": "Client not found"}), 404

@app.route("/clients/<int:client_id>", methods=["DELETE"])
def delete_client(client_id):
    """Delete a client record and any associated flights."""
    records = load_records()
    original_len = len(records["clients"])
    records["clients"] = [c for c in records["clients"] if c["ID"] != client_id]
    # Also remove flights associated with the deleted client
    records["flights"] = [f for f in records["flights"] if f["Client_ID"] != client_id]

    if len(records["clients"]) < original_len:
        save_records(records)
        return jsonify({"message": f"Client {client_id} deleted"})
    else:
        return jsonify({"message": "Client not found"}), 404


# ------------------ AIRLINE ROUTES ------------------ #
@app.route("/airlines", methods=["GET"])
def get_airlines():
    """Get all airline records."""
    data = load_records()
    return jsonify(data["airlines"])

@app.route("/airlines", methods=["POST"])
def create_airline():
    """Add a new airline."""
    records = load_records()
    new_airline = request.json

    new_airline["ID"] = len(records["airlines"]) + 1
    new_airline["Type"] = "Airline"
    records["airlines"].append(new_airline)

    save_records(records)
    return jsonify({"message": "Airline created", "data": new_airline}), 201

@app.route("/airlines/<int:airline_id>", methods=["PUT"])
def update_airline(airline_id):
    """Update an airline by ID."""
    records = load_records()
    updated = request.json
    for airline in records["airlines"]:
        if airline["ID"] == airline_id:
            airline.update(updated)
            save_records(records)
            return jsonify({"message": "Airline updated", "data": airline})
    return jsonify({"message": "Airline not found"}), 404

@app.route("/airlines/<int:airline_id>", methods=["DELETE"])
def delete_airline(airline_id):
    """Delete an airline record and any associated flights."""
    records = load_records()
    original_len = len(records["airlines"])
    records["airlines"] = [a for a in records["airlines"] if a["ID"] != airline_id]
    # Remove flights associated with this airline
    records["flights"] = [f for f in records["flights"] if f["Airline_ID"] != airline_id]

    if len(records["airlines"]) < original_len:
        save_records(records)
        return jsonify({"message": f"Airline {airline_id} deleted"})
    else:
        return jsonify({"message": "Airline not found"}), 404


# ------------------ FLIGHT ROUTES ------------------ #
@app.route("/flights", methods=["GET"])
def get_flights():
    """Get all flights."""
    data = load_records()
    return jsonify(data["flights"])

@app.route("/flights", methods=["POST"])
def create_flight():
    """Add a new flight."""
    records = load_records()
    new_flight = request.json

    # Basic validation: ensure Client_ID, Airline_ID exist
    if not any(c["ID"] == new_flight["Client_ID"] for c in records["clients"]):
        return jsonify({"message": "Invalid Client_ID"}), 400

    if not any(a["ID"] == new_flight["Airline_ID"] for a in records["airlines"]):
        return jsonify({"message": "Invalid Airline_ID"}), 400

    new_flight.setdefault("Type", "Flight")
    records["flights"].append(new_flight)
    save_records(records)
    return jsonify({"message": "Flight created", "data": new_flight}), 201

@app.route("/flights/<int:client_id>/<int:airline_id>", methods=["DELETE"])
def delete_flight(client_id, airline_id):
    """Delete a flight by Client_ID and Airline_ID."""
    records = load_records()
    original_len = len(records["flights"])
    records["flights"] = [
        f for f in records["flights"]
        if not (f["Client_ID"] == client_id and f["Airline_ID"] == airline_id)
    ]

    if len(records["flights"]) < original_len:
        save_records(records)
        return jsonify({"message": f"Flight {client_id}-{airline_id} deleted"})
    else:
        return jsonify({"message": "Flight not found"}), 404


# ------------------ SEARCH EXAMPLE (ANY RECORD) ------------------ #
@app.route("/search", methods=["GET"])
def search_records():
    """
    A generic search that checks 'Name', 'Company Name', 'Start City', 'End City', etc.
    Example usage: /search?q=alice
    """
    query = request.args.get("q", "").lower()
    data = load_records()
    matching_clients = [
        c for c in data["clients"]
        if query in c["Name"].lower() or query in c["City"].lower()
    ]
    matching_airlines = [
        a for a in data["airlines"]
        if query in a["Company Name"].lower()
    ]
    matching_flights = [
        f for f in data["flights"]
        if query in f["Start City"].lower() or query in f["End City"].lower()
    ]
    results = {
        "clients": matching_clients,
        "airlines": matching_airlines,
        "flights": matching_flights
    }
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
