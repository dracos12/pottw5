//
// EconomyIcon class to override Sprite and provide visuals for the economic icons in the game
//

import * as PIXI from 'pixi.js';
import Victor = require('victor');
import theSea from './theSea';
import CompassRose from './compassrose';
import EconomyItem from './economyitem';

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

export default class EconomyIcon extends PIXI.Container
{
    private type:number = 0;
    private id:number;
    private icon:PIXI.Sprite;   // the icon
    private bg:PIXI.Sprite;     // background sprite: none(default), grey, green, blue 
    private rarity:number;      // 0 = grey, 1 = green, 2 = blue (common, uncommon, rare)
    private barreled:boolean = false;

    constructor(type:EcoType,id:number,barreled:boolean=false,rarity:number)
    {
        super();
        // create a sprite with the indicated type
        this.type = type;
        //this.texture = PIXI.Texture.fromFrame(EconomyIcon.jsonData[this.type].fileName);
        this.icon = new PIXI.Sprite(PIXI.Texture.fromFrame("icon_Barrel.png"));
        this.addChild(this.icon);
        this.pivot.x = 21;
        this.pivot.y = 21;
        this.id=id;
        this.rarity = rarity;
        if (!barreled)
            this.loadImageByID(); // load a background and icon else will default to a barrel with no background
        else
            this.barreled = true;
    }

    public getType()
    {
        return this.type;
    }

    public unBarrel()
    {
        if (this.barreled)
        {
            this.loadImageByID(); // create the proper icon and background
            this.barreled = false;
        }
    }

    private loadImageByID()
    {
        // our type is the index into the json data
        if (EconomyItem.jsonData)
        {
            var s = EconomyItem.jsonData[this.type].fileName;
            this.icon.texture = PIXI.Texture.fromFrame(s);
            if (this.rarity == 0)
                this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("iconBGgrey.png"));
            else if (this.rarity == 1)
                this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("iconBGgreen.png"));
            else
                this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("iconBGblue.png"));
            this.addChildAt(this.bg,0);
        }
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