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
    console.log("GET / - Backend health check");
    res.send("Backend is live! You can submit your assessment.");
});

// Route to handle assessment submissions
app.post("/submit", (req, res) => {
    const { name, email, content, submittedAt } = req.body;

    console.log("POST /submit - Incoming submission:", req.body);

    // Validate that all fields are provided
    if (!name || !email || !content || !submittedAt) {
        console.error("Validation error: Missing required fields");
        return res.status(400).json({ 
            message: "Validation failed. All fields (name, email, content, submittedAt) are required." 
        });
    }

    try {
        // Save submission
        submissions.push({ 
            name, 
            email, 
            content, 
            submittedAt: new Date(submittedAt) // Ensures the date is stored in a proper format
        });

        console.log("Submission saved successfully:", { name, email, submittedAt });
        res.status(200).json({ 
            message: "Submission saved successfully.", 
            submission: { name, email, submittedAt } 
        });
    } catch (error) {
        console.error("Error saving submission:", error);
        res.status(500).json({ 
            message: "An error occurred while saving the submission. Please try again later." 
        });
    }
});

// Route to retrieve all submissions (optional, for viewing data during debugging)
app.get("/submissions", (req, res) => {
    console.log("GET /submissions - Returning all submissions");
    res.status(200).json({
        total: submissions.length,
        data: submissions
    });
});

// 404 Handler for undefined routes
app.use((req, res) => {
    console.error("404 Error - Undefined route accessed:", req.originalUrl);
    res.status(404).json({ 
        message: "The requested route does not exist. Please check your URL." 
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
