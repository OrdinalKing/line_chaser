/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures

var userData = {};
var stripe_key = "";

var target_width = 10;
var target_position = 0;
var item_type = -1;
var level = 0;
var point = 0;
var coin = 0;
var revive_count = 0;
var path_index = 0;

const config = {
    type: Phaser.WEBGL,
    scale: {
        parent: '#phaser-area',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 1920
    },
    transparent: true,
    scene: [LoginScreen, HomeScreen, SettingScreen, GameScreen, EndScreen, RegisterScreen, StripeScreen, HelpScreen, ShopScreen ],
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);

game.scene.start('LoginScreen');
