/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class RegisterScreen extends Phaser.Scene{
    constructor(){
        super({key: "RegisterScreen"});
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
        this.logo = this.add.image(540,400,'Logo');

        this.userNameImage = this.add.image(540,700,'InputBack');
        this.userName = this.add.rexInputText(540, 700, 620, 70, 
            {
                text:'',
                type:'text',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);

        this.userNameText = this.add.text(210, 635, 'Username', { fixedWidth: 200, fixedHeight: 32 })
        .setStyle({
            fontSize: '28px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            color: '#ffffff',
        })
        .setOrigin(0,0.5);

        this.emailImage = this.add.image(540,850,'InputBack');
        this.email = this.add.rexInputText(540, 850, 620, 70, 
            {
                text:'',
                type:'text',
                fontSize: '64px',
                fontFamily: 'RR',
                color: '#000000',
            })
        .setOrigin(0.5,0.5);
        this.emailText = this.add.text(210, 785, 'Email', { fixedWidth: 200, fixedHeight: 32 })
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
                text:'',
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

        this.registerButton = this.add.image(540,1200,'SignUp');
        this.registerButton.setInteractive().on('pointerdown', () => {
            Client.register(this.userName.text, this.email.text, this.password.text);
        });

        this.loginText = this.add.text(540, 1500, 'Login Now', { fixedWidth: 500, fixedHeight: 120 })
        .setStyle({
            fontSize: '84px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            fill: '#1fbae1',
        })
        .setOrigin(0.5,0.5);
        this.loginText.stroke = "#f0fafe";
        this.loginText.strokeThickness = 32;
        //  Apply the shadow to the Stroke and the Fill (this is the default)
        this.loginText.setShadow(10, 10, "#333333", 10, true, true);

        this.loginText.setInteractive().on('pointerdown', () => {
            game.scene.stop('RegisterScreen');
            game.scene.start('LoginScreen');
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
