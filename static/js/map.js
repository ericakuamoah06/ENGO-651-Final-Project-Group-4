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
    let viewForLayers = document.getElementById('viewForLayers');
    viewForLayers.style.display = "none";

    let showAllLayers = false;

    let userLat = 0;
    let userLon = 0;
    let maximumRentalsNumber = 0;

    var trafficDataCount = 0;
    var communityServiceDataCount = 0;
    var shortTermDataCount = 0;

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

    // Add a marker for Calgary
    L.marker([51.0447, -114.0719])
        .addTo(map)
        .bindPopup('Calgary')
        .openPopup();

    // add a leaftjs scale to the map
    L.control.scale({ position: 'bottomright' }).addTo(map);

    // Leaflet Legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = `<div class="mapLegend"><h5>Legend</h5>
            <i style="background: #ff0000"></i> Traffic Incidents <small class="badge badge-danger">${trafficDataCount}</small><br>
            <i style="background: #ff0000"></i> Community Service <small class="badge badge-teal">${communityServiceDataCount}</small><br> 
            <i style="background: #0000ff"></i> Short Term Rentals <small class="badge badge-purple">${shortTermDataCount}</small></div>`;
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
    var communityService = L.geoJson.ajax("https://data.calgary.ca/resource/x34e-bcjz.geojson", {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "teal",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Community Service:</strong> " + feature.properties.name + "<br>" +
                "<strong>Address:</strong> " + feature.properties.address + "<br>" +
                "<strong>Comm Code:</strong> " + feature.properties.comm_code + "<br>";
            layer.bindPopup(popupContent);
        }
    })

    // add a traffic incidents layer from a geojson api source
    var trafficIncidents = L.geoJson.ajax("https://data.calgary.ca/resource/35ra-9556.geojson", {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "red",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            var popupContent = "<strong>Incident:</strong> " + feature.properties.incident_info + "<br>" +
                "<strong>Incident Date:</strong> " + feature.properties.start_dt + "<br>" +
                "<strong>Details:</strong> " + feature.properties.description + "<br>" +
                "<strong>Count:</strong> " + feature.properties.count;
            layer.bindPopup(popupContent);
        }
    })

    // add a short term rentals layer from a geojson api source
    var shortTermRentals = L.geoJson.ajax("https://data.calgary.ca/resource/gzkz-5k9a.geojson", {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "purple",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
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

    var schools = L.geoJson.ajax("https://data.calgary.ca/resource/fd9t-tdn2.geojson", {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "yellow",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {

            console.log(feature);
            var popupContent = "<strong>School:</strong> " + feature.properties.name + "<br>" +
                "<strong>Address:</strong> " + feature.properties.address_ab + "<br>" +
                "<strong>Grade:</strong> " + feature.properties.grades + "<br>" +
                "<strong>City:</strong> " + feature.properties.city + "<br>";
            layer.bindPopup(popupContent);
        }
    })
    
    

    // create a heat map out of the traffic incidents layer pick your source from the geojson api
    fetch('https://data.calgary.ca/resource/35ra-9556.geojson')
        .then(response => response.json())
        .then(data => {
            // Extract coordinates from GeoJSON features
            var heatMapData = data.features.map(feature => [
                feature.geometry.coordinates[1], // Latitude
                feature.geometry.coordinates[0], // Longitude
                10 // Intensity (you can customize this based on your data)
            ]);

            // Create the heat map layer
            var heatMapLayer = L.heatLayer(heatMapData, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                radius: 20,
                gradient: { 0.4: 'red', 0.65: 'lime', 1: 'red' }
            }).addTo(map);
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
        "Schools": schools
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
            });
        } else {
            document.getElementById("showShareLocCordinates").innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    // Function to remove layers control
    function removeLayersControl() {
        map.removeControl(layercontrol);
    }

    // Call the function to get user's location
    getUserLocation();

    // view all layers function
    function ToggleMapLayers() {

        if (showAllLayers) {
            communityService.addTo(map);
            trafficIncidents.addTo(map);
            shortTermRentals.addTo(map);
            viewForLayers.style.display = "block";
            showAllLayers = false;
        } else {
            map.removeLayer(communityService);
            map.removeLayer(trafficIncidents);
            map.removeLayer(shortTermRentals);

            showAllLayers = true;
            viewForLayers.style.display = "none";
        }

        // Add the tile layer

    }

    function getNearestShortTermRentals() {


        // remove existing markers
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        //add calgary marker
        L.marker([51.0447, -114.0719]).addTo(map).bindPopup('Calgary').openPopup();


        fetch('https://data.calgary.ca/resource/gzkz-5k9a.geojson')
            .then(response => response.json())
            .then(rentals => {
                // 2. Retrieve User's Live Location (Assuming userLocation is an array [lat, lon])
                var userLocation = [userLat, userLon]; // Get user's location
                // 3. Calculate Distances and Find Nearest Rentals
                rentals.features
                    .filter(feature => feature?.properties?.status_description.toLocaleLowerCase() == "Licensed")
                    .forEach(feature => {
                        var rentalLocation = [feature?.geometry?.coordinates[0], feature?.geometry?.coordinates[1]]; // Get rental property location
                        var distance = calculateDistance(userLocation, rentalLocation);
                        feature.properties.distance = distance; // Store distance in properties
                    });

                rentals.features.sort((a, b) => a.properties.distance - b.properties.distance); // Sort by distance

                var nearestRentals = rentals.features.slice(0, maximumRentalsNumber); // Get nearest rentals

                // 4. Display Results on Leaflet Map
                nearestRentals.forEach(rental => {

                    L.marker([rental.geometry.coordinates[1], rental.geometry.coordinates[0]], {
                        icon: L.icon({
                            iconUrl: 'static/image/homeicon.jpg',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    })
                        .addTo(map)
                        .bindPopup(rental?.properties?.status_description); // Display rental name in popup
                });

                maximumRentalsNumber = 0;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to calculate distance between two points (Haversine formula)
    function calculateDistance(point1, point2) {
        const R = 6371; // Radius of the Earth in kilometers
        const [lat1, lon1] = point1;
        const [lat2, lon2] = point2;

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in kilometers
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
        .then(rentals => {
            communityServiceCount.innerHTML = `Total Community Service: ${rentals.features.length}`;
        })
        .catch(error => console.error('Error fetching data:', error));

    // get traffic incidents feature total
    fetch('https://data.calgary.ca/resource/35ra-9556.geojson')
        .then(response => response.json())
        .then(rentals => {
            TrafficIncidentsCount.innerHTML = `Total Traffic Incidents: ${rentals.features.length}`;
        })
        .catch(error => console.error('Error fetching data:', error));







});