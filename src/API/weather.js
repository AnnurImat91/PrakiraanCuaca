  const weatherTranslations = {
    "Sunny": "Cerah",
    "Partly Cloudy": "Sebagian berawan",
    "Cloudy": "Berawan",
    "Overcast": "Mendung",
    "Mist": "Berkabut",
    "Patchy rain nearby": "Hujan merata di dekatnya",
    "Patchy rain possible": "Hujan ringan mungkin",
    "Patchy snow possible": "Salju ringan mungkin",
    "Patchy sleet possible": "Hujan es ringan mungkin",
    "Thundery outbreaks in nearby": "Petir Menggelegar di dekatnya",
    "Cloudy" : "Berawan",
    "Patchy freezing drizzle possible": "Gerimis beku mungkin",
    "Thundery outbreaks possible": "Mungkin ada badai petir",
    "Blowing snow": "Badai salju",
    "Blizzard": "Badai salju lebat",
    "Fog": "Kabut",
    "Freezing fog": "Kabut beku",
    "Patchy light drizzle": "Gerimis ringan",
    "Partly Cloudy": "Sebagian Berawan",
    "Light drizzle": "Gerimis",
    "Freezing drizzle": "Gerimis beku",
    "Heavy freezing drizzle": "Gerimis beku lebat",
    "Patchy light rain": "Hujan ringan mungkin",
    "Light rain": "Hujan ringan",
    "Moderate rain at times": "Hujan sedang sesekali",
    "Moderate rain": "Hujan sedang",
    "Heavy rain at times": "Hujan lebat sesekali",
    "Heavy rain": "Hujan lebat",
    "Light freezing rain": "Hujan beku ringan",
    "Moderate or heavy freezing rain": "Hujan beku sedang atau lebat",
    "Light sleet": "Hujan es ringan",
    "Moderate or heavy sleet": "Hujan es sedang atau lebat",
    "Patchy light snow": "Salju ringan mungkin",
    "Light snow": "Salju ringan",
    "Patchy moderate snow": "Salju sedang mungkin",
    "Moderate snow": "Salju sedang",
    "Patchy heavy snow": "Salju lebat mungkin",
    "Heavy snow": "Salju lebat",
    "Ice pellets": "Bola es",
    "Light rain shower": "Hujan ringan",
    "Moderate or heavy rain shower": "Hujan sedang atau lebat",
    "Torrential rain shower": "Hujan deras",
    "Light sleet showers": "Hujan es ringan",
    "Moderate or heavy sleet showers": "Hujan es sedang atau lebat",
    "Light snow showers": "Hujan salju ringan",
    "Moderate or heavy snow showers": "Hujan salju sedang atau lebat",
    "Light showers of ice pellets": "Hujan bola es ringan",
    "Moderate or heavy showers of ice pellets": "Hujan bola es sedang atau lebat",
    "Patchy light rain with thunder": "Hujan ringan dengan petir",
    "Moderate or heavy rain with thunder": "Hujan sedang atau lebat dengan petir",
    "Patchy light snow with thunder": "Salju ringan dengan petir",
    "Moderate or heavy snow with thunder": "Salju sedang atau lebat dengan petir"
  };

  async function getWeather(location) {
    const apiKey = "6f3bf7a06a84400a8c1181835232108"; // API Key WeatherAPI
    if (!location) {
      alert("Masukkan lokasi terlebih dahulu!");
      return;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        alert("Lokasi tidak ditemukan!");
        return;
      }

      // **Ambil teks kondisi cuaca dan terjemahkan**
      let conditionText = data.current.condition.text;
      let translatedCondition = weatherTranslations[conditionText.trim()] || conditionText; // Gunakan terjemahan jika tersedia, jika tidak pakai aslinya

      // **Tampilkan informasi cuaca saat ini**
      document.getElementById("city").innerText = `Cuaca di ${data.location.name}, ${data.location.country}`;
      document.getElementById("current-weather").innerHTML = `
                <img src="https:${data.current.condition.icon}" alt="${conditionText}" width="60" height="60">
                <br>
                <strong>${translatedCondition}</strong>
                <br>
                Suhu Saat Ini: ${data.current.temp_c}°C<br>
                Terasa Seperti: ${data.current.feelslike_c}°C<br>
                Kelembaban: ${data.current.humidity}%<br>
                Awan: ${data.current.cloud}%<br>
                Indeks UV: ${data.current.uv}
            `;

      // **FILTER DATA PRAKIRAAN CUACA PER JAM**
      let currentHour = new Date().getHours(); // Ambil jam sekarang (0-23)
      let minHour = currentHour - 3;
      let maxHour = currentHour + 5;

      let forecastHTML = "<ul>";
      data.forecast.forecastday[0].hour.forEach((hour) => {
        let hourData = new Date(hour.time).getHours();

        if (hourData >= minHour && hourData <= maxHour) {
          let hourCondition = hour.condition.text;
          let translatedHourCondition = weatherTranslations[hourCondition] || hourCondition;

          forecastHTML += `
                    <li style="list-style: none;">
                        <strong>${hour.time.split(" ")[1]}</strong>: 
                        <img src="https:${hour.condition.icon}" alt="${hourCondition}" width="40" height="40">
                        ${hour.temp_c}°C, 
                        Angin: ${hour.wind_kph} kph, 
                        Hujan: ${hour.chance_of_rain}%, 
                        Kondisi: ${translatedHourCondition}
                    </li>
                `;
        }
      });
      forecastHTML += "</ul>";

      document.getElementById("forecast").innerHTML = forecastHTML;
    } catch (error) {
      console.error("Gagal mengambil data cuaca:", error);
      alert("Terjadi kesalahan. Coba lagi nanti.");
    }
  }
