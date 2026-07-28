import { fireEvent, render, screen } from "@testing-library/react";
import PropertyFilters from "./PropertyFilters";

test("renders all six filter fields", () => {
  render(
    <PropertyFilters
      onSearch={jest.fn()}
      onClear={jest.fn()}
    />
  );

  expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/minimum price/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/maximum price/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/minimum beds/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/minimum baths/i)).toBeInTheDocument();
});

test("submits only non-empty filter values", () => {
  const onSearch = jest.fn();

  render(
    <PropertyFilters
      onSearch={onSearch}
      onClear={jest.fn()}
    />
  );

  fireEvent.change(screen.getByLabelText(/city/i), {
    target: { value: "Los Angeles" },
  });

  fireEvent.change(screen.getByLabelText(/minimum beds/i), {
    target: { value: "3" },
  });

  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  expect(onSearch).toHaveBeenCalledWith({
    city: "Los Angeles",
    beds: "3",
  });
});

test("clear resets the fields and calls onClear", () => {
  const onClear = jest.fn();

  render(
    <PropertyFilters
      onSearch={jest.fn()}
      onClear={onClear}
    />
  );

  const cityInput = screen.getByLabelText(/city/i);

  fireEvent.change(cityInput, {
    target: { value: "Beverly Hills" },
  });

  expect(cityInput).toHaveValue("Beverly Hills");

  fireEvent.click(
    screen.getByRole("button", { name: /clear filters/i })
  );

  expect(cityInput).toHaveValue("");
  expect(onClear).toHaveBeenCalledTimes(1);
});