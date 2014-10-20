    var PsycoRally = PsycoRally || {};

PsycoRally.spinner = null;
// keep session variables: settings
PsycoRally.gamesession = null;

PsycoRally.Controller = function() {
    this.init = function() {
        PsycoRally.gamesession = {
            settings: new PsycoRally.Settings(),
            player: new PsycoRally.Player()
        };
        this.initStages();
        this.load('intro');
    };
    this.initStages = function() {
        this.stages = {
            intro: new PsycoRally.Stages.Intro(this.load.bind(this, 'choose_name')),
            choose_name: new PsycoRally.Stages.ChooseName(this.load.bind(this, 'choose_vehicle')),
            choose_vehicle: new PsycoRally.Stages.ChooseVehicle(this.load.bind(this, 'game')),
            game: new PsycoRally.Stages.Game(),
            ranking: new PsycoRally.Stages.Ranking()
        };
    };
    this.load = function(stage) {
        var self = this;
        this.stages[stage].preload();
        setTimeout(function() { self.stages[stage].load(); }, 1000)
    };
}
