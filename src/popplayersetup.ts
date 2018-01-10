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
    private shipName:string = "";
    private btnCheck:Button;
    private txtShipName:PIXI.Text;
    private txtHint:PIXI.Text;

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
        this.textFrame.y = 461;
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

        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 24,
            fill: 'black'
        });

        this.txtShipName = new PIXI.Text("", styleb);
        this.txtShipName.x = this.textFrame.x + 6;
        this.txtShipName.y = this.textFrame.y + 8;
        this.addChild(this.txtShipName);

        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 16,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: 150
        });

        this.txtHint = new PIXI.Text("Welcome to Pirates on the Trade Winds! Select your first mate...", stylec);
        this.txtHint.x = 53;
        this.txtHint.y = 131;
        this.addChild(this.txtHint);

        this.btnCheck = new Button( PIXI.Texture.fromFrame("BtnCheck.png"));
        this.btnCheck.anchor.x = this.btnX.anchor.y = 0.5;
        this.btnCheck.x = 587;
        this.btnCheck.y = 484;
        this.addChild(this.btnCheck);
        this.btnCheck.on('click', this.onCheck);

        window.addEventListener(
            "keydown", this.keyDownHandler, false
            );

    }

    keyDownHandler = (event:any) => {
        //console.log("Pressed key: " + event.keyCode);
        if (event.keyCode == 32 || (event.keyCode >= 65 && event.keyCode <= 90) ||
            (event.keyCode >= 97 && event.KeyCode <= 122) )
        {
            this.shipName += event.key;
            this.txtShipName.text = this.shipName;
            //console.log(event.keyCode);
            this.txtHint.text = "When finished with your ship name, click the check button to set sail!";
        }

        if (event.keyCode == 8) // backspace
        {
            // delete the end character of ship name
            this.shipName = this.shipName.slice(0,-1);
            this.txtShipName.text = this.shipName;
        }
    }

    onEnglish = () => {
        this.flagEnglish.filters = [this.highlight];
        this.flagFrench.filters = [this.blackShadow];
        this.flagSpanish.filters = [this.blackShadow];
        this.flagDutch.filters = [this.blackShadow];
        this.txtHint.text = "You have selected to hoist the English flag! Now name your ship below!";
    }

    onFrench = () => {
        this.flagEnglish.filters = [this.blackShadow];
        this.flagFrench.filters = [this.highlight];
        this.flagSpanish.filters = [this.blackShadow];
        this.flagDutch.filters = [this.blackShadow];
        this.txtHint.text = "You have selected to hoist the French flag! Now name your ship below!";
    }
    
    onSpanish = () => {
        this.flagEnglish.filters = [this.blackShadow];
        this.flagFrench.filters = [this.blackShadow];
        this.flagSpanish.filters = [this.highlight];
        this.flagDutch.filters = [this.blackShadow];     
        this.txtHint.text = "You have selected to hoist the Spanish flag! Now name your ship below!";  
    }

    onDutch = () => {
        this.flagEnglish.filters = [this.blackShadow];
        this.flagFrench.filters = [this.blackShadow];
        this.flagSpanish.filters = [this.blackShadow];
        this.flagDutch.filters = [this.highlight];     
        this.txtHint.text = "You have selected to hoist the Dutch flag! Now name your ship below!";         
    }

    onCheck = () => {
        // clicked the check button! verify data and proceed
        // save the ship name
        SingletonClass.ship.setName(this.shipName);
        this.close();
    }

    onFemme = () => {
        this.femMate.filters = [this.highlight];   
        this.maleMate.filters = [];
        this.txtHint.text = "Now choose one of the four faction flags to the right!"
    }

    onMale = () => {
        this.maleMate.filters = [this.highlight];   
        this.femMate.filters = [];
        this.txtHint.text = "Now choose one of the four faction flags to the right!"
    }

}