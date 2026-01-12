const textLabel = document.getElementById('text-label')
const translatedTextBox = document.getElementById('translated-text-box')
const languageEl = document.getElementById('language')
const submitBtn = document.getElementById('submit')
const resetBtn = document.getElementById('reset')

const translateForm = document.getElementById('translate')

document.getElementById('translate').addEventListener('submit', handleTranslate)

async function translate(text, language) {
    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, language })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Translation failed')
        }

        return data.translation
    } catch (err) {
        console.error('Translation Error:', err)
        throw err
    }
}

async function handleTranslate(e) {
    e.preventDefault()

    const translateFormData = new FormData(translateForm)

    const text = translateFormData.get('text')
    const language = translateFormData.get('language')

    try {
        const translation = await translate(text, language)
        textLabel.textContent = 'Original Text 👇'
        translatedTextBox.style.display = 'flex'
        languageEl.style.display = 'none'
        submitBtn.style.display = 'none'
        resetBtn.style.display = 'block'
        console.log(translation)
    } catch (err) {
        console.error('Failed to translate:', err)
    }
}