const cityInput = document.getElementById("cityInput");

const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");

const temperature = document.getElementById("temperature");

const description = document.getElementById("description");

const wind = document.getElementById("wind");

const time = document.getElementById("time");

const error = document.getElementById("error");


// Get Coordinates
async function getCoordinates(city){

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
  );

  const data = await response.json();

  if(!data.results){

    throw new Error("City not found");
  }

  return data.results[0];
}


// Get Weather
async function getWeather(lat, lon){

  const response = await fetch(

    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`

  );

  return await response.json();
}


// Main Function
async function searchWeather(){

  try{

    error.textContent = "";

    const city = cityInput.value.trim();

    if(city === ""){

      error.textContent = "Please enter city name";

      return;
    }

    // Coordinates
    const location = await getCoordinates(city);

    // Weather
    const weatherData = await getWeather(
      location.latitude,
      location.longitude
    );

    // Display Data
    cityName.textContent = location.name;

    temperature.textContent =
      `${weatherData.current_weather.temperature}°C`;

    wind.textContent =
      `${weatherData.current_weather.windspeed} km/h`;

    time.textContent =
      weatherData.current_weather.time;

    // Weather Code
    const code =
      weatherData.current_weather.weathercode;

    if(code === 0){

      description.textContent = "Clear Sky ☀️";

    }

    else if(code <= 3){

      description.textContent = "Cloudy ☁️";

    }

    else if(code <= 67){

      description.textContent = "Rainy 🌧️";

    }

    else{

      description.textContent = "Weather Unknown";
    }

  }

  catch(err){

    error.textContent = err.message;
  }

}


searchBtn.addEventListener("click", searchWeather);


cityInput.addEventListener("keypress", function(e){

  if(e.key === "Enter"){

    searchWeather();
  }

});