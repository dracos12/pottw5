//
// FXManager class to manage cannon balls, miss plumes, explosions, smoke fx on the sea
//
import * as PIXI from 'pixi.js';
import CannonBall from './cannonball';
import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Ship from './ship';

export default class FXManager
{

    private ballList:Array<CannonBall> = []; // the pool of cannon balls
    private lastBall:number=0;  // last ball we handed out - this will also index into the splash/explosion/smoke arrays
    private splashList:Array<PIXI.extras.AnimatedSprite> = [];
    private isles:Array<GameObject>;    // reference to theSea's island array
    private ships:Array<GameObject>;    // reference to theSea's ship array
    private container:PIXI.Container;   // the container to add effects to
    private splash:Array<PIXI.Texture> = [];  // array of textures for the splash fx

    // request the assets we need loaded
    public addLoaderAssets()
    {
        PIXI.loader.add("./images/fx/shipfx.json");
    }

    // assets are loaded, initialize sprites etc
    public onAssetsLoaded()
    {
        this.initBalls();
        this.initAnimations();
    }

    private initAnimations()
    {
        var i;
        var s;

        for (i=1; i<25; i++)
        {
            s = "spout" + Ship.zeroPad(i, 4) + ".png";
            this.splash.push(PIXI.Texture.fromFrame(s));
        }
        this.initSplashPool();
    }

    private initSplashPool()
    {
        var i;
        var anim;

        for (i=0; i<100; i++)
        {
            anim = new PIXI.extras.AnimatedSprite(this.splash);
            anim.anchor.x = 0.5;
            anim.anchor.y = 1;  // anchor/origin is the middle bottom of the sprite
            anim.loop = false;
            this.splashList.push(anim);
        }
    }

    public setIslesShips(isles:Array<GameObject>, ships:Array<GameObject>)
    {
        this.isles = isles;
        this.ships = ships;
    }

    public setFXContainer(container:PIXI.Container)
    {
        this.container = container;
    }

    private initBalls()
    {
        for (var i=0; i<100; i++)
        {
            this.ballList.push(new CannonBall());
        }
    }

    // get cannonball from pool, returns null if all in use (!)
    public getCannonBall()
    {
        var ball;
        var count = 0;
        var found = false;

        while (!found)
        {
            this.lastBall++;
            count++;
            if (count > this.ballList.length) {
                console.log("no cannonBalls available in pool");
                return null; // all cannonballs are out! take cover!
            }

            if (this.lastBall >= this.ballList.length)
                this.lastBall = 0; // wrap around to head of list

            if (!this.ballList[this.lastBall].inUse)
            {
                this.ballList[this.lastBall].inUse = true;
                found = true;
                console.log("ballList: assigning ball: " + this.lastBall);
            }
        }

        var numChildren = this.container.children.length;
        this.container.addChild(this.ballList[this.lastBall]);

        return this.ballList[this.lastBall];
    }

    // determine if this cannonBall has struck any isle or ship
    private hit(ball:CannonBall)
    {
        var hitObj:GameObject = null;

        // collision code here

        return hitObj;
    }

    public update()
    {
        var hit = false;
        var hitObj;
        let i = 0;

        for (i=0; i<this.ballList.length; i++) {
            if (this.ballList[i].inUse) {
                //console.log("updating ball: " + i);
                this.ballList[i].update();
                let ball = 0;
                // check spent
                if (this.ballList[i].spent)
                {
                    // put miss FX at its spot and remove it from contention
                    this.splashList[i].x = this.ballList[i].x;
                    this.splashList[i].y = this.ballList[i].y;
                    this.container.addChild(this.splashList[i]);
                    this.splashList[i].play(); // start the animation
                    ball = i;
                    this.splashList[i].onComplete = () => { this.container.removeChild(this.splashList[ball]); this.splashList[ball].gotoAndStop(0); console.log("Removing splash: " + ball );};
                    this.ballList[i].reset();
                    this.container.removeChild(this.ballList[i]);
                    console.log("ball " + i + " spent... SPLASH");
                    continue;
                }

                // collide with islands and ships code here
                
                hitObj = this.hit(this.ballList[i]);
                
                if (hitObj)
                {
                    this.ballList[i].inUse = false; // return to pool
                }
            }
        }
    }
}