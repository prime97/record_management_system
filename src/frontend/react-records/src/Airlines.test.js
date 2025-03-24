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

    fireEvent.change(screen.getByPlaceholderText("Search by company name"), {
      target: { value: "Ryanair" }
    });

    await waitFor(() => {
      expect(screen.getByText("Ryanair")).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/airlines");
  });

  test("search filters flights correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { id: 1, company_name: "Ryanair"},
      { id: 2, company_name: "JetBlue" }
    ]});

    await act(async () => {
      render(<Airlines />);
    });

    fireEvent.change(screen.getByPlaceholderText("Search by company name"), {
      target: { value: "Ryanair" }
    });

    await waitFor(() => {
      expect(screen.getByText("Ryanair")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Search by company name"), {
      target: { value: "JetBlue" }
    });

    expect(screen.queryByText("Ryanair")).not.toBeInTheDocument();
    expect(screen.getByText("JetBlue")).toBeInTheDocument();
  });

  test("adds a new airline", async () => {
    axios.get.mockResolvedValue({ data: [] }); // Initial empty list
    axios.post.mockResolvedValue({ data: { id: 2, company_name: "JetBlue" } });

    await act(async () => {
      render(<Airlines />);
    });

    const input = screen.getByPlaceholderText(/Company Name/);
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "JetBlue" } });
    fireEvent.click(addButton);

    axios.get.mockResolvedValueOnce({ data: [{ id: 2, company_name: "JetBlue" }] }); // Updated list after adding

    fireEvent.change(screen.getByPlaceholderText("Search by company name"), {
      target: { value: "JetBlue" }
    });

    await waitFor(() => {
      expect(screen.getByText("JetBlue")).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/airlines", { company_name: "JetBlue" });
  });

  test("edits an airline", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 3, company_name: "Wizz Air" }] });
    axios.put.mockResolvedValue({});
    render(<Airlines />);

    fireEvent.change(screen.getByPlaceholderText("Search by company name"), {
      target: { value: "Wizz Air" }
    });

    await waitFor(() => expect(screen.getByText("Wizz Air")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Edit"));
    const input = screen.getByPlaceholderText("Company Name");
    fireEvent.change(input, { target: { value: "Ryanair" } });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
  });
  
  test("deletes an airline", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, company_name: "Ryanair" }] });
    axios.delete.mockResolvedValue({});

    await act(async () => {
      render(<Airlines />);
    });

    fireEvent.change(screen.getByPlaceholderText("Search by company name"), {
      target: { value: "Ryanair" }
    });

    await waitFor(() => {
      expect(screen.getByText("Ryanair")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    axios.get.mockResolvedValueOnce({ data: [] });

    fireEvent.change(screen.getByPlaceholderText("Search by company name"), {
      target: { value: "Ryanair" }
    });

    await waitFor(() => {
      expect(screen.queryByText("Ryanair")).not.toBeInTheDocument();
    });

    expect(axios.delete).toHaveBeenCalledWith("http://localhost:5000/airlines/1");
  });

  test("renders Airlines component correctly", () => {
    render(<Airlines />);
    expect(screen.getByText(/Airlines/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Company Name/)).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });
});
