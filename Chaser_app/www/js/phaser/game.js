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
        if(level>10)
        {
            this.load.atlas('flares', './images/particles/flares.png', './images/particles/flares.json');
        }
        this.textures.remove('Avatar');
        this.load.image("Avatar", "./images/avatar/" + userData.avatar + ".png");
        this.load.image("Panel", "./images/user_panel.png");
        this.load.image("Board", "./images/game_board.png");
        this.load.image("Heart", "./images/heart.png");
        this.load.image("Coin", "./images/coin.png");
        this.load.image("Point", "./images/point.png");
        // this.load.spritesheet("Multi", "./images/sign_multi.png", { frameWidth: 190, frameHeight: 178 });
    }

    create() {
        if(level>10)
        {
            //  Any particles that leave this shape will be killed instantly
            var circle = new Phaser.Geom.Circle(540, 1200, 450);

            var particles = this.add.particles('flares');

            particles.createEmitter({
                frame: [ 'red', 'green', 'blue' ],
                x: 540,
                y: 1200,
                speed: 300,
                lifespan: 4000,
                scale: 0.4,
                blendMode: 'ADD',
                deathZone: { type: 'onLeave', source: circle }
            });
        }

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

        this.counter = 0;
        this.direction = 1;
        this.turn = false;
        this.speed = 5 + Math.sqrt(level);
        this.cur_position = 0.0;
        this.path = bar_path_sample[path_index];

        this.graphics = this.add.graphics();


        // this.graphics = this.add.graphics();
        // this.graphics.lineStyle(4, '#000000', 1);
        // this.graphics.strokeRoundedRect(35,190,1010,1300, 10);

        // this.targetImage = this.add.image(320,350,'Target');
        // this.targetNumber = this.add.text(320,390, gameData.numData[cur_number].result, { fixedWidth: 350, fixedHeight: 110 })
        // .setOrigin(0.5,0.5)
        // .setStyle({
        //     fontSize: '78px',
        //     fontFamily: 'RR',
        //     color: '#ffffff',
        //     align: 'center',
        // });

        var bar_path = [];
        for(let i=target_position-target_width-1; i<target_position+target_width; i++)
        {
            bar_path.push(this.path[i]);
        }
        let bounds = new Phaser.Geom.Rectangle;
        let curve = new Phaser.Curves.Spline(bar_path);
        curve.getBounds(bounds);
        this.target_bar = this.add.curve(bounds.centerX, bounds.centerY, curve);
        this.target_bar.setStrokeStyle(60, 0xff0000);

        this.timer = this.time.addEvent({
            delay: 50,
            callback: this.updateTimer,
            args: [this],
            loop: true
        });
    }
    update(){
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
    
            this.main_bar.setStrokeStyle(40, 0xffffff);
        }
    
        // this.graphics.clear();
        // this.graphics.lineStyle(100, 0xFFFF00, 1);
        // this.graphics.beginPath();
        // this.graphics.moveTo(this.path[target_position-target_width-1].x, this.path[target_position-target_width-1].y);
        // for(let i=target_position-target_width; i<target_position+target_width; i++)
        // {
        //     this.graphics.lineTo(this.path[i].x, this.path[i].y);
        // }
        // this.graphics.closePath();
        // this.graphics.strokePath();

        // this.graphics.lineStyle(50, 0xFFFFFF, 1.0);
        // let cur_pos = Math.floor(this.cur_position);
        // this.graphics.beginPath();
        // this.graphics.moveTo(this.path[0].x, this.path[0].y);
        // for(let i=1; i<cur_pos; i++)
        // {
        //     this.graphics.lineTo(this.path[i].x, this.path[i].y);
        // }
        // this.graphics.closePath();
        // this.graphics.strokePath();
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
            if(bPass && level == 50)
            {
                level++;
                game.scene.stop('GameScreen');
                game.scene.start('EndScreen');
                return;
            }
            if(bPass)
                level++;
            if(level>20)
            {
                path_index = (level - 20);
            }
            if(level>30)
            {
                target_position = Math.floor(Math.random() * 280) + 40;
            }
            if(level>40){
                target_width = 20-(level-40);
            }
            this.scene.restart();
        }
        else{
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
