import {createModal, isValid} from './utils'
import {Question} from './question'
import './style.css'
import {authLogin, getAuthForm} from "./auth";

const form = document.getElementById('form')
const input = document.getElementById('questionInput')
const button = document.getElementById('submit')
const allBTN = document.getElementById("all-btn")

allBTN.addEventListener('click', openModal)
form.addEventListener('submit', submitFormHandler)
input.addEventListener('input', () => {
    button.disabled = !isValid(input.value)
})
window.addEventListener('load', Question.renderList)

function submitFormHandler(event) {
    event.preventDefault()
    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        button.disabled = true
        // Async request to server to save question
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            button.disabled = false
        })
    }

}


function openModal() {
    createModal('Login', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true

    authLogin(email, password)
        .then(token => {
            return Question.fetch(token)
        })
        .then(content => renderModalAfterAuth(content))
        .then(() => {
            btn.disabled = false
        })
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('ERROR',content)
    }else {
        createModal('List question',Question.listToHTML(content))
    }
}