//
// popPlayerSetup - first time users see this to choose their first mate, faction, and ship name
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import SingletonClass from './singleton';
import Button from './button';
import popMsgBox from './popmsgbox';
import * as filters from 'pixi-filters';

export default class popPlayerSetup extends PopUp
{    
    private femMate:PIXI.Sprite;
    private maleMate:PIXI.Sprite;
    private flagEnglish:PIXI.Sprite;
    private flagFrench:PIXI.Sprite;
    private flagSpanish:PIXI.Sprite;
    private flagDutch:PIXI.Sprite;
    private blackShadow:filters.GlowFilter;
    private highlight:filters.GlowFilter;
    private textFrame:PIXI.Sprite;
    private lblFaction:PIXI.Text;
    private lblShipName:PIXI.Text;
    private shipName:String = "";
    private btnCheck:Button;

    constructor()
    {
        super();
    }

    public init()
    {
        super.init(); // background and x button

        // remove X button, this screen only has a checkmark button to accept and move on.
        this.removeChild(this.btnX);

        // create and add the two choices for first mate
        this.femMate = new PIXI.Sprite(PIXI.Texture.fromFrame("charPirateFemale.png"));
        this.femMate.x = 125;
        this.femMate.y = 26;
        this.addChild(this.femMate);
        this.femMate.interactive = true;
        this.femMate.on("click", this.onFemme);

        this.maleMate = new PIXI.Sprite(PIXI.Texture.fromFrame("charPirateMale.png"));
        this.maleMate.x = 286;
        this.maleMate.y = 10;
        this.addChild(this.maleMate);
        this.maleMate.interactive = true;
        this.maleMate.on("click", this.onMale);

        // define the two glows
        this.blackShadow = new filters.GlowFilter(10, 1, 1, 0x000000);
        this.highlight = new filters.GlowFilter(10, 1, 1, 0xFFFFFF);

        // add the four faction flags
        this.flagEnglish = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagEnglish.png"));
        this.flagEnglish.x = 544;
        this.flagEnglish.y = 112;
        this.addChild(this.flagEnglish);
        this.flagEnglish.interactive = true;
        this.flagEnglish.on("click", this.onEnglish);
        this.flagEnglish.filters = [this.blackShadow];

        this.flagFrench = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagFrench.png"));
        this.flagFrench.x = 544;
        this.flagFrench.y = 186;
        this.addChild(this.flagFrench);
        this.flagFrench.interactive = true;
        this.flagFrench.on("click", this.onFrench);
        this.flagFrench.filters = [this.blackShadow];

        this.flagSpanish = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagSpanish.png"));
        this.flagSpanish.x = 544;
        this.flagSpanish.y = 261;
        this.addChild(this.flagSpanish);
        this.flagSpanish.interactive = true;
        this.flagSpanish.on("click", this.onSpanish);
        this.flagSpanish.filters = [this.blackShadow];

        this.flagDutch = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_flagDutch.png"));
        this.flagDutch.x = 544;
        this.flagDutch.y = 335;
        this.addChild(this.flagDutch);
        this.flagDutch.interactive = true;
        this.flagDutch.on("click", this.onDutch);
        this.flagDutch.filters = [this.blackShadow];

        // text frame
        this.textFrame = new PIXI.Sprite(PIXI.Texture.fromFrame("TextEntryBox.png"));
        this.textFrame.x = 258;
        this.textFrame.y = 466;
        this.addChild(this.textFrame);

        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });

        // faction label centered over english flag
        this.lblFaction = new PIXI.Text("Faction:", style);
        this.lblFaction.x = this.flagEnglish.x + this.flagEnglish.width/2 - this.lblFaction.width/2;
        this.lblFaction.y = 68;
        this.addChild(this.lblFaction);

        // ship name label
        this.lblShipName = new PIXI.Text("Ship Name:", style);
        this.lblShipName.x = this.textFrame.x - this.lblShipName.width - 10;
        this.lblShipName.y = 463;
        this.addChild(this.lblShipName);

        this.btnCheck = new Button( PIXI.Texture.fromFrame("BtnCheck.png"));
        this.btnCheck.anchor.x = this.btnX.anchor.y = 0.5;
        this.btnCheck.x = 587;
        this.btnCheck.y = 484;
        this.addChild(this.btnCheck);
        this.btnCheck.on('click', this.onCheck);

    }

    onEnglish = () => {
        this.flagEnglish.filters = [this.highlight];
        this.flagFrench.filters = [this.blackShadow];
        this.flagSpanish.filters = [this.blackShadow];
        this.flagDutch.filters = [this.blackShadow];
    }

    onFrench = () => {
        this.flagEnglish.filters = [this.blackShadow];
        this.flagFrench.filters = [this.highlight];
        this.flagSpanish.filters = [this.blackShadow];
        this.flagDutch.filters = [this.blackShadow];
    }
    
    onSpanish = () => {
        this.flagEnglish.filters = [this.blackShadow];
        this.flagFrench.filters = [this.blackShadow];
        this.flagSpanish.filters = [this.highlight];
        this.flagDutch.filters = [this.blackShadow];       
    }

    onDutch = () => {
        this.flagEnglish.filters = [this.blackShadow];
        this.flagFrench.filters = [this.blackShadow];
        this.flagSpanish.filters = [this.blackShadow];
        this.flagDutch.filters = [this.highlight];              
    }

    onCheck = () => {
        // clicked the check button! verify data and proceed
    }

    onFemme = () => {
        this.femMate.filters = [this.highlight];   
        this.maleMate.filters = [];
    }

    onMale = () => {
        this.maleMate.filters = [this.highlight];   
        this.femMate.filters = [];
    }

}