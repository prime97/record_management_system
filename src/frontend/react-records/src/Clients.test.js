import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import axios from "axios";
import Clients from "./Clients";

jest.mock("axios");

describe("Clients Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays clients", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, name: "J Doe", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" }] });

    await act(async () => {
      render(<Clients />);
    });

    await waitFor(() => {
      expect(screen.getByText("J Doe - New York")).toBeInTheDocument();
    });

    // Ensure axios.get is called with the correct URL
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/clients");
  });

  test("adds a new client", async () => {
    axios.get.mockResolvedValue({ data: [] }); // Initial empty list
    axios.post.mockResolvedValue({ data: { id: 1, name: "Jane Smith", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" } });

    await act(async () => {
      render(<Clients />);
    });

    const Clientbutton = screen.getByText(/Clients/i);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const address_line_1Input = screen.getByPlaceholderText(/Address Line 1/i);
    const cityInput = screen.getByPlaceholderText(/City/i);
    const stateInput = screen.getByPlaceholderText(/State/i);
    const zip_codeInput = screen.getByPlaceholderText(/Zip Code/i);
    const countryInput = screen.getByPlaceholderText(/Country/i);
    const phone_numberInput = screen.getByPlaceholderText(/Phone Number/i);       
    const addButton = screen.getByText(/Add Client/i);

    // Triggering changes and click events
    fireEvent.click(Clientbutton);
    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    fireEvent.change(address_line_1Input, { target: { value: "Place" } });
    fireEvent.change(cityInput, { target: { value: "New York" } });
    fireEvent.change(stateInput, { target: { value: "New York" } });
    fireEvent.change(zip_codeInput, { target: { value: "NY123" } });
    fireEvent.change(countryInput, { target: { value: "America" } });
    fireEvent.change(phone_numberInput, { target: { value: "12345678" } });
    fireEvent.click(addButton);

    // Using act() around axios to simulate the response and handle re-renders
    await act(async () => {
      axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: "Jane Smith", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" }] });
    });

    await waitFor(() => {
      expect(screen.getByText("Jane Smith - New York")).toBeInTheDocument();
    });

    // Ensure axios.post was called correctly
    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/clients", expect.objectContaining({ name: "Jane Smith", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" }));
  });

  test("edits a client", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 3, name: "Jordan Simmons", address_line_1: "34 New Place", city: "Dallas", state: "Texas", zip_code: "TX123", country: "America", phone_number: "987654321" }] });
    axios.put.mockResolvedValue({});
    render(<Clients />);
  
    await waitFor(() => expect(screen.getByText("Jordan Simmons - Dallas")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Winona Davies" } });
      
    await act(async () => {
      fireEvent.click(screen.getByText("Update"));
    });
      
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
  });

  test("deletes a client", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 1, name: "John Doe", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" }] });
    axios.delete.mockResolvedValue({});

    await act(async () => {
      render(<Clients />);
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe - New York")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/DELETE/i);
    fireEvent.click(deleteButton);

    // Simulating the updated client list after deleting
    await act(async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
    });

    await waitFor(() => {
      expect(screen.queryByText("John Doe - New York")).not.toBeInTheDocument();
    });

    // Ensure axios.delete was called correctly
    expect(axios.delete).toHaveBeenCalledWith("http://localhost:5000/clients/1");
  });

  test("renders Clients component correctly", () => {
    render(<Clients />);
    expect(screen.getByText(/Clients/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Client/i)).toBeInTheDocument();
  });
});
