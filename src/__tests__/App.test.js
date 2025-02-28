// App.test.js
// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import App from "../App";

// Mock external dependencies
// jest.mock("../__mocks__/Database");
// jest.mock("../Components/Navbar/Navbar.jsx", () => () => <nav>Navbar</nav>);
// jest.mock("../DevComponents/Footer/Footer.jsx", () => () => (
//   <footer>Footer</footer>
// ));
// jest.mock("../Views/Landing.jsx", () => () => <div>Landing Page</div>);
// jest.mock("../Views/404.jsx", () => () => <div>404 Page Not Found</div>);
// jest.mock("../Components/Spinner/Spinner", () => () => <div>Loading...</div>);

// describe("App Component", () => {
//   test("renders Landing page at root path", async () => {
//     render(
//       <MemoryRouter initialEntries={["/"]}>
//         <App />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByText(/Simplify Your Scheduling/i)).toBeInTheDocument();
//     });
//   });

//     test("renders 404 page for unknown routes", async () => {
//       render(
//         <MemoryRouter initialEntries={["/unknown"]}>
//           <App />
//         </MemoryRouter>
//       );

//       expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

//       await waitFor(() => {
//         expect(screen.getByText(/404 Page Not Found/i)).toBeInTheDocument();
//       });
//     });
// });
