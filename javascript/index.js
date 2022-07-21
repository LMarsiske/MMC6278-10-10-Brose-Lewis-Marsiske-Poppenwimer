//When user clicks the button, a random joke is generated from the Joke API
var jokeBtn = document.getElementById('joke-btn')
var newJoke = document.createElement('p')
var newSection = document. getElementById('new-section')
jokeBtn.onclick = function(e) {
    e.preventDefault()
    console.log('clicked')
    newJoke.textContent = 'Joke api'
    newSection.appendChild(newJoke)
}
// JS still in progress


