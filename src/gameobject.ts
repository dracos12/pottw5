//
// GameObject - the root class of all sprites
//
import * as PIXI from "pixi.js";

export const enum ObjectType {
    NONE,
    ISLAND,
    SHIP
}

declare var PolyK: any;

export default class GameObject
{
    // the game object's sprite keeps positional information  x,y

    protected vx:number = 0; // velocity information
    protected vy:number = 0;

    protected z:number = 0;  // z-sorting if necessary... z sort normally done by y position

    protected objType:ObjectType = ObjectType.NONE;

    protected sprite:PIXI.Sprite;

    protected polyData:any; // use any for ease of use with PolyK

    constructor()
    {
        
    }

    public getType() {
        return this.objType;
    }

    public setSprite(newSprite:PIXI.Sprite)
    {
        this.sprite = newSprite;
    }

    public getSprite()
    {
        return this.sprite;
    }

    public setPolyData(p:any) {
        this.polyData = p;
        this.convertPolyDataToCartesian();
    }

    private convertPolyDataToCartesian()
    {
        // all data provided is an anti-clockwise polygonal data in local bitmap coordinates 
        // relative to the 0,0 top,left of the bitmap
        // PolyK needs this data in cartesian format, with 0,0 at bottom,left of the world

        //console.log(this.polyData);
        // loop through the array
        for (var i = 0; i<this.polyData.length; i++)
        {
            if (i%2 == 0) // each even index is an "x" coordinate
            {
                // x axis is same direction as cartesian
                this.polyData[i] = this.polyData[i] + this.sprite.x; // world coord x
            }
            else // each odd index is a "y" coordinate
            {
                // bottom left of our "world" is 0,8192
                var cartSpriteY = 8192 - this.sprite.y; 
                this.polyData[i] = cartSpriteY - this.polyData[i];
            }   
        }
        //console.log(this.polyData);
    }

    public cartesianHitTest = (p:PIXI.Point) => {
        //console.log(this.polyData);
        if (this.polyData) {
            // point assumed to be in cartesian coords... compare this to our polyData via PolyK library
            return PolyK.ContainsPoint(this.polyData, p.x, p.y);
        } else {
            console.log("polyData not yet defined");
        }
    }

    update()
    {
        // NOP for base class functionality
    }
}