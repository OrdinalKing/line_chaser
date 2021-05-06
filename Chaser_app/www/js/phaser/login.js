/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class LoginScreen extends Phaser.Scene{
    constructor(){
        super({key: "LoginScreen"});
        if(!game.device.os.desktop)
        {
            game.input.mouse.enabled = false;
        }
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true);
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

        this.load.image("Logo", "./images/logo.png");
        this.load.image("Login", "./images/login.png");
        this.load.image("SignUp", "./images/signup.png");
        this.load.image("InputBack", "./images/input_back.png");
        this.load.image("Panel", "./images/user_panel.png");
        this.load.image("Board", "./images/game_board.png");
        this.load.image("Heart", "./images/heart.png");
        this.load.image("Coin", "./images/coin.png");
        this.load.image("Point", "./images/point.png");
        this.load.image("Play", "./images/play.png");
        this.load.image("Setting", "./images/setting.png");
        this.load.atlas('flares', './images/particles/flares.png', './images/particles/flares.json');
        this.load.image("Cross", "./images/cross.png");
        this.load.image('triangle', './images/particles/triangle.png');
        this.load.image('rectangle', './images/particles/rectangle.png');
        this.load.image('pentagon', './images/particles/pentagon.png');
        this.load.image('circle', './images/particles/circle.png');
        this.load.image("MainPage", "./images/main_page.png");
        this.load.image("PurchaseCoin", "./images/purchase_coin.png");
        this.load.image("Purchase", "./images/purchase.png");
        this.load.image("ReviveAdmob", "./images/revive_admob.png");
        this.load.image("ReviveCoin", "./images/revive_coin.png");
        this.load.image("Back", "./images/back.png");
        this.load.image("PlayAgain", "./images/play_again.png");

        for(let i=0; i<10; i++){
            this.load.image("Avatar_" + i, "./images/avatar/" + i + ".png");
        }

        this.load.audio('bonus', './assets/audio/bonus.wav');
        this.load.audio('coin', './assets/audio/coin.wav');
        this.load.audio('completion', './assets/audio/completion.wav');
        this.load.audio('level_music', './assets/audio/level_music.wav');
        this.load.audio('revive', './assets/audio/revive.wav');
        this.load.audio('fail', './assets/audio/fail.wav');
    }

    create() {
        this.logo = this.add.image(540,400,'Logo');

        this.userNameImage = this.add.image(540,820,'InputBack');
        this.userName = this.add.rexInputText(540, 820, 620, 70, 
            {
                text:'admin',
                type:'text',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);

        this.userNameText = this.add.text(210, 755, 'Username', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.passwordImage = this.add.image(540,1000,'InputBack');
        this.password = this.add.rexInputText(540, 1000, 620, 70, 
            {
                text:'1234',
                type:'password',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.passwordText = this.add.text(210, 935, 'Password', { fixedWidth: 200, fixedHeight: 32 })
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

        this.loginButton = this.add.image(540,1200,'Login');
        this.loginButton.setInteractive().on('pointerdown', () => {
            Client.login(this.userName.text, this.password.text);
        });

        this.registerText = this.add.text(540, 1500, 'SignUp Now', { fixedWidth: 500, fixedHeight: 120 })
        .setStyle({
            fontSize: '84px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            fill: '#1fbae1',
        })
        .setOrigin(0.5,0.5);
        this.registerText.stroke = "#f0fafe";
        this.registerText.strokeThickness = 32;
        //  Apply the shadow to the Stroke and the Fill (this is the default)
        this.registerText.setShadow(10, 10, "#333333", 10, true, true);

        this.registerText.setInteractive().on('pointerdown', () => {
            game.scene.stop('LoginScreen');
            game.scene.start('RegisterScreen');
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
        .show('Login failed...')
        .show('Correct infomation...')
    }

    toast_register_succeed(){
        var toast = this.rexUI.add.toast({
            x: 150,
            y: 550,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xcc4040),
            text: this.add.text(0, 0, '', {
                fontSize: '64px'
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
        .show('Sign Up succeed...')
    }
}
