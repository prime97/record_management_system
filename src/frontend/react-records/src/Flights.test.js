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

    await waitFor(() => {
      expect(screen.getByText("Client 101 → Airline 202")).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/flights");
  });

  test("adds a new flight", async () => {
    axios.get.mockResolvedValue({ data: [] }); // Initial empty list
    axios.post.mockResolvedValue({
      data: { id: 2, client_id: 303, airline_id: 404, date: "2025-05-01", start_city: "Paris", end_city: "Berlin" }
    });

    await act(async () => {
      render(<Flights />);
    });

    fireEvent.change(screen.getByPlaceholderText(/Client ID/i), { target: { value: "303" } });
    fireEvent.change(screen.getByPlaceholderText(/Airline ID/i), { target: { value: "404" } });
    fireEvent.change(screen.getByPlaceholderText(/Start City/i), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText(/End City/i), { target: { value: "Berlin" } });
    fireEvent.change(screen.getByTestId("date-input"), { target: { value: "2025-05-01" } });

    fireEvent.click(screen.getByText(/Add Flight/i));

    axios.get.mockResolvedValueOnce({
        data: [{ id: 2, client_id: 303, airline_id: 404, date: "2025-05-01", start_city: "Paris", end_city: "Berlin" }]
    });

    await waitFor(() => {
      expect(screen.getByText("Client 303 → Airline 404")).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/flights", expect.objectContaining({ client_id: "303", airline_id: "404", start_city: "Paris", end_city: "Berlin", date: "2025-05-01" }));
  });

  test("deletes a flight", async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, client_id: 101, airline_id: 202, date: "2025-05-01", start_city: "London", end_city: "New York" }]
    });
    axios.delete.mockResolvedValue({});

    await act(async () => {
      render(<Flights />);
    });

    await waitFor(() => {
      expect(screen.getByText("Client 101 → Airline 202")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Delete/i));

    axios.get.mockResolvedValueOnce({ data: [] });

    await waitFor(() => {
      expect(screen.queryByText("Client 101 → Airline 202")).not.toBeInTheDocument();
    });

    expect(axios.delete).toHaveBeenCalledWith("http://localhost:5000/flights/1");
  });

  test("renders Flights component correctly", () => {
    render(<Flights />);
    expect(screen.getByText(/Flights/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Client ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Flight/i)).toBeInTheDocument();
  });
});
