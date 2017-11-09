//
// TownInterface class for when players put to port and need to do business on an island
// 
import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';

export default class popTownInterface extends PopUp
{
    private bg:PIXI.Sprite; // the backdrop
    private btnX:Button;    // the close button
    private building1:PIXI.Sprite; 
    private building2:PIXI.Sprite; 
    private building3:PIXI.Sprite; 
    private building4:PIXI.Sprite; 
    private building5:PIXI.Sprite; 
    private building6:PIXI.Sprite; 
    private building7:PIXI.Sprite; 
    private dock:PIXI.Sprite;

    constructor()
    {
        super();
    }

    public init()
    {
        // backdrop adds first
        this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_map.png"));
        this.addChild(this.bg);
        // btnEX!
        this.btnX = new Button(PIXI.Texture.fromFrame("Btn_Ex.png"));
        this.btnX.anchor.x = this.btnX.anchor.y = 0.5;
        this.btnX.x = 52;
        this.btnX.y = 48;
        this.btnX.on('click', this.btnXClick);
        this.addChild(this.btnX);
        // add buildings by sort order, back to front
        this.building6 = new PIXI.Sprite(PIXI.Texture.fromFrame("building6.png"));
        this.building6.x = 195;
        this.building6.y = 48;
        this.addChild(this.building6);
        this.building1 = new PIXI.Sprite(PIXI.Texture.fromFrame("building1.png"));
        this.building1.x = 357;
        this.building1.y = 83;
        this.addChild(this.building1);
        this.building4 = new PIXI.Sprite(PIXI.Texture.fromFrame("building4.png"));
        this.building4.x = 570;
        this.building4.y =79;
        this.addChild(this.building4);
        this.building3 = new PIXI.Sprite(PIXI.Texture.fromFrame("buildingForge.png"));
        this.building3.x = 412;
        this.building3.y = 122;
        this.addChild(this.building2);
        this.building5 = new PIXI.Sprite(PIXI.Texture.fromFrame("building5.png"));
        this.building5.x = 513;
        this.building5.y = 210;
        this.addChild(this.building5);
        this.building7 = new PIXI.Sprite(PIXI.Texture.fromFrame("wareHouse.png"));
        this.building7.x = 204;
        this.building7.y =207;
        this.addChild(this.building7);
        this.dock = new PIXI.Sprite(PIXI.Texture.fromFrame("dockSW.png"));
        this.dock.x = 403 - this.dock.width; // position is flipped in animate so origin is top right
        this.dock.y = 354;
        this.addChild(this.dock);
        this.building2 = new PIXI.Sprite(PIXI.Texture.fromFrame("building5.png"));
        this.building2.x = 334;
        this.building2.y =282;
    }

    private btnXClick = () =>
    {
        this.close(); // will callback to popupmanager to remove us from display
    }

}