(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./packages/api/src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./packages/api/src/config.ts":
/*!************************************!*\
  !*** ./packages/api/src/config.ts ***!
  \************************************/
/*! exports provided: getConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getConfig\", function() { return getConfig; });\n/* harmony import */ var http_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http-status */ \"http-status\");\n/* harmony import */ var http_status__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http_status__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _libs_back_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libs/back.error */ \"./packages/api/src/libs/back.error.ts\");\n\n\nvar DEFAULT_SERVER_CONFIG = {\n    stage: 'local',\n    s3Region: 'eu-west-1',\n    s3Bucket: 'api-swipe-me-local-s3bucket-1kcvqhmf164zs',\n    cognitoRegion: 'eu-west-1',\n    cognitoUserPoolId: 'eu-west-1_s061rv8nC',\n    cognitoIdentityPoolId: 'eu-west-1:5ec84746-5a7e-48a8-be85-1497afe5bdb9',\n    cognitoUserPoolClientId: '2da3fqcdiooakvr5j0ut7uuieo'\n};\nvar getConfig = function () {\n    // FIXME: when offline, the needed ids are not interpreted properly\n    var isOffline = process.env.AWS_USER_POOL_ID === '[object Object]';\n    if (isOffline)\n        return DEFAULT_SERVER_CONFIG;\n    if (!process.env.AWS_S3_REGION)\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('Missing env variable: AWS_S3_REGION', http_status__WEBPACK_IMPORTED_MODULE_0__[\"PRECONDITION_FAILED\"]);\n    if (!process.env.AWS_S3_BUCKET)\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('Missing env variable: AWS_S3_BUCKET', http_status__WEBPACK_IMPORTED_MODULE_0__[\"PRECONDITION_FAILED\"]);\n    if (!process.env.AWS_COGNITO_REGION)\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('Missing env variable: AWS_COGNITO_REGION', http_status__WEBPACK_IMPORTED_MODULE_0__[\"PRECONDITION_FAILED\"]);\n    if (!process.env.AWS_USER_POOL_ID)\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('Missing env variable: AWS_USER_POOL_ID', http_status__WEBPACK_IMPORTED_MODULE_0__[\"PRECONDITION_FAILED\"]);\n    if (!process.env.AWS_IDENTITY_POOL_ID)\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('Missing env variable: AWS_IDENTITY_POOL_ID', http_status__WEBPACK_IMPORTED_MODULE_0__[\"PRECONDITION_FAILED\"]);\n    if (!process.env.AWS_USER_POOL_CLIENT_ID)\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('Missing env variable: AWS_USER_POOL_CLIENT_ID', http_status__WEBPACK_IMPORTED_MODULE_0__[\"PRECONDITION_FAILED\"]);\n    return {\n        s3Region: process.env.AWS_S3_REGION,\n        s3Bucket: process.env.AWS_S3_BUCKET,\n        cognitoRegion: process.env.AWS_COGNITO_REGION,\n        cognitoUserPoolId: process.env.AWS_USER_POOL_ID,\n        cognitoIdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,\n        cognitoUserPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID\n    };\n};\n// Makes sure tu throw an error if a variable is missing\ngetConfig();\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWNrYWdlcy9hcGkvc3JjL2NvbmZpZy50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3BhY2thZ2VzL2FwaS9zcmMvY29uZmlnLnRzPzNiMjEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaHR0cFN0YXR1cyBmcm9tICdodHRwLXN0YXR1cydcbmltcG9ydCBCYWNrRXJyb3IgZnJvbSAnLi9saWJzL2JhY2suZXJyb3InXG5cbmludGVyZmFjZSBTZXJ2ZXJDb25maWcge1xuICBzM1JlZ2lvbjogc3RyaW5nO1xuICBzM0J1Y2tldDogc3RyaW5nO1xuICBjb2duaXRvUmVnaW9uOiBzdHJpbmc7XG4gIGNvZ25pdG9Vc2VyUG9vbElkOiBzdHJpbmc7XG4gIGNvZ25pdG9JZGVudGl0eVBvb2xJZDogc3RyaW5nO1xuICBjb2duaXRvVXNlclBvb2xDbGllbnRJZDogc3RyaW5nO1xufVxuXG5jb25zdCBERUZBVUxUX1NFUlZFUl9DT05GSUcgPSB7XG4gIHN0YWdlOiAnbG9jYWwnLFxuICBzM1JlZ2lvbjogJ2V1LXdlc3QtMScsXG4gIHMzQnVja2V0OiAnYXBpLXN3aXBlLW1lLWxvY2FsLXMzYnVja2V0LTFrY3ZxaG1mMTY0enMnLFxuICBjb2duaXRvUmVnaW9uOiAnZXUtd2VzdC0xJyxcbiAgY29nbml0b1VzZXJQb29sSWQ6ICdldS13ZXN0LTFfczA2MXJ2OG5DJyxcbiAgY29nbml0b0lkZW50aXR5UG9vbElkOiAnZXUtd2VzdC0xOjVlYzg0NzQ2LTVhN2UtNDhhOC1iZTg1LTE0OTdhZmU1YmRiOScsXG4gIGNvZ25pdG9Vc2VyUG9vbENsaWVudElkOiAnMmRhM2ZxY2Rpb29ha3ZyNWowdXQ3dXVpZW8nXG59XG5cbmNvbnN0IGdldENvbmZpZyA9ICgpOiBTZXJ2ZXJDb25maWcgPT4ge1xuICAvLyBGSVhNRTogd2hlbiBvZmZsaW5lLCB0aGUgbmVlZGVkIGlkcyBhcmUgbm90IGludGVycHJldGVkIHByb3Blcmx5XG4gIGNvbnN0IGlzT2ZmbGluZSA9IHByb2Nlc3MuZW52LkFXU19VU0VSX1BPT0xfSUQgPT09ICdbb2JqZWN0IE9iamVjdF0nXG5cbiAgaWYgKGlzT2ZmbGluZSkgcmV0dXJuIERFRkFVTFRfU0VSVkVSX0NPTkZJR1xuXG4gIGlmICghcHJvY2Vzcy5lbnYuQVdTX1MzX1JFR0lPTikgdGhyb3cgbmV3IEJhY2tFcnJvcignTWlzc2luZyBlbnYgdmFyaWFibGU6IEFXU19TM19SRUdJT04nLCBodHRwU3RhdHVzLlBSRUNPTkRJVElPTl9GQUlMRUQpXG4gIGlmICghcHJvY2Vzcy5lbnYuQVdTX1MzX0JVQ0tFVCkgdGhyb3cgbmV3IEJhY2tFcnJvcignTWlzc2luZyBlbnYgdmFyaWFibGU6IEFXU19TM19CVUNLRVQnLCBodHRwU3RhdHVzLlBSRUNPTkRJVElPTl9GQUlMRUQpXG4gIGlmICghcHJvY2Vzcy5lbnYuQVdTX0NPR05JVE9fUkVHSU9OKSB0aHJvdyBuZXcgQmFja0Vycm9yKCdNaXNzaW5nIGVudiB2YXJpYWJsZTogQVdTX0NPR05JVE9fUkVHSU9OJywgaHR0cFN0YXR1cy5QUkVDT05ESVRJT05fRkFJTEVEKVxuICBpZiAoIXByb2Nlc3MuZW52LkFXU19VU0VSX1BPT0xfSUQpIHRocm93IG5ldyBCYWNrRXJyb3IoJ01pc3NpbmcgZW52IHZhcmlhYmxlOiBBV1NfVVNFUl9QT09MX0lEJywgaHR0cFN0YXR1cy5QUkVDT05ESVRJT05fRkFJTEVEKVxuICBpZiAoIXByb2Nlc3MuZW52LkFXU19JREVOVElUWV9QT09MX0lEKSB0aHJvdyBuZXcgQmFja0Vycm9yKCdNaXNzaW5nIGVudiB2YXJpYWJsZTogQVdTX0lERU5USVRZX1BPT0xfSUQnLCBodHRwU3RhdHVzLlBSRUNPTkRJVElPTl9GQUlMRUQpXG4gIGlmICghcHJvY2Vzcy5lbnYuQVdTX1VTRVJfUE9PTF9DTElFTlRfSUQpIHRocm93IG5ldyBCYWNrRXJyb3IoJ01pc3NpbmcgZW52IHZhcmlhYmxlOiBBV1NfVVNFUl9QT09MX0NMSUVOVF9JRCcsIGh0dHBTdGF0dXMuUFJFQ09ORElUSU9OX0ZBSUxFRClcblxuICByZXR1cm4ge1xuICAgIHMzUmVnaW9uOiBwcm9jZXNzLmVudi5BV1NfUzNfUkVHSU9OLFxuICAgIHMzQnVja2V0OiBwcm9jZXNzLmVudi5BV1NfUzNfQlVDS0VULFxuICAgIGNvZ25pdG9SZWdpb246IHByb2Nlc3MuZW52LkFXU19DT0dOSVRPX1JFR0lPTixcbiAgICBjb2duaXRvVXNlclBvb2xJZDogcHJvY2Vzcy5lbnYuQVdTX1VTRVJfUE9PTF9JRCxcbiAgICBjb2duaXRvSWRlbnRpdHlQb29sSWQ6IHByb2Nlc3MuZW52LkFXU19JREVOVElUWV9QT09MX0lELFxuICAgIGNvZ25pdG9Vc2VyUG9vbENsaWVudElkOiBwcm9jZXNzLmVudi5BV1NfVVNFUl9QT09MX0NMSUVOVF9JRFxuICB9XG59XG5cbi8vIE1ha2VzIHN1cmUgdHUgdGhyb3cgYW4gZXJyb3IgaWYgYSB2YXJpYWJsZSBpcyBtaXNzaW5nXG5nZXRDb25maWcoKVxuXG5leHBvcnQge1xuICBnZXRDb25maWdcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./packages/api/src/config.ts\n");

/***/ }),

/***/ "./packages/api/src/index.ts":
/*!***********************************!*\
  !*** ./packages/api/src/index.ts ***!
  \***********************************/
/*! exports provided: handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"handler\", function() { return handler; });\n/* harmony import */ var aws_serverless_express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-serverless-express */ \"aws-serverless-express\");\n/* harmony import */ var aws_serverless_express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_serverless_express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/user */ \"./packages/api/src/models/user.ts\");\n/* harmony import */ var _models_deck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models/deck */ \"./packages/api/src/models/deck.ts\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config */ \"./packages/api/src/config.ts\");\n/* harmony import */ var http_status__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! http-status */ \"http-status\");\n/* harmony import */ var http_status__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(http_status__WEBPACK_IMPORTED_MODULE_7__);\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n\n\n\n\n\n\n\n\nvar app = express__WEBPACK_IMPORTED_MODULE_1__();\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_2__[\"json\"]({\n    strict: false\n}));\napp.use(cors__WEBPACK_IMPORTED_MODULE_3__({\n    origin: '*' // TODO: Handle CORS properly once deployed on the server\n}));\n// app.use(awsServerlessExpressMiddleware.eventContext())\napp.get('/', function (_req, res) {\n    res.send('Hello World!');\n});\napp.get('/config.json', function (_req, res) {\n    try {\n        var config = Object(_config__WEBPACK_IMPORTED_MODULE_6__[\"getConfig\"])();\n        res.json(config);\n    }\n    catch (error) {\n        res.status(error.statusCode || 500).json(__assign({ error: 'Could not config.json' }, error));\n    }\n});\napp.get('/users/:userId', _models_user__WEBPACK_IMPORTED_MODULE_4__[\"default\"].getUserById);\napp.post('/users', _models_user__WEBPACK_IMPORTED_MODULE_4__[\"default\"].createUser);\napp.get('/decks/:deckHandle', function (req, res) {\n    var deckHandle = req.params.deckHandle;\n    return _models_deck__WEBPACK_IMPORTED_MODULE_5__[\"default\"]\n        .getDeckByHandle(deckHandle)\n        .then(function (deck) {\n        res.status(http_status__WEBPACK_IMPORTED_MODULE_7__[\"OK\"]).json(deck);\n    })\n        .catch(function (error) {\n        res.status(error.statusCode || 500).json(__assign({ error: 'Could not get deck' }, error));\n    });\n});\napp.post('/decks', function (req, res) {\n    var _a = req.body, deckHandle = _a.deckHandle, cards = _a.cards;\n    return _models_deck__WEBPACK_IMPORTED_MODULE_5__[\"default\"]\n        .createDeck({ deckHandle: deckHandle, cards: cards })\n        .then(function (deck) {\n        res.status(http_status__WEBPACK_IMPORTED_MODULE_7__[\"OK\"]).json(deck);\n    })\n        .catch(function (error) {\n        res.status(error.statusCode || 500).json(__assign({ error: 'Could not create deck' }, error));\n    });\n});\nvar server = aws_serverless_express__WEBPACK_IMPORTED_MODULE_0__[\"createServer\"](app);\nvar handler = function (event, context) {\n    // HACK: Remove the stage\n    // https://github.com/awslabs/aws-serverless-express/issues/86\n    if (event.requestContext.stage) {\n        event.path = event.path.replace('/' + event.requestContext.stage, '');\n    }\n    // HACK: Headers are too big for express to handle\n    // https://github.com/awslabs/aws-serverless-express/issues/248\n    delete event.multiValueHeaders;\n    aws_serverless_express__WEBPACK_IMPORTED_MODULE_0__[\"proxy\"](server, event, context);\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWNrYWdlcy9hcGkvc3JjL2luZGV4LnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvYXBpL3NyYy9pbmRleC50cz80MjJhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF3c1NlcnZlcmxlc3NFeHByZXNzIGZyb20gJ2F3cy1zZXJ2ZXJsZXNzLWV4cHJlc3MnXG4vLyBpbXBvcnQgYXdzU2VydmVybGVzc0V4cHJlc3NNaWRkbGV3YXJlIGZyb20gJ2F3cy1zZXJ2ZXJsZXNzLWV4cHJlc3MvbWlkZGxld2FyZSdcblxuaW1wb3J0IHR5cGUgeyBIYW5kbGVyIH0gZnJvbSAnYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbmltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgKiBhcyBjb3JzIGZyb20gJ2NvcnMnXG5cbmltcG9ydCB1c2VyTW9kZWwgZnJvbSAnLi9tb2RlbHMvdXNlcidcbmltcG9ydCBkZWNrTW9kZWwgZnJvbSAnLi9tb2RlbHMvZGVjaydcblxuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi9jb25maWcnXG5pbXBvcnQgKiBhcyBodHRwU3RhdHVzIGZyb20gJ2h0dHAtc3RhdHVzJ1xuXG5jb25zdCBhcHAgPSBleHByZXNzKClcblxuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oe1xuICBzdHJpY3Q6IGZhbHNlXG59KSlcbmFwcC51c2UoY29ycyh7XG4gIG9yaWdpbjogJyonIC8vIFRPRE86IEhhbmRsZSBDT1JTIHByb3Blcmx5IG9uY2UgZGVwbG95ZWQgb24gdGhlIHNlcnZlclxufSkpXG4vLyBhcHAudXNlKGF3c1NlcnZlcmxlc3NFeHByZXNzTWlkZGxld2FyZS5ldmVudENvbnRleHQoKSlcblxuYXBwLmdldCgnLycsIGZ1bmN0aW9uIChfcmVxLCByZXMpIHtcbiAgcmVzLnNlbmQoJ0hlbGxvIFdvcmxkIScpXG59KVxuXG5hcHAuZ2V0KCcvY29uZmlnLmpzb24nLCBmdW5jdGlvbiAoX3JlcSwgcmVzKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKClcblxuICAgIHJlcy5qc29uKGNvbmZpZylcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXMuc3RhdHVzKGVycm9yLnN0YXR1c0NvZGUgfHwgNTAwKS5qc29uKHtcbiAgICAgIGVycm9yOiAnQ291bGQgbm90IGNvbmZpZy5qc29uJyxcbiAgICAgIC4uLmVycm9yXG4gICAgfSlcbiAgfVxufSlcblxuYXBwLmdldCgnL3VzZXJzLzp1c2VySWQnLCB1c2VyTW9kZWwuZ2V0VXNlckJ5SWQpXG5hcHAucG9zdCgnL3VzZXJzJywgdXNlck1vZGVsLmNyZWF0ZVVzZXIpXG5hcHAuZ2V0KCcvZGVja3MvOmRlY2tIYW5kbGUnLCAocmVxLCByZXMpID0+IHtcbiAgY29uc3QgZGVja0hhbmRsZSA9IHJlcS5wYXJhbXMuZGVja0hhbmRsZVxuXG4gIHJldHVybiBkZWNrTW9kZWxcbiAgICAuZ2V0RGVja0J5SGFuZGxlKGRlY2tIYW5kbGUpXG4gICAgLnRoZW4oKGRlY2spID0+IHtcbiAgICAgIHJlcy5zdGF0dXMoaHR0cFN0YXR1cy5PSykuanNvbihkZWNrKVxuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmVzLnN0YXR1cyhlcnJvci5zdGF0dXNDb2RlIHx8IDUwMCkuanNvbih7XG4gICAgICAgIGVycm9yOiAnQ291bGQgbm90IGdldCBkZWNrJyxcbiAgICAgICAgLi4uZXJyb3JcbiAgICAgIH0pXG4gICAgfSlcbn0pXG5hcHAucG9zdCgnL2RlY2tzJywgKHJlcSwgcmVzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBkZWNrSGFuZGxlLFxuICAgIGNhcmRzXG4gIH0gPSByZXEuYm9keVxuXG4gIHJldHVybiBkZWNrTW9kZWxcbiAgICAuY3JlYXRlRGVjayh7IGRlY2tIYW5kbGUsIGNhcmRzIH0pXG4gICAgLnRoZW4oKGRlY2spID0+IHtcbiAgICAgIHJlcy5zdGF0dXMoaHR0cFN0YXR1cy5PSykuanNvbihkZWNrKVxuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmVzLnN0YXR1cyhlcnJvci5zdGF0dXNDb2RlIHx8IDUwMCkuanNvbih7XG4gICAgICAgIGVycm9yOiAnQ291bGQgbm90IGNyZWF0ZSBkZWNrJyxcbiAgICAgICAgLi4uZXJyb3JcbiAgICAgIH0pXG4gICAgfSlcbn0pXG5cbmNvbnN0IHNlcnZlciA9IGF3c1NlcnZlcmxlc3NFeHByZXNzLmNyZWF0ZVNlcnZlcihhcHApXG5cbmNvbnN0IGhhbmRsZXI6IEhhbmRsZXIgPSAoZXZlbnQsIGNvbnRleHQpID0+IHtcbiAgLy8gSEFDSzogUmVtb3ZlIHRoZSBzdGFnZVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9hd3Mtc2VydmVybGVzcy1leHByZXNzL2lzc3Vlcy84NlxuICBpZiAoZXZlbnQucmVxdWVzdENvbnRleHQuc3RhZ2UpIHtcbiAgICBldmVudC5wYXRoID0gZXZlbnQucGF0aC5yZXBsYWNlKCcvJyArIGV2ZW50LnJlcXVlc3RDb250ZXh0LnN0YWdlLCAnJylcbiAgfVxuXG4gIC8vIEhBQ0s6IEhlYWRlcnMgYXJlIHRvbyBiaWcgZm9yIGV4cHJlc3MgdG8gaGFuZGxlXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL2F3cy1zZXJ2ZXJsZXNzLWV4cHJlc3MvaXNzdWVzLzI0OFxuICBkZWxldGUgZXZlbnQubXVsdGlWYWx1ZUhlYWRlcnNcblxuICBhd3NTZXJ2ZXJsZXNzRXhwcmVzcy5wcm94eShzZXJ2ZXIsIGV2ZW50LCBjb250ZXh0KVxufVxuXG5leHBvcnQge1xuICBoYW5kbGVyXG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUlBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./packages/api/src/index.ts\n");

/***/ }),

/***/ "./packages/api/src/libs/back.error.ts":
/*!*********************************************!*\
  !*** ./packages/api/src/libs/back.error.ts ***!
  \*********************************************/
/*! exports provided: ExtendableError, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ExtendableError\", function() { return ExtendableError; });\n/* harmony import */ var http_status__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http-status */ \"http-status\");\n/* harmony import */ var http_status__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http_status__WEBPACK_IMPORTED_MODULE_0__);\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n/**\n * @extends Error\n */\n\nvar ExtendableError = /** @class */ (function (_super) {\n    __extends(ExtendableError, _super);\n    function ExtendableError(message, statusCode) {\n        var _this = _super.call(this, message) || this;\n        _this.name = _this.constructor.name;\n        _this.message = message;\n        _this.statusCode = statusCode;\n        Error.captureStackTrace(_this, _this.constructor);\n        return _this;\n    }\n    return ExtendableError;\n}(Error));\n\nvar BackError = /** @class */ (function (_super) {\n    __extends(BackError, _super);\n    function BackError(message, statusCode) {\n        if (statusCode === void 0) { statusCode = http_status__WEBPACK_IMPORTED_MODULE_0__[\"INTERNAL_SERVER_ERROR\"]; }\n        return _super.call(this, message, statusCode) || this;\n    }\n    BackError.prototype.toJSON = function () {\n        return __assign({ message: this.message, statusCode: this.statusCode }, (this.statusCode < 500) ? { name: this.name } : {});\n    };\n    return BackError;\n}(ExtendableError));\n/* harmony default export */ __webpack_exports__[\"default\"] = (BackError);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWNrYWdlcy9hcGkvc3JjL2xpYnMvYmFjay5lcnJvci50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3BhY2thZ2VzL2FwaS9zcmMvbGlicy9iYWNrLmVycm9yLnRzP2YzMmEiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZXh0ZW5kcyBFcnJvclxuICovXG5pbXBvcnQgKiBhcyBodHRwU3RhdHVzIGZyb20gJ2h0dHAtc3RhdHVzJ1xuXG5leHBvcnQgY2xhc3MgRXh0ZW5kYWJsZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBwdWJsaWMgc3RhdHVzQ29kZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yIChtZXNzYWdlOiBzdHJpbmcsIHN0YXR1c0NvZGU6IG51bWJlcikge1xuICAgIHN1cGVyKG1lc3NhZ2UpXG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGVcblxuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFja0Vycm9yIGV4dGVuZHMgRXh0ZW5kYWJsZUVycm9yIHtcbiAgY29uc3RydWN0b3IgKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzQ29kZSA9IGh0dHBTdGF0dXMuSU5URVJOQUxfU0VSVkVSX0VSUk9SKSB7XG4gICAgc3VwZXIobWVzc2FnZSwgc3RhdHVzQ29kZSlcbiAgfVxuXG4gIHRvSlNPTiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIHN0YXR1c0NvZGU6IHRoaXMuc3RhdHVzQ29kZSxcbiAgICAgIC4uLih0aGlzLnN0YXR1c0NvZGUgPCA1MDApID8geyBuYW1lOiB0aGlzLm5hbWUgfSA6IHt9XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUlBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7QUFDQTtBQUNBO0FBQUE7O0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUtBO0FBQ0E7QUFBQTs7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./packages/api/src/libs/back.error.ts\n");

/***/ }),

/***/ "./packages/api/src/libs/dynamodb-lib.ts":
/*!***********************************************!*\
  !*** ./packages/api/src/libs/dynamodb-lib.ts ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n\nfunction getInstance() {\n    return new aws_sdk__WEBPACK_IMPORTED_MODULE_0__[\"DynamoDB\"].DocumentClient(__assign({},  true ? { region: 'localhost', endpoint: process.env.DYNAMODB_ENDPOINT } : undefined));\n}\nfunction get(params) {\n    var dynamoDb = getInstance();\n    return dynamoDb.get(params).promise();\n}\nfunction put(params) {\n    var dynamoDb = getInstance();\n    return dynamoDb.put(params).promise();\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    get: get,\n    put: put\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWNrYWdlcy9hcGkvc3JjL2xpYnMvZHluYW1vZGItbGliLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvYXBpL3NyYy9saWJzL2R5bmFtb2RiLWxpYi50cz9hMzJjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER5bmFtb0RCIH0gZnJvbSAnYXdzLXNkaydcblxuaW1wb3J0IHR5cGUgeyBQdXRJdGVtSW5wdXQsIEdldEl0ZW1JbnB1dCB9IGZyb20gJ2F3cy1zZGsvY2xpZW50cy9keW5hbW9kYidcblxuZnVuY3Rpb24gZ2V0SW5zdGFuY2UgKCkge1xuICByZXR1cm4gbmV3IER5bmFtb0RCLkRvY3VtZW50Q2xpZW50KHtcbiAgICAuLi5wcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IHsgcmVnaW9uOiAnbG9jYWxob3N0JywgZW5kcG9pbnQ6IHByb2Nlc3MuZW52LkRZTkFNT0RCX0VORFBPSU5UIH0gOiB7fVxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXQgKHBhcmFtczogR2V0SXRlbUlucHV0KSB7XG4gIGNvbnN0IGR5bmFtb0RiID0gZ2V0SW5zdGFuY2UoKVxuXG4gIHJldHVybiBkeW5hbW9EYi5nZXQocGFyYW1zKS5wcm9taXNlKClcbn1cblxuZnVuY3Rpb24gcHV0IChwYXJhbXM6IFB1dEl0ZW1JbnB1dCkge1xuICBjb25zdCBkeW5hbW9EYiA9IGdldEluc3RhbmNlKClcblxuICByZXR1cm4gZHluYW1vRGIucHV0KHBhcmFtcykucHJvbWlzZSgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0LFxuICBwdXRcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUlBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./packages/api/src/libs/dynamodb-lib.ts\n");

/***/ }),

/***/ "./packages/api/src/models/deck.ts":
/*!*****************************************!*\
  !*** ./packages/api/src/models/deck.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _libs_dynamodb_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libs/dynamodb-lib */ \"./packages/api/src/libs/dynamodb-lib.ts\");\n/* harmony import */ var _libs_back_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/back.error */ \"./packages/api/src/libs/back.error.ts\");\n\n\n\nvar DECKS_TABLE = process.env.DECKS_TABLE || '';\nvar getDeckByHandle = function (deckHandle) {\n    var params = {\n        TableName: DECKS_TABLE,\n        Key: {\n            deckHandle: deckHandle\n        }\n    };\n    return _libs_dynamodb_lib__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n        .get(params)\n        .then(function (result) {\n        if (!result.Item) {\n            throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_2__[\"default\"]('deck not found', 404);\n        }\n        var _a = result.Item, deckId = _a.deckId, deckHandle = _a.deckHandle, createdAt = _a.createdAt, cards = _a.cards;\n        return {\n            deckId: deckId,\n            deckHandle: deckHandle,\n            createdAt: createdAt,\n            cards: cards\n        };\n    });\n};\nvar createDeck = function (_a) {\n    var deckHandle = _a.deckHandle, cards = _a.cards;\n    if (typeof deckHandle !== 'string') {\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_2__[\"default\"]('\"deckHandle\" must be a string', 400);\n    }\n    if (!Array.isArray(cards)) {\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_2__[\"default\"]('\"cards\" must be an array', 400);\n    }\n    if (cards.filter(function (c) { return c.description; }).length !== cards.length) {\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_2__[\"default\"]('a \"description\" must be provided for all cards', 400);\n    }\n    if (cards.filter(function (c) { return c.title; }).length !== cards.length) {\n        throw new _libs_back_error__WEBPACK_IMPORTED_MODULE_2__[\"default\"]('a \"title\" must be provided for all cards', 400);\n    }\n    var deckId = uuid__WEBPACK_IMPORTED_MODULE_0__[\"v1\"]();\n    var createdAt = Date.now();\n    var params = {\n        TableName: DECKS_TABLE,\n        Item: {\n            deckId: deckId,\n            deckHandle: deckHandle,\n            cards: cards,\n            createdAt: createdAt\n        },\n        ConditionExpression: 'attribute_not_exists(deckId) and attribute_not_exists(deckHandle)'\n    };\n    return _libs_dynamodb_lib__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n        .put(params)\n        .then(function () {\n        return {\n            deckId: deckId,\n            deckHandle: deckHandle,\n            createdAt: createdAt,\n            cards: cards\n        };\n    });\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    getDeckByHandle: getDeckByHandle,\n    createDeck: createDeck\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWNrYWdlcy9hcGkvc3JjL21vZGVscy9kZWNrLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvYXBpL3NyYy9tb2RlbHMvZGVjay50cz85ODVkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFVVSUQgZnJvbSAndXVpZCdcbmltcG9ydCBkeW5hbW9EYiBmcm9tICcuLi9saWJzL2R5bmFtb2RiLWxpYidcbmltcG9ydCBCYWNrRXJyb3IgZnJvbSAnLi4vbGlicy9iYWNrLmVycm9yJ1xuXG5pbXBvcnQgdHlwZSB7IEdldEl0ZW1JbnB1dCwgUHV0SXRlbUlucHV0IH0gZnJvbSAnYXdzLXNkay9jbGllbnRzL2R5bmFtb2RiJ1xuaW1wb3J0IHR5cGUgeyBEZWNrLCBOZXdEZWNrIH0gZnJvbSAnQHN3aXBlbWUuaW8vY29tbW9uL3R5cGVzJ1xuXG5jb25zdCBERUNLU19UQUJMRSA9IHByb2Nlc3MuZW52LkRFQ0tTX1RBQkxFIHx8ICcnXG5cbmNvbnN0IGdldERlY2tCeUhhbmRsZSA9IChkZWNrSGFuZGxlOiBzdHJpbmcpOiBQcm9taXNlPERlY2s+ID0+IHtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIFRhYmxlTmFtZTogREVDS1NfVEFCTEUsXG4gICAgS2V5OiB7XG4gICAgICBkZWNrSGFuZGxlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGR5bmFtb0RiXG4gICAgLmdldChwYXJhbXMgYXMgR2V0SXRlbUlucHV0KVxuICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIGlmICghcmVzdWx0Lkl0ZW0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhY2tFcnJvcignZGVjayBub3QgZm91bmQnLCA0MDQpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGVja0lkLFxuICAgICAgICBkZWNrSGFuZGxlLFxuICAgICAgICBjcmVhdGVkQXQsXG4gICAgICAgIGNhcmRzXG4gICAgICB9ID0gcmVzdWx0Lkl0ZW1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGVja0lkLFxuICAgICAgICBkZWNrSGFuZGxlLFxuICAgICAgICBjcmVhdGVkQXQsXG4gICAgICAgIGNhcmRzXG4gICAgICB9XG4gICAgfSlcbn1cblxuY29uc3QgY3JlYXRlRGVjayA9ICh7IGRlY2tIYW5kbGUsIGNhcmRzIH06IE5ld0RlY2spOiBQcm9taXNlPERlY2s+ID0+IHtcbiAgaWYgKHR5cGVvZiBkZWNrSGFuZGxlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBCYWNrRXJyb3IoJ1wiZGVja0hhbmRsZVwiIG11c3QgYmUgYSBzdHJpbmcnLCA0MDApXG4gIH1cbiAgaWYgKCFBcnJheS5pc0FycmF5KGNhcmRzKSkge1xuICAgIHRocm93IG5ldyBCYWNrRXJyb3IoJ1wiY2FyZHNcIiBtdXN0IGJlIGFuIGFycmF5JywgNDAwKVxuICB9XG4gIGlmIChjYXJkcy5maWx0ZXIoYyA9PiBjLmRlc2NyaXB0aW9uKS5sZW5ndGggIT09IGNhcmRzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBCYWNrRXJyb3IoJ2EgXCJkZXNjcmlwdGlvblwiIG11c3QgYmUgcHJvdmlkZWQgZm9yIGFsbCBjYXJkcycsIDQwMClcbiAgfVxuICBpZiAoY2FyZHMuZmlsdGVyKGMgPT4gYy50aXRsZSkubGVuZ3RoICE9PSBjYXJkcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgQmFja0Vycm9yKCdhIFwidGl0bGVcIiBtdXN0IGJlIHByb3ZpZGVkIGZvciBhbGwgY2FyZHMnLCA0MDApXG4gIH1cbiAgY29uc3QgZGVja0lkID0gVVVJRC52MSgpXG4gIGNvbnN0IGNyZWF0ZWRBdCA9IERhdGUubm93KClcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIFRhYmxlTmFtZTogREVDS1NfVEFCTEUsXG4gICAgSXRlbToge1xuICAgICAgZGVja0lkLFxuICAgICAgZGVja0hhbmRsZSxcbiAgICAgIGNhcmRzLFxuICAgICAgY3JlYXRlZEF0XG4gICAgfSxcbiAgICBDb25kaXRpb25FeHByZXNzaW9uOiAnYXR0cmlidXRlX25vdF9leGlzdHMoZGVja0lkKSBhbmQgYXR0cmlidXRlX25vdF9leGlzdHMoZGVja0hhbmRsZSknXG4gIH1cblxuICByZXR1cm4gZHluYW1vRGJcbiAgICAucHV0KHBhcmFtcyBhcyBQdXRJdGVtSW5wdXQpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGVja0lkLFxuICAgICAgICBkZWNrSGFuZGxlLFxuICAgICAgICBjcmVhdGVkQXQsXG4gICAgICAgIGNhcmRzXG4gICAgICB9XG4gICAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXREZWNrQnlIYW5kbGUsXG4gIGNyZWF0ZURlY2tcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./packages/api/src/models/deck.ts\n");

/***/ }),

/***/ "./packages/api/src/models/user.ts":
/*!*****************************************!*\
  !*** ./packages/api/src/models/user.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_dynamodb_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/dynamodb-lib */ \"./packages/api/src/libs/dynamodb-lib.ts\");\n\nvar USERS_TABLE = process.env.USERS_TABLE || '';\nvar getUserById = function (req, res) {\n    var params = {\n        TableName: USERS_TABLE,\n        Key: {\n            userId: { S: req.params.userId }\n        }\n    };\n    return _libs_dynamodb_lib__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n        .get(params)\n        .then(function (result) {\n        if (!result.Item) {\n            return res.status(404).json({\n                error: 'User not found'\n            });\n        }\n        var _a = result.Item, userId = _a.userId, name = _a.name;\n        res.json({\n            userId: userId,\n            name: name\n        });\n    })\n        .catch(function (error) {\n        res.status(400).json({\n            message: 'Could not get user',\n            error: error\n        });\n    });\n};\nvar createUser = function (req, res) {\n    var _a = req.body, userId = _a.userId, name = _a.name;\n    if (typeof userId !== 'string') {\n        res.status(400).json({\n            error: '\"userId\" must be a string'\n        });\n    }\n    else if (typeof name !== 'string') {\n        res.status(400).json({\n            error: '\"name\" must be a string'\n        });\n    }\n    var params = {\n        TableName: USERS_TABLE,\n        Item: {\n            userId: userId,\n            name: name\n        }\n    };\n    return _libs_dynamodb_lib__WEBPACK_IMPORTED_MODULE_0__[\"default\"].put(params)\n        .then(function () {\n        res.json({\n            userId: userId,\n            name: name\n        });\n    })\n        .catch(function (error) {\n        res.status(400).json({\n            message: 'Could not create user',\n            error: error\n        });\n    });\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    getUserById: getUserById,\n    createUser: createUser\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWNrYWdlcy9hcGkvc3JjL21vZGVscy91c2VyLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvYXBpL3NyYy9tb2RlbHMvdXNlci50cz9iZjNkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkeW5hbW9EYiBmcm9tICcuLi9saWJzL2R5bmFtb2RiLWxpYidcblxuaW1wb3J0IHR5cGUgeyBIYW5kbGVyIH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgVVNFUlNfVEFCTEUgPSBwcm9jZXNzLmVudi5VU0VSU19UQUJMRSB8fCAnJ1xuXG5jb25zdCBnZXRVc2VyQnlJZDogSGFuZGxlciA9IChyZXEsIHJlcykgPT4ge1xuICBjb25zdCBwYXJhbXMgPSB7XG4gICAgVGFibGVOYW1lOiBVU0VSU19UQUJMRSxcbiAgICBLZXk6IHtcbiAgICAgIHVzZXJJZDogeyBTOiByZXEucGFyYW1zLnVzZXJJZCB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGR5bmFtb0RiXG4gICAgLmdldChwYXJhbXMpXG4gICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKCFyZXN1bHQuSXRlbSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oe1xuICAgICAgICAgIGVycm9yOiAnVXNlciBub3QgZm91bmQnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgdXNlcklkLFxuICAgICAgICBuYW1lXG4gICAgICB9ID0gcmVzdWx0Lkl0ZW1cblxuICAgICAgcmVzLmpzb24oe1xuICAgICAgICB1c2VySWQsXG4gICAgICAgIG5hbWVcbiAgICAgIH0pXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIG1lc3NhZ2U6ICdDb3VsZCBub3QgZ2V0IHVzZXInLFxuICAgICAgICBlcnJvclxuICAgICAgfSlcbiAgICB9KVxufVxuXG5jb25zdCBjcmVhdGVVc2VyOiBIYW5kbGVyID0gKHJlcSwgcmVzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICB1c2VySWQsXG4gICAgbmFtZVxuICB9ID0gcmVxLmJvZHlcblxuICBpZiAodHlwZW9mIHVzZXJJZCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICBlcnJvcjogJ1widXNlcklkXCIgbXVzdCBiZSBhIHN0cmluZydcbiAgICB9KVxuICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgIGVycm9yOiAnXCJuYW1lXCIgbXVzdCBiZSBhIHN0cmluZydcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIFRhYmxlTmFtZTogVVNFUlNfVEFCTEUsXG4gICAgSXRlbToge1xuICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGR5bmFtb0RiLnB1dChwYXJhbXMpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgcmVzLmpzb24oe1xuICAgICAgICB1c2VySWQsXG4gICAgICAgIG5hbWVcbiAgICAgIH0pXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIG1lc3NhZ2U6ICdDb3VsZCBub3QgY3JlYXRlIHVzZXInLFxuICAgICAgICBlcnJvclxuICAgICAgfSlcbiAgICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldFVzZXJCeUlkLFxuICBjcmVhdGVVc2VyXG59XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./packages/api/src/models/user.ts\n");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-sdk\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLXNkay5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImF3cy1zZGtcIj81MTQyIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImF3cy1zZGtcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///aws-sdk\n");

/***/ }),

/***/ "aws-serverless-express":
/*!*****************************************!*\
  !*** external "aws-serverless-express" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-serverless-express\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLXNlcnZlcmxlc3MtZXhwcmVzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImF3cy1zZXJ2ZXJsZXNzLWV4cHJlc3NcIj84ZjIxIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImF3cy1zZXJ2ZXJsZXNzLWV4cHJlc3NcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///aws-serverless-express\n");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1wYXJzZXIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJib2R5LXBhcnNlclwiPzgxODgiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///body-parser\n");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIj83ZTllIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///cors\n");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIj8yMmZlIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///express\n");

/***/ }),

/***/ "http-status":
/*!******************************!*\
  !*** external "http-status" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http-status\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1zdGF0dXMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwLXN0YXR1c1wiP2EyMjQiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cC1zdGF0dXNcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///http-status\n");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXVpZC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcInV1aWRcIj8zNzEyIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///uuid\n");

/***/ })

/******/ })));