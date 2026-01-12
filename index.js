const translateForm = document.getElementById('translate')
const showTranslatedText = false
const showLanguages = true

const state = {
    translatedText: false,
    languages: true,
    submitBtn: true,
}

let textLabel = 'Text to translate 👇'

document.getElementById('translate').addEventListener('submit', handleTranslate)
document.getElementById('translate').addEventListener('reset', resetForm)

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
        const translation = 
        // 'comment vas-tu?'
        await translate(text, language)
        console.log(translation)
        textLabel = 'Original Text 👇'
        state.languages = false
        state.submitBtn = false
        state.translatedText = true
        renderForm()
        renderTranslatedText(text, translation)
    } catch (err) {
        console.error('Failed to translate:', err)
    }
}

function resetForm() {
    textLabel = 'Text to translate 👇'
    state.languages = true
    state.submitBtn = true
    state.translatedText = false
    renderForm()
    document.getElementById('text').disabled = false
}

function renderTranslatedText(originalText, translation) {
    document.getElementById('translated-text').value = translation
    document.getElementById('text').value = originalText
    document.getElementById('text').disabled = true
}

function renderForm() {
    let translatedTextBox = `
        <div id="translated-text-box">
            <label class="headings" for="translated-text">Your translation 👇</label>
            <textarea id="translated-text" name="translated-text" disabled></textarea>
        </div>
    `

    let languages = `
        <div id="language">
            <p class="headings">Select language 👇</p>
            <div id="language-choice">
                <div>
                    <input type="radio" id="french" name="language" value="french" checked>
                    <label for="french">French<span><img src="./assets/fr-flag.png"></span></label>
                </div>
                <div>
                    <input type="radio" id="spanish" name="language" value="spanish">
                    <label for="spanish">Spanish<span><img src="./assets/sp-flag.png"></span></label>
                </div>
                <div>
                    <input type="radio" id="japanese" name="language" value="japanese">
                    <label for="japanese">Japanese<span><img src="./assets/jpn-flag.png"></span></label>
                </div>
            </div>
        </div>
    `

    let button = state.submitBtn ? 
    `
        <button id="submit" type="submit">Translate</button>
    ` :
    `
        <button id="reset" type="reset">Start Over</button>
    `

    translateForm.innerHTML = `
        <div id="text-box">
            <label class="headings" for="text">${textLabel}</label>
            <textarea id="text" name="text"></textarea>
        </div>
        ${state.translatedText ? translatedTextBox : ''}
        ${state.languages ? languages : ''}
        ${button}
    `
}

renderForm()