const BASE_URL = 'http://localhost:3000/pups';

document.addEventListener('DOMContentLoaded', init);

const filterStates = {
  'Filter good dogs: OFF': 'Filter good dogs: ON',
  'Filter good dogs: ON': 'Filter good dogs: OFF'
}

function init() {
  fetchDogs();
  setupFilterDogs();
}

function fetchDogs() {
  fetch(BASE_URL)
    .then(response => response.json())
    .then(dogs => findFilteredDogs(dogs));
}

function renderDogBar(dogs) {
  const dogBar = document.querySelector('#dog-bar');

  while (dogBar.lastChild) {
    dogBar.lastChild.remove();
  }

  dogs.forEach(dog => renderDogBarElement(dog, dogBar))
}

function renderDogBarElement(dog, container) {
  const dogInfoContainer = document.querySelector('#dog-info')
  const dogSpan = document.createElement('span');
  dogSpan.innerText = dog.name;
  dogSpan.addEventListener('click', () => renderDogInfo(dog, dogInfoContainer))

  container.appendChild(dogSpan);
}

function renderDogInfo(dog, container) {
  while (container.lastChild) {
    container.lastChild.remove();
  }

  const dogImage = document.createElement('img');
  dogImage.src = dog.image;

  const dogHeader = document.createElement('h2');
  dogHeader.innerText = dog.name;

  const dogButton = document.createElement('button');
  dogButton.innerText = dog.isGoodDog ? "Good Dog" : "Bad Dog";
  dogButton.addEventListener('click', () => toggleDogStatus(dog))

  container.append(dogImage, dogHeader, dogButton);
}

function toggleDogStatus(dog) {
  const container = document.querySelector('#dog-info')

  fetchObj = {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'isGoodDog': !dog.isGoodDog
    })
  }

  fetch(`${BASE_URL}/${dog.id}`, fetchObj)
    .then(response => response.json())
    .then(dog => renderDogInfo(dog, container))
}

function setupFilterDogs() {
  filterButton = document.querySelector('#good-dog-filter');
  filterButton.addEventListener('click', () => {
    filterButton.innerText = filterStates[filterButton.innerText];
    fetchDogs();
  })
}

function findFilteredDogs(dogs) {
  const filterButton = document.querySelector('#good-dog-filter');

  if (filterButton.innerText === 'Filter good dogs: ON')
    renderDogBar(dogs.filter(dog => dog.isGoodDog === true));
  else
    renderDogBar(dogs)
}