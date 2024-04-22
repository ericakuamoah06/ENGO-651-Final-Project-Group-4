// Document ready function
$(document).ready(function () {

    // Function to toggle side navigation 
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.getElementById('main-content');
    let sideBarHeader = document.getElementById('sideBarHeader');
    let sideBarHeaderTitle = document.getElementById('sideBarHeaderTitle');
    let mapDiv = document.getElementById('map');
    let shareLocBtn = document.getElementById('shareLocBtn');
    let viewAllLayersId = document.getElementById('viewAllLayersId');
    let getNearestShortTermRentalsBtn = document.getElementById('getNearestShortTermRentalsBtn');
    let numberOfLocations = document.getElementById('numberOfLocations');
    let nearestShortTermForm = document.getElementById('nearestShortTermForm');
    let shortTermRentalCount = document.getElementById('shortTermRentalCount');
    let TrafficIncidentsCount = document.getElementById('TrafficIncidentsCount');
    let communityServiceCount = document.getElementById('communityServiceCount');
    let schoolCount = document.getElementById('schoolCount');
    let viewForLayers = document.getElementById('viewForLayers');
    viewForLayers.style.display = "none";


    let showAllLayers = false;

    let isLocationShared = false;

    let userLat = 0;
    let userLon = 0;
    let maximumRentalsNumber = 0;

    var trafficDataCount = 0;
    var communityServiceDataCount = 0;
    var shortTermDataCount = 0;
    var schoolDataCount = 0;

    numberOfLocations.value = 1;

    document.getElementById("currentDate").innerHTML = (new Date()).toDateString();


    viewAllLayersId?.addEventListener('click', ToggleMapLayers);

    // add a change event 

    getNearestShortTermRentalsBtn.addEventListener('click', function (e) {
        e.preventDefault();

        maximumRentalsNumber = parseInt(numberOfLocations.value);

        // get number of locations value
        if (maximumRentalsNumber <= 0) {
            alert("Please enter a valid number from 1 to 100");
        }

        if (maximumRentalsNumber > 100) {
            alert("Please enter a valid number less 1 to 100");
        }


        if (userLat == 0 && userLon == 0)
            alert("Please share your location first");
        else
            getNearestShortTermRentals();


    });

    shareLocBtn.addEventListener('click', getUserLocation);

    // Leaflet Js Implementations
    var map = L.map('map').setView([51.0447, -114.0719], 13);

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);



    // add a leaftjs scale to the map
    L.control.scale({ position: 'bottomleft' }).addTo(map);

    // Leaflet Legend
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = `<div class="mapLegend"><h5>Legend</h5>
            <i style="background: #ff0000"></i> Traffic Incidents <small class="badge badge-danger">${trafficDataCount}</small><br>
            <i style="background: #ff0000"></i> Community Service <small class="badge badge-teal">${communityServiceDataCount}</small><br> 
            <i style="background: #0000ff"></i> Short Term Rentals <small class="badge badge-purple">${shortTermDataCount}</small><br>
            <i style="background: #0000ff"></i> Schools Data <small class="badge badge-yellow">${schoolDataCount}</small></div>`;
        return div;
    };

    // Add a blue bootstrap badge
    var badge = L.control({ position: 'topright' });

    badge.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'badge badge-primary p-2');
        div.innerHTML = 'Project By: Eric Akuamoah and John Oyeniyi';
        return div;
    };

    badge.addTo(map);

    legend.addTo(map);
    // end of add map legend


    // Map Layers 
    // **********
    // **********
    // add a community service layer from a geojson api source
    var communityService = L.markerClusterGroup();

    L.geoJson.ajax("https://data.calgary.ca/resource/x34e-bcjz.geojson", {
        pointToLayer: function (feature, latlng) {
            let marker = L.circleMarker(latlng, {
                radius: 5,
                fillColor: "teal",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            communityService.addLayer(marker);

            return marker;
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Community Service:</strong> " + feature.properties.name + "<br>" +
                "<strong>Address:</strong> " + feature.properties.address + "<br>" +
                "<strong>Comm Code:</strong> " + feature.properties.comm_code + "<br>";
            layer.bindPopup(popupContent);
        }
    })

    // add a traffic incidents layer from a geojson api source
    var trafficIncidents = L.markerClusterGroup();

    L.geoJson.ajax("https://data.calgary.ca/resource/35ra-9556.geojson", {
        pointToLayer: function (feature, latlng) {
            let marker = L.circleMarker(latlng, {
                radius: 5,
                fillColor: "red",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            trafficIncidents.addLayer(marker);

            return marker;
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Incident:</strong> " + feature.properties.incident_info + "<br>" +
                "<strong>Incident Date:</strong> " + feature.properties.start_dt + "<br>" +
                "<strong>Details:</strong> " + feature.properties.description + "<br>" +
                "<strong>Count:</strong> " + feature.properties.count;
            layer.bindPopup(popupContent);
        }
    })

    var shortTermRentals = L.markerClusterGroup();

    // add a short term rentals layer 
    L.geoJson.ajax("https://data.calgary.ca/resource/gzkz-5k9a.geojson", {
        pointToLayer: function (feature, latlng) {
            let marker = L.circleMarker(latlng, {
                radius: 5,
                fillColor: "purple",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            shortTermRentals.addLayer(marker)

            return marker;
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Address:</strong> " + feature.properties.address + "<br>" +
                "<strong>License Number:</strong> " + feature.properties.business_licence_number + "<br>" +
                "<strong>License Type:</strong> " + feature.properties.type_of_residence + "<br>" +
                "<strong>License Status:</strong> " + feature.properties.status_description + "<br>" +
                "<strong>License Expiry:</strong> " + feature.properties.licenced_expiry_date;
            layer.bindPopup(popupContent);
        }
    })

    shortTermRentals.addTo(map);

    // add the schools layer 
    var schools = L.markerClusterGroup();

    L.geoJson.ajax("https://data.calgary.ca/resource/fd9t-tdn2.geojson", {
        pointToLayer: function (feature, latlng) {
            let marker = L.circleMarker(latlng, {
                radius: 5,
                fillColor: "yellow",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            schools.addLayer(marker);

            return marker;
        },
        onEachFeature: function (feature, layer) {

            var popupContent = "<strong>School:</strong> " + feature.properties.name + "<br>" +
                "<strong>Address:</strong> " + feature.properties.address_ab + "<br>" +
                "<strong>Grade:</strong> " + feature.properties.grades + "<br>" +
                "<strong>City:</strong> " + feature.properties.city + "<br>";
            layer.bindPopup(popupContent);
        }
    })

    // Create the heat map layer
    var heatMapLayer = L.heatLayer([], {
        radius: 10,
        blur: 5,
        maxZoom: 13,
    });

    // Fetch the data and update the heat map layer
    fetch('https://data.calgary.ca/resource/35ra-9556.geojson')
        .then(response => response.json())
        .then(data => {
            // Extract coordinates from GeoJSON features
            var heatMapData = data.features.map(feature => [
                feature.geometry.coordinates[1], // Latitude
                feature.geometry.coordinates[0], // Longitude
                10 // Intensity (you can customize this based on your data)
            ]);

            // Update the heat map layer with new data
            heatMapLayer.setLatLngs(heatMapData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });


    // End of Map Layers 
    // **********
    // **********


    var baseLayers = {
        "Traffic Incidents": trafficIncidents,
        "Community Service": communityService,
        "Short Term Rentals": shortTermRentals,
        "Schools": schools,
        "Traffic Heat Map": heatMapLayer
    };

    layercontrol = L.control.layers(baseLayers).addTo(map);


    // Function to get user's location coordinates
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                var coordinates = "Latitude: " + userLat + ", Longitude: " + userLon;
                document.getElementById("showShareLocCordinates").innerHTML = coordinates;

                map.setView([userLat, userLon], 13); // Center the map to user's location

                L.marker([position.coords.latitude, position.coords.longitude])
                    .addTo(map)
                    .bindPopup('You are here!')
                    .openPopup();
            });

            isLocationShared = true;

            shareLocBtn.disabled = true;

        } else {
            document.getElementById("showShareLocCordinates").innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    // Function to remove layers control
    function removeLayersControl() {
        map.removeControl(layercontrol);
    }


    // view all layers function
    function ToggleMapLayers() {

        if (showAllLayers) {
            communityService.addTo(map);
            trafficIncidents.addTo(map);
            shortTermRentals.addTo(map);
            schools.addTo(map);
            viewForLayers.style.display = "block";
            showAllLayers = false;
        } else {
            map.removeLayer(communityService);
            map.removeLayer(trafficIncidents);
            map.removeLayer(shortTermRentals);
            map.removeLayer(schools);

            showAllLayers = true;
            viewForLayers.style.display = "none";
        }

        // Add the tile layer

    }

    function getNearestShortTermRentals(features) {
        // Remove existing markers
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        fetch('https://data.calgary.ca/resource/gzkz-5k9a.geojson')
            .then(response => response.json())
            .then(rentals => {
                // 2. Retrieve User's Live Location (Assuming userLocation is an array [lat, lon])
                var userLocation = [userLat, userLon]; // Get user's location
                // 3. Calculate Distances and Find Nearest Rentals

                rentals.features = rentals.features
                    .filter(feature => feature?.properties?.status_description?.toLowerCase() === "licensed" && feature?.geometry?.coordinates); // Filter licensed rentals with non-null coordinates

                rentals.features.forEach(rental => {

                    let featureCoordinates = rental.geometry.coordinates;

                    let distance = turf.distance(turf.point([userLat, userLon]), turf.point([featureCoordinates[1], featureCoordinates[0]]), { units: 'kilometers' });

                    rental.properties.distance = distance;
                });

                let nearestFeatures = rentals.features.sort((a, b) => a.properties.distance - b.properties.distance);

                nearestFeatures = nearestFeatures.slice(0, maximumRentalsNumber);

                nearestFeatures.forEach(rental => {

                    let popupContent = "<strong>Address:</strong> " + rental.properties.address + "<br>" +
                        "<strong>License Number:</strong> " + rental.properties.business_licence_number + "<br>" +
                        "<strong>License Type:</strong> " + rental.properties.type_of_residence + "<br>" +
                        "<strong>License Status:</strong> " + rental.properties.status_description + "<br>" +
                        "<strong>License Expiry:</strong> " + rental.properties.licenced_expiry_date;

                    L.marker([rental.geometry.coordinates[1], rental.geometry.coordinates[0]], {
                        icon: L.icon({
                            iconUrl: 'static/image/homeicon.jpg',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    })
                        .addTo(map)
                        .bindPopup(popupContent);
                });

                L.marker([userLat, userLon])
                    .addTo(map)
                    .bindPopup('You are here!')
                    .openPopup();

                maximumRentalsNumber = 0;
            })
            .catch(error => console.error('Error fetching data:', error));
    }


    // Function to calculate distance between two points (Haversine formula)
    function calculateDistance(point1, point2) {
        const [lat1, lon1] = point1;
        const [lat2, lon2] = point2;

        const latDiff = Math.abs(lat2 - lat1);
        const lonDiff = Math.abs(lon2 - lon1);

        const distance = Math.sqrt(Math.pow(latDiff, 2) + Math.pow(lonDiff, 2));

        return distance;
    }

    // get short term rentals feature total
    fetch('https://data.calgary.ca/resource/gzkz-5k9a.geojson')
        .then(response => response.json())
        .then(rentals => {
            shortTermRentalCount.innerHTML = `Total Short Term Rentals: ${rentals.features.length}`;
        })
        .catch(error => console.error('Error fetching data:', error));

    // get community service feature total
    fetch('https://data.calgary.ca/resource/x34e-bcjz.geojson')
        .then(response => response.json())
        .then(coms => {
            communityServiceCount.innerHTML = `Total Community Service: ${coms.features.length}`;
        })
        .catch(error => console.error('Error fetching data:', error));

    // get traffic incidents feature total
    fetch('https://data.calgary.ca/resource/35ra-9556.geojson')
        .then(response => response.json())
        .then(traffics => {
            TrafficIncidentsCount.innerHTML = `Total Traffic Incidents: ${traffics.features.length}`;
        })
        .catch(error => console.error('Error fetching data:', error));

    fetch('https://data.calgary.ca/resource/fd9t-tdn2.geojson')
        .then(response => response.json())
        .then(schs => {
            schoolCount.innerHTML = `Total Number of Schools: ${schs.features.length}`;
        })
        .catch(error => console.error('Error fetching data:', error));
});