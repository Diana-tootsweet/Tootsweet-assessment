const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory database for storing submissions (use a real database in production)
const submissions = [];

// Root route to confirm the backend is running
app.get("/", (req, res) => {
    res.send("Backend is live! You can submit your assessment.");
});

// Route to handle assessment submissions
app.post("/submit", (req, res) => {
    const { name, email, content, submittedAt } = req.body;

    // Validate that all fields are provided
    if (!name || !email || !content || !submittedAt) {
        return res.status(400).json({ 
            message: "Validation failed. All fields (name, email, content, submittedAt) are required." 
        });
    }

    // Save submission
    submissions.push({ 
        name, 
        email, 
        content, 
        submittedAt: new Date(submittedAt) // Ensures the date is stored in a proper format
    });

    res.status(200).json({ 
        message: "Submission saved successfully.", 
        submission: { name, email, submittedAt } 
    });
});

// Route to retrieve all submissions (optional, for viewing data during debugging)
app.get("/submissions", (req, res) => {
    res.status(200).json({
        total: submissions.length,
        data: submissions
    });
});

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ 
        message: "The requested route does not exist. Please check your URL." 
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
