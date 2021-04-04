const functionForJSON = (responseObject) => responseObject.json();

const handleErrors = () => {};

const requestServerData = (url, whatFunction) => {
  fetch(url).then(functionForJSON).then(whatFunction).catch(handleErrors);
};

const onReady = () => {};

const renderCityCard = (dataFromServer) => {
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
};

const requestCityForecast = (lonLatObject) => {
  const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lonLatObject.lat}&lon=${lonLatObject.lon}&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
  requestServerData(forecastURL, renderForecast);
};

const requestCityCurrentWeather = (city) => {
  const currentDayURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
  requestServerData(currentDayURL, renderCityCard);
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
