const functionForJSON = (responseObject) => responseObject.json();

const runApplication = () => {};

const handleErrors = () => {};

const requestServerData = (url, whatFunction) => {
  fetch(url).then(functionForJSON).then(whatFunction).catch(handleErrors);
};

const onReady = () => {};

const renderCityCard = (dataFromServer) => {
  $("#current-weather").append(`<h2 class="my-2 p-2">
  ${
    dataFromServer.name
  } <span>date </span><span><img src="http://openweathermap.org/img/w/${
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
  <span class="bg-danger p-2 rounded">placeholder UV Index</span>
</p>`);
};

const renderForecast = (city) => {};

const requestCityCurrentWeather = (city) => {
  const myURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
  requestServerData(myURL, renderCityCard);
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
    renderForecast(currentCity);
  }
};

$("document").ready(onReady);
$("#search-city").on("click", searchCityWeather);
