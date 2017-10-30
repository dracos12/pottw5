//
// EconomyIcon class to override Sprite and provide visuals for the economic icons in the game
//

import * as PIXI from 'pixi.js';
import Victor = require('victor');
import theSea from './theSea';
import CompassRose from './compassrose';

//import {TweenMax, Linear} from 'gsap';

declare var TweenMax:any;
declare var Linear:any;

export const enum EcoType {
    ANCHOR,
    ANIMALHIDES,
    BARREL
}

export default class EconomyIcon extends PIXI.Sprite
{
    private type:EcoType = EcoType.ANCHOR;
    private static jsonData:any;

    constructor(type:EcoType)
    {
        super();
        // create a sprite with the indicated type
        this.type = type;
        //this.texture = PIXI.Texture.fromFrame(EconomyIcon.jsonData[this.type].fileName);
        this.texture = PIXI.Texture.fromFrame("icon_Barrel.png");
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }

    public static setEconomyData(jsonData:any)
    {
        this.jsonData = jsonData;
    }

    public throwOutAndBob()
    {
        // effect to throw the item out a bit on a curved path, random angle
        // upon reaching destination it will bob (up and down) and rotate slightly back and forth
        // simulating bobbing in water
        var dir = new Victor(1,0); // straight right
        var rand = theSea.getRandomIntInclusive(0,1);
        var randDir;
        var dirRads;
        var x,y, midX, midY;

        if (rand == 1) // throw right
        {
            dir.x = 1;
            dir.y = -0.5; // down and right, then rottate ccw by rand point
        }
        else // throw left
        {
            dir.x = -1;
            dir.y = 0.5; // up and left
        }

        randDir = theSea.getRandomIntInclusive(0,4) * 11.25; // random compass point
        dirRads = CompassRose.getRads(randDir);
        dir.rotate(dirRads);

        x = this.x + dir.x * 150;
        y = this.y + -dir.y * 150; 

        if (rand == 1)
            midX = this.x + 75;
        else    
            midX = this.x - 75;
            
        midY = this.y - 150;


        // move our position to this new x,y in an curve
        TweenMax.to(this, 
                    1, 
                    {bezier:{type: "thru", curviness:1.5, values:[{x:this.x, y:this.y}, {x:midX,y:midY}, {x:x, y:y}]}, 
                    ease:Linear.easeOut,
                    onComplete:this.bezierDone}
                    );
    }

    public bezierDone = () => {
        // when bezier done, bob in the water til clicked
        console.log("bezierDone!");
    }
}