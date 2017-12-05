import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Victor = require('victor');

export default class Island extends GameObject
{
    private islandData:any; // json data loaded by theSea and passed to us
    private _isPort:boolean = false;

    constructor()
    {
        super();
        this.objType = ObjectType.ISLAND;
    }

    public setData(data:any)
    {
        this.islandData = data;
        if (this.islandData.hasOwnProperty("port") && this.islandData.port == true)
        {
            this._isPort = true;
            console.log("Found port: " + this.islandData.portName);
        }

        // set the pivot point from the data
        // this.sprite.pivot.x = this.islandData.refPt[0];
        // this.sprite.pivot.x = this.islandData.refPt[1];
    }

    public isPort()
    {
        return this._isPort;
    }

    public getPortDest()
    {
        var x = this.sprite.x + this.islandData.portRef[0];
        var y = this.sprite.y + this.islandData.portRef[1];
        return new PIXI.Point(x,y);
    }

    public getPortDestVictor()
    {
        var x = this.sprite.x + this.islandData.portRef[0];
        var y = this.sprite.y + this.islandData.portRef[1];
        return new Victor(x,y);
    }

    public getName()
    {
        return this.islandData.portName;
    }
}