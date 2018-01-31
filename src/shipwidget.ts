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
    private selectUI:PIXI.Sprite; 
    private selected:boolean = false;
    private alphaRedux:number = 0;

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
        this.selectUI = new PIXI.Sprite(PIXI.Texture.fromFrame("selectShipUI.png"));
        this.selectUI.anchor.x = this.selectUI.anchor.y = 0.5;
        this.selectUI.x = this.shipWheel.x + this.shipWheel.width/2;
        this.selectUI.y = this.shipWheel.y + this.shipWheel.height/2;
        this.selectUI.visible = false;

        this.addChild(this.shipWheel);
        this.addChild(this.selectUI);
        this.addChild(this.sailHealth);
        this.addChild(this.crewHealth);
        this.addChild(this.hullHealth);
    }

    public select(selected:boolean=true, fadeTime:number)
    {
        if (selected)
        {
            this.selected = true;
            this.selectUI.visible = true;
            this.selectUI.alpha = 1.0;
            if (fadeTime != 0)
            {
                // fade out over fadeTime then become unselected
                this.alphaRedux = 1 / ((fadeTime / 1000) * 60);
            }
        }
    }

    public isSelected()
    {
        return this.selected;
    }

    public update()
    {
        // animate the rotation of the select widget if enabled
        if(this.selected)
        {
            this.selectUI.rotation -= 0.075;
            this.selectUI.alpha -= this.alphaRedux;
            if (this.selectUI.alpha <= 0)
            {
                this.selected = false;
                this.selectUI.visible = false;
            }
        }
    }

}