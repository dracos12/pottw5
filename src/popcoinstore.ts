//
// popPrizeAgent class for buying reloads to the magazine and ship quests
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import SingletonClass from './singleton';
import StoreCard from './storecard';
import Button from './button';
import popMsgBox from './popmsgbox';

declare var FB:any;


export default class popCoinStore extends PopUp
{

    private cards:Array<StoreCard> = [];
    private btnBuy:Button;
    private clickID:number = -1;
    private badgeBestValue:PIXI.Sprite;
    private purchaseAmount:number;
    private coinInc:number; 
    private purchaseToken:string = "";

    constructor()
    {
        super();
    }

    public init()
    {
        super.init(); // background and x button

        // baked cards for now, later this will be data driven from some kind of store config file
        var card = new StoreCard("10", "$0.99", 1, 2, this.coinCallBack);
        card.x = 183;
        card.y = 85;
        this.addChild(card);
        this.cards.push(card);
        card = new StoreCard("30", "$1.99", 2, 2, this.coinCallBack);
        card.x = 309;
        card.y = 85;
        this.addChild(card);
        this.cards.push(card);
        card = new StoreCard("70", "$4.99", 3, 2, this.coinCallBack);
        card.x = 434;
        card.y = 85;
        this.addChild(card);
        this.cards.push(card);
        card = new StoreCard("300", "$9.99", 4, 2, this.coinCallBack);
        card.x = 183;
        card.y = 278;
        this.addChild(card);
        this.cards.push(card);
        card = new StoreCard("600", "$19.99", 5, 2, this.coinCallBack);
        card.x = 309;
        card.y = 278;
        this.addChild(card);
        this.cards.push(card);
        card = new StoreCard("1,500", "$49.99", 6, 2, this.coinCallBack);
        card.x = 434;
        card.y = 278;
        this.addChild(card);
        this.cards.push(card); 

        this.btnBuy = new Button(PIXI.Texture.fromFrame("btnLong.png"), false, "Buy", 24);
        this.btnBuy.x = 368;
        this.btnBuy.y = 499;
        this.addChild(this.btnBuy);
        this.btnBuy.on('click',this.onBuy);

        this.badgeBestValue = new PIXI.Sprite(PIXI.Texture.fromFrame("bestValue.png"));
        this.badgeBestValue.scale.x =this.badgeBestValue.scale.y = 0.5;
        this.badgeBestValue.x = 163;
        this.badgeBestValue.y = 410;
        this.addChild(this.badgeBestValue);
    }

    onBuy = (e:any) =>
    {
        // start a purchase for the id number contained in the card
        var id = this.clickID;
        if (id == -1)
        {
            var msg = new popMsgBox();
            msg.initMsg(0,"Coin Store", "Click a coin package you'd like to buy then click the Buy button.");
            SingletonClass.popupManager.displayPopup(msg);
            return;
        }

        this.coinInc = 1;
        if (id == 1)
            this.purchaseAmount = 10; // 10 gold
        if (id == 2)
            this.purchaseAmount = 30; // 30 gold
        if (id == 3) {
            this.purchaseAmount = 7; // 70 gold in increments of 10
            this.coinInc = 10;
        }
        if (id == 4) {
            this.purchaseAmount = 30; // 300 gold in increments of 10
            this.coinInc = 10;
        }
        if (id == 5) { // 600 gold in increments of 100
            this.purchaseAmount = 6;
            this.coinInc = 100;
        }
        if (id == 6) { // 1500 gold in increments of 100
            this.purchaseAmount = 15;
            this.coinInc = 100;
        }

        FB.ui(
            {
              method: 'pay',
              action: 'purchaseiap',
              product_id: 'payments_lite_01',
              developer_payload: 'this_is_a_test_payload'
            },
            this.fbIAPResponse // Callback function
        );
    }

    fbIAPResponse = (response:any) => {
        console.log("FB.ui pay response: ");
        console.log(response);

        if (typeof response == 'undefined')
        {
            console.log("fbIAPResponse is undefined");
            return;
        }
        
        if (response.hasOwnProperty("error_message"))
        {
            console.log("Error in FB.ui pay!");
        }
        else 
        {
            this.purchaseToken = response.purchase_token;

            // call the FB api to consume the purchase
            FB.api(
                '/' + this.purchaseToken + '/consume',    // Replace the PURCHASE_TOKEN
                'post',
                {access_token: SingletonClass.player.FBAccessToken},         // Replace with a user access token
                this.fbConsumeResponse
            );

            // and send up the request to the hud to award the coins
            var pos = this.toGlobal(this.btnBuy.position);
            var myEvent = new CustomEvent("buyGold",
            {
                'detail': { "amount": this.purchaseAmount, "inc": this.coinInc, "x": pos.x +this.btnBuy.width/2, "y":pos.y+this.btnBuy.height/2 }
            });
            window.dispatchEvent(myEvent);
        }
    }

    fbConsumeResponse = (response:any) =>
    {
        console.log("fbConsumeResponse: ");
        console.log(response);
    }

    coinCallBack = (id:number) =>
    {
        // loop through cards and unhihlight cards not of this id
        for (var i=0; i<this.cards.length; i++)
        {
            if (this.cards[i].getID() != id)
                this.cards[i].removeGlow();
        }

        this.clickID = id;
    }
}