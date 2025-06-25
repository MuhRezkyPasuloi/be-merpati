const express = require("express");
const router = express.Router();
const db = require("../config");

router.post("/", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM login WHERE username = ? AND password = ?", [username, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(401).json({ message: "Login failed" });
    res.json({ message: "Login successful", user: result[0] });
  });
});

module.exports = router;
