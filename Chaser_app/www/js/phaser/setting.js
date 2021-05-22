/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class SettingScreen extends Phaser.Scene{
    constructor(){
        super({key: "SettingScreen"});
    }

    preload() {
        this.textures.remove('Avatar');
        this.load.image("Avatar", "./images/avatar/" + userData.avatar + ".png");

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

    }

    create() {
        this.selected_avatar = -1;
        this.panel = this.add.image(540,200,'Panel');
        this.avatar = this.add.image(165,200,'Avatar').setScale(0.5);

        this.userNameText = this.add.text(450, 150, userData.username, { fixedWidth: 300, fixedHeight: 70 })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0.5,0.5);

        this.hearts = [];
        for(let i=0; i<3; i++)
        {
            let heart = this.add.image(350 + i*105 , 250, 'Heart');
            if(i+1 > userData.heart)
                heart.setVisible(false);
            this.hearts.push(heart);
        }

        this.coin = this.add.image(700,140,'Coin').setScale(0.15);
        this.coinText = this.add.text(900, 140, userData.coin, { fixedWidth: 300, fixedHeight: 70 })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff00',
        })
        .setOrigin(0.5,0.5);

        this.point = this.add.image(700,260,'Point').setScale(0.15);
        this.pointText = this.add.text(900, 260, userData.point, { fixedWidth: 300, fixedHeight: 70 })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff00',
        })
        .setOrigin(0.5,0.5);

        this.admobButton = this.add.image(270,490,'ReviveAdmob').setScale(0.7);
        this.admobButton.setInteractive().on('pointerdown', () => {
            var date = new Date();
            var month = date.getMonth();
            if(userData.remove_admob != month){
                AdMob.showInterstitial();
                AdMob.prepareInterstitial({
                    adId: admobid.interstitial,
                    autoShow:false,
                    isTesting: true,
                });
            }
            userData.heart = (Number.parseInt(userData.heart) + 3) > 3 ? 3 : (Number.parseInt(userData.heart) + 3);
            Client.level_end(3, 0, 0, 0);
            for(let i=0; i<3; i++)
            {
                if(i+1 > userData.heart)
                    this.hearts[i].setVisible(false);
                else
                    this.hearts[i].setVisible(true);
            }
        });
        this.coinButton = this.add.image(810,490,'ReviveCoin').setScale(0.7);
        this.coinButton.setInteractive().on('pointerdown', () => {
            userData.coin = Number.parseInt(userData.coin) - 1000;
            userData.heart = (Number.parseInt(userData.heart) + 3) > 3 ? 3 : (Number.parseInt(userData.heart) + 3);
            Client.level_end(3, -1000, 0, 0);
            for(let i=0; i<3; i++)
            {
                if(i+1 > userData.heart)
                    this.hearts[i].setVisible(false);
                else
                    this.hearts[i].setVisible(true);
            }
            this.coinText.setText(userData.coin);
            if(Number.parseInt(userData.coin)<1000){
                this.coinButton.disableInteractive();
                this.coinButton.setAlpha(0.5);
            }
        });
        if(Number.parseInt(userData.coin)<1000){
            this.coinButton.disableInteractive();
            this.coinButton.setAlpha(0.5);
        }
        this.purchaseButton = this.add.image(810,390,'PurchaseCoin').setScale(0.7);
        this.purchaseButton.setInteractive().on('pointerdown', () => {
            game.domContainer.style.display = 'block';
            game.scene.stop('SettingScreen');
            game.scene.start('ShopScreen');
        });
        this.mainButton = this.add.image(270, 390,'MainPage').setScale(0.7);
        this.mainButton.setInteractive().on('pointerdown', () => {
            game.domContainer.style.display = 'block';
            game.scene.stop('SettingScreen');
            game.scene.start('HomeScreen');
        });

        this.logoutButton = this.add.image(270, 590,'Logout').setScale(0.7);
        this.logoutButton.setInteractive().on('pointerdown', () => {
            Client.logout();
            window.localStorage.removeItem("UserName");
            window.localStorage.removeItem("Password");
            game.domContainer.style.display = 'block';
            game.scene.stop('SettingScreen');
            game.scene.start('LoginScreen');
        });
        this.purchaseAvatarButton = this.add.image(0,0,'Purchase').setScale(0.7).setDepth(3);
        this.purchaseAvatarButton.setInteractive().on('pointerdown', () => {
            if(this.selected_avatar != -1){
                if(userData.coin >= 100){
                    userData.coin = Number.parseInt(userData.coin) - 100;
                    Client.level_end(0, -100, 0, 0);
                    userData.avatar = this.selected_avatar;
                    this.avatar.setTexture("Avatar_" + this.selected_avatar);
                    Client.user_data(userData.avatar);
                    this.coinText.setText(userData.coin);
                }
            }
        });

        this.avatarShop = this.rexUI.add.scrollablePanel({
            x: 540,
            y: 1200,
            width: 1000,
            height: 1100,

            scrollMode: 0,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x4e342e),

            panel: {
                child: this.rexUI.add.fixWidthSizer({
                    space: {
                        left: 25,
                        right: 25,
                        top: 25,
                        bottom: 25,
                        item: 25,
                        line: 25,
                    }
                }),

                mask: {
                    padding: 1
                },
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x260e04),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x7b5e57),
                input: 'drag',
                position: 0,
            },

            scroller:{
                threshold: 0,
            },

            clamplChildOY : true,

            space: {
                left: 30,
                right: 30,
                top: 30,
                bottom: 30,

                panel: 30,

                header: 10,
                footer: 10,
            },

            header: this.add.text(0, 0, 'Avatar Shop - Price : 100 Coin', { fixedWidth: 1000, fixedHeight: 100 })
            .setStyle({
                fontSize: '64px',
                fontFamily: 'RR',
                fontWeight: 'bold',
                align: "center",
                fill: '#fa5c00',
            })
            .setOrigin(0.5,0.5),

            footer: this.purchaseAvatarButton,

            expand: {
                header: true,
                footer: false,
            },

            align: {
                header: 'center',
                footer: 'center',
            },
        });
        var sizer = this.avatarShop.getElement('panel');
        sizer.clear(true);

        this.avatars = [];
        for(let i=0; i<10; i++)
        {
            this.avatars.push(this.add.image(0, 0, "Avatar_" + i).setScale(0.5));
            sizer.add(this.avatars[i]);
            this.avatars[i].setInteractive().on('pointerdown', () => {
                if(this.selected_avatar != -1)
                {
                    this.avatars[this.selected_avatar].setAlpha(1.0);
                }
                this.selected_avatar = i;
                this.avatars[i].setAlpha(0.5);
            });
        }

        this.avatarShop.layout();
        this.avatarShop.setSliderEnable(true);
        this.avatarShop.setScrollerEnable(true);
        game.domContainer.style.display = 'none';
    }
    update(){

    }

    updateUser(){
        for(let i=0; i<3; i++)
        {
            if(i+1 > userData.heart)
                this.hearts[i].setVisible(false);
            else
                this.hearts[i].setVisible(true);
        }
        this.coinText.setText(userData.coin);
        this.pointText.setText(userData.point);

        if(Number.parseInt(userData.coin)>=1000){
            this.coinButton.setInteractive();
            this.coinButton.setAlpha(1.0);
        }
    }
}
