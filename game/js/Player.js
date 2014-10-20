PsycoRally = PsycoRally || {};

PsycoRally.Player = function() {

    this.setName = function(name) {
        this.name = name;
    }

    this.getName = function() {
        return this.name;
    }

    this.setVehicle = function(vehicle) {
        this.vehicle = vehicle;
    }

    this.getVehicle = function() {
        return this.vehicle;
    }
}
