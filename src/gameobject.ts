//
// GameObject - the root class of all sprites
//
import * as PIXI from "pixi.js";

export const enum ObjectType {
    NONE,
    ISLAND,
    SHIP
}

export default class GameObject
{
    // the game object's sprite keeps positional information  x,y

    protected vx:number = 0; // velocity information
    protected vy:number = 0;

    protected z:number = 0;  // z-sorting if necessary... z sort normally done by y position

    protected objType:ObjectType = ObjectType.NONE;

    protected sprite:PIXI.Sprite;

    constructor()
    {
        
    }

    public setSprite(newSprite:PIXI.Sprite)
    {
        this.sprite = newSprite;
    }

    public getSprite()
    {
        return this.sprite;
    }
}