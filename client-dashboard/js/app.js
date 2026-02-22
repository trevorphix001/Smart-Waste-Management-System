const map = L.map('map').setView([26.1445, 91.7362], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

let binMarkers = [];

async function refreshMap() {
    const res = await axios.get('http://localhost:3000/api/bins');
    const bins = res.data;
    
    // Clear old markers
    binMarkers.forEach(m => map.removeLayer(m));
    binMarkers = [];

    let criticalCount = 0;

    bins.forEach(bin => {
        const isCritical = bin.fillLevel > 80;
        if(isCritical) criticalCount++;

        const color = isCritical ? '#ef4444' : '#10b981';
        
        const marker = L.circleMarker([bin.location.coordinates[1], bin.location.coordinates[0]], {
            radius: 8,
            color: color,
            fillColor: color,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`
            <strong>${bin.serialNumber}</strong><br>
            Fill: ${bin.fillLevel}%<br>
            Status: ${bin.status}
        `);
        
        binMarkers.push(marker);
    });

    document.getElementById('alert-count').innerText = criticalCount;
}

// Initial Load
refreshMap();
// Real-time polling
setInterval(refreshMap, 5000);