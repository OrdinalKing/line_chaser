/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

class HelpScreen extends Phaser.Scene{
    constructor(){
        super({key: "HelpScreen"});
    }

    preload() {
    }

    create() {
        this.helpImage = this.add.image(540,960,'PlayMethod');
        this.backButton = this.add.image(540,1600,'Back');
        this.backButton.setInteractive().on('pointerdown', () => {
            game.scene.stop('HelpScreen');
            game.scene.start('HomeScreen');
        });
    }

    update(){
    }
}
