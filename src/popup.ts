//
// PopUp bass class - all popups should extend this
//

import * as PIXI from 'pixi.js';

export default class PopUp extends PIXI.Container
{
    protected onClose:Function=null;

    constructor(onClose?:Function)
    {
        super();
    }

    protected close()
    {
        if (this.onClose != null)
            this.onClose(); // call our call back
    }
}