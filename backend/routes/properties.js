const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { city, zipcode, minPrice, maxPrice, beds, baths, limit = 20, offset = 0 } = req.query;
        
        const [countRows] = await pool.query("SELECT COUNT(*) AS total FROM rets_property");
        const total = countRows[0].total
        
        const parsedLimit = Number(limit);
        const parsedOffset = Number(offset)

        if (!(parsedLimit.isNaN) && Number.isInteger(parsedLimit) && parsedLimit > 0){
        } else {
            return res.status(400).json({
                message: "limit field is incorrect"
            })
        }
        if (!(parsedOffset.isNaN) && Number.isInteger(parsedOffset)) {
        } else {
            return res.status(400).json({
                message: "offset field is incorrect"
            })
        }
        if (city) {
            const normalizedCity = city.trim().toLowerCase()
        }
        const conditions = [];
        const values = [];
        res.json({
            message: "hai man you're all good"
        })
        // const [properties] = await pool.query(
        //     `
        //     SELECT *
        //     FROM rets_property
        //     LIMIT ?
        //     OFFSET ?
        //     `,
        //     [limit, offset]
        // );
        
        // res.json({
        //     total,
        //     limit,
        //     offset,
        //     results:properties,
        // })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;