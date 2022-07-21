const brewSection = document.getElementById("brewery-section");
const form = document.querySelector("form");
const brewSearch = document.getElementById("brewery-search");
const brewResults = document.getElementById("breweries-resp");

form.onsubmit = async (b) => {
  b.preventDefault();

  const inputValue = brewSearch.value;
  if (!inputValue) return;
  try {
    const res = await fetch(
      `https://api.openbrewerydb.org/breweries/search?query=${inputValue}`
    );

    console.log(res);

    if (res.status !== 200) throw new Error("Location Not Found");
    const breweries = await res.json();
    console.log(breweries);
    listBreweries(breweries);

    // console.log(brewery)
    // console.log(brewery[0].name)
    // console.log(brewery[1])
    // console.log(brewery[2])
  } catch (err) {
    brewResults.innerHTML = err.message;
    brewSearch.value = "";
  }
};

const listBreweries = (breweries) => {
  let container = document.createElement("div");
  breweries.forEach((brewery) => {
    const {
      name,
      brewery_type,
      street,
      city,
      state,
      postal_code,
      phone,
      longitude,
      latitude,
    } = brewery;
    let formattedPhone = phone
      ? `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`
      : "No phone number available";
    let info = document.createElement("div");
    info.className = "brewery";
    let breweryName = document.createElement("h3");
    breweryName.style.fontWeight = "bold";
    breweryName.textContent = name;

    let breweryType = document.createElement("p");
    breweryType.textContent = `Brewery type: ${brewery_type}`;

    let phoneNum = document.createElement("a");
    let phoneText = document.createElement("p");
    phoneText.innerHTML = formattedPhone;

    if (phone) {
      phoneNum.href = `tel:${phone}`;
    }
    phoneNum.appendChild(phoneText);

    let mapLink = document.createElement("a");
    let mapLinkText = document.createElement("p");
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    mapLink.target = "_blank";
    mapLinkText.innerHTML = `${street} ${city}, ${state} ${postal_code}`;
    mapLink.appendChild(mapLinkText);

    info.replaceChildren(breweryName, breweryType, phoneNum, mapLink);
    container.appendChild(info);
  });
  brewResults.replaceChildren(container);
};
