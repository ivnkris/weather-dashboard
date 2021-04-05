/**
 * @description converts the server API object into JSON and throws an error if server status isn't 200
 * @returns server API object in JSON format
 */
const functionForJSON = (responseObject) => {
  if (responseObject.status !== 200) {
    throw new Error("Internal Server Error");
  }
  return responseObject.json();
};

/**
 * @description removes previous content from page and adds error message in case if server status isn't 200
 * @returns n/a
 */
const handleErrors = () => {
  $("#current-weather").empty();
  $("#weather-forecast").empty();
  $("#current-weather").append(`
  <h1>Oops! Something went wrong!</h1>
  <p>Check if the spelling of your city is correct. If the issue still persists the problem might be on our side and we are working on it to get it resolved as soon as possible.</p>`);
};

/**
 * @description fetches server data from selected API and runs asynchronous JavaScript logic
 * @returns n/a
 */
const requestServerData = (url, whatFunction) => {
  fetch(url).then(functionForJSON).then(whatFunction).catch(handleErrors);
};

/**
 * @description API server request to render current weather card
 * @returns n/a
 */
const requestCityCurrentWeather = (city) => {
  const currentDayURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
  requestServerData(currentDayURL, renderCityCard);
};

/**
 * @description allows user to return and render results from previous searches
 * @returns n/a
 */
const searchPreviousCity = (event) => {
  const target = $(event.target);
  let currentCity = target[0].innerHTML;
  requestCityCurrentWeather(currentCity);
};

/**
 * @description renders previous searches list items
 * @returns previous searches tab rendered in user's browser
 */
const renderSearchCards = (array) => {
  $("#search-cards-container").empty();
  const renderCard = (index) => {
    const cityName = array[index];
    $("#search-cards-container").append(
      `<li class="list-group-item">${cityName}</li>`
    );
  };
  $(array).each(renderCard);
  $("#search-cards-container").on("click", searchPreviousCity);
};

/**
 * @description on document load get data from local storage and render previous searches tab if there were any
 * @returns n/a
 */
const onReady = () => {
  const previousSearchesMemory = localStorage.getItem("previousSearches");
  if (previousSearchesMemory !== null) {
    let previousSearchesArray = JSON.parse(previousSearchesMemory);
    renderSearchCards(previousSearchesArray);
  }
};

/**
 * @description if city name hasn't been searched before it adds city to search bar
 * @returns latest search rendered in top of search bar within the browser
 */
const addCityToSearches = (city) => {
  const previousSearchesMemory = localStorage.getItem("previousSearches");
  let previousSearchesArray = [];
  if (previousSearchesMemory !== null) {
    previousSearchesArray = JSON.parse(previousSearchesMemory);
  }

  let cityAlreadyExist = false;

  const isExist = (index) => {
    if (previousSearchesArray[index] === city) {
      cityAlreadyExist = true;
    }
  };

  $(previousSearchesArray).each(isExist);

  if (cityAlreadyExist === false) {
    previousSearchesArray.unshift(city);
    if (previousSearchesArray.length > 10) {
      previousSearchesArray.pop();
    }
  }

  const uploadToMemory = JSON.stringify(previousSearchesArray);
  localStorage.setItem("previousSearches", uploadToMemory);
  renderSearchCards(previousSearchesArray);
};

/**
 * @description renders current weather section in user's browser
 * @returns current weather rendered in browser
 */
const renderCityCard = (dataFromServer) => {
  addCityToSearches(dataFromServer.name);
  $("#current-weather").empty();
  const currentDate = moment().format("L");
  $("#current-weather").append(`<h2 class="my-2 p-2">
  ${
    dataFromServer.name
  } <span>(${currentDate}) </span><span><img src="https://openweathermap.org/img/w/${
    dataFromServer.weather[0].icon
  }.png"></span>
</h2>
<p class="my-3 p-2">
  Temperature: <span>${dataFromServer.main.temp} °C</span>
</p>
<p class="my-3 p-2">Humidity: <span>${dataFromServer.main.humidity}%</span></p>
<p class="my-3 p-2">
  Wind Speed: <span>${
    Math.round(dataFromServer.wind.speed * 2.237 * 100) / 100
  } MPH</span>
</p>
<p class="my-3 p-2">
  UV Index:
  <span id="uv-index" class="p-2 rounded"></span>
</p>`);

  const lonLatObject = {
    lon: dataFromServer.coord.lon,
    lat: dataFromServer.coord.lat,
  };

  return requestCityForecast(lonLatObject);
};

/**
 * @description adds data for UVI index and renders next 5 days forecast
 * @returns UVI data and forecast cards rendered in user's browser
 */
const renderForecast = (dataFromServer) => {
  const uvIndex = dataFromServer.current.uvi;
  $("#uv-index").text(uvIndex);
  switch (true) {
    case uvIndex <= 2:
      $("#uv-index").addClass("bg-success");
      break;
    case 2 < uvIndex < 8:
      $("#uv-index").addClass("bg-warning");
      break;
    case uvIndex >= 8:
      $("#uv-index").addClass("bg-danger");
      break;
  }
  $("#weather-forecast").empty();
  $("#weather-forecast").append(`<h2>5-Day Forecast:</h2>
  <div class="d-flex flex-wrap" id="cards-container">
  </div>`);

  for (let i = 1; i < 6; i++) {
    const dayForecastDate = dataFromServer.daily[i].dt;
    const dayDate = moment(dayForecastDate * 1000).format("L");
    $("#weather-forecast").children().next().append(`<div class="card m-2">
    <div class="card-header">${dayDate}</div>
    <div class="card-body">
      <p><span><img src="https://openweathermap.org/img/w/${dataFromServer.daily[i].weather[0].icon}.png"></span></p>
      <p>Temp: <span>${dataFromServer.daily[i].temp.day} °C</span></p>
      <p>Humidity: <span>${dataFromServer.daily[i].humidity}%</span></p>
    </div>
  </div>`);
  }
};

/**
 * @description API server request for forecast data
 * @returns API server data object
 */
const requestCityForecast = (lonLatObject) => {
  const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lonLatObject.lat}&lon=${lonLatObject.lon}&units=metric&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
  requestServerData(forecastURL, renderForecast);
};

/**
 * @description manages click target and sends server request for entered city
 * @returns n/a
 */
const searchCityWeather = (event) => {
  event.preventDefault();
  const target = $(event.target);
  let currentCity = "";
  if (event.target.nodeName === "BUTTON") {
    const inputField = target.parent().children("input");
    currentCity = inputField.val();
    inputField.val("");
    requestCityCurrentWeather(currentCity);
  }
};

// on load get data from local storage and render previous searches tab
$("document").ready(onReady);

// on click onto the search button run main application
$("#search-city").on("click", searchCityWeather);
