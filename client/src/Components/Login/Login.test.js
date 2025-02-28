import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  queryByAttribute,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./Login";
import { signUp, signIn, loginWithGoogle, supabase } from "../../Database";
import { useAlert } from "../../DevComponents/Providers/Alert";

const getById = queryByAttribute.bind(null, "id");
// Mock the database and alert functions
jest.mock("../../Database", () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  loginWithGoogle: jest.fn(),
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

jest.mock("../../DevComponents/Providers/Alert", () => ({
  useAlert: jest.fn(),
}));

describe("Login Component", () => {
  const mockAlert = {
    showAlert: jest.fn(),
  };

  beforeEach(() => {
    // Mock the useAlert hook to return the mock alert object
    useAlert.mockReturnValue(mockAlert);
  });

  test("renders the login form correctly", () => {
    const dom = render(<Login />);

    // Check if the input fields are rendered
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(getById(dom.container, "password")).toBeInTheDocument();

    // Check if the buttons for SSO providers are rendered
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GitHub/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Microsoft/i })
    ).toBeInTheDocument();

    // Check if the "Sign In" button is rendered
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
  });

  test("handles form input changes", () => {
    const dom = render(<Login />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = getById(dom.container, "password");

    // Simulate user typing in the input fields
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the input values are updated correctly
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("submits the login form successfully", async () => {
    const mockOnLoginSuccess = jest.fn();
    signIn.mockResolvedValueOnce({ data: { session: true } });

    const dom = render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getById(dom.container, "password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    // Wait for the signIn function to be called
    await waitFor(() =>
      expect(signIn).toHaveBeenCalledWith("test@example.com", "password123")
    );

    // Check if the success alert is shown
    expect(mockAlert.showAlert).toHaveBeenCalledWith(
      "success",
      "Logged in successfully"
    );
    expect(mockOnLoginSuccess).toHaveBeenCalled();
  });

  test("displays an error when login fails", async () => {
    signIn.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "Login failed" },
    });

    const dom = render(<Login />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getById(dom.container, "password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    // Wait for the signIn function to be called
    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });

    // Check if the error message is displayed
  });

  test("handles sign-up successfully", async () => {
    signUp.mockResolvedValueOnce({ data: true });

    const dom = render(<Login />);

    // Switch to sign-up form
    fireEvent.click(screen.getByText(/Don't have an account\? Sign up/i));

    // Fill out the sign-up form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getById(dom.container, "password"), {
      target: { value: "password123" },
    });

    fireEvent.change(getById(dom.container, "confirm-password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Wait for the signUp function to be called
    await waitFor(() =>
      expect(signUp).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "",
        ""
      )
    );

    // Check if the success alert is shown
    expect(mockAlert.showAlert).toHaveBeenCalledWith(
      "success",
      "Account created successfully"
    );
  });

  test("handles password reset", async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ data: true });

    render(<Login />);

    // Fill out the email for password reset
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });

    // Click the password reset link
    fireEvent.click(screen.getByText(/Forgot your Password\?/i));

    // Wait for the password reset function to be called
    await waitFor(() =>
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com",
        {
          redirectTo: "https://time-slot.ca/#/reset-password",
        }
      )
    );

    // Check if the success alert is shown
    expect(mockAlert.showAlert).toHaveBeenCalledWith(
      "success",
      "Password reset email sent"
    );
  });

  test("handles Single Sign-On with Google", async () => {
    loginWithGoogle.mockResolvedValueOnce(true);

    render(<Login />);

    // Click the Google login button
    fireEvent.click(screen.getByRole("button", { name: /Google/i }));

    // Wait for the loginWithGoogle function to be called
    await waitFor(() => expect(loginWithGoogle).toHaveBeenCalledWith("/home"));
  });
});
