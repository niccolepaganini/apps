const apiKey = 'bf842778675189639ac821c322426085';
const city = 'Almaty';
let units = 'metric';

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}&lang=ru`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.cod === 200) {
      displayWeather(data);
    } else {
      console.error('Ошибка в данных от API:', data);
      document.getElementById('today-weather').innerHTML = 'Ошибка загрузки данных о погоде';
    }
  })
  .catch(error => {
    console.error('Ошибка получения данных:', error);
    document.getElementById('today-weather').innerHTML = 'Ошибка загрузки данных о погоде';
  });

function displayWeather(data) {
  const todayDate = new Date();
  const todayDateStr = todayDate.toLocaleDateString('ru-RU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  document.getElementById('today-date').textContent = todayDateStr;
  document.getElementById('today-condition').textContent = data.weather[0].description;
  document.getElementById('today-temperature').textContent = `Температура: ${data.main.temp}°C`;
  document.getElementById('today-humidity').textContent = `Влажность: ${data.main.humidity}%`;
  document.getElementById('today-wind-speed').textContent = `Ветер: ${data.wind.speed} м/с`;
  document.getElementById('today-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

function toggleUnits() {
  units = units === 'metric' ? 'imperial' : 'metric';
  fetch(url);
}
