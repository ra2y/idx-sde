const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      city,
      zipcode,
      minPrice,
      maxPrice,
      beds,
      baths,
      limit = 20,
      offset = 0,
    } = req.query;

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    if (
      Number.isNaN(parsedLimit) ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      return res.status(400).json({
        message: "limit must be an integer between 1 and 100",
      });
    }

    if (
      Number.isNaN(parsedOffset) ||
      !Number.isInteger(parsedOffset) ||
      parsedOffset < 0
    ) {
      return res.status(400).json({
        message: "offset must be an integer greater than or equal to 0",
      });
    }

    const conditions = [];
    const values = [];

    if (city !== undefined) {
      const trimmedCity = city.trim();

      if (trimmedCity.length === 0 || trimmedCity.length > 100) {
        return res.status(400).json({
          message: "city must be a non-empty string under 100 characters",
        });
      }

      conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
      values.push(trimmedCity);
    }

    if (zipcode !== undefined) {
      const trimmedZipcode = zipcode.trim();

      if (!/^\d{5}$/.test(trimmedZipcode)) {
        return res.status(400).json({
          message: "zipcode must be a 5-digit ZIP code",
        });
      }

      conditions.push("L_Zip = ?");
      values.push(trimmedZipcode);
    }

    if (minPrice !== undefined) {
      const parsedMinPrice = Number(minPrice);

      if (
        Number.isNaN(parsedMinPrice) ||
        parsedMinPrice < 0
      ) {
        return res.status(400).json({
          message: "minPrice must be a number greater than or equal to 0",
        });
      }

      conditions.push("L_SystemPrice >= ?");
      values.push(parsedMinPrice);
    }

    if (maxPrice !== undefined) {
      const parsedMaxPrice = Number(maxPrice);

      if (
        Number.isNaN(parsedMaxPrice) ||
        parsedMaxPrice < 0
      ) {
        return res.status(400).json({
          message: "maxPrice must be a number greater than or equal to 0",
        });
      }

      conditions.push("L_SystemPrice <= ?");
      values.push(parsedMaxPrice);
    }

    if (beds !== undefined) {
      const parsedBeds = Number(beds);

      if (
        Number.isNaN(parsedBeds) ||
        !Number.isInteger(parsedBeds) ||
        parsedBeds < 0
      ) {
        return res.status(400).json({
          message: "beds must be an integer greater than or equal to 0",
        });
      }

      conditions.push("L_Keyword2 >= ?");
      values.push(parsedBeds);
    }

    if (baths !== undefined) {
      const parsedBaths = Number(baths);

      if (
        Number.isNaN(parsedBaths) ||
        parsedBaths < 0
      ) {
        return res.status(400).json({
          message: "baths must be a number greater than or equal to 0",
        });
      }

      conditions.push("LM_Dec_3 >= ?");
      values.push(parsedBaths);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM rets_property ${whereClause}`,
      values
    );

    const [properties] = await pool.query(
      `
      SELECT *
      FROM rets_property
      ${whereClause}
      LIMIT ?
      OFFSET ?
      `,
      [...values, parsedLimit, parsedOffset]
    );

    res.json({
      total: countRows[0].total,
      limit: parsedLimit,
      offset: parsedOffset,
      results: properties,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;