const brewSection = document.getElementById("brewery-section");
const form = document.querySelector("form");
const brewSearch = document.getElementById("brewery-search");
const brewResults = document.getElementById("breweries-resp");
const locationIQ_token = "pk.1edb9e195fddf5bd03898c8052521649";
let states_dictionary = null;
let currentLocation = null;

form.onsubmit = async (b) => {
  b.preventDefault();
  let position = null;

  const inputValue = brewSearch.value;
  brewSearch.value = "";
  if (!inputValue) return;

  let zipMatch = inputValue.match(/\b\d{5}\b/g);
  console.log(zipMatch);

  if (zipMatch) {
    position = await geoCode("zip", zipMatch[0]).catch((e) =>
      displayError("Could not find location")
    );
  } else {
    if (inputValue.split(",").length !== 2) {
      displayError("Please enter a valid search");
    } else {
      position = await geoCode("city_state", inputValue.split(",")).catch((e) =>
        displayError("Could not find location")
      );
    }
  }

  if (position) {
    searchBreweriesByPosition();
  }
};

const displayBreweries = (breweries) => {
  console.log(currentLocation);
  brewSearch.value = "";
  let container = document.createElement("div");
  let showingNear = document.createElement("h2");
  showingNear.innerHTML = `Showing you results near ${currentLocation.address.city}, ${currentLocation.address.state}`;
  container.appendChild(showingNear);
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

const displayError = (e) => {
  brewResults.innerHTML = e;
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

const geoCode = async (type, query) => {
  console.log(type, query);
  return new Promise(async (resolve, reject) => {
    let res = null;
    let json = null;
    try {
      switch (type) {
        case "zip":
          res = await fetch(
            `https://us1.locationiq.com/v1/search?key=${locationIQ_token}&country=us&postalcode=${query}&format=json`
          );
          console.log(res);
          json = await res.json();
          if (json.error) {
            reject(json.error);
          }
          let postCodes = json.filter((el) => el.type === "postcode");
          console.log(postCodes);
          if (postCodes.length === 1) {
            await reverseGeocode([postCodes[0].lat, postCodes[0].lon]);
            resolve(true);
          } else {
            console.log("rejecting");
            reject();
          }
          break;
        case "city_state":
          console.log("about to refine query: ", refineQuery);
          let refined = refineQuery(query);
          if (!refined) reject();
          let [city, state] = refined;
          console.log("test");
          console.log(refined);
          res = await fetch(
            `https://us1.locationiq.com/v1/search?key=${locationIQ_token}&country=us&city=${city}&state=${state}&format=json`
          );
          console.log(res);
          json = await res.json();
          console.log(json);
          if (json.error) {
            reject(json.error);
          }
          if (json.length === 1) {
            console.log(json[0]);
            await reverseGeocode([json[0].lat, json[0].lon]);
            resolve(true);
          } else {
            reject();
          }
          break;
      }
    } catch (e) {
      reject(e);
    }
  });
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

const refineQuery = (props) => {
  let [city, state] = props.map((el) => el.trim().toLowerCase());
  console.log(city, state);
  console.log("refining: ", states_dictionary);
  let found = states_dictionary.find(
    (el) => el.name === state || el.abbreviation === state
  );
  console.log(!!found);
  return found ? [city, found.name] : null;
};

document.body.onload = async (e) => {
  let jsonRes = await fetch("javascript/states_dictionary.json");
  states_dictionary = await jsonRes.json();
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
