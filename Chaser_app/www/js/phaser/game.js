/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */
var SECOND = 1000;

class GameScreen extends Phaser.Scene{
    constructor(){
        super({key: "GameScreen"});
    }

    preload() {
        this.textures.remove('Avatar');
        this.load.image("Avatar", "./images/avatar/" + userData.avatar + ".png");
    }

    create() {
        this.completion_audio = this.sound.add('completion');
        this.background_audio = this.sound.add('level_music', {loop: true});
        this.fail_audio = this.sound.add('fail');

        this.levelText = this.add.text(540, 600, level, { fixedWidth: 900, fixedHeight: 400 })
        .setStyle({
            fontSize: '400px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff00',
            stroke: '#ff0000',
            strokeThickness: 20,
        })
        .setOrigin(0.5,0.5).setDepth(1);

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
        this.coinPlus = this.add.text(765, 130, '+', { fixedWidth: 50, fixedHeight: 120 })
        .setStyle({
            fontSize: '120px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff00',
        }).setAlpha(0)
        .setOrigin(0.5,0.5);
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
        this.pointPlus = this.add.text(765, 255, '+', { fixedWidth: 50, fixedHeight: 120 })
        .setStyle({
            fontSize: '120px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff00',
        }).setAlpha(0)
        .setOrigin(0.5,0.5);
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
        this.board.setInteractive().on('pointerdown', () => {
            this.checkResult();
        });

        this.guideText = this.add.text(540, 1000, "Wait for the line to\ngo in to the red box")
        .setStyle({
            fontSize: '80px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffffff',
        }).setOrigin(0.5,0.5);
        this.background_audio.play();
        this.triangle = [];
        this.vectorX = [];
        this.vectorY = [];
        this.angle = [];
        this.scale = [];
        this.guide = undefined;
        this.initLevel();
    }
    update(){
        for(let index = 0; index<this.triangle.length; index++)
        {
            if(Math.random() < 0.05){
                this.vectorX[index] = Math.random()*30-15;
                this.vectorY[index] = Math.random()*30-15;
            }
            if(Math.random() < 0.05){
                this.angle[index] = Math.random()*20-10;
            }
            if(Math.random() < 0.05){
                this.scale[index] = this.scale[index] + Math.random()*0.2 - 0.1;
                if(this.scale[index] > 3)
                    this.scale[index] = 3;
                else if(this.scale[index] < 0.5)
                    this.scale[index] = 0.5;
            }

            let x = this.triangle[index].x+this.vectorX[index];
            let y = this.triangle[index].y+this.vectorY[index];
            if(x>800)
                x = 800;
            else if(x<200)
                x = 200;
            if(y>1700)
                y = 1700;
            else if(y<600)
                y = 600;
            this.triangle[index].setPosition(x,y);
            this.triangle[index].setScale(this.scale[index]);
            this.triangle[index].setAngle(this.triangle[index].angle + this.angle[index]);
        }

        if(level == 1)
        {
            if(Math.abs(this.cur_position-target_position) <= target_width-5)
            {
                this.timer.remove();
                this.time.removeEvent(this.timer);
                if(this.guide == undefined){
                    this.guide = this.add.text(540, 1500, "Tap Here!!!")
                    .setStyle({
                        fontSize: '120px',
                        fontFamily: 'RR',
                        fontWeight: 'bold',
                        align: "center",
                        color: '#ffff00',
                    }).setOrigin(0.5,0.5);
                }
            }
        }
        if(this.main_bar)
            this.main_bar.destroy();

        var bar_path = [];
        let bounds = new Phaser.Geom.Rectangle;
        let cur_pos = Math.floor(this.cur_position);
        if(cur_pos > 0)
        {
            for(let i=0; i<cur_pos; i++)
            {
                bar_path.push(this.path[i]);
            }
            let curve = new Phaser.Curves.Spline(bar_path);
            curve.getBounds(bounds);
            this.main_bar = this.add.curve(bounds.centerX, bounds.centerY, curve);
            this.main_bar.setStrokeStyle(40, 0xffffff).setDepth(3);
            this.main_bar.setSmoothness(50);
        }
    }

    initLevel(){
        if(level>1)
        {
            this.guideText.destroy();
        }

        if(this.cross){
            this.cross.destroy();
        }

        if(this.guide){
            this.guide.destroy();
            this.guide = undefined;
        }

        this.board.setInteractive();
        this.updateUser();
        this.levelText.setText(level);
        $('body').css('background-image', 'url(images/background/' + (((level-1)%50) + 1) + '.jpg)');
        if(level>15){
            for(let distraction_index = 0; distraction_index < level-15; distraction_index++){
                if(this.triangle.length < distraction_index+1)
                {
                    let particle = "";
                    if(distraction_index % 4 == 0){
                        particle = "triangle";
                    } else if(distraction_index % 4 == 1){
                        particle = "rectangle";
                    } else if(distraction_index % 4 == 2){
                        particle = "pentagon";
                    } else if(distraction_index % 4 == 3){
                        particle = "circle";
                    }
                    this.triangle.push(this.add.image(540, 1000, particle));
                    this.vectorX.push(Math.random()*30-15);
                    this.vectorY.push(Math.random()*30-15);
                    this.angle.push(Math.random()*20-10);
                    this.scale.push(1 + Math.random()*0.1 - 0.05);
                }
            }
        }

        this.counter = 0;
        this.direction = 1;
        this.turn = false;
        this.speed = 5 + Math.sqrt(level);
        this.cur_position = 0.0;
        this.path = bar_path_sample[path_index];

        this.graphics = this.add.graphics();

        var bar_path = [];
        for(let i=target_position-target_width-1; i<target_position+target_width; i++)
        {
            bar_path.push(this.path[i]);
        }
        let bounds = new Phaser.Geom.Rectangle;
        let curve = new Phaser.Curves.Spline(bar_path);
        curve.getBounds(bounds);
        if(this.target_bar)
            this.target_bar.destroy();
        this.target_bar = this.add.curve(bounds.centerX, bounds.centerY, curve);
        this.target_bar.setStrokeStyle(60, 0xff0000).setDepth(2);

        if(this.timer)
        {
            this.timer.remove();
            this.time.removeEvent(this.timer);
        }

        this.timer = this.time.addEvent({
            delay: 50,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });
    }

    checkResult(){
        this.timer.remove();
        this.time.removeEvent(this.timer);
        let bPass = false;
        if(Math.abs(this.cur_position-target_position) <= target_width)
        {
            let coin = Math.floor(level/10)*Math.floor(level/10);
            userData.coin = Number.parseInt(userData.coin) + coin;
            userData.point = Number.parseInt(userData.point) + level;
            if(coin>0)
            {
                this.coinPlus.setAlpha(1);
                this.tweens.add({
                    targets: this.coinPlus,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2'
                  }, this);
            }
            this.pointPlus.setAlpha(1);
            this.tweens.add({
                targets: this.pointPlus,
                alpha: 0,
                duration: 1500,
                ease: 'Power2'
              }, this);

            Client.level_end(0, coin, level, level);
            bPass = true;
        }
        else{
            if(level > 1)
            {
                userData.heart = Number.parseInt(userData.heart) -1;
                Client.level_end(-1, 0, 0, 0);
            }
        }

        if(userData.heart>0){
            if(bPass)
                level++;
            if(level>5){
                target_position = Math.floor(Math.random() * 280) + 40;
            }
            if(level>20)
            {
                if(level<=50){
                    path_index = (level - 20);
                }
                else{
                    path_index = Math.floor(Math.random() * 31);
                }
            }
            if(level>40){
                if(level>50)
                    target_width = 10;
                else
                    target_width = 20-(level-40);
            }
        }
        if(!bPass){
            this.board.disableInteractive();
            this.cross = this.add.image(540,1195,'Cross');
            this.fail_audio.play();
            this.timer = this.time.addEvent({
                delay: 1000,
                callback: this.lostProcess,
                args: [this],
                loop: false
            });
        }
        else{
            this.completion_audio.play();
            this.initLevel();
        }
    }

    lostProcess(scene){
        if(userData.heart > 0)
            scene.initLevel();
        else{
            $('body').css('background-image', '');
            scene.sound.removeAll();
            game.scene.stop('GameScreen');
            game.scene.start('EndScreen');
        }
    }

    updateTimer(scene){
        if(scene.light_time > 0){
            scene.light_time++;
            if(scene.light_time >=20){
                scene.light.setVisible(false);
                scene.light_time = 0;
            }
        }

        scene.counter = (scene.counter+1)%10;
        if(scene.cur_position >= 340)
        {
            scene.turn = false;
            scene.direction = -1;
        }
        if(scene.cur_position <= 20)
        {
            scene.turn = false;
            scene.direction = 1;
        }
        if(Math.abs(scene.cur_position-target_position) <= target_width)
        {
            scene.turn = true;
        }
        else if(scene.turn == true && scene.counter == 0)
        {
            if(Math.random()<0.3)
            {
                scene.turn = false;
                scene.direction *= -1;
            }
        }
        scene.cur_position += scene.speed * scene.direction;
    }

    toast(){
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
        .show('Pass To Next...')
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
    }

}
