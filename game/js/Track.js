var PsycoRally = PsycoRally || {};

PsycoRally.Track = function() {

    this.getId = function() {
        return this._id;
    };

    this.getName = function() {
        return this._name;
    };

    this.getTilemapPath = function() {
        return this._tilemap_path;
    };

    this.getImgPath = function() {
        return this._img_path;
    };

    this.getHTiles = function() {
        return this._h_tiles;
    };

    this.getVTiles = function() {
        return this._v_tiles;
    };

    this.getLaps = function() {
        return this._laps;
    };

    this.getTrackLayer = function() {
        return this._track_layer;
    };

    this.getTerrainLayers = function() {
        return this._terrain_layers;
    };

    this.getPartialsLayer = function() {
        return this._partials_layer;
    };

    this.getWallLayer = function() {
        return this._wall_layer;
    };

    this.getInitPosition = function(index) {
        return this._init_positions[index];
    };

    this.getAssets = function() {
        return this._assets;
    }

};
