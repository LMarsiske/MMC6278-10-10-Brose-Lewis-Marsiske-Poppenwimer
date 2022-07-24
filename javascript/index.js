var newJoke = document.getElementById('joke')
console.log(joke)
var newAnswer = document.getElementById('answer')
console.log(joke)
var joke = null
var timeStamp = null
var btn = document.getElementById('home-btn')

btn.onclick = async () => {
    let response = await fetch("https://api.jokes.one/jod").catch(e => {console.log(e)})
    if (response.status !== 200) {
        //use same handling error
    }
    let responseJson = await response.json()
    //let jokeObject = responseJson.contents.jokes[0].joke
    console.log(responseJson) 
}



/*document.body.onload = async() => {
let storeJoke = localStorage.getItem('storeJoke')
let lastFetch = localStorage.getItem('lastFetch')
if (storeJoke && lastFetch) {
    joke = await JSON.parse(storeJoke)
    timeStamp = await JSON.parse(lastFetch)
}
let currentTimeStamp = Date.now()
if (currentTimeStamp >= timeStamp + 86400000) {
    let response = await fetch("https://api.jokes.one/jod").catch(e => {console.log(e)})
    if (response.status !== 200) {
        //use same handling error
    }
    let responseJson = await response.json()
    //let jokeObject = responseJson.contents.jokes[0].joke
    console.log(responseJson)
    timeStamp = currentTimeStamp

    
}
}*/
