//
// class for selection widget... red crosshair or green sharkfin circle
// sprite sheet animation for iso look/feel since pixi doesnt support 3d transform yet
//

import * as PIXI from 'pixi.js';
import Ship from './ship';

export const enum SelectType {
    ENEMY,
    FRIENDLY
}

export default class SelectWidget extends PIXI.Container
{
    private lastTime:number = 0;
    private type:SelectType;
    private friendlyArray:Array<PIXI.Texture> = [];  // array of textures for the splash fx
    private enemyArray:Array<PIXI.Texture> = [];  // array of textures for the splash fx
    private friendly:PIXI.extras.AnimatedSprite;
    private enemy:PIXI.extras.AnimatedSprite;

    constructor(type:SelectType)
    {
        super();
        this.type = type;
        var i,s;
        if (type == SelectType.FRIENDLY)
        {
            for (i=1; i<60; i++)
            {
                s = "selectShip" + Ship.zeroPad(i, 4) + ".png";
                this.friendlyArray.push(PIXI.Texture.fromFrame(s));
            }
            this.friendly = new PIXI.extras.AnimatedSprite(this.friendlyArray);
            this.friendly.anchor.x = 0.5;
            this.friendly.anchor.y = 0.5;  // center anchor
            this.friendly.loop = true;
            this.friendly.scale.x = this.friendly.scale.y = 0.8;
            this.addChild(this.friendly); // at default 0,0 which will anchor centered
        } else
        {
            for (i=1; i<60; i++)
            {
                s = "selected" + Ship.zeroPad(i, 4) + ".png";
                this.enemyArray.push(PIXI.Texture.fromFrame(s));
            }
            this.enemy = new PIXI.extras.AnimatedSprite(this.enemyArray);
            this.enemy.anchor.x = 0.5;
            this.enemy.anchor.y = 0.5;  // center anchor
            this.enemy.loop = true;
            this.addChild(this.enemy); // at default 0,0 which will anchor centered
        }
    }

    public play()
    {
        if (this.type == SelectType.ENEMY)
            this.enemy.gotoAndPlay(0);
        else    
            this.friendly.gotoAndPlay(0);
    }

    public stop()
    {
        if (this.type == SelectType.ENEMY)
            this.enemy.stop();
        else    
            this.friendly.stop();
    }

    update()
    {
        var deltaTime = 0;        
        var now = Date.now();

        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
            // rotate
            //this.rotation += 0.1;
        }
        // record lastTime
        this.lastTime = now;
    }
}