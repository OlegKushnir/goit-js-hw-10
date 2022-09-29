import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
inputRef.addEventListener('input', debounce(onInputName, DEBOUNCE_DELAY));

function onInputName(evt) {
  const searchedCountry = evt.target.value.trim();
  if (searchedCountry === '') {
    countryList.innerHTML = '';
    return;
  }
  fetchCountries(searchedCountry)
    .then(countries => renderCountries(countries))
    .catch(error => {
      console.dir(error);
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function renderCountries(countries) {
  console.log(countries.length);
  if (countries.length === 1) {
    const markup = countries
      .map(country => {
        return `<li>
      <img 
    src="${country.flags.svg}"
    alt="${country.name.official} flag" width=80 heigth=60>
    <span> ${country.name.official}</span>
    <p><b>Capital</b>: ${country.capital}</p>
      <p><b>Population</b>: ${country.population}</p>
      <p><b>Languages</b>: ${Object.values(country.languages).join(', ')}</p>
    </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
    return;
  }
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    countryList.innerHTML = '';
  } else {
    const markup = countries
      .map(country => {
        return `<li>
      <img 
    src="${country.flags.svg}"
    alt="${country.name.official} flag" width=40 heigth=40>
    <span> ${country.name.official}</span>
    </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
  }
}
