//
// singleton for static/global objects
//
import Player from './player';
import Ship from './ship';
import PopupManager from './popupmanager';
import theSea from './theSea';
import EconomyItem from './economyitem';

export default class SingletonClass {
    private static _instance:SingletonClass = new SingletonClass();

    private static playerObject:Player = new Player(); // instantiate the player object
    private static playerShip:Ship; // maintained by the mainhud
    private static _popupManager:PopupManager;
    private static _currentPort:string = "";
    private static _marketData:any = {};
    private static _warehouseData:any = {};
    private static _uiDisplayed:boolean = false;

    constructor() {
        if(SingletonClass._instance){
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        SingletonClass._instance = this;
    }

    public static getInstance():SingletonClass
    {
        return SingletonClass._instance;
    }

    public static get ship()
    {
        return SingletonClass.playerShip;
    }

    public SetShip(newShip:Ship)
    {
        SingletonClass.playerShip = newShip;
    }

    public static get player()
    {
        return SingletonClass.playerObject;
    }

    public static get popupManager()
    {
        return this._popupManager;
    }

    public static set popupManager(newpopman:PopupManager)
    {
        this._popupManager = newpopman;
    }

    public static get currentPort()
    {
        return this._currentPort;
    }

    public static set currentPort(newPort:string)
    {
        this._currentPort = newPort;
    }

    public static get uiDisplayed()
    {
        return this._uiDisplayed;
    }

    public static set uiDisplayed(isVis:boolean)
    {
        this._uiDisplayed = isVis;
    }

    public static getPortMarketData(portName:string)
    {
        //console.log(this._marketData);
        if(this._marketData.hasOwnProperty(portName))
        {
            return this._marketData[portName]; // return the object for this port data
        } else {
            SingletonClass.generateMarketData(portName);
            return this._marketData[portName];
        }
    }

    public static setPortMarketData(portName:string, dataObj:any)
    {
        this._marketData[portName] = dataObj;
    }

    public static setPortWarehouseData(portName:string, dataObj:any)
    {
        this._warehouseData[portName] = dataObj;
    }

    public static generateMarketData(portName:string)
    {

        // generate the data and store it on the singleton
        var i, rate, up;
        let data:any = {};
        for (i=0; i<EconomyItem.maxItems; i++)
        {
            rate = theSea.getRandomIntInclusive(0,100);
            if (theSea.getRandomIntInclusive(0,1) == 1)
                up = true;
            else
                up = false;
            data[i] = {rate: rate, up: up};
        }

        // store this on the singletone with our town info
        SingletonClass.setPortMarketData(portName, data);
        //console.log("Generating market data for : " +  town);

        // return our generated object
        return data;
    }

    public static getPortWarehouseData(portName:string)
    {
        //console.log(this._marketData);
        if(this._warehouseData.hasOwnProperty(portName))
        {
            return this._warehouseData[portName]; // return the object for this port data
        } else {
            SingletonClass.generateWarehouseData(portName);
            return this._warehouseData[portName];
        }
    }
    private static rateComp(a:any, b:any)
    {
        return a.rate - b.rate;
    }

    public static generateWarehouseData(portName:string)
    {
        // get the market data for this port
        var marketData = SingletonClass.getPortMarketData(portName);

        // randomly generate items with the smallest rate (lowest demand)

        // generate an array of items and sort it on rate
        var k;
        var rateSort = [];
        for (k=0;k<EconomyItem.maxItems;k++)
        {
            rateSort.push({itemid:k, rate: marketData[k].rate});
        }
        rateSort.sort(this.rateComp);
        //console.log(rateSort);

        // generate the data and store it on the singleton
        var i,j, rate, up;
        let data:any = {};
        var items = [];
        var sampleIndex = 6; // array in descending order of demand, take the top 6 
        for (i=0; i<40; i++) // i is the item id
        {
            j = theSea.getRandomIntInclusive(0,sampleIndex);
            items.push(rateSort[j].itemid);
        }
        items.sort(); // sort ascending the list of itemids
        var now = Date.now();
        data = {lastTime:now, items:items};
        // store this on the singletone with our town info
        SingletonClass.setPortWarehouseData(portName, data);
        //console.log("Generating market data for : " +  town);

        // return our generated object
        return data;
    }

    public static getMarketItemPrice(itemID:number)
    {
        var marketPrice,value;
        // item price is in in the item data
        value = EconomyItem.jsonData[itemID].value;
        // modify this by the market rate at the current port
        var port = this._currentPort;
        var marketData = SingletonClass.getPortMarketData(port);
        marketPrice = Math.floor(value + Math.ceil(value *  marketData[itemID].rate / 100));
        // return the modified price
        return marketPrice;
    }
}

