//
// PopUp bass class - all popups should extend this
//

import * as PIXI from 'pixi.js';

export default class PopUp extends PIXI.Container
{
    protected onClose:Function=null;
    protected managerClose:Function=null; // second callback for the popupmanager onclose

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

    }
}