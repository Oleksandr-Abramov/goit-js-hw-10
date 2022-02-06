import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  ulItems: document.querySelector('.country-list'),
};

refs.input.addEventListener(
  'input',
  debounce(e => {
    const inputValue = e.target.value.trim();
    fetchCountries(inputValue)
      .then(countries => renderCountriesList(countries))
      .catch(error => {
        refs.ulItems.innerHTML = '';
        Notify.failure(`❌ ${error} Oops, there is no country with that name`);
      });
  }, DEBOUNCE_DELAY),
);

function renderCountriesList(countries) {
  if (countries.length > 10) {
    Notify.success(`Too many matches found. Please enter a more specific name`);
    return;
  }

  const markup = countries
    .map(({ capital, flags: { svg }, languages, name: { official }, population }) => {
      if (countries.length === 1) {
        return `<li class="li"><div class="country"><img class="icon" src="${svg}" width="40px"><H3>${official}</H3></div><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population}</p><p><b>language:</b> ${Object.values(
          languages,
        )}</p></li>`;
      }

      return `<li class="country"><img class="icon" src="${svg}" width="40px"><H4>${official}</H4></li>`;
    })
    .join('');

  refs.ulItems.innerHTML = markup;
}
