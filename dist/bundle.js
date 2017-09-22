/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = PIXI;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["NONE"] = 0] = "NONE";
    ObjectType[ObjectType["ISLAND"] = 1] = "ISLAND";
    ObjectType[ObjectType["SHIP"] = 2] = "SHIP";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));
var GameObject = /** @class */function () {
    function GameObject() {
        // the game object's sprite keeps positional information  x,y
        this.vx = 0; // velocity information
        this.vy = 0;
        this.z = 0; // z-sorting if necessary... z sort normally done by y position
        this.objType = ObjectType.NONE;
    }
    GameObject.prototype.setSprite = function (newSprite) {
        this.sprite = newSprite;
    };
    GameObject.prototype.getSprite = function () {
        return this.sprite;
    };
    return GameObject;
}();
exports.default = GameObject;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __webpack_require__(0);
var theSea_1 = __webpack_require__(3);
var Core = /** @class */function () {
    function Core() {
        var _this = this;
        this.seaLoadedCallback = function () {
            // add listener to the stage - stage declared in main, top level js file
            console.log("PotTW: build 0.0.10");
            _this._world.interactive = true;
            _this._world.on("mousemove", _this._sea.mouseMoveHandler);
            _this._world.addChild(_this._sea.getContainer());
            _this.update();
        };
        this.update = function () {
            _this._sea.update();
            _this._renderer.render(_this._world);
            requestAnimationFrame(_this.update);
        };
        this._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
        this._world = new PIXI.Container();
        document.body.appendChild(this._renderer.view);
        // create a new sea object
        this._sea = new theSea_1.default();
        this._sea.init(this.seaLoadedCallback);
    }
    return Core;
}();
exports.default = Core;
var game = new Core();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __webpack_require__(0);
var island_1 = __webpack_require__(4);
var theSea = /** @class */function () {
    function theSea() {
        var _this = this;
        this.container = new PIXI.Container();
        this.deltaX = 0;
        this.deltaY = 0;
        this.lastX = -1;
        this.lastY = -1;
        this.objectArray = []; // array of all sprites added to theSea islands and ships (later, projectiles as well)
        // pixi style event handler, not the same arguments as javascript mouse event
        this.mouseMoveHandler = function (e) {
            //document.getElementById("log").innerText = e.type;
            //console.log(e);
            // console.log(this);
            if (e.data.buttons == 1) {
                //console.log("LeftDown");
                var doDelta = true;
                if (_this.lastX == -1) doDelta = false;
                if (doDelta) {
                    _this.deltaX = e.data.global.x - _this.lastX;
                    _this.deltaY = e.data.global.y - _this.lastY;
                    //console.log(this.deltaX + "," + this.deltaY);
                }
                //console.log(e);
                //console.log(e.data.global.x + "," + e.data.global.y);
                _this.lastX = e.data.global.x;
                _this.lastY = e.data.global.y;
            } else {
                _this.deltaX = 0;
                _this.deltaY = 0;
                _this.lastX = -1;
                _this.lastY = -1;
            }
        };
        // when done loading, arrange the sea tiles on theSea container
        this.setup = function () {
            var map1 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_002.png"].texture);
            var map2 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_003.png"].texture);
            var map3 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_004.png"].texture);
            var map4 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_005.png"].texture);
            var map5 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_006.png"].texture);
            var map6 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_007.png"].texture);
            var map7 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_008.png"].texture);
            var map8 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_009.png"].texture);
            var map9 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_010.png"].texture);
            var map10 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_011.png"].texture);
            var map11 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_012.png"].texture);
            var map12 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_013.png"].texture);
            var map13 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_014.png"].texture);
            var map14 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_015.png"].texture);
            // arranged left to right top to bottom
            // however the upleft tile is empty as is the lower left tile.. only tiles 2-15 are not empty sea
            map1.x = 2048;
            map1.y = 0;
            map2.x = 4096;
            map2.y = 0;
            map3.x = 6144;
            map3.y = 0;
            map4.x = 0;
            map4.y = 2048;
            map5.x = 2048;
            map5.y = 2048;
            map6.x = 4096;
            map6.y = 2048;
            map7.x = 6144;
            map7.y = 2048;
            map8.x = 0;
            map8.y = 4096;
            map9.x = 2048;
            map9.y = 4096;
            map10.x = 4096;
            map10.y = 4096;
            map11.x = 6144;
            map11.y = 4096;
            map12.x = 0;
            map12.y = 6144;
            map13.x = 2048;
            map13.y = 6144;
            map14.x = 4096;
            map14.y = 6144;
            _this.container.addChild(map1);
            _this.container.addChild(map2);
            _this.container.addChild(map3);
            _this.container.addChild(map4);
            _this.container.addChild(map5);
            _this.container.addChild(map6);
            _this.container.addChild(map7);
            _this.container.addChild(map8);
            _this.container.addChild(map9);
            _this.container.addChild(map10);
            _this.container.addChild(map11);
            _this.container.addChild(map12);
            _this.container.addChild(map13);
            _this.container.addChild(map14);
            _this.container.scale.x = _this.container.scale.y = 0.25;
            _this.loadRegion(); // for now this loads the islands, ideally it will load the sea tiles too
        };
        this.onIslesLoaded = function (responseText) {
            var json_data = JSON.parse(responseText);
            console.log(json_data);
            console.log(PIXI.loader.resources);
            // run through all entries in the json
            for (var key in json_data) {
                if (json_data.hasOwnProperty(key)) {
                    // create a sprite for each
                    var isle = new island_1.default();
                    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(json_data[key].fileName));
                    // position the sprite according to the data
                    sprite.x = json_data[key].x;
                    sprite.y = json_data[key].y;
                    // add sprite tgo the isle, this container, and the tracked object array
                    isle.setSprite(sprite);
                    _this.container.addChild(sprite);
                    _this.objectArray.push(isle);
                    console.log("Adding " + key + " to theSea");
                }
            }
            // final step in loading process.. can now call loadcallback
            _this.loadCallback();
        };
    }
    theSea.prototype.init = function (callback) {
        // load our background sea tiles
        PIXI.loader.add("images/4x4Region1/image_part_002.png").add("images/4x4Region1/image_part_003.png").add("images/4x4Region1/image_part_004.png").add("images/4x4Region1/image_part_005.png").add("images/4x4Region1/image_part_006.png").add("images/4x4Region1/image_part_007.png").add("images/4x4Region1/image_part_008.png").add("images/4x4Region1/image_part_009.png").add("images/4x4Region1/image_part_010.png").add("images/4x4Region1/image_part_011.png").add("images/4x4Region1/image_part_012.png").add("images/4x4Region1/image_part_013.png").add("images/4x4Region1/image_part_014.png").add("images/4x4Region1/image_part_015.png").add("images/islands/region1atlas.json") // loader automagically loads all the textures in this atlas
        .load(this.setup);
        this.loadCallback = callback;
    };
    theSea.prototype.loadRegion = function (regionName) {
        // load the region1 background sea tiles
        if (regionName === void 0) {
            regionName = "region1";
        }
        // load the region1 islands
        // load the island game data 
        this.loadJSON("./data/region1isles.json", this.onIslesLoaded);
        // islands are stored in a pool of sprites
    };
    theSea.prototype.loadJSON = function (jsonFile, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', './data/region1isles.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    };
    theSea.prototype.getContainer = function () {
        return this.container;
    };
    theSea.prototype.update = function () {
        this.container.x += this.deltaX;
        this.container.y += this.deltaY;
        this.deltaX = 0;
        this.deltaY = 0; // clear the data, await next mousemove
        // console.log(this.deltaX + "," + this.deltaY);
    };
    return theSea;
}();
exports.default = theSea;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var gameobject_1 = __webpack_require__(1);
var gameobject_2 = __webpack_require__(1);
var Island = /** @class */function (_super) {
    __extends(Island, _super);
    function Island() {
        var _this = _super.call(this) || this;
        _this.objType = gameobject_2.ObjectType.ISLAND;
        return _this;
    }
    return Island;
}(gameobject_1.default);
exports.default = Island;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map