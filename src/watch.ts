//
// Watch class to visually display a timer countdown for when widgets are unavailable/working
//

import * as PIXI from 'pixi.js';
import CompassRose from './compassrose';

export default class Watch extends PIXI.Container
{
    private watchFace:PIXI.Sprite;
    private counter:PIXI.Sprite;
    private counterContainer:PIXI.Container;
    private counterMask:PIXI.Graphics;          // circular mask drawn in arc to mask progress

    private finishedCallback:Function;

    private percentDone:number = 0;
    private lastTime:number = 0;
    private totalTime:number = 0;
    private timeElapsed:number = 0;

    private started:boolean = false;

    private timeToZero(seconds:number)
    {

    }

    public init()
    {
        // assumes its aszets are loaded inot the cache
        this.watchFace = new PIXI.Sprite(PIXI.Texture.fromFrame("Watch.png"));
        this.counter = new PIXI.Sprite(PIXI.Texture.fromFrame("CounterProgress.png"));
        this.addChild(this.watchFace);
        this.counter.x = 6;
        this.counter.y = 12;
        this.counter.alpha = 0.73;
        this.addChild(this.counter);

        // test mask
        this.percentDone = 0.25;
        this.doMask();
    }

    public start(callback:Function)
    {
        this.percentDone = 0;
        this.timeElapsed = 0;
        this.lastTime = 0;
        this.finishedCallback = callback;
        this.started = true;
        console.log("watch started");
    }

    public stop()
    {
        this.started = false;
    }

    private doMask()
    {
        // make a circular arc based off percentDone  100 will be no mask.. reveals clockwise as percent increases
        let degs = this.percentDone * 360;
        let rads = CompassRose.getRads(degs);
        var arc = new PIXI.Graphics();
        arc.beginFill(0xff0000);
        arc.moveTo(this.counter.width/2, this.counter.height/2);
        arc.arc(this.counter.width/2, this.counter.height/2, this.counter.width/2, 0, rads, false); // cx, cy, radius, angle, endAngle, anticlockwise bool
        arc.endFill();
        
        arc.rotation = CompassRose.getRads(-90);
        arc.x = this.counter.x;
        arc.y = this.counter.y + this.counter.width;

        if (this.counterMask)
        {
            this.removeChild(this.counterMask);
            this.counterMask.destroy();
        }

        this.counterMask = arc;
        this.counter.mask = this.counterMask;
        this.addChild(this.counterMask);
    }

    public countDown(timeToCount:number)
    {
        // all units in milliseconds
        this.totalTime = timeToCount;
    }

    public update()
    {
        if (this.started)
        {
            let now = Date.now();
            if (this.lastTime != 0)
                this.timeElapsed += now - this.lastTime;

            this.lastTime = now;

            this.percentDone = 1 - (this.totalTime - this.timeElapsed) / this.totalTime;

            if (this.percentDone >= 1)
                this.percentDone = 1;

            this.doMask();

            if (this.percentDone == 1)
            {
                this.stop();
                // call our callback to indicate we are finished
                if (this.finishedCallback)
                    this.finishedCallback();
            }
        }
    }
}