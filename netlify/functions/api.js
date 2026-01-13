const API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

export default async (request, context) => {
    const { text, language } = await request.json();

    if (!text || !language) {
        return Response.json({ error: 'Missing text or language' }, { status: 400 })
    }

    const messages = [
        {
            role: 'system',
            content: `You are a translator. Translate the user's text to ${language}. Only respond with the translation, nothing else.`
        },
        {
            role: 'user',
            content: text
        }
    ]

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                messages: messages,
                temperature: 1,
                max_tokens: 1000
            })
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenAI API error')
        }

        return Response.json({
            translation: data.choices[0].message.content
        }, { status: 200 })
    } catch (err) {
        return Response.json({
            error: err.message 
        }, { status: 500 })
    }
}

export const config = {
    path: "/api/translate"
}