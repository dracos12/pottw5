//
// popMsgBox class for brief important messages to the user
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';
import SingletonClass from './singleton';


export default class popMsgBox extends PopUp
{
    private infoGraphic:PIXI.Container; // holds character art and mask, or just the art
    private character:PIXI.Sprite;      // the character to display in the infoGraphic
    private charMask:PIXI.Sprite;       // the mask to apply to the character
    private title:PIXI.Text;
    private body:PIXI.Text;
    private strTitle:string;
    private strBody:string;
    private charNum:number;

    constructor()
    {
        super();
    }

    public initMsg(character:number, title:string, body:string)
    {
        this.charNum=character;
        this.strTitle = title;
        this.strBody = body;
    }

    private msgInit()
    {
        // load and position our graphics
        this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("msgBoxBack.png"));
        this.addChild(this.bg);
        this.btnX = new Button( PIXI.Texture.fromFrame("Btn_Ex.png"));
        this.btnX.anchor.x = this.btnX.anchor.y = 0.5;

        this.btnX.x = 374;
        this.btnX.y = 133;
        this.btnX.width = 30;
        this.btnX.height = 28; // slightly smaller btnX

        this.addChild(this.btnX);
        this.btnX.on('click', this.btnXClick);
    }

    public init()
    {
        // do not call the super init, instead do our own init
        this.msgInit();

        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 18,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: 239
        });

        this.body = new PIXI.Text(this.strBody, styleb);
        this.body.x = 147;
        this.body.y = 43;
        this.addChild(this.body);

        this.title = new PIXI.Text(this.strTitle, style);
        this.title.x = this.body.x + this.body.width / 2 - this.title.width / 2;
        this.title.y = 11;
        this.addChild(this.title);

        // now add the infoGraphic
        this.infoGraphic = new PIXI.Container();
        // switch on character, for now just load female
        this.character = new PIXI.Sprite(PIXI.Texture.fromFrame("charPirateFemale.png"));
        this.charMask = new PIXI.Sprite(PIXI.Texture.fromFrame("mask2.png"));
        this.infoGraphic.addChild(this.character);
        this.infoGraphic.addChild(this.charMask);
        this.character.x = this.charMask.width / 2 - this.character.width/2; // center under mask
        this.character.y = -20;
        this.infoGraphic.x = 14;
        this.infoGraphic.y = 28;
        this.addChild(this.infoGraphic);

        this.infoGraphic.mask = this.charMask; // set the mask

    }
}