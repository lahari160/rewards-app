import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock RewardsProgram
jest.mock("./components/rewards/RewardsProgram/RewardsProgram", () => () => (
  <div data-testid="rewards-program-mock">Rewards Program Component</div>
));

test("renders the app root div", () => {
  render(<App />);
  expect(screen.getByTestId("app-root")).toHaveClass("app");
});

test("renders RewardsProgram component inside App", () => {
  render(<App />);
  expect(screen.getByTestId("rewards-program-mock")).toBeInTheDocument();
});