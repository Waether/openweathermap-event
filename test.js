const WeatherData = require("./openweathermap-event");
const Events = require("./openweathermap-events");

data = new WeatherData();

data.init({
    ApiKey: "your-api_key",
    Town: "Stockholm,SE",
    CityId: 2673730,
    Coordinates: {lon: 18.07, lat: 59.33},
    Unit: "metric", // metric (Celsius), imperial (Fahrenheit), default (Kelvin)
    Method: "name" // name, id, coord
})
    .then(() => {
        data.on("OnTempChange", Events.CheckOnTempChange, Events.OnTempChange);

        data.update()
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            });

        data.getForecast()
            .then(res => {
//                console.log(res);
            })
            .catch(err => {
                console.error(err);
            });

        // Doesn't work right now
//        data.getDailyForecast(16)
//            .then(res => {
//                console.log(res);
//            })
//            .catch(err => {
//                console.error(err);
//            });
    })
    .catch(err => {
        console.error(err);
    });

