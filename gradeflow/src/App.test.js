import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the GradeFlow demo entry point", () => {
  render(<App />);
  expect(screen.getByText(/GradeFlow/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Enter demo/i })).toBeInTheDocument();
});
