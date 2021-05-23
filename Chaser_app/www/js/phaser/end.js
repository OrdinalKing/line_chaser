/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class EndScreen extends Phaser.Scene{
    constructor(){
        super({key: "EndScreen"});
    }

    preload() {
        this.textures.remove('Avatar');
        this.load.image("Avatar", "./images/avatar/" + userData.avatar + ".png");
    }

    create() {
        this.revive_audio = this.sound.add('revive');

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

        this.board = this.add.image(540,1195,'Board');

        this.resultText = this.add.text(540, 700, 'Congratulations!\nYou have completed ' + (level-1) + ' levels.', { fixedWidth: 1000, fixedHeight: 200 })
        .setStyle({
            fontSize: '70px',
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

        if(revive_count<1){
            this.admobButton = this.add.image(540,1000,'ContinueAdmob');
        }
        else{
            this.admobButton = this.add.image(540,1000,'StartAgainAdmob');
        }
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
            this.admobButton.disableInteractive();
            this.admobButton.setAlpha(0.5);
            this.coinButton.disableInteractive();
            this.coinButton.setAlpha(0.5);
            this.revive_audio.play();
            revive_count++;
            if(revive_count<2){
                game.scene.stop('EndScreen');
                game.scene.start('GameScreen');
            } else{
                target_width = 20;
                target_position = Math.floor(Math.random() * 280) + 40;
                // target_position = 320;
                path_index = 0;
                level = 2;
                revive_count = 0;
    
                game.scene.stop('EndScreen');
                game.scene.start('GameScreen');
            }
        });
        if(Number.parseInt(userData.heart)>=3){
            this.admobButton.disableInteractive();
            this.admobButton.setAlpha(0.5);
        }
        if(revive_count<1){
            this.coinButton = this.add.image(540,1200,'ContinueCoin');
        } else {
            this.coinButton = this.add.image(540,1200,'StartAgainCoin');
        }
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
            this.admobButton.disableInteractive();
            this.admobButton.setAlpha(0.5);
            this.coinButton.disableInteractive();
            this.coinButton.setAlpha(0.5);
            this.revive_audio.play();
            revive_count++;
            if(revive_count<2){
                game.scene.stop('EndScreen');
                game.scene.start('GameScreen');
            } else{
                target_width = 20;
                target_position = Math.floor(Math.random() * 280) + 40;
                // target_position = 320;
                path_index = 0;
                level = 2;
                revive_count = 0;
    
                game.scene.stop('EndScreen');
                game.scene.start('GameScreen');
            }
        });
        if(Number.parseInt(userData.coin)<1000 || Number.parseInt(userData.heart)>=3){
            this.coinButton.disableInteractive();
            this.coinButton.setAlpha(0.5);
        }
        this.purchaseButton = this.add.image(540,1400,'PurchaseCoin');
        this.purchaseButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('EndScreen');
            game.scene.start('ShopScreen');
        });
        this.mainButton = this.add.image(540,1600,'MainPage');
        this.mainButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('EndScreen');
            game.scene.start('HomeScreen');
        });
    }

    update(){
    }

    updateUser(){
        this.texture.remove('Avatar');
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
