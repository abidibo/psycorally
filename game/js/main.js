var PsycoRally = PsycoRally || {};

PsycoRally.game = new Phaser.Game(1024, 568, Phaser.AUTO, '');

PsycoRally.game.state.add('Boot', PsycoRally.Boot);
PsycoRally.game.state.add('Preload', PsycoRally.Preload);
PsycoRally.game.state.add('Game', PsycoRally.Game);

PsycoRally.game.state.start('Boot');
