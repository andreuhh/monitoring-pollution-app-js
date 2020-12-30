import { html } from 'lit-html';
import { header } from './header';
import { body } from './body';

const app = () => html`
    <div id="app">
      ${header()}
      ${body()}
    </div>
`;

export {
  app
}