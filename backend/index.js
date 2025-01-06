const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory database for storing submissions (use a real database in production)
const submissions = [];

// Route to handle assessment submissions
app.post("/submit", (req, res) => {
    const { name, email, content, submittedAt } = req.body;

    if (!name || !email || !content || !submittedAt) {
        return res.status(400).json({ message: "All fields are required." });
    }

    submissions.push({ name, email, content, submittedAt });
    res.status(200).json({ message: "Submission saved successfully." });
});

// Route to retrieve submissions (optional, for viewing data)
app.get("/submissions", (req, res) => {
    res.status(200).json(submissions);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

