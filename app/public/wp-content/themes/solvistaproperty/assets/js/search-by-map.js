jQuery(document).ready(function ($) {
  // Initialize map
  var map = L.map("map").setView([36.7213, -4.4213], 13); // Default to Marbella area
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Store markers
  var markers = [];
  var propertyLayer = L.layerGroup().addTo(map);

  // Quick selection buttons
  $(".quick-selection button").on("click", function () {
    $(this).toggleClass("active");
    updateFilters();
  });

  // Advanced filters
  $(".advanced-filters select, .advanced-filters input").on(
    "change",
    updateFilters
  );

  // Update filters and fetch properties
  function updateFilters() {
    var filters = {
      location: $("#location").val(),
      region: $("#region").val(),
      property_type: $("#property_type").val(),
      minPrice: $("#min_price").val(),
      maxPrice: $("#max_price").val(),
      bedrooms: $("#bedrooms").val(),
      bathrooms: $("#bathrooms").val(),
      area: $("#area").val(),
      frontline_beach: $("#frontline_beach").val(),
      frontline_golf: $("#frontline_golf").val(),
      sea_views: $("#sea_views").val(),
      gated_community: $("#gated_community").val(),
      andalusian_style: $("#andalusian_style").val(),
      renovated: $("#renovated").val(),
    };

    // Add quick selection filters
    $(".quick-selection button.active").each(function () {
      var filter = $(this).data("filter");
      filters[filter] = "yes";
    });

    // Fetch properties from REST API
    $.ajax({
      url: "/wp-json/solvista/v1/properties",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(filters),
      success: function (properties) {
        updateMapMarkers(properties);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching properties:", error);
      },
    });
  }

  // Update map markers
  function updateMapMarkers(properties) {
    // Clear existing markers
    propertyLayer.clearLayers();

    // Add new markers
    properties.forEach(function (property) {
      if (property.latitude && property.longitude) {
        var marker = L.marker([property.latitude, property.longitude])
          .bindPopup(createPropertyPopup(property))
          .addTo(propertyLayer);
        markers.push(marker);
      }
    });

    // Fit map to show all markers
    if (markers.length > 0) {
      var group = L.featureGroup(markers);
      map.fitBounds(group.getBounds());
    }
  }

  // Create property popup content
  function createPropertyPopup(property) {
    return `
            <div class="property-marker">
                <h3>${property.title}</h3>
                <p>€${formatPrice(property.price)}</p>
                <p>${
                  property.bedrooms
                } beds • ${property.bathrooms} baths • ${property.area}m²</p>
                <a href="${property.url}" target="_blank">View Details</a>
            </div>
        `;
  }

  // Format price with thousands separator
  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Initial load
  updateFilters();
});
