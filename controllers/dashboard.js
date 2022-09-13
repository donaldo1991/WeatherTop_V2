"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");
const stationAnalytics = require("../utils/station-analytics");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const stations = stationStore.getUserStations(loggedInUser.id)
    for(const station of stations){
      if(station.readings.length !== 0) {
        station.currentWeather = stationAnalytics.getCurrentWeather(station);
        station.currentTempInC = station.readings[station.readings.length - 1].temp;
        station.currentTempInF = ((Math.round(((station.readings[station.readings.length - 1].temp) * 1.8) + 32) * 100) / 100).toFixed(2);
        station.maxTemp = stationAnalytics.getMaxTemp(station);
        station.minTemp = stationAnalytics.getMinTemp(station);
        station.currentWindSpeed = stationAnalytics.getCurrentWindSpeed(station);
        station.currentWindDirection = stationAnalytics.getCurrentWindDirection(station);
        station.currentWindChill = stationAnalytics.getCurrentWindChill(station).toFixed(2);
        station.maxWind = stationAnalytics.getMaxWind(station);
        station.minWind = stationAnalytics.getMinWind(station);
        station.currentPressure = station.readings[station.readings.length - 1].pressure;
        station.maxPressure = stationAnalytics.getMaxPressure(station);
        station.minPressure = stationAnalytics.getMinPressure(station);
        station.currentWeatherIcon = stationAnalytics.getCurrentWeatherIcon(station);
        station.tempTrend = stationAnalytics.getTempTrend(station);
        station.windTrend = stationAnalytics.getWindTrend(station);
        station.pressureTrend = stationAnalytics.getPressureTrend(station);
      }
    }
    const viewData = {
      title: "Station Dashboard",
      stations: stations,
    };
    logger.info("about to render", stationStore.getAllStations());
    response.render("dashboard", viewData);
  },

  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationStore.removeStation(stationId);
    response.redirect("/dashboard");
  },

  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      readings: []
    };
    logger.debug("Creating a new Station", newStation);
    stationStore.addStation(newStation);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
