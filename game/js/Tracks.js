var PsycoRally = PsycoRally || {};

PsycoRally.JambaTrack = function() {
    this._id = 1;
    this._name = 'jamba';
    this._laps = 2;
    this._img_path = 'game/assets/images/track/jamba.png';
    this._tilemap_path = 'game/assets/tilemaps/jamba.json';
    this._v_tiles = 50;
    this._h_tiles = 50;
    this._track_layer = {name: 'track_layer'};
    this._terrain_layers = {dirt: {name: 'dirt_layer'}};
    this._partials_layer = {name: 'partials_layer'};
    this._wall_layer = {name: 'wall_layer'};
    this._init_positions = [{x: 220, y: 410}];
    this._assets = {
        tileset: {
            track_tiles: {name: 'gta2_tilesheet', path: 'game/assets/images/gta2_tilesheet.jpg'}
        }
    };
}
PsycoRally.JambaTrack.prototype = new PsycoRally.Track();

PsycoRally.LubaloccTrack = function() {
    this._id = 2;
    this._name = 'lubalocc';
    this._laps = 2;
    this._tilemap_path = 'game/assets/tilemaps/lubalocc.json';
    this._img_path = 'game/assets/images/track/lubalocc.png';
    this._v_tiles = 50;
    this._h_tiles = 50;
    this._track_layer = {name: 'track_layer'};
    this._terrain_layers = {dirt: {name: 'dirt_layer'}, water: {name: 'water_layer'}};
    this._partials_layer = {name: 'partials_layer'};
    this._wall_layer = {name: 'wall_layer'};
    this._init_positions = [{x: 360, y: 310}];
    this._assets = {
        tileset: {
            track_tiles: {name: 'gta2_tilesheet', path: 'game/assets/images/gta2_tilesheet.jpg'}
        }
    };
}
PsycoRally.LubaloccTrack.prototype = new PsycoRally.Track();

PsycoRally.AnilloTrack = function() {
    this._id = 3;
    this._name = 'anillo';
    this._laps = 3;
    this._img_path = 'game/assets/images/track/anillo.png';
    this._tilemap_path = 'game/assets/tilemaps/anillo.json';
    this._v_tiles = 50;
    this._h_tiles = 50;
    this._track_layer = {name: 'track_layer'};
    this._terrain_layers = {dirt: {name: 'dirt_layer'}, water: {name: 'water_layer'}};
    this._partials_layer = {name: 'partials_layer'};
    this._wall_layer = {name: 'wall_layer'};
    this._init_positions = [{x: 380, y: 920}];
    this._assets = {
        tileset: {
            track_tiles: {name: 'gta2_tilesheet', path: 'game/assets/images/gta2_tilesheet.jpg'}
        }
    };
}
PsycoRally.AnilloTrack.prototype = new PsycoRally.Track();

PsycoRally.Tracks = {
    tracks: [
        new PsycoRally.JambaTrack(),
        new PsycoRally.LubaloccTrack(),
        new PsycoRally.AnilloTrack()
    ]
};
