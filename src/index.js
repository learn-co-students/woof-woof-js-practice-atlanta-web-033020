const BASE_URL = "http://localhost:3000/"
const PUPS_URL = BASE_URL + "pups/"
const DOG_BAR = document.querySelector("#dog-bar")
const DOG_INFO = document.querySelector("#dog-info")
const DOG_FILTER = document.querySelector("#good-dog-filter")

function initialize(){
    fetchPups(false)
    setUpFilter()
}

function fetchPups(filterStatus){
    fetch(PUPS_URL)
        .then(res => res.json())
        .then(pups => renderPups(pups, filterStatus))
}

function renderPups(pups, filterStatus){
    while(DOG_BAR.lastChild){
        DOG_BAR.removeChild(DOG_BAR.lastChild)
    }
    pups.forEach(pup => renderPup(pup, filterStatus))
}

function renderPup(pup, filterStatus){
    if(!filterStatus){
        writePup(pup)
    } else {
        if(pup.isGoodDog)
            writePup(pup)
    }
    
}

function writePup(pup){
    let dogNameSpan = document.createElement("span")
    dogNameSpan.innerText = pup.name
    dogNameSpan.addEventListener("click", () => fetchPup(pup.id))
    DOG_BAR.appendChild(dogNameSpan)
}

function fetchPup(id){
    fetch(PUPS_URL + id)
        .then(res => res.json())
        .then(pup => showPup(pup))
}

function showPup(pup){
    while(DOG_INFO.lastChild){
        DOG_INFO.removeChild(DOG_INFO.lastChild)
    }
    let dogImg = document.createElement("img")
    dogImg.src = pup.image
    DOG_INFO.appendChild(dogImg)

    let dogNameHeader = document.createElement("h2")
    dogNameHeader.innerText = pup.name
    DOG_INFO.appendChild(dogNameHeader)

    let goodDogButton = document.createElement("button")
    if(pup.isGoodDog)
        goodDogButton.innerText = "Good Dog!"
    else
        goodDogButton.innerText = "Bad Dog!"
    goodDogButton.addEventListener("click", ()=>toggleGoodDog(pup, goodDogButton))
    DOG_INFO.appendChild(goodDogButton)
}

function toggleGoodDog(pup, button){   

    fetch(PUPS_URL + pup.id, {
        method: "Put",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            name: pup.name,
            isGoodDog: !pup.isGoodDog,
            image: pup.image
        })
    })
        .then(res => res.json())
        .then(pup => {showPup(pup)})
}

function filterPups(){
    if(DOG_FILTER.innerText === "Filter good dogs: OFF"){
        DOG_FILTER.innerText = "Filter good dogs: ON"
        fetchPups(true)
    }
    else {
        DOG_FILTER.innerText = "Filter good dogs: OFF"
        fetchPups(false)
    }
}

function setUpFilter(){
    DOG_FILTER.addEventListener("click",() => filterPups())
}

initialize()