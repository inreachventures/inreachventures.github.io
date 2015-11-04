'use strict';

var request = require('superagent');

// Constructor
var Map = function() {
  this.cities = {};
  this.map = undefined;
  this.minBulletSize = 5;
  this.maxBulletSize = 10;

  // from: http://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
  this.locationColor = function(location) {
    var str = location.country;
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
    return colour;
  };

  this.updateMap = function() {
    var min = Infinity;
    var max = -Infinity;

    Object.keys(this.cities).forEach(function(city) {
      var location = this.cities[city];
      var value = location.count;
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    }.bind(this));

    var maxSquare = this.maxBulletSize * this.maxBulletSize * 2 * Math.PI;
    var minSquare = this.minBulletSize * this.minBulletSize * 2 * Math.PI;

    var dataProvider = {
      map: 'worldLow',
      zoomLevel: 3.5,
      zoomLongitude: 10,
      zoomLatitude: 52,
      images: []
    };

    Object.keys(this.cities).forEach(function(city) {
      var location = this.cities[city];
      var square = (location.count - min) / (max - min) * (maxSquare - minSquare) + minSquare;
      if (square < minSquare) {
          square = minSquare;
      }
      var size = Math.sqrt(square / (Math.PI * 2));

      dataProvider.images.push({
        type: 'circle',
        color: '#5aaa46', // locationColor(location),
        width: size,
        height: size,
        longitude: location.longitude,
        latitude: location.latitude,
        value: location.count,
        title: location.city,
        alpha: 0.8
      });
    }.bind(this));

    this.map.dataProvider = dataProvider;
  }.bind(this);

  AmCharts.ready(function() {
    this.map = new AmCharts.AmMap();
    this.map.addTitle("Startups this Month", 14);
    this.map.areaSettings = {unlistedAreasAlpha: 0.1};
    this.map.imagesSettings.balloonText = "<span style='font-size:14px;'>[[value]] new companies in [[title]]</span>";

    request
      .get('http://localhost:8080/organizations/locations')
      .end(function(err, response) {
        response.body.locations.forEach(function (location) {
          this.cities[location.city] = location;
        }.bind(this));

        this.updateMap();

        this.map.write("chartdiv");
      }.bind(this));
  }.bind(this));
};

module.exports = Map;
