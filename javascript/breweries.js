const brewSection = document.getElementById("brewery-section");
const form = document.querySelector("form");
const brewSearch = document.getElementById("brewery-search");
const brewResults = document.getElementById("breweries-resp");
const locationIQ_token = "pk.1edb9e195fddf5bd03898c8052521649";
let currentLocation = null;

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
    displayBreweries(breweries);

    // console.log(brewery)
    // console.log(brewery[0].name)
    // console.log(brewery[1])
    // console.log(brewery[2])
  } catch (err) {
    brewResults.innerHTML = err.message;
    brewSearch.value = "";
  }
};

const displayBreweries = (breweries) => {
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

const searchBreweriesByPosition = async (position) => {
  const { lat, lon } = currentLocation;
  const res = await fetch(
    `https://api.openbrewerydb.org/breweries?by_dist=${lat},${lon}`
  ).catch((e) => displayError(e));
  if (res.status !== 200) displayError("Could not find location");
  let breweries = await res.json();
  console.log(breweries);
  displayBreweries(breweries);
};

const reverseGeocode = async ([latitude, longitude]) => {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${locationIQ_token}&lat=${latitude}&lon=${longitude}&format=json`
    );

    let location = await res.json();
    console.log(location);
    currentLocation = location;
    resolve(true);
  });
};

document.body.onload = async (e) => {
  if (navigator.geolocation) {
    console.log("we have geolocation");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log(position);
        await reverseGeocode([
          position.coords.latitude,
          position.coords.longitude,
        ]),
          searchBreweriesByPosition();
      },
      (error) => console.log(error)
    );
  }
};
