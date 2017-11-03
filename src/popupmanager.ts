//
// PopupManager class to manage queued popup windows
//

import PopUp from './popup';

export default class PopupManager
{
    private popupStack:Array<PopUp>=[];

    public displayPopup(newpop:PopUp)
    {
        this.popupStack.push(newpop);
    }

    public popIt = () => { // from callback on popup or called directly by external
        this.popupStack.pop();
    }
}