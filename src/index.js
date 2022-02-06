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
      .catch(error => Notify.failure(`❌ ${error} Oops, there is no country with that name`));
  }, DEBOUNCE_DELAY),
);
// fetchCountries(name);

function renderCountriesList(countries) {
  console.log('~ countries', countries);

  const markup = countries
    .map(({ capital, flags: { svg }, languages, name: { official }, population }) => {
      if (countries.length === 1) {
        console.log(capital, svg, languages, official, population);
        // return `<li><svg class="flag" width="120px"><use href="${svg}"></use></svg><p>${official}</p></li>`;
        return `<li class="country"><img class="icon" src="${svg}" width="40px"><H3>${official}</H3><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population}</p><p><b>language:</b> ${Object.values(
          languages,
        )}</p></li>`;
      }
      return `<li><svg class="flag" width="20px" height="20px"><use href="${svg}"></use></svg>${official}</li>`;
    })
    .join('');
  refs.ulItems.innerHTML = markup;
  console.log('~ markup', markup);
}
