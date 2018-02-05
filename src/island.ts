import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Victor = require('victor');
import SingletonClass from './singleton';

export default class Island extends GameObject
{
    private islandData:any; // json data loaded by theSea and passed to us
    private _isPort:boolean = false;
    private over:boolean = false;

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
            //console.log("Found port: " + this.islandData.portName);
            // make the sprite interactive so mouseover will work for it
            this.sprite.interactive = true;
            this.sprite.on('mouseover', this.overIsle);
            this.sprite.on('mouseout', this.outIsle);
        }

        // set the pivot point from the data
        // this.sprite.pivot.x = this.islandData.refPt[0];
        // this.sprite.pivot.x = this.islandData.refPt[1];
    }

    overIsle = (e:any) => {
        // mouse over our isle has happened, trigger event with our coords
        if (!this.over)
        {
            this.over = true;
            if (!SingletonClass.uiDisplayed)
            {
                var refX = this.sprite.x + this.islandData.refPt[0];
                var refY = this.sprite.y + this.islandData.refPt[1];
                var obj = {x:refX, y:refY, isleName:this.islandData.portName, portFlag:this.islandData.portFlag};
                var myEvent = new CustomEvent("mouseOverIsle",
                {
                    'detail': obj
                });
        
                window.dispatchEvent(myEvent); 
            }
        }
    }

    outIsle = (e:any) => {
        // mouse left our isle, trigger event with our coords
        if (this.over)
        {
            this.over = false;
            if (!SingletonClass.uiDisplayed)
            {
                var myEvent = new CustomEvent("mouseOutIsle",
                {
                    'detail': this.islandData.portName
                });
        
                window.dispatchEvent(myEvent); 
            }
        }
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