
L.Control.GoogleGeocoder = L.Control.extend({
    options: {
        collapsed: true,
        position: 'topright',
        text: 'Locate',
        region: 'UK',
        callback: function () {
        }
    },

    _callbackId: 0,

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;
        var className = this._className = 'leaflet-control-geocoder',
        container = this._container = L.DomUtil.create('div', className);

        if (!L.Browser.touch) {
            L.DomEvent.disableClickPropagation(container);
        } else {
            L.DomEvent.addListener(container, 'click', L.DomEvent.stopPropagation);
        }

        var form = this._form = L.DomUtil.create('form', className + '-form');

        var input = this._input = document.createElement('input');
        input.type = "text";

        var submit = document.createElement('button');
        submit.type = "submit";
        submit.innerHTML = this.options.text;
        
        var containerresult = this._containerresult = L.DomUtil.create('div', className + '-resultat');
        this._ul = L.DomUtil.create('ul', className + '-liste', containerresult);
        L.DomUtil.addClass(containerresult, 'disabled');

        form.appendChild(input);
        form.appendChild(submit);

        L.DomEvent.addListener(form, 'submit', this._geocode, this);

        if (this.options.collapsed) {
            L.DomEvent.addListener(container, 'mouseover', this._expand, this);
            L.DomEvent.addListener(container, 'mouseout', this._collapse, this);

            var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
            link.href = '#';
            link.id = className + '-toggle';
            link.title = 'Google Maps Geocoder';

            L.DomEvent.addListener(link, L.Browser.touch ? 'click' : 'focus', this._expand, this);

            this._map.on('movestart', this._collapse, this);
        } else {
            this._expand();
        }

        container.appendChild(form);
        container.appendChild(containerresult);

        return container;
    },

    _geocode : function (event) {
        var map = this._map;
        L.DomEvent.preventDefault(event);
        this._callbackId = "_l_gglgeocoder_" + (this._callbackId++);
        window[this._callbackId] = L.Util.bind(this.options.callback, this);

        var maxZoom = map.getMaxZoom();
        var query = this._input.value;
        var geocoder = new google.maps.Geocoder();
        var region = this.options.region;
        var containerresult = this._containerresult;
        var className = this._className;
        var ul = this._ul;

        if(typeof adressesLayer !== "undefined"){
            map.removeLayer(adressesLayer);
        }
                
        gglGeocoder = geocoder.geocode( {
            'address': query, 
            'region': region
        }, function(results, status) {
                    
            if (status == google.maps.GeocoderStatus.OK) {
                var nbFound = 0;
                var markers = new Array;
                var adresses = new Array;
                var li = new Array;
                var lien_li = new Array;
                
                ul.innerHTML = "";
                containerresult.className = containerresult.className.replace(' disabled', '');
                for (i=0; i<results.length; i++){
                    adresses[i] = new Array;
                    adresses[i]["coords"] = results[i].geometry.location;
                    adresses[i]["formatted_address"] = results[i].formatted_address;
                    adresses[i]["marker"] = L.marker([adresses[i]["coords"].lat(), adresses[i]["coords"].lng()],{
                        name:'adresse_'+i
                    });
                    markers[i] = L.marker([adresses[i]["coords"].lat(), adresses[i]["coords"].lng()],{
                        name:'adresse_'+i
                    });
                    
                    li[i] = L.DomUtil.create('li', className + '-liste-li', ul);
                    lien_li[i] = L.DomUtil.create('a', className + '-liste-li-a', li[i]);
                    lien_li[i].innerText = adresses[i]["formatted_address"];
                    lien_li[i].href = 'javascript:' + 'map.panTo(new L.LatLng('+ adresses[i]["coords"].lat()+','+ adresses[i]["coords"].lng()+'));map.setZoom('+maxZoom+');';
                    lien_li[i].id = 'adresse_'+i;
                    
                    nbFound += 1;
                }
                //
                adressesLayer = L.layerGroup(markers);
                map.addLayer(adressesLayer,{
                    name:"adresses"
                });
                        
                if (nbFound === 0) {
                    ul.innerHTML = "Aucune adresse correspondant à ces criteres de recherche.";
                    containerresult.className = containerresult.className.replace(' disabled', '');
                } else {
                    if (nbFound === 1) {
                        map.panTo(new L.LatLng(adresses[0]["coords"].lat(), adresses[0]["coords"].lng()));
                        map.setZoom(maxZoom);
                        ul.innerHTML = "";
                        L.DomUtil.addClass(containerresult, 'disabled');
                    } else {
                        var bounds = new L.LatLngBounds(
                            [adresses[0]["coords"].lat(),adresses[0]["coords"].lng()],
                            [adresses[nbFound-1]["coords"].lat(),adresses[nbFound-1]["coords"].lng()] 
                            );
                        map.fitBounds(bounds);                        
                    }

                }

            } else {
                ul.innerHTML = "Le geocodage n\'a pu etre effectué pour la raison suivante: " + status;
                containerresult.className = containerresult.className.replace(' disabled', '');
            }
                    
        });

    },

    _expand: function () {
        L.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');
    },

    _collapse: function () {
        this._container.className = this._container.className.replace(' leaflet-control-geocoder-expanded', '');
    }

});
