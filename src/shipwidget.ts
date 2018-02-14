//
// ui widget that represents ship on the hud
//
import * as PIXI from 'pixi.js';
import HealthBar from './healthbar';
import Ship from './Ship';

export const enum NatFlag {
    ENGLISH,
    FRENCH,
    SPANISH,
    DUTCH,
    PIRATE
}

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

    private trackShip:Ship = null;

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

        this.flag = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagEnglish.png"));
        this.flag.width = 28;
        this.flag.height = 18;
        this.flag.x = this.sailHealth.x + this.sailHealth.width - this.flag.width;
        this.flag.y = this.sailHealth.y - this.flag.height - 2;

        this.addChild(this.shipWheel);
        this.addChild(this.selectUI);
        this.addChild(this.sailHealth);
        this.addChild(this.crewHealth);
        this.addChild(this.hullHealth);
        this.addChild(this.flag);
    }

    public setShip(newShip:Ship)
    {
        this.trackShip = newShip;
        var perc = newShip.getHull() / newShip.getHullMax();
        this.hullHealth.setPerc(perc);
        var fnum = newShip.getNatFlag();
        if (fnum == NatFlag.ENGLISH) {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagEnglish.png");
        } else if (fnum == NatFlag.FRENCH) {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagFrench.png");
        } else if (fnum == NatFlag.SPANISH) {
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagSpanish.png");
        } else if (fnum == NatFlag.DUTCH) { 
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagDutch.png");
        } else { // pirate
            this.flag.texture = PIXI.Texture.fromFrame("ui_flagPirate.png");
        }
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

        if (this.trackShip != null) {
            // adjust our health bars as needed
            var perc = this.trackShip.getHull() / this.trackShip.getHullMax();
            this.hullHealth.setPerc(perc);
        }
    }

}