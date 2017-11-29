//
// Button class for button behavior to sprites
// 

import * as PIXI from 'pixi.js';
import * as filters from 'pixi-filters';

export default class Button extends PIXI.Sprite
{
    private glow:filters.GlowFilter;
    private disabled:boolean = false;
    private noScale:boolean=false;
    private origScale:number = 0;
    private label:PIXI.Text;
    private strLabel:string="";

    constructor(texture?: PIXI.Texture, noScale:boolean=false, text:string="", fontSize:number=22)
    {
        super(texture);
        this.interactive = true;
        this.on('mousedown', this.onMouseDown);
        this.on('mouseup', this.onMouseUp);
        this.on('mouseover', this.onMouseOver);
        this.on('mouseout', this.onMouseOut);
        this.glow = new filters.GlowFilter(10, 1, 1, 0xFFFFFF);
        if (!noScale)
            this.anchor.x = this.anchor.y = 0.5; // buttons center anchor so scale effects are proprtionate
        this.noScale = noScale;
        this.origScale = this.scale.x;
        if (text != "")
        {
            this.strLabel = text;
            var style = new PIXI.TextStyle({
                fontFamily: 'IM Fell English SC',
                fontSize: fontSize,
                fill: 'white'
            }); 
            this.label = new PIXI.Text(text, style)
            if (this.noScale)
            {
                this.label.x = this.width / 2 - this.label.width / 2;
                this.label.y = this.height / 2 - this.label.height / 2;
            }
            else {
                this.label.x = -this.label.width / 2;
                this.label.y = -this.label.height / 2;
            }
            this.addChild(this.label);
        }
    }

    onMouseDown = () => 
    {
        if (this.disabled)
            return;
        if (!this.noScale)
        {
            this.scale.x = this.scale.y = this.origScale * 0.67;
        }
        this.filters = [];
    }

    onMouseUp = () =>
    {
        if (this.disabled)
            return;
        if (!this.noScale)
            this.scale.x = this.scale.y = this.origScale;
    }

    onMouseOver = () =>
    {
        if (this.disabled)
            return;
        // apply glow filter
        this.filters = [this.glow];
    }

    onMouseOut = () => 
    {
        if (this.disabled)
            return;
        this.filters = [];
        if (!this.noScale)
        {
            this.scale.x = this.scale.y = this.origScale;
        }
    }

    setDisabled(disabled:boolean)
    {
        this.disabled = disabled;
        if (disabled)
        {
            this.tint = 0x333333; // dark grey
            this.alpha = 0.5;
        }
        else
        {
            this.tint = 0xFFFFFF; // clear any tint
            this.alpha = 1.0;
        }
    }
}