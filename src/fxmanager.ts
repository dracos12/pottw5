//
// FXManager class to manage cannon balls, miss plumes, explosions, smoke fx on the sea
//
import * as PIXI from 'pixi.js';
import CannonBall from './cannonball';
import GameObject from './gameobject';
import { ObjectType } from './gameobject';

export default class FXManager
{

    private ballList:Array<CannonBall> = []; // the pool of cannon balls
    private lastBall:number=0;            // last ball we handed out
    private isles:Array<GameObject>;    // reference to theSea's island array
    private ships:Array<GameObject>;    // reference to theSea's ship array
    private container:PIXI.Container;   // the container to add effects to

    // request the assets we need loaded
    public addLoaderAssets()
    {
        PIXI.loader.add("./images/fx/shipfx.json");
    }

    // assets are loaded, initialize sprites etc
    public onAssetsLoaded()
    {
        this.initBalls();
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

        for (var i=0; i<this.ballList.length; i++) {
            if (this.ballList[i].inUse) {
                //console.log("updating ball: " + i);
                this.ballList[i].update();

                // check spent
                if (this.ballList[i].spent)
                {
                    // put miss FX at its spot and remove it from contention
                    this.ballList[i].spent = false;
                    this.ballList[i].inUse = false;
                    this.container.removeChild(this.ballList[i]);
                    console.log("ball spent... SPLASH");
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