/**
 * GMAP : plugin javascript pour utiliser Google Maps version 3
 * @autor : Mahmoud NBET
 * @email : mahmoud.nbet@proxym-
 */

var GMAP = {
	map: null,
	config: {
		defaultOptions: {center: { lat: 25.046801, lng: 55.181436 }, zoom: 9},
	    iconUserPos: 'images/markers/red-marker.png',
	    showInfoWindow: true,
	    enableBounds: false
	    //enableDirectionsService: true
	},
	mapOptions: {
	    center: { lat: 25.046801, lng: 55.181436 },
	    mapTypeControl: false,
	    mapTypeId: "roadmap", // "roadmap" || "terrain"
	    //disableDefaultUI: false,
	    //zoomControl: true,
	    //zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL},
	    zoom: 7
	    //minZoom: 9
	},
	markerOptions: {
	    //icon: 'images/marker_car.png',
	},
	markers: [],
	//bounds: google && google.maps ? new google.maps.LatLngBounds() : null, // TODO
	currentInfoWindow: null,
	directionsDisplay: null, // google && google.maps ? new google.maps.DirectionsRenderer() : null, // TODO
	directionsService: null, // google && google.maps ? new google.maps.DirectionsService() : null, // TODO
	
	currentPosition: {
	    defaultLat: 25.046801,		// Latitude
	    defaultLng: 55.181436,		// Longitude
	},
	
	/**
	 * Map initialization
	 * @param mapContainer : dom
	 * @param options : init options
	 */
	init: function(mapContainer, options, config) {
		try {
            mapContainer = typeof mapContainer != "undefined" ? mapContainer : document.getElementById('mapContainer');
            if(typeof config != "undefined") $.extend(this.config, config);
			if(typeof options != "undefined") $.extend(this.mapOptions, options);
			
		    // TODO if(!google){ loadScriptAndreInit(mapContainer, options, config) }
			
			if(_checkNested(options, 'center', 'lat') && _checkNested(options, 'center', 'lng'))
				this.mapOptions.center = new google.maps.LatLng(this.mapOptions.center.lat, this.mapOptions.center.lng);
			
			if(this.mapOptions.zoom)
				this.mapOptions.zoom = parseInt(this.mapOptions.zoom);

		    this.map = new google.maps.Map(mapContainer, this.mapOptions);
			
			//console.log('MAP', this);
		} catch (e) {
		    console.log("unable to load map", e, this);
		}
		
		try {
				/*
		    if(this.config.enableDirectionsService){
		    	this.directionsService = new google.maps.DirectionsService();
		        this.directionsDisplay = new google.maps.DirectionsRenderer();
		        this.directionsDisplay.setMap(this.map);
		    }
			*/
					
		    if(this.config.enableBounds)
		        this.bounds = new google.maps.LatLngBounds();
		    
		}catch (e) {
			console.log( 'exception' , e );
		}
		
		return this;
	},
	
    /**
	 * set options map, Zomm, center map...
	 */
    setMapOptions: function (options) {
		
		if(_checkNested(options, 'center', 'lat') && _checkNested(options, 'center', 'lng'))
			options.center = new google.maps.LatLng(options.center.lat, options.center.lng);
		
		options.zoom = parseInt(options.zoom);
		
		if (typeof options != "undefined")
			this.map.setOptions(options);

        return this;
    },

    /**
	 * add marker
	 * @params options : object{ title, content, latitude, longitude ... }
	 */
    addMarker: function (options) {
    	console.log("addMarker", options);
        var self = this;
        $.extend(this.markerOptions, options);

        this.markerOptions.map = this.map;
        this.markerOptions.position = new google.maps.LatLng(options.latitude, options.longitude);

        marker = new google.maps.Marker(this.markerOptions);

        this.markers.push(marker);

        //google.maps.event.addListener(marker, 'click', self.showMarkerInfo( options ));
        
        if (this.config.showInfoWindow && typeof options.content != "undefined") {
			console.log('ADD INFO', this.config.showInfoWindow);
            content = options.title != '' ? '<h3>' + options.title + '</h3>' : '';
            content += options.content != '' ? '<div>' + options.content + '</div>' : '';
     
            infoWindow = new google.maps.InfoWindow({ content: content });
            this.currentInfoWindow = infoWindow ;
            google.maps.event.addListener(marker, 'click', self.openInfoWindow(infoWindow, marker));
            //google.maps.event.addListener( infoWindow,'closeclick', self.closeInfoWindow(infoWindow));
        }

        if (this.config.enableBounds){
            this.bounds.extend(marker.position);
            this.map.fitBounds(this.bounds);
        }

        return this;
    },

    /**
	 * open InfoWindow
	 */
    openInfoWindow: function (infoWindow, marker) {
       return function () {
            // Close the last selected marker before opening this one.
            if (this.currentInfoWindow) {
            	this.currentInfoWindow.close();
            }
            
            infoWindow.open(this.map, marker);
            this.currentInfoWindow = infoWindow;

        };
    },

    showMarkerInfo2: function(marker){

        $('.markerData .markerTitle').text(marker.title);
        $('.markerData .markerContent').text(marker.content);
        $('.markerImg').attr('src', marker.images);
    },

    /**
	 * close InfoWindow
	 */
    closeInfoWindow: function (infoWindow) {
        return function () {
            infoWindow.close();
        };
    },

    /**
	 * Delete Marker
	 */
    deleteMarker: function (marker) {
        marker.setMap(null);
    },

    /**
	 * Clear Markers
	 */
    clearMarkers: function () {
        for (i in this.markers) {
            this.deleteMarker(this.markers[i]);
        }
		this.markers = [];
		return this;
    },

    /**
	 * load list of markers in the map
	 * @params items : array of objects
	 */
    addMarkers: function (items) {
        //console.log('generateMarkers', options);

        for (n in items) {
            var item = items[n];
            this.addMarker(item);
        }

        if (this.config.enableBounds && this.markers.length > 0)
            this.map.fitBounds(GMAP.bounds);

        return this;
    },

    /**
	 * return all markers
	 */
    getMarkers: function () {
        return this.markers;
    },

    /**
     * Find markers by attribute value
     */
	
    findBy : function (attr, value) { console.log('findBy', attr, value);
        if(typeof attr != "undefined" && typeof value != "undefined")
            for (i = 0; i < this.markers.length; i++) {
                marker = this.markers[i];
                // If is same category or category not picked
                if (marker[attr] == value) {
                    marker.setVisible(true);
                }
                // Categories don't match 
                else {
                    marker.setVisible(false);
                }
            }
    },

    /**
     * Toggle markers by attribute value
     */

    toggleBy: function(attr, value){
        if(typeof attr != "undefined" && typeof value != "undefined")
            for (i = 0; i < this.markers.length; i++) {
                marker = this.markers[i];
                if (marker[attr] == value) {
                    isVisible = marker.getVisible();
                    marker.setVisible(!isVisible);
                }
            }
    },

    boundsPositions: function (positions) {
    	if(typeof this.bounds == "undefined")
    		this.bounds = new google.maps.LatLngBounds();
    	
        if (positions.length > 0) {
            for (i in positions) {
                p = new google.maps.LatLng(positions[i].k, positions[i].D);
                this.bounds.extend(p);
            }
            this.map.fitBounds(this.bounds);
        }
        return this;
    },

    /**
     * Tracage du chemin entre deux points
     * @params options : { origin, destination | originLat, originLng, destinationLat, destinationLng  }
     */
    traceDirectionDeferred: function (options) {
    	var deferred = new $.Deferred();
		
		if(this.directionsService == null){
			this.directionsService = new google.maps.DirectionsService();
			this.directionsDisplay = new google.maps.DirectionsRenderer();
			this.directionsDisplay.setMap(this.map);
		}
		
        try {
            if (options) {
            	
                var start = "";
                var end = "";

                if (_checkNested(options, "originLat") && _checkNested(options, "originLng") && _checkNested(options, "destinationLat") && _checkNested(options, "destinationLng")) {
                    start = new google.maps.LatLng(options.originLat, options.originLng);
                    end = new google.maps.LatLng(options.destinationLat, options.destinationLng);
                } else if (_checkNested(options, "origin") && _checkNested(options, "destination")) {
                    start = options.origin;
                    end = options.destination;
                }

                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING // DRIVING | BICYCLING | TRANSIT | WALKING
                };

                this.directionsService.route(request,
  				    function (response, status) {
						console.log('directionsService', response, status);
  				        if (status == google.maps.DirectionsStatus.OK) {

  				            GMAP.directionsDisplay.setDirections(response);
  				            //GMAP.directionsDisplay.setOptions({'suppressMarkers':true});

  				            deferred.resolve(response);
  				        }
  				    });
            }

		
        } catch (e) {
        	console.log('exeption', e);
			console.log('MAP', this);
        }

        return deferred.promise();
    },
    
    /**
	 * Calculer la distance entre (en km) deux points
	 */
    rad: function (x) { return x * Math.PI / 180; },
    distHaversine: function (p1Lat, p1Lng, p2Lat, p2Lng) {
        var R = 6371; // earth's mean radius in km
        var dLat = GMAP.rad(p2Lat - p1Lat);
        var dLong = GMAP.rad(p2Lng - p1Lng);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(GMAP.rad(p1Lat)) * Math.cos(GMAP.rad(p2Lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        //console.log("disyance en KM ", d.toFixed(2));
        return d.toFixed(2);
    },
    
    // ############################################################# DRAWING SHAPE
    /**
	 * Drawing Shape lib
	 * require load API : http://maps.google.ae/maps/api/js?libraries=drawing&sensor=false
	 */
    initDrawingShape: function (options) {
        this.drawingShapeOptions = options;
        if(typeof google.maps.drawing != "undefined"){
            this.getDrawingShape(options);
        }else{
            _loadScript('https://maps.googleapis.com/maps/api/js?libraries=drawing&callback=_getDrawingShape');
        }
        return this;
    },

    getDrawingShape: function (options) {

        options = typeof options != "undefined" ? options : this.drawingShapeOptions;
        console.log('getDrawingShape...', this);

        self = this;
        self.shapes = [];
        self.shape = typeof self.shape != "undefined" ? self.shape : {};
        

        this.drawingManager = new google.maps.drawing.DrawingManager({
            //drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                drawingModes: [
					//google.maps.drawing.OverlayType.MARKER,
					//google.maps.drawing.OverlayType.CIRCLE,
					//google.maps.drawing.OverlayType.POLYLINE,
					//google.maps.drawing.OverlayType.RECTANGLE,
					google.maps.drawing.OverlayType.POLYGON,
                ]
            },
            polygonOptions: {
                strokeColor: "#1E90FF",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#1E90FF',
                fillOpacity: 0.6,
                clickable: false,
                //editable: true,
                zIndex: 1
            }
        });

        if (options)
            if (options.polygonOptions)
                $.extend(this.drawingManager.polygonOptions, options.polygonOptions);

        this.drawingManager.setMap(this.map);

        google.maps.event.addListener(this.drawingManager, "overlaycomplete", function (event) {
        	self.shapes.push(event);
            overlayClickListener(event.overlay);
            self.shape.path = event.overlay.getPath().getArray();
            self.setDrawingManagerOptions(self.drawingManager, { drawingControl: false, drawingMode: '' });
            //self.drawingManager.setDrawingMode('');
        });

        function overlayClickListener(overlay) {
            google.maps.event.addListener(overlay, "mouseup", function (event) {
                self.shape.path = overlay.getPath().getArray();
            });
        };

        return this.drawingManager;
    },

    setDrawingManagerOptions: function (drawingManager, options) {
        drawingManager.setOptions(options);
    },

    drawShape: function (options, drawingManagerOptions) {
    	
    	this.shapes = typeof this.shapes != 'undefined' ? this.shapes : [] ;
    	this.shape = typeof this.shape != "undefined" ? this.shape : {} ;
    	
    	var polygonOptions = {
            strokeColor: "#1E90FF",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: "#1E90FF",
            fillOpacity: 0.6
        };

        var coordinates = [];
        if (typeof options.polygonOptions != "undefined") {
            path = options.polygonOptions.path || [];
            if (path && Array.isArray(path))
                for (i in path)
                    coordinates.push(new google.maps.LatLng(path[i].k, path[i].D));

            options.polygonOptions.path = coordinates;
            //this.shape.path = coordinates;

            if (options.polygonOptions)
                $.extend(polygonOptions, options.polygonOptions);
        }

        // drawingManager Options
        if (typeof drawingManagerOptions != "undefined") {
            this.setDrawingManagerOptions(this.drawingManager, drawingManagerOptions);
        }
        
        var shape = new google.maps.Polygon(polygonOptions);
        shape.setMap(this.map);
        this.shape.path = shape.latLngs.j[0].j;
        this.shapes.push(shape);
        
        return this ;
    },

    getShapePath: function () {
        path = [];
        if (typeof this.shape != "undefined") {
            path = typeof this.shape.path != "undefined" ? this.shape.path : [];
        }
        return path;
    },

	// ############################################################ GeoLocalisation
    /**
	 * Load current position with Deferred (jQuery required)
	 */
    getCurrentPositionDeferred: function (options) {
        var deferred = new $.Deferred();
        showMarker = typeof options.showMarker != "undefined" ? options.showMarker : false;
        var options = {
            //maximumAge: 3000,
            //timeout: 5000,
            enableHighAccuracy: true
        };
        
        navigator.geolocation.getCurrentPosition(
			function (position) {
				console.log('____getCurrentPosition DONE', position);
			    GMAP.userLatitude = position.coords.latitude;
			    GMAP.userLongitude = position.coords.longitude;
			    GMAP.userPos = new google.maps.LatLng(GMAP.userLatitude, GMAP.userLongitude);

			    if (showMarker) {
			        var markerOptions = { "latitude": GMAP.userLatitude, "longitude": GMAP.userLongitude, "icon": GMAP.config.iconUserPos };
			        GMAP.addMarker(markerOptions);
			    }

			    deferred.resolve(position);
			},

			function (error) {
			    //console.log('____getCurrentPosition FAIL', error);
			    //console.log('FAIL : position ===== '+ self.gMap.userLatitude +','+ self.gMap.userLongitude);
			    deferred.resolve(error);
			},
			options);

        // return promise so that outside code cannot reject/resolve the deferred
        return deferred.promise();
    }
    
};


/**
 * This function tests on all the object tree to verify if a property exist or not.
 * If deep property exists it returns true otherwise it will retrun false
 * @param obj
 * @returns {Boolean}
 */
function _checkNested(obj /*, level1, level2, ... levelN*/) {
	var args = Array.prototype.slice.call(arguments),
		obj = args.shift();
	
	if (obj == null) return false;
		
	for (var i = 0; i < args.length; i++) {
		if (!obj.hasOwnProperty(args[i])) 
			return false;
		
		obj = obj[args[i]];
		
		if (obj == null) return false;
	}
	
	return true;
}

function _loadScript(src) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script);
}

function _loadScriptAndreInit(mapContainer, options, config){
    googlePath = "http://maps.googleapis.com/maps/api/js?callback=_initialize" ;
    _loadScript(GMAP.googlePath);
}

function _initialize(){
    return GMAP.init();
}

function _getDrawingShape(){
    GMAP.getDrawingShape();
}