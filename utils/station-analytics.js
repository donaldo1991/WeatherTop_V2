"use strict";

const math = require("lodash");
const stationAnalytics = {
  getCurrentWeather(station) {
    const map = new Map();
    map.set(100,"Clear");
    map.set(200,"Partial Clouds");
    map.set(300,"Cloudy");
    map.set(400,"Light Showers");
    map.set(500,"Heavy Showers");
    map.set(600,"Rain");
    map.set(700,"Snow");
    map.set(800,"Thunder");
    if(station.readings.length > 0){
      return map.get(station.readings[station.readings.length - 1].code);
    }
  },

  getCurrentWeatherIcon(station) {
    const map = new Map();
    map.set(100,"sun icon");
    map.set(200,"cloud sun icon");
    map.set(300,"cloud icon");
    map.set(400,"cloud sun rain icon");
    map.set(500,"cloud showers heavy icon");
    map.set(600,"cloud rain icon");
    map.set(700,"snowflake icon");
    map.set(800,"bolt icon");
    if(station.readings.length > 0){
      return map.get(station.readings[station.readings.length - 1].code);
    }
  },

  getMaxTemp(station) {
    let values = [];
    for (let i = 0; i < station.readings.length; i++){
      values[i] = station.readings[i].temp;
    }
    return math.max(values);
  },

  getMinTemp(station) {
    let values = [];
    for (let i = 0; i < station.readings.length; i++){
      values[i] = station.readings[i].temp;
    }
    return math.min(values);
  },

  getCurrentWindSpeed(station) {
    let windspeed = math.round(station.readings[station.readings.length - 1].wind_speed);
    if (windspeed === 0) {
      return 0;
    } else if (windspeed >= 1 && windspeed <= 6) {
      return 1;
    } else if (windspeed >= 7 && windspeed <= 11) {
      return 2;
    } else if (windspeed >= 12 && windspeed <= 19) {
      return 3;
    } else if (windspeed >= 20 && windspeed <= 29) {
      return 4;
    } else if (windspeed >= 30 && windspeed <= 39) {
      return 5;
    } else if (windspeed >= 40 && windspeed <= 50) {
      return 6;
    } else if (windspeed >= 51 && windspeed <= 62) {
      return 7;
    } else if (windspeed >= 63 && windspeed <= 75) {
      return 8;
    } else if (windspeed >= 76 && windspeed <= 87) {
      return 9;
    } else if (windspeed >= 88 && windspeed <= 102) {
      return 10;
    } else if (windspeed >= 103 && windspeed <= 117) {
      return 11;
    } else if (windspeed >= 117) {
      return 12;
    }
  },

  getCurrentWindDirection(station) {
    let deg = math.round(station.readings[station.readings.length - 1].wind_direction);
    if (deg > 11.25 && deg <= 33.75) {
      return "North North East";
    } else if (deg > 33.75 && deg <= 56.25) {
      return "East North East";
    } else if (deg > 56.25 && deg <= 78.75) {
      return "East";
    } else if (deg > 78.75 && deg <= 101.25) {
      return "East South East";
    } else if (deg > 101.25 && deg <= 123.75) {
      return "East South East";
    } else if (deg > 123.75 && deg <= 146.25) {
      return "South East";
    } else if (deg > 146.25 && deg <= 168.75) {
      return "South South East";
    } else if (deg > 168.75 && deg <= 191.25) {
      return "South";
    } else if (deg > 191.25 && deg <= 213.75) {
      return "South South West";
    } else if (deg > 213.75 && deg <= 236.25) {
      return "South West";
    } else if (deg > 236.25 && deg <= 258.75) {
      return "West South West";
    } else if (deg > 258.75 && deg <= 281.25) {
      return "West";
    } else if (deg > 281.25 && deg <= 303.75) {
      return "West North West";
    } else if (deg > 303.75 && deg <= 326.25) {
      return "North West";
    } else if (deg > 326.25 && deg <= 348.75) {
      return "North North West";
    } else {
      return "North";
    }
  },

  getCurrentWindChill(station) {
    let temp = math.round(station.readings[station.readings.length - 1].temp);
    let windspeed = math.round(station.readings[station.readings.length - 1].wind_speed);
    return 13.12 + 0.6215 * temp -  11.37 * (Math.pow(windspeed, 0.16)) + 0.3965 * temp * (Math.pow(windspeed, 0.16));
  },

  getMaxWind(station) {
    let values = [];
    for (let i = 0; i < station.readings.length; i++){
      values[i] = station.readings[i].wind_speed;
    }
    return math.max(values);
  },

  getMinWind(station) {
    let values = [];
    for (let i = 0; i < station.readings.length; i++){
      values[i] = station.readings[i].wind_speed;
    }
    return math.min(values);
  },

  getMaxPressure(station) {
    let values = [];
    for (let i = 0; i < station.readings.length; i++){
      values[i] = station.readings[i].pressure;
    }
    return math.max(values);
  },

  getMinPressure(station) {
    let values = [];
    for (let i = 0; i < station.readings.length; i++){
      values[i] = station.readings[i].pressure;
    }
    return math.min(values);
  },

  getTempTrend(station) {
  let trend = 0;
  let values = [];
  if (station.readings.length > 2) {
    for (let i = 0; i < station.readings.length; i++){
      values[i] = station.readings[station.readings.length - (i+1)].temp;
    }
    trend = this.calcTrend(values);
      if(trend == -1){
        return "arrow down icon";
      } else if(trend == 1){
        return "arrow up icon";
      } else {
        return "arrows alternate horizontal icon"
      }
    }
  },

  getWindTrend(station) {
    let trend = 0;
    let values = [];
    if (station.readings.length > 2) {
      for (let i = 0; i < station.readings.length; i++){
        values[i] = station.readings[station.readings.length - (i+1)].wind_speed;
      }
      trend = this.calcTrend(values);
      if(trend == -1){
        return "arrow down icon";
      } else if(trend == 1){
        return "arrow up icon";
      } else {
        return "arrows alternate horizontal icon"
      }
    }
  },

  getPressureTrend(station) {
    let trend = 0;
    let values = [];
    if (station.readings.length > 2) {
      for (let i = 0; i < station.readings.length; i++){
        values[i] = station.readings[station.readings.length - (i+1)].pressure;
      }
      trend = this.calcTrend(values);
      if(trend == -1){
        return "arrow down icon";
      } else if(trend == 1){
        return "arrow up icon";
      } else {
        return "arrows alternate horizontal icon"
      }
    }
  },

  calcTrend(values){
  let trend = 0;
    if (values.length > 2) {
      if (( values[2] > values[1] ) && (values[1] > values[0])) {
        trend = -1;
      } else if (( values[2] < values[1] ) && (values[1] < values[0])) {
        trend = 1;
      }
    }
  return trend;
  }

};

module.exports = stationAnalytics;
