Leaflet Control Google Geocoder
===============================

# What is it ?
A simple geocoder that uses Google Maps to locate places.

# How to use it ?
```javascript
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
    cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {attribution: cloudmadeAttribution});

var map = new L.Map('map').addLayer(cloudmade).setView(new L.LatLng(48.5, 2.5), 15);

var googleGeocoder = new L.Control.GoogleGeocoder();

map.addControl(googleGeocoder);
```

# What are the options ?
You can specify an options object as an argument of L.Control.GoogleGeocoder.
```javascript
var options = {
    collapsed: true, /* Whether its collapsed or not */
    position: 'topright', /* The position of the control */
    text: 'Locate', /* The text of the submit button */
    region: 'UK', /* The region code, which alters how it behaves based on a given country or territory */
    callback: function () /* Free to change */
};
```