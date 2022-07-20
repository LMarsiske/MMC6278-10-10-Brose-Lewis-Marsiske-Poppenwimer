const brewSection = document.getElementById('brewery-section')
const form = document.querySelector('form')
const brewSearch = document.getElementById('brewery-search')
const brewResults = document.getElementById('breweries-resp')

form.onsubmit = async b => {
    b.preventDefault()

    const inputValue = brewSearch.value
    if (!inputValue) return
    try{
        const res = await fetch(`https://api.openbrewerydb.org/breweries/search?query=${inputValue}&per_page=3`)

        console.log(res)

        if (res.status !== 200) throw new Error('Location Not Found')
        const brewery = await res.json()
        listBreweries(brewery)

        console.log(brewery)
        console.log(brewery[0].name)
        console.log(brewery[1])
        console.log(brewery[2])
    }
    catch(err){
        brewResults.innerHTML = err.message
        brewSearch.value = ""
    }
}

function listBreweries([{
        name,
        brewery_type,
        street,
        city,
        state,
        postal_code,
        phone,
        longitude,
        latitude
}]) {
    brewSearch.value = ""
    brewResults.innerHTML = `<h3>${name}</h3>
    <h4>Brewery Type: ${brewery_type}</h4>
    <p>Address:</p>
    <p>${street}</p>
    <p>${city}, ${state} ${postal_code}</p>
    <p>Phone: ${phone}</p>    
    `
}