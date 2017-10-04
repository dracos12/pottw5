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
//
// GameObject - the root class of all sprites
//
var PIXI = __webpack_require__(0);
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["NONE"] = 0] = "NONE";
    ObjectType[ObjectType["ISLAND"] = 1] = "ISLAND";
    ObjectType[ObjectType["SHIP"] = 2] = "SHIP";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));
var GameObject = /** @class */function () {
    function GameObject() {
        var _this = this;
        // the game object's sprite keeps positional information  x,y
        this.vx = 0; // velocity information
        this.vy = 0;
        this.z = 0; // z-sorting if necessary... z sort normally done by y position
        this.objType = ObjectType.NONE;
        this.cartPolyData = [];
        this.cartesianHitTest = function (p) {
            //console.log(this.polyData);
            if (_this.cartPolyData) {
                // point assumed to be in cartesian coords... compare this to our polyData via PolyK library
                return PolyK.ContainsPoint(_this.cartPolyData, p.x, p.y);
            } else {
                console.log("polyData not yet defined");
            }
        };
        this.refPoint = new PIXI.Point(0, 0);
    }
    GameObject.prototype.setRefPoint = function (x, y) {
        this.refPoint.x = x;
        this.refPoint.y = y;
    };
    GameObject.prototype.getType = function () {
        return this.objType;
    };
    GameObject.prototype.setSprite = function (newSprite) {
        this.sprite = newSprite;
    };
    GameObject.prototype.getSprite = function () {
        return this.sprite;
    };
    GameObject.prototype.setPolyData = function (p) {
        this.polyData = p;
        // copy the data to the cartPolyDataArray
        for (var i = 0; i < p.length; i++) this.cartPolyData[i] = p[i];
        this.convertPolyDataToCartesian();
    };
    GameObject.prototype.getCartPolyData = function () {
        return this.cartPolyData;
    };
    GameObject.prototype.convertPolyDataToCartesian = function () {
        // all data provided is an anti-clockwise polygonal data in local bitmap coordinates 
        // relative to the 0,0 top,left of the bitmap
        // PolyK needs this data in cartesian format, with 0,0 at bottom,left of the world
        //console.log(this.polyData);
        // loop through the array
        for (var i = 0; i < this.polyData.length; i++) {
            if (i % 2 == 0) {
                // x axis is same direction as cartesian
                this.cartPolyData[i] = this.cartPolyData[i] + this.sprite.x; // world coord x
            } else {
                // bottom left of our "world" is 0,8192
                var cartSpriteY = 8192 - this.sprite.y;
                this.cartPolyData[i] = cartSpriteY - this.cartPolyData[i];
            }
        }
        //console.log(this.polyData);
    };
    GameObject.prototype.update = function () {
        // NOP for base class functionality
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
var mainhud_1 = __webpack_require__(7);
var Core = /** @class */function () {
    function Core() {
        var _this = this;
        this.seaLoaded = false;
        this.hudLoaded = false;
        this.onLoaded = function () {
            // hud is done and needs no further loading
            _this.mainHUDLoaded();
            // theSea needs to load its data files
            _this._sea.setup();
            // the sea will call seaLoadedCallback when its finally done so we can proceed
        };
        this.mainHUDLoaded = function () {
            var c = _this._hud.getContainer();
            c.x = 0;
            c.y = 0;
            _this.hudLoaded = true;
            _this._hud.onAssetsLoaded();
            _this.postLoad();
        };
        this.seaLoadedCallback = function () {
            _this.seaLoaded = true;
            _this.postLoad();
        };
        this.update = function () {
            _this._sea.update();
            _this._renderer.render(_this._world);
            requestAnimationFrame(_this.update);
        };
        this._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0x7BA4DF });
        this._world = new PIXI.Container();
        document.body.appendChild(this._renderer.view);
        // create a new sea object
        this._sea = new theSea_1.default();
        this._sea.init(this.seaLoadedCallback);
        // crteate the main hud
        this._hud = new mainhud_1.default();
        this._hud.addLoaderAssets();
        // load all the assets requested by theSea and Hud
        PIXI.loader.load(this.onLoaded);
        console.log("PotTW: build 0.0.13");
    }
    Core.prototype.postLoad = function () {
        if (this.hudLoaded && this.seaLoaded) {
            this._world.addChild(this._sea.getContainer());
            this._world.addChild(this._hud.getContainer());
            // center hud on window size
            var c = this._hud.getContainer();
            c.x = (window.innerWidth - c.width) / 2;
            //mousewheel not part of Pixi so add the event to the DOM
            document.body.addEventListener("wheel", this._sea.mouseWheelHandler, false);
            this.update();
        }
    };
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
var gameobject_1 = __webpack_require__(1);
var island_1 = __webpack_require__(4);
var ship_1 = __webpack_require__(5);
var theSea = /** @class */function () {
    function theSea() {
        var _this = this;
        this.container = new PIXI.Container();
        this.deltaX = 0;
        this.deltaY = 0;
        this.lastX = -1;
        this.lastY = -1;
        this.objectArray = []; // array of all sprites added to theSea islands and ships (later, projectiles as well)
        this.wheelScale = 0.25;
        this.mouseDown = false;
        this.islandsLoaded = false;
        this.boatsLoaded = false;
        this.layerSeaTiles = new PIXI.Container();
        this.layerObjects = new PIXI.Container();
        //private layerUI:PIXI.Container = new PIXI.Container();
        // javascript style mouse wheel handler, pixi does not support mouse wheel
        this.mouseWheelHandler = function (e) {
            //console.log(e);
            if (e.wheelDelta > 0) {
                _this.wheelScale += 0.05;
                if (_this.wheelScale > 2.0) _this.wheelScale = 2.0;
                //console.log("wheel in");
            } else {
                _this.wheelScale -= 0.05;
                if (_this.wheelScale < 0.10) _this.wheelScale = 0.10;
                //console.log("wheel out");
            }
            var pos = new PIXI.Point(e.clientX, e.clientY);
            var preZoomWorld = _this.container.toLocal(pos); //this.screenToWorld(e.clientX, e.clientY);  
            //
            // perform the scale to the container
            //
            _this.container.scale.x = _this.container.scale.y = _this.wheelScale;
            // console.log("scale: " + this.wheelScale.toFixed(2) + 
            //             " pos: " + this.container.x.toFixed(2) + "," + this.container.y.toFixed(2) + " " + 
            //             "w: " + this.container.width.toFixed(2) + 
            //             " h: " + this.container.height.toFixed(2) +
            //             " mouse: " + e.clientX + "," + e.clientY
            //             );
            //where is the zoom location now, after we changed the scale?
            var postZoomWorld = _this.container.toLocal(pos); //this.screenToWorld(e.clientX, e.clientY);
            //console.log("pre: " + preZoomWorld.x + "," + preZoomWorld.y + " post: " + postZoomWorld.x + "," + postZoomWorld.y);
            var preZoomGlobal = _this.container.toGlobal(preZoomWorld);
            var postZoomGlobal = _this.container.toGlobal(postZoomWorld);
            //move the world so that the zoomed-location goes back to where it was on the screen before scaling        
            _this.container.x += postZoomGlobal.x - preZoomGlobal.x;
            _this.container.y += postZoomGlobal.y - preZoomGlobal.y;
        };
        this.mouseUpHandler = function (e) {
            _this.mouseDown = false;
        };
        this.mouseDownHandler = function (e) {
            if (e.target == _this.container) _this.mouseDown = true;
        };
        // pixi style event handler, not the same arguments as javascript mouse event
        this.mouseMoveHandler = function (e) {
            //document.getElementById("log").innerText = e.type;
            //console.log("G: " +e.data.global.x + "," + e.data.global.y);
            //console.log("mouseMoved");
            // console.log(this);
            // console.log("L: " + this.container.toLocal(e.data.global).x + ", " + this.container.toLocal(e.data.global).y);
            if (e.target != _this.container) {
                return;
            }
            if (e.data.buttons == 0) _this.mouseDown = false;
            if (_this.mouseDown) {
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
            /*
             *
             * mousemove/mouseover functionality for islands - test with polyk, prolly better done with pixi handling
             *
            //take the mouse coords and convert to world coords
            let pos = new PIXI.Point(e.data.global.x, e.data.global.y);
            let mouseWorld:PIXI.Point = this.container.toLocal(pos);
            // now convert this to cartesian coordinates
            // x is fine as is
            // y is inverted from bottom left of sea tiles 0,8192
            mouseWorld.y = 8192 - mouseWorld.y;
                  // walk the object array and perform a PolyK hittest against each island
            for (let entry of this.objectArray) {
                if (entry.getType() == ObjectType.ISLAND || entry.getType() == ObjectType.SHIP) {
                    var retVal = entry.cartesianHitTest(mouseWorld);
                    if (retVal == true) {
                        //console.log("Hit over " + entry.getSprite().name);
                    } else {
                        //console.log("hitTest returns: " + retVal + " mouse: " + mouseWorld.x + "," + mouseWorld.y);
                    }
                }
            }
            */
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
            _this.layerSeaTiles.addChild(map1);
            _this.layerSeaTiles.addChild(map2);
            _this.layerSeaTiles.addChild(map3);
            _this.layerSeaTiles.addChild(map4);
            _this.layerSeaTiles.addChild(map5);
            _this.layerSeaTiles.addChild(map6);
            _this.layerSeaTiles.addChild(map7);
            _this.layerSeaTiles.addChild(map8);
            _this.layerSeaTiles.addChild(map9);
            _this.layerSeaTiles.addChild(map10);
            _this.layerSeaTiles.addChild(map11);
            _this.layerSeaTiles.addChild(map12);
            _this.layerSeaTiles.addChild(map13);
            _this.layerSeaTiles.addChild(map14);
            _this.container.addChild(_this.layerSeaTiles); // sea tiles sort to bottom
            _this.container.addChild(_this.layerObjects); // all other objects will sort above it
            _this.container.scale.x = _this.container.scale.y = _this.wheelScale;
            _this.loadRegion(); // for now this loads the islands, ideally it will load the sea tiles too
        };
        this.sailTrimHandler = function (event) {
            // event.detail contains the data of percent 0->1 of of sail trim.. hadn this down to our boat
            _this.selectedBoat.setSailTrim(event.detail);
        };
        this.keyDownHandler = function (event) {
            console.log("Pressed key: " + event.keyCode);
            if (event.keyCode === 38) {
                _this.selectedBoat.increaseSail();
            } else if (event.keyCode === 40) {
                _this.selectedBoat.decreaseSail();
            } else if (event.keyCode === 37) {
                _this.selectedBoat.wheelLarboard();
            } else if (event.keyCode === 39) {
                _this.selectedBoat.wheelStarboard();
            }
        };
        this.keyUpHandler = function () {};
        this.onBoatsLoaded = function (responseText) {
            var json_data = JSON.parse(responseText);
            console.log(json_data);
            // save the boat data to hand to boast as they are created
            _this.boatData = json_data;
            // run through all entries in the json
            // for (var key in json_data) {
            //     if (json_data.hasOwnProperty(key)) { // "corvette" is the only boat so far 
            //         if (key == "corvette") // we good
            //         {
            //         } else {
            //             console.log("Found unrecognized key: " + key);
            //         }
            //     }
            // }
            _this.boatsLoaded = true;
            _this.checkFinishLoad();
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
                    // tag each sprite with its name (the key)
                    sprite.name = key;
                    // add sprite to the isle, this container, and the tracked object array
                    isle.setSprite(sprite);
                    _this.layerObjects.addChild(sprite);
                    _this.objectArray.push(isle);
                    // save its polygonal data
                    isle.setPolyData(json_data[key].polygonPts);
                    console.log("Adding " + sprite.name + " to theSea");
                }
            }
            _this.islandsLoaded = true;
            _this.checkFinishLoad();
        };
    }
    theSea.prototype.init = function (callback) {
        // load our background sea tiles
        PIXI.loader.add("images/4x4Region1/image_part_002.png").add("images/4x4Region1/image_part_003.png").add("images/4x4Region1/image_part_004.png").add("images/4x4Region1/image_part_005.png").add("images/4x4Region1/image_part_006.png").add("images/4x4Region1/image_part_007.png").add("images/4x4Region1/image_part_008.png").add("images/4x4Region1/image_part_009.png").add("images/4x4Region1/image_part_010.png").add("images/4x4Region1/image_part_011.png").add("images/4x4Region1/image_part_012.png").add("images/4x4Region1/image_part_013.png").add("images/4x4Region1/image_part_014.png").add("images/4x4Region1/image_part_015.png").add("images/islands/region1atlas.json") // loader automagically loads all the textures in this atlas
        .add("images/ships/corvette2.json");
        this.loadCallback = callback;
        this.container.interactive = true;
        this.container.on("mousemove", this.mouseMoveHandler);
        this.container.on("mouseup", this.mouseUpHandler);
        this.container.on("mousedown", this.mouseDownHandler);
        //Attach event listeners
        window.addEventListener("keydown", this.keyDownHandler, false);
        window.addEventListener("keyup", this.keyUpHandler, false);
        window.addEventListener("sailTrimEvent", this.sailTrimHandler, false);
    };
    theSea.prototype.loadRegion = function (regionName) {
        // load the region1 background sea tiles
        if (regionName === void 0) {
            regionName = "region1";
        }
        // load the region1 islands
        // load the island game data 
        this.loadJSON("./data/region1isles.json", this.onIslesLoaded);
        // load the boat data
        this.loadJSON("./data/shipdata.json", this.onBoatsLoaded);
    };
    // make sure all asyncronous loads have completed
    theSea.prototype.checkFinishLoad = function () {
        if (this.boatsLoaded && this.islandsLoaded) {
            // add a boat near guadelupe
            var boat = new ship_1.default();
            boat.init();
            boat.setPosition(6200, 2600);
            this.layerObjects.addChild(boat.getSprite());
            this.objectArray.push(boat);
            boat.setPolyData(this.boatData.corvette);
            this.selectedBoat = boat;
            // final step in loading process.. can now call loadcallback
            this.loadCallback();
        }
    };
    theSea.prototype.loadJSON = function (jsonFile, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', jsonFile, true);
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
    //
    // update function called per frame
    //
    theSea.prototype.update = function () {
        this.container.x += this.deltaX;
        this.container.y += this.deltaY;
        if (this.container.x > 0) this.container.x = 0;
        if (this.container.y > 0) this.container.y = 0;
        if (this.container.x < -(this.container.width - window.innerWidth)) this.container.x = -(this.container.width - window.innerWidth);
        if (this.container.y < -(this.container.height - window.innerHeight)) this.container.y = -(this.container.height - window.innerHeight);
        this.deltaX = 0;
        this.deltaY = 0; // clear the data, await next mousemove
        // console.log(this.deltaX + "," + this.deltaY);
        this.updateObjectArray();
    };
    theSea.prototype.updateObjectArray = function () {
        // sort the children ascending as the renderer will render sprites in container ordrer
        this.layerObjects.children.sort(this.objSort);
        // loop through our object array and call each element's update function
        for (var _i = 0, _a = this.objectArray; _i < _a.length; _i++) {
            var gameObj = _a[_i];
            gameObj.update();
        }
        // check for collisions against the playerboat
        this.checkPlayerBoatCollision();
    };
    theSea.prototype.objSort = function (a, b) {
        if (a.y < b.y) return -1;else if (a.y == b.y) return 0;else if (a.y > b.y) return 1;else return 0;
    };
    theSea.prototype.checkPlayerBoatCollision = function () {
        // first do a simple box hit test against the player boat and all the islands
        for (var _i = 0, _a = this.objectArray; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.getType() == gameobject_1.ObjectType.ISLAND) {
                if (this.boxHitTest(entry.getSprite(), this.selectedBoat.getSprite())) {
                    //console.log("boxHit!");
                    // sprites overlap, now do a PolyK hittest against all points on the boat with the islands polygonal data
                    if (this.selectedBoat.hitTestByPolygon(entry.getCartPolyData()) == true) {
                        console.log("Boat has struck - " + entry.getSprite().name);
                        this.selectedBoat.allStop();
                        return;
                    }
                }
            }
        }
        // if theres a hit, perform the polyk hittest for each poiint in the boats polykdata against the island polygon
    };
    theSea.prototype.boxHitTest = function (s1, s2) {
        var x1 = s1.x;
        var y1 = s1.y;
        var w1 = s1.width;
        var h1 = s1.height;
        var x2 = s2.x;
        var y2 = s2.y;
        var w2 = s2.width;
        var h2 = s2.height;
        if (x1 + w1 > x2) if (x1 < x2 + w2) if (y1 + h1 > y2) if (y1 < y2 + h2) return true;
        return false;
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// ship class to handle all things... boat!
//

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
var Victor = __webpack_require__(6);
var ShipType;
(function (ShipType) {
    ShipType[ShipType["SLOOP"] = 0] = "SLOOP";
    ShipType[ShipType["SCHOONER"] = 1] = "SCHOONER";
    ShipType[ShipType["XEBEC"] = 2] = "XEBEC";
    ShipType[ShipType["BRIG"] = 3] = "BRIG";
    ShipType[ShipType["CORVETTE"] = 4] = "CORVETTE";
})(ShipType = exports.ShipType || (exports.ShipType = {}));
var Ship = /** @class */function (_super) {
    __extends(Ship, _super);
    function Ship() {
        var _this = _super.call(this) || this;
        _this.polyNum = 0; // current heading corresponds to which index in the polyData array?
        _this.cartPolyData8 = []; // an array of 8 arrays converted to cartesian
        _this.cartKeelData = [];
        _this.cartesianHitTest = function (p) {
            //console.log(this.polyData);
            if (_this.cartPolyData8[_this.polyNum]) {
                // calculate the polygonal data for the ships position and its current sprite/heading
                _this.convertPolyDataToCartesian();
                // point assumed to be in cartesian coords... compare this to our polyData via PolyK library
                return PolyK.ContainsPoint(_this.cartPolyData8[_this.polyNum], p.x, p.y);
            } else {
                console.log("polyData not yet defined");
            }
        };
        _this.increaseSail = function () {
            _this.sailState = 2; // no support for half sail as yet
            _this.targetSpeed = 1; // ramp up to 60 pixels/sec speed is in pixels per frame
            console.log("increasing sail Captain!");
        };
        _this.decreaseSail = function () {
            _this.sailState = 0; // straight to no sails
            _this.targetSpeed = 0; // ramp down to no velocity
            console.log("Aye! Decreasing sail!");
        };
        _this.objType = gameobject_2.ObjectType.SHIP;
        _this.shipType = ShipType.CORVETTE;
        _this.sailState = 0; // down
        _this.speed = 0;
        _this.targetSpeed = 0;
        _this.heading = new Victor(1, 0); // east
        _this.degreeHeading = _this.heading.angleDeg();
        for (var i = 0; i < 8; i++) {
            _this.cartPolyData8.push(new Array());
        }
        return _this;
    }
    Ship.prototype.init = function () {
        this.sprite = new PIXI.Sprite(); // an empty sprite
        this.matchHeadingToSprite(); // initialize the texture its using
        this.name = "Nutmeg of Consolation";
    };
    Ship.prototype.setPolyData = function (p) {
        // p is the ship record from shipdata.json
        this.jsonData = p;
        this.sprite.name = this.jsonData["fileName"];
    };
    // ships move so they must convert their polyData each time it is referenced
    Ship.prototype.convertPolyDataToCartesian = function () {
        if (!this.jsonData) return;
        var root = this.jsonData["fileName"]; // root filename for subsequent polyData keys
        // extract the 8-way polydata arrays in each subobject in this data
        var key = root + "000" + (this.polyNum + 1) + ".png"; // polynum is zero based, frames are 1 based
        if (this.jsonData.hasOwnProperty(key)) {
            for (var k = 0; k < this.jsonData[key].polygonPts.length; k++) {
                if (k % 2 == 0) {
                    // x axis is same direction as cartesian
                    this.cartPolyData8[this.polyNum][k] = this.jsonData[key].polygonPts[k] + this.sprite.x; // world coord x
                } else {
                    // bottom left of our "world" is 0,8192
                    var cartSpriteY = 8192 - this.sprite.y;
                    this.cartPolyData8[this.polyNum][k] = cartSpriteY - this.jsonData[key].polygonPts[k];
                }
            }
            this.cartKeelData = []; // clear the array
            for (k = 0; k < this.jsonData[key].keelPts.length; k++) {
                if (k % 2 == 0) {
                    // x axis is same direction as cartesian
                    this.cartKeelData[k] = this.jsonData[key].keelPts[k] + this.sprite.x; // world coord x
                } else {
                    // bottom left of our "world" is 0,8192
                    var cartSpriteY = 8192 - this.sprite.y;
                    this.cartKeelData[k] = cartSpriteY - this.jsonData[key].keelPts[k];
                }
            }
        } else {
            console.log("Failed to find key: " + key + " in ship data!");
        }
    };
    Ship.prototype.hitTestByPolygon = function (polygonPts) {
        // convert our polygonal data relative to our position
        this.convertPolyDataToCartesian();
        var x, y;
        // console.log("Island polygon: " + polygonPts);
        // console.log("Boat Pts: " + this.cartPolyData8[this.polyNum]);
        for (var i = 0; i < this.cartPolyData8[this.polyNum].length; i += 2) {
            x = this.cartPolyData8[this.polyNum][i];
            y = this.cartPolyData8[this.polyNum][i + 1];
            // for each point in our polygon, do a polyK hittest on the passed in polygon
            if (PolyK.ContainsPoint(polygonPts, x, y)) {
                console.log("hit!");
                return true;
            }
        }
        return false;
    };
    Ship.prototype.hitTestByKeel = function (polygonPts) {
        // convert our polygonal data relative to our position
        this.convertPolyDataToCartesian();
        var x, y;
        // console.log("Island polygon: " + polygonPts);
        // console.log("Boat Pts: " + this.cartPolyData8[this.polyNum]);
        for (var i = 0; i < this.cartKeelData.length; i += 2) {
            x = this.cartKeelData[i];
            y = this.cartKeelData[i + 1];
            // for each point in our polygon, do a polyK hittest on the passed in polygon
            if (PolyK.ContainsPoint(polygonPts, x, y)) {
                console.log("hit!");
                return true;
            }
        }
        return false;
    };
    Ship.prototype.allStop = function () {
        this.sailState = 0; // lower the sails!
        this.speed = 0;
    };
    Ship.prototype.setPosition = function (x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    };
    Ship.prototype.matchHeadingToSprite = function () {
        // pick the spirte that is closest to ships heading... 
        // we have 8 directional sprites
        var a = this.heading.angleDeg();
        var s = this.getSprite();
        var modFrame = 0;
        var frameName = "";
        if (this.sailState == 0) modFrame = 8;
        if (this.shipType == ShipType.CORVETTE) frameName = "Corvette2";else frameName = "Corvette2"; // add other ship sprites here as they are added
        var frameNum = 0;
        if (a <= 22.5 && a > -22.5) {
            frameNum = 3;
            this.polyNum = frameNum - 1; // polynum 0 based, used later as index into polygonData8
        } else if (a <= 67.5 && a > 22.5) {
            frameNum = 2;
            this.polyNum = frameNum - 1;
        } else if (a <= 112.5 && a > 67.5) {
            frameNum = 1;
            this.polyNum = frameNum - 1;
        } else if (a <= 157.5 && a > 112.5) {
            frameNum = 8;
            this.polyNum = frameNum - 1;
        } else if (a <= -157.5 || a > 157.5) {
            frameNum = 7;
            this.polyNum = frameNum - 1;
        } else if (a <= -112.5 && a > -157.5) {
            frameNum = 6;
            this.polyNum = frameNum - 1;
        } else if (a <= -67.5 && a > -112.5) {
            frameNum = 5;
            this.polyNum = frameNum - 1;
        } else if (a <= -22.5 && a > -67.5) {
            frameNum = 4;
            this.polyNum = frameNum - 1;
        } else console.log("Ship class has invalid angle, texture could not be set");
        if (this.usingFrame != frameNum + modFrame) {
            // replace our texture with the appropriate facing
            s.texture = PIXI.Texture.fromFrame(frameName + this.getFrameString(frameNum, modFrame) + ".png");
            //console.log("replacing texture with frame: " + (frameNum + modFrame));
            console.log("heading:" + a.toFixed(0) + " frameDirection: " + frameNum);
            this.usingFrame = frameNum + modFrame;
        }
    };
    Ship.prototype.getFrameString = function (frameNum, mod) {
        var n = frameNum;
        if (mod != 0) n += mod;
        return this.zeroPad(n, 4);
    };
    Ship.prototype.zeroPad = function (num, numZeros) {
        var an = Math.abs(num);
        var digitCount = 1 + Math.floor(Math.log(an) / Math.LN10);
        if (digitCount >= numZeros) {
            return num.toString();
        }
        var zeroString = Math.pow(10, numZeros - digitCount).toString().substr(1);
        return num < 0 ? '-' + zeroString + an : zeroString + an;
    };
    Ship.prototype.setSailTrim = function (newTrim) {
        // set our speed based off the sail trim... sail trim is 0->1
        this.targetSpeed = newTrim * 1; // 1 is our max speed... max speed can be data driven per boat type
        if (this.targetSpeed <= 0) {
            this.targetSpeed = 0;
            this.sailState = 0;
        } else {
            this.sailState = 2; // sails up
        }
        console.log("setting Sail Trim: " + newTrim.toFixed(2));
    };
    Ship.prototype.wheelStarboard = function () {
        this.heading.rotateDeg(-15);
        this.heading.normalize();
        this.degreeHeading = this.heading.angleDeg();
        console.log("Aye Starboard wheel! Heading to: " + this.degreeHeading.toFixed(0));
    };
    // Victor lib is broken... rotate does what rotateby docs say, rotateby is broken
    Ship.prototype.wheelLarboard = function () {
        this.heading.rotateDeg(15);
        this.heading.normalize();
        this.degreeHeading = this.heading.angleDeg();
        console.log("Wheel a'Larboard Captain! Heading to: " + this.degreeHeading.toFixed(0) + " angDeg: " + this.heading.angleDeg().toFixed(0));
    };
    Ship.prototype.updatePosition = function () {
        // modify x and y based off heading and speed
        var s = this.getSprite();
        s.x += this.speed * this.heading.x;
        s.y += this.speed * -this.heading.y; // y is inverted... heading in cartesean, but our position coords origin is top,left
    };
    Ship.prototype.update = function () {
        // update the sprite position by the speed + heading
        if (this.targetSpeed != this.speed) {
            if (this.targetSpeed > this.speed) {
                this.speed += 0.01;
                if (this.speed > this.targetSpeed) this.speed = this.targetSpeed;
            } else {
                this.speed -= 0.01;
                if (this.speed < this.targetSpeed) this.speed = this.targetSpeed;
            }
        }
        this.updatePosition();
        // update its sprite if necessary
        this.matchHeadingToSprite();
    };
    return Ship;
}(gameobject_1.default);
exports.default = Ship;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

exports = module.exports = Victor;

/**
 * # Victor - A JavaScript 2D vector class with methods for common vector operations
 */

/**
 * Constructor. Will also work without the `new` keyword
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = Victor(42, 1337);
 *
 * @param {Number} x Value of the x axis
 * @param {Number} y Value of the y axis
 * @return {Victor}
 * @api public
 */
function Victor (x, y) {
	if (!(this instanceof Victor)) {
		return new Victor(x, y);
	}

	/**
	 * The X axis
	 *
	 * ### Examples:
	 *     var vec = new Victor.fromArray(42, 21);
	 *
	 *     vec.x;
	 *     // => 42
	 *
	 * @api public
	 */
	this.x = x || 0;

	/**
	 * The Y axis
	 *
	 * ### Examples:
	 *     var vec = new Victor.fromArray(42, 21);
	 *
	 *     vec.y;
	 *     // => 21
	 *
	 * @api public
	 */
	this.y = y || 0;
};

/**
 * # Static
 */

/**
 * Creates a new instance from an array
 *
 * ### Examples:
 *     var vec = Victor.fromArray([42, 21]);
 *
 *     vec.toString();
 *     // => x:42, y:21
 *
 * @name Victor.fromArray
 * @param {Array} array Array with the x and y values at index 0 and 1 respectively
 * @return {Victor} The new instance
 * @api public
 */
Victor.fromArray = function (arr) {
	return new Victor(arr[0] || 0, arr[1] || 0);
};

/**
 * Creates a new instance from an object
 *
 * ### Examples:
 *     var vec = Victor.fromObject({ x: 42, y: 21 });
 *
 *     vec.toString();
 *     // => x:42, y:21
 *
 * @name Victor.fromObject
 * @param {Object} obj Object with the values for x and y
 * @return {Victor} The new instance
 * @api public
 */
Victor.fromObject = function (obj) {
	return new Victor(obj.x || 0, obj.y || 0);
};

/**
 * # Manipulation
 *
 * These functions are chainable.
 */

/**
 * Adds another vector's X axis to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.addX(vec2);
 *     vec1.toString();
 *     // => x:30, y:10
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addX = function (vec) {
	this.x += vec.x;
	return this;
};

/**
 * Adds another vector's Y axis to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.addY(vec2);
 *     vec1.toString();
 *     // => x:10, y:40
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addY = function (vec) {
	this.y += vec.y;
	return this;
};

/**
 * Adds another vector to this one
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.add(vec2);
 *     vec1.toString();
 *     // => x:30, y:40
 *
 * @param {Victor} vector The other vector you want to add to this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.add = function (vec) {
	this.x += vec.x;
	this.y += vec.y;
	return this;
};

/**
 * Adds the given scalar to both vector axis
 *
 * ### Examples:
 *     var vec = new Victor(1, 2);
 *
 *     vec.addScalar(2);
 *     vec.toString();
 *     // => x: 3, y: 4
 *
 * @param {Number} scalar The scalar to add
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addScalar = function (scalar) {
	this.x += scalar;
	this.y += scalar;
	return this;
};

/**
 * Adds the given scalar to the X axis
 *
 * ### Examples:
 *     var vec = new Victor(1, 2);
 *
 *     vec.addScalarX(2);
 *     vec.toString();
 *     // => x: 3, y: 2
 *
 * @param {Number} scalar The scalar to add
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addScalarX = function (scalar) {
	this.x += scalar;
	return this;
};

/**
 * Adds the given scalar to the Y axis
 *
 * ### Examples:
 *     var vec = new Victor(1, 2);
 *
 *     vec.addScalarY(2);
 *     vec.toString();
 *     // => x: 1, y: 4
 *
 * @param {Number} scalar The scalar to add
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.addScalarY = function (scalar) {
	this.y += scalar;
	return this;
};

/**
 * Subtracts the X axis of another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtractX(vec2);
 *     vec1.toString();
 *     // => x:80, y:50
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractX = function (vec) {
	this.x -= vec.x;
	return this;
};

/**
 * Subtracts the Y axis of another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtractY(vec2);
 *     vec1.toString();
 *     // => x:100, y:20
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractY = function (vec) {
	this.y -= vec.y;
	return this;
};

/**
 * Subtracts another vector from this one
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(20, 30);
 *
 *     vec1.subtract(vec2);
 *     vec1.toString();
 *     // => x:80, y:20
 *
 * @param {Victor} vector The other vector you want subtract from this one
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtract = function (vec) {
	this.x -= vec.x;
	this.y -= vec.y;
	return this;
};

/**
 * Subtracts the given scalar from both axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 200);
 *
 *     vec.subtractScalar(20);
 *     vec.toString();
 *     // => x: 80, y: 180
 *
 * @param {Number} scalar The scalar to subtract
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractScalar = function (scalar) {
	this.x -= scalar;
	this.y -= scalar;
	return this;
};

/**
 * Subtracts the given scalar from the X axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 200);
 *
 *     vec.subtractScalarX(20);
 *     vec.toString();
 *     // => x: 80, y: 200
 *
 * @param {Number} scalar The scalar to subtract
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractScalarX = function (scalar) {
	this.x -= scalar;
	return this;
};

/**
 * Subtracts the given scalar from the Y axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 200);
 *
 *     vec.subtractScalarY(20);
 *     vec.toString();
 *     // => x: 100, y: 180
 *
 * @param {Number} scalar The scalar to subtract
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.subtractScalarY = function (scalar) {
	this.y -= scalar;
	return this;
};

/**
 * Divides the X axis by the x component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 0);
 *
 *     vec.divideX(vec2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Victor} vector The other vector you want divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideX = function (vector) {
	this.x /= vector.x;
	return this;
};

/**
 * Divides the Y axis by the y component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(0, 2);
 *
 *     vec.divideY(vec2);
 *     vec.toString();
 *     // => x:100, y:25
 *
 * @param {Victor} vector The other vector you want divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideY = function (vector) {
	this.y /= vector.y;
	return this;
};

/**
 * Divides both vector axis by a axis values of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 2);
 *
 *     vec.divide(vec2);
 *     vec.toString();
 *     // => x:50, y:25
 *
 * @param {Victor} vector The vector to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divide = function (vector) {
	this.x /= vector.x;
	this.y /= vector.y;
	return this;
};

/**
 * Divides both vector axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.divideScalar(2);
 *     vec.toString();
 *     // => x:50, y:25
 *
 * @param {Number} The scalar to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideScalar = function (scalar) {
	if (scalar !== 0) {
		this.x /= scalar;
		this.y /= scalar;
	} else {
		this.x = 0;
		this.y = 0;
	}

	return this;
};

/**
 * Divides the X axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.divideScalarX(2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Number} The scalar to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideScalarX = function (scalar) {
	if (scalar !== 0) {
		this.x /= scalar;
	} else {
		this.x = 0;
	}
	return this;
};

/**
 * Divides the Y axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.divideScalarY(2);
 *     vec.toString();
 *     // => x:100, y:25
 *
 * @param {Number} The scalar to divide by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.divideScalarY = function (scalar) {
	if (scalar !== 0) {
		this.y /= scalar;
	} else {
		this.y = 0;
	}
	return this;
};

/**
 * Inverts the X axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invertX();
 *     vec.toString();
 *     // => x:-100, y:50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invertX = function () {
	this.x *= -1;
	return this;
};

/**
 * Inverts the Y axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invertY();
 *     vec.toString();
 *     // => x:100, y:-50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invertY = function () {
	this.y *= -1;
	return this;
};

/**
 * Inverts both axis
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.invert();
 *     vec.toString();
 *     // => x:-100, y:-50
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.invert = function () {
	this.invertX();
	this.invertY();
	return this;
};

/**
 * Multiplies the X axis by X component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 0);
 *
 *     vec.multiplyX(vec2);
 *     vec.toString();
 *     // => x:200, y:50
 *
 * @param {Victor} vector The vector to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyX = function (vector) {
	this.x *= vector.x;
	return this;
};

/**
 * Multiplies the Y axis by Y component of given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(0, 2);
 *
 *     vec.multiplyX(vec2);
 *     vec.toString();
 *     // => x:100, y:100
 *
 * @param {Victor} vector The vector to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyY = function (vector) {
	this.y *= vector.y;
	return this;
};

/**
 * Multiplies both vector axis by values from a given vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     var vec2 = new Victor(2, 2);
 *
 *     vec.multiply(vec2);
 *     vec.toString();
 *     // => x:200, y:100
 *
 * @param {Victor} vector The vector to multiply by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiply = function (vector) {
	this.x *= vector.x;
	this.y *= vector.y;
	return this;
};

/**
 * Multiplies both vector axis by the given scalar value
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.multiplyScalar(2);
 *     vec.toString();
 *     // => x:200, y:100
 *
 * @param {Number} The scalar to multiply by
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyScalar = function (scalar) {
	this.x *= scalar;
	this.y *= scalar;
	return this;
};

/**
 * Multiplies the X axis by the given scalar
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.multiplyScalarX(2);
 *     vec.toString();
 *     // => x:200, y:50
 *
 * @param {Number} The scalar to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyScalarX = function (scalar) {
	this.x *= scalar;
	return this;
};

/**
 * Multiplies the Y axis by the given scalar
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.multiplyScalarY(2);
 *     vec.toString();
 *     // => x:100, y:100
 *
 * @param {Number} The scalar to multiply the axis with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.multiplyScalarY = function (scalar) {
	this.y *= scalar;
	return this;
};

/**
 * Normalize
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.normalize = function () {
	var length = this.length();

	if (length === 0) {
		this.x = 1;
		this.y = 0;
	} else {
		this.divide(Victor(length, length));
	}
	return this;
};

Victor.prototype.norm = Victor.prototype.normalize;

/**
 * If the absolute vector axis is greater than `max`, multiplies the axis by `factor`
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.limit(80, 0.9);
 *     vec.toString();
 *     // => x:90, y:50
 *
 * @param {Number} max The maximum value for both x and y axis
 * @param {Number} factor Factor by which the axis are to be multiplied with
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.limit = function (max, factor) {
	if (Math.abs(this.x) > max){ this.x *= factor; }
	if (Math.abs(this.y) > max){ this.y *= factor; }
	return this;
};

/**
 * Randomizes both vector axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomize(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:67, y:73
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomize = function (topLeft, bottomRight) {
	this.randomizeX(topLeft, bottomRight);
	this.randomizeY(topLeft, bottomRight);

	return this;
};

/**
 * Randomizes the y axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeX(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:55, y:50
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeX = function (topLeft, bottomRight) {
	var min = Math.min(topLeft.x, bottomRight.x);
	var max = Math.max(topLeft.x, bottomRight.x);
	this.x = random(min, max);
	return this;
};

/**
 * Randomizes the y axis with a value between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeY(new Victor(50, 60), new Victor(70, 80`));
 *     vec.toString();
 *     // => x:100, y:66
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeY = function (topLeft, bottomRight) {
	var min = Math.min(topLeft.y, bottomRight.y);
	var max = Math.max(topLeft.y, bottomRight.y);
	this.y = random(min, max);
	return this;
};

/**
 * Randomly randomizes either axis between 2 vectors
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.randomizeAny(new Victor(50, 60), new Victor(70, 80));
 *     vec.toString();
 *     // => x:100, y:77
 *
 * @param {Victor} topLeft first vector
 * @param {Victor} bottomRight second vector
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.randomizeAny = function (topLeft, bottomRight) {
	if (!! Math.round(Math.random())) {
		this.randomizeX(topLeft, bottomRight);
	} else {
		this.randomizeY(topLeft, bottomRight);
	}
	return this;
};

/**
 * Rounds both axis to an integer value
 *
 * ### Examples:
 *     var vec = new Victor(100.2, 50.9);
 *
 *     vec.unfloat();
 *     vec.toString();
 *     // => x:100, y:51
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.unfloat = function () {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	return this;
};

/**
 * Rounds both axis to a certain precision
 *
 * ### Examples:
 *     var vec = new Victor(100.2, 50.9);
 *
 *     vec.unfloat();
 *     vec.toString();
 *     // => x:100, y:51
 *
 * @param {Number} Precision (default: 8)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.toFixed = function (precision) {
	if (typeof precision === 'undefined') { precision = 8; }
	this.x = this.x.toFixed(precision);
	this.y = this.y.toFixed(precision);
	return this;
};

/**
 * Performs a linear blend / interpolation of the X axis towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mixX(vec2, 0.5);
 *     vec.toString();
 *     // => x:150, y:100
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mixX = function (vec, amount) {
	if (typeof amount === 'undefined') {
		amount = 0.5;
	}

	this.x = (1 - amount) * this.x + amount * vec.x;
	return this;
};

/**
 * Performs a linear blend / interpolation of the Y axis towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mixY(vec2, 0.5);
 *     vec.toString();
 *     // => x:100, y:150
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mixY = function (vec, amount) {
	if (typeof amount === 'undefined') {
		amount = 0.5;
	}

	this.y = (1 - amount) * this.y + amount * vec.y;
	return this;
};

/**
 * Performs a linear blend / interpolation towards another vector
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 100);
 *     var vec2 = new Victor(200, 200);
 *
 *     vec1.mix(vec2, 0.5);
 *     vec.toString();
 *     // => x:150, y:150
 *
 * @param {Victor} vector The other vector
 * @param {Number} amount The blend amount (optional, default: 0.5)
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.mix = function (vec, amount) {
	this.mixX(vec, amount);
	this.mixY(vec, amount);
	return this;
};

/**
 * # Products
 */

/**
 * Creates a clone of this vector
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = vec1.clone();
 *
 *     vec2.toString();
 *     // => x:10, y:10
 *
 * @return {Victor} A clone of the vector
 * @api public
 */
Victor.prototype.clone = function () {
	return new Victor(this.x, this.y);
};

/**
 * Copies another vector's X component in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copyX(vec1);
 *
 *     vec2.toString();
 *     // => x:20, y:10
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copyX = function (vec) {
	this.x = vec.x;
	return this;
};

/**
 * Copies another vector's Y component in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copyY(vec1);
 *
 *     vec2.toString();
 *     // => x:10, y:20
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copyY = function (vec) {
	this.y = vec.y;
	return this;
};

/**
 * Copies another vector's X and Y components in to its own
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *     var vec2 = new Victor(20, 20);
 *     var vec2 = vec1.copy(vec1);
 *
 *     vec2.toString();
 *     // => x:20, y:20
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.copy = function (vec) {
	this.copyX(vec);
	this.copyY(vec);
	return this;
};

/**
 * Sets the vector to zero (0,0)
 *
 * ### Examples:
 *     var vec1 = new Victor(10, 10);
 *		 var1.zero();
 *     vec1.toString();
 *     // => x:0, y:0
 *
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.zero = function () {
	this.x = this.y = 0;
	return this;
};

/**
 * Calculates the dot product of this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.dot(vec2);
 *     // => 23000
 *
 * @param {Victor} vector The second vector
 * @return {Number} Dot product
 * @api public
 */
Victor.prototype.dot = function (vec2) {
	return this.x * vec2.x + this.y * vec2.y;
};

Victor.prototype.cross = function (vec2) {
	return (this.x * vec2.y ) - (this.y * vec2.x );
};

/**
 * Projects a vector onto another vector, setting itself to the result.
 *
 * ### Examples:
 *     var vec = new Victor(100, 0);
 *     var vec2 = new Victor(100, 100);
 *
 *     vec.projectOnto(vec2);
 *     vec.toString();
 *     // => x:50, y:50
 *
 * @param {Victor} vector The other vector you want to project this vector onto
 * @return {Victor} `this` for chaining capabilities
 * @api public
 */
Victor.prototype.projectOnto = function (vec2) {
    var coeff = ( (this.x * vec2.x)+(this.y * vec2.y) ) / ((vec2.x*vec2.x)+(vec2.y*vec2.y));
    this.x = coeff * vec2.x;
    this.y = coeff * vec2.y;
    return this;
};


Victor.prototype.horizontalAngle = function () {
	return Math.atan2(this.y, this.x);
};

Victor.prototype.horizontalAngleDeg = function () {
	return radian2degrees(this.horizontalAngle());
};

Victor.prototype.verticalAngle = function () {
	return Math.atan2(this.x, this.y);
};

Victor.prototype.verticalAngleDeg = function () {
	return radian2degrees(this.verticalAngle());
};

Victor.prototype.angle = Victor.prototype.horizontalAngle;
Victor.prototype.angleDeg = Victor.prototype.horizontalAngleDeg;
Victor.prototype.direction = Victor.prototype.horizontalAngle;

Victor.prototype.rotate = function (angle) {
	var nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
	var ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

	this.x = nx;
	this.y = ny;

	return this;
};

Victor.prototype.rotateDeg = function (angle) {
	angle = degrees2radian(angle);
	return this.rotate(angle);
};

Victor.prototype.rotateTo = function(rotation) {
	return this.rotate(rotation-this.angle());
};

Victor.prototype.rotateToDeg = function(rotation) {
	rotation = degrees2radian(rotation);
	return this.rotateTo(rotation);
};

Victor.prototype.rotateBy = function (rotation) {
	var angle = this.angle() + rotation;

	return this.rotate(angle);
};

Victor.prototype.rotateByDeg = function (rotation) {
	rotation = degrees2radian(rotation);
	return this.rotateBy(rotation);
};

/**
 * Calculates the distance of the X axis between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceX(vec2);
 *     // => -100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceX = function (vec) {
	return this.x - vec.x;
};

/**
 * Same as `distanceX()` but always returns an absolute number
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.absDistanceX(vec2);
 *     // => 100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Absolute distance
 * @api public
 */
Victor.prototype.absDistanceX = function (vec) {
	return Math.abs(this.distanceX(vec));
};

/**
 * Calculates the distance of the Y axis between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceY(vec2);
 *     // => -10
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceY = function (vec) {
	return this.y - vec.y;
};

/**
 * Same as `distanceY()` but always returns an absolute number
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceY(vec2);
 *     // => 10
 *
 * @param {Victor} vector The second vector
 * @return {Number} Absolute distance
 * @api public
 */
Victor.prototype.absDistanceY = function (vec) {
	return Math.abs(this.distanceY(vec));
};

/**
 * Calculates the euclidean distance between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distance(vec2);
 *     // => 100.4987562112089
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distance = function (vec) {
	return Math.sqrt(this.distanceSq(vec));
};

/**
 * Calculates the squared euclidean distance between this vector and another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(200, 60);
 *
 *     vec1.distanceSq(vec2);
 *     // => 10100
 *
 * @param {Victor} vector The second vector
 * @return {Number} Distance
 * @api public
 */
Victor.prototype.distanceSq = function (vec) {
	var dx = this.distanceX(vec),
		dy = this.distanceY(vec);

	return dx * dx + dy * dy;
};

/**
 * Calculates the length or magnitude of the vector
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.length();
 *     // => 111.80339887498948
 *
 * @return {Number} Length / Magnitude
 * @api public
 */
Victor.prototype.length = function () {
	return Math.sqrt(this.lengthSq());
};

/**
 * Squared length / magnitude
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *
 *     vec.lengthSq();
 *     // => 12500
 *
 * @return {Number} Length / Magnitude
 * @api public
 */
Victor.prototype.lengthSq = function () {
	return this.x * this.x + this.y * this.y;
};

Victor.prototype.magnitude = Victor.prototype.length;

/**
 * Returns a true if vector is (0, 0)
 *
 * ### Examples:
 *     var vec = new Victor(100, 50);
 *     vec.zero();
 *
 *     // => true
 *
 * @return {Boolean}
 * @api public
 */
Victor.prototype.isZero = function() {
	return this.x === 0 && this.y === 0;
};

/**
 * Returns a true if this vector is the same as another
 *
 * ### Examples:
 *     var vec1 = new Victor(100, 50);
 *     var vec2 = new Victor(100, 50);
 *     vec1.isEqualTo(vec2);
 *
 *     // => true
 *
 * @return {Boolean}
 * @api public
 */
Victor.prototype.isEqualTo = function(vec2) {
	return this.x === vec2.x && this.y === vec2.y;
};

/**
 * # Utility Methods
 */

/**
 * Returns an string representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toString();
 *     // => x:10, y:20
 *
 * @return {String}
 * @api public
 */
Victor.prototype.toString = function () {
	return 'x:' + this.x + ', y:' + this.y;
};

/**
 * Returns an array representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toArray();
 *     // => [10, 20]
 *
 * @return {Array}
 * @api public
 */
Victor.prototype.toArray = function () {
	return [ this.x, this.y ];
};

/**
 * Returns an object representation of the vector
 *
 * ### Examples:
 *     var vec = new Victor(10, 20);
 *
 *     vec.toObject();
 *     // => { x: 10, y: 20 }
 *
 * @return {Object}
 * @api public
 */
Victor.prototype.toObject = function () {
	return { x: this.x, y: this.y };
};


var degrees = 180 / Math.PI;

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function radian2degrees (rad) {
	return rad * degrees;
}

function degrees2radian (deg) {
	return deg / degrees;
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// the main HUD, overlays theSea
//

Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __webpack_require__(0);
var sailtrim_1 = __webpack_require__(8);
var compassrose_1 = __webpack_require__(9);
var MainHUD = /** @class */function () {
    function MainHUD() {
        this.container = new PIXI.Container();
    }
    // request the assets we need loaded
    MainHUD.prototype.addLoaderAssets = function () {
        PIXI.loader.add("./images/ui/pottw5ui.json");
    };
    // assets are loaded, initialize sprites etc
    MainHUD.prototype.onAssetsLoaded = function () {
        console.log(PIXI.loader.resources);
        // create and place the header
        this.header = new PIXI.Sprite(PIXI.Texture.fromFrame("UI_Header.png"));
        this.header.x = 0;
        this.header.y = 0;
        // create and place the footer
        this.footer = new PIXI.Sprite(PIXI.Texture.fromFrame("UIFooter.png"));
        this.footer.x = 0;
        this.footer.y = window.innerHeight - this.footer.height;
        this.cannons = new PIXI.Sprite(PIXI.Texture.fromFrame("CannonArray.png"));
        this.cannons.x = this.footer.width - this.cannons.width + 40;
        this.cannons.y = this.footer.y;
        this.compassRose = new compassrose_1.default();
        this.compassRose.init();
        this.compassRose.scale.x = 0.67;
        this.compassRose.scale.y = 0.67;
        this.compassRose.x = this.cannons.x - this.compassRose.width + 20;
        this.compassRose.y = window.innerHeight - this.compassRose.height;
        this._sailTrim = new sailtrim_1.default();
        this._sailTrim.init();
        this._sailTrim.x = this.compassRose.x - this._sailTrim.width - 5;
        this._sailTrim.y = window.innerHeight - this._sailTrim.height;
        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.cannons);
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
    };
    MainHUD.prototype.getContainer = function () {
        return this.container;
    };
    return MainHUD;
}();
exports.default = MainHUD;

/***/ }),
/* 8 */
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
//
// sail trim widget
//
var PIXI = __webpack_require__(0);
var sailTrim = /** @class */function (_super) {
    __extends(sailTrim, _super);
    function sailTrim() {
        var _this = _super.call(this) || this;
        _this.mouseDown = false;
        _this.lastY = -1;
        _this.mouseMoveHandler = function (e) {
            if (e.data.buttons == 0) {
                if (_this.mouseDown) {
                    _this.endSetTrim();
                }
            }
            if (_this.mouseDown) {
                // move the mainlLine up and down only depending on delta in Y
                if (_this.lastY != -1) {
                    _this.deltaY = _this.lastY - e.data.global.y;
                    // move the mainLine
                    _this.mainLine.y -= _this.deltaY;
                    // cap the movement
                    if (_this.mainLine.y < -100) _this.mainLine.y = -100;else if (_this.mainLine.y > 110) _this.mainLine.y = 110;
                    // set the percentage here
                    _this.sailTrimPercent = (_this.mainLine.y + 100) / 210;
                    _this.sail.scale.y = _this.sailTrimPercent * 2;
                }
                _this.lastY = e.data.global.y;
            }
        };
        _this.mouseDownHandler = function (e) {
            if (e.target == _this.mainLine) {
                _this.mouseDown = true;
            }
        };
        _this.mouseUpHandler = function (e) {
            // release mouse no matter what the e.target was
            _this.endSetTrim();
        };
        return _this;
    }
    // init assumes it has its sprite assets available
    sailTrim.prototype.init = function () {
        this.thumbSlider = new PIXI.Container();
        this.mainLine = new PIXI.Sprite(PIXI.Texture.fromFrame("sliderThumb2.png"));
        this.thumbSlider.addChild(this.mainLine);
        this.mainLineMask = new PIXI.Graphics();
        this.mainLineMask.beginFill(0xFF0000);
        this.mainLineMask.drawRect(0, 0, this.mainLine.width, 235);
        this.mainLineMask.endFill();
        this.mainLineMask.x = 0;
        this.mainLineMask.y = this.mainLine.height / 2 - this.mainLineMask.height / 2; // centered on mainLine
        this.thumbSlider.addChild(this.mainLineMask);
        this.mainLine.mask = this.mainLineMask;
        this.sail = new PIXI.Sprite(PIXI.Texture.fromFrame("Sail_Yscale.png"));
        this.sail.x = -7;
        this.sail.y = 56;
        this.addChild(this.sail);
        this.trimMast = new PIXI.Sprite(PIXI.Texture.fromFrame("sliderBack.png"));
        this.addChild(this.trimMast); // 0,0
        this.thumbSlider.x = 70; // thumbSlider is 454 pix tall and will slide under mask so only 235 of it is viewed at one time
        this.thumbSlider.y = -60;
        this.addChild(this.thumbSlider); // add the thumbslider to our own container
        this.mainLine.interactive = true;
        this.mainLine.on("mousemove", this.mouseMoveHandler);
        this.mainLine.on("mousedown", this.mouseDownHandler);
        this.mainLine.on("mouseup", this.mouseUpHandler);
    };
    sailTrim.prototype.getSailTrimPercent = function () {
        return this.sailTrimPercent;
    };
    sailTrim.prototype.endSetTrim = function () {
        this.mouseDown = false;
        this.lastY = -1;
        var myEvent = new CustomEvent("sailTrimEvent", {
            'detail': this.sailTrimPercent
        });
        window.dispatchEvent(myEvent);
    };
    return sailTrim;
}(PIXI.Container);
exports.default = sailTrim;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// CompassRose class widget 
//  displays ship heading, cannon angle, and wind direction
//  ship heading is interactive and allows the player to change the heading
//  allows the player to adjust the cannon angle as well
//

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
var PIXI = __webpack_require__(0);
var CompassRose = /** @class */function (_super) {
    __extends(CompassRose, _super);
    function CompassRose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // init assumes it has its sprite assets available
    CompassRose.prototype.init = function () {
        this.compassBase = new PIXI.Sprite(PIXI.Texture.fromFrame("compassBase.png"));
        this.starCap = new PIXI.Sprite(PIXI.Texture.fromFrame("starRotate.png"));
        this.starCap.x = (this.compassBase.width - this.starCap.width) / 2;
        this.starCap.y = (this.compassBase.height - this.starCap.height) / 2; // centered
        this.needleHeading = new PIXI.Sprite(PIXI.Texture.fromFrame("needleShip.png"));
        // this.needleHeading.pivot.x = this.needleHeading.width / 2;
        // this.needleHeading.pivot.y = this.needleHeading.height;  // bottom center of sprite
        this.needleHeading.anchor.x = 0.5;
        this.needleHeading.anchor.y = 1; // anchor at center bottom
        this.needleHeading.x = 200;
        this.needleHeading.y = 200;
        this.needleHeading.rotation = this.getRads(15);
        this.needleCannon = new PIXI.Sprite(PIXI.Texture.fromFrame("needleCannon.png"));
        // this.needleCannon.pivot.x = this.needleCannon.width / 2;
        // this.needleCannon.pivot.y = this.needleCannon.height;  // bottom center of sprite
        this.needleCannon.anchor.x = 0.5;
        this.needleCannon.anchor.y = 1; // anchor at center bottom
        this.needleCannon.x = 200;
        this.needleCannon.y = 200; // centered on compass base
        this.needleCannon.rotation = this.getRads(105);
        this.windDirection = new PIXI.Sprite(PIXI.Texture.fromFrame("WindIndicator.png"));
        // this.windDirection.pivot.x = 29;
        // this.windDirection.pivot.y = 183;  // will rotate around this point against the compass base background
        this.windDirection.anchor.x = 0.5;
        this.windDirection.anchor.y = 2.5;
        this.windDirection.x = 200; //this.compassBase.width / 2 - this.windDirection.width / 2;
        this.windDirection.y = 200; //17; // magic number
        this.addChild(this.compassBase); // z order will be in child order, back to front
        this.addChild(this.windDirection);
        this.addChild(this.needleHeading);
        this.addChild(this.needleCannon);
        this.addChild(this.starCap);
    };
    CompassRose.prototype.getRads = function (degrees) {
        return degrees * Math.PI / 180;
    };
    return CompassRose;
}(PIXI.Container);
exports.default = CompassRose;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map