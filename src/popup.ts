//
// PopUp bass class - all popups should extend this
//

import * as PIXI from 'pixi.js';
import Button from './button';

export default class PopUp extends PIXI.Container
{
    protected onClose:Function=null;
    protected managerClose:Function=null; // second callback for the popupmanager onclose
    protected bg:PIXI.Sprite; // the backdrop
    protected btnX:Button;    // the close button
    protected _backgrounded:boolean = false;

    constructor(onClose?:Function)
    {
        super();
    }

    protected close()
    {
        if (this.onClose != null)
            this.onClose(); // call our call back
        if (this.managerClose != null)
            this.managerClose();
    }

    public setManagerClose(onClose:Function)
    {
        this.managerClose = onClose;
    }

    // children will override
    public init()
    {
        // load and position our graphics
        this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_map.png"));
        this.addChild(this.bg);
        this.bg.interactive = true;
        this.btnX = new Button( PIXI.Texture.fromFrame("Btn_Ex.png"));
        this.btnX.anchor.x = this.btnX.anchor.y = 0.5;
        this.btnX.x = 713;
        this.btnX.y = 42;
        this.addChild(this.btnX);
        this.btnX.on('click', this.btnXClick);
    }

    protected btnXClick = () =>
    {
        this.close(); // will callback to popupmanager to remove us from display
    }

    public backgrounded()
    {
        this._backgrounded = true;
    }

    public top()
    {
        this._backgrounded = false;
    }
}