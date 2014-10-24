var PsycoRally = PsycoRally || {};

PsycoRally.RacingVehicle = function(name) {
    this.name = name;
    this.terrain_specifications = {
        road: {
            v_max: 14, // px / 16 ms
            v_back_max: 2,
            a_max: 0.6,
            a_back_max: 1,
            a_break: 0.5,
            dx: function(v, a, dt) { return v*dt + a*dt*dt },
            dv: function(a, dt) { return a*dt },
            a: function(v) { return this.a_max - Math.abs(this.a_max * v / this.v_max) },
            a_back: function(v) { return this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max); },
            omega: function(v) { return Math.PI / (50 + 2 * Math.abs(v)); },
            dteta: function(dt, v) { return this.omega(v) * dt },
            // friction increases with velocity
            a_friction: function(dt, v) { return Math.abs(0.04 * v) * dt; },
            omega_friction: Math.PI / 160,
            teta_friction: function(dt) { return this.omega_friction * dt; }
        },
        dirt: {
            v_max: 3,
            v_back_max: 4,
            a_max: 0.5,
            a_back_max: 1,
            a_break: 0.1,
            dx: function(v, a, dt) { return v*dt + a*dt*dt },
            dv: function(a, dt) { return a*dt },
            a: function(v) { return this.a_max - Math.abs(this.a_max * v / this.v_max) },
            a_back: function(v) { return this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max); },
            omega: function(v) { return Math.PI / (40 + 4 * Math.abs(v)); },
            dteta: function(dt, v) { return this.omega(v) * dt },
            // friction increases with velocity
            a_friction: function(dt, v) { return Math.abs(0.01 * v) * dt; },
            omega_friction: Math.PI / 160,
            teta_friction: function(dt) { return this.omega_friction * dt; }
        },
        water: {
            v_max: 1,
            v_back_max: 1,
            a_max: 0.2,
            a_back_max: 0.2,
            a_break: 0.1,
            dx: function(v, a, dt) { return v*dt + a*dt*dt },
            dv: function(a, dt) { return a*dt },
            a: function(v) { return this.a_max - Math.abs(this.a_max * v / this.v_max) },
            a_back: function(v) { return this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max); },
            omega: function(v) { return Math.PI / (90 + 4 * Math.abs(v)); },
            dteta: function(dt, v) { return this.omega(v) * dt },
            // friction increases with velocity
            a_friction: function(dt, v) { return Math.abs(1 * v) * dt; },
            omega_friction: Math.PI / 160,
            teta_friction: function(dt) { return this.omega_friction * dt; }
        },
    };
    this.texture_prefix = 'car-';
    this.getSpecifications = function() {
        return {
            name: this.name,
            img: 'racing.png',
            velocity: {
                road: 80,
                dirt: 40,
                water: 20
            },
            acceleration: {
                road: 70,
                dirt: 60,
                water: 20
            },
            steering: {
                road: 70,
                dirt: 70,
                water: 20
            }
        };
    };
}

PsycoRally.RacingVehicle.prototype = new PsycoRally.Vehicle();

PsycoRally.TankVehicle = function(name) {
     this.name = name;
     this.terrain_specifications = {
        road: {
            v_max: 6, // px / 16 ms
            v_back_max: 2,
            a_max: 0.4,
            a_back_max: 0.4,
            a_break: 1,
            dx: function(v, a, dt) { return v*dt + a*dt*dt },
            dv: function(a, dt) { return a*dt },
            a: function(v) { return this.a_max - Math.abs(this.a_max * v / this.v_max) },
            a_back: function(v) { return this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max); },
            omega: function(v) { return Math.PI / (30 + 2 * Math.abs(v)); },
            dteta: function(dt, v) { return this.omega(v) * dt },
            // friction increases with velocity
            a_friction: function(dt, v) { return Math.abs(0.04 * v) * dt; },
            omega_friction: Math.PI / 160,
            teta_friction: function(dt) { return this.omega_friction * dt; }
        },
        dirt: {
            v_max: 9, // px / 16 ms
            v_back_max: 2,
            a_max: 0.8,
            a_back_max: 0.4,
            a_break: 1,
            dx: function(v, a, dt) { return v*dt + a*dt*dt },
            dv: function(a, dt) { return a*dt },
            a: function(v) { return this.a_max - Math.abs(this.a_max * v / this.v_max) },
            a_back: function(v) { return this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max); },
            omega: function(v) { return Math.PI / (30 + 2 * Math.abs(v)); },
            dteta: function(dt, v) { return this.omega(v) * dt },
            // friction increases with velocity
            a_friction: function(dt, v) { return Math.abs(0.04 * v) * dt; },
            omega_friction: Math.PI / 160,
            teta_friction: function(dt) { return this.omega_friction * dt; }
        },
        water: {
            v_max: 6, // px / 16 ms
            v_back_max: 2,
            a_max: 0.4,
            a_back_max: 0.4,
            a_break: 1,
            dx: function(v, a, dt) { return v*dt + a*dt*dt },
            dv: function(a, dt) { return a*dt },
            a: function(v) { return this.a_max - Math.abs(this.a_max * v / this.v_max) },
            a_back: function(v) { return this.a_back_max - Math.abs(this.a_back_max * v / this.v_back_max); },
            omega: function(v) { return Math.PI / (80 + 2 * Math.abs(v)); },
            dteta: function(dt, v) { return this.omega(v) * dt },
            // friction increases with velocity
            a_friction: function(dt, v) { return Math.abs(0.04 * v) * dt; },
            omega_friction: Math.PI / 160,
            teta_friction: function(dt) { return this.omega_friction * dt; }
        },
    };
    this.texture_prefix = 'tank-';
    this.getSpecifications = function() {
        return {
            name: this.name,
            img: 'tank.png',
            velocity: {
                road: 60,
                dirt: 70,
                water: 60
            },
            acceleration: {
                road: 60,
                dirt: 80,
                water: 60
            },
            steering: {
                road: 80,
                dirt: 80,
                water: 30
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
