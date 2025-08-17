// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Default view India

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Custom ATM icon
const atmIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910760.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Custom user/search icon
const userIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Clear old markers
let userMarker;
let atmMarkers = [];

// Function to fetch and display ATMs near coordinates
function fetchATMs(lat, lon) {
  const overpassQuery = `
    [out:json];
    node["amenity"="atm"](around:10000, ${lat}, ${lon});  // 3000m = 3km radius
    out;
  `;
  const overpassUrl =
    "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(overpassQuery);

  fetch(overpassUrl)
    .then(res => res.json())
    .then(data => {
      // Remove old ATM markers
      atmMarkers.forEach(m => map.removeLayer(m));
      atmMarkers = [];

      // Clear ATM table
      const tableBody = document.querySelector("#atmTable tbody");
      if (tableBody) tableBody.innerHTML = "";

      if (data.elements.length === 0) {
        alert("No ATMs found nearby.");
        return;
      }

      data.elements.forEach((atm, index) => {
        if (atm.lat && atm.lon) {
          const marker = L.marker([atm.lat, atm.lon], { icon: atmIcon })
            .addTo(map)
            .bindPopup(atm.tags.name || "ATM");
          atmMarkers.push(marker);

          // Add row to table if present
          if (tableBody) {
            const row = `<tr>
              <td>${index + 1}</td>
              <td>${atm.tags.name || "ATM"}</td>
              <td>${atm.lat.toFixed(5)}</td>
              <td>${atm.lon.toFixed(5)}</td>
            </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
          }
        }
      });
    })
    .catch(err => console.error("Error fetching ATMs:", err));
}

// Function to show location marker + ATMs
function showLocation(lat, lon, popupText) {
  map.setView([lat, lon], 15);

  // Remove old user marker
  if (userMarker) map.removeLayer(userMarker);

  userMarker = L.marker([lat, lon], { icon: userIcon })
    .addTo(map)
    .bindPopup(popupText)
    .openPopup();

  // Fetch ATMs around this point
  fetchATMs(lat, lon);
}

// Handle search button click
document.querySelector('#searchIcon').addEventListener('click', () => {
  const locationName = document.querySelector('#searchbox').value.trim();

  if (locationName) {
    // Search typed location
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          alert("Location not found!");
          return;
        }
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        showLocation(lat, lon, locationName);
      })
      .catch(err => console.error("Geocoding error:", err));
  } else {
    alert("Please enter a location.");
  }
});
