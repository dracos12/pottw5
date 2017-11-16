//
// PopupManager class to manage queued popup windows
//

import PopUp from './popup';

export default class PopupManager
{
    private popupStack:Array<PopUp>=[];
    private container:PIXI.Container;

    public setContainer(container:PIXI.Container)
    {
        this.container = container;
    }

    public displayPopup(newpop:PopUp)
    {
        newpop.init();
        this.popupStack.push(newpop);
        newpop.setManagerClose(this.popIt);
        var p = new PIXI.Point();
        p.x = window.innerWidth / 2 - newpop.width / 2;
        p.y = window.innerHeight / 2 - newpop.height /2;
        var loc = this.container.toLocal(p);
        newpop.x = loc.x;
        newpop.y = loc.y;
        if (newpop.y < 0)
            newpop.y = 0;
        this.container.addChild(newpop);
    }

    public popIt = () => { // from callback on popup or called directly by external
        var pop = this.popupStack.pop();
        this.container.removeChild(pop);
    }
}