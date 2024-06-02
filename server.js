const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle checkout form submission
app.post('/checkout', (req, res) => {
    const checkoutData = req.body;

    // Read existing data from JSON file
    fs.readFile('checkout-data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }

        let jsonData = [];
        if (data) {
            jsonData = JSON.parse(data);
        }

        // Add new checkout data
        jsonData.push(checkoutData);

        // Write updated data back to JSON file
        fs.writeFile('checkout-data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error saving data:', err);
                return res.status(500).json({ error: 'Failed to save data' });
            }
            res.status(200).json({ message: 'Checkout data saved successfully' });
        });
    });
});

// Route to handle chatbot responses
app.post('/get_response', (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log('Received message:', userMessage);

        // Basic response logic (replace with your actual chatbot logic)
        let botMessage;
        if (userMessage.toLowerCase().includes("hello")) {
            botMessage = "Hi there! How can I help you today?";
        } else if (userMessage.toLowerCase().includes("pain")) {
            botMessage = "For pain relief, you might consider using Paracetamol or Ibuprofen.";
        } else if (userMessage.toLowerCase().includes("cold")) {
            botMessage = "For cold and flu, you might try Pseudoephedrine or Guaifenesin.";
        } else {
            botMessage = "I'm not sure about that. Could you please provide more details?";
        }

        res.json({ bot_message: botMessage });
    } catch (error) {
        console.error('Error handling /get_response:', error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
