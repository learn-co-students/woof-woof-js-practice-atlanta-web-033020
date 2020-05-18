const DOGS_URL = "http://localhost:3000/pups"

document.addEventListener("DOMContentLoaded", () => {
    getDogs();
    addFilterButton();

})

function getDogs() {
    fetch(DOGS_URL)
        .then(res => res.json())
        .then(data => renderDogs(data))
}

function renderDogs(data) {
    let dogBar = document.querySelector("#dog-bar")
    data.forEach((dog) => {
        let dogSpan = document.createElement("span")

        dogSpan.innerText = dog.name
        dogBar.appendChild(dogSpan)
        dogEventListener(dog, dogSpan);
    })

}

function dogEventListener(dog, dogSpan) {
    dogSpan.addEventListener("click", () => {
        let infoDiv = document.getElementById("dog-info")
        infoDiv.innerHTML = ""
            //img
        let dogImg = document.createElement("img");
        dogImg.src = dog.image;
        infoDiv.appendChild(dogImg)
            //name 
        let dogName = document.createElement("h2")
        dogName.innerText = dog.name
        infoDiv.appendChild(dogName)
            //button 
        let dogButton = document.createElement("button")
        if (dog.isGoodDog) {
            dogButton.innerText = "Good Dog!"
        } else {
            dogButton.innerText = "Bad Dog!"
        }
        dogButton.addEventListener("click", (e) => {
            let value = "";
            if (e.target.innerText == "Good Dog!") {
                e.target.innerText = "Bad Dog!"
                value = false
            } else {
                e.target.innerText = "Good Dog!"
                value = true
            }
            fetch(`${DOGS_URL}/${dog.id}`, {
                method: 'PATCH',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ isGoodDog: value })
            })
        })
        infoDiv.appendChild(dogButton)



    })
}

function addFilterButton() {
    let button = document.getElementById("good-dog-filter");
    button.addEventListener("click", (e) => {
        if (e.target.innerText.includes("OFF")) {
            fetch(DOGS_URL)
                .then(res => res.json())
                .then(data => filterDogs(data))
            e.target.innerText = "Filter good dogs: ON"
        } else {
            let dogBar = document.getElementById("dog-bar")
            dogBar.innerHTML = ""
            getDogs();
            e.target.innerText = "Filter good dogs: OFF"
        }

    })

}

function filterDogs(data) {
    let dogBar = document.getElementById("dog-bar")
    dogBar.innerHTML = ""
    data.forEach((dog) => {
        if (dog.isGoodDog) {
            let dogSpan = document.createElement("span")

            dogSpan.innerText = dog.name
            dogBar.appendChild(dogSpan)
            dogEventListener(dog, dogSpan)
        }
    })
}