document.querySelector('#contactform').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = {
        name: this.name.value,
        email: this.email.value,
        comment: this.comment.value
    };
    const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.text();
      alert(data);
      this.reset();
});






///////////////////////////////////////////////////////////////////

<!DOCTYPE html>
<html>
<head>
    <title>Nearby ATMs Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map {
            height: 500px;
            width: 100%;
        }
    </style>
</head>
<body>
    <h2>Nearby ATMs</h2>
    <div id="map"></div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        const map = L.map('map').setView([20.5937, 78.9629], 5); // default India

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // ATM icon
        const atmIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910760.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        // User icon
        const userIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported by your browser.");
        }

        function showPosition(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            map.setView([userLat, userLon], 14);

            L.marker([userLat, userLon], { icon: userIcon }).addTo(map)
                .bindPopup("You are here").openPopup();

            const overpassQuery = `
                [out:json];
                node["amenity"="atm"](around:2000, ${userLat}, ${userLon});
                out;
            `;
            const overpassUrl = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(overpassQuery);

            fetch(overpassUrl)
                .then(res => res.json())
                .then(data => {
                    data.elements.forEach(atm => {
                        if (atm.lat && atm.lon) {
                            const distance = haversine(userLat, userLon, atm.lat, atm.lon).toFixed(2);
                            const bankName = atm.tags.name || "ATM";
                            L.marker([atm.lat, atm.lon], { icon: atmIcon })
                                .addTo(map)
                                .bindPopup(`<b>${bankName}</b><br>Distance: ${distance} km`);
                        }
                    });
                })
                .catch(err => console.error("Error fetching ATMs:", err));
        }

        function showError(error) {
            console.error("Geolocation error:", error);
        }

        // Haversine formula to calculate distance in km
        function haversine(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the Earth in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
    </script>
</body>
</html>
✅ What’s new
Each ATM marker shows bank name and distance from user in the popup.

Distance is calculated with the Haversine formula.

User’s marker is still distinct from ATMs.

If you want, I can also add a list view of t