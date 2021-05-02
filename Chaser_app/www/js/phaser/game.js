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
        this.levelText = this.add.text(540, 700, level, { fixedWidth: 900, fixedHeight: 400 })
        .setStyle({
            fontSize: '400px',
            fontFamily: 'RR',
            fontWeight: 'bold',
            align: "center",
            color: '#ffff0080',
        })
        .setOrigin(0.5,0.5);

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

        this.initLevel();
    }
    update(){
        if(Math.random() < 0.05){
            this.vectorX = Math.random()*30-15;
            this.vectorY = Math.random()*30-15;
        }
        if(Math.random() < 0.05){
            this.angle = Math.random()*20-10;
        }
        if(Math.random() < 0.05){
            this.scale = this.scale + Math.random()*0.2 - 0.1;
            if(this.scale > 3)
                this.scale = 3;
            else if(this.scale < 0.5)
                this.scale = 0.5;
        }
        let x = this.triangle.x+this.vectorX;
        let y = this.triangle.y+this.vectorY;
        if(x>800)
            x = 800;
        else if(x<200)
            x = 200;
        if(y>1400)
            y = 1400;
        else if(y<800)
            y = 800;
        this.triangle.setPosition(x,y);
        this.triangle.setScale(this.scale);
        this.triangle.setAngle(this.triangle.angle + this.angle);

        if(level == 1)
        {
            if(Math.abs(this.cur_position-target_position) <= target_width-5)
            {
                this.timer.remove();
                this.time.removeEvent(this.timer);
                if(!this.guide){
                    this.guide = this.add.text(540, 1500, "Tap!!!")
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
        // if(this.particle_type != undefined)
        // {
        //     if(this.particle_type == 2){
        //         Phaser.Geom.Line.Rotate(this.particle_line, 0.03);
        //     }
        //     else if(this.particle_type == 3){
        //         this.particles.rotation -= 0.01;
        //     }
        // }
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
            this.main_bar.setSmoothness(100);
            this.main_bar.setStrokeStyle(40, 0xffffff);
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
        }

        this.board.setInteractive();
        this.updateUser();
        this.levelText.setText(level);
        $('body').css('background-image', 'url(../../images/background/' + ((level-1%32) + 1) + '.jpg)');
        if(!this.triangle){
            this.triangle = this.add.image(540, 1000, 'triangle');
            this.vectorX = Math.random()*30-15;
            this.vectorY = Math.random()*30-15;
            this.angle = Math.random()*20-10;
            this.scale = 1 + Math.random()*0.1 - 0.05;
        }

        this.counter = 0;
        this.direction = 1;
        this.turn = false;
        this.speed = 5 + Math.sqrt(level*2);
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
        this.target_bar.setStrokeStyle(60, 0xff0000);

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

        // this.particle_type = undefined;
        // this.particle_type = Number.parseInt(Math.random()*5);
        // this.particles = this.add.particles('flares');
        // if(this.particle_type == 0)
        // {
        //     //  Any particles that leave this shape will be killed instantly
        //     this.particle_circle = new Phaser.Geom.Circle(540, 1200, 450);
        //     this.particles.createEmitter({
        //         frame: [ 'red', 'green', 'blue' ],
        //         x: 540,
        //         y: 1200,
        //         speed: 300,
        //         lifespan: 4000,
        //         scale: 0.4,
        //         blendMode: 'ADD',
        //         deathZone: { type: 'onLeave', source: this.circle }
        //     });
        // } else if(this.particle_type == 1){
        //     this.particles.createEmitter({
        //         frame: { frames: [ 'red', 'blue', 'green', 'yellow' ], cycle: true },
        //         x: 540,
        //         y: { start: 600, end: 1800, steps: 32 },
        //         lifespan: 2000,
        //         accelerationX: 300,
        //         scale: 0.5,
        //         blendMode: 'ADD'
        //     });
        
        //     this.particles.createEmitter({
        //         frame: { frames: [ 'red', 'blue', 'green', 'yellow' ], cycle: true },
        //         x: 540,
        //         y: { start: 1800, end: 600, steps: 32 },
        //         lifespan: 2000,
        //         accelerationX: -300,
        //         scale: 0.5,
        //         blendMode: 'ADD'
        //     });
        
        // } else if(this.particle_type == 2){
        //     this.particle_line = new Phaser.Geom.Line(-450, -450, 450, 450);
        
        //     this.particles.createEmitter({
        //         frame: [ 'red', 'green', 'yellow', 'blue' ],
        //         x: 540, y: 1200,
        //         scale: { start: 0.2, end: 0 },
        //         alpha: { start: 1, end: 0, ease: 'Quartic.easeOut' },
        //         speed: { min: -20, max: 20 },
        //         quantity: 32,
        //         emitZone: { source: this.particle_line },
        //         blendMode: 'SCREEN'
        //     });
        // } else if(this.particle_type == 3){
        //     this.particles.createEmitter({
        //         frame: 'blue',
        //         x: -100,
        //         y: 0,
        //         lifespan: 2000,
        //         speed: { min: 400, max: 600 },
        //         angle: 330,
        //         gravityY: 300,
        //         scale: { start: 0.4, end: 0 },
        //         quantity: 2,
        //         blendMode: 'ADD'
        //     });
        
        //     this.particles.createEmitter({
        //         frame: 'red',
        //         x: 100,
        //         y: 0,
        //         lifespan: 2000,
        //         speed: { min: 400, max: 600 },
        //         angle: 330,
        //         gravityY: 300,
        //         scale: { start: 0.4, end: 0 },
        //         quantity: 2,
        //         blendMode: 'ADD'
        //     });
        
        //     this.particles.setPosition(540, 1200);
        
        // } else if( this.particle_type == 4){
        //     var path = new Phaser.Curves.Path(540, 1200).circleTo(250).moveTo(540, 1200).circleTo(250, true, 180);
        //     this.particles.createEmitter({
        //         frame: { frames: [ 'red', 'green', 'blue' ], cycle: true },
        //         scale: { start: 2, end: 0 },
        //         blendMode: 'ADD',
        //         emitZone: { type: 'edge', source: path, quantity: 48, yoyo: false }
        //     });
        // }
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
            Client.level_end(0, coin, level);
            bPass = true;
        }
        else{
            userData.heart = Number.parseInt(userData.heart) -1;
            Client.level_end(-1, 0, 0);
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
            this.timer = this.time.addEvent({
                delay: 1000,
                callback: this.lostProcess,
                args: [this],
                loop: false
            });
        }
        else{
            this.initLevel();
        }
    }

    lostProcess(scene){
        if(userData.heart > 0)
            scene.initLevel();
        else{
            $('body').css('background-image', '');
            game.scene.stop('GameScreen');
            game.scene.start('EndScreen');
        }
    }

    updateTimer(scene){
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
