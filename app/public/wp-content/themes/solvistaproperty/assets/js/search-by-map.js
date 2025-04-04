jQuery(document).ready(function ($) {
  // Initialize map
  var map = L.map("map").setView([36.7213, -4.4213], 13); // Default to Marbella area
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Store markers
  var markers = [];
  var propertyLayer = L.layerGroup().addTo(map);

  // API Configuration
  const API_CONFIG = {
    clientId: "1033180",
    apiKey: "549e6da9b048b768a21e0f82ff3b019566fb164a",
    agencyFilterId: "5",
    baseUrl: "https://webapi.resales-online.com/V6/SearchProperties",
  };

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

    // Build API query parameters
    var queryParams = new URLSearchParams({
      p_agency_filterid: API_CONFIG.agencyFilterId,
      p1: API_CONFIG.clientId,
      p2: API_CONFIG.apiKey,
      P_sandbox: "false",
      P_Lang: "1",
      p_ShowLastUpdateDate: "true",
      p_SortType: "1", // 1 for price ascending
      p_output: "json",
      p_limit: "100",
    });

    // Add filters to query parameters
    if (filters.location) queryParams.append("p_location", filters.location);
    if (filters.property_type)
      queryParams.append("p_property_type", filters.property_type);
    if (filters.minPrice) queryParams.append("p_min_price", filters.minPrice);
    if (filters.maxPrice) queryParams.append("p_max_price", filters.maxPrice);
    if (filters.bedrooms) queryParams.append("p_bedrooms", filters.bedrooms);
    if (filters.bathrooms) queryParams.append("p_bathrooms", filters.bathrooms);
    if (filters.area) queryParams.append("p_min_area", filters.area);

    // Fetch properties from Resales Online API
    $.ajax({
      url: API_CONFIG.baseUrl + "?" + queryParams.toString(),
      method: "GET",
      success: function (response) {
        if (response && response.Property) {
          updateMapMarkers(response.Property);
        } else {
          console.error("No properties found in response:", response);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching properties:", error);
        console.error("Status:", status);
        console.error("Response:", xhr.responseText);
      },
    });
  }

  // Update map markers
  function updateMapMarkers(properties) {
    // Clear existing markers
    propertyLayer.clearLayers();
    markers = [];

    // Add new markers
    properties.forEach(function (property) {
      if (property.Latitude && property.Longitude) {
        var marker = L.marker([property.Latitude, property.Longitude])
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
                <h3>${property.Title || property.Name}</h3>
                <p>€${formatPrice(property.Price)}</p>
                <p>${
                  property.Bedrooms || 0
                } beds • ${property.Bathrooms || 0} baths • ${property.Built || 0}m²</p>
                <p>Ref: ${property.Reference}</p>
                <a href="${
                  property.URL || "#"
                }" target="_blank">View Details</a>
            </div>
        `;
  }

  // Format price with thousands separator
  function formatPrice(price) {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  }

  // Initial load
  updateFilters();
});
