# CRYPTOCURRENCY GRAPH

## This application utilizes an API built by CryptoCompare

#### Users have the ability to view cryptocurrency price history of any coin they like.

 Techonologies Used
- JavaScript/AngularJS, Node, Express, Morris.js, HTML/CSS/Bootstrap 3
- AWS S3, AWS ElasticBeanstalk
- CryptoCompare API

Morris.js is a JavaScript graphing library

FILES:
- index.html  : consists of all the markup as well as some Angular Directive functionality
- home.css : file with all custom styles
- graph.js : Angular code, consists of one Controller and two factories
- server.js : Express server file configured to handle routing and CORS
- proxy.js : Node.js proxy to delegate request coming from the front-end (angular) http requests

Detailed comments in the code, particularly graph.js.

Node backed utilizes Express router to handle request routes and build up proper requests to CryptoCompare API.

Lightweight Express server, configured to handle Cross Origin Requests



#### Enjoy!


