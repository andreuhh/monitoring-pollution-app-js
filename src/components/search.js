import { html } from 'lit-html';
import { doSearch, checkLocation } from './body';


const search = (userValue = '') => html`
    <form onsubmit="return false" class="form-inline">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value=${userValue}
        @keyup=${doSearch}>
      <button class="btn btn-outline-success my-2 my-sm-0" type="button" @click=${checkLocation}>Search</button>
    </form>
`;

export {
  search
}