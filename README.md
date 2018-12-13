# openweathermap-event
An nodejs event based wrapper for openweathermap.org

## How to Use

### Initialisation

At least one of Town, CityId, or Coordinates must be set.

openweathermap.org recommend using CityId.
```
const WeatherData = require("./openweathermap-event");
const Events = require("./openweathermap-events");

data = new WeatherData();

data.init({
    ApiKey: "your-api-key",
    Town: "Stockholm,SE",
    CityId: 2673730,
    Coordinates: {lon: 18.07, lat: 59.33},
    Unit: "metric", // metric (Celsius), imperial (Fahrenheit), default (Kelvin)
    Method: "name" // name, id, coord
})
    .then(() => {
      // your code
    })
    .catch(err => {
        console.error(err);
    });

```

### Update

Calling update() will update the stored data with real time weather info, you can get it using the method : getData()

Note that if you've registered Events using the on() method described below they will be triggered during update()
```
data.update()
    .then(res => {
        console.log(res); // you can also use data.getData()
    })
    .catch(err => {
        console.error(err);
    });
```

### Events

The first parameter doesn't have any purpose right now.

The second is a function that check if changes append between calls.

The third is called if changes append.

Exemples of what these two functions look like can be found in openweathermap-events.js

I will implement more later.
```
data.on("OnTempChange", Events.CheckOnTempChange, Events.OnTempChange);
```

### Forecast

You can get weather forecast by calling getForecast()

getDailyForecast is broken right now, I'll fix it later

```
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


```

## TODO

* Find what is wrong with daily forecast

## Thanks

* openweathermap.org for their api

## Authors

* **Nathan Hautbois** - [Waether](https://github.com/Waether)
