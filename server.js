const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function getSecret(projectId, secretId) {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${secretId}/versions/latest`,
    });
    const payload = version.payload.data.toString('utf8');
    return payload;
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Securely return the OpenAI API key
app.get('/api-key', (req, res) => {
  res.json({ apiKey: process.env.OPENAI_API_KEY });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
