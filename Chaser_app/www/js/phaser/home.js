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
        this.load.image("Panel", "./images/user_panel.png");
        this.load.image("Board", "./images/game_board.png");
        this.load.image("Heart", "./images/heart.png");
        this.load.image("Coin", "./images/coin.png");
        this.load.image("Point", "./images/point.png");
        this.load.image("Play", "./images/play.png");
        this.load.image("Setting", "./images/setting.png");

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        // this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        // if(userData.avatar != "")
        // {
        //     if(this.textures.exists('user_avatar'))
        //         this.textures.remove('user_avatar');
        //     this.textures.addBase64('user_avatar', userData.avatar);
        // }
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

        this.play = this.add.image(270,450,'Play');
        this.play.setInteractive().on('pointerdown', () => {

            target_width = 20;
            // target_position = Math.floor(Math.random() * 280) + 40;
            target_position = 320;
            path_index = 0;
            level = 1;

            // //For Test
            // level = 45;
            // userData.heart = 50;
            // if(level>20)
            // {
            //     path_index = (level - 20);
            // }
            // if(level>30)
            // {
            //     target_position = Math.floor(Math.random() * 280) + 40;
            // }
            // if(level>40){
            //     target_width = 20-(level-40);
            // }
            // //Test End
            game.domContainer.style.display = 'block';

            game.scene.stop('HomeScreen');
            game.scene.start('GameScreen');
        });
        if(userData.heart == 0)
        {
            this.play.disableInteractive();
            this.play.setAlpha(0.5);
        }
        this.setting = this.add.image(810,450,'Setting');
        this.setting.setInteractive().on('pointerdown', () => {
            game.domContainer.style.display = 'block';
            game.scene.stop('HomeScreen');
            game.scene.start('SettingScreen');
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
                sizer.add(this.add.text(0, 0, (i+1) + '   -   ' + rank_list[i].username + ' : ' + rank_list[i].point, { fixedWidth: 900, fixedHeight: 80 })
                .setStyle({
                    fontSize: '64px',
                    fontFamily: 'RR',
                    fontWeight: 'bold',
                    color: '#1fbae1',
                }));
                bInRanking = true;
            }
            else{
                sizer.add(this.add.text(0, 0, (i+1) + '   -   ' + rank_list[i].username + ' : ' + rank_list[i].point, { fixedWidth: 900, fixedHeight: 80 })
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
            sizer.add(this.add.text(0, 0, (my_rank+1) + '   -   ' + userData.username + ' : ' + userData.point, { fixedWidth: 900, fixedHeight: 80 })
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
    toast_tournament_failed(){
        // var toast = this.rexUI.add.toast({
        //     x: 150,
        //     y: 550,

        //     background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
        //     text: this.add.text(0, 0, '', {
        //         fontSize: '18px'
        //     }),
        //     space: {
        //         left: 20,
        //         right: 20,
        //         top: 20,
        //         bottom: 20,
        //     },

        //     duration: {
        //         in: 250,
        //         hold: 1000,
        //         out: 250,
        //     },
        // })
        // .show('Can not take part in tournament...')
    }

    toast_game_failed(){
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
        .show('Can not play game...')
    }
}
