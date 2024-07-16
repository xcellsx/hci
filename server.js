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
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api-key', async (req, res) => {
    try {
        const apiKey = await getSecret('hci-iteration2', 'openai');
        res.json({ apiKey });
    } catch (error) {
        console.error('Failed to retrieve API key:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
