/* eslint-disable import/extensions */
import { Library } from "./model.js";
import View from "./view.js";
import Controller from "./controller.js";

const model = new Library("My Library");
const view = new View();
// eslint-disable-next-line no-unused-vars
const app = new Controller(model, view);
