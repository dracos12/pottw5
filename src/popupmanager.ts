//
// PopupManager class to manage queued popup windows
//

import PopUp from './popup';
import popMsgBox from './popmsgbox';
import SingletonClass from './singleton';

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
        if (this.popupStack.length != 0)
        {
            var top = this.popupStack[this.popupStack.length-1];
            top.backgrounded();
        }
        this.popupStack.push(newpop);
        newpop.setManagerClose(this.popIt);
        var p = new PIXI.Point();
        if (newpop instanceof popMsgBox)
        {
            // position in lower left
            p.x = 0;
            p.y = window.innerHeight - newpop.height;
        } else {
            p.x = window.innerWidth / 2 - newpop.width / 2;
            p.y = window.innerHeight / 2 - newpop.height / 2;
        }
        var loc = this.container.toLocal(p);
        newpop.x = loc.x;
        newpop.y = loc.y;
        if (newpop.y < 0)
            newpop.y = 0;
        this.container.addChild(newpop);
        SingletonClass.uiDisplayed = true;
    }

    public popIt = () => { // from callback on popup or called directly by external
        var pop = this.popupStack.pop();
        this.container.removeChild(pop);
        if (this.popupStack.length == 0)
            SingletonClass.uiDisplayed = false;
        if (this.popupStack.length != 0)
        {
            var top = this.popupStack[this.popupStack.length-1];
            top.top();
        }
    }
}