const express = require("express");
const pool = require("../db");

const router = express.Router();

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// GET /api/openhouses?startDate=2026-09-01&endDate=2026-09-30
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required",
      });
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        message: "Dates must use YYYY-MM-DD format",
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        message: "startDate cannot be after endDate",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        oh.L_ListingID,
        oh.OpenHouseDate,
        oh.OH_StartTime,
        oh.OH_EndTime,
        oh.all_data,
        p.L_Address,
        p.L_City,
        p.L_State,
        p.L_SystemPrice
      FROM rets_openhouse AS oh
      LEFT JOIN rets_property AS p
        ON oh.L_ListingID = p.L_ListingID
      WHERE oh.OpenHouseDate BETWEEN ? AND ?
      ORDER BY oh.OpenHouseDate ASC, oh.OH_StartTime ASC
      `,
      [startDate, endDate]
    );

    return res.json(rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to load open houses",
    });
  }
});

module.exports = router;