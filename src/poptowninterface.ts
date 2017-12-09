//
// TownInterface class for when players put to port and need to do business on an island
// 
import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';
import popProvisioner from './popprovisioner';
import popPrizeAgent from './popprizeagent';
import PopupManager from './popupmanager';
import SingletonClass from './singleton';
import popWarehouse from './popwarehouse';
import popMarket from './popmarket';

export default class popTownInterface extends PopUp
{
    private building1:PIXI.Sprite; 
    private building2:PIXI.Sprite; 
    private building3:PIXI.Sprite; 
    private building4:PIXI.Sprite; 
    private building5:PIXI.Sprite; 
    private building6:PIXI.Sprite; 
    private building7:PIXI.Sprite; 
    private dock:PIXI.Sprite;
    private txtTownName:PIXI.Text;
    private txtMouseOver:PIXI.Text;
    private popMan:PopupManager;

    constructor()
    {
        super();
    }

    public setPopupManager(popMan:PopupManager)
    {
        this.popMan = popMan;
    }
    public init()
    {
        super.init();
        // add buildings by sort order, back to front
        this.building6 = new Button(PIXI.Texture.fromFrame("building6.png"), true);
        this.building6.x = 121;
        this.building6.y = 48;
        this.building6.on('click', this.doPrizeAgent);
        this.building6.on('mouseover', this.doPrizeOver);
        this.addChild(this.building6);
        this.building1 = new PIXI.Sprite(PIXI.Texture.fromFrame("building1.png"));
        this.building1.x = 283;
        this.building1.y = 83;
        this.addChild(this.building1);
        this.building4 = new PIXI.Sprite(PIXI.Texture.fromFrame("building4.png"));
        this.building4.x = 496;
        this.building4.y =79;
        this.addChild(this.building4);
        this.building3 = new PIXI.Sprite(PIXI.Texture.fromFrame("buildingForge.png"));
        this.building3.x = 338;
        this.building3.y = 122;
        this.addChild(this.building3);
        this.building5 = new Button(PIXI.Texture.fromFrame("building5.png"), true);
        this.building5.x = 439;
        this.building5.y = 210;
        this.building5.on('click',this.doProvisioner);
        this.building5.on('mouseover', this.doProvisOver);
        this.addChild(this.building5);
        this.building7 = new Button(PIXI.Texture.fromFrame("wareHouse.png"), true);
        this.building7.x = 130;
        this.building7.y =207;
        this.building7.on('click',this.doWarehouse);
        this.building7.on('mouseover', this.doWareOver);
        this.addChild(this.building7);
        this.dock = new PIXI.Sprite(PIXI.Texture.fromFrame("dockSW.png"));
        this.dock.x = 329 - this.dock.width; // position is flipped in animate so origin is top right
        this.dock.y = 354;
        this.addChild(this.dock);
        this.building2 = new Button(PIXI.Texture.fromFrame("building2.png"), true);
        this.building2.x = 261;
        this.building2.y =282;
        this.building2.on('click',this.doMarket);
        this.building2.on('mouseover', this.doMarketOver);
        this.addChild(this.building2);

        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });

        var townName = SingletonClass.currentPort;
        this.txtTownName = new PIXI.Text(townName, style);
        this.txtTownName.x = this.bg.width /2 - this.txtTownName.width / 2;
        this.txtTownName.y = 29;
        this.addChild(this.txtTownName);

        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 18,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: 312
        });

        this.txtMouseOver = new PIXI.Text(townName + " info.  Mouse over the buildings for details.", styleb);
        this.txtMouseOver.x = 359;
        this.txtMouseOver.y = 445;
        this.addChild(this.txtMouseOver);


    }

    private doPrizeAgent = () =>
    {
        console.log("doPrizeAgent");
        var pop =  new popPrizeAgent();
        this.popMan.displayPopup(pop);
    }

    private doPrizeOver = () =>
    {
        this.txtMouseOver.text = "Prize Agent. Reload you magazine with cannon balls here.";
    }

    private doProvisioner = (e:any) =>
    {
        if (this._backgrounded)
        {
            console.log("backgrounded click: ignoring");
            return;
        }
        console.log("doProvisioner");
        // display the town interface popup
        var pop =  new popProvisioner();
        this.popMan.displayPopup(pop);
    }

    private doProvisOver = () =>
    {
        this.txtMouseOver.text = "Provisioner. Buy ship's goods here and/or sell items in your hold.";
    }

    private doWarehouse = () =>
    {
        console.log("doWarehouse");
        // display the town interface popup
        var pop =  new popWarehouse();
        this.popMan.displayPopup(pop);
    }

    private doWareOver = () =>
    {
        this.txtMouseOver.text = "Warehouse. Buy market items here and/or sell items in your hold";
    }

    private doMarket = () =>
    {
        console.log("doMarket");
        // display the town interface popup
        var pop =  new popMarket();
        this.popMan.displayPopup(pop);
    }

    private doMarketOver = () =>
    {
        var townName = SingletonClass.currentPort;
        this.txtMouseOver.text = "Market. Check the going rates for items in " + townName;
    }

}