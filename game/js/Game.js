var PsycoRally = PsycoRally || {};

PsycoRally.Game = function() {};

PsycoRally.Game.prototype = {
    preload: function() {
        this.game.time.advancedTiming = true;
    },
    create: function() {

        // check time intervals in update to pass real time interval to motion equations
        this.last_time = new Date();

        // track
        this.track = PsycoRally.gamesession.track;

        /* init some vars */
        // total laps number
        this._track_laps = this.track.getLaps();
        // total time
        this._total_time = 0;
        this._game_over = false;
        this.OVERLAP_BIAS = 20;

        // tile map
        this.map = this.game.add.tilemap(this.track.getName());
        var track_tiles = this.track.getAssets().tileset;
        for(tileset in track_tiles) {
            this.map.addTilesetImage(track_tiles[tileset].name, tileset);
        }
        // map layers
        // track layer
        this.track_layer = this.map.createLayer(this.track.getTrackLayer().name);
        // terrain layers
        var terrain_layers = this.track.getTerrainLayers();
        for(terrain in terrain_layers) {
            this[terrain + '_layer'] = this.map.createLayer(terrain_layers[terrain].name);
            var obj = {game: this, terrain: terrain};
            this.map.setTileLocationCallback(0, 0, this.track.getHTiles(), this.track.getVTiles(), this.terrainOverlap, obj, this[terrain + '_layer']);
        }
        // partials
        this.partials_layer = this.map.createLayer(this.track.getPartialsLayer().name);
        this.map.setTileLocationCallback(0, 0, 50, 50, this.partialsOverlap, this, this.partials_layer);
        // walls
        this.wall_layer = this.map.createLayer(this.track.getWallLayer().name);
        // set overlaps
        // init partials
        this.resetPartials();

        // resizes the game world to match the layer dimensions
        this.track_layer.resizeWorld();

        // create player
        this.createPlayer();

        // some texts
        // player name
        this.player_text = this.game.add.text(10, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.player_text.fixedToCamera = true;
        this.player_text.setText(this.player.getName());
        // current laps vs total laps
        this.laps_text = this.game.add.text(200, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.laps_text.fixedToCamera = true;
        this.laps_text.setText('lap: ' + this._laps + '/' + this._track_laps);
        // total time
        this.timer_text = this.game.add.text(460, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.timer_text.fixedToCamera = true;
        this.timer_text.setText('timer: ' + this.timer());
        // best lap time
        this.best_time_text = this.game.add.text(700, 30, "", { size: "26px", fill: "#FFF", align: "center", });
        this.best_time_text.fixedToCamera = true;
        this.best_time_text.setText('best:');
        this.best_time = null;

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    createPlayer: function() {
        this.player = PsycoRally.gamesession.player;
        var init_position = this.track.getInitPosition(0);
        this.player.init_position = init_position;
        this.player.sprite = this.game.add.sprite(init_position.x, init_position.y, 'car-s');
        // enable physics
        this.game.physics.arcade.enable(this.player.sprite);
        this.player.sprite.anchor.setTo(0.5, 0.5);
        this.player.sprite.collideWorldBounds = true;

        // the camera will follow the player in the world
        this.game.camera.follow(this.player.sprite);
    },
    update: function() {
        // real time interval since last update
        var now = new Date();
        var dt = now.getTime() - this.last_time.getTime();
        this.last_time = now;
        // update
        this.timeFixedUpdate(dt);
    },
    timeFixedUpdate: function(dt) {

        if(!this._game_over) {

            this.terrain = 'road';
            // check for terrain type
            for(terrain in this.track.getTerrainLayers()) {
                this.game.physics.arcade.overlap(this.player.sprite, this[terrain + '_layer']);
            }
            // check for partial traversing
            this.game.physics.arcade.overlap(this.player.sprite, this.partials_layer);
            // update vehicle movement
            this.updateVehicleMovement(dt);
        }
        // reset properties
        else {
            this._timer_start = 0;
            this.player.sprite.body.y = this.player.init_position.y;
            this.player.sprite.body.x = this.player.init_position.x;
            this.player.vehicle.reset();
        }

        this.timer_text.setText('timer: ' + this.timer());

    },
    timer: function() {
        var now = new Date();
        return this._timer_start ? (now.getTime() - this._timer_start.getTime()) / 1000 : 0;
    },
    updateVehicleMovement: function(dt) {

        // calculate movement data
        var movement_data = this.player.getVehicle().getMovementData(dt, {
            'down': this.cursors.down.isDown,
            'up': this.cursors.up.isDown,
            'left': this.cursors.left.isDown,
            'right': this.cursors.right.isDown,
        }, this.terrain);

        // update movement data considering collisions
        movement_data = this.checkWallCollision(movement_data);
        // update player position
        this.player.sprite.body.y += movement_data.dy;
        this.player.sprite.body.x += movement_data.dx;
        this.player.sprite.loadTexture(movement_data.texture);
    },
    /**
     * If player overlaps more than one wall tile, the collision is considered
     * agains the tile with which the overlapping area is grater
     */
    checkWallCollision: function(movement_data) {
        var p_body = this.player.sprite.body;
        // loop through wall layer tiles
        var tiles = this.wall_layer.getTiles(0 , 0, 3200, 3200, false, false);
        // store overlapping tiles
        var overlap_body_tiles = {};
        // store max overlap tile index
        var max_overlap_tile = null;
        // store max area of overlapping tiles
        var max_overlap_area = 0;
        for(var i = 0, l = tiles.length; i < l; i++) {
            var tile = tiles[i];
            if(tile.index != -1) {
                // create a body like object for the tile, faster I hope than creating a tilesprite and enabling physics over it
                // Phaser.Rectangle.intersect only needs this properties
                var body_tile = {
                    x: tile.worldX,
                    right: tile.worldX + tile.width, 
                    y: tile.worldY,
                    bottom: tile.worldY + tile.height, 
                    height: tile.height, 
                    width: tile.width
                };
                // the body of the player is not the original one, we have to add the delta x and y from movement data
                // this is because we need to check possible collisions derived from the movement, and then update
                // the movement params in order to "separate" the objects
                var body_player = {
                    x: p_body.x + movement_data.dx, 
                    right: p_body.x + movement_data.dx + p_body.width, 
                    y: p_body.y + movement_data.dy, 
                    bottom: p_body.y + movement_data.dy + p_body.height, 
                    height: p_body.height, 
                    width: p_body.width
                };
                // if player after movement intersects the tile
                if(Phaser.Rectangle.intersects(body_player, body_tile)) {
                    overlap_body_tiles[i] = body_tile;
                    var rectangle = {};
                    // check for the greater overlapping area
                    Phaser.Rectangle.intersection(body_player, body_tile, rectangle)
                    if(rectangle.width * rectangle.height > max_overlap_area) {
                        max_overlap_area = rectangle.width * rectangle.height;
                        max_overlap_tile = i;
                    }
                }
            }
        }

        // if some overlap occurs, separate the player from the max overlapping tile
        if(max_overlap_tile) {
            return this.separate(movement_data, body_player, overlap_body_tiles[max_overlap_tile]);
        }

        // if no overlap occurs, return original movement data
        return movement_data;
    },
    /**
     * Implements the collision behavior, the player can't move through walls
     */
    separate: function(movement_data, body_player, body_tile) {
        // check y axis first
        var overlap_y;
        // the maximum overlapping distance is dy, plus a constant (to avoid tunneling)
        var max_overlap_y = Math.abs(movement_data.dy) + this.OVERLAP_BIAS;
        // moving down
        if(movement_data.dy > 0) {
            overlap_y = body_player.bottom - body_tile.y; // positive value
        }
        // moving up
        else if(movement_data.dy < 0) {
            overlap_y = body_player.y - body_tile.bottom; // negative value
        }
        // the collision occurs in the y axis if the overlap isn't bigger than it's max possible value
        if(Math.abs(overlap_y) <= max_overlap_y) {
            movement_data.dy = movement_data.dy - overlap_y;
            //movement_data.dx = 0;
            this.player.getVehicle().resetVelocity();
            return movement_data;
        }
        // check x axis
        overlap_x = 0;
        var max_overlap_x = Math.abs(movement_data.dx) + this.OVERLAP_BIAS;
        // moving right
        if(movement_data.dx > 0) {
            overlap_x = body_player.right - body_tile.x; // positive value
        }
        // moving left
        else if(movement_data.dx < 0) {
            overlap_x = body_player.x - body_tile.right; // negative value
        }
        // the collision occurs in the x axis if the overlap isn't bigger than it's max possible value
        if(Math.abs(overlap_x) <= max_overlap_x) {
            movement_data.dx = movement_data.dx - overlap_x;
            //movement_data.dy = 0;
            this.player.getVehicle().resetVelocity();
            return movement_data;
        }

        return movement_data;
    },
    /**
     * Just set the current terrain type
     */
    terrainOverlap: function(sprite, tile) {
        if(tile.index != -1) {
            this.game.terrain = this.terrain;
        }
    },
    /**
     * Partials assures that the player goes through all the track
     */
    partialsOverlap: function(sprite, tile) {
        if(tile.index != -1) {
            for(var i = 0, l = this.partials.length; i < l; i++) {
                var index = this.partials[i];
                // first/last partial
                if((this.current_partial == l || this.current_partial == 0) && tile.index == this.partials[0]) {
                    this.current_partial = 1;
                    // new lap
                    if(this._laps > 0) {
                        this._total_time += this.timer();
                        var best = this.best_time ? Math.min(this.best_time, this.timer()) : this.timer();
                        this.best_time = best;
                        this.best_time_text.setText('best: ' + best);
                    }
                    // end of last lap
                    if(this._laps == this._track_laps) {
                        this.gameOver();
                        break;
                    }
                    this._laps++;
                    this.laps_text.setText('laps: ' + this._laps + '/' + this._track_laps);
                    this._timer_start = new Date();
                }
                else if(index == tile.index && this.current_partial == i) {
                    this.current_partial = i + 1;
                }
            }
        }
    },
    resetPartials: function() {
        this._laps = 0;
        this.current_partial = 0;
        this.partials = [980, 1009, 1010, 1011];
    },
    gameOver: function() {
        this._game_over = true;
        this.game_over_text = this.game.add.text(10, 60, "FINISH! - Total time: " + this._total_time, { size: "82px", fill: "#FFF" });
        this.game_over_text.anchor.set(0, 0);
        this.game_over_text.fixedToCamera = true;

        setTimeout(this.saveResult.bind(this), 1000);
    },
    /**
     * Save race results
     */
    saveResult: function() {
        var data = {
            track: this.track.getId(),
            player: this.player.getName(),
            total_time: this._total_time,
            best_lap_time: this.best_time
        };

        var success_callback = function() {
            PsycoRally.gamesession.result = {
                total_time: this._total_time,
                best_lap_time: this.best_time
            };
            window.controller.load('ranking');
        }

        var request = new Request.HTML({url: 'backend/pointer.php?module=psycorally&method=save', onSuccess: success_callback.bind(this)}).post('data=' + JSON.stringify(data));

    },
    render: function() {
    },
}
