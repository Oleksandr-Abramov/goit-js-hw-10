import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
let markup = '';
const refs = {
  input: document.querySelector('#search-box'),
  ulItems: document.querySelector('.country-list'),
};

refs.input.addEventListener('input', debounce(postInputApi, DEBOUNCE_DELAY));

function postInputApi() {
  const inputValue = refs.input.value.trim();

  if (inputValue === '') {
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        return toMachCoutries(countries);
      }
      if (countries.length === 1) {
        return oneCountry(countries);
      }
      listCountries(countries);
      // renderCountriesList(countries)
    })
    .catch(error => {
      refs.ulItems.innerHTML = '';
      Notify.failure(`❌ ${error} Oops, there is no country with that name`);
    });
}

function toMachCoutries() {
  Notify.success(`Too many matches found. Please enter a more specific name`);
  return;
}

function oneCountry(countries) {
  markup = countries
    .map(
      ({ capital, flags: { svg }, languages, name: { official }, population }) =>
        `<li class="li"><div class="country"><img class="icon" src="${svg}" width="40px"><H3>${official}</H3></div><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population}</p><p><b>language:</b> ${Object.values(
          languages,
        )}</p></li>`,
    )
    .join('');
  renderCountreisList();
}

function listCountries(countries) {
  markup = countries
    .map(
      ({ flags: { svg }, name: { official } }) =>
        `<li class="country"><img class="icon" src="${svg}" width="40px"><H4>${official}</H4></li>`,
    )
    .join('');
  renderCountreisList();
}

function renderCountreisList() {
  refs.ulItems.innerHTML = markup;
}
