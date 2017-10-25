//
// FXManager class to manage cannon balls, miss plumes, explosions, smoke fx on the sea
//
import * as PIXI from 'pixi.js';
import CannonBall from './cannonball';
import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Ship from './ship';
import theSea from './theSea';
import Victor = require('victor');

declare var PolyK: any;

export default class FXManager
{

    private ballList:Array<CannonBall> = []; // the pool of cannon balls
    private lastBall:number=0;  // last ball we handed out - this will also index into the splash/explosion/smoke arrays
    private splashList:Array<PIXI.extras.AnimatedSprite> = [];
    private explosionList:Array<PIXI.extras.AnimatedSprite> = [];
    private muzzlePlumeList:Array<PIXI.extras.AnimatedSprite> = [];
    private isles:Array<GameObject>;    // reference to theSea's island array
    private ships:Array<GameObject>;    // reference to theSea's ship array
    private container:PIXI.Container;   // the container to add effects to
    private splash:Array<PIXI.Texture> = [];  // array of textures for the splash fx
    private explosion:Array<PIXI.Texture> = []; // array for explosion textures
    private muzzlePlume:Array<PIXI.Texture> = []; // smoke from cannon fire

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

        
        for (i=1; i<68; i++)
        {
            s = "fiery_explosion" + Ship.zeroPad(i, 4) + ".png";
            this.explosion.push(PIXI.Texture.fromFrame(s));
        }
        this.initExplosionPool();

        for (i=1; i<121; i++)
        {
            s = "smoke_cloud" + Ship.zeroPad(i, 4) + ".png";
            this.muzzlePlume.push(PIXI.Texture.fromFrame(s));
        }
        this.initMuzzlePool();
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

    private initExplosionPool()
    {
        var i;
        var anim;

        for (i=0; i<100; i++)
        {
            anim = new PIXI.extras.AnimatedSprite(this.explosion);
            anim.anchor.x = 0.54;
            anim.anchor.y = 0.68;  // anchor/origin is at 27,42 on a frame 50,62
            anim.loop = false;
            this.explosionList.push(anim);
        }
    }

    private initMuzzlePool()
    {
        var i;
        var anim;

        for (i=0; i<100; i++)
        {
            anim = new PIXI.extras.AnimatedSprite(this.muzzlePlume);
            anim.anchor.x = 1;
            anim.anchor.y = 0.5;  // anchor/origin center right (anim goes left)
            anim.loop = false;
            this.muzzlePlumeList.push(anim);
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

    public placeMuzzlePlume(x:number, y:number, dir:Victor)
    {
        // place a plume with given position and direction (v is normalized)
        // assume last ball so use lastBall as index to use
        this.muzzlePlumeList[this.lastBall].x = x;
        this.muzzlePlumeList[this.lastBall].y = y;
        // rotate the plume into the direction of the shot, plume is in negative x axis (faces left)
        var plumeDir:Victor = new Victor(dir.x, dir.y);
        //plumeDir.rotate(-Math.PI/2); // simply rotate the given direction 180 
        this.muzzlePlumeList[this.lastBall].rotation = plumeDir.angle() + Math.PI;
        this.muzzlePlumeList[this.lastBall].gotoAndPlay(0);

        this.container.addChild(this.muzzlePlumeList[this.lastBall]);

        let ball = this.lastBall; 
        this.muzzlePlumeList[this.lastBall].onComplete = () => { this.container.removeChild(this.muzzlePlumeList[ball]); this.muzzlePlumeList[ball].gotoAndStop(0); console.log("Removing muzzlePlume: " + ball );};
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
        var i=0;
        var x,y;

        // collision code here
        // islands first
        for (let entry of this.isles) {
            // first do rectangular hit test
            if (theSea.boxHitTest(entry.getSprite(), ball)) {
                //console.log("ball inside island rect! checking PolyK");
                // sprites overlap, now do a PolyK contains point
                x = ball.x;
                y = 8192 - ball.y; // convert to cartesian
                if (PolyK.ContainsPoint(entry.getCartPolyData(), x, y)) {
                    console.log("hit " + entry.getSprite().name + "!");
                    hitObj = entry;
                    break; // short circuit the loop
                }
            }
        }
        // now check boats
        for (let entry of this.ships) {
            // ignore the firer of this ball
            if (ball.firer == entry)
                continue;
            // first do rectangular hit test
            if (theSea.boxHitTest(entry.getSprite(), ball)) {
                // sprites overlap, now do a PolyK contains point
                x = ball.x;
                y = 8192 - ball.y;
                if ((<Ship>entry).hitTestByPoint(x,y)) {
                    hitObj = entry;
                    break; // short circuit the loop
                }
            }
        }


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
                    // play hit animation
                    this.explosionList[i].x = this.ballList[i].x;
                    this.explosionList[i].y = this.ballList[i].y;
                    this.container.addChild(this.explosionList[i]);
                    this.explosionList[i].play(); // start the animation
                    ball = i;
                    this.explosionList[i].onComplete = () => { this.container.removeChild(this.explosionList[ball]); this.explosionList[ball].gotoAndStop(0); console.log("Removing explosion: " + ball );};

                    this.ballList[i].reset(); // return ball to pool
                    this.container.removeChild(this.ballList[i]);
                }
            }
        }
    }
}