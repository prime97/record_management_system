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

    fireEvent.change(screen.getByPlaceholderText("Search by Client name"), {
      target: { value: "J Doe" }
    });

    await waitFor(() => {
      expect(screen.getByText("J Doe - 12345678")).toBeInTheDocument();
    });

    // Ensure axios.get is called with the correct URL
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/clients");
  });

  test("search filters clients correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { id: 1, name: "J Doe", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" },
      { id: 2, name: "Joan Smith", address_line_1: "New Place", city: "Los Angeles", state: "California", zip_code: "CA123", country: "America", phone_number: "87654321" }
    ]});

    await act(async () => {
      render(<Clients />);
    });

    fireEvent.change(screen.getByPlaceholderText("Search by Client name"), {
      target: { value: "Joan" }
    });

    expect(screen.queryByText("J Doe - 12345678")).not.toBeInTheDocument();
    expect(screen.getByText("Joan Smith - 87654321")).toBeInTheDocument();
  });

  test("adds a new client", async () => {
    axios.get.mockResolvedValue({ data: [] }); // Initial empty list
    axios.post.mockResolvedValue({ data: { id: 1, name: "Jane Smith", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" } });

    await act(async () => {
      render(<Clients />);
    });

    const Clientbutton = screen.getByText(/Clients/i);
    const nameInput = screen.getByPlaceholderText(/Name/);
    const address_line_1Input = screen.getByPlaceholderText(/Address Line 1/i);
    const cityInput = screen.getByPlaceholderText(/City/i);
    const stateInput = screen.getByPlaceholderText(/State/i);
    const zip_codeInput = screen.getByPlaceholderText(/Zip Code/i);
    const countryInput = screen.getByPlaceholderText(/Country/i);
    const phone_numberInput = screen.getByPlaceholderText(/Phone Number/i);       
    const addButton = screen.getByText("Add");

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

    fireEvent.change(screen.getByPlaceholderText("Search by Client name"), {
      target: { value: "Jane" }
    });

    await waitFor(() => {
      expect(screen.getByText("Jane Smith - 12345678")).toBeInTheDocument();
    });

    // Ensure axios.post was called correctly
    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/clients", expect.objectContaining({ name: "Jane Smith", address_line_1: "Place", city: "New York", state: "New York", zip_code: "NY123", country: "America", phone_number: "12345678" }));
  });

  test("edits a client", async () => {
    axios.get.mockResolvedValue({ data: [{ id: 3, name: "Jordan Simmons", address_line_1: "34 New Place", city: "Dallas", state: "Texas", zip_code: "TX123", country: "America", phone_number: "987654321" }] });
    axios.put.mockResolvedValue({});
    render(<Clients />);

    fireEvent.change(screen.getByPlaceholderText("Search by Client name"), {
      target: { value: "Jordan" }
    });
  
    await waitFor(() => expect(screen.getByText("Jordan Simmons - 987654321")).toBeInTheDocument());
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

    fireEvent.change(screen.getByPlaceholderText("Search by Client name"), {
      target: { value: "John" }
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe - 12345678")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/DELETE/i);
    fireEvent.click(deleteButton);

    // Simulating the updated client list after deleting
    await act(async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
    });

    fireEvent.change(screen.getByPlaceholderText("Search by Client name"), {
      target: { value: "John" }
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
    expect(screen.getByPlaceholderText(/Name/)).toBeInTheDocument();
    expect(screen.getByText(/Add Client/i)).toBeInTheDocument();
  });
});
