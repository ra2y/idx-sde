const express = require("express");
const cors = require("cors");
const propertiesRouter = require("./routes/properties");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

app.use("/api/properties", propertiesRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = app;