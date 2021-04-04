const functionForJSON = (responseObject) => responseObject.json();

const runApplication = () => {};

const handleErrors = () => {};

const requestServerData = (url, whatFunction) => {
  fetch(url).then(functionForJSON).then(whatFunction).catch(handleErrors);
};

const onReady = () => {};

const renderCityCard = (dataFromServer) => {
  console.log(dataFromServer);
};

const renderForecast = (city) => {};

const requestCityCurrentWeather = (city) => {
  const myURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1`;
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
