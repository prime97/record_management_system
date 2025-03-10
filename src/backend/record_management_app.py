from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# File for storing records
DATA_FILE = "records.json"

# Initialize empty records if the file does not exist
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({"clients": [], "airlines": [], "flights": []}, f)


# Load records from JSON file
def load_records():
    with open(DATA_FILE, "r") as file:
        return json.load(file)


# Save records to JSON file
def save_records(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)


# Create a new record
@app.route("/add", methods=["POST"])
def add_record():
    data = request.json
    records = load_records()

    record_type = data.get("Type")

    if record_type == "Client":
        data["ID"] = len(records["clients"]) + 1
        records["clients"].append(data)
    elif record_type == "Airline":
        data["ID"] = len(records["airlines"]) + 1
        records["airlines"].append(data)
    elif record_type == "Flight":
        records["flights"].append(data)

    save_records(records)
    return jsonify({"message": "Record added successfully"}), 201


# Get all records
@app.route("/records", methods=["GET"])
def get_records():
    return jsonify(load_records())


# Search for a record by ID
@app.route("/search/<record_type>/<int:id>", methods=["GET"])
def search_record(record_type, id):
    records = load_records()
    result = [rec for rec in records.get(record_type, []) if rec.get("ID") == id]

    if result:
        return jsonify(result[0])
    else:
        return jsonify({"message": "Record not found"}), 404


# Update a record
@app.route("/update/<record_type>/<int:id>", methods=["PUT"])
def update_record(record_type, id):
    records = load_records()
    new_data = request.json

    for record in records[record_type]:
        if record["ID"] == id:
            record.update(new_data)
            save_records(records)
            return jsonify({"message": "Record updated successfully"})

    return jsonify({"message": "Record not found"}), 404


# Delete a record
@app.route("/delete/<record_type>/<int:id>", methods=["DELETE"])
def delete_record(record_type, id):
    records = load_records()
    records[record_type] = [rec for rec in records[record_type] if rec["ID"] != id]

    save_records(records)
    return jsonify({"message": "Record deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)
