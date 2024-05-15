require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to  Photography Prompts API');
});

app.get('/photography-prompts', async (req, res) => {
    try {
        console.log('Received request for photography prompts');

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant that provides photography prompts" },
                { role: "user", content: "Generate 100 unique photography prompts for college students" }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 150000
        });

        console.log('Got response from OpenAIAPI');
        const prompts = response.data.choices[0].message.content;
        res.json({ prompts: prompts.split('\n\n') });
    } catch (error) {
        console.error('Error: ', error.toString());
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
