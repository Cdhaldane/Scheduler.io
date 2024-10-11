// ContextMenu.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  queryByAttribute,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ContextMenu from "./ContextMenu";

const getById = queryByAttribute.bind(null, "id");

describe("ContextMenu Component", () => {
  const mockOptions = [
    { label: "Option 1", onClick: jest.fn() },
    { label: "Option 2", onClick: jest.fn() },
  ];

  test("renders and positions the context menu based on props", () => {
    const dom = render(
      <ContextMenu
        visible={true}
        x={100}
        y={200}
        options={mockOptions}
        onRequestClose={jest.fn()}
      />
    );

    const contextMenu = getById(dom.container, "context-menu");
    expect(contextMenu).toBeInTheDocument();
    expect(contextMenu).toHaveStyle({
      left: "100px",
      top: "200px",
      display: "block",
      animationName: "contextGrow",
    });
  });

  test("hides the context menu when visible is false", () => {
    const dom = render(
      <ContextMenu
        visible={false}
        x={100}
        y={200}
        options={mockOptions}
        onRequestClose={jest.fn()}
      />
    );

    const contextMenu = getById(dom.container, "context-menu");
    expect(contextMenu).toHaveStyle({ display: "none" });
  });

  test("renders all provided options", () => {
    render(
      <ContextMenu
        visible={true}
        x={100}
        y={200}
        options={mockOptions}
        onRequestClose={jest.fn()}
      />
    );

    const option1 = screen.getByText("Option 1");
    const option2 = screen.getByText("Option 2");

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  test("calls onClick when an option is clicked", () => {
    render(
      <ContextMenu
        visible={true}
        x={100}
        y={200}
        options={mockOptions}
        onRequestClose={jest.fn()}
      />
    );

    const option1 = screen.getByText("Option 1");
    fireEvent.click(option1);
    expect(mockOptions[0].onClick).toHaveBeenCalled();
  });

  test("calls onRequestClose when menu is clicked", () => {
    const mockRequestClose = jest.fn();
    const dom = render(
      <ContextMenu
        visible={true}
        x={100}
        y={200}
        options={mockOptions}
        onRequestClose={mockRequestClose}
      />
    );

    const contextMenu = getById(dom.container, "context-menu");
    fireEvent.click(contextMenu);
    expect(mockRequestClose).toHaveBeenCalled();
  });
});
