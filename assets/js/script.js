const functionForJSON = (responseObject) => responseObject.json();

const handleErrors = () => {};

const requestServerData = (url, whatFunction) => {
  fetch(url).then(functionForJSON).then(whatFunction).catch(handleErrors);
};

const renderSearchCards = (array) => {
  $("#search-cards-container").empty();
  const renderCard = (index) => {
    const cityName = array[index];
    $("#search-cards-container").append(
      `<li class="list-group-item">${cityName}</li>`
    );
  };
  $(array).each(renderCard);
};

const onReady = () => {
  const previousSearchesMemory = localStorage.getItem("previousSearches");
  if (previousSearchesMemory !== null) {
    let previousSearchesArray = JSON.parse(previousSearchesMemory);
    renderSearchCards(previousSearchesArray);
  }
};

const addCityToSearches = (city) => {
  const previousSearchesMemory = localStorage.getItem("previousSearches");
  let previousSearchesArray = [];
  if (previousSearchesMemory !== null) {
    previousSearchesArray = JSON.parse(previousSearchesMemory);
  }
  previousSearchesArray.unshift(city);
  if (previousSearchesArray.length > 10) {
    previousSearchesArray.pop();
  }
  const uploadToMemory = JSON.stringify(previousSearchesArray);
  localStorage.setItem("previousSearches", uploadToMemory);
  renderSearchCards(previousSearchesArray);
};

const renderCityCard = (dataFromServer) => {
  $("#current-weather").empty();
  const currentDate = moment().format("L");
  $("#current-weather").append(`<h2 class="my-2 p-2">
  ${
    dataFromServer.name
  } <span>(${currentDate}) </span><span><img src="http://openweathermap.org/img/w/${
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
      <p><span><img src="http://openweathermap.org/img/w/${dataFromServer.daily[i].weather[0].icon}.png"></span></p>
      <p>Temp: <span>${dataFromServer.daily[i].temp.day} °C</span></p>
      <p>Humidity: <span>${dataFromServer.daily[i].humidity}%</span></p>
    </div>
  </div>`);
  }
};

const requestCityForecast = (lonLatObject) => {
  const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lonLatObject.lat}&lon=${lonLatObject.lon}&units=metric&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
  requestServerData(forecastURL, renderForecast);
};

const requestCityCurrentWeather = (city) => {
  const currentDayURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
  requestServerData(currentDayURL, renderCityCard);
  addCityToSearches(city);
};

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

$("document").ready(onReady);
$("#search-city").on("click", searchCityWeather);
