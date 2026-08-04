import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

test("previous disabled on first page", () => {
  render(
    <Pagination
      currentPage={1}
      totalItems={100}
      itemsPerPage={20}
      onPageChange={jest.fn()}
    />
  );

  expect(
    screen.getByText(/previous/i)
  ).toBeDisabled();
});

test("next disabled on last page", () => {
  render(
    <Pagination
      currentPage={5}
      totalItems={100}
      itemsPerPage={20}
      onPageChange={jest.fn()}
    />
  );

  expect(
    screen.getByText(/next/i)
  ).toBeDisabled();
});

test("clicking page calls callback", () => {
  const fn = jest.fn();

  render(
    <Pagination
      currentPage={1}
      totalItems={100}
      itemsPerPage={20}
      onPageChange={fn}
    />
  );

  fireEvent.click(screen.getByText("2"));

  expect(fn).toHaveBeenCalledWith(2);
});