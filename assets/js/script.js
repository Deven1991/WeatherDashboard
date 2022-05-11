var cities = [];

var cityFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastHeader = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");

var formSumbitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });

        cityInputEl.value = "";
    } else {
        alert("Please Enter a Valid City!");
    }
    saveSearch();
}

var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function (city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=cb888a3ff2e15203b988ff3728172064`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayWeather(data, city);
            });
        });
};

var displayWeather = function (weather, searchCity) {
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    //Adds Date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MM/D/YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    //Adds Weather Icon
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    //Holds Temperature Data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    //Holds Wind Data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    //Holds Humidity Data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    //Attaches Temperature, Wind, and Humidity by City to Container
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(windSpeedEl);
    weatherContainerEl.appendChild(humidityEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon)
}

var getUvIndex = function (lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=cb888a3ff2e15203b988ff3728172064&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayUvIndex(data)
            });
        });
    console.log(lat);
    console.log(lon);
}

var displayUvIndex = function (index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate"
    }
    else if (index.value > 8) {
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    //Attaches UV Index by City to Container
    weatherContainerEl.appendChild(uvIndexEl);
}

var get5Day = function (city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=cb888a3ff2e15203b988ff3728172064`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                display5Day(data);
            });
        });
};