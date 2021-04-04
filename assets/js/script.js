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

const searchCityWeather = (event) => {
  event.preventDefault();
  console.log("clicked");
};

$("document").ready(onReady);
$("#search-city").on("click", searchCityWeather);
