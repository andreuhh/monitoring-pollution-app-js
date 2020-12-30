import { html } from 'lit-html';
import { search } from './search';
import smogIcon from '../img/smog.svg';

// Component STATELESS
const header = (title = 'AirPollutionApp') => html`

  <nav class="navbar navbar-light">
    <div class="navbarContainer">
      <a class="navbar-brand">${title}</a>
      <p>Real-time Air Quality data feed</p>
    </div>
    ${search()}
  </nav>
`;

export {
  header
}