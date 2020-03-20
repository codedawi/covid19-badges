const { badgen } = require("badgen")
const express = require("express");

const { svgMiddleware } = require("./middleware");
const services = require("./services");


const router = express.Router();


router.get(["/confirmed", "/confirmed/latest"], async (_req, res) => {

    const { confirmed } = await services.getLatestGlobally();

    const config = {
        label: "COVID-19 Cases",
        status: confirmed,
        color: "orange",
        style: "flat",
    }

    res.send(badgen(config));
    
});


router.get(["/deaths", "/deaths/latest"], async (_req, res) => {

    const { deaths } = await services.getLatestGlobally();

    const config = {
        label: "COVID-19 Deaths",
        status: deaths,
        color: "red",
        style: "flat",
    }

    res.send(badgen(config));
    
});


router.get(["/recovered", "/recovered/latest"], async (_req, res) => {

    const { recovered } = await services.getLatestGlobally();

    const config = {
        label: "COVID-19 Recovered",
        status: recovered,
        color: "green",
        style: "flat",
    }

    res.send(badgen(config));
    
});


router.use(svgMiddleware)

module.exports = router;