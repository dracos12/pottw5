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
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
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
// singleton for static/global objects
//
var player_1 = __webpack_require__(19);
var theSea_1 = __webpack_require__(6);
var economyitem_1 = __webpack_require__(7);
var SingletonClass = /** @class */function () {
    function SingletonClass() {
        if (SingletonClass._instance) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        SingletonClass._instance = this;
    }
    SingletonClass.getInstance = function () {
        return SingletonClass._instance;
    };
    Object.defineProperty(SingletonClass, "ship", {
        get: function () {
            return SingletonClass.playerShip;
        },
        enumerable: true,
        configurable: true
    });
    SingletonClass.prototype.SetShip = function (newShip) {
        SingletonClass.playerShip = newShip;
    };
    Object.defineProperty(SingletonClass, "player", {
        get: function () {
            return SingletonClass.playerObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingletonClass, "popupManager", {
        get: function () {
            return this._popupManager;
        },
        set: function (newpopman) {
            this._popupManager = newpopman;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingletonClass, "currentPort", {
        get: function () {
            return this._currentPort;
        },
        set: function (newPort) {
            this._currentPort = newPort;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingletonClass, "uiDisplayed", {
        get: function () {
            return this._uiDisplayed;
        },
        set: function (isVis) {
            this._uiDisplayed = isVis;
        },
        enumerable: true,
        configurable: true
    });
    SingletonClass.getPortMarketData = function (portName) {
        //console.log(this._marketData);
        if (this._marketData.hasOwnProperty(portName)) {
            return this._marketData[portName]; // return the object for this port data
        } else {
            SingletonClass.generateMarketData(portName);
            return this._marketData[portName];
        }
    };
    SingletonClass.setPortMarketData = function (portName, dataObj) {
        this._marketData[portName] = dataObj;
    };
    SingletonClass.setPortWarehouseData = function (portName, dataObj) {
        this._warehouseData[portName] = dataObj;
    };
    SingletonClass.generateMarketData = function (portName) {
        // generate the data and store it on the singleton
        var i, rate, up;
        var data = {};
        for (i = 0; i < economyitem_1.default.maxItems; i++) {
            rate = theSea_1.default.getRandomIntInclusive(0, 100);
            if (theSea_1.default.getRandomIntInclusive(0, 1) == 1) up = true;else up = false;
            data[i] = { rate: rate, up: up };
        }
        // store this on the singletone with our town info
        SingletonClass.setPortMarketData(portName, data);
        //console.log("Generating market data for : " +  town);
        // return our generated object
        return data;
    };
    SingletonClass.getPortWarehouseData = function (portName) {
        //console.log(this._marketData);
        if (this._warehouseData.hasOwnProperty(portName)) {
            return this._warehouseData[portName]; // return the object for this port data
        } else {
            SingletonClass.generateWarehouseData(portName);
            return this._warehouseData[portName];
        }
    };
    SingletonClass.rateComp = function (a, b) {
        return a.rate - b.rate;
    };
    SingletonClass.generateWarehouseData = function (portName) {
        // get the market data for this port
        var marketData = SingletonClass.getPortMarketData(portName);
        // randomly generate items with the smallest rate (lowest demand)
        // generate an array of items and sort it on rate
        var k;
        var rateSort = [];
        for (k = 0; k < economyitem_1.default.maxItems; k++) {
            rateSort.push({ itemid: k, rate: marketData[k].rate });
        }
        rateSort.sort(this.rateComp);
        //console.log(rateSort);
        // generate the data and store it on the singleton
        var i, j, rate, up;
        var data = {};
        var items = [];
        var sampleIndex = 6; // array in descending order of demand, take the top 6 
        for (i = 0; i < 40; i++) {
            j = theSea_1.default.getRandomIntInclusive(0, sampleIndex);
            items.push(rateSort[j].itemid);
        }
        items.sort(); // sort ascending the list of itemids
        var now = Date.now();
        data = { lastTime: now, items: items };
        // store this on the singletone with our town info
        SingletonClass.setPortWarehouseData(portName, data);
        //console.log("Generating market data for : " +  town);
        // return our generated object
        return data;
    };
    SingletonClass.getMarketItemPrice = function (itemID) {
        var marketPrice, value;
        // item price is in in the item data
        value = economyitem_1.default.jsonData[itemID].value;
        // modify this by the market rate at the current port
        var port = this._currentPort;
        var marketData = SingletonClass.getPortMarketData(port);
        marketPrice = Math.floor(value + Math.ceil(value * marketData[itemID].rate / 100));
        // return the modified price
        return marketPrice;
    };
    SingletonClass._instance = new SingletonClass();
    SingletonClass.playerObject = new player_1.default(); // instantiate the player object
    SingletonClass._currentPort = "";
    SingletonClass._marketData = {};
    SingletonClass._warehouseData = {};
    SingletonClass._uiDisplayed = false;
    return SingletonClass;
}();
exports.default = SingletonClass;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// Button class for button behavior to sprites
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
var filters = __webpack_require__(12);
var Button = /** @class */function (_super) {
    __extends(Button, _super);
    function Button(texture, noScale, text, fontSize) {
        if (noScale === void 0) {
            noScale = false;
        }
        if (text === void 0) {
            text = "";
        }
        if (fontSize === void 0) {
            fontSize = 22;
        }
        var _this = _super.call(this, texture) || this;
        _this.disabled = false;
        _this.noScale = false;
        _this.origScale = 0;
        _this.strLabel = "";
        _this.firstMouse = true;
        _this.onMouseDown = function () {
            if (_this.disabled) return;
            if (!_this.noScale) {
                _this.scale.x = _this.scale.y = _this.origScale * 0.67;
            }
            _this.filters = [];
        };
        _this.onMouseUp = function () {
            if (_this.disabled) return;
            if (!_this.noScale) {
                _this.scale.x = _this.scale.y = _this.origScale;
                //console.log("Button returning to scale: " + this.origScale);
            }
        };
        _this.onMouseOver = function () {
            if (_this.disabled) return;
            if (_this.firstMouse) {
                _this.origScale = _this.scale.x;
                _this.firstMouse = false;
                //console.log("Recording origScale: " + this.origScale);
            }
            // apply glow filter
            _this.filters = [_this.glow];
        };
        _this.onMouseOut = function () {
            if (_this.disabled) return;
            _this.filters = [];
            if (!_this.noScale) {
                _this.scale.x = _this.scale.y = _this.origScale;
            }
        };
        _this.interactive = true;
        _this.on('mousedown', _this.onMouseDown);
        _this.on('mouseup', _this.onMouseUp);
        _this.on('mouseover', _this.onMouseOver);
        _this.on('mouseout', _this.onMouseOut);
        _this.glow = new filters.GlowFilter(10, 1, 1, 0xFFFFFF);
        if (!noScale) _this.anchor.x = _this.anchor.y = 0.5; // buttons center anchor so scale effects are proprtionate
        _this.noScale = noScale;
        _this.origScale = _this.scale.x;
        if (text != "") {
            _this.strLabel = text;
            var style = new PIXI.TextStyle({
                fontFamily: 'IM Fell English SC',
                fontSize: fontSize,
                fill: 'white'
            });
            _this.label = new PIXI.Text(text, style);
            if (_this.noScale) {
                _this.label.x = _this.width / 2 - _this.label.width / 2;
                _this.label.y = _this.height / 2 - _this.label.height / 2;
            } else {
                _this.label.x = -_this.label.width / 2;
                _this.label.y = -_this.label.height / 2;
            }
            _this.addChild(_this.label);
        }
        return _this;
    }
    Button.prototype.setDisabled = function (disabled) {
        this.disabled = disabled;
        if (disabled) {
            this.tint = 0x333333; // dark grey
            this.alpha = 0.5;
        } else {
            this.tint = 0xFFFFFF; // clear any tint
            this.alpha = 1.0;
        }
    };
    return Button;
}(PIXI.Sprite);
exports.default = Button;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// PopUp bass class - all popups should extend this
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
var button_1 = __webpack_require__(2);
var PopUp = /** @class */function (_super) {
    __extends(PopUp, _super);
    function PopUp(onClose) {
        var _this = _super.call(this) || this;
        _this.onClose = null;
        _this.managerClose = null; // second callback for the popupmanager onclose
        _this._backgrounded = false;
        _this.btnXClick = function () {
            _this.close(); // will callback to popupmanager to remove us from display
        };
        return _this;
    }
    PopUp.prototype.close = function () {
        if (this.onClose != null) this.onClose(); // call our call back
        if (this.managerClose != null) this.managerClose();
    };
    PopUp.prototype.setManagerClose = function (onClose) {
        this.managerClose = onClose;
    };
    // children will override
    PopUp.prototype.init = function () {
        // load and position our graphics
        this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_map.png"));
        this.addChild(this.bg);
        this.bg.interactive = true;
        this.btnX = new button_1.default(PIXI.Texture.fromFrame("Btn_Ex.png"));
        this.btnX.anchor.x = this.btnX.anchor.y = 0.5;
        this.btnX.x = 713;
        this.btnX.y = 42;
        this.addChild(this.btnX);
        this.btnX.on('click', this.btnXClick);
    };
    PopUp.prototype.backgrounded = function () {
        this._backgrounded = true;
    };
    PopUp.prototype.top = function () {
        this._backgrounded = false;
    };
    return PopUp;
}(PIXI.Container);
exports.default = PopUp;

/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __webpack_require__(0);
var gameobject_1 = __webpack_require__(4);
var island_1 = __webpack_require__(18);
var ship_1 = __webpack_require__(10);
var fxmanager_1 = __webpack_require__(20);
var singleton_1 = __webpack_require__(1);
var selectwidget_1 = __webpack_require__(16);
var selectwidget_2 = __webpack_require__(16);
var theSea = /** @class */function () {
    function theSea() {
        var _this = this;
        this.container = new PIXI.Container();
        this.deltaX = 0;
        this.deltaY = 0;
        this.lastX = -1;
        this.lastY = -1;
        this.islandArray = []; // array of all sprites added to theSea islands and ships (later, projectiles as well)
        this.shipArray = []; // pool of boats on theSea
        this.wheelScale = 0.25;
        this.mouseDown = false;
        this.playerSelected = false;
        this.targetedBoat = null; // user can target a boat for information
        this.boatTargeted = false;
        this.islandsLoaded = false;
        this.boatsLoaded = false;
        // layers so sea tiles always sorted beneath ships/islands
        this.layerSeaTiles = new PIXI.Container();
        this.layerSelection = new PIXI.Container();
        this.layerObjects = new PIXI.Container();
        this.layerUI = new PIXI.Container();
        this.numPorts = 0; // number of islands in the island array that are ports
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
            var map15 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_016.png"].texture);
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
            map15.x = 6144;
            map15.y = 6144;
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
            _this.layerSeaTiles.addChild(map15);
            _this.container.addChild(_this.layerSeaTiles); // sea tiles sort to bottom
            _this.container.addChild(_this.layerSelection);
            _this.container.addChild(_this.layerObjects); // all other objects will sort above it
            _this.container.addChild(_this.layerUI);
            _this.container.scale.x = _this.container.scale.y = _this.wheelScale;
            _this.loadRegion(); // for now this loads the islands, ideally it will load the sea tiles too
            _this.fxManager.onAssetsLoaded(); // fxManager can now initialize with its assets
            _this.selectWidget = new selectwidget_1.default(selectwidget_2.SelectType.FRIENDLY);
            _this.targetWidget = new selectwidget_1.default(selectwidget_2.SelectType.ENEMY);
        };
        this.aiShipMouseDown = function (e) {
            // mouse down on non-wrecked ai boat
            var boat = e.detail;
            // put target widget on its position
            if (_this.targetedBoat != boat) {
                if (_this.targetedBoat != null) {
                    _this.targetedBoat.hideAITarget();
                }
                _this.targetedBoat = boat;
                var ref = _this.targetedBoat.getRefPtVictor();
                _this.targetWidget.x = ref.x;
                _this.targetWidget.y = ref.y;
                _this.layerSelection.addChild(_this.targetWidget);
                _this.targetWidget.play();
                _this.boatTargeted = true;
                _this.targetedBoat.showAITarget();
            } else {
                // clicked tagrte again, detarget
            }
        };
        this.sailTrimHandler = function (event) {
            // event.detail contains the data of percent 0->1 of of sail trim.. hadn this down to our boat
            _this.selectedBoat.setSailTrim(event.detail);
        };
        this.keyDownHandler = function (event) {
            //console.log("Pressed key: " + event.keyCode);
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
        this.aiShipRespawn = function (e) {
            var poolID = e.detail;
            if (_this.targetedBoat != null && _this.targetedBoat.getPoolID() == poolID) {
                _this.clearTarget();
            }
            _this.reSpawnAI(poolID);
        };
        this.onBoatsLoaded = function (responseText) {
            var json_data = JSON.parse(responseText);
            //console.log(json_data);
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
            //console.log(json_data);
            //console.log(PIXI.loader.resources);
            // run through all entries in the json
            for (var key in json_data) {
                if (json_data.hasOwnProperty(key)) {
                    // create a sprite for each
                    var isle = new island_1.default();
                    var sprite;
                    if (key == "Trinidad") {
                        sprite = new PIXI.Sprite(PIXI.loader.resources["images/islands/trinidad.png"].texture);
                    } else {
                        sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(json_data[key].fileName));
                    }
                    // position the sprite according to the data
                    sprite.x = json_data[key].x;
                    sprite.y = json_data[key].y;
                    // tag each sprite with its name (the key)
                    sprite.name = key;
                    // add sprite to the isle, this container, and the tracked object array
                    isle.setSprite(sprite);
                    _this.layerObjects.addChild(sprite);
                    _this.islandArray.push(isle);
                    // save its polygonal data
                    isle.setPolyData(json_data[key].polygonPts);
                    isle.setData(json_data[key]); // save out the entire entry for isle's later use
                    if (isle.isPort()) {
                        _this.numPorts++;
                        //console.log("Discovered Port: " + json_data[key].portName)
                        sprite.hitArea = new PIXI.Polygon(json_data[key].polygonPts);
                    }
                    //console.log("Adding " + sprite.name + " to theSea");
                }
            }
            _this.islandsLoaded = true;
            _this.checkFinishLoad();
        };
    }
    theSea.prototype.getWheelScale = function () {
        return this.wheelScale;
    };
    theSea.prototype.getUILayer = function () {
        return this.layerUI;
    };
    theSea.prototype.selectPlayer = function () {
        // put the sleect widget under the player boat
        var ref = this.selectedBoat.getRefPtVictor();
        this.selectWidget.x = ref.x;
        this.selectWidget.y = ref.y;
        this.layerSelection.addChild(this.selectWidget);
        this.selectWidget.play();
        this.playerSelected = true;
    };
    theSea.prototype.deselectPlayer = function () {
        this.layerSelection.removeChild(this.selectWidget);
        this.selectWidget.stop();
        this.playerSelected = false;
    };
    theSea.prototype.init = function (callback) {
        // load our background sea tiles
        PIXI.loader.add("images/4x4Region1/image_part_002.png").add("images/4x4Region1/image_part_003.png").add("images/4x4Region1/image_part_004.png").add("images/4x4Region1/image_part_005.png").add("images/4x4Region1/image_part_006.png").add("images/4x4Region1/image_part_007.png").add("images/4x4Region1/image_part_008.png").add("images/4x4Region1/image_part_009.png").add("images/4x4Region1/image_part_010.png").add("images/4x4Region1/image_part_011.png").add("images/4x4Region1/image_part_012.png").add("images/4x4Region1/image_part_013.png").add("images/4x4Region1/image_part_014.png").add("images/4x4Region1/image_part_015.png").add("images/4x4Region1/image_part_016.png").add("images/islands/region1islands.json") // loader automagically loads all the textures in this atlas
        .add("images/ships/corvette2.json").add("images/islands/trinidad.png");
        this.loadCallback = callback;
        this.fxManager = new fxmanager_1.default();
        this.fxManager.addLoaderAssets(); // have fxManager request its assets
        this.fxManager.setFXContainer(this.layerObjects); // give the fxManager its layer to add fx to
        this.container.interactive = true;
        this.container.on("mousemove", this.mouseMoveHandler);
        this.container.on("mouseup", this.mouseUpHandler);
        this.container.on("mousedown", this.mouseDownHandler);
        //Attach event listeners
        window.addEventListener("keydown", this.keyDownHandler, false);
        window.addEventListener("keyup", this.keyUpHandler, false);
        window.addEventListener("sailTrimEvent", this.sailTrimHandler, false);
        window.addEventListener("aiShipMouseDown", this.aiShipMouseDown, false);
        window.addEventListener("aiReSpawn", this.aiShipRespawn, false);
    };
    theSea.prototype.clearTarget = function () {
        this.layerSelection.removeChild(this.targetWidget);
        this.targetWidget.stop();
        this.boatTargeted = false;
        this.targetedBoat = null;
        var myEvent = new CustomEvent("clearTarget", {
            'detail': 0
        });
        window.dispatchEvent(myEvent);
        console.log("Sending clearTarget msg to HUD");
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
            // add the player boat near guadelupe
            var boat = new ship_1.default();
            boat.init(this.boatData.corvette, this.islandArray);
            boat.setPosition(6200, 2600);
            boat.setFXManager(this.fxManager); // so the ship can fire cannonballs!
            this.layerObjects.addChild(boat.getSprite());
            var index = this.shipArray.push(boat) - 1;
            boat.setPoolID(index);
            this.selectedBoat = boat;
            // send a message that we have a new selected boat
            var myEvent = new CustomEvent("boatSelected", {
                'detail': this.selectedBoat
            });
            window.dispatchEvent(myEvent);
            // spawn some AI boats to sail about
            this.spawnAIBoats();
            // give the isle and boats list to the fxmanager
            this.fxManager.setIslesShips(this.islandArray, this.shipArray);
            // final step in loading process.. can now call loadcallback
            this.loadCallback();
        }
    };
    theSea.prototype.reSpawnAI = function (id) {
        var boat = this.shipArray[id];
        // reinitialize the ship
        var portPt = this.getRandomPortDest();
        var edgePt = this.getRandomEdgeDest();
        if (theSea.getRandomIntInclusive(0, 1) == 1) boat.respawnAI(edgePt, portPt);else boat.respawnAI(portPt, edgePt);
        //console.log("Respawning AI#: " + id);
    };
    theSea.prototype.spawnAIBoats = function () {
        var NUMBOATS = 99;
        for (var i = 0; i < NUMBOATS; i++) {
            var boat = new ship_1.default();
            var portPt = this.getRandomPortDest();
            var edgePt = this.getRandomEdgeDest();
            if (NUMBOATS == 1) {
                var pos = new PIXI.Point(6200, 2600);
                boat.init(this.boatData.corvette, this.islandArray, true, pos, portPt);
            } else {
                if (theSea.getRandomIntInclusive(0, 1) == 1) boat.init(this.boatData.corvette, this.islandArray, true, edgePt, portPt);else boat.init(this.boatData.corvette, this.islandArray, true, portPt, edgePt);
            }
            boat.setFXManager(this.fxManager); // so the ship can fire cannonballs!
            this.layerObjects.addChild(boat.getSprite());
            var len = this.shipArray.push(boat);
            boat.setPoolID(len - 1); // set the index on the boat so it can inform the pool when it needs to respawn
        }
    };
    theSea.prototype.clearPlayerTarget = function () {
        for (var _i = 0, _a = this.shipArray; _i < _a.length; _i++) {
            var boat = _a[_i];
            boat.clearPlayerTarget();
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
    theSea.prototype.getRandomEdgeDest = function () {
        // return a point along the edge of the map
        var randx = theSea.getRandomIntInclusive(0, 8192);
        var randy = theSea.getRandomIntInclusive(0, 8192);
        if (theSea.getRandomIntInclusive(0, 1) == 1) {
            if (theSea.getRandomIntInclusive(0, 1) == 1) return new PIXI.Point(0, randy); // left edge
            else return new PIXI.Point(8192, randy); // right edge
        } else {
            if (theSea.getRandomIntInclusive(0, 1) == 1) return new PIXI.Point(randx, 0); // top edge
            else return new PIXI.Point(randx, 8192); // bottom edge
        }
    };
    theSea.prototype.getRandomPortDest = function () {
        // return a random port destination
        var desiredPort = theSea.getRandomIntInclusive(1, this.numPorts);
        var portCount = 0;
        var isle;
        //console.log("DesiredPort: " + desiredPort +  " numPorts: " + this.numPorts);
        // loop through the island array
        for (var _i = 0, _a = this.islandArray; _i < _a.length; _i++) {
            var gameObj = _a[_i];
            if (gameObj && gameObj.isPort()) {
                portCount++;
                if (portCount == desiredPort) {
                    //console.log("RandomPort Dest: " + (<Island>gameObj).getName());
                    return gameObj.getPortDest();
                }
            }
        }
    };
    theSea.getRandomIntInclusive = function (min, max) {
        // min = Math.ceil(min);
        // max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    };
    theSea.prototype.getContainer = function () {
        return this.container;
    };
    //
    // update function called per frame
    //
    theSea.prototype.update = function () {
        if (this.deltaX != 0 || this.deltaY != 0) {
            this.container.x += this.deltaX;
            this.container.y += this.deltaY;
            if (this.container.x > 0) this.container.x = 0;
            if (this.container.y > 0 + 40) this.container.y = 0 + 40; // adjust for top hud
            if (this.container.x < -(this.container.width - window.innerWidth)) this.container.x = -(this.container.width - window.innerWidth);
            if (this.container.y < -(this.container.height - window.innerHeight + 100)) this.container.y = -(this.container.height - window.innerHeight + 100);
            this.deltaX = 0;
            this.deltaY = 0; // clear the data, await next mousemove
        }
        // console.log(this.deltaX + "," + this.deltaY);
        this.updateObjectArray();
        this.fxManager.update();
        var ref;
        if (this.playerSelected) {
            ref = this.selectedBoat.getRefPtVictor();
            this.selectWidget.x = ref.x;
            this.selectWidget.y = ref.y;
        }
        if (this.boatTargeted) {
            ref = this.targetedBoat.getRefPtVictor();
            this.targetWidget.x = ref.x;
            this.targetWidget.y = ref.y;
        }
    };
    theSea.prototype.updateObjectArray = function () {
        // sort the children ascending as the renderer will render sprites in container ordrer
        this.layerObjects.children.sort(this.objSort);
        var nearPort = false;
        // loop through our object array and call each element's update function
        for (var _i = 0, _a = this.islandArray; _i < _a.length; _i++) {
            var gameObj = _a[_i];
            var boat = singleton_1.default.ship;
            gameObj.update();
            if (!nearPort) {
                if (gameObj.isPort()) {
                    var isle = gameObj;
                    // check its port ref against the player boat position
                    var boatPt = boat.getRefPtVictor();
                    var islePt = isle.getPortDestVictor(); // ref math already included here
                    // if close enough, enable the port button on the main hud
                    var dist = Math.abs(boatPt.distance(islePt));
                    if (dist < 150) {
                        nearPort = true;
                        singleton_1.default.currentPort = isle.getName();
                    }
                }
            }
        }
        if (!nearPort) singleton_1.default.currentPort = "";
        for (var _b = 0, _c = this.shipArray; _b < _c.length; _b++) {
            var gameObj = _c[_b];
            gameObj.update();
        }
        // check for collisions against the playerboat
        this.checkPlayerBoatCollision();
    };
    theSea.prototype.objSort = function (a, b) {
        var aY = a.y + a.height / 2;
        var bY = b.y + b.height / 2;
        if (aY < bY) return -1;else if (aY == bY) return 0;else if (aY > bY) return 1;else return 0;
    };
    theSea.prototype.getIslandList = function () {
        return this.islandArray;
    };
    theSea.prototype.checkPlayerBoatCollision = function () {
        // first do a simple box hit test against the player boat and all the islands
        var hit = false;
        for (var _i = 0, _a = this.islandArray; _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.getType() == gameobject_1.ObjectType.ISLAND) {
                if (theSea.boxHitTest(entry.getSprite(), this.selectedBoat.getSprite())) {
                    //console.log("boxHit!");
                    // sprites overlap, now do a PolyK hittest against all points on the boat with the islands polygonal data
                    if (this.selectedBoat.hitTestByPolygon(entry.getCartPolyData()) == true) {
                        console.log("Boat has struck - " + entry.getSprite().name);
                        this.selectedBoat.allStop();
                        this.selectedBoat.setAground(true);
                        hit = true;
                        return;
                    }
                }
            }
        }
        if (!hit) this.selectedBoat.setAground(false);
        // if theres a hit, perform the polyk hittest for each point in the boats polykdata against the island polygon
    };
    theSea.boxHitTest = function (s1, s2) {
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// EconomyItem - structure public class to store data of player items
//

Object.defineProperty(exports, "__esModule", { value: true });
var singleton_1 = __webpack_require__(1);
var EconomyItem = /** @class */function () {
    function EconomyItem(type, rarity) {
        this.maxStack = 1; // how many can stack in one unit
        this.type = type;
        if (rarity) {
            this.rarity = rarity;
        } else {
            // var rand = theSea.getRandomIntInclusive(1,100);
            // if (rand <= 85)
            //     this.rarity = 0;
            // else if (rand <= 95)
            //     this.rarity = 1;
            // else
            //     this.rarity = 2;
            this.rarity = 0; // no rarity for now
        }
        if (EconomyItem.jsonData) {
            this.size = EconomyItem.jsonData[this.type].size;
            this.value = EconomyItem.jsonData[this.type].value;
        }
    }
    EconomyItem.setEconomyData = function (jsonData) {
        this.jsonData = jsonData;
    };
    EconomyItem.prototype.getMarketPrice = function () {
        var marketPrice, value;
        // item price is in in the item data
        value = EconomyItem.jsonData[this.type].value;
        // modify this by the market rate at the current port
        var port = singleton_1.default.currentPort;
        var marketData = singleton_1.default.getPortMarketData(port);
        //console.log("econItem getMarketPrice: value: " + value + " type: " + this.type + " marketData: " + marketData);
        marketPrice = Math.floor(value + Math.ceil(value * marketData[this.type].rate / 100));
        // return the modified price
        return marketPrice;
    };
    EconomyItem.maxItems = 56; // there are 56 economy items currently
    return EconomyItem;
}();
exports.default = EconomyItem;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// popMsgBox class for brief important messages to the user
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
var popup_1 = __webpack_require__(3);
var button_1 = __webpack_require__(2);
var popMsgBox = /** @class */function (_super) {
    __extends(popMsgBox, _super);
    function popMsgBox() {
        return _super.call(this) || this;
    }
    popMsgBox.prototype.initMsg = function (character, title, body) {
        this.charNum = character;
        this.strTitle = title;
        this.strBody = body;
    };
    popMsgBox.prototype.msgInit = function () {
        // load and position our graphics
        this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("msgBoxBack.png"));
        this.addChild(this.bg);
        this.btnX = new button_1.default(PIXI.Texture.fromFrame("Btn_Ex.png"));
        this.btnX.anchor.x = this.btnX.anchor.y = 0.5;
        this.btnX.x = 374;
        this.btnX.y = 133;
        this.btnX.width = 30;
        this.btnX.height = 28; // slightly smaller btnX
        this.addChild(this.btnX);
        this.btnX.on('click', this.btnXClick);
    };
    popMsgBox.prototype.init = function () {
        // do not call the super init, instead do our own init
        this.msgInit();
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 18,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: 239
        });
        this.body = new PIXI.Text(this.strBody, styleb);
        this.body.x = 147;
        this.body.y = 43;
        this.addChild(this.body);
        this.title = new PIXI.Text(this.strTitle, style);
        this.title.x = this.body.x + this.body.width / 2 - this.title.width / 2;
        this.title.y = 11;
        this.addChild(this.title);
        // now add the infoGraphic
        this.infoGraphic = new PIXI.Container();
        // switch on character
        var strChar = "charPirateFemale.png";
        if (this.charNum == 3) strChar = "Prize Agent 300x450.png";
        this.character = new PIXI.Sprite(PIXI.Texture.fromFrame(strChar));
        this.charMask = new PIXI.Sprite(PIXI.Texture.fromFrame("mask2.png"));
        this.infoGraphic.addChild(this.character);
        this.infoGraphic.addChild(this.charMask);
        this.character.x = this.charMask.width / 2 - this.character.width / 2; // center under mask
        if (this.charNum == 0) this.character.y = -20;else {
            this.character.x += 10;
            this.character.y = -20;
        }
        this.infoGraphic.x = 14;
        this.infoGraphic.y = 28;
        this.addChild(this.infoGraphic);
        this.infoGraphic.mask = this.charMask; // set the mask
    };
    return popMsgBox;
}(popup_1.default);
exports.default = popMsgBox;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// EconomyIcon class to override Sprite and provide visuals for the economic icons in the game
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
var Victor = __webpack_require__(5);
var theSea_1 = __webpack_require__(6);
var compassrose_1 = __webpack_require__(11);
var economyitem_1 = __webpack_require__(7);
var filters = __webpack_require__(12);
var EcoType;
(function (EcoType) {
    EcoType[EcoType["ANCHOR"] = 0] = "ANCHOR";
    EcoType[EcoType["ANIMALHIDES"] = 1] = "ANIMALHIDES";
    EcoType[EcoType["BARREL"] = 2] = "BARREL";
})(EcoType = exports.EcoType || (exports.EcoType = {}));
var EconomyIcon = /** @class */function (_super) {
    __extends(EconomyIcon, _super);
    function EconomyIcon(type, id, barreled, rarity) {
        if (barreled === void 0) {
            barreled = false;
        }
        var _this = _super.call(this) || this;
        _this.type = 0;
        _this.barreled = false;
        _this.glowing = false;
        _this.bezierDone = function () {
            // when bezier done, bob in the water til clicked
            //console.log("bezierDone!");
            // now animate y up and down yoyo style
            TweenMax.to(_this, 1.25, { y: _this.y + 30,
                yoyo: true,
                repeat: -1,
                ease: Linear.easeInOut });
            // and the rotate 
            TweenMax.to(_this, 1.5, { rotation: 0.523599,
                yoyo: true,
                repeat: -1,
                ease: Linear.easeInOut });
            _this.interactive = true;
            _this.on("click", _this.clickHandler);
        };
        _this.clickHandler = function () {
            // send a note to the hud to collect us
            var myEvent = new CustomEvent("floatingIconClick", {
                'detail': _this.id
            });
            window.dispatchEvent(myEvent);
        };
        _this.lootDone = function () {
            TweenMax.killTweensOf(_this);
            _this.interactive = false;
            // send a note to the hud to collect us
            var myEvent = new CustomEvent("lootDone", {
                'detail': _this.id
            });
            window.dispatchEvent(myEvent);
        };
        // create a sprite with the indicated type
        _this.type = type;
        //this.texture = PIXI.Texture.fromFrame(EconomyIcon.jsonData[this.type].fileName);
        _this.icon = new PIXI.Sprite(PIXI.Texture.fromFrame("icon_Barrel.png"));
        _this.addChild(_this.icon);
        _this.pivot.x = 21;
        _this.pivot.y = 21;
        _this.id = id;
        _this.rarity = 0; //rarity; // no rarity for now
        if (!barreled) _this.loadImageByID(); // load a background and icon else will default to a barrel with no background
        else _this.barreled = true;
        _this.glow = new filters.GlowFilter(10, 1, 1, 0x00FF00);
        return _this;
    }
    EconomyIcon.prototype.getType = function () {
        return this.type;
    };
    EconomyIcon.prototype.unBarrel = function () {
        if (this.barreled) {
            this.loadImageByID(); // create the proper icon and background
            this.barreled = false;
        }
    };
    EconomyIcon.prototype.loadImageByID = function () {
        // our type is the index into the json data
        if (economyitem_1.default.jsonData) {
            var s = economyitem_1.default.jsonData[this.type].fileName;
            this.icon.texture = PIXI.Texture.fromFrame(s);
            if (this.rarity == 0) this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("iconBGgrey.png"));else if (this.rarity == 1) this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("iconBGgreen.png"));else this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("iconBGblue.png"));
            this.addChildAt(this.bg, 0);
        }
    };
    EconomyIcon.prototype.getName = function () {
        return economyitem_1.default.jsonData[this.type].displayName;
    };
    EconomyIcon.prototype.getPrice = function () {
        return economyitem_1.default.jsonData[this.type].value;
    };
    EconomyIcon.prototype.throwOutAndBob = function () {
        // effect to throw the item out a bit on a curved path, random angle
        // upon reaching destination it will bob (up and down) and rotate slightly back and forth
        // simulating bobbing in water
        var dir = new Victor(1, 0); // straight right
        var rand = theSea_1.default.getRandomIntInclusive(0, 1);
        var randDir;
        var dirRads;
        var x, y, midX, midY;
        if (rand == 1) {
            dir.x = 1;
            dir.y = -0.5; // down and right, then rottate ccw by rand point
        } else {
            dir.x = -1;
            dir.y = 0.5; // up and left
        }
        randDir = theSea_1.default.getRandomIntInclusive(0, 4) * 11.25; // random compass point
        dirRads = compassrose_1.default.getRads(randDir);
        dir.rotate(dirRads);
        x = this.x + dir.x * 115;
        y = this.y + -dir.y * 115;
        if (rand == 1) midX = this.x + 57;else midX = this.x - 57;
        midY = this.y - 115;
        // move our position to this new x,y in an curve
        TweenMax.to(this, 1, { bezier: { type: "thru", curviness: 1.5, values: [{ x: this.x, y: this.y }, { x: midX, y: midY }, { x: x, y: y }] },
            ease: Linear.easeOut,
            onComplete: this.bezierDone });
    };
    EconomyIcon.prototype.lootIcon = function (xp, yp) {
        //console.log("lootIcon to: " + xp + "," + yp);
        TweenMax.killTweensOf(this);
        TweenMax.to(this, 1, { x: xp, y: yp, onComplete: this.lootDone });
        TweenMax.to(this.scale, 1, { x: 0, y: 0 });
    };
    EconomyIcon.prototype.glowToggle = function () {
        if (!this.glowing) {
            this.filters = [this.glow];
            this.glowing = true;
        } else {
            this.filters = [];
            this.glowing = false;
        }
    };
    EconomyIcon.prototype.isGlowing = function () {
        return this.glowing;
    };
    return EconomyIcon;
}(PIXI.Container);
exports.default = EconomyIcon;

/***/ }),
/* 10 */
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
var gameobject_1 = __webpack_require__(4);
var gameobject_2 = __webpack_require__(4);
var Victor = __webpack_require__(5);
var compassrose_1 = __webpack_require__(11);
var theSea_1 = __webpack_require__(6);
var cannonball_1 = __webpack_require__(14);
var economyitem_1 = __webpack_require__(7);
var popmsgbox_1 = __webpack_require__(8);
var singleton_1 = __webpack_require__(1);
var shipwidget_1 = __webpack_require__(15);
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
        _this.toLarboard = false; // which direction to turn to targetHeading
        _this.headingTicks = 0;
        _this.polyNum = 0; // current heading corresponds to which index in the polyData array?
        _this.cartPolyData8 = []; // an array of 8 arrays converted to cartesian
        _this.cartKeelData = [];
        // boat handling characteristics
        _this.angularSpeed = 30; // turn rate in degrees/second
        _this.angleToWind = 60; // closest angle to the wind this ship can sail upon
        _this.aGround = false; // are we aground? set by theSea main loop
        _this.inIrons = false; // are we inIrons? set by compassRose
        _this.errorDisplayed = false; // is achtung up?
        _this.aiObstacleThreats = [];
        _this.isAI = false; // is this boat running AI?
        _this.aiArrived = false; // flag used to determine if ai has arrived at its target destination
        _this.aiStarted = false; // flag for first time update
        _this.showTarget = false;
        _this.aiLastHeading = 0; // time of last call to aiSetHeading
        _this.aiRayCastArray = []; // 32 dots to display potentially 32 ray casts during aiSetHeading
        _this.aiNextPlot = -1; // init to -1 to signal initialization on first call
        _this.aiShipTarget = null; // the ship we are targetting to fire at
        // ship stats
        _this.statHull = 48;
        _this.statHullMax = 48;
        _this.statSails = 0;
        _this.statSailsMax = 0;
        _this.statCrew = 0; // feature idea, assign bits to crew to index into name index... crew can have name and exp/level waster/able/midshipman etc
        _this.statCrewMax = 0;
        _this.wrecked = false;
        _this.deSpawned = false; // a ship whos made it to port, or screen edge
        _this.smokeID = 0;
        _this.shipsHold = []; // just an array of item ids EconomyIcon carries the data
        _this.shipsHoldCapacity = 40; // in "squares" ex Corvette is 10x4 hold so 40 icons
        _this.magBallMax = 15; // maximum number of ball shot ship can carry
        _this.portCannonLastFired = 0; // time stamp of last port cannon click
        _this.starCannonLastFired = 0; // time stamp of last starboard cannon click
        _this.natFlag = shipwidget_1.NatFlag.ENGLISH; // english by default
        _this.debug = false;
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
        _this.fireDelay = function (x, y, v) {
            var ball = _this.fxManager.getCannonBall();
            ball.fire(x, y, v, 4, cannonball_1.BallType.BALL, _this);
            _this.fxManager.placeMuzzlePlume(x, y, v);
        };
        _this.sunk = function () {
            var s = _this.getSprite();
            // take care of the achtung symbol too
            _this.hideAchtung();
            // send an event to the sea to respawn us
            var myEvent = new CustomEvent("aiReSpawn", {
                'detail': _this.poolID
            });
            window.dispatchEvent(myEvent);
        };
        _this.reSpawn = function () {
            // take care of the achtung symbol too
            _this.hideAchtung();
            _this.aiStarted = false;
            _this.aiShipTarget = null; //clear our target if any
            _this.debug = false;
            _this.hideAITarget();
            //console.log("Dispatching aiRespawn event");
            // inform theSea to respawn us
            // send an event to the sea to respawn us
            var myEvent = new CustomEvent("aiReSpawn", {
                'detail': _this.poolID
            });
            window.dispatchEvent(myEvent);
        };
        // mouse handlers, just send a message for the hud to handle the loot mechanic
        _this.shipMouseDown = function (e) {
            var myEvent;
            if (_this.wrecked) {
                myEvent = new CustomEvent("wreckMouseDown", {
                    'detail': { "boat": _this, "holdLength": _this.shipsHold.length }
                });
                window.dispatchEvent(myEvent);
            } else {
                myEvent = new CustomEvent("aiShipMouseDown", {
                    'detail': _this
                });
                window.dispatchEvent(myEvent);
            }
        };
        _this.wreckMouseUp = function (e) {
            var myEvent = new CustomEvent("wreckMouseUp", {
                'detail': { "boat": _this, "holdLength": _this.shipsHold.length }
            });
            window.dispatchEvent(myEvent);
        };
        _this.objType = gameobject_2.ObjectType.SHIP;
        _this.shipType = ShipType.CORVETTE;
        _this.sailState = 0; // down
        _this.speed = 0;
        _this.targetSpeed = 0;
        _this.heading = new Victor(1, 0); // east
        _this.degreeHeading = _this.heading.angleDeg();
        _this.targetHeading = _this.degreeHeading;
        _this.lastTime = 0;
        _this.refPt = new PIXI.Point();
        _this.tweenVars = { speed: 0 };
        _this.aiDirectObstacles = []; // empty array
        for (var i = 0; i < 8; i++) {
            _this.cartPolyData8.push(new Array());
        }
        _this.magBall = _this.magBallMax;
        return _this;
    }
    Ship.prototype.setFXManager = function (fxman) {
        this.fxManager = fxman;
    };
    Ship.prototype.setName = function (newName) {
        this.shipName = newName;
    };
    Ship.prototype.getName = function () {
        return this.shipName;
    };
    Ship.prototype.setNatFlag = function (newFlag) {
        this.natFlag = newFlag;
    };
    Ship.prototype.getNatFlag = function () {
        return this.natFlag;
    };
    Ship.prototype.randomFlag = function (noPirate) {
        if (noPirate === void 0) {
            noPirate = true;
        }
        var rFlag;
        if (noPirate) rFlag = theSea_1.default.getRandomIntInclusive(0, 3);else rFlag = theSea_1.default.getRandomIntInclusive(0, 4);
        this.natFlag = rFlag;
    };
    Ship.prototype.setPoolID = function (id) {
        this.poolID = id;
    };
    Ship.prototype.getPoolID = function () {
        return this.poolID;
    };
    Ship.prototype.respawnAI = function (pos, aiTarget) {
        this.deSpawned = false;
        this.wrecked = false;
        this.aiArrived = false;
        // set position if given
        if (pos) {
            this.sprite.x = pos.x - this.refPt.x;
            this.sprite.y = pos.y - this.refPt.y;
        }
        if (aiTarget) {
            this.aiTarget.x = aiTarget.x;
            this.aiTarget.y = aiTarget.y;
        }
        this.sprite.interactive = true;
        this.statHull = this.statHullMax;
        this.sprite.alpha = 1;
        this.aiShipTarget = null;
        this.aiStarted = false;
        this.randomFlag(false);
    };
    // args:
    // p - polygonal data of type any for collisions with PolyK library
    // ai - flag if this boat is ai
    Ship.prototype.init = function (p, isles, isAI, pos, aiTarget) {
        if (isAI === void 0) {
            isAI = false;
        }
        this.sprite = new PIXI.Sprite(); // an empty sprite
        this.setPolyData(p);
        this.matchHeadingToSprite(); // initialize the texture its using
        this.shipName = "Nutmeg of Consolation";
        this.achtung = new PIXI.Sprite(PIXI.Texture.fromFrame("achtung.png"));
        // do not add achtung until needed
        this.aiTargetSprite = new PIXI.Sprite(PIXI.Texture.fromFrame("PointRed.png"));
        this.aiTargetSprite.anchor.x = this.aiTargetSprite.anchor.y = 0.5;
        // create AI ray cast visuals
        for (var i = 0; i < 32; i++) this.aiRayCastArray.push(new PIXI.Sprite(PIXI.Texture.fromFrame("PointRed.png")));
        this.aiBoatPos = new PIXI.Sprite(PIXI.Texture.fromFrame("PointRed.png"));
        this.aiBoatPos.anchor.x = this.aiBoatPos.anchor.y = 0.5;
        // set position if given
        if (pos) {
            this.sprite.x = pos.x - this.refPt.x;
            this.sprite.y = pos.y - this.refPt.y;
        }
        this.isles = isles; // set the island array for AI use
        this.isAI = isAI;
        if (isAI) {
            if (aiTarget) this.aiTarget = new PIXI.Point(aiTarget.x, aiTarget.y);else this.aiTarget = new PIXI.Point(6200, 2600); // water north of guadalupe
            this.sprite.interactive = true;
            this.sprite.on("mousedown", this.shipMouseDown);
        } else {
            // player boat gets more health
            this.statHull = 100;
            this.statHullMax = 100;
        }
        this.randomFlag(false);
    };
    Ship.prototype.plotPoint = function (x, y) {
        if (!this.debug) return; // only display points if in debug mode
        if (this.aiNextPlot >= 32) {
            console.log("out of Plot Points!");
            return;
        }
        this.aiRayCastArray[this.aiNextPlot].x = x;
        this.aiRayCastArray[this.aiNextPlot].y = y;
        this.aiRayCastArray[this.aiNextPlot].visible = true;
        this.aiNextPlot++;
        //console.log("plotPont: " + x.toFixed(0) + "," + y.toFixed(0));
    };
    Ship.prototype.resetPlots = function () {
        if (this.aiNextPlot = -1) {
            for (var k = 0; k < 32; k++) {
                this.sprite.parent.addChild(this.aiRayCastArray[k]);
                this.aiRayCastArray[k].anchor.x = this.aiRayCastArray[k].anchor.y = 0.5;
            }
        }
        this.aiNextPlot = 0;
        for (var i = 0; i < 32; i++) this.aiRayCastArray[i].visible = false;
    };
    Ship.prototype.calcNewHeading = function (original, offset) {
        var newVic = original.clone();
        newVic.rotate(compassrose_1.default.getRads(offset));
        newVic.normalize();
        return newVic;
    };
    Ship.prototype.getVectorAngleDegs = function (p1, p2) {
        // angle in degrees
        var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        return angleDeg;
    };
    Ship.prototype.getVectorAngle = function (p1, p2) {
        var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return angleRadians;
    };
    Ship.prototype.getSignedAngle = function (source, compare) {
        var a2 = Math.atan2(source.y, source.x);
        var a1 = Math.atan2(compare.y, compare.x);
        var sign = a1 > a2 ? 1 : -1;
        var angle = a1 - a2;
        var K = -sign * Math.PI * 2; // adjusts for crossing the 2PI threashold
        var angle = Math.abs(K + angle) < Math.abs(angle) ? K + angle : angle;
        // still in radians at this point
        return angle;
    };
    // get new heading around passed in heading that avoids our current obstacle by minAngle degrees at minimum
    Ship.prototype.aiGetHeadingAroundThreat = function (heading, minAngle) {
        var newHeading = new Victor(0, 0);
        var goodHeadings = [];
        var angleToTarget = [];
        var dropPt = false;
        var angle2target;
        // cast rays from heading in chosen direction in one degree increments 
        // save all successfull rays into an array
        // use the minAngle-th ray as our heading 
        for (var i = 0; i < 180; i++) {
            newHeading = this.calcNewHeading(heading, i * 2);
            if (i % 6 == 0) dropPt = true;else dropPt = false;
            if (this.checkHeadingVSObstacle(newHeading, dropPt, false) && compassrose_1.default.isValidHeading(this.angleToWind, newHeading.angleDeg())) {
                goodHeadings.push(newHeading);
                heading.norm();
                newHeading.norm();
                angle2target = compassrose_1.default.getDegs(Math.acos(heading.dot(newHeading)));
                angleToTarget.push(angle2target);
            }
        }
        if (goodHeadings.length == 0) {
            return null;
        } else {
            // return the minAngle-th element
            // run through array and find minimum 
            var minA = angleToTarget[0];
            var min = 0;
            var k;
            for (k = 0; k < angleToTarget.length; k++) {
                if (angleToTarget[k] < minA && angleToTarget[k] >= minAngle) {
                    min = k;
                    minA = angleToTarget[k];
                }
            }
            return goodHeadings[min];
            // if (minAngle > goodHeadings.length)
            //     return goodHeadings[goodHeadings.length-1]; // the last element is the best we can do
            // else
            //     return goodHeadings[minAngle];
        }
    };
    Ship.prototype.checkHeadingVSObstacle = function (heading, dropPoint, useMinDist) {
        if (dropPoint === void 0) {
            dropPoint = false;
        }
        if (useMinDist === void 0) {
            useMinDist = true;
        }
        var x, y, px, py;
        var iscc = { dist: 0, edge: 0, norm: { x: 0, y: 0 }, refl: { x: 0, y: 0 } };
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;
        var DIST = 300;
        var retObj = PolyK.Raycast(this.aiCurrentObstacle.getCartPolyData(), x, y, heading.x, heading.y, iscc);
        if (!retObj) iscc.dist = 10000;
        if (useMinDist == true && iscc.dist < DIST) {
            if (dropPoint == true) {
                px += heading.x * iscc.dist;
                py += -heading.y * iscc.dist;
                this.plotPoint(px, py);
            }
            return false;
        }
        if (useMinDist == false) {
            if (iscc.dist < 10000) {
                if (dropPoint == true) {
                    px += heading.x * iscc.dist;
                    py += -heading.y * iscc.dist;
                    this.plotPoint(px, py);
                }
                return false;
            }
        }
        // no hit
        if (dropPoint == true) {
            this.plotPoint(px, py);
            px += this.heading.x * DIST;
            py += -this.heading.y * DIST;
        }
        return true;
    };
    Ship.prototype.checkCurrentHeading = function (directDist, dropPoint) {
        if (dropPoint === void 0) {
            dropPoint = false;
        }
        var x, y, px, py;
        var iscc = { dist: 0, edge: 0, norm: { x: 0, y: 0 }, refl: { x: 0, y: 0 } };
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;
        var DIST = 300;
        // loop thru the isles... see if we hit
        for (var _i = 0, _a = this.isles; _i < _a.length; _i++) {
            var isle = _a[_i];
            //console.log("isle data contains: " + isle.getCartPolyData().length + " entries" ); 
            var retObj = PolyK.Raycast(isle.getCartPolyData(), x, y, this.heading.x, this.heading.y, iscc);
            if (!retObj) iscc.dist = 10000;
            if (iscc.dist < DIST && iscc.dist < directDist) {
                // set this isle as our current threat
                this.aiCurrentObstacle = isle;
                if (dropPoint == true) {
                    px += this.heading.x * iscc.dist;
                    py += -this.heading.y * iscc.dist;
                    this.plotPoint(px, py);
                }
                this.getAllThreats(); // find all possible islands within the threat range
                return false;
            }
        }
        // no hit
        if (dropPoint == true) {
            this.plotPoint(px, py);
            px += this.heading.x * DIST;
            py += -this.heading.y * DIST;
        }
        return true;
    };
    Ship.prototype.getAllThreats = function () {
        // direct heading has struck an isle, populate threat list of any isles within DISt of us
        var x, y, px, py;
        var iscc = { dist: 0, edge: 0, norm: { x: 0, y: 0 }, point: { x: 0, y: 0 } };
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;
        var DIST = 300;
        // clear threat array
        this.aiObstacleThreats = [];
        for (var _i = 0, _a = this.isles; _i < _a.length; _i++) {
            var isle = _a[_i];
            //console.log("isle data contains: " + isle.getCartPolyData().length + " entries" ); 
            var retObj = PolyK.ClosestEdge(isle.getCartPolyData(), x, y, iscc);
            if (!retObj) iscc.dist = 10000;
            if (iscc.dist < DIST) {
                this.aiObstacleThreats.push(isle);
            }
        }
        if (this.debug) console.log("getallThreats: found " + this.aiObstacleThreats.length + " threats within DIST of ship.");
    };
    // populate list of isles that intersect our direct heading
    Ship.prototype.checkDirectHeading = function (dropPoint) {
        if (dropPoint === void 0) {
            dropPoint = false;
        }
        // step 0 - calculate our direct heading to aiTarget
        var diffX = this.aiTarget.x - (this.sprite.x + this.refPt.x);
        var diffY = 8192 - this.aiTarget.y - (8192 - (this.sprite.y + this.refPt.y)); // y is flipped in cartesian
        var directHeading = new Victor(diffX, diffY);
        var directDist = directHeading.magnitude();
        directHeading.normalize();
        var x, y, px, py;
        var iscc = { dist: 0, edge: 0, norm: { x: 0, y: 0 }, refl: { x: 0, y: 0 } };
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;
        // if direct heading into wind, abort
        if (!compassrose_1.default.isValidHeading(this.angleToWind, directHeading.angleDeg())) return false;
        // clear our stored array
        delete this.aiDirectObstacles;
        this.aiDirectObstacles = [];
        // loop thru the isles... see if we hit
        for (var _i = 0, _a = this.isles; _i < _a.length; _i++) {
            var isle = _a[_i];
            //console.log("isle data contains: " + isle.getCartPolyData().length + " entries" ); 
            var retObj = PolyK.Raycast(isle.getCartPolyData(), x, y, directHeading.x, directHeading.y, iscc);
            if (!retObj) iscc.dist = 10000;
            if (iscc.dist < 10000) {
                // set this isle as our current threat
                // if distance to our target is less than distance to obstruction, then we have hit an island behind our targt, dont add
                if (iscc.dist < directDist) this.aiDirectObstacles.push(isle);
                if (dropPoint == true) {
                    px += this.heading.x * iscc.dist;
                    py += -this.heading.y * iscc.dist;
                    this.plotPoint(px, py);
                }
            }
        }
        return true; // not into wind, may or may not have hit obstacles
    };
    Ship.prototype.aiSetInitialHeading = function () {
        // set the initial heading as the direct heading unless into wind, then lay off the wind
        // step 0 - calculate our direct heading to aiTarget
        var diffX = this.aiTarget.x - (this.sprite.x + this.refPt.x);
        var diffY = 8192 - this.aiTarget.y - (8192 - (this.sprite.y + this.refPt.y)); // y is flipped in cartesian
        var directHeading = new Victor(diffX, diffY);
        directHeading.normalize();
        // if direct heading into wind, abort
        if (!compassrose_1.default.isValidHeading(this.angleToWind, directHeading.angleDeg())) this.heading = compassrose_1.default.getSmallestHeadingOffwind(this.angleToWind, this.heading);
        this.matchHeadingToSprite();
    };
    Ship.prototype.aiNoObstacleThreats = function () {
        // return true if no isles within DIST
        this.getAllThreats();
        if (this.aiObstacleThreats.length == 0) return true;else return false;
    };
    Ship.prototype.aiSetHeading = function () {
        // step 0 - calculate our direct heading to aiTarget
        var diffX = this.aiTarget.x - (this.sprite.x + this.refPt.x);
        var diffY = 8192 - this.aiTarget.y - (8192 - (this.sprite.y + this.refPt.y)); // y is flipped in cartesian
        var directHeading = new Victor(diffX, diffY);
        var directDist = directHeading.magnitude();
        directHeading.normalize();
        var newHeading = null;
        var newHeadingAng;
        var up = new Victor(0, 1);
        var angleOffDirect = this.getSignedAngle(up, directHeading);
        //console.log("Begin aiSetHeading");
        if (angleOffDirect >= 0) this.aiAvoidToLarboard = true;else this.aiAvoidToLarboard = false;
        this.resetPlots();
        // step 1
        // raycast our current heading
        // if obstacle within minDistance, make this obstacle our current threat
        if (this.checkCurrentHeading(directDist) == false) {
            // our direct heading has struck an island, aiCurrentObstacle has been set
            if (this.debug) console.log("Current heading hit obstacle, avoiding!");
            // find heading around this obstacle in given direction around our current heading
            // with a minimum of 10 degrees of clearance
            newHeading = this.aiGetHeadingAroundThreat(directHeading, 10);
        } else {
            //console.log("Current heading fine, trying direct heading...");
            // step 2
            // raycast our direct heading and determine if anything blocks our direct heading
            if (this.checkDirectHeading()) {
                if (this.aiDirectObstacles.length == 0) {
                    // set directHeading
                    newHeading = directHeading;
                    //console.log("direct heading clear, setting directHeading");
                } else {
                    // if yes, see if our aiObstacle is in the list
                    var islefound = false;
                    for (var i = 0; i < this.aiDirectObstacles.length; i++) if (this.aiDirectObstacles[i] == this.aiCurrentObstacle) {
                        islefound = true;
                        break;
                    }
                    // if no, set directHeading
                    if (islefound) {
                        //console.log("aiObstacle still between us and target, continue to avoid");
                        // our aiobstacle is still between us and our target, continue to avoid it
                        newHeading = this.aiGetHeadingAroundThreat(directHeading, 10);
                    } else {
                        //console.log("aiObstacle cleared, setting directHeading");
                        newHeading = directHeading;
                        this.aiCurrentObstacle = null;
                    }
                }
            } else {
                newHeading = this.heading;
                // if no threats, lay off the wind
                if (this.aiNoObstacleThreats()) {
                    var oppositeTack = false;
                    // // if off the map, tack off the wind (likely taking a long windward run)
                    // if (this.sprite.x > 8192+this.sprite.width || this.sprite.x < -this.sprite.width)
                    // {
                    //     oppositeTack = true;
                    // }
                    newHeading = compassrose_1.default.getSmallestHeadingOffwind(this.angleToWind, newHeading, oppositeTack);
                }
            }
        }
        if (newHeading == null) {
            // couldnt find heading.. put up achtung
            //console.log("Could not find good heading, stopping!");
            this.showAchtung();
            this.allStop();
            this.aiArrived = true;
            this.deSpawn();
        } else {
            if (newHeading != this.heading) {
                newHeadingAng = newHeading.angleDeg();
                if (!compassrose_1.default.isValidHeading(this.angleToWind, newHeadingAng)) {
                    if (this.debug) console.log("newHeading into Wind! Laying to off wind angle!");
                    newHeading = compassrose_1.default.getSmallestHeadingOffwind(this.angleToWind, newHeading);
                    newHeadingAng = newHeading.angleDeg();
                    this.changeHeading(newHeadingAng);
                } else {
                    this.changeHeading(newHeadingAng); // changes targetHeading inside function
                }
                if (this.debug) console.log("aiSetHeading to: " + compassrose_1.default.convertCartToCompass(this.targetHeading).toFixed(2));
                this.matchHeadingToSprite();
            }
        }
    };
    Ship.prototype.getSmallestHeadingOffwind = function (heading) {
        //
        // heading is into the wind, return the smallest vector laying off the wind
        var rVector = new Victor(0, 0);
        var lVector = new Victor(0, 0);
        var angle = 90; // ask compass rose for a cartesian wind angle
        var rAngle, lAngle, hAngle;
        // get angle of wind to starboard
        angle = 90 - this.angleToWind - 1;
        rVector.x = Math.cos(compassrose_1.default.getRads(angle));
        rVector.y = Math.sin(compassrose_1.default.getRads(angle));
        rAngle = Math.acos(heading.dot(rVector));
        // get angle of wind to larboard
        angle = 90 + this.angleToWind + 1;
        lVector.x = Math.cos(compassrose_1.default.getRads(angle));
        lVector.y = Math.sin(compassrose_1.default.getRads(angle));
        lAngle = Math.acos(heading.dot(lVector));
        // hAngle = CompassRose.convertCartToCompass(heading.angleDeg());
        // var rA, lA;
        // rA = CompassRose.convertCartToCompass(rVector.angleDeg());
        // lA = CompassRose.convertCartToCompass(lVector.angleDeg());
        //console.log("smallestAngOffWind: heading: " + hAngle.toFixed(2) + " rAngle: " + rVector.angleDeg().toFixed(2) + " lAngle: " + lA.toFixed(2) + "rDiff: " + rAngle.toFixed(2) + " lDiff: " + lAngle.toFixed(2));
        if (Math.abs(rAngle) < Math.abs(lAngle)) return rVector;else return lVector;
    };
    Ship.prototype.setPolyData = function (p) {
        // p is the ship record from shipdata.json
        this.jsonData = p;
        this.sprite.name = this.jsonData["fileName"];
        this.maxSpeed = this.jsonData["maxHullSpeed"];
    };
    Ship.prototype.setIslandArray = function (islands) {
        this.isles = islands;
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
    // return true if passed point is contained in our polygon
    Ship.prototype.hitTestByPoint = function (x, y) {
        //console.log("ship.hitTestByPoint");
        // convert our polygonal data relative to our position
        this.convertPolyDataToCartesian();
        if (PolyK.ContainsPoint(this.cartPolyData8[this.polyNum], x, y)) {
            //console.log("ship HIT by point!");
            return true;
        }
        return false;
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
        this.targetSpeed = 0;
        this.tweenVars.speed = 0;
        this.setSailTrim(0);
        //TweenLite.killTweensOf(this.tweenVars);
    };
    Ship.prototype.isAground = function () {
        return this.aGround;
    };
    Ship.prototype.setAground = function (aground) {
        this.aGround = aground;
    };
    Ship.prototype.setInIrons = function (inIrons) {
        this.inIrons = inIrons;
    };
    Ship.prototype.setPosition = function (x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    };
    Ship.prototype.matchHeadingToSprite = function () {
        // pick the sprite that is closest to ships heading... 
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
            //console.log("heading:" + a.toFixed(0) + " frameDirection: " + frameNum)
            this.usingFrame = frameNum + modFrame;
            // set pivot point from data
            if (this.jsonData) {
                var frameStr = frameName + this.getFrameString(frameNum, 0) + ".png";
                // this.sprite.pivot.x = this.jsonData[frameStr].refPt[0];
                // this.sprite.pivot.y = this.jsonData[frameStr].refPt[1];
                // this.sprite.anchor.x = this.jsonData[frameStr].refPt[0] / this.sprite.width;
                // this.sprite.anchor.y = this.jsonData[frameStr].refPt[1] / this.sprite.height;
                this.refPt.x = this.jsonData[frameStr].refPt[0];
                this.refPt.y = this.jsonData[frameStr].refPt[1];
                s.hitArea = new PIXI.Polygon(this.jsonData[frameStr].hitArea);
            }
        }
    };
    Ship.prototype.getRefPt = function () {
        var p = new Victor(this.refPt.x, this.refPt.y);
        return p;
    };
    Ship.prototype.getRefPtVictor = function () {
        var p = new Victor(this.sprite.x + this.refPt.x, this.sprite.y + this.refPt.y);
        return p;
    };
    Ship.prototype.getFrameString = function (frameNum, mod) {
        var n = frameNum;
        if (mod != 0) n += mod;
        return Ship.zeroPad(n, 4);
    };
    Ship.zeroPad = function (num, numZeros) {
        if (num == 0) {
            var retStr = "";
            for (var i = 0; i < numZeros; i++) retStr = retStr + "0";
            return retStr;
        }
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
        this.targetSpeed = newTrim * this.maxSpeed; // data driven per boat type
        if (this.targetSpeed <= 0) {
            this.targetSpeed = 0;
            this.sailState = 0;
        } else {
            this.sailState = 2; // sails up
        }
        //console.log("setting Sail Trim: " + newTrim.toFixed(2) + " TargetSpeed: " + this.targetSpeed.toFixed(2));
        // if (!this.aGround && !this.inIrons)
        //     TweenLite.to(this.tweenVars, 2.5, { speed:this.targetSpeed, ease: Power2.easeInOut });
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
        this.sprite.x += this.speed * this.heading.x;
        this.sprite.y += this.speed * -this.heading.y; // y is inverted... heading in cartesean, but our position coords origin is top,left
    };
    Ship.prototype.update = function () {
        // update the sprite position by the speed + heading
        var deltaTime = 0;
        var now = Date.now();
        var acc = this.maxSpeed / 2.5; // takes 2.5 seconds to accelerate to max speed
        var accMS = acc / 1000;
        var dampMS = accMS / 4; // dampening force is half of acceleration force
        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
            if (deltaTime > 1000) {
                this.lastTime = now;
                return; // skip abnormally large deltas, likely from returning from a paused VM
            }
        }
        if (this.wrecked || this.deSpawned) {
            // do decay timer perhaps here? cant stay wrecked forever
            // waiting for player to loot, will fade after x minutes
            // no speed, ai or other adjustments needed.. return
            return;
        }
        if (!compassrose_1.default.isValidHeading(this.angleToWind, this.degreeHeading)) {
            var deltaDamp = dampMS * deltaTime;
            this.speed -= deltaDamp; // 0.1;
            if (this.speed < 0) this.speed = 0;
            if (this.debug) console.log("Dampening Speed, heading into wind");
            // if (this.targetHeading != this.degreeHeading)
            // console.log("Heading: " + CompassRose.convertCartToCompass(this.degreeHeading).toFixed(2) + " Speed: " + this.speed.toFixed(2) + " TargetSpeed: " + this.targetSpeed.toFixed(2) + " DeltaDamp: " + deltaDamp.toFixed(2));
        } else if (this.speed != this.targetSpeed) {
            var deltaAcc = accMS * deltaTime;
            if (this.speed < this.targetSpeed) {
                this.speed += deltaAcc; //0.1;
                if (this.speed >= this.targetSpeed) this.speed = this.targetSpeed;
                if (this.debug) console.log("Increasing speed");
            } else {
                this.speed -= deltaAcc; //0.1;
                if (this.speed < 0) this.speed = 0;
                if (this.debug) console.log("Decreasing Speed");
            }
            //console.log("Speed: " + this.speed.toFixed(2) + " TargetSpeed: " + this.targetSpeed.toFixed(2));
        }
        var speedMS = this.speed / 1000;
        var speedDelta = speedMS * deltaTime;
        this.sprite.x += speedDelta * this.heading.x;
        this.sprite.y += speedDelta * -this.heading.y;
        var turning = false;
        // are we in process of changing heading?
        if (this.targetHeading != this.degreeHeading) {
            turning = true;
            var deltaAngle = deltaTime * (this.angularSpeed / 1000);
            this.headingTicks++;
            var sameSign = true;
            if (this.degreeHeading < 0 && this.targetHeading > 0 || this.degreeHeading > 0 && this.targetHeading < 0) {
                sameSign = false;
            }
            // move to the target in the direction indicated by toLarboard
            if (this.toLarboard) {
                this.degreeHeading += deltaAngle;
                if (this.degreeHeading > 180) this.degreeHeading -= 360;
                if (sameSign && this.degreeHeading > this.targetHeading) {
                    this.degreeHeading = this.targetHeading; // we are done
                }
            } else {
                this.degreeHeading -= deltaAngle;
                if (this.degreeHeading < -180) this.degreeHeading += 360;
                if (sameSign && this.degreeHeading < this.targetHeading) {
                    this.degreeHeading = this.targetHeading; // we are done
                }
            }
            var xpart = Math.cos(compassrose_1.default.getRads(this.degreeHeading));
            var ypart = Math.sin(compassrose_1.default.getRads(this.degreeHeading));
            this.heading.x = xpart;
            this.heading.y = ypart; // y is flipped when applying to sprite in setposition
            this.heading.normalize(); // make sure its normalized
            // console.log("target: " + CompassRose.convertCartToCompass(this.targetHeading).toFixed(0) + " heading: " + CompassRose.convertCartToCompass(this.degreeHeading).toFixed(4) + " dA: " + deltaAngle.toFixed(4) + " dTime: " +  deltaTime);
        } else {
            turning = false;
        }
        // update lastTime
        this.lastTime = now;
        // update its sprite if necessary
        this.matchHeadingToSprite();
        this.updateAchtung();
        // ai boat handling
        if (this.isAI) {
            if (!this.aiStarted) {
                this.resetPlots(); // init the ai plots
                this.aiStarted = true;
                // set sail! all ahead half!
                this.setSailTrim(0.5);
                this.aiSetInitialHeading();
                this.aiSetHeading(); // now vet it against objects etc
                this.aiLastHeading = now;
            }
            if (!this.aiArrived) {
                if (now - this.aiLastHeading > 3500) {
                    if (!turning) {
                        this.aiSetHeading();
                        this.aiLastHeading = now;
                    }
                }
                // if we are within the radius of our destination, come to a halt
                var vec1 = new Victor(this.sprite.x + this.refPt.x, this.sprite.y + this.refPt.y);
                var vec2 = new Victor(this.aiTarget.x, this.aiTarget.y);
                var dist = Math.abs(vec1.distance(vec2));
                if (dist < 50) {
                    this.showAchtung();
                    this.setSailTrim(0);
                    this.matchHeadingToSprite(); // show sails down
                    this.aiArrived = true;
                }
                // if we have as ship target and it is in in arc and we are not reloading, fire back
                if (this.aiShipTarget != null && !this.aiShipTarget.isWrecked()) {
                    var v1 = this.getRefPtVictor();
                    var v2 = this.aiShipTarget.getRefPtVictor();
                    var d = Math.abs(v1.distance(v2));
                    if (d <= 350) {
                        // find angle between our heading vector, and the target's position from us as a vector
                        var h1 = this.heading;
                        var h2 = this.aiShipTarget.getRefPtVictor().subtract(this.getRefPtVictor());
                        h2.y = -h2.y; // invert the y to get h2 into cartesian like h1
                        h2.normalize();
                        var diff = this.getCalcAngleBetween(h1, h2);
                        if (this.debug) console.log("aiFire diff: " + diff.toFixed(1));
                        if (diff > 45 && diff < 135) {
                            //console.log("aiFire: diff in angle: " + diff.toFixed(1));
                            this.aiFireCannons();
                        }
                    }
                }
            }
            if (this.aiArrived) {
                this.deSpawn();
            }
            this.updateAITarget();
        } else {
            // check if we need to display the error icon
            if (this.aGround || this.inIrons) {
                this.showAchtung();
            } else {
                this.hideAchtung();
            }
        }
    };
    Ship.prototype.getCalcAngleBetween = function (v1, v2) {
        // calculate diff in angle which is cos theta = a dot b / mag a * mag b
        var dot = v1.dot(v2);
        var mag1 = Math.abs(v1.magnitude());
        var mag2 = Math.abs(v2.magnitude());
        var magprod = mag1 * mag2;
        var theta = Math.acos(dot / magprod);
        var degs = compassrose_1.default.getDegs(theta);
        // return angle in degrees
        return degs;
    };
    Ship.prototype.showAITarget = function () {
        this.debug = false; // toggle debug info here
        if (this.debug && !this.showTarget) {
            // put the aiTarget on the parent
            this.aiTargetSprite.x = this.aiTarget.x;
            this.aiTargetSprite.y = this.aiTarget.y;
            this.sprite.parent.addChild(this.aiTargetSprite);
            this.showTarget = true;
            // this.aiBoatPos.x = this.sprite.x;
            // this.aiBoatPos.y = this.sprite.y;
            // this.sprite.parent.addChild(this.aiBoatPos);
        }
    };
    Ship.prototype.hideAITarget = function () {
        if (this.showTarget) {
            this.showTarget = false;
            this.sprite.parent.removeChild(this.aiTargetSprite);
            this.debug = false;
            this.resetPlots(); // hides all plot points
        }
    };
    Ship.prototype.updateAITarget = function () {
        this.aiBoatPos.x = this.sprite.x + this.refPt.x;
        this.aiBoatPos.y = this.sprite.y + this.refPt.y;
    };
    Ship.prototype.showAchtung = function () {
        if (!this.errorDisplayed) {
            // add it
            this.achtung.x = this.sprite.x + this.sprite.width / 2 - this.achtung.width / 2;
            this.achtung.y = this.sprite.y - this.sprite.height;
            var numChildren = this.sprite.parent.children.length;
            this.sprite.parent.addChildAt(this.achtung, numChildren - 1);
            this.errorDisplayed = true;
            //console.log("adding Achtung");
        }
    };
    Ship.prototype.updateAchtung = function () {
        if (this.errorDisplayed) {
            this.achtung.x = this.sprite.x + this.sprite.width / 2 - this.achtung.width / 2;
            this.achtung.y = this.sprite.y - this.sprite.height;
        }
    };
    Ship.prototype.hideAchtung = function () {
        if (this.errorDisplayed) {
            this.sprite.parent.removeChild(this.achtung);
            this.errorDisplayed = false;
            //console.log("removing Achtung");
        }
    };
    Ship.prototype.getHeadingVictor = function () {
        return this.heading;
    };
    Ship.prototype.getHeading = function () {
        return this.degreeHeading;
    };
    Ship.prototype.getAngleToWind = function () {
        return this.angleToWind;
    };
    // newHeading is a cartesian angle
    Ship.prototype.changeHeading = function (newHeading) {
        // change our heading to the newHeading
        // we accomplish this over time dictated by the skill of our crew
        // for now use the scale 3000->10000 for good->bad crew skill levels
        if (newHeading == this.targetHeading) return; // nothing to do, newheading is same as current heading
        // small heading changes take less time than large ones
        // tacking through the wind adds a time penalty as the force decays then rises
        var deltaDegrees = this.larOrStarboard(newHeading);
        if (Math.abs(deltaDegrees) < 0.1) return; // short circuit for small heading changes
        this.targetHeading = newHeading;
        this.headingTicks = 0;
        if (deltaDegrees < 0) this.toLarboard = false;else this.toLarboard = true;
        // reset lastTime
        this.lastTime = 0;
        // calculate degrees per second, multiply by 1000 to convert to milliseconds
        var timeToTurn = Math.abs(deltaDegrees) / this.angularSpeed * 1000;
        //console.log("Changing heading of " + deltaDegrees.toFixed(2) + " in " + timeToTurn.toFixed(2) + " milliseconds");
        return timeToTurn;
    };
    // returns -degrees for starboard (subtract from heading until there)
    // return +degrees for larboard (add to heading until there)
    Ship.prototype.larOrStarboard = function (newHeading) {
        // convert to 360 paradigm (0 being along the positive x axis, sweeping anticlockwise)
        var to;
        var from;
        var left;
        var right;
        if (this.degreeHeading < 0) from = this.degreeHeading + 360;else from = this.degreeHeading;
        if (newHeading < 0) to = newHeading + 360;else to = newHeading;
        if (from < to) {
            left = to - from;
            right = 360 - to + from;
        } else {
            left = 360 - from + to;
            right = from - to;
            //left = to - from;
            //right = (360 - to) + from;
        }
        if (right < left) return -right; // go right, right also contains the degrees needed 
        else return left; // go left, left contains the degrees needed
    };
    Ship.prototype.aiFireCannons = function () {
        var _this = this;
        // ai do not fire from both sides, so just use portcannontimer to track reloading
        var now = Date.now();
        var RELOADTIME = 8000;
        var reloading = false;
        if (now - this.portCannonLastFired < RELOADTIME) reloading = true;
        if (reloading) return; // cant fire til reload is done
        console.log("AI: Returning fire at target!");
        this.portCannonLastFired = now;
        // fire procedure - naive, no target lead
        // 1> calculate angle to target
        // 2> fire along that angle
        var v1 = this.getRefPtVictor();
        var v2 = this.aiShipTarget.getRefPtVictor();
        var v = v2.subtract(v1);
        v.normalize();
        var cannons = 4;
        var d = this.heading.clone();
        d.y = -d.y;
        var MINDELAY = 100;
        var MAXDELAY = 250;
        if (cannons == 4) {
            var x = this.sprite.x + this.refPt.x + 5 * d.x; // first ball 5 pix along heading
            var y = this.sprite.y + this.refPt.y + 5 * d.y;
            // fire the first ball immediately
            this.fireDelay(x, y, v);
            // remaining balls fired with .25-.5 second delay
            var delay = theSea_1.default.getRandomIntInclusive(MINDELAY, MAXDELAY);
            var x2 = this.sprite.x + this.refPt.x + 10 * d.x; // 2nd ball 10 pix along heading
            var y2 = this.sprite.y + this.refPt.y + 10 * d.y;
            setTimeout(function () {
                _this.fireDelay(x2, y2, v);
            }, delay);
            var x3 = this.sprite.x + this.refPt.x + 5 * -d.x; // 3rd ball 5 pix along inverse heading
            var y3 = this.sprite.y + this.refPt.y + 5 * -d.y;
            delay = theSea_1.default.getRandomIntInclusive(MINDELAY, MAXDELAY);
            setTimeout(function () {
                _this.fireDelay(x3, y3, v);
            }, delay);
            var x4 = this.sprite.x + this.refPt.x + 10 * -d.x; // 4th ball 10 pix along inverse heading
            var y4 = this.sprite.y + this.refPt.y + 10 * -d.y;
            delay = theSea_1.default.getRandomIntInclusive(MINDELAY, MAXDELAY);
            setTimeout(function () {
                _this.fireDelay(x4, y4, v);
            }, delay);
        }
    };
    // fire battery and return the milliseconds it will take to reload
    Ship.prototype.fireCannons = function (rightBattery) {
        var _this = this;
        if (rightBattery === void 0) {
            rightBattery = true;
        }
        var now = Date.now();
        var RELOADTIME = 4000;
        var reloading = false;
        if (rightBattery && now - this.starCannonLastFired < RELOADTIME) reloading = true;
        if (!rightBattery && now - this.portCannonLastFired < RELOADTIME) reloading = true;
        if (reloading) {
            var msg = new popmsgbox_1.default();
            var side = "";
            if (rightBattery) side = "starboard";else side = "larboard";
            msg.initMsg(0, "1st Mate", "The " + side + " battery is still reloading captain!");
            singleton_1.default.popupManager.displayPopup(msg);
            return 0;
        }
        if (this.magBall > 0) {
            if (rightBattery) this.starCannonLastFired = now;else this.portCannonLastFired = now;
            //console.log("FIRE!!");
            this.magBall -= 1; // deduct ammo (for now just one shot)
            // velocity calculations
            var v = new Victor(0, 0);
            v.x = this.heading.x;
            v.y = -this.heading.y;
            // get direction
            if (rightBattery) v.rotate(compassrose_1.default.getRads(90));else v.rotate(compassrose_1.default.getRads(-90));
            v.normalize();
            // add speed data - speed expressed as pixels/millisecond
            // var speed = 250 / 1000;
            // v.multiplyScalar(speed);
            // request a cannonball and give it a velocity
            // var x = this.sprite.x + this.refPt.x;
            // var y = this.sprite.y + this.refPt.y;
            var cannons = 4;
            var d = this.heading.clone();
            d.y = -d.y;
            var MINDELAY = 100;
            var MAXDELAY = 250;
            if (cannons == 4) {
                var x = this.sprite.x + this.refPt.x + 5 * d.x; // first ball 5 pix along heading
                var y = this.sprite.y + this.refPt.y + 5 * d.y;
                // fire the first ball immediately
                this.fireDelay(x, y, v);
                // remaining balls fired with .25-.5 second delay
                var delay = theSea_1.default.getRandomIntInclusive(MINDELAY, MAXDELAY);
                var x2 = this.sprite.x + this.refPt.x + 10 * d.x; // 2nd ball 10 pix along heading
                var y2 = this.sprite.y + this.refPt.y + 10 * d.y;
                setTimeout(function () {
                    _this.fireDelay(x2, y2, v);
                }, delay);
                var x3 = this.sprite.x + this.refPt.x + 5 * -d.x; // 3rd ball 5 pix along inverse heading
                var y3 = this.sprite.y + this.refPt.y + 5 * -d.y;
                delay = theSea_1.default.getRandomIntInclusive(MINDELAY, MAXDELAY);
                setTimeout(function () {
                    _this.fireDelay(x3, y3, v);
                }, delay);
                var x4 = this.sprite.x + this.refPt.x + 10 * -d.x; // 4th ball 10 pix along inverse heading
                var y4 = this.sprite.y + this.refPt.y + 10 * -d.y;
                delay = theSea_1.default.getRandomIntInclusive(MINDELAY, MAXDELAY);
                setTimeout(function () {
                    _this.fireDelay(x4, y4, v);
                }, delay);
            }
            // return the reload speed based off crew ability
            return 4000;
        } else {
            var msg = new popmsgbox_1.default();
            msg.initMsg(0, "1st Mate", "Captain! The magazine has run dry! We should put into port and reload!");
            singleton_1.default.popupManager.displayPopup(msg);
            return 0;
        }
    };
    Ship.prototype.getMagBall = function () {
        return this.magBall;
    };
    Ship.prototype.fillMagazine = function () {
        this.magBall = this.magBallMax;
    };
    Ship.prototype.getMagBallMax = function () {
        return this.magBallMax;
    };
    Ship.prototype.getHull = function () {
        return this.statHull;
    };
    Ship.prototype.getHullMax = function () {
        return this.statHullMax;
    };
    Ship.prototype.repairAll = function () {
        this.statHull = this.statHullMax;
    };
    Ship.prototype.isWrecked = function () {
        return this.wrecked;
    };
    Ship.prototype.unWreck = function () {
        // give the boat 1hp and make it not wrecked.. player will have to port and repair
        this.statHull = 1;
        this.wrecked = false;
        this.allStop();
        this.heading = new Victor(1, 0); // east
        this.degreeHeading = this.heading.angleDeg();
        this.targetHeading = this.degreeHeading;
        this.usingFrame = -1; // invalidate usingFrame
        this.matchHeadingToSprite();
        this.setPosition(6200, 2600);
        this.fxManager.returnSmokeToPool(this.smokeID);
    };
    Ship.prototype.receiveFire = function (weight, source) {
        // if (this == SingletonClass.ship)
        //     return; // player immune
        this.statHull -= weight;
        if (this.statHull <= 0 && !this.wrecked) {
            // we are destroyed
            this.wrecked = true;
            this.targetSpeed = 0;
            this.speed = 0;
            // switch our frame to our wrecked frame
            this.switchFrameToWrecked();
            // center over refpt
            //var ref = this.getRefPtVictor();
            //this.sprite.x = ref.x - this.sprite.width/2;
            //this.sprite.y = ref.y - this.sprite.height/2;
            // ask the fx manager for a smoke plume at our reference point
            this.smokeID = this.fxManager.placeSmokePlume(this.sprite.x + this.refPt.x, this.sprite.y + this.refPt.y);
            // wreck frame does not conform.. move sprite by wreck offset.. for now hardcoded
            //this.sprite.y += 50;   
            if (this == singleton_1.default.ship) {
                // send an event to the hud to start the player-recovery process
                var myEvent = new CustomEvent("playerWrecked", {
                    'detail': { "boat": this }
                });
                window.dispatchEvent(myEvent);
            }
        }
        if (this.isAI) {
            if (this.aiShipTarget != source) {
                this.aiShipTarget = source;
                console.log("AI: Acquired new target!");
            }
        }
        //console.log("took " + weight + " damage. Hull: " + this.statHull);
    };
    Ship.prototype.clearPlayerTarget = function () {
        if (this.aiShipTarget == singleton_1.default.ship) this.aiShipTarget = null;
    };
    Ship.prototype.switchFrameToWrecked = function () {
        var s = this.getSprite();
        s.texture = PIXI.Texture.fromFrame("CorvetteBodyWreck.png");
        if (singleton_1.default.ship != this) {
            this.aiPopulateLoot();
        }
    };
    Ship.prototype.sink = function () {
        // fade the ship out and then remove us from the map
        var s = this.getSprite();
        s.interactive = false;
        // return the smoke to the fxmanager
        this.fxManager.returnSmokeToPool(this.smokeID);
        TweenMax.to(s, 2, { alpha: 0, onComplete: this.sunk });
    };
    Ship.prototype.deSpawn = function () {
        // fade the ship out and then remove us from the map
        var s = this.getSprite();
        s.interactive = false;
        TweenMax.to(s, 4, { alpha: 0, onComplete: this.reSpawn });
        this.deSpawned = true;
    };
    Ship.prototype.aiPopulateLoot = function () {
        // fill the hold with random loot items
        var i = 0;
        var itemID;
        for (i = 0; i < 5; i++) {
            // generate a random loot item 
            itemID = theSea_1.default.getRandomIntInclusive(0, economyitem_1.default.maxItems - 1);
            this.shipsHold[i] = new economyitem_1.default(itemID, 0); // random rarity
        }
        // randomly generate the coin value treasure this boat may have
        this.coins = theSea_1.default.getRandomIntInclusive(1, 10);
    };
    Ship.prototype.getCoins = function () {
        return this.coins;
    };
    // return next itemID from the shipsHold
    Ship.prototype.aiPopNextLoot = function () {
        if (this.shipsHold.length == 0) return null;
        return this.shipsHold.pop();
    };
    Ship.prototype.aiNumHoldItems = function () {
        return this.shipsHold.length;
    };
    Ship.prototype.addToHold = function (itemType, rarity) {
        if (rarity === void 0) {
            rarity = 0;
        }
        if (this.shipsHold.length < this.shipsHoldCapacity) {
            var e = new economyitem_1.default(itemType, rarity);
            this.shipsHold.push(e);
            return true;
        } else {
            return false;
        }
    };
    Ship.prototype.isHoldFull = function () {
        if (this.shipsHold.length < this.shipsHoldCapacity) return false;else return true;
    };
    Ship.prototype.getHold = function () {
        return this.shipsHold;
    };
    return Ship;
}(gameobject_1.default);
exports.default = Ship;

/***/ }),
/* 11 */
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
var Victor = __webpack_require__(5);
var CompassRose = /** @class */function (_super) {
    __extends(CompassRose, _super);
    function CompassRose() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animRot = 0;
        _this.mouseDown = false;
        _this.trackedNewHeading = 0;
        _this.mouseMoveHandler = function (e) {
            if (e.data.buttons == 0) _this.endSetHeading();
            // mouse has moved, find the angle relative to the center of the compass and rotate the ghost image there
            if (_this.mouseDown) {
                _this.needleGhostHeading.visible = true;
                _this.noGoArc.visible = true;
                // get local coords from mouse coords
                var locPt = _this.toLocal(new PIXI.Point(e.data.global.x, e.data.global.y));
                // get a vector from these coords
                var vic = new Victor(locPt.x - _this.compassBase.width / 2, -(locPt.y - _this.compassBase.height / 2));
                var angDeg = vic.angleDeg();
                _this.needleGhostHeading.rotation = CompassRose.getRads(CompassRose.convertCartToCompass(angDeg));
                //console.log("Mouse Degrees: " + vic.angleDeg());
                _this.trackedNewHeading = angDeg;
                if (CompassRose.isValidHeading(_this.trackingShip.getAngleToWind(), _this.trackedNewHeading)) _this.noGoArc.visible = false;else _this.noGoArc.visible = true;
            }
        };
        _this.mouseDownHandler = function (e) {
            if (e.target == _this.needleHeading) {
                _this.mouseDown = true;
                //console.log("CompassRose: START ghost heading");
            }
        };
        _this.mouseUpHandler = function (e) {
            // release mouse no matter what the e.target was
            _this.endSetHeading();
        };
        return _this;
    }
    CompassRose.getWindDirection = function () {
        return CompassRose.windDirection;
    };
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
        this.needleHeading.x = 66;
        this.needleHeading.y = 66;
        this.needleHeading.rotation = CompassRose.getRads(15);
        // the ghost heading needle
        this.needleGhostHeading = new PIXI.Sprite(PIXI.Texture.fromFrame("needleShip.png"));
        this.needleGhostHeading.anchor.x = 0.5;
        this.needleGhostHeading.anchor.y = 1; // anchor at center bottom
        this.needleGhostHeading.x = 66;
        this.needleGhostHeading.y = 66;
        this.needleGhostHeading.rotation = CompassRose.getRads(15);
        this.needleGhostHeading.visible = false;
        this.needleGhostHeading.alpha = 0.67;
        this.needleStarCannon = new PIXI.Sprite(PIXI.Texture.fromFrame("needleCannon.png"));
        // this.needleCannon.pivot.x = this.needleCannon.width / 2;
        // this.needleCannon.pivot.y = this.needleCannon.height;  // bottom center of sprite
        this.needleStarCannon.anchor.x = 0.5;
        this.needleStarCannon.anchor.y = 1; // anchor at center bottom
        this.needleStarCannon.x = 66;
        this.needleStarCannon.y = 66; // centered on compass base
        this.needleStarCannon.rotation = CompassRose.getRads(105);
        this.needleStarCannon.alpha = 0.67;
        this.needleLarCannon = new PIXI.Sprite(PIXI.Texture.fromFrame("needleCannon.png"));
        // this.needleCannon.pivot.x = this.needleCannon.width / 2;
        // this.needleCannon.pivot.y = this.needleCannon.height;  // bottom center of sprite
        this.needleLarCannon.anchor.x = 0.5;
        this.needleLarCannon.anchor.y = 1; // anchor at center bottom
        this.needleLarCannon.x = 66;
        this.needleLarCannon.y = 66; // centered on compass base
        this.needleLarCannon.rotation = CompassRose.getRads(275);
        this.needleLarCannon.alpha = 0.67;
        this.windIndicator = new PIXI.Sprite(PIXI.Texture.fromFrame("WindIndicator.png"));
        // this.windDirection.pivot.x = 29;
        // this.windDirection.pivot.y = 183;  // will rotate around this point against the compass base background
        this.windIndicator.anchor.x = 0.5;
        this.windIndicator.anchor.y = 2.5;
        this.windIndicator.x = 66; //this.compassBase.width / 2 - this.windDirection.width / 2;
        this.windIndicator.y = 66; //17; // magic number
        CompassRose.windDirection = 0; // due north
        this.addChild(this.compassBase); // z order will be in child order, back to front
        this.setNoGo(60);
        this.addChild(this.windIndicator);
        this.addChild(this.needleHeading);
        this.addChild(this.needleGhostHeading);
        this.addChild(this.needleStarCannon);
        this.addChild(this.needleLarCannon);
        this.addChild(this.starCap);
        this.needleHeading.interactive = true;
        this.needleHeading.on("mousedown", this.mouseDownHandler);
        this.needleHeading.on("mousemove", this.mouseMoveHandler);
        this.needleHeading.on("mouseup", this.mouseUpHandler);
        this.pivot.x = this.compassBase.x + this.compassBase.width / 2;
        this.pivot.y = this.compassBase.y + this.compassBase.height / 2;
    };
    CompassRose.prototype.endSetHeading = function () {
        if (this.mouseDown == true) {
            this.mouseDown = false;
            //console.log("CompassRose: END ghost heading");
            var myEvent = new CustomEvent("changeHeading", {
                'detail': this.trackedNewHeading
            });
            window.dispatchEvent(myEvent);
        }
        // else ignore - might be called as mouse moves without mousedown
    };
    CompassRose.prototype.testIsValidHeading = function () {
        var cartAng;
        var i, pos, neg;
        // test against wind at 0 degrees and a boat with 60 degree offwind value
        for (i = 0; i <= 180; i++) {
            pos = CompassRose.isValidHeading(60, i);
            neg = CompassRose.isValidHeading(60, -i);
            console.log("+/- " + i + " : pos=" + pos + " neg=" + neg);
        }
    };
    CompassRose.getSmallestHeadingOffwind = function (angleToWind, heading, returnMax) {
        if (returnMax === void 0) {
            returnMax = false;
        }
        var maxWind = CompassRose.windDirection + angleToWind;
        var minWind = CompassRose.windDirection - angleToWind;
        // one has crossed the zero degree threshold, convert and do some shenanigans
        if (minWind < 0) minWind = 360 + minWind; // ie -15 would become 345
        if (maxWind > 360) maxWind = maxWind - 360; // ie 375 would become 15
        if (minWind > maxWind) {
            var temp = maxWind;
            maxWind = minWind;
            minWind = temp;
        }
        // convert each to cartesian and compare to heading
        minWind = CompassRose.getRads(CompassRose.convertCompassToCart(minWind));
        maxWind = CompassRose.getRads(CompassRose.convertCompassToCart(maxWind));
        //console.log("cart angles - minWind: " + minWind.toFixed(4) + " maxWind: " + maxWind.toFixed(4));
        var minVic = new Victor(Math.cos(minWind), Math.sin(minWind));
        var maxVic = new Victor(Math.cos(maxWind), Math.sin(maxWind));
        heading.norm();
        minVic.norm();
        maxVic.norm();
        var minAngle = Math.acos(heading.dot(minVic));
        var maxAngle = Math.acos(heading.dot(maxVic));
        var minAngleDegs = CompassRose.getDegs(minAngle);
        var maxAngleDegs = CompassRose.getDegs(maxAngle);
        var headingDegs = heading.angleDeg();
        //console.log("headingDegs: " + headingDegs.toFixed(1) + " minAngle: " + minAngleDegs.toFixed(1) + " maxAngle: " + maxAngleDegs.toFixed(1));
        if (returnMax) {
            if (minAngle > maxAngle) return minVic;else return maxVic;
        } else {
            if (minAngle < maxAngle) return minVic;else return maxVic;
        }
    };
    CompassRose.convertCompassToCart = function (compass) {
        var mangle = compass + 90; // rotate 90 degrees to align with cartesian zero
        if (compass >= 0 && compass <= 90) mangle = 90 - compass;
        if (compass > 90 && compass <= 270) mangle = -(compass - 90);
        if (compass > 270 && compass <= 360) mangle = 180 - (compass - 270);
        return mangle;
    };
    //
    // angleToWind: in degrees - specifies angle off the wind a ship can point at minimum
    // trackedHeading: in degrees (Cartesian) to check for validity
    // 
    CompassRose.isValidHeading = function (angleToWind, trackedHeading, debug) {
        if (debug === void 0) {
            debug = false;
        }
        // heading is valid if it is not within angleToWind degrees of the current wind direction
        var maxWind = CompassRose.windDirection + angleToWind;
        var minWind = CompassRose.windDirection - angleToWind;
        var tracked = CompassRose.convertCartToCompass(trackedHeading);
        // valid angles are 0 -> 360
        if (maxWind > 0 && maxWind < 360 && minWind > 0 && minWind < 360) {
            if (debug) console.log("minWind: " + minWind + " maxWind: " + maxWind + " tracked: " + trackedHeading.toFixed(2) + " trackedDeg: " + tracked.toFixed(2));
            if (tracked >= minWind && tracked <= maxWind) return true;else return false;
        } else {
            // one has crossed the zero degree threshold, convert and do some shenanigans
            if (minWind < 0) minWind = 360 + minWind; // ie -15 would become 345
            if (maxWind > 360) maxWind = maxWind - 360; // ie 375 would become 15
            if (minWind > maxWind) {
                var temp = maxWind;
                maxWind = minWind;
                minWind = temp;
            }
            if (debug) console.log("minWind: " + minWind + " maxWind: " + maxWind + " tracked: " + trackedHeading.toFixed(2) + " trackedDeg: " + tracked.toFixed(2));
            if (tracked >= minWind && tracked <= maxWind) return true;else return false;
        }
    };
    // creates the nogo arc
    // degrees is closest point to wind (total arc will be degrees*2)
    CompassRose.prototype.setNoGo = function (degrees) {
        // make a circular arc based off percentDone  100 will be no mask.. reveals clockwise as percent increases
        var degs = degrees * 2;
        var rads = CompassRose.getRads(degs);
        if (this.noGoArc) {
            this.removeChild(this.noGoArc);
            this.noGoArc.destroy();
        }
        var arc = new PIXI.Graphics();
        arc.beginFill(0xff0000);
        arc.moveTo(this.compassBase.width / 2, this.compassBase.height / 2);
        arc.arc(this.compassBase.width / 2, this.compassBase.height / 2, this.compassBase.width / 2, 0, rads, false); // cx, cy, radius, angle, endAngle, anticlockwise bool
        arc.endFill();
        arc.pivot.x = this.compassBase.width / 2;
        arc.pivot.y = this.compassBase.height / 2;
        arc.x = this.compassBase.width / 2;
        arc.y = this.compassBase.height / 2;
        // rotate arc to straddle the wind direction
        arc.rotation = CompassRose.getRads(CompassRose.windDirection - 90 - degrees);
        this.noGoArc = arc;
        this.noGoArc.alpha = 0.33;
        this.addChildAt(this.noGoArc, 1); //1 is just above 0, the compassBase
        this.noGoArc.visible = false;
    };
    CompassRose.getRads = function (degrees) {
        return degrees * Math.PI / 180;
    };
    CompassRose.getDegs = function (rads) {
        return rads * (180 / Math.PI);
    };
    CompassRose.convertCartToCompass = function (degrees) {
        // take a cartesian heading in degrees (0 is along the x axis "to the right" and sweeps counter clockwise)
        // and convert it to compass rotation (0 is along the y axis "up" and sweeps clockwise)
        // cart will be from 0 -> 180 or 0 -> -180 for top or bottom hemisphere
        // compass rotations are just 0 -> 360
        var compassAngle = 0;
        if (degrees < 0) {
            compassAngle = 90 + Math.abs(degrees);
        } else if (degrees > 90) {
            compassAngle = 180 - degrees + 270;
        } else {
            compassAngle = 90 - degrees;
        }
        return compassAngle;
    };
    // set the ship we should track for heading info
    CompassRose.prototype.trackShip = function (ship) {
        this.trackingShip = ship;
        this.setNoGo(this.trackingShip.getAngleToWind());
    };
    CompassRose.prototype.rotateCannonNeedles = function () {
        // rotate cannon needles based off compass heading
        //starboard cannon is rotated + 90 from heading
        this.needleStarCannon.rotation = this.needleHeading.rotation + Math.PI / 2;
        this.needleLarCannon.rotation = this.needleHeading.rotation - Math.PI / 2;
        // larboard cannon is rotated - 90 from heading
    };
    CompassRose.prototype.update = function () {
        if (this.trackingShip) {
            this.needleHeading.rotation = CompassRose.getRads(CompassRose.convertCartToCompass(this.trackingShip.getHeading()));
            this.rotateCannonNeedles();
        }
        // this.animRot += 0.1;
        // this.needleHeading.rotation = this.getRads(this.animRot);
        // console.log("HeadingNeedle rotation: " + this.animRot.toFixed(2));
    };
    CompassRose.windDirection = 0; // direction wind is coming from (in degrees - 0 is due North)
    return CompassRose;
}(PIXI.Container);
exports.default = CompassRose;

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsciiFilter", function() { return AsciiFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdvancedBloomFilter", function() { return AdvancedBloomFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BloomFilter", function() { return BloomFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BulgePinchFilter", function() { return BulgePinchFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorReplaceFilter", function() { return ColorReplaceFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConvolutionFilter", function() { return ConvolutionFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CrossHatchFilter", function() { return CrossHatchFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DotFilter", function() { return DotFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropShadowFilter", function() { return DropShadowFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmbossFilter", function() { return EmbossFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlowFilter", function() { return GlowFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GodrayFilter", function() { return GodrayFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutlineFilter", function() { return OutlineFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiColorReplaceFilter", function() { return MultiColorReplaceFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PixelateFilter", function() { return PixelateFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RGBSplitFilter", function() { return RGBSplitFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShockwaveFilter", function() { return ShockwaveFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleLightmapFilter", function() { return SimpleLightmapFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TiltShiftFilter", function() { return TiltShiftFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TiltShiftAxisFilter", function() { return TiltShiftAxisFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TiltShiftXFilter", function() { return TiltShiftXFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TiltShiftYFilter", function() { return TiltShiftYFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TwistFilter", function() { return TwistFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZoomBlurFilter", function() { return ZoomBlurFilter; });
/*!
 * pixi-filters - v2.3.0
 * Compiled Tue, 31 Oct 2017 18:02:59 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

if (typeof PIXI === 'undefined' || typeof PIXI.filters === 'undefined') { throw 'PixiJS is required'; }

/*!
 * @pixi/filter-ascii - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:25 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment="varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}";
var AsciiFilter=function(e){function n(n){void 0===n&&(n=8),e.call(this,vertex,fragment),this.size=n;}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var r={size:{configurable:!0}};return r.size.get=function(){return this.uniforms.pixelSize},r.size.set=function(e){this.uniforms.pixelSize=e;},Object.defineProperties(n.prototype,r),n}(PIXI.Filter);PIXI.filters.AsciiFilter=AsciiFilter;

/*!
 * @pixi/filter-advanced-bloom - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:25 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$1="\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main() {\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$1="\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n";
var ExtractBrightnessFilter=function(r){function t(t){void 0===t&&(t=.5),r.call(this,vertex$1,fragment$1),this.threshold=t;}r&&(t.__proto__=r),(t.prototype=Object.create(r&&r.prototype)).constructor=t;var e={threshold:{configurable:!0}};return e.threshold.get=function(){return this.uniforms.threshold},e.threshold.set=function(r){this.uniforms.threshold=r;},Object.defineProperties(t.prototype,e),t}(PIXI.Filter);
var vertex$1$1="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main() {\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$1$1="uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n";
var AdvancedBloomFilter=function(r){function t(t){r.call(this,vertex$1$1,fragment$1$1),"number"==typeof t&&(t={threshold:t}),t=Object.assign({threshold:.5,bloomScale:1,brightness:1,blur:8,quality:4,resolution:PIXI.settings.RESOLUTION,kernelSize:5},t),this.bloomScale=t.bloomScale,this.brightness=t.brightness;var e=t.blur,o=t.quality,n=t.resolution,i=t.kernelSize,l=PIXI.filters,s=l.BlurXFilter,a=l.BlurYFilter;this._extract=new ExtractBrightnessFilter(t.threshold),this._blurX=new s(e,o,n,i),this._blurY=new a(e,o,n,i);}r&&(t.__proto__=r),(t.prototype=Object.create(r&&r.prototype)).constructor=t;var e={threshold:{configurable:!0},blur:{configurable:!0}};return t.prototype.apply=function(r,t,e,o,n){var i=r.getRenderTarget(!0);this._extract.apply(r,t,i,!0,n),this._blurX.apply(r,i,i,!0,n),this._blurY.apply(r,i,i,!0,n),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=i,r.applyFilter(this,t,e,o),r.returnRenderTarget(i);},e.threshold.get=function(){return this._extract.threshold},e.threshold.set=function(r){this._extract.threshold=r;},e.blur.get=function(){return this._blurX.blur},e.blur.set=function(r){this._blurX.blur=this._blurY.blur=r;},Object.defineProperties(t.prototype,e),t}(PIXI.Filter);PIXI.filters.AdvancedBloomFilter=AdvancedBloomFilter;

/*!
 * @pixi/filter-bloom - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:25 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ref=PIXI.filters;
var BlurXFilter=ref.BlurXFilter;
var BlurYFilter=ref.BlurYFilter;
var AlphaFilter=ref.AlphaFilter;
var BloomFilter=function(r){function t(t,l,e,i){void 0===t&&(t=2),void 0===l&&(l=4),void 0===e&&(e=PIXI.settings.RESOLUTION),void 0===i&&(i=5),r.call(this);var u,o;"number"==typeof t?(u=t,o=t):t instanceof PIXI.Point?(u=t.x,o=t.y):Array.isArray(t)&&(u=t[0],o=t[1]),this.blurXFilter=new BlurXFilter(u,l,e,i),this.blurYFilter=new BlurYFilter(o,l,e,i),this.blurYFilter.blendMode=PIXI.BLEND_MODES.SCREEN,this.defaultFilter=new AlphaFilter;}r&&(t.__proto__=r),(t.prototype=Object.create(r&&r.prototype)).constructor=t;var l={blur:{configurable:!0},blurX:{configurable:!0},blurY:{configurable:!0}};return t.prototype.apply=function(r,t,l){var e=r.getRenderTarget(!0);this.defaultFilter.apply(r,t,l),this.blurXFilter.apply(r,t,e),this.blurYFilter.apply(r,e,l),r.returnRenderTarget(e);},l.blur.get=function(){return this.blurXFilter.blur},l.blur.set=function(r){this.blurXFilter.blur=this.blurYFilter.blur=r;},l.blurX.get=function(){return this.blurXFilter.blur},l.blurX.set=function(r){this.blurXFilter.blur=r;},l.blurY.get=function(){return this.blurYFilter.blur},l.blurY.set=function(r){this.blurYFilter.blur=r;},Object.defineProperties(t.prototype,l),t}(PIXI.Filter);PIXI.filters.BloomFilter=BloomFilter;

/*!
 * @pixi/filter-bulge-pinch - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:25 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$2="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$2="uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n";
var BulgePinchFilter=function(e){function r(r,n,t){e.call(this,vertex$2,fragment$2),this.center=r||[.5,.5],this.radius=n||100,this.strength=t||1;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var n={radius:{configurable:!0},strength:{configurable:!0},center:{configurable:!0}};return r.prototype.apply=function(e,r,n){this.uniforms.dimensions[0]=r.sourceFrame.width,this.uniforms.dimensions[1]=r.sourceFrame.height,e.applyFilter(this,r,n);},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e;},n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e;},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e;},Object.defineProperties(r.prototype,n),r}(PIXI.Filter);PIXI.filters.BulgePinchFilter=BulgePinchFilter;

/*!
 * @pixi/filter-color-replace - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:26 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$3="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$3="varying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n";
var ColorReplaceFilter=function(o){function r(r,e,n){void 0===r&&(r=16711680),void 0===e&&(e=0),void 0===n&&(n=.4),o.call(this,vertex$3,fragment$3),this.originalColor=r,this.newColor=e,this.epsilon=n;}o&&(r.__proto__=o),(r.prototype=Object.create(o&&o.prototype)).constructor=r;var e={originalColor:{configurable:!0},newColor:{configurable:!0},epsilon:{configurable:!0}};return e.originalColor.set=function(o){var r=this.uniforms.originalColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,r),this._originalColor=o):(r[0]=o[0],r[1]=o[1],r[2]=o[2],this._originalColor=PIXI.utils.rgb2hex(r));},e.originalColor.get=function(){return this._originalColor},e.newColor.set=function(o){var r=this.uniforms.newColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,r),this._newColor=o):(r[0]=o[0],r[1]=o[1],r[2]=o[2],this._newColor=PIXI.utils.rgb2hex(r));},e.newColor.get=function(){return this._newColor},e.epsilon.set=function(o){this.uniforms.epsilon=o;},e.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);PIXI.filters.ColorReplaceFilter=ColorReplaceFilter;

/*!
 * @pixi/filter-convolution - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:26 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$4="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$4="precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n";
var ConvolutionFilter=function(e){function t(t,r,o){e.call(this,vertex$4,fragment$4),this.matrix=t,this.width=r,this.height=o;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={matrix:{configurable:!0},width:{configurable:!0},height:{configurable:!0}};return r.matrix.get=function(){return this.uniforms.matrix},r.matrix.set=function(e){this.uniforms.matrix=new Float32Array(e);},r.width.get=function(){return 1/this.uniforms.texelSize[0]},r.width.set=function(e){this.uniforms.texelSize[0]=1/e;},r.height.get=function(){return 1/this.uniforms.texelSize[1]},r.height.set=function(e){this.uniforms.texelSize[1]=1/e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);PIXI.filters.ConvolutionFilter=ConvolutionFilter;

/*!
 * @pixi/filter-cross-hatch - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:26 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$5="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$5="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n";
var CrossHatchFilter=function(r){function o(){r.call(this,vertex$5,fragment$5);}return r&&(o.__proto__=r),o.prototype=Object.create(r&&r.prototype),o.prototype.constructor=o,o}(PIXI.Filter);PIXI.filters.CrossHatchFilter=CrossHatchFilter;

/*!
 * @pixi/filter-dot - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:26 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$6="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$6="precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n";
var DotFilter=function(e){function n(n,t){void 0===n&&(n=1),void 0===t&&(t=5),e.call(this,vertex$6,fragment$6),this.scale=n,this.angle=t;}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var t={scale:{configurable:!0},angle:{configurable:!0}};return t.scale.get=function(){return this.uniforms.scale},t.scale.set=function(e){this.uniforms.scale=e;},t.angle.get=function(){return this.uniforms.angle},t.angle.set=function(e){this.uniforms.angle=e;},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.DotFilter=DotFilter;

/*!
 * @pixi/filter-drop-shadow - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:28 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$7="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$7="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}";
var DropShadowFilter=function(t){function r(r,e,i,n,o){void 0===r&&(r=45),void 0===e&&(e=5),void 0===i&&(i=2),void 0===n&&(n=0),void 0===o&&(o=.5),t.call(this),this.tintFilter=new PIXI.Filter(vertex$7,fragment$7),this.blurFilter=new PIXI.filters.BlurFilter,this.blurFilter.blur=i,this.rotation=r,this.padding=e,this.distance=e,this.alpha=o,this.color=n;}t&&(r.__proto__=t),(r.prototype=Object.create(t&&t.prototype)).constructor=r;var e={distance:{configurable:!0},rotation:{configurable:!0},blur:{configurable:!0},alpha:{configurable:!0},color:{configurable:!0}};return r.prototype.apply=function(r,e,i){var n=r.getRenderTarget();n.transform=new PIXI.Matrix,n.transform.translate(this.distance*Math.cos(this.angle),this.distance*Math.sin(this.angle)),this.tintFilter.apply(r,e,n,!0),this.blurFilter.apply(r,n,i),t.prototype.apply.call(this,r,e,i),n.transform=null,r.returnRenderTarget(n);},r.prototype.updatePadding=function(){this.padding=this.distance+2*this.blur;},e.distance.get=function(){return this._distance},e.distance.set=function(t){this._distance=t,this.updatePadding();},e.rotation.get=function(){return this.angle/PIXI.DEG_TO_RAD},e.rotation.set=function(t){this.angle=t*PIXI.DEG_TO_RAD;},e.blur.get=function(){return this.blurFilter.blur},e.blur.set=function(t){this.blurFilter.blur=t,this.updatePadding();},e.alpha.get=function(){return this.tintFilter.uniforms.alpha},e.alpha.set=function(t){this.tintFilter.uniforms.alpha=t;},e.color.get=function(){return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color)},e.color.set=function(t){PIXI.utils.hex2rgb(t,this.tintFilter.uniforms.color);},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);PIXI.filters.DropShadowFilter=DropShadowFilter;

/*!
 * @pixi/filter-emboss - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:28 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$8="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$8="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n";
var EmbossFilter=function(e){function t(t){void 0===t&&(t=5),e.call(this,vertex$8,fragment$8),this.strength=t;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={strength:{configurable:!0}};return r.strength.get=function(){return this.uniforms.strength},r.strength.set=function(e){this.uniforms.strength=e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);PIXI.filters.EmbossFilter=EmbossFilter;

/*!
 * @pixi/filter-glow - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:28 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$9="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$9="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n";
var GlowFilter=function(o){function n(n,t,r,e,l){void 0===n&&(n=10),void 0===t&&(t=4),void 0===r&&(r=0),void 0===e&&(e=16777215),void 0===l&&(l=.1),o.call(this,vertex$9,fragment$9.replace(/%QUALITY_DIST%/gi,""+(1/l/n).toFixed(7)).replace(/%DIST%/gi,""+n.toFixed(7))),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.distance=n,this.color=e,this.outerStrength=t,this.innerStrength=r;}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var t={color:{configurable:!0},distance:{configurable:!0},outerStrength:{configurable:!0},innerStrength:{configurable:!0}};return t.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.glowColor)},t.color.set=function(o){PIXI.utils.hex2rgb(o,this.uniforms.glowColor);},t.distance.get=function(){return this.uniforms.distance},t.distance.set=function(o){this.uniforms.distance=o;},t.outerStrength.get=function(){return this.uniforms.outerStrength},t.outerStrength.set=function(o){this.uniforms.outerStrength=o;},t.innerStrength.get=function(){return this.uniforms.innerStrength},t.innerStrength.set=function(o){this.uniforms.innerStrength=o;},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.GlowFilter=GlowFilter;

/*!
 * @pixi/filter-godray - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:28 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$10="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var perlin="vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n";
var main="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 angleDir;\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\n\n${perlin}\n\nvoid main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float xx = angleDir.x;\n    float yy = angleDir.y;\n\n    float d = (xx * coord.x) + (yy * coord.y);\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n    gl_FragColor += mist;\n}\n";
var GodrayFilter=function(n){function e(e,t,i,o){void 0===e&&(e=30),void 0===t&&(t=.5),void 0===i&&(i=2.5),void 0===o&&(o=0),n.call(this,vertex$10,main.replace("${perlin}",perlin)),this.angle=e,this.gain=t,this.lacunarity=i,this.time=o;}n&&(e.__proto__=n),(e.prototype=Object.create(n&&n.prototype)).constructor=e;var t={angle:{configurable:!0},gain:{configurable:!0},lacunarity:{configurable:!0}};return e.prototype.apply=function(n,e,t,i){var o=e.sourceFrame.width,r=e.sourceFrame.height;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=r,this.uniforms.time=this.time,this.uniforms.angleDir[1]=this._angleSin*r/o,n.applyFilter(this,e,t,i);},t.angle.get=function(){return this._angle},t.angle.set=function(n){var e=n*PIXI.DEG_TO_RAD;this._angleCos=Math.cos(e),this._angleSin=Math.sin(e),this.uniforms.angleDir[0]=this._angleCos,this._angle=n;},t.gain.get=function(){return this.uniforms.gain},t.gain.set=function(n){this.uniforms.gain=n;},t.lacunarity.get=function(){return this.uniforms.lacunarity},t.lacunarity.set=function(n){this.uniforms.lacunarity=n;},Object.defineProperties(e.prototype,t),e}(PIXI.Filter);PIXI.filters.GodrayFilter=GodrayFilter;

/*!
 * @pixi/filter-outline - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:29 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$11="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$10="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";
var OutlineFilter=function(e){function o(o,r){void 0===o&&(o=1),void 0===r&&(r=0),e.call(this,vertex$11,fragment$10.replace(/%THICKNESS%/gi,(1/o).toFixed(7))),this.thickness=o,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r;}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var r={color:{configurable:!0},thickness:{configurable:!0}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.outlineColor)},r.color.set=function(e){PIXI.utils.hex2rgb(e,this.uniforms.outlineColor);},r.thickness.get=function(){return this.uniforms.thickness},r.thickness.set=function(e){this.uniforms.thickness=e;},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);PIXI.filters.OutlineFilter=OutlineFilter;

/*!
 * @pixi/filter-multi-color-replace - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:29 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$12="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$11="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n";
var MultiColorReplaceFilter=function(o){function r(r,e,n){void 0===e&&(e=.05),void 0===n&&(n=null),n=n||r.length,o.call(this,vertex$12,fragment$11.replace(/%maxColors%/g,n)),this.epsilon=e,this._maxColors=n,this._replacements=null,this.uniforms.originalColors=new Float32Array(3*n),this.uniforms.targetColors=new Float32Array(3*n),this.replacements=r;}o&&(r.__proto__=o),(r.prototype=Object.create(o&&o.prototype)).constructor=r;var e={replacements:{configurable:!0},maxColors:{configurable:!0},epsilon:{configurable:!0}};return e.replacements.set=function(o){var r=this.uniforms.originalColors,e=this.uniforms.targetColors,n=o.length;if(n>this._maxColors){ throw"Length of replacements ("+n+") exceeds the maximum colors length ("+this._maxColors+")"; }r[3*n]=-1;for(var t=0;t<n;t++){var i=o[t],l=i[0];"number"==typeof l?l=PIXI.utils.hex2rgb(l):i[0]=PIXI.utils.rgb2hex(l),r[3*t]=l[0],r[3*t+1]=l[1],r[3*t+2]=l[2];var a=i[1];"number"==typeof a?a=PIXI.utils.hex2rgb(a):i[1]=PIXI.utils.rgb2hex(a),e[3*t]=a[0],e[3*t+1]=a[1],e[3*t+2]=a[2];}this._replacements=o;},e.replacements.get=function(){return this._replacements},r.prototype.refresh=function(){this.replacements=this._replacements;},e.maxColors.get=function(){return this._maxColors},e.epsilon.set=function(o){this.uniforms.epsilon=o;},e.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);PIXI.filters.MultiColorReplaceFilter=MultiColorReplaceFilter;

/*!
 * @pixi/filter-pixelate - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:29 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$13="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$12="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n";
var PixelateFilter=function(e){function r(r){void 0===r&&(r=10),e.call(this,vertex$13,fragment$12),this.size=r;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var o={size:{configurable:!0}};return o.size.get=function(){return this.uniforms.size},o.size.set=function(e){"number"==typeof e&&(e=[e,e]),this.uniforms.size=e;},Object.defineProperties(r.prototype,o),r}(PIXI.Filter);PIXI.filters.PixelateFilter=PixelateFilter;

/*!
 * @pixi/filter-rgb-split - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:29 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$14="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$13="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n";
var RGBSplitFilter=function(e){function r(r,t,n){void 0===r&&(r=[-10,0]),void 0===t&&(t=[0,10]),void 0===n&&(n=[0,0]),e.call(this,vertex$14,fragment$13),this.red=r,this.green=t,this.blue=n;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var t={red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return t.red.get=function(){return this.uniforms.red},t.red.set=function(e){this.uniforms.red=e;},t.green.get=function(){return this.uniforms.green},t.green.set=function(e){this.uniforms.green=e;},t.blue.get=function(){return this.uniforms.blue},t.blue.set=function(e){this.uniforms.blue=e;},Object.defineProperties(r.prototype,t),r}(PIXI.Filter);PIXI.filters.RGBSplitFilter=RGBSplitFilter;

/*!
 * @pixi/filter-shockwave - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:31 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$15="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$14="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    gl_FragColor.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n}\n";
var ShockwaveFilter=function(e){function t(t,n,r){void 0===t&&(t=[0,0]),void 0===n&&(n={}),void 0===r&&(r=0),e.call(this,vertex$15,fragment$14),this.center=t,Array.isArray(n)&&(console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."),n={}),n=Object.assign({amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1},n),this.amplitude=n.amplitude,this.wavelength=n.wavelength,this.brightness=n.brightness,this.speed=n.speed,this.radius=n.radius,this.time=r;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var n={center:{configurable:!0},amplitude:{configurable:!0},wavelength:{configurable:!0},brightness:{configurable:!0},speed:{configurable:!0},radius:{configurable:!0}};return t.prototype.apply=function(e,t,n){this.uniforms.time=this.time,e.applyFilter(this,t,n);},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e;},n.amplitude.get=function(){return this.uniforms.amplitude},n.amplitude.set=function(e){this.uniforms.amplitude=e;},n.wavelength.get=function(){return this.uniforms.wavelength},n.wavelength.set=function(e){this.uniforms.wavelength=e;},n.brightness.get=function(){return this.uniforms.brightness},n.brightness.set=function(e){this.uniforms.brightness=e;},n.speed.get=function(){return this.uniforms.speed},n.speed.set=function(e){this.uniforms.speed=e;},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e;},Object.defineProperties(t.prototype,n),t}(PIXI.Filter);PIXI.filters.ShockwaveFilter=ShockwaveFilter;

/*!
 * @pixi/filter-simple-lightmap - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:31 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$16="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$15="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n";
var SimpleLightmapFilter=function(e){function t(t,r,o){void 0===r&&(r=0),void 0===o&&(o=1),e.call(this,vertex$16,fragment$15),this.uniforms.ambientColor=new Float32Array([0,0,0,o]),this.texture=t,this.color=r;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={texture:{configurable:!0},color:{configurable:!0},alpha:{configurable:!0}};return t.prototype.apply=function(e,t,r,o){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,e.applyFilter(this,t,r,o);},r.texture.get=function(){return this.uniforms.uLightmap},r.texture.set=function(e){this.uniforms.uLightmap=e;},r.color.set=function(e){var t=this.uniforms.ambientColor;"number"==typeof e?(PIXI.utils.hex2rgb(e,t),this._color=e):(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],this._color=PIXI.utils.rgb2hex(t));},r.color.get=function(){return this._color},r.alpha.get=function(){return this.uniforms.ambientColor[3]},r.alpha.set=function(e){this.uniforms.ambientColor[3]=e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);PIXI.filters.SimpleLightmapFilter=SimpleLightmapFilter;

/*!
 * @pixi/filter-tilt-shift - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:31 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$17="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$16="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n";
var TiltShiftAxisFilter=function(t){function i(i,r,e,n){void 0===i&&(i=100),void 0===r&&(r=600),void 0===e&&(e=null),void 0===n&&(n=null),t.call(this,vertex$17,fragment$16),this.uniforms.blur=i,this.uniforms.gradientBlur=r,this.uniforms.start=e||new PIXI.Point(0,window.innerHeight/2),this.uniforms.end=n||new PIXI.Point(600,window.innerHeight/2),this.uniforms.delta=new PIXI.Point(30,30),this.uniforms.texSize=new PIXI.Point(window.innerWidth,window.innerHeight),this.updateDelta();}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var r={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return i.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0;},r.blur.get=function(){return this.uniforms.blur},r.blur.set=function(t){this.uniforms.blur=t;},r.gradientBlur.get=function(){return this.uniforms.gradientBlur},r.gradientBlur.set=function(t){this.uniforms.gradientBlur=t;},r.start.get=function(){return this.uniforms.start},r.start.set=function(t){this.uniforms.start=t,this.updateDelta();},r.end.get=function(){return this.uniforms.end},r.end.set=function(t){this.uniforms.end=t,this.updateDelta();},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);PIXI.filters.TiltShiftAxisFilter=TiltShiftAxisFilter;var TiltShiftXFilter=function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+i*i);this.uniforms.delta.x=t/r,this.uniforms.delta.y=i/r;},i}(TiltShiftAxisFilter);PIXI.filters.TiltShiftXFilter=TiltShiftXFilter;var TiltShiftYFilter=function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+i*i);this.uniforms.delta.x=-i/r,this.uniforms.delta.y=t/r;},i}(TiltShiftAxisFilter);PIXI.filters.TiltShiftYFilter=TiltShiftYFilter;var TiltShiftFilter=function(t){function i(i,r,e,n){void 0===i&&(i=100),void 0===r&&(r=600),void 0===e&&(e=null),void 0===n&&(n=null),t.call(this),this.tiltShiftXFilter=new TiltShiftXFilter(i,r,e,n),this.tiltShiftYFilter=new TiltShiftYFilter(i,r,e,n);}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var r={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return i.prototype.apply=function(t,i,r){var e=t.getRenderTarget(!0);this.tiltShiftXFilter.apply(t,i,e),this.tiltShiftYFilter.apply(t,e,r),t.returnRenderTarget(e);},r.blur.get=function(){return this.tiltShiftXFilter.blur},r.blur.set=function(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t;},r.gradientBlur.get=function(){return this.tiltShiftXFilter.gradientBlur},r.gradientBlur.set=function(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t;},r.start.get=function(){return this.tiltShiftXFilter.start},r.start.set=function(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t;},r.end.get=function(){return this.tiltShiftXFilter.end},r.end.set=function(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t;},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);PIXI.filters.TiltShiftFilter=TiltShiftFilter;

/*!
 * @pixi/filter-twist - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:31 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$18="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$17="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n";
var TwistFilter=function(o){function n(n,r,t){void 0===n&&(n=200),void 0===r&&(r=4),void 0===t&&(t=20),o.call(this,vertex$18,fragment$17),this.radius=n,this.angle=r,this.padding=t;}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var r={offset:{configurable:!0},radius:{configurable:!0},angle:{configurable:!0}};return r.offset.get=function(){return this.uniforms.offset},r.offset.set=function(o){this.uniforms.offset=o;},r.radius.get=function(){return this.uniforms.radius},r.radius.set=function(o){this.uniforms.radius=o;},r.angle.get=function(){return this.uniforms.angle},r.angle.set=function(o){this.uniforms.angle=o;},Object.defineProperties(n.prototype,r),n}(PIXI.Filter);PIXI.filters.TwistFilter=TwistFilter;

/*!
 * @pixi/filter-zoom-blur - v2.2.0
 * Compiled Tue, 31 Oct 2017 18:02:33 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$19="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$18="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\nfloat random(vec3 scale, float seed) {\n    // use the fragment position for a different seed per-pixel\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    gl_FragColor = color / total;\n\n    // switch back from pre-multiplied alpha\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n\n}\n";
var ZoomBlurFilter=function(n){function t(t,e,r,i){void 0===t&&(t=.1),void 0===e&&(e=[0,0]),void 0===r&&(r=0),void 0===i&&(i=-1),n.call(this,vertex$19,fragment$18),this.center=e,this.strength=t,this.innerRadius=r,this.radius=i;}n&&(t.__proto__=n),(t.prototype=Object.create(n&&n.prototype)).constructor=t;var e={center:{configurable:!0},strength:{configurable:!0},innerRadius:{configurable:!0},radius:{configurable:!0}};return e.center.get=function(){return this.uniforms.uCenter},e.center.set=function(n){this.uniforms.uCenter=n;},e.strength.get=function(){return this.uniforms.uStrength},e.strength.set=function(n){this.uniforms.uStrength=n;},e.innerRadius.get=function(){return this.uniforms.uInnerRadius},e.innerRadius.set=function(n){this.uniforms.uInnerRadius=n;},e.radius.get=function(){return this.uniforms.uRadius},e.radius.set=function(n){(n<0||n===1/0)&&(n=-1),this.uniforms.uRadius=n;},Object.defineProperties(t.prototype,e),t}(PIXI.Filter);PIXI.filters.ZoomBlurFilter=ZoomBlurFilter;




/***/ }),
/* 13 */
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
// HealthBar - simple shape bar that graphically represents health.
//
var PIXI = __webpack_require__(0);
var HealthBar = /** @class */function (_super) {
    __extends(HealthBar, _super);
    function HealthBar(w, h, color) {
        var _this = _super.call(this) || this;
        _this.w = w;
        _this.h = h;
        _this.color = color;
        _this.initGraphics();
        return _this;
    }
    HealthBar.prototype.initGraphics = function () {
        // background shape is a grey rectangle of w/h size
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x777777, 1); // grey
        this.bg.drawRect(0, 0, this.w, this.h);
        this.bg.endFill();
        this.addChild(this.bg); // background added first to sort to rear
        // foreground shape is of desired color
        this.bar = new PIXI.Graphics();
        this.bar.beginFill(this.color, 1); // provided color
        this.bar.drawRect(0, 0, this.w, this.h);
        this.bar.endFill();
        this.addChild(this.bar); // bar added atop background and will adjust in size according to perc set by user
    };
    HealthBar.prototype.setPerc = function (perc) {
        var p;
        // expects 0->1 inclusive
        if (perc < 0) p = 0;else if (perc > 1) p = 1;else p = perc;
        this.bar.clear();
        this.bar.beginFill(this.color, 1); // provided color
        this.bar.drawRect(0, 0, this.w * p, this.h);
        this.bar.endFill();
    };
    return HealthBar;
}(PIXI.Container);
exports.default = HealthBar;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// CannonBall class
// self contained entity to manage the cannon ball and its flight, damage, results etc
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
var Victor = __webpack_require__(5);
var BallType;
(function (BallType) {
    BallType[BallType["CANNISTER"] = 0] = "CANNISTER";
    BallType[BallType["BAR"] = 1] = "BAR";
    BallType[BallType["BALL"] = 2] = "BALL";
})(BallType = exports.BallType || (exports.BallType = {}));
var CannonBall = /** @class */function (_super) {
    __extends(CannonBall, _super);
    function CannonBall() {
        var _this = _super.call(this) || this;
        _this.inUse = false; // if not inuse, fxmanager can recycle
        _this.spent = false; // has this ball flown over its maxDist value
        _this.lastTime = 0; // frame calculation data
        _this.firer = null; // ignore the gameobject that fired it (dont kill yourself :)
        _this.texture = PIXI.Texture.fromFrame("theBall.png");
        _this.v = new Victor(0, 0);
        _this.pos = new Victor(0, 0);
        _this.origin = new Victor(0, 0);
        return _this;
    }
    // allow override for maxdist, this is set by type normally
    // vector givin in pixels/millisecond
    CannonBall.prototype.fire = function (ox, oy, velocity, weight, type, firer, maxDist) {
        this.origin.x = ox;
        this.origin.y = oy;
        this.x = ox;
        this.y = oy;
        this.v.x = velocity.x;
        this.v.y = velocity.y;
        this.weight = weight;
        this.type = type;
        this.spent = false;
        this.firer = firer;
        if (maxDist) this.maxDist = maxDist;else this.maxDist = 350;
    };
    CannonBall.prototype.reset = function () {
        this.spent = false;
        this.inUse = false;
        this.lastTime = 0;
    };
    CannonBall.prototype.update = function () {
        var deltaTime = 0;
        var now = Date.now();
        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
        }
        this.lastTime = now;
        var speed = 300 / 1000;
        this.x += this.v.x * speed * deltaTime;
        this.y += this.v.y * speed * deltaTime;
        this.pos.x = this.x;
        this.pos.y = this.y;
        // if we have travelled our maxDist set the spent signal
        var dist = this.pos.distance(this.origin);
        if (dist > this.maxDist) {
            this.spent = true;
            //console.log("ball dist: " + dist + " pos: " + this.pos.x + "," + this.pos.y);
        }
    };
    return CannonBall;
}(PIXI.Sprite);
exports.default = CannonBall;

/***/ }),
/* 15 */
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
// ui widget that represents ship on the hud
//
var PIXI = __webpack_require__(0);
var healthbar_1 = __webpack_require__(13);
var NatFlag;
(function (NatFlag) {
    NatFlag[NatFlag["ENGLISH"] = 0] = "ENGLISH";
    NatFlag[NatFlag["FRENCH"] = 1] = "FRENCH";
    NatFlag[NatFlag["SPANISH"] = 2] = "SPANISH";
    NatFlag[NatFlag["DUTCH"] = 3] = "DUTCH";
    NatFlag[NatFlag["PIRATE"] = 4] = "PIRATE";
})(NatFlag = exports.NatFlag || (exports.NatFlag = {}));
var ShipWidget = /** @class */function (_super) {
    __extends(ShipWidget, _super);
    function ShipWidget() {
        var _this = _super.call(this) || this;
        _this.selected = false;
        _this.alphaRedux = 0;
        _this.trackShip = null;
        return _this;
    }
    ShipWidget.prototype.init = function () {
        this.shipWheel = new PIXI.Sprite(PIXI.Texture.fromFrame("shipFrameUI.png"));
        this.shipWheel.x = 99 - this.shipWheel.width / 2; // position from center
        this.shipWheel.y = 63 - this.shipWheel.height / 2;
        this.sailHealth = new healthbar_1.default(50, 4, 0x0000FF);
        this.sailHealth.x = 0;
        this.sailHealth.y = 61;
        this.crewHealth = new healthbar_1.default(50, 4, 0x00FF00);
        this.crewHealth.x = 0;
        this.crewHealth.y = 72;
        this.hullHealth = new healthbar_1.default(50, 4, 0xFF0000);
        this.hullHealth.x = 0;
        this.hullHealth.y = 83;
        this.selectUI = new PIXI.Sprite(PIXI.Texture.fromFrame("selectShipUI.png"));
        this.selectUI.anchor.x = this.selectUI.anchor.y = 0.5;
        this.selectUI.x = this.shipWheel.x + this.shipWheel.width / 2;
        this.selectUI.y = this.shipWheel.y + this.shipWheel.height / 2;
        this.selectUI.visible = false;
        this.flag = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagEnglish.png"));
        this.flag.width = 28;
        this.flag.height = 18;
        this.flag.x = this.sailHealth.x + this.sailHealth.width - this.flag.width;
        this.flag.y = this.sailHealth.y - this.flag.height - 2;
        this.addChild(this.shipWheel);
        this.addChild(this.selectUI);
        this.addChild(this.sailHealth);
        this.addChild(this.crewHealth);
        this.addChild(this.hullHealth);
        this.addChild(this.flag);
    };
    ShipWidget.prototype.setShip = function (newShip) {
        this.trackShip = newShip;
        var perc = newShip.getHull() / newShip.getHullMax();
        this.hullHealth.setPerc(perc);
        var fnum = newShip.getNatFlag();
        if (fnum == NatFlag.ENGLISH) {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagEnglish.png");
        } else if (fnum == NatFlag.FRENCH) {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagFrench.png");
        } else if (fnum == NatFlag.SPANISH) {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagSpanish.png");
        } else if (fnum == NatFlag.DUTCH) {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagDutch.png");
        } else {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagPirate.png");
        }
    };
    ShipWidget.prototype.select = function (selected, fadeTime) {
        if (selected === void 0) {
            selected = true;
        }
        if (selected) {
            this.selected = true;
            this.selectUI.visible = true;
            this.selectUI.alpha = 1.0;
            if (fadeTime != 0) {
                // fade out over fadeTime then become unselected
                this.alphaRedux = 1 / (fadeTime / 1000 * 60);
            }
        }
    };
    ShipWidget.prototype.isSelected = function () {
        return this.selected;
    };
    ShipWidget.prototype.update = function () {
        // animate the rotation of the select widget if enabled
        if (this.selected) {
            this.selectUI.rotation -= 0.075;
            this.selectUI.alpha -= this.alphaRedux;
            if (this.selectUI.alpha <= 0) {
                this.selected = false;
                this.selectUI.visible = false;
            }
        }
        if (this.trackShip != null) {
            // adjust our health bars as needed
            var perc = this.trackShip.getHull() / this.trackShip.getHullMax();
            this.hullHealth.setPerc(perc);
        }
    };
    return ShipWidget;
}(PIXI.Container);
exports.default = ShipWidget;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// class for selection widget... red crosshair or green sharkfin circle
// sprite sheet animation for iso look/feel since pixi doesnt support 3d transform yet
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
var ship_1 = __webpack_require__(10);
var SelectType;
(function (SelectType) {
    SelectType[SelectType["ENEMY"] = 0] = "ENEMY";
    SelectType[SelectType["FRIENDLY"] = 1] = "FRIENDLY";
})(SelectType = exports.SelectType || (exports.SelectType = {}));
var SelectWidget = /** @class */function (_super) {
    __extends(SelectWidget, _super);
    function SelectWidget(type) {
        var _this = _super.call(this) || this;
        _this.lastTime = 0;
        _this.friendlyArray = []; // array of textures for the splash fx
        _this.enemyArray = []; // array of textures for the splash fx
        _this.type = type;
        var i, s;
        if (type == SelectType.FRIENDLY) {
            for (i = 1; i < 60; i++) {
                s = "selectShip" + ship_1.default.zeroPad(i, 4) + ".png";
                _this.friendlyArray.push(PIXI.Texture.fromFrame(s));
            }
            _this.friendly = new PIXI.extras.AnimatedSprite(_this.friendlyArray);
            _this.friendly.anchor.x = 0.5;
            _this.friendly.anchor.y = 0.5; // center anchor
            _this.friendly.loop = true;
            _this.friendly.scale.x = _this.friendly.scale.y = 0.8;
            _this.addChild(_this.friendly); // at default 0,0 which will anchor centered
        } else {
            for (i = 1; i < 60; i++) {
                s = "selected" + ship_1.default.zeroPad(i, 4) + ".png";
                _this.enemyArray.push(PIXI.Texture.fromFrame(s));
            }
            _this.enemy = new PIXI.extras.AnimatedSprite(_this.enemyArray);
            _this.enemy.anchor.x = 0.5;
            _this.enemy.anchor.y = 0.5; // center anchor
            _this.enemy.loop = true;
            _this.enemy.animationSpeed = 0.33;
            _this.enemy.scale.x = _this.enemy.scale.y = 0.8;
            _this.addChild(_this.enemy); // at default 0,0 which will anchor centered
        }
        return _this;
    }
    SelectWidget.prototype.play = function () {
        if (this.type == SelectType.ENEMY) this.enemy.gotoAndPlay(0);else this.friendly.gotoAndPlay(0);
    };
    SelectWidget.prototype.stop = function () {
        if (this.type == SelectType.ENEMY) this.enemy.stop();else this.friendly.stop();
    };
    SelectWidget.prototype.update = function () {
        var deltaTime = 0;
        var now = Date.now();
        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
            // rotate
            //this.rotation += 0.1;
        }
        // record lastTime
        this.lastTime = now;
    };
    return SelectWidget;
}(PIXI.Container);
exports.default = SelectWidget;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __webpack_require__(0);
var theSea_1 = __webpack_require__(6);
var mainhud_1 = __webpack_require__(21);
var popupmanager_1 = __webpack_require__(34);
var singleton_1 = __webpack_require__(1);
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
            _this._hud.update();
            _this._renderer.render(_this._world);
            requestAnimationFrame(_this.update);
        };
        this._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { backgroundColor: 0x7BA4DF });
        this._world = new PIXI.Container();
        document.body.appendChild(this._renderer.view);
        // create a new sea object
        this._sea = new theSea_1.default();
        this._sea.init(this.seaLoadedCallback);
        // create the main hud
        this._hud = new mainhud_1.default();
        this._hud.addLoaderAssets();
        this._hud.setTheSea(this._sea);
        // create popupmanager
        this._popupManager = new popupmanager_1.default();
        this._popupManager.setContainer(this._hud.getContainer());
        this._hud.setPopupManager(this._popupManager);
        singleton_1.default.popupManager = this._popupManager;
        // load all the assets requested by theSea and Hud
        PIXI.loader.load(this.onLoaded);
        console.log("PotTW: build 0.0.15");
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
            this._hud.setSeaUILayer(this._sea.getUILayer());
            this.update();
        }
    };
    return Core;
}();
exports.default = Core;
var game = new Core();

/***/ }),
/* 18 */
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
var gameobject_1 = __webpack_require__(4);
var gameobject_2 = __webpack_require__(4);
var Victor = __webpack_require__(5);
var singleton_1 = __webpack_require__(1);
var Island = /** @class */function (_super) {
    __extends(Island, _super);
    function Island() {
        var _this = _super.call(this) || this;
        _this._isPort = false;
        _this.over = false;
        _this.overIsle = function (e) {
            // mouse over our isle has happened, trigger event with our coords
            if (!_this.over) {
                _this.over = true;
                if (!singleton_1.default.uiDisplayed) {
                    var refX = _this.sprite.x + _this.islandData.refPt[0];
                    var refY = _this.sprite.y + _this.islandData.refPt[1];
                    var obj = { x: refX, y: refY,
                        isleName: _this.islandData.portName,
                        portFlag: _this.islandData.portFlag,
                        natFlag: _this.islandData.natFlag };
                    var myEvent = new CustomEvent("mouseOverIsle", {
                        'detail': obj
                    });
                    window.dispatchEvent(myEvent);
                }
            }
        };
        _this.outIsle = function (e) {
            // mouse left our isle, trigger event with our coords
            if (_this.over) {
                _this.over = false;
                if (!singleton_1.default.uiDisplayed) {
                    var myEvent = new CustomEvent("mouseOutIsle", {
                        'detail': _this.islandData.portName
                    });
                    window.dispatchEvent(myEvent);
                }
            }
        };
        _this.objType = gameobject_2.ObjectType.ISLAND;
        return _this;
    }
    Island.prototype.setData = function (data) {
        this.islandData = data;
        if (this.islandData.hasOwnProperty("port") && this.islandData.port == true) {
            this._isPort = true;
            //console.log("Found port: " + this.islandData.portName);
            // make the sprite interactive so mouseover will work for it
            this.sprite.interactive = true;
            this.sprite.on('mouseover', this.overIsle);
            this.sprite.on('mouseout', this.outIsle);
        }
        // set the pivot point from the data
        // this.sprite.pivot.x = this.islandData.refPt[0];
        // this.sprite.pivot.x = this.islandData.refPt[1];
    };
    Island.prototype.isPort = function () {
        return this._isPort;
    };
    Island.prototype.getPortDest = function () {
        var x = this.sprite.x + this.islandData.portRef[0];
        var y = this.sprite.y + this.islandData.portRef[1];
        return new PIXI.Point(x, y);
    };
    Island.prototype.getPortDestVictor = function () {
        var x = this.sprite.x + this.islandData.portRef[0];
        var y = this.sprite.y + this.islandData.portRef[1];
        return new Victor(x, y);
    };
    Island.prototype.getName = function () {
        return this.islandData.portName;
    };
    return Island;
}(gameobject_1.default);
exports.default = Island;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// player object.. stores all information on the player
// 

Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */function () {
    function Player() {
        this.gold = 0; // premium currency
        this.silver = 0; // basic in-game currency
        this._lastReload = 0; // UTC timestamp of last reload time
        this._reloadTime = 30000; // player can reload every reloadTime milliseconds
        this._numReloads = 0; // number of times the user has reloaded
        this.accessToken = ""; // FB access token to perform FB social calls with
        this._FBUserID = ""; // FB user id to use to query data
    }
    Player.prototype.getGold = function () {
        return this.gold;
    };
    Player.prototype.getSilver = function () {
        return this.silver;
    };
    Player.prototype.incGold = function (amount) {
        this.gold += amount;
    };
    Player.prototype.decGold = function (amount) {
        this.gold -= amount;
    };
    Player.prototype.incSilver = function (amount) {
        this.silver += amount;
    };
    Player.prototype.decSilver = function (amount) {
        this.silver -= amount;
    };
    Object.defineProperty(Player.prototype, "lastReload", {
        get: function () {
            return this._lastReload;
        },
        set: function (loadtime) {
            this._lastReload = loadtime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "reloadTime", {
        get: function () {
            return this._reloadTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "numReloads", {
        get: function () {
            return this._numReloads;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.incReloads = function () {
        this._numReloads++;
    };
    Object.defineProperty(Player.prototype, "FBAccessToken", {
        get: function () {
            return this.accessToken;
        },
        set: function (token) {
            this.accessToken = token;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "FBUserID", {
        get: function () {
            return this._FBUserID;
        },
        set: function (userID) {
            this._FBUserID = userID;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.getExportObject = function () {
        return {
            gold: this.gold,
            silver: this.silver,
            lastReload: this._lastReload,
            numReload: this._numReloads
        };
    };
    Player.prototype.hydrateFromObj = function (obj) {
        this.gold = obj.gold;
        this.silver = obj.silver;
        this._lastReload = obj.lastReload;
        this._numReloads = obj.numReload;
    };
    return Player;
}();
exports.default = Player;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
//
// FXManager class to manage cannon balls, miss plumes, explosions, smoke fx on the sea
//
var PIXI = __webpack_require__(0);
var cannonball_1 = __webpack_require__(14);
var gameobject_1 = __webpack_require__(4);
var ship_1 = __webpack_require__(10);
var theSea_1 = __webpack_require__(6);
var Victor = __webpack_require__(5);
var FXManager = /** @class */function () {
    function FXManager() {
        this.ballList = []; // the pool of cannon balls
        this.lastBall = 0; // last ball we handed out - this will also index into the splash/explosion/smoke arrays
        this.splashList = [];
        this.explosionList = [];
        this.muzzlePlumeList = [];
        this.smokingPlumeList = [];
        this.smokeInUse = [];
        this.nextSmoke = 0; // smoke doesnt need 100, likely only 20 or so.. one per ship so needs its own pool tracking number
        this.splash = []; // array of textures for the splash fx
        this.explosion = []; // array for explosion textures
        this.muzzlePlume = []; // smoke from cannon fire
        this.smokingPlume = []; // ship wreck smoke
        this.target = [];
    }
    // request the assets we need loaded
    FXManager.prototype.addLoaderAssets = function () {
        PIXI.loader.add("./images/fx/shipfx.json").add("./images/ui/selection.json");
    };
    // assets are loaded, initialize sprites etc
    FXManager.prototype.onAssetsLoaded = function () {
        this.initBalls();
        this.initAnimations();
    };
    FXManager.prototype.initAnimations = function () {
        var i;
        var s;
        for (i = 1; i < 25; i++) {
            s = "spout" + ship_1.default.zeroPad(i, 4) + ".png";
            this.splash.push(PIXI.Texture.fromFrame(s));
        }
        this.initSplashPool();
        for (i = 1; i < 68; i++) {
            s = "fiery_explosion" + ship_1.default.zeroPad(i, 4) + ".png";
            this.explosion.push(PIXI.Texture.fromFrame(s));
        }
        this.initExplosionPool();
        for (i = 1; i < 121; i++) {
            s = "smoke_cloud" + ship_1.default.zeroPad(i, 4) + ".png";
            this.muzzlePlume.push(PIXI.Texture.fromFrame(s));
        }
        this.initMuzzlePool();
        for (i = 1; i < 43; i++) {
            s = "ship_destruction_animation" + ship_1.default.zeroPad(i, 4) + ".png";
            this.smokingPlume.push(PIXI.Texture.fromFrame(s));
        }
        this.initSmokePool();
        for (i = 1; i < 61; i++) {
            s = "selected" + ship_1.default.zeroPad(i, 4) + ".png";
            this.target.push(PIXI.Texture.fromFrame(s));
        }
    };
    FXManager.prototype.initSplashPool = function () {
        var i;
        var anim;
        for (i = 0; i < 100; i++) {
            anim = new PIXI.extras.AnimatedSprite(this.splash);
            anim.anchor.x = 0.5;
            anim.anchor.y = 1; // anchor/origin is the middle bottom of the sprite
            anim.loop = false;
            this.splashList.push(anim);
        }
    };
    FXManager.prototype.initExplosionPool = function () {
        var i;
        var anim;
        for (i = 0; i < 100; i++) {
            anim = new PIXI.extras.AnimatedSprite(this.explosion);
            anim.anchor.x = 0.54;
            anim.anchor.y = 0.68; // anchor/origin is at 27,42 on a frame 50,62
            anim.loop = false;
            this.explosionList.push(anim);
        }
    };
    FXManager.prototype.initMuzzlePool = function () {
        var i;
        var anim;
        for (i = 0; i < 100; i++) {
            anim = new PIXI.extras.AnimatedSprite(this.muzzlePlume);
            anim.anchor.x = 1;
            anim.anchor.y = 0.5; // anchor/origin center right (anim goes left)
            anim.loop = false;
            this.muzzlePlumeList.push(anim);
        }
    };
    FXManager.prototype.initSmokePool = function () {
        var i;
        var anim;
        for (i = 0; i < 22; i++) {
            anim = new PIXI.extras.AnimatedSprite(this.smokingPlume);
            anim.anchor.x = 0.8;
            anim.anchor.y = 1; // anchor/origin is 80% right and and at bottom
            anim.loop = false;
            anim.animationSpeed = 0.50;
            anim.alpha = 0.67;
            this.smokingPlumeList.push(anim);
            this.smokeInUse[i] = false; // mark all available
        }
    };
    FXManager.prototype.setIslesShips = function (isles, ships) {
        this.isles = isles;
        this.ships = ships;
    };
    FXManager.prototype.setFXContainer = function (container) {
        this.container = container;
    };
    FXManager.prototype.initBalls = function () {
        for (var i = 0; i < 100; i++) {
            this.ballList.push(new cannonball_1.default());
        }
    };
    // returns index of smoke plum used, when caller is removed/destroyed this index should be returned to pool
    FXManager.prototype.placeSmokePlume = function (x, y) {
        var _this = this;
        // use nextSmoke then increment index
        this.smokingPlumeList[this.nextSmoke].x = x;
        this.smokingPlumeList[this.nextSmoke].y = y;
        // play from beginning, on anim end it will loop from an interior frame
        this.smokingPlumeList[this.nextSmoke].gotoAndPlay(0);
        var smokeID = this.nextSmoke;
        this.container.addChild(this.smokingPlumeList[this.nextSmoke]);
        // loop not from the beginning but from frame#21
        this.smokingPlumeList[this.nextSmoke].onComplete = function () {
            _this.smokingPlumeList[smokeID].gotoAndPlay(21);
        };
        this.smokeInUse[this.nextSmoke] = true;
        var retVal = this.nextSmoke;
        this.findNextSmoke();
        return retVal; // return the index to caller so that it can be returned to pool later
    };
    // set next smoke to next available index in pool
    FXManager.prototype.findNextSmoke = function () {
        var count = this.smokingPlumeList.length;
        var i = this.nextSmoke;
        var found = false;
        var t = 0;
        while (!found) {
            i++;
            t++;
            if (t >= count) {
                console.log("smoke pool exhausted, none available");
                break; // none available!
            }
            // wrap around
            if (i > count) i = 0;
            if (this.smokeInUse[i] == false) {
                this.nextSmoke = i;
                found = true;
            }
        }
    };
    FXManager.prototype.returnSmokeToPool = function (index) {
        // index given to ship will be sent backl to us when ship is looted or disappears
        this.smokingPlumeList[index].stop();
        this.container.removeChild(this.smokingPlumeList[index]);
        this.smokeInUse[index] = false;
    };
    FXManager.prototype.placeMuzzlePlume = function (x, y, dir) {
        var _this = this;
        // place a plume with given position and direction (v is normalized)
        // assume last ball so use lastBall as index to use
        this.muzzlePlumeList[this.lastBall].x = x;
        this.muzzlePlumeList[this.lastBall].y = y;
        // rotate the plume into the direction of the shot, plume is in negative x axis (faces left)
        var plumeDir = new Victor(dir.x, dir.y);
        //plumeDir.rotate(-Math.PI/2); // simply rotate the given direction 180 
        this.muzzlePlumeList[this.lastBall].rotation = plumeDir.angle() + Math.PI;
        this.muzzlePlumeList[this.lastBall].gotoAndPlay(0);
        this.container.addChild(this.muzzlePlumeList[this.lastBall]);
        var ball = this.lastBall;
        this.muzzlePlumeList[this.lastBall].onComplete = function () {
            _this.container.removeChild(_this.muzzlePlumeList[ball]);_this.muzzlePlumeList[ball].gotoAndStop(0); /*console.log("Removing muzzlePlume: " + ball );*/
        };
    };
    // get cannonball from pool, returns null if all in use (!)
    FXManager.prototype.getCannonBall = function () {
        var ball;
        var count = 0;
        var found = false;
        while (!found) {
            this.lastBall++;
            count++;
            if (count > this.ballList.length) {
                console.log("no cannonBalls available in pool");
                return null; // all cannonballs are out! take cover!
            }
            if (this.lastBall >= this.ballList.length) this.lastBall = 0; // wrap around to head of list
            if (!this.ballList[this.lastBall].inUse) {
                this.ballList[this.lastBall].inUse = true;
                found = true;
                //console.log("ballList: assigning ball: " + this.lastBall);
            }
        }
        var numChildren = this.container.children.length;
        this.container.addChild(this.ballList[this.lastBall]);
        return this.ballList[this.lastBall];
    };
    // determine if this cannonBall has struck any isle or ship
    FXManager.prototype.hit = function (ball) {
        var hitObj = null;
        var i = 0;
        var x, y;
        // collision code here
        // islands first
        for (var _i = 0, _a = this.isles; _i < _a.length; _i++) {
            var entry = _a[_i];
            // first do rectangular hit test
            if (theSea_1.default.boxHitTest(entry.getSprite(), ball)) {
                //console.log("ball inside island rect! checking PolyK");
                // sprites overlap, now do a PolyK contains point
                x = ball.x;
                y = 8192 - ball.y; // convert to cartesian
                if (PolyK.ContainsPoint(entry.getCartPolyData(), x, y)) {
                    //console.log("hit " + entry.getSprite().name + "!");
                    hitObj = entry;
                    break; // short circuit the loop
                }
            }
        }
        // now check boats
        for (var _b = 0, _c = this.ships; _b < _c.length; _b++) {
            var entry = _c[_b];
            // ignore the firer of this ball
            if (ball.firer == entry) continue;
            // first do rectangular hit test
            if (theSea_1.default.boxHitTest(entry.getSprite(), ball)) {
                // sprites overlap, now do a PolyK contains point
                x = ball.x;
                y = 8192 - ball.y;
                if (entry.hitTestByPoint(x, y)) {
                    hitObj = entry;
                    break; // short circuit the loop
                }
            }
        }
        return hitObj;
    };
    FXManager.prototype.placeTarget = function (ship) {
        var targ = new PIXI.extras.AnimatedSprite(this.target);
        targ.anchor.x = 0.5;
        targ.anchor.y = 0.5;
        var ref = ship.getRefPt();
        targ.x = ship.getSprite().x + ref.x;
        targ.y = ship.getSprite().y + ref.y;
        this.container.addChild(targ);
        targ.loop = true;
        targ.play();
    };
    FXManager.prototype.update = function () {
        var _this = this;
        var hit = false;
        var hitObj;
        var i = 0;
        var _loop_1 = function () {
            if (this_1.ballList[i].inUse) {
                //console.log("updating ball: " + i);
                this_1.ballList[i].update();
                var ball_1 = 0;
                // check spent
                if (this_1.ballList[i].spent) {
                    // put miss FX at its spot and remove it from contention
                    this_1.splashList[i].x = this_1.ballList[i].x;
                    this_1.splashList[i].y = this_1.ballList[i].y;
                    this_1.container.addChild(this_1.splashList[i]);
                    this_1.splashList[i].play(); // start the animation
                    ball_1 = i;
                    this_1.splashList[i].onComplete = function () {
                        _this.container.removeChild(_this.splashList[ball_1]);_this.splashList[ball_1].gotoAndStop(0); /*console.log("Removing splash: " + ball );*/
                    };
                    this_1.ballList[i].reset();
                    this_1.container.removeChild(this_1.ballList[i]);
                    return "continue";
                }
                // collide with islands and ships code here
                hitObj = this_1.hit(this_1.ballList[i]);
                if (hitObj) {
                    // play hit animation
                    this_1.explosionList[i].x = this_1.ballList[i].x;
                    this_1.explosionList[i].y = this_1.ballList[i].y;
                    this_1.container.addChild(this_1.explosionList[i]);
                    this_1.explosionList[i].play(); // start the animation
                    ball_1 = i;
                    this_1.explosionList[i].onComplete = function () {
                        _this.container.removeChild(_this.explosionList[ball_1]);_this.explosionList[ball_1].gotoAndStop(0); /*console.log("Removing explosion: " + ball );*/
                    };
                    this_1.ballList[i].reset(); // return ball to pool
                    this_1.container.removeChild(this_1.ballList[i]);
                    // send the damage to the target if its a ship
                    if (hitObj.getType() == gameobject_1.ObjectType.SHIP) {
                        hitObj.receiveFire(this_1.ballList[i].weight, this_1.ballList[i].firer);
                    }
                }
            }
        };
        var this_1 = this;
        for (i = 0; i < this.ballList.length; i++) {
            _loop_1();
        }
    };
    return FXManager;
}();
exports.default = FXManager;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// the main HUD, overlays theSea
//

Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __webpack_require__(0);
var sailtrim_1 = __webpack_require__(22);
var compassrose_1 = __webpack_require__(11);
var watch_1 = __webpack_require__(23);
var economyicon_1 = __webpack_require__(9);
var shipwidget_1 = __webpack_require__(15);
var popshipdetail_1 = __webpack_require__(24);
var button_1 = __webpack_require__(2);
var poptowninterface_1 = __webpack_require__(25);
var economyitem_1 = __webpack_require__(7);
var singleton_1 = __webpack_require__(1);
var bannertooltip_1 = __webpack_require__(33);
var MainHUD = /** @class */function () {
    function MainHUD() {
        var _this = this;
        this.container = new PIXI.Container();
        this.didGrounding = false;
        this.lootAvail = [];
        this.silverCoins = [];
        this.goldCoins = [];
        this.coinNum = 0;
        this.streamCoinEffect = false;
        this.streamGold = false;
        this.coinInc = 1;
        this.lastCoinTime = 0;
        this.coinCount = 0;
        this.coinMax = 0;
        this.coinDelta = 100; // every 100ms by default
        this.coinPos = new PIXI.Point(0, 0);
        this.economyLoaded = false;
        this.onEconomyLoaded = function (responseText) {
            var json_data = JSON.parse(responseText);
            //console.log(json_data);
            _this.economyLoaded = true;
            // save the data to the economyicon static
            economyitem_1.default.setEconomyData(json_data);
        };
        this.doShipDetail = function () {
            if (_this.shipWidget.isSelected()) {
                console.log("doShipDetail");
                // display the ship detail popup
                var pop = new popshipdetail_1.default(_this.trackShip);
                _this.popupManager.displayPopup(pop);
            } else {
                _this.shipWidget.select(true, 3000);
                // center on player ship and make widget selected
                _this.centerOnPlayer();
                _this.sea.selectPlayer();
                // start timer to remove it after 3 seconds
                setTimeout(_this.deselect, 3000);
            }
        };
        this.clearTarget = function () {
            _this.container.removeChild(_this.targetWidget);
        };
        this.deselect = function () {
            _this.sea.deselectPlayer();
        };
        this.doTownInterface = function () {
            console.log("doTownInterface");
            //display the town interface popup
            var pop = new poptowninterface_1.default();
            pop.setPopupManager(_this.popupManager);
            _this.popupManager.displayPopup(pop);
        };
        this.fireRight = function (event) {
            var time;
            time = _this.trackShip.fireCannons(true);
            if (time != 0) {
                // display starboard reload timer
                _this.starWatch.visible = true;
                _this.starWatch.countDown(time);
                _this.starWatch.start(_this.onRightReloadDone);
            }
        };
        this.onRightReloadDone = function () {
            _this.starWatch.visible = false;
        };
        this.fireLeft = function (event) {
            var time;
            time = _this.trackShip.fireCannons(false);
            if (time != 0) {
                // display starboard reload timer
                _this.portWatch.visible = true;
                _this.portWatch.countDown(time);
                _this.portWatch.start(_this.onLeftReloadDone);
            }
        };
        this.onLeftReloadDone = function () {
            _this.portWatch.visible = false;
        };
        this.changeHeadingHandler = function (event) {
            //console.log("changeHeadingHandler received!");
            // ask the boat to change to new heading, it will return how much time this take
            var newHeading = event.detail;
            var headingTime = _this.trackShip.changeHeading(newHeading);
            // display a watch over the compass set to countdown by this time (milliseconds)
            _this.headingWatch.visible = true;
            _this.headingWatch.countDown(headingTime);
            _this.headingWatch.start(_this.onCountDone);
        };
        this.onCountDone = function () {
            _this.headingWatch.visible = false;
            //console.log("onCountDone!");
        };
        this.playerWrecked = function (event) {
            console.log("Player Wrecked, strating recovery");
            // start the player recovery process
            _this.playerRecovery();
        };
        this.boatSelectedHandler = function (event) {
            // event.detail the reference to the tracked ship
            var newShip = event.detail;
            _this.compassRose.trackShip(newShip);
            _this.trackShip = newShip;
            var s = singleton_1.default.getInstance();
            s.SetShip(_this.trackShip);
            _this.shipWidget.setShip(_this.trackShip);
        };
        this.buyGold = function (e) {
            var amount = e.detail.amount; // detail contains just the coint count
            var x = e.detail.x;
            var y = e.detail.y;
            var inc = e.detail.inc;
            var refPt = new PIXI.Point(x, y); // message has sent up global pos x,y
            var locPos = _this.container.toLocal(refPt);
            _this.streamCoins(amount, locPos.x, locPos.y, true, inc);
        };
        this.merchSell = function (e) {
            var amount = e.detail.amount; // detail contains just the coint count
            var x = e.detail.x;
            var y = e.detail.y;
            var refPt = new PIXI.Point(x, y); // message has sent up global pos x,y
            var locPos = _this.container.toLocal(refPt);
            _this.streamCoins(amount, locPos.x, locPos.y);
        };
        this.aiShipMouseDown = function (e) {
            // mouse down on non-wrecked ai boat... display target widget
            var boat = e.detail;
            _this.container.addChild(_this.targetWidget);
            _this.targetWidget.setShip(boat);
        };
        this.lootMouseDown = function (e) {
            // mouse down on a wreck icon, show the loot watch and popout a loot icon one per second
            var boat = e.detail.boat;
            var loots = e.detail.holdLength;
            console.log("Clicked wreck to get: " + boat.aiNumHoldItems() + " items");
            if (boat.aiNumHoldItems() == 0) {
                // stream some coins to the HUD when out of loot items
                var x, y;
                x = boat.getSprite().x + boat.getRefPt().x;
                y = boat.getSprite().y + boat.getRefPt().y;
                var refPt = new PIXI.Point(x, y);
                var pos = boat.getSprite().toGlobal(refPt);
                var locPos = _this.container.toLocal(boat.getSprite().getGlobalPosition());
                var coins = boat.getCoins();
                _this.streamCoins(coins, locPos.x, locPos.y);
                boat.sink();
                return; // dont pop any more
            }
            var item = boat.aiPopNextLoot();
            if (item == null) {
                console.log("Error: aiPopNextLoot returned no value");
                return;
            }
            var s = boat.getSprite();
            // rand loot
            var icon = new economyicon_1.default(item.type, _this.lootAvail.length, true, item.rarity);
            var ref = boat.getRefPt();
            icon.x = s.x + ref.x;
            icon.y = s.y + ref.y;
            icon.throwOutAndBob();
            _this.uiLayer.addChild(icon);
            _this.lootAvail.push(icon);
        };
        this.collectLoot = function (e) {
            // mouse up over wreck, stop the loot action (even if not done)
            //console.log("collect loot!");
            // get the icon from the details
            if (_this.trackShip.isHoldFull()) {
                // display first mate error message
                console.log("Captain! Our hold is full! We cant store any more!");
            } else {
                var id = e.detail;
                var targx = _this.trackShip.getSprite().x + _this.trackShip.getRefPt().x;
                var targy = _this.trackShip.getSprite().y + _this.trackShip.getRefPt().y;
                _this.lootAvail[id].lootIcon(targx, targy);
            }
        };
        this.lootDone = function (e) {
            var id = e.detail;
            // give loot to the player's boat if possible
            // remove this id
            _this.uiLayer.removeChild(_this.lootAvail[id]);
            if (!_this.trackShip.addToHold(_this.lootAvail[id].getType())) {
                // we already checked above, not sure how it could get full between calls
                console.log("addToHold failed post-check");
            }
        };
        this.mouseOverIsle = function (e) {
            var isleInfo = e.detail;
            var seaPos = new PIXI.Point(isleInfo.x, isleInfo.y);
            var globalSeaPos = _this.sea.getContainer().toGlobal(seaPos);
            var localSeaPos = _this.container.toLocal(globalSeaPos);
            var scale = _this.sea.getWheelScale();
            if (scale < 0.5) scale = 0.75;else scale = 1;
            _this.bannerToolTip.scale.x = _this.bannerToolTip.scale.y = scale;
            _this.bannerToolTip.x = localSeaPos.x;
            _this.bannerToolTip.y = localSeaPos.y;
            _this.bannerToolTip.changeLabel(isleInfo.isleName);
            _this.bannerToolTip.changePortFlag(isleInfo.portFlag);
            _this.bannerToolTip.changeNatFlag(isleInfo.natFlag);
            _this.container.addChild(_this.bannerToolTip);
        };
        this.mouseOutIsle = function (e) {
            var isleName = e.detail;
            _this.container.removeChild(_this.bannerToolTip);
        };
        this.fadeOut = function () {
            _this.fade2Black.alpha += 0.02;
            if (_this.fade2Black.alpha >= 1.0) {
                // move player ship to port
                // remove its wrecked status
                // empty hold
                // tell the sea to focus on the player ship
                // fade back up
                // for now end interval
                clearInterval(_this.timerID);
                _this.timerID = setInterval(_this.fadeIn, 100);
                singleton_1.default.ship.unWreck();
                _this.sea.clearPlayerTarget();
                _this.centerOnPlayer();
            }
        };
        this.fadeIn = function () {
            _this.fade2Black.alpha -= 0.05;
            if (_this.fade2Black.alpha <= 0) {
                clearInterval(_this.timerID);
                _this.container.parent.removeChild(_this.fade2Black);
            }
        };
        this.fbStatusResponse = function (response) {
            console.log("response FB.getLoginStatus:");
            console.log(response);
            if (response.status = "connected") {
                // save access token and userid
                singleton_1.default.player.FBUserID = response.userID;
                singleton_1.default.player.FBAccessToken = response.accessToken;
                _this.doMe();
            } else {
                console.log("Error in fbStatusRespone!");
            }
        };
    }
    // request the assets we need loaded
    MainHUD.prototype.addLoaderAssets = function () {
        PIXI.loader.add("./images/ui/pottw5ui.json").add("images/2yYayZk.png").add("images/F8HIZMZFF22CHDE.MEDIUM.jpg").add("./images/ui/economy_icons.json").add("./images/ui/pottwcharacters.json");
        this.loadJSON("./data/economydata.json", this.onEconomyLoaded);
    };
    // assets are loaded, initialize sprites etc
    MainHUD.prototype.onAssetsLoaded = function () {
        // create 100 coin sprites for loot effect
        var i;
        for (i = 0; i < 50; i++) {
            this.silverCoins[i] = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
            this.silverCoins[i].anchor.x = this.silverCoins[i].anchor.y = 0.5;
        }
        // create 100 coin sprites for loot effect
        for (i = 0; i < 50; i++) {
            this.goldCoins[i] = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
            this.goldCoins[i].anchor.x = this.goldCoins[i].anchor.y = 0.5;
        }
        // create and place the header
        this.header = new PIXI.Sprite(PIXI.Texture.fromFrame("UI_Header.png"));
        this.header.x = 0;
        this.header.y = 0;
        // create and place the footer
        this.footer = new PIXI.Sprite(PIXI.Texture.fromFrame("UIFooter.png"));
        this.footer.x = 0;
        this.footer.y = window.innerHeight - this.footer.height;
        this.rightCannonBattery = new PIXI.Sprite(PIXI.Texture.fromFrame("CannonArray.png"));
        this.rightCannonBattery.x = this.footer.width - this.rightCannonBattery.width + 40;
        this.rightCannonBattery.y = this.footer.y;
        this.rightCannonBattery.interactive = true;
        this.rightCannonBattery.on("click", this.fireRight);
        // sail trim nbext to guns
        this._sailTrim = new sailtrim_1.default();
        this._sailTrim.init();
        this._sailTrim.scale.x = this._sailTrim.scale.y = 0.67;
        this._sailTrim.x = this.rightCannonBattery.x - this._sailTrim.width + 20;
        this._sailTrim.y = window.innerHeight - this._sailTrim.height;
        this.compassRose = new compassrose_1.default();
        this.compassRose.init();
        // pivot set by compassrose to be center of itself
        this.compassRose.x = this._sailTrim.x - this.compassRose.width / 2;
        this.compassRose.y = window.innerHeight - this.compassRose.height / 2;
        this.leftCannonBattery = new PIXI.Sprite(PIXI.Texture.fromFrame("CannonArray.png"));
        this.leftCannonBattery.x = this.compassRose.x - this.compassRose.width / 2; // scaleX will be flipped which makes its anchor point top right
        this.leftCannonBattery.y = this.footer.y;
        this.leftCannonBattery.scale.x = -1; // flip the art so it points left
        this.leftCannonBattery.interactive = true;
        this.leftCannonBattery.on("click", this.fireLeft);
        this.headingWatch = new watch_1.default();
        this.headingWatch.init();
        // this.lootWatch = new Watch();
        // this.lootWatch.init();
        this.portWatch = new watch_1.default();
        this.portWatch.init();
        this.portWatch.x = this.leftCannonBattery.x - this.leftCannonBattery.width / 2 - this.portWatch.width / 2;
        this.portWatch.y = this.leftCannonBattery.y + this.leftCannonBattery.height / 2 - this.portWatch.height / 2;
        this.starWatch = new watch_1.default();
        this.starWatch.init();
        this.starWatch.x = this.rightCannonBattery.x + this.rightCannonBattery.width / 2 - this.starWatch.width / 2;
        this.starWatch.y = this.rightCannonBattery.y + this.rightCannonBattery.height / 2 - this.starWatch.height / 2;
        this.headingWatch.x = this.compassRose.x - this.headingWatch.width / 2;
        this.headingWatch.y = this.compassRose.y - this.compassRose.height / 2 - this.headingWatch.height - 5;
        this.shipWidget = new shipwidget_1.default();
        this.shipWidget.init();
        this.shipWidget.x = 20;
        this.shipWidget.y = this.footer.y + 10;
        this.shipWidget.scale.x = this.shipWidget.scale.y = 0.8;
        this.shipWidget.interactive = true;
        this.shipWidget.on('click', this.doShipDetail);
        this.targetWidget = new shipwidget_1.default();
        this.targetWidget.init();
        this.targetWidget.x = 10;
        this.targetWidget.y = 50;
        this.targetWidget.scale.x = this.targetWidget.scale.y = 0.5;
        this.btnAnchor = new button_1.default(PIXI.Texture.fromFrame("AnchorButton.png"));
        this.btnAnchor.x = this.footer.x + 713;
        this.btnAnchor.y = this.footer.y - 20;
        this.btnAnchor.on('click', this.doTownInterface);
        this.ammoCount = new PIXI.Sprite(PIXI.Texture.fromFrame("ammoCount.png"));
        this.ammoCount.x = this.footer.x + 559;
        this.ammoCount.y = this.footer.y + 80;
        this.bannerToolTip = new bannertooltip_1.default();
        this.bannerToolTip.init("Shaman Island");
        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.rightCannonBattery);
        this.container.addChild(this.leftCannonBattery);
        this.container.addChild(this.ammoCount); // behind compass and sail trim
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
        this.container.addChild(this.headingWatch);
        this.container.addChild(this.shipWidget);
        this.container.addChild(this.btnAnchor);
        this.container.addChild(this.portWatch);
        this.container.addChild(this.starWatch);
        this.initHeader();
        this.headingWatch.visible = false;
        this.portWatch.visible = false;
        this.starWatch.visible = false;
        window.addEventListener("boatSelected", this.boatSelectedHandler, false);
        window.addEventListener("changeHeading", this.changeHeadingHandler, false);
        window.addEventListener("wreckMouseDown", this.lootMouseDown, false);
        window.addEventListener("floatingIconClick", this.collectLoot, false);
        window.addEventListener("lootDone", this.lootDone, false);
        window.addEventListener("merchSell", this.merchSell, false);
        window.addEventListener("buyGold", this.buyGold, false);
        window.addEventListener("playerWrecked", this.playerWrecked, false);
        window.addEventListener("mouseOverIsle", this.mouseOverIsle, false);
        window.addEventListener("mouseOutIsle", this.mouseOutIsle, false);
        window.addEventListener("aiShipMouseDown", this.aiShipMouseDown, false);
        window.addEventListener("clearTarget", this.clearTarget, false);
        this.testAPI(); // test the FB API
    };
    MainHUD.prototype.setPopupManager = function (popman) {
        this.popupManager = popman;
    };
    MainHUD.prototype.centerOnPlayer = function () {
        // instead call center on pt
        var centerHud = new PIXI.Point(this.container.width / 2, this.container.height / 2);
        var centerHudGlobal = this.container.toGlobal(centerHud);
        var seaCoord = this.sea.getContainer().toLocal(centerHudGlobal);
        var boatRef = this.trackShip.getRefPtVictor();
        var diffX = boatRef.x - seaCoord.x;
        var diffY = boatRef.y - seaCoord.y;
        var c = this.sea.getContainer();
        c.x -= diffX * c.scale.x;
        c.y -= diffY * c.scale.y;
    };
    MainHUD.prototype.initHeader = function () {
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 16,
            fill: 'white'
        });
        this.txtSilverCoins = new PIXI.Text('0', style);
        this.txtSilverCoins.x = 654;
        this.txtSilverCoins.y = 10;
        this.txtGoldCoins = new PIXI.Text('0', style);
        this.txtGoldCoins.x = 555;
        this.txtGoldCoins.y = 10;
        this.container.addChild(this.txtSilverCoins);
        this.container.addChild(this.txtGoldCoins);
        // also add ammo count to the footer
        this.ammoNum = new PIXI.Text('0', style);
        this.ammoNum.x = this.ammoCount.x + this.ammoCount.width / 2 - this.ammoNum.width / 2;
        this.ammoNum.y = this.ammoCount.y + this.ammoCount.height / 2 - this.ammoNum.height / 2;
        this.container.addChild(this.ammoNum);
    };
    MainHUD.prototype.getContainer = function () {
        return this.container;
    };
    MainHUD.prototype.setSeaUILayer = function (layer) {
        this.uiLayer = layer;
    };
    MainHUD.prototype.setTheSea = function (sea) {
        this.sea = sea;
    };
    MainHUD.prototype.playerRecovery = function () {
        var w = window.innerWidth;
        var h = window.innerWidth;
        // add a full screen view blocker and start the animation to fade to black
        this.fade2Black = new PIXI.Graphics();
        this.fade2Black.beginFill(0x000001);
        this.fade2Black.drawRect(0, 0, w, h);
        this.fade2Black.endFill();
        this.fade2Black.alpha = 0.02;
        this.container.parent.addChild(this.fade2Black);
        // start timer to fade it out over 5 seconds
        this.timerID = setInterval(this.fadeOut, 100);
    };
    MainHUD.prototype.streamCoins = function (numCoins, x, y, gold, inc) {
        if (gold === void 0) {
            gold = false;
        }
        if (inc === void 0) {
            inc = 1;
        }
        // stream coins to the hud every tick
        this.streamCoinEffect = true;
        this.coinCount = 0;
        this.coinMax += numCoins;
        this.coinDelta = 1000 / (40 / 3);
        this.coinPos.x = x;
        this.coinPos.y = y;
        this.streamGold = gold;
        this.coinInc = inc;
    };
    MainHUD.prototype.loadJSON = function (jsonFile, callback) {
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
    MainHUD.prototype.testAPI = function () {
        console.log("call FB.getLoginStatus:");
        FB.getLoginStatus(this.fbStatusResponse);
    };
    MainHUD.prototype.doMe = function () {
        console.log("FB.api(/me)");
        FB.api('/me', function (response) {
            console.log(response);
        });
    };
    MainHUD.prototype.update = function () {
        var _this = this;
        var now = Date.now();
        if (this.streamCoinEffect) {
            if (now - this.lastCoinTime > this.coinDelta) {
                this.coinCount++;
                if (this.coinCount >= this.coinMax) {
                    this.streamCoinEffect = false;
                    this.coinMax = 0;
                }
                this.lastCoinTime = now;
                if (!this.streamGold) this.container.addChild(this.silverCoins[this.coinNum]);else this.container.addChild(this.goldCoins[this.coinNum]);
                var ox, oy, x1, y1, x2, y2, fx, fy;
                ox = this.coinPos.x;
                oy = this.coinPos.y;
                x1 = 0;
                y1 = this.container.height * 0.75;
                x2 = this.container.width;
                y2 = this.container.height * 0.25;
                if (!this.streamGold) {
                    fx = this.header.x + 636;
                    fy = this.header.y + 23;
                } else {
                    fx = this.header.x + 534;
                    fy = this.header.y + 23;
                }
                var coin_1 = this.coinNum;
                if (!this.streamGold) {
                    this.silverCoins[this.coinNum].x = ox;
                    this.silverCoins[this.coinNum].y = oy;
                } else {
                    this.goldCoins[this.coinNum].x = ox;
                    this.goldCoins[this.coinNum].y = oy;
                }
                if (!this.streamGold) {
                    TweenMax.to(this.silverCoins[this.coinNum], 1.75, { bezier: { type: "soft", curviness: 2.0, values: [{ x: ox, y: oy }, { x: x1, y: y1 }, { x: x2, y: y2 }, { x: fx, y: fy }] },
                        onComplete: function () {
                            _this.container.removeChild(_this.silverCoins[coin_1]);singleton_1.default.player.incSilver(1);
                        } });
                } else {
                    TweenMax.to(this.goldCoins[this.coinNum], 1.75, { bezier: { type: "soft", curviness: 2.0, values: [{ x: ox, y: oy }, { x: x1, y: y1 }, { x: x2, y: y2 }, { x: fx, y: fy }] },
                        onComplete: function () {
                            _this.container.removeChild(_this.goldCoins[coin_1]);singleton_1.default.player.incGold(_this.coinInc);
                        } });
                }
                this.coinNum++;
                if (this.coinNum >= this.silverCoins.length) this.coinNum = 0;
            }
        }
        if (singleton_1.default.player.getSilver().toString() != this.txtSilverCoins.text) this.txtSilverCoins.text = singleton_1.default.player.getSilver().toFixed(0).toString();
        if (singleton_1.default.player.getGold().toString() != this.txtGoldCoins.text) this.txtGoldCoins.text = singleton_1.default.player.getGold().toString();
        this.ammoNum.text = this.trackShip.getMagBall().toString();
        this.ammoNum.x = this.ammoCount.x + this.ammoCount.width / 2 - this.ammoNum.width / 2;
        this.ammoNum.y = this.ammoCount.y + this.ammoCount.height / 2 - this.ammoNum.height / 2;
        this.compassRose.update();
        this.headingWatch.update();
        this.starWatch.update();
        this.portWatch.update();
        this._sailTrim.update();
        this.shipWidget.update();
        this.targetWidget.update();
        this.bannerToolTip.update();
        if (this.trackShip.isAground() || this.trackShip.isWrecked()) {
            if (!this.didGrounding) {
                this._sailTrim.setSailTrimPercent(0);
                this.didGrounding = true;
            }
        } else {
            if (this.didGrounding) this.didGrounding = false;
        }
        if (!compassrose_1.default.isValidHeading(this.trackShip.getAngleToWind(), this.trackShip.getHeading())) {
            this._sailTrim.showLuff();
        } else {
            this._sailTrim.hideLuff();
        }
        if (singleton_1.default.currentPort != "") this.btnAnchor.visible = true;else this.btnAnchor.visible = false;
    };
    return MainHUD;
}();
exports.default = MainHUD;

/***/ }),
/* 22 */
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
        _this._showLuff = false;
        _this.luffDir = 1;
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
                    _this.deltaY = (_this.lastY - e.data.global.y) * (1 / _this.scale.y);
                    // move the mainLine
                    _this.mainLine.y -= _this.deltaY;
                    // cap the movement
                    if (_this.mainLine.y < -100) _this.mainLine.y = -100;else if (_this.mainLine.y > 110) _this.mainLine.y = 110;
                    // set the percentage here
                    _this.sailTrimPercent = (_this.mainLine.y + 100) / 210;
                    // sail scale goes from 0 - > 1.33 -- capped for visual appeal
                    _this.sailContainer.scale.y = _this.sailTrimPercent * 1.33;
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
        // this.sail.x = -7;
        // this.sail.y = 56;
        //this.addChild(this.sail);
        this.displacementTexture = PIXI.loader.resources["images/2yYayZk.png"].texture;
        this.displacementTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementSprite = new PIXI.Sprite(this.displacementTexture);
        // this.displacementSprite.width = this.sail.width; // resize to same dimensions as the sail
        // this.displacementSprite.height = this.sail.height;
        // this.displacementSprite.scale.x = 4;
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        this.sailContainer = new PIXI.Container();
        this.sailContainer.addChild(this.sail);
        this.sailContainer.x = -7;
        this.sailContainer.y = 56;
        this.sailContainer.addChild(this.displacementSprite);
        this.addChild(this.sailContainer);
        this.trimMast = new PIXI.Sprite(PIXI.Texture.fromFrame("sliderBack.png"));
        this.addChild(this.trimMast); // 0,0
        this.thumbSlider.x = 70; // thumbSlider is 454 pix tall and will slide under mask so only 235 of it is viewed at one time
        this.thumbSlider.y = -60;
        this.addChild(this.thumbSlider); // add the thumbslider to our own container
        this.mainLine.interactive = true;
        this.mainLine.on("mousemove", this.mouseMoveHandler);
        this.mainLine.on("mousedown", this.mouseDownHandler);
        this.mainLine.on("mouseup", this.mouseUpHandler);
        this.setSailTrimPercent(0); // default to all stop
    };
    sailTrim.prototype.showLuff = function () {
        if (this._showLuff == false) {
            this.sailContainer.filters = [this.displacementFilter];
            this._showLuff = true;
        }
    };
    sailTrim.prototype.hideLuff = function () {
        if (this._showLuff == true) {
            this.sailContainer.filters = [];
            this._showLuff = false;
        }
    };
    sailTrim.prototype.getSailTrimPercent = function () {
        return this.sailTrimPercent;
    };
    sailTrim.prototype.setSailTrimPercent = function (percent) {
        // set the percentage here
        this.sailTrimPercent = percent; //(this.mainLine.y + 100) / 210;
        // set the mainLine position
        this.mainLine.y = -100 + 210 * percent; // -100 is the zero position in y for the main sheet block
        // sail scale goes from 0 - > 1.33 -- capped for visual appeal
        this.sailContainer.scale.y = this.sailTrimPercent * 1.33;
    };
    sailTrim.prototype.endSetTrim = function () {
        this.mouseDown = false;
        this.lastY = -1;
        var myEvent = new CustomEvent("sailTrimEvent", {
            'detail': this.sailTrimPercent
        });
        window.dispatchEvent(myEvent);
    };
    sailTrim.prototype.update = function () {
        if (this._showLuff) {
            // if (this.displacementSprite.x >= this.sail.width)
            //     this.luffDir = -1;
            // if (this.displacementSprite.x < 0)
            //     this.luffDir = 1;
            this.displacementSprite.x += 3; // * this.luffDir;
            this.displacementSprite.y += 3;
            //this.displacementSprite.y += 2;
        }
    };
    return sailTrim;
}(PIXI.Container);
exports.default = sailTrim;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// Watch class to visually display a timer countdown for when widgets are unavailable/working
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
var compassrose_1 = __webpack_require__(11);
var Watch = /** @class */function (_super) {
    __extends(Watch, _super);
    function Watch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.percentDone = 0;
        _this.lastTime = 0;
        _this.totalTime = 0;
        _this.timeElapsed = 0;
        _this.started = false;
        return _this;
    }
    Watch.prototype.timeToZero = function (seconds) {};
    Watch.prototype.init = function () {
        // assumes its aszets are loaded inot the cache
        this.watchFace = new PIXI.Sprite(PIXI.Texture.fromFrame("Watch.png"));
        this.counter = new PIXI.Sprite(PIXI.Texture.fromFrame("CounterProgress.png"));
        this.addChild(this.watchFace);
        this.counter.x = 6;
        this.counter.y = 12;
        this.counter.alpha = 0.73;
        this.addChild(this.counter);
        // test mask
        this.percentDone = 0.25;
        this.doMask();
    };
    Watch.prototype.start = function (callback) {
        this.percentDone = 0;
        this.timeElapsed = 0;
        this.lastTime = 0;
        this.finishedCallback = callback;
        this.started = true;
        //console.log("watch started");
    };
    Watch.prototype.stop = function () {
        this.started = false;
    };
    Watch.prototype.doMask = function () {
        // make a circular arc based off percentDone  100 will be no mask.. reveals clockwise as percent increases
        var degs = this.percentDone * 360;
        var rads = compassrose_1.default.getRads(degs);
        var arc = new PIXI.Graphics();
        arc.beginFill(0xff0000);
        arc.moveTo(this.counter.width / 2, this.counter.height / 2);
        arc.arc(this.counter.width / 2, this.counter.height / 2, this.counter.width / 2, 0, rads, false); // cx, cy, radius, angle, endAngle, anticlockwise bool
        arc.endFill();
        arc.rotation = compassrose_1.default.getRads(-90);
        arc.x = this.counter.x;
        arc.y = this.counter.y + this.counter.width;
        if (this.counterMask) {
            this.removeChild(this.counterMask);
            this.counterMask.destroy();
        }
        this.counterMask = arc;
        this.counter.mask = this.counterMask;
        this.addChild(this.counterMask);
    };
    Watch.prototype.countDown = function (timeToCount) {
        // all units in milliseconds
        this.totalTime = timeToCount;
    };
    Watch.prototype.update = function () {
        if (this.started) {
            var now = Date.now();
            if (this.lastTime != 0) this.timeElapsed += now - this.lastTime;
            this.lastTime = now;
            this.percentDone = 1 - (this.totalTime - this.timeElapsed) / this.totalTime;
            if (this.percentDone >= 1) this.percentDone = 1;
            this.doMask();
            if (this.percentDone == 1) {
                this.stop();
                // call our callback to indicate we are finished
                if (this.finishedCallback) this.finishedCallback();
            }
        }
    };
    return Watch;
}(PIXI.Container);
exports.default = Watch;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// ShipDetail popup screen to display hold, magazine, and ship stats
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
var popup_1 = __webpack_require__(3);
var button_1 = __webpack_require__(2);
var healthbar_1 = __webpack_require__(13);
var economyicon_1 = __webpack_require__(9);
var popShipDetails = /** @class */function (_super) {
    __extends(popShipDetails, _super);
    function popShipDetails(boat) {
        var _this = _super.call(this) || this;
        _this.boat = boat;
        return _this;
    }
    popShipDetails.prototype.init = function () {
        _super.prototype.init.call(this); // load background and X button
        // load and position our graphics
        var s = this.getShipImage();
        s.x = 603 - s.width / 2;
        s.y = 94 - s.height / 2; // coordinate in flash are based off its center
        this.addChild(s);
        var b = new button_1.default(PIXI.Texture.fromFrame("sellBtn.png"));
        b.anchor.x = b.anchor.y = 0.5;
        b.x = 649;
        b.y = 400;
        b.setDisabled(true);
        this.addChild(b);
        this.holdBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.holdBack.x = 348 - this.holdBack.width / 2;
        this.holdBack.y = 379 - this.holdBack.height / 2;
        this.addChild(this.holdBack);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        s.x = 505 - s.width / 2;
        s.y = 505 - s.height / 2;
        this.addChild(s);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("uiCannon.png"));
        s.x = 131 - s.width / 2;
        s.y = 112 - s.height / 2;
        this.addChild(s);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("uiBall.png"));
        s.x = 130 - s.width / 2;
        s.y = 158 - s.height / 2;
        this.addChild(s);
        // health bars
        this.sailHealth = new healthbar_1.default(150, 12, 0x0000FF);
        this.sailHealth.x = 149;
        this.sailHealth.y = 192;
        this.addChild(this.sailHealth);
        this.crewHealth = new healthbar_1.default(150, 12, 0x00FF00);
        this.crewHealth.x = 149;
        this.crewHealth.y = 223;
        this.addChild(this.crewHealth);
        this.hullHealth = new healthbar_1.default(150, 12, 0xFF0000);
        this.hullHealth.x = 149;
        this.hullHealth.y = 252;
        var perc = this.boat.getHull() / this.boat.getHullMax();
        this.hullHealth.setPerc(perc);
        this.addChild(this.hullHealth);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        this.lblSails = new PIXI.Text('Sails:', style);
        this.lblSails.x = this.sailHealth.x - this.lblSails.width - 5;
        this.lblSails.y = this.sailHealth.y + this.sailHealth.height / 2 - this.lblSails.height / 2;
        this.addChild(this.lblSails);
        this.lblCrew = new PIXI.Text('Crew:', style);
        this.lblCrew.x = this.crewHealth.x - this.lblCrew.width - 5;
        this.lblCrew.y = this.crewHealth.y + this.crewHealth.height / 2 - this.lblCrew.height / 2;
        this.addChild(this.lblCrew);
        this.lblHull = new PIXI.Text('Hull:', style);
        this.lblHull.x = this.hullHealth.x - this.lblHull.width - 5;
        this.lblHull.y = this.hullHealth.y + this.hullHealth.height / 2 - this.lblHull.height / 2;
        this.addChild(this.lblHull);
        this.lblHold = new PIXI.Text('Hold:', style);
        this.lblHold.x = this.holdBack.x;
        this.lblHold.y = this.holdBack.y + this.holdBack.height + 3;
        this.addChild(this.lblHold);
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        var sMag = this.boat.getMagBall() + " of " + this.boat.getMagBallMax();
        this.lblShot = new PIXI.Text(sMag, styleb);
        this.lblShot.x = this.sailHealth.x + this.sailHealth.width / 2 - this.lblShot.width / 2;
        this.lblShot.y = 135;
        this.addChild(this.lblShot);
        this.lblCannon = new PIXI.Text('x 6 4lb', styleb);
        this.lblCannon.x = this.sailHealth.x + this.sailHealth.width / 2 - this.lblShot.width / 2;
        this.lblCannon.y = 93;
        this.addChild(this.lblCannon);
        this.lblName = new PIXI.Text('Name:', style);
        this.lblName.x = 172;
        this.lblName.y = 18;
        this.addChild(this.lblName);
        this.txtShipName = new PIXI.Text('\"' + this.boat.getName() + '\"', style);
        this.txtShipName.x = 172;
        this.txtShipName.y = 43;
        this.addChild(this.txtShipName);
        this.loadHold();
    };
    popShipDetails.prototype.loadHold = function () {
        var hold = this.boat.getHold();
        console.log(hold);
        for (var i = 0; i < hold.length; i++) {
            var e = new economyicon_1.default(hold[i].type, i, false, hold[i].rarity);
            // place in our 10x4 grid
            e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
            e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
            e.x += this.holdBack.x + 10;
            e.y += this.holdBack.y + 4;
            this.addChild(e);
        }
    };
    popShipDetails.prototype.getShipImage = function () {
        // switch off of ship type
        return new PIXI.Sprite(PIXI.Texture.fromFrame("uiCorvette.png"));
    };
    return popShipDetails;
}(popup_1.default);
exports.default = popShipDetails;

/***/ }),
/* 25 */
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
// TownInterface class for when players put to port and need to do business on an island
// 
var PIXI = __webpack_require__(0);
var popup_1 = __webpack_require__(3);
var button_1 = __webpack_require__(2);
var popprovisioner_1 = __webpack_require__(26);
var popprizeagent_1 = __webpack_require__(27);
var singleton_1 = __webpack_require__(1);
var popwarehouse_1 = __webpack_require__(30);
var popmarket_1 = __webpack_require__(31);
var popTownInterface = /** @class */function (_super) {
    __extends(popTownInterface, _super);
    function popTownInterface() {
        var _this = _super.call(this) || this;
        _this.doPrizeAgent = function () {
            if (_this._backgrounded) {
                console.log("backgrounded click: ignoring");
                return;
            }
            console.log("doPrizeAgent");
            var pop = new popprizeagent_1.default();
            _this.popMan.displayPopup(pop);
        };
        _this.doPrizeOver = function () {
            _this.txtMouseOver.text = "Prize Agent. Reload you magazine with cannon balls here.";
        };
        _this.doProvisioner = function (e) {
            if (_this._backgrounded) {
                console.log("backgrounded click: ignoring");
                return;
            }
            console.log("doProvisioner");
            // display the town interface popup
            var pop = new popprovisioner_1.default();
            _this.popMan.displayPopup(pop);
        };
        _this.doProvisOver = function () {
            _this.txtMouseOver.text = "Provisioner. Buy ship's goods here and/or sell items in your hold.";
        };
        _this.doWarehouse = function () {
            if (_this._backgrounded) {
                console.log("backgrounded click: ignoring");
                return;
            }
            console.log("doWarehouse");
            // display the town interface popup
            var pop = new popwarehouse_1.default();
            _this.popMan.displayPopup(pop);
        };
        _this.doWareOver = function () {
            _this.txtMouseOver.text = "Warehouse. Buy market items here and/or sell items in your hold";
        };
        _this.doMarket = function () {
            if (_this._backgrounded) {
                console.log("backgrounded click: ignoring");
                return;
            }
            console.log("doMarket");
            // display the town interface popup
            var pop = new popmarket_1.default();
            _this.popMan.displayPopup(pop);
        };
        _this.doMarketOver = function () {
            var townName = singleton_1.default.currentPort;
            _this.txtMouseOver.text = "Market. Check the going rates for items in " + townName;
        };
        return _this;
    }
    popTownInterface.prototype.setPopupManager = function (popMan) {
        this.popMan = popMan;
    };
    popTownInterface.prototype.init = function () {
        _super.prototype.init.call(this);
        // add buildings by sort order, back to front
        this.building6 = new button_1.default(PIXI.Texture.fromFrame("building6.png"), true);
        this.building6.x = 121;
        this.building6.y = 48;
        this.building6.on('click', this.doPrizeAgent);
        this.building6.on('mouseover', this.doPrizeOver);
        this.addChild(this.building6);
        this.building1 = new PIXI.Sprite(PIXI.Texture.fromFrame("building1.png"));
        this.building1.x = 283;
        this.building1.y = 83;
        this.addChild(this.building1);
        this.building4 = new PIXI.Sprite(PIXI.Texture.fromFrame("building4.png"));
        this.building4.x = 496;
        this.building4.y = 79;
        this.addChild(this.building4);
        this.building3 = new PIXI.Sprite(PIXI.Texture.fromFrame("buildingForge.png"));
        this.building3.x = 338;
        this.building3.y = 122;
        this.addChild(this.building3);
        this.building5 = new button_1.default(PIXI.Texture.fromFrame("building5.png"), true);
        this.building5.x = 439;
        this.building5.y = 210;
        this.building5.on('click', this.doProvisioner);
        this.building5.on('mouseover', this.doProvisOver);
        this.addChild(this.building5);
        this.building7 = new button_1.default(PIXI.Texture.fromFrame("wareHouse.png"), true);
        this.building7.x = 130;
        this.building7.y = 207;
        this.building7.on('click', this.doWarehouse);
        this.building7.on('mouseover', this.doWareOver);
        this.addChild(this.building7);
        this.dock = new PIXI.Sprite(PIXI.Texture.fromFrame("dockSW.png"));
        this.dock.x = 329 - this.dock.width; // position is flipped in animate so origin is top right
        this.dock.y = 354;
        this.addChild(this.dock);
        this.building2 = new button_1.default(PIXI.Texture.fromFrame("building2.png"), true);
        this.building2.x = 261;
        this.building2.y = 282;
        this.building2.on('click', this.doMarket);
        this.building2.on('mouseover', this.doMarketOver);
        this.addChild(this.building2);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        var townName = singleton_1.default.currentPort;
        this.txtTownName = new PIXI.Text(townName, style);
        this.txtTownName.x = this.bg.width / 2 - this.txtTownName.width / 2;
        this.txtTownName.y = 29;
        this.addChild(this.txtTownName);
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 18,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: 312
        });
        this.txtMouseOver = new PIXI.Text(townName + " info.  Mouse over the buildings for details.", styleb);
        this.txtMouseOver.x = 359;
        this.txtMouseOver.y = 445;
        this.addChild(this.txtMouseOver);
    };
    return popTownInterface;
}(popup_1.default);
exports.default = popTownInterface;

/***/ }),
/* 26 */
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
// popProvisioner class for buying selling provisions in town. This is where the player will
//                  sell the stuff in their boat hold and buy ships provisions for thier boat
//
var PIXI = __webpack_require__(0);
var popup_1 = __webpack_require__(3);
var button_1 = __webpack_require__(2);
var economyicon_1 = __webpack_require__(9);
var singleton_1 = __webpack_require__(1);
var popProvisioner = /** @class */function (_super) {
    __extends(popProvisioner, _super);
    function popProvisioner() {
        var _this = _super.call(this) || this;
        _this.eIcons = [];
        _this.iconClicked = function (e) {
            e.target.glowToggle();
            _this.calculateTotalSellPrice();
        };
        _this.onSell = function (e) {
            // sell all glowing icons
            // loop over the hold backwards
            var amount = _this.calculateTotalSellPrice();
            if (amount <= 0) return; // do nothing, nothign selected
            // and send up the request to the hud to award the coins
            var pos = _this.toGlobal(_this.coin.position);
            var myEvent = new CustomEvent("merchSell", {
                'detail': { "amount": amount, "x": pos.x + _this.coin.width / 2, "y": pos.y + _this.coin.height / 2 }
            });
            window.dispatchEvent(myEvent);
            var i;
            var hold = singleton_1.default.ship.getHold();
            // loop from end as splice will change indeces if looped front to back
            for (i = _this.eIcons.length - 1; i >= 0; i--) {
                if (_this.eIcons[i].isGlowing()) {
                    _this.removeChild(_this.eIcons[i]);
                    _this.eIcons.splice(i, 1);
                    hold.splice(i, 1);
                }
            }
            _this.loadHold(false); // flag to just reposition existing items
            _this.txtAmount.text = "0";
        };
        return _this;
    }
    popProvisioner.prototype.init = function () {
        _super.prototype.init.call(this); // add backdrop and x buttton
        this.mercBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.mercBack.x = 336 - this.mercBack.width / 2;
        this.mercBack.y = 189 - this.mercBack.height / 2;
        this.addChild(this.mercBack);
        this.holdBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.holdBack.x = 336 - this.holdBack.width / 2;
        this.holdBack.y = 417 - this.holdBack.height / 2;
        this.addChild(this.holdBack);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        var lbl = new PIXI.Text('Merchant:', style);
        lbl.x = this.mercBack.x;
        lbl.y = this.mercBack.y - lbl.height - 2;
        this.addChild(lbl);
        lbl = new PIXI.Text('Hold:', style);
        lbl.x = this.holdBack.x;
        lbl.y = this.holdBack.y - lbl.height - 2;
        this.addChild(lbl);
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        lbl = new PIXI.Text('Provisioner:', styleb);
        lbl.x = this.mercBack.x + this.mercBack.width / 2 - lbl.width / 2;
        lbl.y = 35;
        this.addChild(lbl);
        this.sellBtn = new button_1.default(PIXI.Texture.fromFrame("sellBtn.png"));
        this.sellBtn.x = 531;
        this.sellBtn.y = 302;
        this.sellBtn.scale.x = this.sellBtn.scale.y = 0.67;
        this.sellBtn.on('click', this.onSell);
        this.addChild(this.sellBtn);
        this.coin = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.coin.x = 329 - this.coin.width / 2;
        this.coin.y = 306 - this.coin.height / 2;
        this.addChild(this.coin);
        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });
        this.txtAmount = new PIXI.Text('0', stylec);
        this.txtAmount.x = this.coin.x + this.coin.width + 5;
        this.txtAmount.y = this.coin.y + this.coin.height / 2 - this.txtAmount.height / 2;
        this.addChild(this.txtAmount);
        this.charProvisioner = new PIXI.Sprite(PIXI.Texture.fromFrame("Provisioner 300x450.png"));
        this.charProvisioner.x = 508;
        this.charProvisioner.y = 66;
        this.addChild(this.charProvisioner);
        this.loadHold();
        this.displayMerch();
    };
    popProvisioner.prototype.loadHold = function (createIcons) {
        if (createIcons === void 0) {
            createIcons = true;
        }
        var hold = singleton_1.default.ship.getHold();
        var e;
        for (var i = 0; i < hold.length; i++) {
            if (createIcons) e = new economyicon_1.default(hold[i].type, i, false, hold[i].rarity);else e = this.eIcons[i];
            // place in our 10x4 grid
            e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
            e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
            e.x += this.holdBack.x + 10;
            e.y += this.holdBack.y + 4;
            if (createIcons) {
                e.interactive = true;
                e.on('click', this.iconClicked);
                this.eIcons.push(e);
                this.addChild(e);
            }
        }
    };
    popProvisioner.prototype.displayMerch = function () {
        var i = 0;
        // provisioner sells hard tack, meat, fish, wine, rum
        var e = new economyicon_1.default(20, 0, false, 0);
        e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
        e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
        e.x += this.mercBack.x + 10;
        e.y += this.mercBack.y + 4;
        this.addChild(e);
        i++;
        e = new economyicon_1.default(37, 0, false, 0);
        e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
        e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
        e.x += this.mercBack.x + 10;
        e.y += this.mercBack.y + 4;
        this.addChild(e);
        i++;
        e = new economyicon_1.default(15, 0, false, 0);
        e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
        e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
        e.x += this.mercBack.x + 10;
        e.y += this.mercBack.y + 4;
        this.addChild(e);
        i++;
        e = new economyicon_1.default(54, 0, false, 0);
        e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
        e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
        e.x += this.mercBack.x + 10;
        e.y += this.mercBack.y + 4;
        this.addChild(e);
        i++;
        e = new economyicon_1.default(42, 0, false, 0);
        e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
        e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
        e.x += this.mercBack.x + 10;
        e.y += this.mercBack.y + 4;
        this.addChild(e);
        i++;
    };
    popProvisioner.prototype.calculateTotalSellPrice = function () {
        // loop through the icons, add price from hold item for those glowing
        var i;
        var price = 0;
        var hold = singleton_1.default.ship.getHold();
        for (i = 0; i < this.eIcons.length; i++) {
            if (this.eIcons[i].isGlowing()) {
                price += hold[i].getMarketPrice();
            }
        }
        // display this price in our txtlabel
        this.txtAmount.text = price.toString();
        return price;
    };
    return popProvisioner;
}(popup_1.default);
exports.default = popProvisioner;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// popPrizeAgent class for buying reloads to the magazine and ship quests
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
var popup_1 = __webpack_require__(3);
var button_1 = __webpack_require__(2);
var singleton_1 = __webpack_require__(1);
var ship_1 = __webpack_require__(10);
var popmsgbox_1 = __webpack_require__(8);
var popcoinstore_1 = __webpack_require__(28);
var healthbar_1 = __webpack_require__(13);
var popPrizeAgent = /** @class */function (_super) {
    __extends(popPrizeAgent, _super);
    function popPrizeAgent() {
        var _this = _super.call(this) || this;
        _this.repairPrice = 0;
        _this.update = function () {
            _this.txtReloadTime.text = _this.getTimeRemaining();
            requestAnimationFrame(_this.update);
        };
        _this.onRepair = function (e) {
            if (singleton_1.default.player.getSilver() >= _this.repairPrice) {
                singleton_1.default.ship.repairAll();
                _this.hullHealth.setPerc(1);
                var decPrice = _this.repairPrice.toFixed(0);
                singleton_1.default.player.decSilver(_this.repairPrice);
                _this.repairPrice = 0;
                _this.txtRepairSilver.text = "0";
            } else {
                var msg = new popmsgbox_1.default();
                msg.initMsg(3, "Prize Agent", "It would appear your account balance is lacking sufficent funds. Mayhap you should take a prize or two?");
                singleton_1.default.popupManager.displayPopup(msg);
                return;
            }
        };
        _this.onRepairNow = function (e) {};
        _this.onBuyNow = function (e) {
            var balls = singleton_1.default.ship.getMagBall();
            if (balls == singleton_1.default.ship.getMagBallMax()) {
                var msg = new popmsgbox_1.default();
                msg.initMsg(0, "1st Mate", "Our magazine is full captain! No need to reload right now.");
                singleton_1.default.popupManager.displayPopup(msg);
                return;
            }
            if (singleton_1.default.player.getGold() >= 10) {
                singleton_1.default.player.decGold(10);
                singleton_1.default.ship.fillMagazine();
                var sMag = singleton_1.default.ship.getMagBall() + " of " + singleton_1.default.ship.getMagBallMax();
                _this.lblShot.text = sMag;
                var msg = new popmsgbox_1.default();
                msg.initMsg(3, "Prize Agent", "Yes, exaction is the best way to deal with the armory...");
                singleton_1.default.popupManager.displayPopup(msg);
                console.log("Refilled Mag! lastReload = " + singleton_1.default.player.lastReload);
            } else {
                // display the coin store
                var pop = new popcoinstore_1.default();
                singleton_1.default.popupManager.displayPopup(pop);
            }
        };
        _this.onReload = function () {
            // var pop = new popMsgBox();
            // pop.initMsg(0, "Important Message!", "Really boss! I thought this was important to tell you right now");
            // this.popupManager.displayPopup(pop);
            var balls = singleton_1.default.ship.getMagBall();
            if (balls == singleton_1.default.ship.getMagBallMax()) {
                var msg = new popmsgbox_1.default();
                msg.initMsg(0, "1st Mate", "Our magazine is full captain! No need to reload right now.");
                singleton_1.default.popupManager.displayPopup(msg);
                return;
            }
            if (_this.txtReloadTime.text != "Ready!") {
                var msg2 = new popmsgbox_1.default();
                msg2.initMsg(3, "Prize Agent", "I cannot reload your magazine at the moment. Unless you're willing to bribe the armory...");
                singleton_1.default.popupManager.displayPopup(msg2);
                return;
            }
            var now = Date.now();
            singleton_1.default.player.lastReload = now;
            singleton_1.default.ship.fillMagazine();
            var sMag = singleton_1.default.ship.getMagBall() + " of " + singleton_1.default.ship.getMagBallMax();
            _this.lblShot.text = sMag;
            console.log("Refilled Mag! lastReload = " + singleton_1.default.player.lastReload);
        };
        return _this;
    }
    popPrizeAgent.prototype.init = function () {
        _super.prototype.init.call(this); // background and x button
        // add popup display items
        this.cannon = new PIXI.Sprite(PIXI.Texture.fromFrame("uiCannon.png"));
        this.cannon.x = 114 - this.cannon.width / 2;
        this.cannon.y = 160 - this.cannon.height / 2;
        this.addChild(this.cannon);
        this.ball = new PIXI.Sprite(PIXI.Texture.fromFrame("uiBall.png"));
        this.ball.x = 113 - this.ball.width / 2;
        this.ball.y = 205 - this.ball.height / 2;
        this.addChild(this.ball);
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        this.lblCannon = new PIXI.Text('x 6 4lb', styleb);
        this.lblCannon.x = this.cannon.x + this.cannon.width + 10;
        this.lblCannon.y = this.cannon.y;
        this.addChild(this.lblCannon);
        var boat = singleton_1.default.ship;
        var sMag = boat.getMagBall() + " of " + boat.getMagBallMax();
        this.lblShot = new PIXI.Text(sMag, styleb);
        this.lblShot.x = this.ball.x + this.ball.width + 10;
        this.lblShot.y = this.ball.y;
        this.addChild(this.lblShot);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        this.lblName = new PIXI.Text('Name:', style);
        this.lblName.x = 155;
        this.lblName.y = 66;
        this.addChild(this.lblName);
        var shipName = singleton_1.default.ship.getName();
        this.txtShipName = new PIXI.Text(shipName, styleb);
        this.txtShipName.x = 155;
        this.txtShipName.y = 90;
        this.addChild(this.txtShipName);
        this.lblTitle = new PIXI.Text("Prize Agent", styleb);
        this.lblTitle.x = this.bg.width / 2 - this.lblTitle.width / 2;
        this.lblTitle.y = 30;
        this.addChild(this.lblTitle);
        this.lblNextReload = new PIXI.Text("Next Reload in: ", style);
        this.lblNextReload.x = 284;
        this.lblNextReload.y = 141;
        this.addChild(this.lblNextReload);
        this.txtReloadTime = new PIXI.Text("00:00:00 ", style);
        this.txtReloadTime.x = this.lblNextReload.x + this.lblNextReload.width + 5;
        this.txtReloadTime.y = this.lblNextReload.y;
        this.addChild(this.txtReloadTime);
        this.coin = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
        this.coin.x = 400 - this.coin.width / 2;
        this.coin.y = 208 - this.coin.height / 2;
        this.addChild(this.coin);
        this.txtReloadPrice = new PIXI.Text("10", style);
        this.txtReloadPrice.x = this.coin.x + this.coin.width + 5;
        this.txtReloadPrice.y = this.coin.y;
        this.addChild(this.txtReloadPrice);
        this.btnBuyNow = new button_1.default(PIXI.Texture.fromFrame("btnLong.png"), false, "Buy Now", 18);
        this.btnBuyNow.x = 329; // - this.btnBuyNow.width/2;
        this.btnBuyNow.y = 204; // - this.btnBuyNow.height/2;
        this.addChild(this.btnBuyNow);
        this.btnBuyNow.on('click', this.onBuyNow);
        this.btnReload = new button_1.default(PIXI.Texture.fromFrame("btnLong.png"), false, "Reload");
        this.btnReload.x = 217; //- this.btnReload.width / 2;
        this.btnReload.y = 254; // - this.btnReload.height / 2;
        this.addChild(this.btnReload);
        this.btnReload.on('click', this.onReload);
        this.charPrizeAgent = new PIXI.Sprite(PIXI.Texture.fromFrame("Prize Agent 300x450.png"));
        this.charPrizeAgent.x = 472;
        this.charPrizeAgent.y = 31;
        this.addChild(this.charPrizeAgent);
        // repair info
        this.lblNextRepair = new PIXI.Text("Next Repair in: ", style);
        this.lblNextRepair.x = 284;
        this.lblNextRepair.y = 275;
        this.addChild(this.lblNextRepair);
        this.txtRepairTime = new PIXI.Text("00:00:00 ", style);
        this.txtRepairTime.x = this.lblNextRepair.x + this.lblNextRepair.width + 5;
        this.txtRepairTime.y = this.lblNextRepair.y;
        this.addChild(this.txtRepairTime);
        this.lblHull = new PIXI.Text('Hull:', styleb);
        this.lblHull.x = 170;
        this.lblHull.y = 307;
        this.addChild(this.lblHull);
        this.hullHealth = new healthbar_1.default(150, 12, 0xFF0000);
        this.hullHealth.x = this.lblHull.x + this.lblHull.width + 5;
        this.hullHealth.y = this.lblHull.y + 15;
        var perc = singleton_1.default.ship.getHull() / singleton_1.default.ship.getHullMax();
        this.hullHealth.setPerc(perc);
        this.addChild(this.hullHealth);
        this.repairSilver = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.repairSilver.x = 424 - this.repairSilver.width / 2;
        this.repairSilver.y = 324 - this.repairSilver.height / 2;
        this.addChild(this.repairSilver);
        this.repairPrice = 50 * (1 - perc);
        var price = this.repairPrice;
        this.txtRepairSilver = new PIXI.Text(price.toFixed(0).toString(), style);
        this.txtRepairSilver.x = this.repairSilver.x + this.repairSilver.width + 5;
        this.txtRepairSilver.y = this.repairSilver.y;
        this.addChild(this.txtRepairSilver);
        this.btnRepair = new button_1.default(PIXI.Texture.fromFrame("btnLong.png"), false, "Repair");
        this.btnRepair.x = 217;
        this.btnRepair.y = 369;
        this.addChild(this.btnRepair);
        this.btnRepair.on('click', this.onRepair);
        this.btnRepairNow = new button_1.default(PIXI.Texture.fromFrame("btnLong.png"), false, "Buy Now", 18);
        this.btnRepairNow.x = 329;
        this.btnRepairNow.y = 369;
        this.addChild(this.btnRepairNow);
        this.btnBuyNow.on('click', this.onRepairNow);
        this.repairGold = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
        this.repairGold.x = 400 - this.repairGold.width / 2;
        this.repairGold.y = 375 - this.repairGold.height / 2;
        this.addChild(this.repairGold);
        this.txtRepairGold = new PIXI.Text("10", style);
        this.txtRepairGold.x = this.repairGold.x + this.repairGold.width + 5;
        this.txtRepairGold.y = this.repairGold.y;
        this.addChild(this.txtRepairGold);
        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 16,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: 455
        });
        var footer = "I can reload your magazine or repair only so often. To do so more frequently will require exaction of the master at the dockyard.";
        this.txtFooter = new PIXI.Text(footer, stylec);
        this.txtFooter.x = 97;
        this.txtFooter.y = 466;
        this.addChild(this.txtFooter);
        requestAnimationFrame(this.update);
    };
    popPrizeAgent.prototype.getTimeRemaining = function () {
        if (singleton_1.default.player.lastReload == 0) return "Ready!";
        var now = Date.now();
        var t = now - singleton_1.default.player.lastReload;
        if (t > singleton_1.default.player.reloadTime) return "Ready!";
        // if not zero, or elapsed, we are within the time window, determine how much is left
        t = singleton_1.default.player.reloadTime - t;
        var seconds = Math.floor(t / 1000 % 60);
        var minutes = Math.floor(t / 1000 / 60 % 60);
        var hours = Math.floor(t / (1000 * 60 * 60) % 24);
        //console.log(hours + ":" + minutes + ":" +  seconds);
        var strTime = ship_1.default.zeroPad(hours, 2) + ":" + ship_1.default.zeroPad(minutes, 2) + ":" + ship_1.default.zeroPad(seconds, 2);
        return strTime;
    };
    return popPrizeAgent;
}(popup_1.default);
exports.default = popPrizeAgent;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// popPrizeAgent class for buying reloads to the magazine and ship quests
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
var popup_1 = __webpack_require__(3);
var singleton_1 = __webpack_require__(1);
var storecard_1 = __webpack_require__(29);
var button_1 = __webpack_require__(2);
var popmsgbox_1 = __webpack_require__(8);
var popCoinStore = /** @class */function (_super) {
    __extends(popCoinStore, _super);
    function popCoinStore() {
        var _this = _super.call(this) || this;
        _this.cards = [];
        _this.clickID = -1;
        _this.purchaseToken = "";
        _this.onBuy = function (e) {
            // start a purchase for the id number contained in the card
            var id = _this.clickID;
            if (id == -1) {
                var msg = new popmsgbox_1.default();
                msg.initMsg(0, "Coin Store", "Click a coin package you'd like to buy then click the Buy button.");
                singleton_1.default.popupManager.displayPopup(msg);
                return;
            }
            _this.coinInc = 1;
            if (id == 1) _this.purchaseAmount = 10; // 10 gold
            if (id == 2) _this.purchaseAmount = 30; // 30 gold
            if (id == 3) {
                _this.purchaseAmount = 7; // 70 gold in increments of 10
                _this.coinInc = 10;
            }
            if (id == 4) {
                _this.purchaseAmount = 30; // 300 gold in increments of 10
                _this.coinInc = 10;
            }
            if (id == 5) {
                _this.purchaseAmount = 6;
                _this.coinInc = 100;
            }
            if (id == 6) {
                _this.purchaseAmount = 15;
                _this.coinInc = 100;
            }
            var prodIDStr = "payments_lite_0" + id;
            FB.ui({
                method: 'pay',
                action: 'purchaseiap',
                product_id: prodIDStr,
                developer_payload: 'this_is_a_test_payload'
            }, _this.fbIAPResponse // Callback function
            );
        };
        _this.fbIAPResponse = function (response) {
            console.log("FB.ui pay response: ");
            console.log(response);
            if (typeof response == 'undefined') {
                console.log("fbIAPResponse is undefined");
                return;
            }
            if (response.hasOwnProperty("error_message")) {
                console.log("Error in FB.ui pay!");
            } else {
                _this.purchaseToken = response.purchase_token;
                // call the FB api to consume the purchase
                FB.api('/' + _this.purchaseToken + '/consume', // Replace the PURCHASE_TOKEN
                'post', { access_token: singleton_1.default.player.FBAccessToken }, // Replace with a user access token
                _this.fbConsumeResponse);
                // and send up the request to the hud to award the coins
                var pos = _this.toGlobal(_this.btnBuy.position);
                var myEvent = new CustomEvent("buyGold", {
                    'detail': { "amount": _this.purchaseAmount, "inc": _this.coinInc, "x": pos.x + _this.btnBuy.width / 2, "y": pos.y + _this.btnBuy.height / 2 }
                });
                window.dispatchEvent(myEvent);
            }
        };
        _this.fbConsumeResponse = function (response) {
            console.log("fbConsumeResponse: ");
            console.log(response);
        };
        _this.coinCallBack = function (id) {
            // loop through cards and unhihlight cards not of this id
            for (var i = 0; i < _this.cards.length; i++) {
                if (_this.cards[i].getID() != id) _this.cards[i].removeGlow();
            }
            _this.clickID = id;
        };
        return _this;
    }
    popCoinStore.prototype.init = function () {
        _super.prototype.init.call(this); // background and x button
        // baked cards for now, later this will be data driven from some kind of store config file
        var card = new storecard_1.default("10", "$0.99", 1, 2, this.coinCallBack, "smMoney.png");
        card.x = 114;
        card.y = 85;
        this.addChild(card);
        this.cards.push(card);
        card = new storecard_1.default("30", "$1.99", 2, 2, this.coinCallBack, "medMoney1.png");
        card.x = 239;
        card.y = 85;
        this.addChild(card);
        this.cards.push(card);
        card = new storecard_1.default("70", "$4.99", 3, 2, this.coinCallBack, "medMoney1.png");
        card.x = 365;
        card.y = 85;
        this.addChild(card);
        this.cards.push(card);
        card = new storecard_1.default("300", "$9.99", 4, 2, this.coinCallBack, "medMoney2.png");
        card.x = 114;
        card.y = 278;
        this.addChild(card);
        this.cards.push(card);
        card = new storecard_1.default("600", "$19.99", 5, 2, this.coinCallBack, "medMoney2.png");
        card.x = 239;
        card.y = 278;
        this.addChild(card);
        this.cards.push(card);
        card = new storecard_1.default("1,500", "$49.99", 6, 2, this.coinCallBack, "lrgMoney.png");
        card.x = 365;
        card.y = 278;
        this.addChild(card);
        this.cards.push(card);
        this.btnBuy = new button_1.default(PIXI.Texture.fromFrame("btnLong.png"), false, "Buy", 24);
        this.btnBuy.x = 368;
        this.btnBuy.y = 499;
        this.addChild(this.btnBuy);
        this.btnBuy.on('click', this.onBuy);
        this.badgeBestValue = new PIXI.Sprite(PIXI.Texture.fromFrame("bestValue.png"));
        this.badgeBestValue.scale.x = this.badgeBestValue.scale.y = 0.5;
        this.badgeBestValue.x = 93;
        this.badgeBestValue.y = 410;
        this.addChild(this.badgeBestValue);
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        this.title = new PIXI.Text("Coin Store", styleb);
        this.title.x = this.bg.width / 2 - this.title.width / 2;
        this.title.y = 30;
        this.addChild(this.title);
        this.charPrizeAgent = new PIXI.Sprite(PIXI.Texture.fromFrame("Prize Agent 300x450.png"));
        this.charPrizeAgent.x = 472;
        this.charPrizeAgent.y = 31;
        this.addChild(this.charPrizeAgent);
    };
    return popCoinStore;
}(popup_1.default);
exports.default = popCoinStore;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// StoreCard - class to display a store item
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
var filters = __webpack_require__(12);
var StoreCard = /** @class */function (_super) {
    __extends(StoreCard, _super);
    function StoreCard(name, price, id, coin, cb, imageName) {
        if (cb === void 0) {
            cb = null;
        }
        if (imageName === void 0) {
            imageName = "";
        }
        var _this = _super.call(this) || this;
        _this.glowing = false;
        _this.callBack = null;
        _this.onMouseDown = function () {
            // apply glow filter
            _this.filters = [_this.glow];
            _this.glowing = true;
            if (_this.callBack != null) _this.callBack(_this.itemID); // call the call back with our item id
        };
        _this.cardBack = new PIXI.Sprite(PIXI.Texture.fromFrame("cardBack.png"));
        _this.addChild(_this.cardBack);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });
        _this.itemID = id;
        // coin 1 = silver, coin 2 = gold, coin 0 = display no coin
        if (coin == 1) _this.coinIcon = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));else if (coin == 2) _this.coinIcon = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
        if (coin != 0) {
            _this.coinIcon.x = 34 - _this.coinIcon.width / 2;
            _this.coinIcon.y = 17 - _this.coinIcon.height / 2;
            _this.addChild(_this.coinIcon);
        }
        if (imageName != "") {
            // add an image with indicated name to the frame
            // center based off the 90x145 space on the card from position 15,34
            _this.itemImage = new PIXI.Sprite(PIXI.Texture.fromFrame(imageName));
            _this.itemImage.x = 15 + 45 - _this.itemImage.width / 2;
            _this.itemImage.y = 34 + 72 - _this.itemImage.height / 2;
            _this.addChild(_this.itemImage);
        }
        _this.txtName = new PIXI.Text(name, style);
        _this.txtName.x = 48;
        _this.txtName.y = 1;
        _this.addChild(_this.txtName);
        _this.txtPrice = new PIXI.Text(price, style);
        _this.txtPrice.x = 39;
        _this.txtPrice.y = 151;
        _this.addChild(_this.txtPrice);
        _this.interactive = true;
        _this.on('mousedown', _this.onMouseDown);
        _this.glow = new filters.GlowFilter(10, 1, 1, 0xFFFFFF);
        _this.callBack = cb;
        return _this;
    }
    StoreCard.prototype.getID = function () {
        return this.itemID;
    };
    StoreCard.prototype.isGlowing = function () {
        return this.glowing;
    };
    StoreCard.prototype.removeGlow = function () {
        this.filters = [];
    };
    return StoreCard;
}(PIXI.Container);
exports.default = StoreCard;

/***/ }),
/* 30 */
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
// popProvisioner class for buying selling provisions in town. This is where the player will
//                  sell the stuff in their boat hold and buy ships provisions for thier boat
//
var PIXI = __webpack_require__(0);
var popup_1 = __webpack_require__(3);
var button_1 = __webpack_require__(2);
var economyicon_1 = __webpack_require__(9);
var singleton_1 = __webpack_require__(1);
var popmsgbox_1 = __webpack_require__(8);
var popWarehouse = /** @class */function (_super) {
    __extends(popWarehouse, _super);
    function popWarehouse() {
        var _this = _super.call(this) || this;
        _this.holdIcons = [];
        _this.wareIcons = [];
        _this.wareOver = function (e) {
            var eIcon = e.target;
            var name = eIcon.getName();
            var itemID = eIcon.getType();
            var price = singleton_1.default.getMarketItemPrice(itemID);
            _this.txtMouseOver.text = name;
            _this.txtOverAmount.text = price.toString();
        };
        _this.wareClicked = function (e) {
            var eIcon = e.target;
            var itemID = eIcon.getType();
            var price = singleton_1.default.getMarketItemPrice(itemID);
            if (singleton_1.default.player.getSilver() >= price) {
                // add the icon to their hold
                if (!singleton_1.default.ship.addToHold(itemID, 0)) {
                    // no room! abort
                    var msg = new popmsgbox_1.default();
                    msg.initMsg(0, "1st Mate", "Hold is full captain! We'll have to sell items to make room.");
                    singleton_1.default.popupManager.displayPopup(msg);
                } else {
                    // charge the user
                    singleton_1.default.player.decSilver(price);
                    // remove the icon from the warehouse
                    var i;
                    for (i = _this.wareIcons.length - 1; i >= 0; i--) {
                        if (_this.wareIcons[i] == eIcon) {
                            _this.wareIcons.splice(i, 1);
                            var data = singleton_1.default.getPortWarehouseData(singleton_1.default.currentPort);
                            data.items.splice(i, 1); // remove from the warehouse data as well
                            break;
                        }
                    }
                    eIcon.interactive = false;
                    eIcon.parent.removeChild(eIcon);
                    _this.reloadHold();
                }
            } else {
                var msg = new popmsgbox_1.default();
                msg.initMsg(0, "1st Mate", "We dont have enough silver for that Cap'n! Price: " + price);
                singleton_1.default.popupManager.displayPopup(msg);
            }
        };
        _this.iconClicked = function (e) {
            e.target.glowToggle();
            _this.calculateTotalSellPrice();
        };
        _this.onSell = function (e) {
            // sell all glowing icons
            // loop over the hold backwards
            var amount = _this.calculateTotalSellPrice();
            if (amount <= 0) return; // do nothing, nothign selected
            // and send up the request to the hud to award the coins
            var pos = _this.toGlobal(_this.sellCoin.position);
            var myEvent = new CustomEvent("merchSell", {
                'detail': { "amount": amount, "x": pos.x + _this.sellCoin.width / 2, "y": pos.y + _this.sellCoin.height / 2 }
            });
            window.dispatchEvent(myEvent);
            var i;
            var hold = singleton_1.default.ship.getHold();
            // loop from end as splice will change indeces if looped front to back
            for (i = _this.holdIcons.length - 1; i >= 0; i--) {
                if (_this.holdIcons[i].isGlowing()) {
                    _this.removeChild(_this.holdIcons[i]);
                    _this.holdIcons.splice(i, 1);
                    hold.splice(i, 1);
                }
            }
            _this.loadHold(false); // flag to just reposition existing items
            _this.txtAmount.text = "0";
        };
        return _this;
    }
    popWarehouse.prototype.init = function () {
        _super.prototype.init.call(this); // add backdrop and x buttton
        this.mercBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.mercBack.x = 336 - this.mercBack.width / 2;
        this.mercBack.y = 173 - this.mercBack.height / 2;
        this.addChild(this.mercBack);
        this.holdBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.holdBack.x = 336 - this.holdBack.width / 2;
        this.holdBack.y = 397 - this.holdBack.height / 2;
        this.addChild(this.holdBack);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        var lbl = new PIXI.Text('Warehouse:', style);
        lbl.x = this.mercBack.x;
        lbl.y = this.mercBack.y - lbl.height - 2;
        this.addChild(lbl);
        lbl = new PIXI.Text('Hold:', style);
        lbl.x = this.holdBack.x;
        lbl.y = this.holdBack.y - lbl.height - 2;
        this.addChild(lbl);
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        var townName = singleton_1.default.currentPort;
        lbl = new PIXI.Text(townName + ' Warehouse', styleb);
        lbl.x = this.mercBack.x + this.mercBack.width / 2 - lbl.width / 2;
        lbl.y = 20;
        this.addChild(lbl);
        this.sellBtn = new button_1.default(PIXI.Texture.fromFrame("sellBtn.png"));
        this.sellBtn.x = 531;
        this.sellBtn.y = 285;
        this.sellBtn.scale.x = this.sellBtn.scale.y = 0.67;
        this.sellBtn.on('click', this.onSell);
        this.addChild(this.sellBtn);
        this.sellCoin = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.sellCoin.x = 422 - this.sellCoin.width / 2;
        this.sellCoin.y = 285 - this.sellCoin.height / 2;
        this.addChild(this.sellCoin);
        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });
        this.txtAmount = new PIXI.Text('0', stylec);
        this.txtAmount.x = this.sellCoin.x + this.sellCoin.width + 5;
        this.txtAmount.y = this.sellCoin.y + this.sellCoin.height / 2 - this.txtAmount.height / 2;
        this.addChild(this.txtAmount);
        var styled = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 18,
            fill: 'black'
        });
        lbl = new PIXI.Text("Resupply In:", styled);
        lbl.x = 251;
        lbl.y = 56;
        this.addChild(lbl);
        this.txtResupplyTimer = new PIXI.Text("00:00:00", styled);
        this.txtResupplyTimer.x = lbl.x + lbl.width + 3;
        this.txtResupplyTimer.y = 56;
        this.addChild(this.txtResupplyTimer);
        this.txtMouseOver = new PIXI.Text("Mouse Over Description", styled);
        this.txtMouseOver.x = 209;
        this.txtMouseOver.y = 495;
        this.addChild(this.txtMouseOver);
        this.overCoin = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.overCoin.x = 422 - this.overCoin.width / 2;
        this.overCoin.y = 508 - this.overCoin.height / 2;
        this.addChild(this.overCoin);
        this.txtOverAmount = new PIXI.Text('0', stylec);
        this.txtOverAmount.x = this.overCoin.x + this.overCoin.width + 5;
        this.txtOverAmount.y = this.overCoin.y + this.overCoin.height / 2 - this.txtOverAmount.height / 2;
        this.addChild(this.txtOverAmount);
        this.goldCoin = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
        this.goldCoin.x = 539 - this.goldCoin.width / 2;
        this.goldCoin.y = 61 - this.goldCoin.height / 2;
        this.addChild(this.goldCoin);
        this.txtResupplyAmount = new PIXI.Text('10', style);
        this.txtResupplyAmount.x = this.goldCoin.x + this.goldCoin.width + 5;
        this.txtResupplyAmount.y = this.goldCoin.y + this.goldCoin.height / 2 - this.txtResupplyAmount.height / 2;
        this.addChild(this.txtResupplyAmount);
        this.buyNow = new button_1.default(PIXI.Texture.fromFrame("btnLong.png"), false, "Resupply", 18);
        this.buyNow.width = 55;
        this.buyNow.height = 28;
        this.buyNow.x = 494;
        this.buyNow.y = 64;
        this.addChild(this.buyNow);
        this.loadHold();
        this.displayWares();
    };
    popWarehouse.prototype.reloadHold = function () {
        // remove all icons
        var i, e;
        for (i = this.holdIcons.length - 1; i >= 0; i--) {
            e = this.holdIcons.pop();
            this.removeChild(e);
        }
        this.loadHold();
    };
    popWarehouse.prototype.loadHold = function (createIcons) {
        if (createIcons === void 0) {
            createIcons = true;
        }
        var hold = singleton_1.default.ship.getHold();
        var e;
        for (var i = 0; i < hold.length; i++) {
            if (createIcons) e = new economyicon_1.default(hold[i].type, i, false, hold[i].rarity);else e = this.holdIcons[i];
            // place in our 10x4 grid
            e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
            e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
            e.x += this.holdBack.x + 10;
            e.y += this.holdBack.y + 4;
            if (createIcons) {
                e.interactive = true;
                e.on('click', this.iconClicked);
                e.on('mouseover', this.wareOver);
                this.holdIcons.push(e);
                this.addChild(e);
            }
        }
    };
    popWarehouse.prototype.displayWares = function () {
        // warehouse sells lowest demand items generated on the singleton
        var data = singleton_1.default.getPortWarehouseData(singleton_1.default.currentPort);
        var i, e;
        for (i = 0; i < data.items.length; i++) {
            e = new economyicon_1.default(data.items[i], 0, false, 0);
            e.x = i % 10 * 42 + i % 10 * 3 + 21; // icons are center anchor
            e.y = Math.floor(i / 10) * 42 + Math.floor(i / 10) * 3 + 21; // adjust for center anchor
            e.x += this.mercBack.x + 10;
            e.y += this.mercBack.y + 4;
            this.addChild(e);
            e.interactive = true;
            e.on('click', this.wareClicked);
            e.on('mouseover', this.wareOver);
            this.wareIcons.push(e);
        }
    };
    popWarehouse.prototype.redisplayWares = function () {
        var i;
        for (i = 0; i < this.wareIcons.length; i++) {}
    };
    popWarehouse.prototype.calculateTotalSellPrice = function () {
        // loop through the icons, add price from hold item for those glowing
        var i;
        var price = 0;
        var hold = singleton_1.default.ship.getHold();
        for (i = 0; i < this.holdIcons.length; i++) {
            if (this.holdIcons[i].isGlowing()) {
                price += hold[i].getMarketPrice();
            }
        }
        // display this price in our txtlabel
        this.txtAmount.text = price.toString();
        return price;
    };
    return popWarehouse;
}(popup_1.default);
exports.default = popWarehouse;

/***/ }),
/* 31 */
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
// popMarket - popup to display MarketItem market values for economy icons at the current port
//
var PIXI = __webpack_require__(0);
var popup_1 = __webpack_require__(3);
var button_1 = __webpack_require__(2);
var marketitem_1 = __webpack_require__(32);
var singleton_1 = __webpack_require__(1);
var economyitem_1 = __webpack_require__(7);
var popMarket = /** @class */function (_super) {
    __extends(popMarket, _super);
    function popMarket() {
        var _this = _super.call(this) || this;
        _this.marketItems = [];
        _this.pageIndex = 0; // index of the market item for this page of results
        _this.onPageDown = function () {
            _this.pageIndex += 8;
            if (_this.pageIndex > 55) _this.pageIndex -= 8;
            _this.displayPage();
        };
        _this.onPageUp = function () {
            _this.pageIndex -= 8;
            if (_this.pageIndex < 0) _this.pageIndex = 0;
            _this.displayPage();
        };
        _this.itemOver = function (e) {
            var item = e.target;
            //console.log(e);
            if (item) {
                _this.txtMouseOver.text = item.getName();
                _this.txtPrice.text = item.getPrice().toString();
            }
        };
        return _this;
    }
    popMarket.prototype.init = function () {
        _super.prototype.init.call(this); // background and X button with handler
        var data = this.getMarketData();
        var i, m, rate, up;
        for (i = 0; i < economyitem_1.default.maxItems; i++) {
            rate = data[i].rate;
            up = data[i].up;
            m = new marketitem_1.default(i, rate, up);
            this.addChild(m);
            if (i < 8) {
                m.x = 113;
                m.y = 94 + i * (m.height + 5);
                m.visible = true;
            } else {
                m.visible = false;
            }
            //console.log("item: " + i + "rate: " + rate + " up: " + up);
            m.interactive = true;
            m.on('mouseover', this.itemOver);
            this.marketItems.push(m);
        }
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        var town = singleton_1.default.currentPort;
        var title = town + " Market";
        this.txtHeader = new PIXI.Text(title, styleb);
        this.txtHeader.x = this.bg.width / 2 - this.txtHeader.width / 2;
        this.txtHeader.y = 40;
        this.addChild(this.txtHeader);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        this.txtMouseOver = new PIXI.Text("Mouse over icons to see price information.", style);
        this.txtMouseOver.x = 268;
        this.txtMouseOver.y = 480;
        this.addChild(this.txtMouseOver);
        this.coin = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.coin.x = 127 - this.coin.width / 2;
        this.coin.y = 499 - this.coin.height / 2;
        this.addChild(this.coin);
        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });
        this.txtPrice = new PIXI.Text("0", stylec);
        this.txtPrice.x = this.coin.x + this.coin.width + 20;
        this.txtPrice.y = 480;
        this.addChild(this.txtPrice);
        this.pageDown = new button_1.default(PIXI.Texture.fromFrame("uiArrow.png"));
        this.pageDown.x = 696;
        this.pageDown.y = 463;
        this.addChild(this.pageDown);
        this.pageDown.on('click', this.onPageDown);
        this.pageUp = new button_1.default(PIXI.Texture.fromFrame("uiArrow.png"));
        this.pageUp.rotation = Math.PI; // 180 degrees
        this.pageUp.x = 696;
        this.pageUp.y = 103;
        this.addChild(this.pageUp);
        this.pageUp.on('click', this.onPageUp);
    };
    popMarket.prototype.displayPage = function () {
        // display 8 market items from pageIndex member, hide all others
        var i, k, m;
        for (i = 0; i < this.marketItems.length; i++) {
            m = this.marketItems[i];
            if (i >= this.pageIndex && i <= this.pageIndex + 7) {
                k = i - this.pageIndex;
                console.log("i:" + i + " k:" + k + " index: " + this.pageIndex);
                m.x = 113;
                m.y = 94 + k * (m.height + 5);
                m.visible = true;
            } else {
                m.visible = false;
            }
        }
    };
    popMarket.prototype.getMarketData = function () {
        // check on the singleton, if not there generate it
        var town = singleton_1.default.currentPort;
        var data = singleton_1.default.getPortMarketData(town);
        return data;
    };
    return popMarket;
}(popup_1.default);
exports.default = popMarket;

/***/ }),
/* 32 */
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
// MarketItem - container class for each market item displayed within the market popup
//
var PIXI = __webpack_require__(0);
var economyicon_1 = __webpack_require__(9);
var MarketItem = /** @class */function (_super) {
    __extends(MarketItem, _super);
    function MarketItem(itemid, marketRate, up) {
        var _this = _super.call(this) || this;
        if (up) _this.bullbear = new PIXI.Sprite(PIXI.Texture.fromFrame("bull.png"));else _this.bullbear = new PIXI.Sprite(PIXI.Texture.fromFrame("bear.png"));
        _this.item = new economyicon_1.default(itemid, 0, false, 0);
        _this.item.x = 21;
        _this.item.y = 21;
        _this.addChild(_this.item);
        _this.bullbear.x = -_this.bullbear.width - 5;
        _this.addChild(_this.bullbear);
        _this.addPips(marketRate);
        _this.rate = marketRate;
        return _this;
    }
    MarketItem.prototype.addPips = function (rate) {
        // 10 pips.. each is 10% value...
        var fullPips = Math.floor(rate / 10);
        var empties = 10 - fullPips;
        var exact = rate % 10 * 10 / 100;
        var xSpot = this.item.x + this.item.width / 2 + 5; // econicons are center anchor
        // add full pips
        var pip, i;
        for (i = 0; i < fullPips; i++) {
            pip = new PIXI.Graphics();
            pip.beginFill(0x705337);
            pip.drawCircle(21, 21, 21);
            pip.endFill();
            pip.x = xSpot;
            pip.y = 0;
            xSpot += 47;
            this.addChild(pip);
        }
        // add the exact pip
        if (exact != 0) {
            this.exact = new PIXI.Container();
            pip = new PIXI.Graphics();
            pip.beginFill(0x705337);
            pip.drawCircle(21, 21, 21);
            pip.endFill();
            pip.x = 0;
            pip.y = 0;
            this.exact.addChild(pip);
            var mask = new PIXI.Graphics();
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, 42, 42);
            mask.x = -(42 * (1 - exact));
            this.exact.addChild(mask);
            this.exact.mask = mask;
            this.exact.x = xSpot;
            this.addChild(this.exact);
        }
        // add empty pips
        for (i = 0; i < empties; i++) {
            pip = new PIXI.Graphics();
            pip.lineStyle(1, 0x705337); //(thickness, color)
            pip.drawCircle(21, 21, 21);
            pip.endFill();
            pip.x = xSpot;
            xSpot += 47;
            this.addChild(pip);
        }
    };
    MarketItem.prototype.getName = function () {
        return this.item.getName();
    };
    MarketItem.prototype.getPrice = function () {
        var p = this.item.getPrice();
        return Math.floor(p + Math.ceil(p * this.rate / 100));
    };
    return MarketItem;
}(PIXI.Container);
exports.default = MarketItem;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// BannerToolTip class for mouse over info on islands on the map
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
var BannerToolTip = /** @class */function (_super) {
    __extends(BannerToolTip, _super);
    function BannerToolTip() {
        var _this = _super.call(this) || this;
        _this.lastTime = 0;
        return _this;
    }
    BannerToolTip.prototype.init = function (label) {
        if (label === void 0) {
            label = "none";
        }
        this.banner = new PIXI.Sprite(PIXI.Texture.fromFrame("parchBanner.png"));
        this.banner.x = -123;
        this.banner.y = -159;
        this.addChild(this.banner);
        this.flagPole = new PIXI.Sprite(PIXI.Texture.fromFrame("flagPole.png"));
        this.flagPole.x = -2;
        this.flagPole.y = -130;
        this.addChild(this.flagPole);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        this.txtBanner = new PIXI.Text(label, style);
        this.txtBanner.x = -84 + 85 - this.txtBanner.width / 2;
        this.txtBanner.y = -155;
        this.addChild(this.txtBanner);
        this.displacementTexture = PIXI.loader.resources["images/2yYayZk.png"].texture;
        this.displacementTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementSprite = new PIXI.Sprite(this.displacementTexture);
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        this.portFlag = new PIXI.Sprite(PIXI.Texture.fromFrame("flagAntigua.png"));
        this.portFlag.scale.x = this.portFlag.scale.y = 0.5;
        this.portFlagContainer = new PIXI.Container();
        this.portFlagContainer.addChild(this.portFlag);
        this.portFlagContainer.x = -this.portFlag.width - 3;
        this.portFlagContainer.y = -80;
        this.portFlagContainer.addChild(this.displacementSprite);
        this.portFlagContainer.filters = [this.displacementFilter];
        this.addChild(this.portFlagContainer);
        this.natFlag = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagEnglish.png"));
        this.natFlag.scale.x = this.natFlag.scale.y = 0.5;
        this.natFlagContainer = new PIXI.Container();
        this.natFlagContainer.addChild(this.natFlag);
        this.natFlagContainer.x = -this.natFlag.width - 3;
        this.natFlagContainer.y = -120;
        this.natFlagContainer.addChild(this.displacementSprite);
        this.natFlagContainer.filters = [this.displacementFilter];
        this.addChild(this.natFlagContainer);
    };
    BannerToolTip.prototype.changeLabel = function (newLabel) {
        this.txtBanner.text = newLabel;
        this.txtBanner.x = -84 + 85 - this.txtBanner.width / 2;
    };
    BannerToolTip.prototype.changePortFlag = function (newFlag) {
        if (this.txtBanner.text != "Shaman Island") {
            //console.log("changePortFlag to: " + newFlag);
            this.portFlag.texture = PIXI.Texture.fromFrame(newFlag);
            this.portFlagContainer.visible = true;
            this.natFlagContainer.visible = true;
            // exception flags are wider and need more space off the flagpole
            if (newFlag == "flagStLucia.png" || newFlag == "flagDeeps.png" || newFlag == "flagGrenada.png" || newFlag == "flagDominica.png" || newFlag == "flagBVI.png") {
                this.portFlagContainer.x = -this.portFlag.width - 8;
            } else {
                this.portFlagContainer.x = -this.portFlag.width - 3;
            }
        } else {
            this.portFlagContainer.visible = false;
            this.natFlagContainer.visible = false;
        }
    };
    BannerToolTip.prototype.changeNatFlag = function (newFlag) {
        if (this.txtBanner.text != "Shaman Island") {
            //console.log("changePortFlag to: " + newFlag);
            this.natFlag.texture = PIXI.Texture.fromFrame(newFlag);
        }
    };
    BannerToolTip.prototype.update = function () {
        var deltaTime = 0;
        var now = Date.now();
        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
            // rotate
            //this.rotation += 0.1;
        }
        // record lastTime
        this.lastTime = now;
        // displace the flags at all times
        this.displacementSprite.x += 1; // * this.luffDir;
        this.displacementSprite.y += 1;
    };
    return BannerToolTip;
}(PIXI.Container);
exports.default = BannerToolTip;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//
// PopupManager class to manage queued popup windows
//

Object.defineProperty(exports, "__esModule", { value: true });
var popmsgbox_1 = __webpack_require__(8);
var singleton_1 = __webpack_require__(1);
var PopupManager = /** @class */function () {
    function PopupManager() {
        var _this = this;
        this.popupStack = [];
        this.popIt = function () {
            var pop = _this.popupStack.pop();
            _this.container.removeChild(pop);
            if (_this.popupStack.length == 0) singleton_1.default.uiDisplayed = false;
            if (_this.popupStack.length != 0) {
                var top = _this.popupStack[_this.popupStack.length - 1];
                top.top();
            }
        };
    }
    PopupManager.prototype.setContainer = function (container) {
        this.container = container;
    };
    PopupManager.prototype.displayPopup = function (newpop) {
        newpop.init();
        if (this.popupStack.length != 0) {
            var top = this.popupStack[this.popupStack.length - 1];
            top.backgrounded();
        }
        this.popupStack.push(newpop);
        newpop.setManagerClose(this.popIt);
        var p = new PIXI.Point();
        if (newpop instanceof popmsgbox_1.default) {
            // position in lower left
            p.x = 0;
            p.y = window.innerHeight - newpop.height;
        } else {
            p.x = window.innerWidth / 2 - newpop.width / 2;
            p.y = window.innerHeight / 2 - newpop.height / 2;
        }
        var loc = this.container.toLocal(p);
        newpop.x = loc.x;
        newpop.y = loc.y;
        if (newpop.y < 0) newpop.y = 0;
        this.container.addChild(newpop);
        singleton_1.default.uiDisplayed = true;
    };
    return PopupManager;
}();
exports.default = PopupManager;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map