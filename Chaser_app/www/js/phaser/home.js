/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class HomeScreen extends Phaser.Scene{
    constructor(){
        super({key: "HomeScreen"});
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

        this.play = this.add.image(245,450,'Play');
        this.play.setInteractive().on('pointerdown', () => {

            target_width = 20;
            // target_position = Math.floor(Math.random() * 280) + 40;
            target_position = 320;
            path_index = 0;
            level = 1;
            revive_count = 0;
            // //For Test
            // level = 50;
            // userData.heart = 3;
            // if(level>5){
            //     target_position = Math.floor(Math.random() * 280) + 40;
            // }
            // if(level>20)
            // {
            //     if(level<=50){
            //         path_index = (level - 20);
            //     }
            //     else{
            //         path_index = Math.floor(Math.random() * 31);
            //     }
            // }
            // if(level>40){
            //     if(level>50)
            //         target_width = 10;
            //     else
            //         target_width = 20-(level-40);
            // }
            // //Test End
            game.domContainer.style.display = 'block';

            game.scene.stop('HomeScreen');
            game.scene.start('GameScreen');
        });
        this.setting = this.add.image(675,450,'Setting');
        this.setting.setInteractive().on('pointerdown', () => {
            game.domContainer.style.display = 'block';
            game.scene.stop('HomeScreen');
            game.scene.start('SettingScreen');
        });

        this.help = this.add.image(965,450,'Help');
        this.help.setInteractive().on('pointerdown', () => {
            game.domContainer.style.display = 'block';
            game.scene.stop('HomeScreen');
            game.scene.start('HelpScreen');
        });

        this.waitingText = this.add.text(540, 800, 'Fetching Ranking From Server...', { fixedWidth: 1000, fixedHeight: 200 })
        .setStyle({
            fontSize: '64px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            fill: '#fa5c00',
        })
        .setOrigin(0.5,0.5);
        this.waitingText.stroke = "#f0fafe";
        this.waitingText.strokeThickness = 32;
        //  Apply the shadow to the Stroke and the Fill (this is the default)
        this.waitingText.setShadow(10, 10, "#333333", 10, true, true);
        Client.ranking();
        if(userData.heart == 0)
        {
            this.play.disableInteractive();
            this.play.setAlpha(0.5);
            toast_error(this, 'Please Revive in the setting screen.');
            this.tweens.add({targets:this.setting, duration:1000, loop: -1, alpha: 0.5, ease: 'Linear', yoyo: true});
        }
    }
    
    update(){
        // this.coinText.setText(userData.coin);
        // this.lifeText.setText(userData.heart);
        // this.points.setText(userData.point);
    }
    
    updateRanking(my_rank, rank_list){
        if(this.waitingText)
        {
            this.waitingText.destroy();
            this.rank_list = this.rexUI.add.scrollablePanel({
                x: 540,
                y: 1200,
                width: 1000,
                height: 1300,
    
                scrollMode: 0,
    
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x4e342e),
    
                panel: {
                    child: this.rexUI.add.fixWidthSizer({
                        space: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10,
                            item: 16,
                            line: 16,
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
                },

                header: this.add.text(0, 0, 'Live Ranking', { fixedWidth: 1000, fixedHeight: 100 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    align: "center",
                    fill: '#fa5c00',
                })
                .setOrigin(0.5,0.5),
                
                expand: {
                    header: true,
                },

                align: {
                    header: 'center',
                },
            });
        }
        var sizer = this.rank_list.getElement('panel');
        sizer.clear(true);

        let bInRanking = false;
        for(let i=0; i<rank_list.length; i++){
            if(rank_list[i].username == userData.username)
            {
                sizer.add(this.add.text(0, 0, (i+1) + ' - ' + rank_list[i].username + ' (Lv:' + rank_list[i].level + ',Pt:' + rank_list[i].point + ')', { fixedWidth: 900, fixedHeight: 80 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#1fbae1',
                }));
                bInRanking = true;
            }
            else{
                sizer.add(this.add.text(0, 0, (i+1) + ' - ' + rank_list[i].username + ' (Lv:' + rank_list[i].level + ',Pt:' + rank_list[i].point + ')', { fixedWidth: 900, fixedHeight: 80 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                }));
            }
        }
        if(!bInRanking){
            if(my_rank < 10){
                sizer.add(this.add.text(0, 0, '   ...   ', { fixedWidth: 900, fixedHeight: 80 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#ffffff',
                }));
            }
            sizer.add(this.add.text(0, 0, (my_rank+1) + ' - ' + userData.username + ' (Lv:' + userData.level + ',Pt:' + userData.point + ')', { fixedWidth: 900, fixedHeight: 80 })
            .setStyle({
                fontSize: '64px',
                fontFamily: 'RR',
                fontWeight: 'bold',
                color: '#ffffff',
            }));
        }
        this.rank_list.layout();
        this.rank_list.setSliderEnable(true);
        this.rank_list.setScrollerEnable(true);
        game.domContainer.style.display = 'none';
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
        if(userData.heart == 0)
        {
            this.play.disableInteractive();
            this.play.setAlpha(0.5);
        }
        else
        {
            this.play.setInteractive();
            this.play.setAlpha(1);
        }
    }

}
