var PsycoRally = PsycoRally || {};

//loading the game assets
PsycoRally.Preload = function(){};

PsycoRally.Preload.prototype = {
    preload: function() {
        //show loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(3);

        this.load.setPreloadSprite(this.preloadBar);

        //load game assets
        this.load.tilemap('track', 'game/assets/tilemaps/track.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('game_tiles', 'game/assets/images/gta2_tilesheet.jpg');

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
