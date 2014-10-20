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

    this.terrain_specifications = {
        road: {
            v_max: 800,
            v_back_max: 200,
            a_max: 30,
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
    this.texture_midrange = Math.PI / 32;
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
    this.getMovementData = function(keys, terrain) {
        // fwd
        // accelerating
        if(this.velocity >= 0 && keys.up) {
            this.velocity += this.terrain_specifications[terrain].linear_forward(this.velocity);
        }
        // breaking
        if(this.velocity >= 0 && keys.down) {
            this.velocity -= this.terrain_specifications[terrain].a_break;
        }
        // rwd
        if(this.velocity <= 0 && keys.down) {
            this.velocity -= this.terrain_specifications[terrain].linear_reverse(this.velocity);
        }
        // breaking
        if(this.velocity <= 0 && keys.up) {
            this.velocity += this.terrain_specifications[terrain].a_break;
        }

        // natural deceleration
        if(!keys.down && !keys.up) {
            var new_velocity = this.velocity - (this.velocity > 0 ? 1 : -1) * this.terrain_specifications[terrain].linear_d(this.velocity);
            this.velocity = this.velocity > 0
                ? (new_velocity > 0 ? Math.floor(new_velocity) : 0)
                : (new_velocity < 0 ? Math.ceil(new_velocity) : 0);
        }

        if(keys.right && this.velocity != 0) {
            this.angular -= this.terrain_specifications[terrain].angular;
        }
        if(keys.left && this.velocity != 0) {
            this.angular += this.terrain_specifications[terrain].angular;
        }

        // natural deceleration
        if(this.angular != 0) {
            for(d in this.textures) {
                var top_limit = this.textures[d] + this.texture_midrange;
                var bottom_limit = this.textures[d] - this.texture_midrange;
                if(bottom_limit < 0 && (this.angular > 2 * Math.PI + bottom_limit || this.angular < top_limit)) {
                    if(this.angular > 0 && this.angular <= this.texture_midrange) {
                        new_angular = this.angular - this.terrain_specifications[terrain].angular_d;
                        this.angular = new_angular > 0 ? new_angular : 0;
                    }
                    else {
                        new_angular = this.angular + this.terrain_specifications[terrain].angular_d;
                        this.angular = new_angular < 2 * Math.PI ? new_angular : 0;
                    }
                }
                else if(this.angular >= bottom_limit && this.angular < top_limit) {
                    if(this.angular > this.textures[d]) {
                        new_angular = this.angular - this.terrain_specifications[terrain].angular_d;
                        this.angular = new_angular > this.textures[d] ? new_angular : this.textures[d];
                    }
                    else if(this.angular < this.textures[d]) {
                        new_angular = this.angular + this.terrain_specifications[terrain].angular_d;
                        this.angular = new_angular < this.textures[d] ? new_angular : this.textures[d];
                    }
                }
            }
        }

        if(this.angular < 0) {
            this.angular = 2 * Math.PI + this.angular;
        }
        if(this.angular > 2 * Math.PI) {
            this.angular -= 2 * Math.PI;
        }

        return {
            vx: this.velocity * Math.sin(this.angular),
            vy: this.velocity * Math.cos(this.angular),
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
