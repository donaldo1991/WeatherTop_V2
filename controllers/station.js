"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const stationAnalytics = require("../utils/station-analytics");
const uuid = require("uuid");

const station = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug("Station id = ", stationId);
    const station = stationStore.getStation(stationId);
    const viewData = {
      title: "Station",
      station: station,
      currentWeather : stationAnalytics.getCurrentWeather(station),
      currentTempInC : station.readings[station.readings.length - 1].temp,
      currentTempInF : ((Math.round(((station.readings[station.readings.length - 1].temp)*1.8)+32)*100)/100).toFixed(2),
      maxTemp : stationAnalytics.getMaxTemp(station),
      minTemp : stationAnalytics.getMinTemp(station),
      currentWindSpeed : stationAnalytics.getCurrentWindSpeed(station),
      currentWindDirection : stationAnalytics.getCurrentWindDirection(station),
      currentWindChill : stationAnalytics.getCurrentWindChill(station).toFixed(2),
      maxWind : stationAnalytics.getMaxWind(station),
      minWind : stationAnalytics.getMinWind(station),
      currentPressure : station.readings[station.readings.length - 1].pressure,
      maxPressure : stationAnalytics.getMaxPressure(station),
      minPressure : stationAnalytics.getMinPressure(station),
      currentWeatherIcon : stationAnalytics.getCurrentWeatherIcon(station),
      tempTrend : stationAnalytics.getTempTrend(station),
      windTrend : stationAnalytics.getWindTrend(station),
      pressureTrend : stationAnalytics.getPressureTrend(station)
    };
    response.render("station", viewData);
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);
  },

  addReading(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const current = new Date();
    const newReading = {
      id: uuid.v1(),
      date_time: current.toLocaleDateString()+" "+current.toLocaleTimeString(),
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      wind_speed: Number(request.body.wind_speed),
      wind_direction: Number(request.body.wind_direction),
      pressure: Number(request.body.pressure)
    };
    logger.debug("New Reading = ", newReading);
    stationStore.addReading(stationId, newReading);
    response.redirect("/station/" + stationId);
  }
};

module.exports = station;
