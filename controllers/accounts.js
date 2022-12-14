"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("playlist", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("playlist", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return userstore.getUserByEmail(userEmail);
  },

  editUser(request,response) {
    const viewData = {
      title: "Edit User Details"
    };
    response.render("user", viewData);
  },

  editUserDetails(request,response) {
    const currentUser = userstore.getUserByEmail(request.cookies.playlist);
    if(currentUser.email === request.cookies.playlist) {
      if(request.body.firstname){currentUser.firstName = request.body.firstname}
      if(request.body.surname){currentUser.lastName = request.body.surname}
      if(request.body.email){currentUser.email = request.body.email}
      if(request.body.password){currentUser.password = request.body.password}
    }
    const viewData = {
      title: "Edit User Details"
    };
    response.render("dashboard", viewData);
  },

};

module.exports = accounts;
