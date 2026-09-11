const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

const pool = require("../db");
const app = require("../app");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/properties", () => {
  test("returns paginated properties", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ total: 2 }],
      ])
      .mockResolvedValueOnce([
        [
          {
            L_ListingID: "1001",
            L_City: "Los Angeles",
            L_SystemPrice: 500000,
          },
          {
            L_ListingID: "1002",
            L_City: "Los Angeles",
            L_SystemPrice: 600000,
          },
        ],
      ]);

    const response = await request(app)
      .get("/api/properties")
      .query({
        limit: 20,
        offset: 0,
      });

    expect(response.status).toBe(200);

    expect(response.body.total).toBe(2);
    expect(response.body.results).toHaveLength(2);
  });
  test("passes pagination values to the database", async () => {
    pool.query
        .mockResolvedValueOnce([
        [{ total: 100 }],
        ])
        .mockResolvedValueOnce([
        [],
        ]);

    const response = await request(app)
        .get("/api/properties")
        .query({
        limit: 10,
        offset: 20,
        });

    expect(response.status).toBe(200);

    expect(response.body.limit).toBe(10);
    expect(response.body.offset).toBe(20);
    });
    test("returns 400 for invalid limit", async () => {
    const response = await request(app)
        .get("/api/properties")
        .query({
        limit: 0,
        });

    expect(response.status).toBe(400);
    });
    test("returns 400 for invalid minPrice", async () => {
    const response = await request(app)
        .get("/api/properties")
        .query({
        minPrice: "abc",
        });

    expect(response.status).toBe(400);
    });
});

describe("GET /api/properties/:id", () => {
  test("returns a property", async () => {
    const property = {
      L_ListingID: "12345",
      L_Address: "123 Main St",
      L_City: "Los Angeles",
      L_SystemPrice: 500000,
    };

    pool.query.mockResolvedValueOnce([
      [property],
    ]);

    const response = await request(app)
      .get("/api/properties/12345");

    expect(response.status).toBe(200);
    expect(response.body.L_ListingID).toBe("12345");
  });

  test("returns 404 when property does not exist", async () => {
    pool.query.mockResolvedValueOnce([
      [],
    ]);

    const response = await request(app)
      .get("/api/properties/999999");

    expect(response.status).toBe(404);
  });
});

describe("GET /api/properties/:id/openhouses", () => {
  test("returns open houses", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ L_ListingID: "12345" }],
      ])
      .mockResolvedValueOnce([
        [
          {
            L_ListingID: "12345",
            OpenHouseDate: "2026-09-10",
            OH_StartTime: "10:00:00",
            OH_EndTime: "12:00:00",
          },
        ],
      ]);

    const response = await request(app)
      .get("/api/properties/12345/openhouses");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("returns empty array when there are no open houses", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ L_ListingID: "12345" }],
      ])
      .mockResolvedValueOnce([
        [],
      ]);

    const response = await request(app)
      .get("/api/properties/12345/openhouses");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("returns 404 for unknown property", async () => {
    pool.query.mockResolvedValueOnce([
      [],
    ]);

    const response = await request(app)
      .get("/api/properties/999999/openhouses");

    expect(response.status).toBe(404);
  });
});