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
    private portFlag:PIXI.Sprite;
    private portFlagContainer: PIXI.Container;
    private natFlag:PIXI.Sprite;
    private natFlagContainer: PIXI.Container;
    private displacementFilter:PIXI.filters.DisplacementFilter;
    private displacementSprite:PIXI.Sprite;
    private displacementTexture:PIXI.Texture;

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

        this.displacementTexture = PIXI.loader.resources["images/2yYayZk.png"].texture;
        this.displacementTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementSprite = new PIXI.Sprite(this.displacementTexture);
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

        this.portFlag = new PIXI.Sprite(PIXI.Texture.fromFrame("flagAntigua.png"));
        this.portFlag.scale.x = this.portFlag.scale.y = 0.5;
        this.portFlagContainer = new PIXI.Container();
        this.portFlagContainer.addChild(this.portFlag);
        this.portFlagContainer.x = -(this.portFlag.width) - 3;
        this.portFlagContainer.y = -80;
        this.portFlagContainer.addChild(this.displacementSprite);
        this.portFlagContainer.filters = [this.displacementFilter];
        this.addChild(this.portFlagContainer);

        this.natFlag = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagEnglish.png"));
        this.natFlag.scale.x = this.natFlag.scale.y = 0.5;
        this.natFlagContainer = new PIXI.Container();
        this.natFlagContainer.addChild(this.natFlag);
        this.natFlagContainer.x = -(this.natFlag.width) - 3;
        this.natFlagContainer.y = -120;
        this.natFlagContainer.addChild(this.displacementSprite);
        this.natFlagContainer.filters = [this.displacementFilter];
        this.addChild(this.natFlagContainer);
    }

    public changeLabel(newLabel:string)
    {
        this.txtBanner.text = newLabel;
        this.txtBanner.x = -84 + 85 - this.txtBanner.width/2;
    }

    public changePortFlag(newFlag:string)
    {
        if (this.txtBanner.text != "Shaman Island")
        {
            //console.log("changePortFlag to: " + newFlag);
            this.portFlag.texture = PIXI.Texture.fromFrame(newFlag);
            this.portFlagContainer.visible = true;
            this.natFlagContainer.visible = true;
            // exception flags are wider and need more space off the flagpole
            if (newFlag == "flagStLucia.png" || newFlag == "flagDeeps.png" || newFlag == "flagGrenada.png" || newFlag == "flagDominica.png" || newFlag == "flagBVI.png")
            {
                this.portFlagContainer.x = -(this.portFlag.width) - 8;
            }
            else
            {
                this.portFlagContainer.x = -(this.portFlag.width) - 3;
            }
        }
        else
        {
            this.portFlagContainer.visible = false;
            this.natFlagContainer.visible = false;
        }
    }

    public changeNatFlag(newFlag:string)
    {
        if (this.txtBanner.text != "Shaman Island")
        {
            //console.log("changePortFlag to: " + newFlag);
            this.natFlag.texture = PIXI.Texture.fromFrame(newFlag);
        }
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

        // displace the flags at all times
        this.displacementSprite.x += 1; // * this.luffDir;
        this.displacementSprite.y += 1;
    }
}