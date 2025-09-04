import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock RewardsProgram so test focuses only on App wrapper
jest.mock("./components/rewards/RewardsProgram/RewardsProgram", () => () => (
  <div data-testid="rewards-program-mock">Rewards Program Component</div>
));

test("renders the app root div", () => {
  const { container } = render(<App />);
  expect(container.firstChild).toHaveClass("app");
});

test("renders RewardsProgram component inside App", () => {
  render(<App />);
  expect(screen.getByTestId("rewards-program-mock")).toBeInTheDocument();
});
