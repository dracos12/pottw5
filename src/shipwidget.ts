//
// ui widget that represents ship on the hud
//
import * as PIXI from 'pixi.js';
import HealthBar from './healthbar';

export default class ShipWidget extends PIXI.Container
{
    private shipWheel:PIXI.Sprite;
    private sailHealth:HealthBar;
    private crewHealth:HealthBar;
    private hullHealth:HealthBar;
    private flag:PIXI.Sprite; 

    constructor()
    {
        super();
    }

    public init()
    {
        this.shipWheel = new PIXI.Sprite(PIXI.Texture.fromFrame("shipFrameUI.png"));
        this.shipWheel.x = 99 - this.shipWheel.width / 2; // position from center
        this.shipWheel.y = 63 - this.shipWheel.height / 2;
        this.sailHealth = new HealthBar(50,4, 0x0000FF);
        this.sailHealth.x = 0;
        this.sailHealth.y = 61;
        this.crewHealth = new HealthBar(50,4,0x00FF00);
        this.crewHealth.x = 0;
        this.crewHealth.y = 72;
        this.hullHealth = new HealthBar(50,4,0xFF0000);
        this.hullHealth.x = 0;
        this.hullHealth.y = 83;

        this.addChild(this.shipWheel);
        this.addChild(this.sailHealth);
        this.addChild(this.crewHealth);
        this.addChild(this.hullHealth);
    }
}