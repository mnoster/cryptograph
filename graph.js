// Declare Angular app as cryptoGraph
var app = angular.module("cryptoGraph", []);

// Configure http headers for the http requests
app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.get = {'Content-Type': 'application/json'};
});


/*
*
*
* This is the main controller for the application; only one because it is relatively simple
* Using Angular's dependency injection, we are able to inject services/factories/directives
* The parameters prefixed with "$" are angular directives
* $http is used for making async network requests, $q is a promise based library, $log is just console logging, and $scope helps bind data to the view
* The last 2 params are factories. The first handles the http requests to pull data from cryptocompare API and the second is to generate the graph
*
*
*/
app.controller("cryptoGraphController", function ($http, $q, $log, $scope, getCoinData, generateGraph) {
    // Good convention to assign context of this to a variable because it can ofter be changed unknowingly
    var self = this;
    // Here we define the data for the application
    // coins will eventually be an array of all the coin names so that we can generate a list for the user to choose from
    self.coins = [];
    // intervals is just the time intervals the user can choose if they like to filter results
    self.intervals = ["day", "week", "month", "year"];
    // This is a variable that is toggled for the different types of background/text colors
    self.lightswitch = false;
    // The graph data is an array containing all the graph data; more about it on line 58
    self.graphData = [];


    // This function calls the getCoinData Factory which makes all the requests to coincompare api
    self.getCoinList = function () {
        // This is a promise based function and will return a callback in the .then() which will then build an array of coins
        // The data received in the call back is the response from the api with all the coin data
        getCoinData.callApi()
            .then(function success(response) {
                console.info("api call complete and promise done");
                var coinList = response.data.Data;
                self.coins = Object.keys(coinList).sort();
            })

    };

    // This method calls the other factory which holds some logic for determining the params that go into the request, such as time interval and coinType
    self.getCoinDataByNameOrInterval = function (coinType, interval,startDate) {
        console.log("Get Coin Data By Name Or Interval: ", coinType, " " ,interval, " ", startDate);
        var d = Date.parse(startDate)/1000 ;
        var n = 24;
        if(interval == "week") n = 7;
        else if(interval=="month") n = 30;
        else if( interval == "year") n = 365;
        if (coinType) {
            // Similar structure to the previous method, except the success callback in this function iterates through the response data
            // And builds up the graph data array with objects of graph properties
            getCoinData.callApi(coinType, interval,d, n)
                .then(function success(response) {
                    console.info("api call complete and promise done");
                    var coinData = response.data.Data;
                    self.graphData = [];

                    for (var i = 0; i < coinData.length; i++) {
                        self.graphData.push({
                            close: coinData[i].close,
                            low: coinData[i].low,
                            high: coinData[i].high,
                            open: coinData[i].open,
                            time: new Date(coinData[i].time * 1000),
                            volumefrom: coinData[i].volumefrom,
                            volumeto: coinData[i].volumeto
                        });
                    }
                    // Here we actually initialize and build the graph
                    // We are calling the generateGraph Factory
                    generateGraph.initGraph(self.graphData, "time");
                });
        } else console.error("No Coin Type");
    };


});
//this is the service that consists of all the logic to make the proper http request and filter the data
app.factory("getCoinData", function ($http, $q) {
    var self = this;
    console.info("getCoinData factory called");
    // This factory returns the callApi method that we saw above
    // All the params listed below are actually initialized in the view
    return {
        callApi: function (coinType, interval, startDate,limit) {
            // init promise by deferring, later we will resolve or reject based on response
            var defer = $q.defer();

            // These are the various endpoints we need to operate the requests
            var url = {
                byCoinTypeAndDay : "https://min-api.cryptocompare.com/data/histoday?fsym="+coinType+"&limit="+limit+"&tsym=USD&toTs="+startDate+"&e=CCCAGG",
                byCoinTypeAndHour : "https://min-api.cryptocompare.com/data/histhour?fsym="+coinType+"&limit=24&tsym=USD&toTs="+startDate+"&e=CCCAGG",
                coinList: "https://www.cryptocompare.com/api/data/coinlist?sign=true"
            };
            // There is some terenery logic below to determine which URl to use in the request
            $http({
                url: !coinType && !interval ? url.coinList : coinType && interval && limit ? url.byCoinTypeAndDay : url.byCoinTypeAndHour ,
                dataType: 'json',
                crossDomain : true,
                method: 'GET'
            }).then(function success(response) {
                console.warn("API connect success: ", response);
                defer.resolve(response)

            }), function error(response) {
                $log.error("$http fail: ", response);
                defer.reject("Error msg here");
            };
            return defer.promise;
        }
    }
});

// Here is the factory that builds the graph and specifies it's properties
// Morris.js is the graphing library that is being used

app.factory("generateGraph", function () {

    return {
        initGraph: function (data, xCoordinate) {
            Morris.Area({
                element: 'graphArea',
                data: data,
                parseTime:false,
                xkey: xCoordinate,
                ykeys: ['close', 'low', 'high', 'open'],
                labels: ['close', 'low', 'high', 'open','time'],
                pointSize: 2,
                hideHover: 'auto',
                behaveLikeLine: true,
                lineColors: ["red", "blue", "green", "grey"],
                pointFillColors: ["red", "blue", "black", "orange"],
                pointStrokeColors: ["red", "blue", "black", "orange"],
                fillOpacity: .3
            });
        }
    }
});