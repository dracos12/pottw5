//
// HealthBar - simple shape bar that graphically represents health.
//
import * as PIXI from 'pixi.js';

export default class HealthBar extends PIXI.Container 
{
    private w:number;
    private h:number;
    private color:number;
    private bg:PIXI.Graphics;
    private bar:PIXI.Graphics;
    private perc:number;        // the percent value this bar is currently showing

    constructor(w:number, h:number, color:number)
    {
        super();
        this.w = w;
        this.h=h;
        this.color = color;
        this.initGraphics();
    }

    private initGraphics()
    {
        // background shape is a grey rectangle of w/h size
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x777777, 1); // grey
        this.bg.drawRect(0,0,this.w,this.h);
        this.bg.endFill();
        this.addChild(this.bg); // background added first to sort to rear
        // foreground shape is of desired color
        this.bar = new PIXI.Graphics();
        this.bar.beginFill(this.color, 1); // provided color
        this.bar.drawRect(0,0,this.w, this.h);
        this.bar.endFill();
        this.addChild(this.bar); // bar added atop background and will adjust in size according to perc set by user
    }

    public setPerc(perc:number)
    {
        var p;
        // expects 0->1 inclusive
        if (perc < 0)
            p = 0;
        else if (perc > 1)
            p = 1;
        else
            p = perc;

        this.bar.clear();
        this.bar.beginFill(this.color, 1); // provided color
        this.bar.drawRect(0,0,this.w * p, this.h);
        this.bar.endFill();

    }

}