import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import axios from "axios";
import Airlines from "./Airlines";

jest.mock("axios");

describe("Airlines Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays airlines", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, company_name: "Ryanair" }] });

    await act(async () => {
      render(<Airlines />);
    });

    await waitFor(() => {
      expect(screen.getByText("Ryanair")).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/airlines");
  });

  test("adds a new airline", async () => {
    axios.get.mockResolvedValue({ data: [] }); // Initial empty list
    axios.post.mockResolvedValue({ data: { id: 2, company_name: "JetBlue" } });

    await act(async () => {
      render(<Airlines />);
    });

    const input = screen.getByPlaceholderText(/Company Name/i);
    const addButton = screen.getByText(/Add Airline/i);

    fireEvent.change(input, { target: { value: "JetBlue" } });
    fireEvent.click(addButton);

    axios.get.mockResolvedValueOnce({ data: [{ id: 2, company_name: "JetBlue" }] }); // Updated list after adding

    await waitFor(() => {
      expect(screen.getByText("JetBlue")).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/airlines", { company_name: "JetBlue" });
  });

  test("deletes an airline", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, company_name: "Ryanair" }] });
    axios.delete.mockResolvedValue({});

    await act(async () => {
      render(<Airlines />);
    });

    await waitFor(() => {
      expect(screen.getByText("Ryanair")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    axios.get.mockResolvedValueOnce({ data: [] });

    await waitFor(() => {
      expect(screen.queryByText("Ryanair")).not.toBeInTheDocument();
    });

    expect(axios.delete).toHaveBeenCalledWith("http://localhost:5000/airlines/1");
  });

  test("renders Airlines component correctly", () => {
    render(<Airlines />);
    expect(screen.getByText(/Airlines/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Airline/i)).toBeInTheDocument();
  });
});