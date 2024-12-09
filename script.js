"use strict";

const API = "217a1e0869debe933b067e4380b1446d";

const dayEL = document.querySelector(".default_day");
const dateEL = document.querySelector(".default_date");
const btnEL = document.querySelector(".btn_search");
const inputEL = document.querySelector(".input_field");
const dayInfoEL = document.querySelector(".day_info");
const iconContainer = document.querySelector(".icons");
const ListContentEL = document.querySelector(".list_content ul");

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrusday",
    "Friday",
    "Saturday",
];


const day = new Date();
const dayName = days[day.getDay()];
dayEL.textContent = dayName;


let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEL.textContent = `${date} ${month} ${year}`;


btnEL.addEventListener("click", (e) => {
    e.preventDefault();

    if (inputEL.value !== "") {
        const search = inputEL.value;
        inputEL.value = "";

        findLocation(search);
    } else {
        console.log("Please Enter City or Country Name");
    }
});

async function findLocation(name) {
    iconContainer.innerHTML = "";
    dayInfoEL.innerHTML = "";
    ListContentEL.innerHTML = ""; 

    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL);
        const result = await data.json();

        if (result.cod !== "404") {
            const imageContent = displayImageContent(result);
            const rightSide = rightSideContent(result);

            displayForecast(result.coord.lat, result.coord.lon);

            setTimeout(()=>{
                iconContainer.insertAdjacentHTML("afterbegin", imageContent);
                iconContainer.classList.add("fadeIn");
                dayInfoEL.insertAdjacentHTML("afterbegin", rightSide);
                dayInfoEL.classList.add("fadeIn");
            },1000);

           
        } else {
            const message = `<h2 class="weather_temp">${result.cod}</h2>
                             <h3 class="cloudtxt">${result.message}</h3>`;
            iconContainer.insertAdjacentHTML("afterbegin", message);
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
    }
}

function displayImageContent(data) {
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt=""/>
            <h2 class="weather_temp">${Math.round(data.main.temp - 273.15)}°C</h2>
            <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function rightSideContent(result) {
    return `<div class="content">
                <p class="title">Name</p>
                <span class="value">${result.name}</span>
            </div>
            <div class="content">
                <p class="title">Temp</p>
                <span class="value">${Math.round(result.main.temp - 273.15)}°C</span>
            </div>
            <div class="content">
                <p class="title">Humidity</p>
                <span class="value">${result.main.humidity}%</span>
            </div>
            <div class="content">
                <p class="title">Wind Speed</p>
                <span class="value">${result.wind.speed} km/h</span>
            </div>`;
}

async function displayForecast(lat, long) {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    try {
        const data = await fetch(ForeCast_API);
        const result = await data.json();

        const uniqueForecastDays = [];
        const daysForecast = result.list.filter((forecast) => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return true;
            }
            return false; 
        });

        
        const limitedForecast = daysForecast.slice(0, 4);

        
        limitedForecast.forEach((content) => {
            ListContentEL.insertAdjacentHTML("beforeend", forecast(content));
        });
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

function forecast(frContent) {
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()].slice(0, 3); 

    return `<li>
                <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" alt="Weather Icon"/>
                <span>${dayName}</span>
                <span class="day_temp">${Math.round(frContent.main.temp - 273.15)}°C</span>
            </li>`;
}
