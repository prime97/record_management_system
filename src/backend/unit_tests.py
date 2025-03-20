import unittest
from flask import json
from record_app import app, db

class RecordAppTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """ Setting up the test client and initialize the database."""
        cls.app = app
        cls.app.config["TESTING"] = True
        cls.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        cls.client = cls.app.test_client()
        
        with cls.app.app_context():
            db.create_all()
    
    @classmethod
    def tearDownClass(cls):
        """ Cleaning up the database after all tests run."""
        with cls.app.app_context():
            db.drop_all()
    
    def post_json(self, url, data):
        """ Helper function to post JSON data."""
        return self.client.post(url, data=json.dumps(data), content_type="application/json")
    
    # ===== CLIENT TESTS =====

    def test_add_client(self):
        response = self.post_json("/clients", {"name": "Abby Smith", "address_line_1": "123 The Street", "address_line_2": "House", "city": "London", "state": "London", "zip_code": "MN0123", "country": "UK", "phone_number": "1234567890"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["message"], "Client added successfully")

    def test_get_clients(self):
        response = self.client.get("/clients")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json[0]["name"], "Abby Smith")

    def test_delete_client(self):
        self.post_json("/clients", {"name": "Jamie Smith", "address_line_1": "123 The Street", "city": "London", "state": "London", "zip_code": "MN0123", "country": "UK", "phone_number": "1234567890"})
        response = self.client.delete("/clients/2")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Client deleted successfully")

    def test_update_client(self):
        response = self.client.put("/clients/1", data=json.dumps({"name": "John Smith", "address_line_1": "456 Other Street", "city": "Manchester", "state": "Manchester", "zip_code": "MO0123", "country": "UK", "phone_number": "9876543210"}), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Client updated successfully")
    
    # ===== AIRLINE TESTS =====

    def test_add_airlines(self):
        response = self.post_json("/airlines", {"company_name": "Ryanair"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["message"], "Airline added successfully")

    def test_get_airlines(self):
        response = self.client.get("/airlines")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json[0]["company_name"], "Ryanair")

    def test_delete_airlines(self):
        self.post_json("/airlines", {"company_name": "JetBlue"})
        response = self.client.delete("/airlines/2")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Airline deleted successfully")

    def test_update_airlines(self):
        response = self.client.put("/airlines/1", data=json.dumps({"company_name": "Wizz Air"}), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Airline updated successfully")
    
    # ===== FLIGHT TESTS =====
    def test_add_flights(self):
        response = self.post_json("/flights", {"client_id": 1, "airline_id": 1, "date": "2025-05-01", "start_city": "London", "end_city": "Dublin"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["message"], "Flight added successfully")

    def test_get_flights(self):
        response = self.client.get("/flights")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json[0]["date"], "2025-05-01")

    def test_delete_flights(self):
        response = self.post_json("/flights", {"client_id": 1, "airline_id": 1, "date": "2024-11-23", "start_city": "Rome", "end_city": "Napoli"})
        response = self.client.delete("/flights/2")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Flight deleted successfully")

    def test_update_flights(self):
        response = self.client.put("/flights/1", data=json.dumps({"client_id": 1, "airline_id": 1, "date": "2026-06-12", "start_city": "Berlin", "end_city": "Rome"}), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Flight updated successfully")

if __name__ == "__main__":
    unittest.main()
