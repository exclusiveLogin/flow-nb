import ls from "./storage.js";
import flowcalculator from "./flowcalculator.js";
import flowtest from "./intergrationtest.js";
import FloodLog from "./floodlog.js";

window.ls = new ls();
window.FC = flowcalculator;
window.FT = flowtest;
window.FL = FloodLog;