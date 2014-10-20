var PsycoRally = PsycoRally || {};

PsycoRally.RacingVehicle = function(name) {
     this.name = name;
     this.terrain_specifications = {
        road: {
            v_max: 800,
            v_back_max: 200,
            a_max: 40,
            a_back_max: 30,
            a_break: 40,
            // acceleration decreases with velocity
            linear_forward: function(v) { return  this.a_max - Math.abs(this.a_max * v / this.v_max);  },
            linear_reverse: function(v) { return  this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max);  },
            angular: Math.PI / 60,
            // friction increases with velocity
            linear_d: function(v) { return 10 + Math.abs(0.02 * v); },
            angular_d: Math.PI / 160
        },
        grass: {
            v_max: 90,
            v_back_max: 50,
            a_max: 20,
            a_back_max: 20,
            a_break: 1000,
            linear_forward: function(v) { return  this.a_max - Math.abs(this.a_max * v / this.v_max);  },
            linear_reverse: function(v) { return  this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max);  },
            angular: Math.PI / 60,
            linear_d: function(v) { return Math.abs(0.2 * v); },
            angular_d: Math.PI / 160
        },
    };
    this.texture_prefix = 'car-';
    this.getSpecifications = function() {
        return {
            name: this.name,
            img: 'racing.png',
            velocity: {
                road: 80,
                grass: 20
            },
            acceleration: {
                road: 60,
                grass: 40
            },
            steering: {
                road: 70,
                grass: 70
            }
        };
    };
}

PsycoRally.RacingVehicle.prototype = new PsycoRally.Vehicle();

PsycoRally.TankVehicle = function(name) {
     this.name = name;
     this.terrain_specifications = {
        road: {
            v_max: 600,
            v_back_max: 200,
            a_max: 40,
            a_back_max: 30,
            a_break: 40,
            // acceleration decreases with velocity
            linear_forward: function(v) { return  this.a_max - Math.abs(this.a_max * v / this.v_max);  },
            linear_reverse: function(v) { return  this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max);  },
            angular: Math.PI / 40,
            // friction increases with velocity
            linear_d: function(v) { return 10 + Math.abs(0.02 * v); },
            angular_d: Math.PI / 160
        },
        grass: {
            v_max: 700,
            v_back_max: 50,
            a_max: 40,
            a_back_max: 20,
            a_break: 1000,
            linear_forward: function(v) { return  this.a_max - Math.abs(this.a_max * v / this.v_max);  },
            linear_reverse: function(v) { return  this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max);  },
            angular: Math.PI / 40,
            linear_d: function(v) { return Math.abs(0.2 * v); },
            angular_d: Math.PI / 160
        },
    };
    this.texture_prefix = 'tank-';
    this.getSpecifications = function() {
        return {
            name: this.name,
            img: 'tank.png',
            velocity: {
                road: 60,
                grass: 70
            },
            acceleration: {
                road: 60,
                grass: 60
            },
            steering: {
                road: 80,
                grass: 80
            }
        };
    };
}

PsycoRally.TankVehicle.prototype = new PsycoRally.Vehicle();

PsycoRally.Garage = {
    vehicles: [
        new PsycoRally.RacingVehicle('sbremba'),
        new PsycoRally.TankVehicle('tesoterro')
    ]
};
