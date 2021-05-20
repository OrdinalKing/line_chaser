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
    }

    create() {
        this.resultText = this.add.text(540, 300, 'Stripe Payment', { fixedWidth: 1000, fixedHeight: 200 })
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

        this.method = -1;
        this.removeAdmob = this.add.image(240,550,'RemoveAdmobUp');
        this.removeAdmob.setInteractive().on('pointerdown', () => {
            if(this.method == 0){
                this.removeAdmob.setTexture('RemoveAdmobUp');
                this.method = -1;
            }
            else
            {
                this.method = 0;
                this.removeAdmob.setTexture('RemoveAdmobDown');
                this.coin1000.setTexture('Gold1000Up');
                this.coin10000.setTexture('Gold10000Up');
            }
        });
        this.coin1000 = this.add.image(540,550,'Gold1000Up');
        this.coin1000.setInteractive().on('pointerdown', () => {
            if(this.method == 1){
                this.coin1000.setTexture('Gold1000Up');
                this.method = -1;
            }
            else
            {
                this.method = 1;
                this.removeAdmob.setTexture('RemoveAdmobUp');
                this.coin1000.setTexture('Gold1000Down');
                this.coin10000.setTexture('Gold10000Up');
            }
        });
        this.coin10000 = this.add.image(840,550,'Gold10000Up');
        this.coin10000.setInteractive().on('pointerdown', () => {
            if(this.method == 2){
                this.coin10000.setTexture('Gold10000Up');
                this.method = -1;
            }
            else
            {
                this.method = 2;
                this.removeAdmob.setTexture('RemoveAdmobUp');
                this.coin1000.setTexture('Gold1000Up');
                this.coin10000.setTexture('Gold10000Down');
            }
        });

        this.cardNumberImage = this.add.image(540,800,'InputBack');
        this.cardNumber = this.add.rexInputText(540, 800, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);

        this.cardNumberText = this.add.text(210, 735, 'CardNumber', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.expMonthImage = this.add.image(540,950,'InputBack');
        this.expMonth = this.add.rexInputText(540, 950, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.expMonthText = this.add.text(210, 885, 'ExpMonth', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.expYearImage = this.add.image(540,1100,'InputBack');
        this.expYear = this.add.rexInputText(540, 1100, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.expYearText = this.add.text(210, 1035, 'ExpYear', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.cvcImage = this.add.image(540,1250,'InputBack');
        this.cvc = this.add.rexInputText(540, 1250, 620, 70, 
            {
                text:'',
                type:'number',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.cvcText = this.add.text(210, 1185, 'CVC', { fixedWidth: 200, fixedHeight: 32 })
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

        this.purchaseButton = this.add.image(540,1400,'Purchase');
        this.purchaseButton.setInteractive().on('pointerdown', () => {
            if(this.method == -1)
            {
                this.toast_method();
                return;
            }
            this.confirm_modal();
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
        .show('Purchase failed...')
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
    
    confirm_modal(){
        var cover = this.add.rectangle(-1000,-1000,2080,2680,0x222222, 0.2).setOrigin(0,0).setDepth(1).setInteractive();
        var dialog = this.rexUI.add.dialog({
            x: 540,
            y: 300,
    
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xffffff),
            content: this.add.text(0, 0, 'CONFIRM PURCHASE', {
                fontFamily: 'RR',
                fontWeight: 'bold',
                fontSize: '64px',
                color: "#106eac",
                align: "center"
            }),
    
            actions: [
                this.createLabel('YES'),
                this.createLabel('NO')
            ],
    
            space: {
                content: 25,
                action: 15,
    
                left: 60,
                right: 60,
                top: 40,
                bottom: 40,
            },
    
            align: {
                actions: 'center', // 'center'|'left'|'right'
            },
    
            expand: {
                content: false, // Content is a pure text object
            }
        }).setDepth(100)
            .layout()
            .popUp(1000);
    
        var scene = this;
        dialog
            .on('button.click', function (button, groupName, index) {
                cordova.plugins.stripe.setPublishableKey(stripe_key);
                var card = {
                    number: scene.cardNumber.text, 
                    expMonth: Number.parseInt(scene.expMonth.text), 
                    expYear: Number.parseInt(scene.expYear.text), 
                    cvc: scene.cvc.text,
                };
    
                function onSuccess(tokenId) {
                    let activeScene = game.scene.getScenes(true)[0];
                    toast_error(activeScene, "Purchase requested to server.");
                    Client.purchase_coin(tokenId, scene.method);
                }
                 
                function onError(errorMessage) {
                    let activeScene = game.scene.getScenes(true)[0];
                    toast_error(activeScene, "Purchase failed on stripe.");
                }
                 
                cordova.plugins.stripe.createCardToken(card, onSuccess, onError);
                cover.destroy();
                dialog.destroy();
            })
            .on('button.over', function (button, groupName, index) {
                // button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index) {
                // button.getElement('background').setStrokeStyle();
            });
    }
}
