import { fetchProperties } from "./client";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("fetches properties without query parameters", async () => {
  const responseBody = {
    total: 1,
    limit: 20,
    offset: 0,
    results: [{ L_ListingID: "ABC123" }],
  };

  global.fetch.mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(responseBody),
  });

  const result = await fetchProperties();

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/properties",
    expect.objectContaining({
      signal: undefined,
    })
  );

  expect(result).toEqual(responseBody);
});

test("adds filters and excludes empty values", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      total: 0,
      results: [],
    }),
  });

  await fetchProperties({
    city: "Los Angeles",
    zipcode: "",
    minPrice: 300000,
    beds: "3",
  });

  const requestedUrl = global.fetch.mock.calls[0][0];

  expect(requestedUrl).toContain("city=Los+Angeles");
  expect(requestedUrl).toContain("minPrice=300000");
  expect(requestedUrl).toContain("beds=3");
  expect(requestedUrl).not.toContain("zipcode");
});

test("throws the backend error message", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 400,
    json: jest.fn().mockResolvedValue({
      message: "minPrice must be a valid number",
    }),
  });

  await expect(
    fetchProperties({ minPrice: "abc" })
  ).rejects.toThrow("minPrice must be a valid number");
});