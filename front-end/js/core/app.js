"use strict";

import "@JS/core/bulma-wrapper";

import Vue from "vue";
import Vuex from "vuex";
window.Vue = Vue;
window.Vuex = Vuex;
Vue.use(Vuex);

import Axios from "axios";
window.Axios = Axios;
Axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";
