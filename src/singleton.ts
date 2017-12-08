//
// singleton for static/global objects
//
import Player from './player';
import Ship from './ship';
import PopupManager from './popupmanager';
import theSea from './theSea';

export default class SingletonClass {
    private static _instance:SingletonClass = new SingletonClass();

    private static playerObject:Player = new Player(); // instantiate the player object
    private static playerShip:Ship; // maintained by the mainhud
    private static _popupManager:PopupManager;
    private static _currentPort:string = "";
    private static _marketData:any = {};

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

    public static generateMarketData(portName:string)
    {

        // generate the data and store it on the singleton
        var i, rate, up;
        let data:any = {};
        for (i=0; i<8; i++)
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
}

