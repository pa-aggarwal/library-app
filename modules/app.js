/* eslint-disable import/extensions */
import Library from "./model.js";
import View from "./view.js";
import Controller from "./controller.js";
import AppStorage from "./storage.js";

const model = new Library("My Library");
const view = new View();
const appStorage = new AppStorage();
// eslint-disable-next-line no-unused-vars
const app = new Controller(model, view, appStorage);
