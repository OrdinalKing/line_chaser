/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class StripeScreen extends Phaser.Scene{
    constructor(){
        super({key: "StripeScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);


        this.load.image("Purchase", "./images/purchase.png");
        this.load.image("Back", "./images/back.png");
    }

    create() {
        this.resultText = this.add.text(540, 400, 'Stripe Payment', { fixedWidth: 1000, fixedHeight: 200 })
        .setStyle({
            fontSize: '76px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            fill: '#fa5c00',
        })
        .setOrigin(0.5,0.5);
        this.resultText.stroke = "#f0fafe";
        this.resultText.strokeThickness = 32;
        //  Apply the shadow to the Stroke and the Fill (this is the default)
        this.resultText.setShadow(10, 10, "#333333", 10, true, true);

        this.cardNumberImage = this.add.image(540,700,'InputBack');
        this.cardNumber = this.add.rexInputText(540, 700, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);

        this.cardNumberText = this.add.text(210, 635, 'CardNumber', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.expMonthImage = this.add.image(540,850,'InputBack');
        this.expMonth = this.add.rexInputText(540, 850, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.expMonthText = this.add.text(210, 785, 'ExpMonth', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.expYearImage = this.add.image(540,1000,'InputBack');
        this.expYear = this.add.rexInputText(540, 1000, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.expYearText = this.add.text(210, 935, 'ExpYear', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.cvcImage = this.add.image(540,1150,'InputBack');
        this.cvc = this.add.rexInputText(540, 1150, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.cvcText = this.add.text(210, 1085, 'CVC', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        // this.forgotText = this.add.text(860, 765, 'Forgot Password?', { fixedWidth: 250, fixedHeight: 32 })
        // .setStyle({
        //     fontSize: '28px',
        //     fontFamily: 'RR',
        //     fontWeight: 'bold',
        //     color: '#ffffffa0',
        // })
        // .setOrigin(1,0.5);

        this.purchaseButton = this.add.image(540,1300,'Purchase');
        this.purchaseButton.setInteractive().on('pointerdown', () => {
            cordova.plugins.stripe.setPublishableKey(stripe_key);
            var card = {
                number: this.cardNumber.text, 
                expMonth: Number.parseInt(this.expMonth.text), 
                expYear: Number.parseInt(this.expYear.text), 
                cvc: this.cvc.text,
            };

            function onSuccess(tokenId) {
                console.log(tokenId);
                Client.purchase_coin(tokenId);
            }
             
            function onError(errorMessage) {
                console.log(errorMessage);
                //toast
            }
             
            cordova.plugins.stripe.createCardToken(card, onSuccess, onError);
        });

        this.backButton = this.add.image(540,1600,'Back');
        this.backButton.setInteractive().on('pointerdown', () => {
            if(level>1)
            {
                game.scene.stop('StripeScreen');
                game.scene.start('EndScreen');
            }
            else{
                game.scene.stop('StripeScreen');
                game.scene.start('SettingScreen');
            }
        });
    }

    update(){
    }

    toast_failed(){
        var toast = this.rexUI.add.toast({
            x: 150,
            y: 550,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
            text: this.add.text(0, 0, '', {
                fontSize: '18px'
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            duration: {
                in: 250,
                hold: 1000,
                out: 250,
            },
        })
        .show('Register failed...')
        .show('UserName Duplicated...')
    }

}

var FitTo = function (child, parent, out) {
    if (out === undefined) {
        out = {};
    } else if (out === true) {
        out = globalSize;
    }

    if ((child.width <= parent.width) && (child.height <= parent.height)) {
        out.width = child.width;
        out.height = child.height;
        return out;
    }

    var childRatio = child.width / child.height;
    out.width = Math.min(child.width, parent.width);
    out.height = Math.min(child.height, parent.height);
    var ratio = out.width / out.height;

    if (ratio < childRatio) {
        out.height = out.width / childRatio;
    } else if (ratio > childRatio) {
        out.width = out.height * childRatio;
    }

    return out;
}

var globalSize = {};
