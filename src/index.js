const BASE_URL = 'http://localhost:3000/pups/'

let filterStates = {
    "Filter good dogs: OFF": "Filter good dogs: ON",
    "Filter good dogs: ON": "Filter good dogs: OFF"
};

document.addEventListener('DOMContentLoaded', function (e){
    console.log('DOM Loaded')
    init()
})

function init(){
    fetchPupsToDogBar()
    filterDogs()
}

function fetchPupsToDogBar(){
   fetch(BASE_URL)
   .then(res => res.json())
   .then(function(dogs) {
       findAllDogs(dogs)
   })
}

function findAllDogs(dogs){
    const dogFilterBtn = document.getElementById('good-dog-filter')
    if (dogFilterBtn.innerText === "Filter good dogs: ON")
        renderDogsToBar(dogs.filter(dog => dog.isGoodDog === true))
    else 
        renderDogsToBar(dogs)
}

function renderDogsToBar(dogs){
    const parent = document.getElementById('dog-bar')
    while (parent.lastChild) {
        parent.lastChild.remove()
    }
    dogs.forEach(function(dog) {
        const dogSpan = document.createElement('span')
        dogSpan.innerHTML = dog.name
        dogSpan.addEventListener('click', () => {
            expandDog(dog)
        })
        parent.appendChild(dogSpan)
    })
}

function expandDog(dog){
    const parent = document.getElementById('dog-info')
    const dogImg = document.createElement('img')
    dogImg.src = dog.image
    const dogH2 = document.createElement('h2')
    dogH2.innerText = dog.name
    const dogBtn = document.createElement('button')
    dogBtn.innerText = dog.isGoodDog ? "Good dog" : "Bad dog"
    dogBtn.addEventListener('click', () => {
        toggleDog(dog)
    })
    while (parent.lastChild) {
        parent.lastChild.remove()
    }
    parent.append(dogImg, dogH2, dogBtn)
}

function toggleDog(dog){
    dog.isGoodDog = !dog.isGoodDog
    dogObj = {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dog)
    }
    fetch(BASE_URL + dog.id, dogObj)
    .then(res => res.json())
    .then(res => expandDog(res))
}

function filterDogs(){
    const filterBtn = document.getElementById('good-dog-filter')
    filterBtn.addEventListener('click', function(e){
        getToggleGoodDogsFilter(e)
    })
}

function getToggleGoodDogsFilter(e){
    let filterBtn = e.target
    filterBtn.innerText = filterStates[filterBtn.innerText]
    fetchPupsToDogBar()
}