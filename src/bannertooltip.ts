//
// BannerToolTip class for mouse over info on islands on the map
//

import * as PIXI from 'pixi.js';

export default class BannerToolTip extends PIXI.Container
{
    private lastTime:number = 0;
    private banner:PIXI.Sprite;
    private txtBanner:PIXI.Text;
    private flagPole:PIXI.Sprite;

    constructor()
    {
        super();
    }

    public init(label:string="none")
    {
        this.banner = new PIXI.Sprite(PIXI.Texture.fromFrame("parchBanner.png"));
        this.banner.x = -123;
        this.banner.y = -159;
        this.addChild(this.banner);
        this.flagPole = new PIXI.Sprite(PIXI.Texture.fromFrame("flagPole.png"));
        this.flagPole.x = -2;
        this.flagPole.y = -130;
        this.addChild(this.flagPole);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        this.txtBanner = new PIXI.Text(label, style);
        this.txtBanner.x = -84 + 85 - this.txtBanner.width/2;
        this.txtBanner.y = -155;
        this.addChild(this.txtBanner);
    }

    public changeLabel(newLabel:string)
    {
        this.txtBanner.text = newLabel;
        this.txtBanner.x = -84 + 85 - this.txtBanner.width/2;
    }

    update()
    {
        var deltaTime = 0;        
        var now = Date.now();

        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
            // rotate
            //this.rotation += 0.1;
        }
        // record lastTime
        this.lastTime = now;
    }
}