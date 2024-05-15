require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs').promises;


app.get('/', (req, res) => {
    res.send('Welcome to  Photography Prompts API');
});

async function generatePhotographyPrompts() {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant that provides photography prompts" },
                { role: "user", content: "Generate 50 unique photography prompts for college students. Separate them with newlines. Don't include any other newlines other than the separations between prompts" }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 150000
        });

        const prompts = response.data.choices[0].message.content;
        await fs.writeFile('prompts.txt', prompts);
        console.log('Prompts written to file');
    } catch (error) {
        console.error('Error: ', error.toString());
        throw error;
    }
}

app.get('/generate-prompts', async (req, res) => {
    try {
        console.log('Received request for photography prompts');
        res.status(200).json({ message: 'Generating photography prompts...' });

        await generatePhotographyPrompts();
    } catch (error) {
        console.error('Error: ', error.toString());
        // Handle the error appropriately (e.g., log it, notify the user, etc.)
    }
});

app.get('/fetch-prompts', async (req, res) => {
    try {
      const prompts = await fs.readFile('prompts.txt', 'utf8');
      res.status(200).json({ prompts: prompts.split('\n') });
    } catch (error) {
      console.error('Error: ', error.toString());
      res.status(500).json({ error: 'Failed to read prompts from file' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
