var PsycoRally = PsycoRally || {};

//loading the game assets
PsycoRally.Preload = function(){};

PsycoRally.Preload.prototype = {
    preload: function() {
        // show loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(3);

        this.load.setPreloadSprite(this.preloadBar);

        // load traks assets
        var track_images = PsycoRally.gamesession.track.getAssets().images;
        for(image_name in track_images) {
            this.load.image(image_name, track_images[image_name]);
        }
        this.load.tilemap(PsycoRally.gamesession.track.getName(), PsycoRally.gamesession.track.getTilemapPath(), null, Phaser.Tilemap.TILED_JSON);
        var track_tiles = PsycoRally.gamesession.track.getAssets().tileset;
        for(tileset in track_tiles) {
            this.load.image(tileset, track_tiles[tileset].path);
        }

        // laod vehicle assets
        var vehicle_assets = PsycoRally.gamesession.player.getVehicle().getAssets().images;
        for(asset in vehicle_assets) {
            this.load.image(asset, vehicle_assets[asset]);
        }
    },
    create: function() {
        this.state.start('Game');
    }
};
