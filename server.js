require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.messages[0].content;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: userMessage }] }] }
        );

        res.json({ reply: response.data.candidates[0].content.parts[0].text || "I'm sorry, I didn't understand that." });
    } catch (error) {
        console.error("API Request Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        } else if (error.request) {
            console.error("Request data:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        res.status(500).json({ error: "Error communicating with Google Gemini API. Please try again later." });
    }
});

app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});