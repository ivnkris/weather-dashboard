const functionForJSON = (responseObject) => responseObject.json();

const runApplication = () => {
  console.log("data downloaded");
};

const handleErrors = () => {
  console.log("something went wrong");
};

const requestServerData = (url) => {
  fetch(url).then(functionForJSON).then(runApplication).catch(handleErrors);
};

const onReady = () => {
  const myURL =
    "http://api.openweathermap.org/data/2.5/weather?q=birmingham&appid=524c8c0dbcbfa8a1202c6a2b9d272ee1";
  requestServerData(myURL);
};

$("document").ready(onReady);
