var PsycoRally = PsycoRally || {};

/**
 * Car class
 */
PsycoRally.Vehicle = function() {

    this.name = ''; // set by children
    this.velocity = 0;
    this.angular = 0;

    this.reset = function() {
        this.velocity = 0;
        this.angular = 0;
    };

    this.resetVelocity = function() {
        this.velocity = 0;
    };

    /**
     * These are suitable values, then every Vehicle instance provides its own
     */
    this.terrain_specifications = {
        // constant acceleration motion with vmax (acceleration depends on velocity) in a dt interval
        // acceleration decreases with velocity
        // constant angular acceleration
        // angular velocity depends on linear velocity (less steering with more speed)
        // linear friction (proportional to velocity)
        // angular friction
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
            v_max: 2,
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
    // img prefix. img names are in the form prefix + dir, ie car-sse
    this.texture_prefix = 'car-';
    // half angular portion for each texture
    this.texture_midrange = Math.PI / 32;
    // which texture corresponds to the given angle?
    this.textures = {
        s: 0,
        sssse: Math.PI / 16,
        ssse: 2 * Math.PI / 16,
        sse: 3 * Math.PI / 16,
        se: 4 * Math.PI / 16,
        see: 5 * Math.PI / 16,
        seee: 6 * Math.PI / 16,
        seeee: 7 * Math.PI / 16,
        e: Math.PI / 2,
        neeee: 9 * Math.PI / 16,
        neee: 10 * Math.PI / 16,
        nee: 11 * Math.PI / 16,
        ne: 12 * Math.PI / 16,
        nne: 13 * Math.PI / 16,
        nnne: 14 * Math.PI / 16,
        nnnne: 15 * Math.PI / 16,
        n: Math.PI,
        nnnno: 17 * Math.PI / 16,
        nnno: 18 * Math.PI / 16,
        nno: 19 * Math.PI / 16,
        no: 20 * Math.PI / 16,
        noo: 21 * Math.PI / 16,
        nooo: 22 * Math.PI / 16,
        noooo: 23 * Math.PI / 16,
        o: 3 * Math.PI / 2,
        soooo: 25 * Math.PI / 16,
        sooo: 26 * Math.PI / 16,
        soo: 27 * Math.PI / 16,
        so: 28 * Math.PI / 16,
        sso: 29 * Math.PI / 16,
        ssso: 30 * Math.PI / 16,
        sssso: 31 * Math.PI / 16
    };

    /**
     * Setter for terrain specifications
     */
    this.setTerrainSpecifications = function(terrain_specifications) {
        this.terrain_specifications = terrain_specifications;
    };

    /**
     * Setter for texture prefix
     */
    this.setTexturePrefix = function(texture_prefix) {
        this.texture_prefix = texture_prefix;
    };

    /**
     * Setter for texture midrange
     */
    this.setTextureMidrange = function(texture_midrange) {
        this.texture_midrange = texture_midrange;
    };

    /**
     * Setter for textures
     */
    this.setTextures = function(textures) {
        this.textures = textures;
    };

    /**
     * Calculates velocity vector and texture
     */
    this.getMovementData = function(deltat, keys, terrain) {

        // with fast processors dt is 1ms
        var dt = deltat / 16; // 60 fps => 16 ms

        // angular
        if(keys.right && this.velocity != 0) {
            this.angular -= this.terrain_specifications[terrain].dteta(dt, this.velocity);
        }
        if(keys.left && this.velocity != 0) {
            this.angular += this.terrain_specifications[terrain].dteta(dt, this.velocity);
        }

        // angular friction
        if(this.angular != 0 && !keys.left && !keys.right) {
            for(d in this.textures) {
                var top_limit = this.textures[d] + this.texture_midrange;
                var bottom_limit = this.textures[d] - this.texture_midrange;
                if(bottom_limit < 0 && (this.angular > 2 * Math.PI + bottom_limit || this.angular < top_limit)) {
                    if(this.angular > 0 && this.angular <= this.texture_midrange) {
                        new_angular = this.angular - this.terrain_specifications[terrain].teta_friction(dt);
                        this.angular = new_angular > 0 ? new_angular : 0;
                    }
                    else {
                        new_angular = this.angular + this.terrain_specifications[terrain].teta_friction(dt);
                        this.angular = new_angular < 2 * Math.PI ? new_angular : 0;
                    }
                }
                else if(this.angular >= bottom_limit && this.angular < top_limit) {
                    if(this.angular > this.textures[d]) {
                        new_angular = this.angular - this.terrain_specifications[terrain].teta_friction(dt);
                        this.angular = new_angular > this.textures[d] ? new_angular : this.textures[d];
                    }
                    else if(this.angular < this.textures[d]) {
                        new_angular = this.angular + this.terrain_specifications[terrain].teta_friction(dt);
                        this.angular = new_angular < this.textures[d] ? new_angular : this.textures[d];
                    }
                }
            }
        }

        // normalize angular
        if(this.angular < 0) {
            this.angular = 2 * Math.PI + this.angular;
        }
        if(this.angular > 2 * Math.PI) {
            this.angular -= 2 * Math.PI;
        }

        var acceleration = 0;
        // fwd
        if(this.velocity > 0 || (this.velocity == 0 && keys.up)) {
            if(keys.up) {
                acceleration = this.terrain_specifications[terrain].a(this.velocity);
            }
            if(keys.down) {
                acceleration = -this.terrain_specifications[terrain].a_break;
            }
        }
        else if(this.velocity < 0 || (this.velocity == 0 && keys.down)) {
            if(keys.down) {
                acceleration = -this.terrain_specifications[terrain].a_back(this.velocity);
            }
            if(keys.up) {
                acceleration = this.terrain_specifications[terrain].a(0);
            }
        }

        // friction
        if(!keys.down && !keys.up) {
            acceleration = (this.velocity > 0 ? -1 : +1) * this.terrain_specifications[terrain].a_friction(dt, this.velocity);
        }

        // velocity increment
        var dv = this.terrain_specifications[terrain].dv(acceleration, dt);
        // space increment
        var dx = this.terrain_specifications[terrain].dx(this.velocity, acceleration, dt);

        if(this.velocity > 0 && dx < 0) dx = 0;
        else if(this.velocity < 0 && dx > 0) dx = 0;

        // friction is determining motion round velocity to avoid never ending trip to 0
        if(!keys.down && !keys.up) {
            this.velocity = this.velocity > 0
                ? (this.velocity + dv > 0 ? Math.floor((this.velocity + dv) * 1000)/1000 : 0)
                : (this.velocity + dv < 0 ? Math.ceil((this.velocity + dv) * 1000)/1000 : 0);
        }
        else {
            this.velocity += dv;
        }

        return {
            dx: dx * Math.sin(this.angular),
            dy: dx * Math.cos(this.angular),
            texture: this.getTexture()
        };

    };

    /**
     * Gets the current texture depending on this.angular
     */
    this.getTexture = function() {
        for(d in this.textures) {
            var top_limit = this.textures[d] + this.texture_midrange;
            var bottom_limit = this.textures[d] - this.texture_midrange;

            if(
                (bottom_limit < 0 && (this.angular > 2 * Math.PI + bottom_limit || this.angular < top_limit))
                ||
                (this.angular >= bottom_limit && this.angular < top_limit)
            ) {
                return this.texture_prefix + d;
            }
        }
    };

    this.getAssets = function() {
        var assets = { images: {} };
        for(d in this.textures) {
            assets.images[this.texture_prefix + d] = 'game/assets/images/vehicle/' + this.name + '/' + this.texture_prefix + d + '.png'
        }
        return assets;
    }

}
