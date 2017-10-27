const https = require('https');
let express = require('express');
let router = express.Router();
let axios = require('axios');


// Using Body parser because it helps formt incoming JSON requests

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());


// Define various route variables 

const byCoinTypeAndDay = 'byCoinTypeAndDay';
const byCoinTypeAndHour = 'byCoinTypeAndHour';
const coinList = 'coinList';


let url = '';


/*
 ----------REGISTERED ROUTES-------------
 *
 *  1.) Get List Of Coins
 *  2.) Get Coins by Type And Day
 *  3.) Get Coin By Type And Author
 *
 */


router.post("/crypto/" + coinList, (req,res) => {
    url =  req.body.url;
    get_data(url,res)
});

router.post("/crypto/" + byCoinTypeAndDay , (req,res) => {
    console.log("byCoinTypeAndDay: ", req.body);
    url =  req.body.url;
    get_data(url,res)
});

router.post("/crypto/" + byCoinTypeAndHour, (req,res) => {
    console.log("byCoinTypeAndHour: ", req.body)
    url =  req.body.url;
    get_data(url,res)
});


// Here is the request to the Cryptocompare API
// Utilizes axios request library, which is promise based.

let get_data = (url, res) => {
    axios.get(url)
        .then(response => {
            res.send(JSON.stringify(response.data));
        })
        .catch(err => {
            console.log(err);
            JSON.stringify(err.data)})
};


module.exports = router;