var newJoke = document.getElementById('joke')
console.log(joke)
var newAnswer = document.getElementById('answer')
var jokeTitle = document.getElementById('joke-title')
console.log(joke)
var joke = null
var timeStamp = null
var btn = document.getElementById('home-btn')

const fetchJoke = async () => {
    let response = await fetch("https://icanhazdadjoke.com",{headers:{'Accept':'application/json'}}).catch(e => {console.log(e)})
    console.log(response)
    if (response.status !== 200) {
        newJoke.innerHTML = "We aren't feeling very humorous right now. Please try again later!"
        return
    }
    let responseJson = await response.json()
    console.log(responseJson)

    //show joke and answer in p tags
    newJoke.innerHTML = responseJson.joke
}

btn.onclick = fetchJoke
document.body.onload = fetchJoke

// HAMBURGER MENU

const menu = document.querySelector(".hamburger-menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger= document.querySelector(".hamburger-btn");
const closeIcon= document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    closeIcon.style.display = "none";
    menuIcon.style.display = "block";
  } else {
    menu.classList.add("showMenu");
    closeIcon.style.display = "block";
    menuIcon.style.display = "none";
  }
}

hamburger.addEventListener("click", toggleMenu);

menuItems.forEach( 
  function(menuItem) { 
    menuItem.addEventListener("click", toggleMenu);
  }
)

