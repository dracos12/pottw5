//
// Button class for button behavior to sprites
// 

import * as PIXI from 'pixi.js';
import * as filters from 'pixi-filters';

export default class PButton extends PIXI.Sprite
{
    private glow:filters.GlowFilter;
    private disabled:boolean = false;

    constructor(texture?: PIXI.Texture)
    {
        super(texture);
        this.interactive = true;
        this.on('mousedown', this.onMouseDown);
        this.on('mouseup', this.onMouseUp);
        this.on('mouseover', this.onMouseOver);
        this.on('mouseout', this.onMouseOut);
        this.glow = new filters.GlowFilter(10, 1, 1, 0xFFFFFF);
        this.anchor.x = this.anchor.y = 0.5; // buttons center anchor so scale effects are proprtionate
    }

    onMouseDown = () => 
    {
        if (this.disabled)
            return;
        this.scale.x = this.scale.y = 0.67;
        this.filters = [];
    }

    onMouseUp = () =>
    {
        if (this.disabled)
            return;
        this.scale.x = this.scale.y = 1;
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
        this.scale.x = this.scale.y = 1;
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