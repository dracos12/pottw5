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
declare var Power2:any;
declare var Circ:any;

export const enum EcoType {
    ANCHOR,
    ANIMALHIDES,
    BARREL
}

export default class EconomyIcon extends PIXI.Sprite
{
    private type:EcoType = EcoType.ANCHOR;
    private static jsonData:any;
    private id:number;

    constructor(type:EcoType, id:number)
    {
        super();
        // create a sprite with the indicated type
        this.type = type;
        //this.texture = PIXI.Texture.fromFrame(EconomyIcon.jsonData[this.type].fileName);
        this.texture = PIXI.Texture.fromFrame("icon_Barrel.png");
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.id=id;
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

        x = this.x + dir.x * 115;
        y = this.y + -dir.y * 115; 

        if (rand == 1)
            midX = this.x + 57;
        else    
            midX = this.x - 57;
            
        midY = this.y - 115;


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
        // now animate y up and down yoyo style
        TweenMax.to(this,
                    1.25,
                    {y: this.y + 30,
                     yoyo:true,
                     repeat:-1,
                     ease: Linear.easeInOut});
        // and the rotate 
        TweenMax.to(this,
            1.5,
            {rotation: 0.523599,
             yoyo: true,
             repeat: -1,
             ease: Linear.easeInOut});

        this.interactive = true;
        this.on("click", this.clickHandler);
    }

    clickHandler = () => {
        // send a note to the hud to collect us
        var myEvent = new CustomEvent("floatingIconClick",
        {
            'detail': this.id
        });

        window.dispatchEvent(myEvent);
    }

    public lootIcon(xp:number, yp:number)
    {
        console.log("lootIcon to: " + xp + "," + yp);
        TweenMax.killTweensOf(this);
        TweenMax.to(this,1,{x:xp, y:yp,onComplete:this.lootDone});
        TweenMax.to(this.scale, 1, {x:0,y:0})
    }

    lootDone = () => {
        TweenMax.killTweensOf(this);
        this.interactive = false;
        // send a note to the hud to collect us
        var myEvent = new CustomEvent("lootDone",
        {
            'detail': this.id
        });

        window.dispatchEvent(myEvent);
        
    }
}