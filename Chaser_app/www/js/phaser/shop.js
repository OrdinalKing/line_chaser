/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class ShopScreen extends Phaser.Scene{
    constructor(){
        super({key: "ShopScreen"});
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    }

    create() {
        this.resultText = this.add.text(540, 400, 'Shop', { fixedWidth: 1000, fixedHeight: 200 })
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

        item_type = -1;
        this.removeAdmob = this.add.image(240,650,'RemoveAdmobUp');
        this.removeAdmob.setInteractive().on('pointerdown', () => {
            if(item_type == 0){
                this.removeAdmob.setTexture('RemoveAdmobUp');
                item_type = -1;
            }
            else
            {
                item_type = 0;
                this.removeAdmob.setTexture('RemoveAdmobDown');
                this.coin1000.setTexture('Gold1000Up');
                this.coin10000.setTexture('Gold10000Up');
            }
        });
        this.coin1000 = this.add.image(540,650,'Gold1000Up');
        this.coin1000.setInteractive().on('pointerdown', () => {
            if(item_type == 1){
                this.coin1000.setTexture('Gold1000Up');
                item_type = -1;
            }
            else
            {
                item_type = 1;
                this.removeAdmob.setTexture('RemoveAdmobUp');
                this.coin1000.setTexture('Gold1000Down');
                this.coin10000.setTexture('Gold10000Up');
            }
        });
        this.coin10000 = this.add.image(840,650,'Gold10000Up');
        this.coin10000.setInteractive().on('pointerdown', () => {
            if(item_type == 2){
                this.coin10000.setTexture('Gold10000Up');
                item_type = -1;
            }
            else
            {
                item_type = 2;
                this.removeAdmob.setTexture('RemoveAdmobUp');
                this.coin1000.setTexture('Gold1000Up');
                this.coin10000.setTexture('Gold10000Down');
            }
        });

        this.stripeButton = this.add.image(540,1000,'Stripe');
        this.stripeButton.setInteractive().on('pointerdown', () => {
            if(item_type == -1)
            {
                this.toast_method();
                return;
            }
            game.scene.stop('ShopScreen');
            game.scene.start('StripeScreen');
        });

        this.paypalButton = this.add.image(540,1200,'Paypal');
        this.paypalButton.setInteractive().on('pointerdown', () => {
            if(item_type == -1)
            {
                this.toast_method();
                return;
            }
            let Amount = 2.99;
            let Description = '';
            if(item_type == 0){
                Amount = 2.99;
                Description = 'Purchase Remove Admob';
            } else if(item_type == 1){
                Amount = 0.99;
                Description = 'Purchase 1000 Coins';
            } else if(item_type == 2){
                Amount = 2.99;
                Description = 'Purchase 10000 Coins';
            }
            
            var paymentDetails = new PayPalPaymentDetails(Amount, "0.00", "0.00");
            //new PayPalPayment Details("subtotal","shipping","tax");
            //PayPalPalment("total","currency in ISO 4217 format","Description","Sale",object);
            var payment = new PayPalPayment(Amount, "GBP", Description, "Sale", paymentDetails);
        
            PayPalMobile.renderSinglePaymentUI(payment,
                function(payment) {
                    Client.purchase_coin_paypal(payment.orderId, item_type);
                },
                function(error) {
                    let activeScene = game.scene.getScenes(true)[0];
                    toast_error(activeScene, "Purchase failed.");
                });
        });

        this.googlepayButton = this.add.image(540,1400,'Googlepay');
        this.googlepayButton.setInteractive().on('pointerdown', () => {
            if(item_type == -1)
            {
                this.toast_method();
                return;
            }
            
        });

        this.backButton = this.add.image(540,1600,'Back');
        this.backButton.setInteractive().on('pointerdown', () => {
            if(level>1)
            {
                game.scene.stop('ShopScreen');
                game.scene.start('EndScreen');
            }
            else{
                game.scene.stop('ShopScreen');
                game.scene.start('SettingScreen');
            }
        });
    }

    update(){
    }

    toast_method(){
        var toast = this.rexUI.add.toast({
            x: 540,
            y: 1500,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
            text: this.add.text(0, 0, '', {
                fontSize: '48px'
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
        .show('Please Select Method...')
    }

    createLabel(text) {
        return this.rexUI.add.label({
            width: 280,
            height: 140,
    
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xfa5c00),
    
            text: this.add.text(0, 0, text, {
                fontFamily: 'RR',
                fontWeight: 'bold',
                fontSize: '90px',
                color: "#ffffff",
                align: "center"
            }),
    
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
    
            align: "center"
        });
    }
}
