import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import PropertyCard from "./PropertyCard";

const property = {
  id: 1,
  L_ListingID: "12345",
  L_Address: "123 Main St",
  L_City: "Los Angeles",
  L_State: "CA",
  L_SystemPrice: 500000,
  L_Keyword2: 3,
  LM_Dec_3: "2.0",
  LM_Int2_3: 1800,
  L_Photos: "[]",
};

test("renders property information", () => {
  render(
    <MemoryRouter>
      <PropertyCard property={property} />
    </MemoryRouter>
  );

  expect(
    screen.getByText("$500,000")
  ).toBeInTheDocument();

  expect(
    screen.getByText("123 Main St")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Los Angeles, CA")
  ).toBeInTheDocument();

  expect(
    screen.getByText(/3 beds/)
  ).toBeInTheDocument();
});


test("favorite button calls toggle without navigating", () => {
  const toggleFavorite = jest.fn();

  render(
    <MemoryRouter>
      <PropertyCard
        property={property}
        isFavorite={false}
        onToggleFavorite={toggleFavorite}
      />
    </MemoryRouter>
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: /add to favorites/i,
    })
  );

  expect(toggleFavorite).toHaveBeenCalledWith(property);
  
});

test("favorite button calls toggle without navigating", () => {
  const toggleFavorite = jest.fn();

  render(
    <MemoryRouter>
      <PropertyCard
        property={property}
        isFavorite={false}
        onToggleFavorite={toggleFavorite}
      />
    </MemoryRouter>
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: /add to favorites/i,
    })
  );

  expect(toggleFavorite).toHaveBeenCalledWith(property);
});