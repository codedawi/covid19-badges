const { badgen } = require("badgen");
const numeral = require("numeral");
const express = require("express");

const { svgMiddleware } = require("./middleware");
const services = require("./services");


const router = express.Router();

/**
 * Adding commas to large numbers for display purposes
 * @param {Number} num 
 * @return {String} 
 */
const addCommas = (num) => numeral(num).format('0,0');

/**
 * Helper function calling the badgen to create badge
 * @param {String} label 
 * @param {String} color 
 * @param {Number} data
 * @return {String} svg markup for the badge requested 
 */
const getBadge = (label, color, data) => badgen({ label, status: addCommas(data), color, });


router.get(["/confirmed", "/confirmed/latest"], async (req, res) => {

    const { confirmed } = await services.getLatestGlobally();

    const label = req.query.long ? "COVID-19 Cases" : "cases";

    res.send(getBadge(label, "orange", confirmed));
    
});

router.get(["/deaths", "/deaths/latest"], async (req, res) => {
    
    const { deaths } = await services.getLatestGlobally();

    const label = req.query.long ? "COVID-19 Deaths" : "deaths";

    res.send(getBadge(label, "red", deaths));
    
});

router.get(["/recovered", "/recovered/latest"], async (req, res) => {

    const { recovered } = await services.getLatestGlobally();

    const label = req.query.long ? "COVID-19 Recovered" : "recovered";

    res.send(getBadge(label, "green", recovered));
    
});

router.use(svgMiddleware)

module.exports = router;