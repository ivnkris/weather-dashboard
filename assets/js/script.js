const functionForJSON = (responseObject) => responseObject.json();

const runApplication = () => {};

const handleErrors = () => {};

const requestServerData = (url) => {
  fetch(url).then(functionForJSON).then(runApplication).catch(handleErrors);
};

const onReady = () => {
  const myURL =
    "http://api.openweathermap.org/data/2.5/weather?q=birmingham&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1";
  requestServerData(myURL);
};

const renderCityCard = (city) => {
  console.log(city);
};

const renderForecast = (city) => {
  console.log(city);
};

const searchCityWeather = (event) => {
  event.preventDefault();
  const target = $(event.target);
  let currentCity = "";
  if (event.target.nodeName === "BUTTON") {
    const inputField = target.parent().children("input");
    currentCity = inputField.val();
    inputField.val("");
    renderCityCard(currentCity);
    renderForecast(currentCity);
  }
};

$("document").ready(onReady);
$("#search-city").on("click", searchCityWeather);
