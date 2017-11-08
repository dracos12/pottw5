//
// Button class for button behavior to sprites
// 

import * as PIXI from 'pixi.js';
import * as filters from 'pixi-filters';

export default class PButton extends PIXI.Sprite
{
    private glow:filters.GlowFilter;

    constructor(texture?: PIXI.Texture)
    {
        super(texture);
        this.interactive = true;
        this.on('mousedown', this.onMouseDown);
        this.on('mouseup', this.onMouseUp);
        this.on('mouseover', this.onMouseOver);
        this.on('mouseout', this.onMouseOut);
        this.glow = new filters.GlowFilter(10, 1, 1, 0xFFFFFF);
    }

    onMouseDown = () => 
    {
        this.scale.x = this.scale.y = 0.67;
        this.filters = [];
    }

    onMouseUp = () =>
    {
        this.scale.x = this.scale.y = 1;
    }

    onMouseOver = () =>
    {
        // apply glow filter
        this.filters = [this.glow];
    }

    onMouseOut = () => 
    {
        this.filters = [];
        this.scale.x = this.scale.y = 1;
    }
}