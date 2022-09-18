export class Question {
    static create(question) {
        return fetch('https://podcast-onlyjs-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application.json'
            }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            })
            .then(addToLocalStorage)
            .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve(`<p class="error">You don't have token</p>`)
        }
        return fetch(`https://podcast-onlyjs-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {

                if (response === null) {
                    return `<p class="error">Don't have questions</p>`
                } else if (response.error) {
                    return `<p class="error">You don't have token</p>`
                }
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
    }

    static renderList() {
        const questions = getQuestionFromLocalStorage()

        const html = questions.length
            ? questions.map(toCard).join('')
            : `<div className="mui--text-headline">Me don't have you question</div>`
        const list = document.getElementById('list')
        list.innerHTML = html

    }

    static listToHTML(questions) {
        return questions.length
            ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')} </ol>`
            : `<p>Don't have  </p>`
    }
}

function addToLocalStorage(question) {
    const all = getQuestionFromLocalStorage()
    all.push(question)
    localStorage.setItem('question', JSON.stringify(all))
}

function getQuestionFromLocalStorage() {
    return JSON.parse(localStorage.getItem('question') || '[]')
}

function toCard(question) {
    return `
    <div class="mui--text-black-54">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}

    </div>
    <div> ${question.text}</div>
    <br>`
}


