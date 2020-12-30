import { html, render } from 'lit-html';
import { app } from './components/app';
import 'bootstrap';
import './styles/main.scss';


// Render nel DOM dei template
const doRender = () => {
    render(app(), document.querySelector('.container'));
}

// I render successivi al primo avverrano ogni volta che lanciamo questo evento
document.addEventListener('update-render', doRender);
// Il primo render deve avvenire quando tutta la pagina HTML è pronta
document.addEventListener('DOMContentLoaded', doRender);