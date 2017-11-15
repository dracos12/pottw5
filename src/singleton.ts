//
// singleton for static/global objects
//
import Player from './player';
import Ship from './ship';

export default class SingletonClass {
    private static _instance:SingletonClass = new SingletonClass();

    private static playerObject:Player;
    private static playerShip:Ship; // maintained by the mainhud

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
}

