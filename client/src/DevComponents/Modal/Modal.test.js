// Modal.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";

describe("Modal Component", () => {
  test("renders modal when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );

    // Check if the modal content is rendered
    const modalContent = screen.getByText(/modal content/i);
    expect(modalContent).toBeInTheDocument();
  });

  test("does not render modal when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );

    // Ensure modal content is not rendered
    const modalContent = screen.queryByText(/modal content/i);
    expect(modalContent).not.toBeInTheDocument();
  });

  test("calls onClose when clicking outside the modal", () => {
    const handleClose = jest.fn();

    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    // Simulate click outside the modal
    fireEvent.mouseDown(container);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when the close button is clicked", () => {
    const handleClose = jest.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    // Simulate clicking the close button
    const closeButton = screen.getByText(/×/i);
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
