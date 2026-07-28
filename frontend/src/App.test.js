import { render, screen } from "@testing-library/react";
import App from "./App";
import { fetchProperties } from "./api/client";

jest.mock("./api/client", () => ({
  fetchProperties: jest.fn(),
}));

beforeEach(() => {
  fetchProperties.mockResolvedValue({
    total: 0,
    limit: 20,
    offset: 0,
    results: [],
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders the property listings page", async () => {
  render(<App />);

  expect(
    screen.getByRole("heading", {
      name: /property listings/i,
    })
  ).toBeInTheDocument();

  expect(
    await screen.findByText(/no properties matched your filters/i)
  ).toBeInTheDocument();

  expect(fetchProperties).toHaveBeenCalled();
});