const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { message, chatHistory } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    const messages = chatHistory.map(chat => ({
        role: chat.type === 'user-msg' ? 'user' : 'system',
        content: chat.message
    }));
    messages.push({ role: "user", content: message });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages,
                max_tokens: 150
            })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ response: data.choices[0].message.content.trim() })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching response from OpenAI' })
        };
    }
};
