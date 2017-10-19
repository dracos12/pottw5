//
// FXManager class to manage cannon balls, miss plumes, explosions, smoke fx on the sea
//
import * as PIXI from 'pixi.js';
import CannonBall from './cannonball';
import GameObject from './gameobject';
import { ObjectType } from './gameobject';

export default class FXManager
{

    private ballList:Array<CannonBall>; // the pool of cannon balls
    private lastBall:number;            // last ball we handed out
    private isles:Array<GameObject>;    // reference to theSea's island array
    private ships:Array<GameObject>;    // reference to theSea's ship array

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
            if (count > this.ballList.length)
                return null; // all cannonballs are out! take cover!

            if (this.lastBall > this.ballList.length)
                this.lastBall = 0; // wrap around to head of list

            if (!this.ballList[this.lastBall].inUse)
            {
                this.ballList[this.lastBall].inUse = true;
                found = true;
            }
        }

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

        for (var i = 0; i<this.ballList.length; i++) {
            if (this.ballList[i].inUse) {
                this.ballList[i].update();

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