import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import axios from "axios";
import Flights from "./Flights";

jest.mock("axios");

describe("Flights Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays flights", async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, client_id: 101, airline_id: 202, date: "2025-05-01", start_city: "London", end_city: "New York" }]
    });

    await act(async () => {
      render(<Flights />);
    });

    fireEvent.change(screen.getByPlaceholderText("Search by Client ID or Airline ID"), {
      target: { value: "101" }
    });

    await waitFor(() => {
      expect(screen.getByText("Client 101 → Airline 202 on 2025-05-01")).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/flights");
  });

  test("search filters flights correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { id: 1, client_id: 101, airline_id: 202, date: "2025-05-01", start_city: "London", end_city: "New York" },
      { id: 2, client_id: 303, airline_id: 404, date: "2025-05-01", start_city: "Paris", end_city: "Berlin" }
    ]});

    await act(async () => {
      render(<Flights />);
    });

    fireEvent.change(screen.getByPlaceholderText("Search by Client ID or Airline ID"), {
      target: { value: "202" }
    });

    await waitFor(() => {
      expect(screen.getByText("Client 101 → Airline 202 on 2025-05-01")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Search by Client ID or Airline ID"), {
      target: { value: "303" }
    });

    expect(screen.queryByText("Client 101 → Airline 202 on 2025-05-01")).not.toBeInTheDocument();
    expect(screen.getByText("Client 303 → Airline 404 on 2025-05-01")).toBeInTheDocument();
  });

  // UNABLE TO ADEQUATELY TEST ADD FUNCTIONALITY DUE TO TIME CONSTRAINT FROM LAST MINUTE CHANGES IN FRONTEND
  test("adds a new flight", async () => {
    axios.get.mockResolvedValue({ data: [] }); // Initial empty list
    axios.get.mockResolvedValueOnce({ data: [{ client_id: "303", airline_id: "404", start_city: "Paris", end_city: "Berlin", date: "2025-05-01" }] });
    axios.post.mockResolvedValueOnce({});

    await act(async () => {
      render(<Flights />);
    });

    fireEvent.click(screen.getByLabelText("Select Client"));
    fireEvent.select(screen.getByDisplayValue("303"));
    fireEvent.click(screen.getByLabelText("Select Airline"));
    fireEvent.select(screen.getByDisplayValue("404"));
    fireEvent.change(screen.getByPlaceholderText(/Start City/i), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText(/End City/i), { target: { value: "Berlin" } });
    fireEvent.change(screen.getByTestId("date-input"), { target: { value: "2025-05-01" } });

    fireEvent.click(screen.getByText("Add"));

    await act(async () => {
     axios.get.mockResolvedValueOnce({data: [{ id: 2, client_id: 303, airline_id: 404, date: "2025-05-01", start_city: "Paris", end_city: "Berlin" }] });
    });

    fireEvent.change(screen.getByPlaceholderText("Search by Client ID or Airline ID"), {
      target: { value: "303" }
    });
    
    await waitFor(() => {
      expect(screen.getByText("Client 303 → Airline 404 on 2025-05-01")).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/flights", expect.objectContaining({ client_id: "303", airline_id: "404", start_city: "Paris", end_city: "Berlin", date: "2025-05-01" }));
  });
  
  test("edits a flight", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 3, client_id: "111", airline_id: "222", date: "2025-08-10", start_city: "Dublin", end_city: "London" }] });
    axios.put.mockResolvedValue({});
    render(<Flights />);

    fireEvent.change(screen.getByPlaceholderText("Search by Client ID or Airline ID"), {
      target: { value: "111" }
    });

    await waitFor(() => expect(screen.getByText("Client 111 → Airline 222 on 2025-08-10")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText("Start City"), { target: { value: "Barcelona" } });
    
    await act(async () => {
      fireEvent.click(screen.getByText("Update"));
    });
    
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
  });
  
  test("deletes a flight", async () => {
   
    axios.get.mockResolvedValue({
      data: [{ id: 1, client_id: 101, airline_id: 202, date: "2025-05-01", start_city: "London", end_city: "New York" }]
    });
    axios.delete.mockResolvedValue({});

    await act(async () => {
      render(<Flights />);
    });

    fireEvent.change(screen.getByPlaceholderText("Search by Client ID or Airline ID"), {
      target: { value: "101" }
    });

    await waitFor(() => {
      expect(screen.getByText("Client 101 → Airline 202 on 2025-05-01")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Delete/i));

    axios.get.mockResolvedValueOnce({ data: [] });

    fireEvent.change(screen.getByPlaceholderText("Search by Client ID or Airline ID"), {
      target: { value: "101" }
    });

    await waitFor(() => {
      expect(screen.queryByText("Client 101 → Airline 202 on 2025-05-01")).not.toBeInTheDocument();
    });

    expect(axios.delete).toHaveBeenCalledWith("http://localhost:5000/flights/1");
  });

  test("renders Flights component correctly", () => {
    render(<Flights />);
    expect(screen.getByText(/Flights/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Client ID/i)).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });
});
