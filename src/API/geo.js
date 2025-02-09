var geojsonLayer;
      fetch("kecamatan_bandung.geojson")
        .then((response) => response.json())
        .then((data) => {
          geojsonLayer = L.geoJSON(data, {
            style: { color: "blue", weight: 2, opacity: 0.6 },
            onEachFeature: function (feature, layer) {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
              }
            },
          }).addTo(map);
        })
        .catch((error) => console.error("Kesalahan saat memuat data:", error));


function searchArea() {
    var searchText = document.getElementById("search").value.toLowerCase();
    if (!geojsonLayer) return;
    let found = false;
    geojsonLayer.eachLayer((layer) => {
        if (
        layer.feature.properties.name.toLowerCase().includes(searchText)
        ) {
        map.fitBounds(layer.getBounds());
        layer.setStyle({ color: "red", weight: 3, opacity: 1 });
        found = true;
        getWeather(searchText);
        } else {
        layer.setStyle({ color: "blue", weight: 2, opacity: 0.6 });
        }
    });
    if (!found) alert("Wilayah tidak ditemukan");
    }