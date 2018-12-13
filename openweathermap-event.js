const Request = require('request');

// Constructor

function WeatherData() {

    this._updating = false;

    this._data = null;
    this._dataOld = null;

    this._init = false;

    this._apiKey = null;
    this._method = null;
    this._unit = "default";

    this._town = null;
    this._cityId = null;
    this._coord =  {lon: 0.0, lat: 0.0};

    this.CallTab = [];
    this.Events = [];
}

WeatherData.prototype.init = function(defaults) {
    return new Promise((resolve, reject) => {
        if (!defaults.hasOwnProperty("ApiKey"))
            reject("ApiKey is mandatory.");
        else
            this._apiKey = defaults.ApiKey;

        if (!defaults.hasOwnProperty("Method"))
            reject("Method is mandatory.");
        else
            this._method = defaults.Method;

        if (defaults.hasOwnProperty("ApiKey"))
            this._unit = defaults.Unit;

        if (defaults.hasOwnProperty("Town"))
            this._town = defaults.Town;

        if (defaults.hasOwnProperty("Coordinates"))
            this._coord = defaults.Coordinates;

        if (defaults.hasOwnProperty("CityId"))
            this._cityId = defaults.CityId;

        this.CallTab["name"] = this.getDataFromTown;
        this.CallTab["id"] = this.getDataFromId;
        this.CallTab["coord"] = this.getDataFromCoord;

        this._init = true;

        resolve(true);
    });
};

// Event Handler

WeatherData.prototype.on = function(event, check, action) {
    return new Promise((resolve, reject) => {
        // check if func
        // reject
        this.Events.push({ Check: check, Action: action });
        resolve(event);
    });
};

WeatherData.prototype.checkEvents = function(weatherData) {
    return new Promise((resolve, reject) => {
        this.Events.forEach(function(elem) {
            elem.Check(weatherData._data, weatherData._dataOld)
                .then(res => {
                    elem.Action(res);
                })
                .catch(err => {
                });
        });
    });
};

// Updaters

WeatherData.prototype.update = function() {
    return new Promise((resolve, reject) => {
        if (this._updating)
            reject("Already updating");

        if (!this._init)
            reject("Not Initialized");

        this._updating = true;

        this.CallTab[this._method](this, "weather")
            .then((data) => {
                if (this._data !== null)
                    this._dataOld = this._data;
                this._data = data;

                if (this._dataOld !== null)
                    this.checkEvents(this)
                        .then(() => {
                            this._updating = false;
                            resolve(data);
                        })
                        .catch(err => {
                            reject(err);
                        });

                this._updating = false;
                resolve(data);
            })
            .catch((err) => {
                this._updating = false;
                reject(err);
            });
    });
};

WeatherData.prototype.getDataFromTown = function(data, call, cnt) {
    return new Promise((resolve, reject) => {
        if (data._town === null)
            reject("Town field is not filled.");
        else
        {
            let request =
                "https://api.openweathermap.org/data/2.5/" + call + "?" +
                "q=" + data._town +
                "&appid=" + data._apiKey +
                "&units=" + data._unit;

            if (call === "daily")
                request += "&cnt=" + cnt;

            Request(request, { json: true }, (err, res, body) => {
                if (err)
                    reject(err);
                resolve(body);
            });
        }
    });
};

WeatherData.prototype.getDataFromId = function(data, call, cnt) {
    return new Promise((resolve, reject) => {
        if (data._cityId === null)
            reject("TownId field is not filled.");
        else {
            let request =
                "https://api.openweathermap.org/data/2.5/" + call + "?" +
                "id=" + data._cityId +
                "&appid=" + data._apiKey +
                "&units=" + data._unit;

            if (call === "daily")
                request += "&cnt=" + cnt;

            Request(request, { json: true }, (err, res, body) => {
                if (err)
                    reject(err);
                resolve(body);
            });
        }
    });
};

WeatherData.prototype.getDataFromCoord = function(data, call, cnt) {
    return new Promise((resolve, reject) => {
        if (data._coord === null)
            reject("Coordinates field is not filled.");
        else {
            let request =
                "https://api.openweathermap.org/data/2.5/" + call + "?" +
                "lat=" + data._coord.lat +
                "&lon=" + data._coord.lon +
                "&appid=" + data._apiKey +
                "&units=" + data._unit;

            if (call === "daily")
                request += "&cnt=" + cnt;

            Request(request, { json: true }, (err, res, body) => {
                if (err)
                    reject(err);
                resolve(body);
            });
        }
    });
};

WeatherData.prototype.getForecast = function() {
    return new Promise((resolve, reject) => {
        if (!this._init)
            reject("Not Initialized");

        this.CallTab[this._method](this, "forecast")
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

WeatherData.prototype.getDailyForecast = function(cnt) {
    return new Promise((resolve, reject) => {
        if (!this._init)
            reject("Not Initialized");

        this.CallTab[this._method](this, "daily", cnt)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// Getters

WeatherData.prototype.getData = function() {
    return this._data;
};

module.exports = WeatherData;

