import { isValid, createModal } from './utils';
import {Question} from './question';
import './styles.css';
import { getAuthForm, authWithEmailAndPassword } from './auth';

const form = document.querySelector('#form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');
const modalBtn = document.querySelector('#modal-btn');

window.addEventListener('load',Question.renedrList());
form.addEventListener('submit',submitFormHandler);
input.addEventListener('input',()=>{
    submitBtn.disabled = !isValid(input.value);
});
modalBtn.addEventListener('click',openModal);

function submitFormHandler(event){
    event.preventDefault();
    if(isValid(input.value)){
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        };
        submitBtn.disabled = true;
        // Async request to server to save question
        Question.create(question).then(()=>{
            input.value = '';
            input.className = '';
            submitBtn.disabled = false;
        });
    }
}

function openModal(){
    createModal('Авторизация',getAuthForm());
    document.querySelector('#auth-form')
    .addEventListener('submit',authFormHandler,{once:true});
}

function renderModalAfterAuth(content){
    if(typeof content === 'string'){
        createModal('Ошибка',content)
    } else {
        createModal('Список вопрсоов', Question.ListToHTML(content))
    }
}

function authFormHandler(event){
    event.preventDefault();
    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;
    btn.disabled = true;
    authWithEmailAndPassword(email,password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(()=>btn.disabled=false);
}

