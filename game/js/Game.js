var PsycoRally = PsycoRally || {};

PsycoRally.Game = function() {};

PsycoRally.Game.prototype = {
    preload: function() {
        this.game.time.advancedTiming = true;
    },
    create: function() {
        this.track_laps = 2;
        this.total = 0;
        this.map = this.game.add.tilemap('track');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('gta2_tilesheet', 'game_tiles');

        //create layers
        this.track_layer = this.map.createLayer('track_layer');
        this.grass_layer = this.map.createLayer('grass_layer');
        this.partials_layer = this.map.createLayer('partials_layer');
        this.wall_layer = this.map.createLayer('wall_layer');
        this.map.setTileLocationCallback(0, 0, 50, 50, this.grassOverlap, this, this.grass_layer);
        this.map.setTileLocationCallback(0, 0, 50, 50, this.partialsOverlap, this, this.partials_layer);
        this.map.setCollisionBetween(1, 100000, true, 'wall_layer');
        this.setPartials();

        //resizes the game world to match the layer dimensions
        this.track_layer.resizeWorld();

        //create player
        this.player = PsycoRally.gamesession.player;
        this.player.sprite = this.game.add.sprite(224, 410, 'car-s');
        this.terrain = 'road';

        //enable physics on the player
        this.game.physics.arcade.enable(this.player.sprite);
        this.player.sprite.anchor.setTo(0.5, 0.5);
        this.player.sprite.body.collideWorldBounds = true;

        this.player_text = this.game.add.text(10, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.player_text.fixedToCamera = true;
        this.player_text.setText(this.player.getName());

        this.laps_text = this.game.add.text(200, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.laps_text.fixedToCamera = true;
        this.laps_text.setText('lap: ' + this.laps + '/' + this.track_laps);

        this.timer_text = this.game.add.text(460, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.timer_text.fixedToCamera = true;
        this.timer_text.setText('timer: ' + this.timer());

        this.best_time_text = this.game.add.text(700, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.best_time_text.fixedToCamera = true;
        this.best_time_text.setText('best:');
        this.best_time = null;

        //the camera will follow the player in the world
        this.game.camera.follow(this.player.sprite);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game_over = false;
    },
    update: function() {

        if(!this.game_over) {
            this.game.physics.arcade.collide(this.player.sprite, this.wall_layer, this.wallCollision, null, this);
            this.game.physics.arcade.overlap(this.player.sprite, this.grass_layer);
            this.game.physics.arcade.overlap(this.player.sprite, this.partials_layer);
            this.updateCarMovement();
        }
        else {
            this.timer_start = 0;
            this.player.sprite.body.velocity.y = 0;
            this.player.sprite.body.velocity.x = 0;
            this.player.vehicle.reset();
        }

        this.timer_text.setText('timer: ' + this.timer());

    },
    timer: function() {
        var now = new Date();
        return this.timer_start ? (now.getTime() - this.timer_start.getTime()) / 1000 : 0;
    },
    updateCarMovement: function() {

        var movement_data = this.player.getVehicle().getMovementData({
            'down': this.cursors.down.isDown,
            'up': this.cursors.up.isDown,
            'left': this.cursors.left.isDown,
            'right': this.cursors.right.isDown
        }, this.terrain);

        this.player.sprite.body.velocity.y = movement_data.vy;
        this.player.sprite.body.velocity.x = movement_data.vx;
        this.player.sprite.loadTexture(movement_data.texture);

    },
    wallCollision: function() {
        this.player.sprite.body.velocity.y = 0;
        this.player.sprite.body.velocity.x = 0;
        this.player.vehicle.resetVelocity();
    },
    grassOverlap: function(sprite, tile) {
        if(tile.index != -1) {
            this.terrain = 'grass';
        }
        else {
            this.terrain = 'road';
        }
    },
    partialsOverlap: function(sprite, tile) {
        if(tile.index != -1) {
            for(var i = 0, l = this.partials.length; i < l; i++) {
                var index = this.partials[i];
                if((this.current_partial == l || this.current_partial == 0) && tile.index == this.partials[0]) {
                    this.current_partial = 1;
                    if(this.laps > 0) {
                        this.total += this.timer();
                        var best = this.best_time ? Math.min(this.best_time, this.timer()) : this.timer();
                        this.best_time = best;
                        this.best_time_text.setText('best: ' + best);
                    }
                    if(this.laps == this.track_laps) {
                        this.gameOver();
                        break;
                    }
                    this.laps++;
                    this.laps_text.setText('laps: ' + this.laps + '/' + this.track_laps);
                    this.timer_start = new Date();
                }
                else if(index == tile.index && this.current_partial == i) {
                    this.current_partial = i + 1;
                }
            }
        }
    },
    setPartials: function() {
        this.laps = 0;
        this.current_partial = 0;
        this.partials = [980, 1009, 1010, 1011];
    },
    gameOver: function() {
        this.game_over = true;
        this.game_over_text = this.game.add.text(10, 60, "FINISH! - Total time: " + this.total, { size: "82px", fill: "#FFF" });
        this.game_over_text.anchor.set(0, 0);
        this.game_over_text.fixedToCamera = true;

        setTimeout(this.saveResult.bind(this), 1000);
    },
    saveResult: function() {
        var data = {
            track: 1,
            player: this.player.getName(),
            total_time: this.total,
            best_lap_time: this.best_time
        };

        var success_callback = function() {
            PsycoRally.gamesession.result = {
                total_time: this.total,
                best_lap_time: this.best_time
            };
            window.controller.load('ranking');
        }

        var request = new Request.HTML({url: 'backend/pointer.php?module=psycorally&method=save', onSuccess: success_callback.bind(this)}).post('data=' + JSON.stringify(data));

    },
    render: function() {
    }
}
