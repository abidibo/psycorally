var PsycoRally = PsycoRally || {};

PsycoRally.Stages = {};

PsycoRally.Stages.Stage = {
    preload: function() {
        PsycoRally.spinner = new Spinner(document.body, { 'class': 'spinner-container' });
        PsycoRally.spinner.show();
    }
}

PsycoRally.Stages.Intro = function(oncomplete) {
    this.oncomplete = oncomplete;
    this.dom = {};
    this.load = function() {
        var self = this;
        this.world = document.body;
        this.world.empty();
        this.dom.container = new Element('div#container.container');
        this.dom.title = new Element('h1.title').set('text', 'PsycoRally').setStyle('left', '-150%');
        this.dom.author = new Element('p.author').set('html', 'a game by <a href="http://abidibo.net">abidibo</a>').setStyle('left', '250%');
        this.dom.more = new Element('p.more').set('html', '<span class="fa fa-github"></span> <a href="http://github.com/abidibo/psycorally" target="_blank">code</a>, <a href="credits.html" target="_blank">credits</a>, <a href="changelog.html" target="_blank">changelog</a>').setStyle('opacity', 0);
        this.dom.content = new Element('div#content.content[data-stage=intro]');
        this.dom.racing = new Element('div#racing');
        this.dom.tank = new Element('div#tank');
        this.dom.content.adopt(this.dom.racing, this.dom.tank);
        this.dom.container.adopt(this.dom.title, this.dom.author, this.dom.more, this.dom.content).inject(document.body);
        setTimeout(function() { 
            self.dom.title.setStyle('left', 0); 
            self.dom.author.setStyle('left', '50px'); 
            self.dom.more.setStyle('opacity', 1); 
        }, 500);
        setTimeout(function() { 
            self.dom.racing.setStyle('left', '50px'); 
            self.dom.tank.setStyle('left', '-50px'); 
        }, 1000);
        setTimeout(function() {
            self.dom.content.adopt(
                new Element('p.text-center').setStyle('margin-top', '40px').adopt(
                    new Element('a.btn.btn-primary.btn-start')
                        .addEvent('click', self.oncomplete)
                        .set('text', 'click to start')
                )
            );
        }, 1500);
    };
};

PsycoRally.Stages.Intro.prototype = PsycoRally.Stages.Stage;

PsycoRally.Stages.ChooseName = function(oncomplete) {
    this.oncomplete = oncomplete;
    this.dom = {};
    this.load = function() {
        var self = this;
        this.world = document.id('content').set('data-stage', 'choosename');
        this.world.empty();
        var label = new Element('label').set('text', 'Input your fukka name!');
        var input = new Element('input[type=text]');
        var submit = new Element('p.text-center').setStyle('margin-top', '40px').adopt(
            new Element('a.btn.btn-primary.btn-start')
                .addEvent('click', function() {
                    var name = input.get('value');
                    if(!/^[a-zA-Z0-9]+$/.test(name)) {
                        alert('only a-zA-Z0-9, thanks');
                    }
                    else {
                        // create player
                        PsycoRally.gamesession.player.setName(name);
                        self.oncomplete();
                    }
                })
                .set('text', 'choose your vehicle')
        );
        this.world.adopt(label, input, new Element('p').adopt(submit));
        PsycoRally.spinner.hide();
    };
};

PsycoRally.Stages.ChooseName.prototype = PsycoRally.Stages.Stage;

PsycoRally.Stages.ChooseVehicle = function(oncomplete) {
    this.oncomplete = oncomplete;
    this.dom = {};
    this.load = function() {
        var self = this;
        this.world = document.id('content').set('data-stage', 'choosevehicle');
        this.world.empty();
        var p = new Element('p').set('text', PsycoRally.gamesession.player.getName() + ', choose your vehicle');
        p.inject(this.world);

        // scene
        var swidth = 0; var sheight = 0;
        var showcase = new Element('div.showcase').inject(this.world);
        var showcase_slider = new Element('div.showcase-slider').inject(showcase);
        for(var i = 0, l = PsycoRally.Garage.vehicles.length; i < l; i++) {
            var vehicle = PsycoRally.Garage.vehicles[i];
            var specifications = vehicle.getSpecifications();
            var table = new Element('table.specifications').adopt(
                new Element('tr')
                    .adopt(
                        new Element('th[colspan=3]').adopt(new Element('img[src=static/img/' + specifications.img + ']'), new Element('span.vehicle-name').set('text', specifications.name))
                    ),
                new Element('tr')
                    .adopt(
                        new Element('th'),
                        new Element('th').set('text', 'road'),
                        new Element('th').set('text', 'dirt'),
                        new Element('th').set('text', 'water')
                    ),
                new Element('tr.speed')
                    .adopt(
                        new Element('td').set('text', 'speed'),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.velocity.road/2 + 'px'))),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.velocity.dirt/2 + 'px'))),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.velocity.water/2 + 'px')))
                    ),
                new Element('tr.acceleration')
                    .adopt(
                        new Element('td').set('text', 'accel'),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.acceleration.road/2 + 'px'))),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.acceleration.dirt/2 + 'px'))),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.acceleration.water/2 + 'px')))
                    ),
                new Element('tr.steering')
                    .adopt(
                        new Element('td').set('text', 'steering'),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.steering.road/2 + 'px'))),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.steering.dirt/2 + 'px'))),
                        new Element('td').adopt(new Element('div.scale').adopt(new Element('div').setStyle('width', specifications.steering.water/2 + 'px')))
                    )
            );
            var css = i == 0 ? 'slide-active' : ( i == l-1 ? 'slide-prev' : 'slide' );
            var item = new Element('div.showcase-item.' + css + '[data-vehicle=' + i + ']').adopt(
                table
            ).inject(showcase_slider);
            var item_dim = item.getCoordinates();
            swidth = Math.max(swidth, item_dim.width);
            sheight = Math.max(sheight, item_dim.height);
        }

        $$('.showcase-item', '.showcase-slider').setStyles({
            width: swidth + 'px',
            height: sheight + 'px',
            visibility: 'visible'
        });

        var next_button = new Element('a.fa.fa-4x.fa-arrow-circle-right.button')
            .addEvent('click', function() {
                var active = $$('.slide-active')[0];
                var next = $$('.slide-active').getNext('.showcase-item')[0] || $$('.showcase-item')[0];
                var prev = $$('.slide-active').getPrevious('.showcase-item')[0] || $$('.showcase-item')[l-1];
                next.addClass('slide-active');
                prev.removeClass('slide-prev');
                active.removeClass('slide-active').addClass('.slide-prev');
            })
            .inject(showcase);

        this.world.adopt(
            new Element('p.text-center').setStyle('margin-top', '40px').adopt(
                new Element('a.btn.btn-primary.btn-start')
                    .addEvent('click', function() {
                        // save car
                        var index = $$('.slide-active')[0].get('data-vehicle');
                        PsycoRally.gamesession.player.setVehicle(PsycoRally.Garage.vehicles[index]);
                        self.oncomplete();
                    })
                    .set('text', 'choose track')
            )
        );


        PsycoRally.spinner.hide();
 
    }
}

PsycoRally.Stages.ChooseVehicle.prototype = PsycoRally.Stages.Stage;

PsycoRally.Stages.ChooseTrack = function(oncomplete) {
    this.oncomplete = oncomplete;
    this.dom = {};
    this.load = function() {
        var self = this;
        this.world = document.id('content').set('data-stage', 'choosetrack');
        this.world.empty();
        var p = new Element('p').set('text', PsycoRally.gamesession.player.getName() + ', choose a track');
        p.inject(this.world);

        // scene
        var swidth = 0; var sheight = 0;
        var showcase = new Element('div.showcase').inject(this.world);
        var showcase_slider = new Element('div.showcase-slider').inject(showcase);
        for(var i = 0, l = PsycoRally.Tracks.tracks.length; i < l; i++) {
            var track = PsycoRally.Tracks.tracks[i];
            var img = new Element('img[src=' + track.getImgPath() + '][alt=' + track.getName() + ']');
            var css = i == 0 ? 'slide-active' : ( i == l-1 ? 'slide-prev' : 'slide' );
            var item = new Element('div.showcase-item.' + css + '[data-track=' + i + ']').adopt(
                new Element('div.track-title').set('text', track.getName()),
                img
            ).inject(showcase_slider);
            var item_dim = item.getCoordinates();
            swidth = Math.max(swidth, item_dim.width);
            sheight = Math.max(sheight, item_dim.height);
        }

        $$('.showcase-item', '.showcase-slider').setStyles({
            visibility: 'visible'
        });

        var next_button = new Element('a.fa.fa-4x.fa-arrow-circle-right.button')
            .addEvent('click', function() {
                var active = $$('.slide-active')[0];
                var next = $$('.slide-active').getNext('.showcase-item')[0] || $$('.showcase-item')[0];
                var prev = $$('.slide-active').getPrevious('.showcase-item')[0] || $$('.showcase-item')[l-1];
                next.addClass('slide-active');
                prev.removeClass('slide-prev');
                active.removeClass('slide-active').addClass('.slide-prev');
            })
            .inject(showcase);

        this.world.adopt(
            new Element('p.text-center').setStyle('margin-top', '40px').adopt(
                new Element('a.btn.btn-primary.btn-start')
                    .addEvent('click', function() {
                        // save car
                        var index = $$('.slide-active')[0].get('data-track');
                        PsycoRally.gamesession.track = PsycoRally.Tracks.tracks[index];
                        self.oncomplete();
                    })
                    .set('text', 'click to start')
            )
        );

        PsycoRally.spinner.hide();
 
    }
};

PsycoRally.Stages.ChooseTrack.prototype = PsycoRally.Stages.Stage;

PsycoRally.Stages.Game = function() {
    this.dom = {};
    this.preload = function() {};
    this.load = function() {
        this.world = document.id('content');
        this.world.destroy();
        document.id('container').addClass('game');
        PsycoRally.gamesession.game = new Phaser.Game(900, 500, Phaser.AUTO, '');
        PsycoRally.gamesession.game.state.add('Boot', PsycoRally.Boot);
        PsycoRally.gamesession.game.state.add('Preload', PsycoRally.Preload);
        PsycoRally.gamesession.game.state.add('Game', PsycoRally.Game);
        PsycoRally.gamesession.game.state.start('Boot');
    };
}

PsycoRally.Stages.Ranking = function() {
    this.dom = {};
    this.load = function() {
        var self = this;
        this.world = document.id('container').removeClass('game').addClass('ranking');
        var request = new Request.JSON({
            url: 'backend/pointer.php?module=psycorally&method=results',
            method: 'post',
            data: 'track=' + PsycoRally.gamesession.track.getId(),
            onFailure: function() {
                alert('can\'t fetch data');
            },
            onError: function() {
                alert('invalid data');
            },
            onSuccess: function(responseJSON, responseText) {
                self.results = responseJSON;
                self.display();
            }
        }).send();
    };

    this.display = function() {
        this.dom.player_result = new Element('p')
            .set('text', PsycoRally.gamesession.player.getName() + ', your race time is ' + PsycoRally.gamesession.result.total_time + ' and your best lap time is ' + PsycoRally.gamesession.result.best_lap_time);

        this.dom.best_race_table = new Element('table.table')
            .adopt(new Element('tr').adopt(
                new Element('th').set('text', '#'),
                new Element('th').set('text', 'player'),
                new Element('th').set('text', 'time')
            ));
        for(var i = 0, l = this.results.best_times.length; i < l; i++) {
            this.dom.best_race_table.adopt(
                new Element('tr').adopt(
                    new Element('td').set('text', (i + 1)),
                    new Element('td').set('text', this.results.best_times[i].player),
                    new Element('td').set('text', this.results.best_times[i].total_time)
                )
            );
        }

        this.dom.best_lap_table = new Element('table.table')
            .adopt(new Element('tr').adopt(
                new Element('th').set('text', '#'),
                new Element('th').set('text', 'player'),
                new Element('th').set('text', 'time')
            ));
        for(var i = 0, l = this.results.best_lap_times.length; i < l; i++) {
            this.dom.best_lap_table.adopt(
                new Element('tr').adopt(
                    new Element('td').set('text', (i + 1)),
                    new Element('td').set('text', this.results.best_lap_times[i].player),
                    new Element('td').set('text', this.results.best_lap_times[i].lap_time)
                )
            );
        }

        var content;

        this.dom.replay_button = new Element('a.btn.btn-primary')
            .set('text', 'play again')
            .addEvent('click', function() {
                content.destroy();
                this.world.removeClass('ranking').addClass('game');
                PsycoRally.gamesession.game.state.start('Game');
            }.bind(this));

        this.dom.restart_button = new Element('a.btn.btn-primary')
            .set('text', 'restart')
            .addEvent('click', function() { location.reload(); });

        content = new Element('div#content.content[data-stage=ranking]').adopt(
            new Element('div.container').adopt(
                this.dom.player_result,
                new Element('div.row').adopt(
                    new Element('div.col-sm-12.col-md-6').adopt(
                        new Element('h2').set('text', 'Best race'),
                        this.dom.best_race_table
                    ),
                    new Element('div.col-sm-12.col-md-6').adopt(
                        new Element('h2').set('text', 'Best lap'),
                        this.dom.best_lap_table
                    )
                ),
                new Element('p').adopt(this.dom.replay_button, this.dom.restart_button)
            )
        ).inject(this.world);
        PsycoRally.spinner.hide();
    };
}

PsycoRally.Stages.Ranking.prototype = PsycoRally.Stages.Stage;
