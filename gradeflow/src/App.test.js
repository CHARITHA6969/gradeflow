import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the GradeFlow authenticated login screen", () => {
  render(<App />);
  expect(screen.getByText(/GradeFlow/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/University email/i)).toBeInTheDocument();
});
