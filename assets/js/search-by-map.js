class SearchByMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.filters = {
      location: "",
      region: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      refNumber: "",
      frontlineBeach: "",
      frontlineGolf: "",
      seaViews: "",
      gatedCommunity: "",
      andalusianStyle: "",
      renovated: "",
    };

    this.init();
  }

  init() {
    this.initMap();
    this.initEventListeners();
    this.loadProperties();
  }

  initMap() {
    // Initialize the map
    this.map = L.map("map").setView([36.493403, -4.754319], 15);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  initEventListeners() {
    // Filter change events
    document.querySelectorAll("select, input").forEach((element) => {
      element.addEventListener("change", () =>
        this.handleFilterChange(element)
      );
    });

    // Quick filter buttons
    document.querySelectorAll(".quick-filter").forEach((button) => {
      button.addEventListener("click", () => this.handleQuickFilter(button));
    });

    // Clear filters button
    document
      .getElementById("clear-filters")
      ?.addEventListener("click", () => this.clearFilters());

    // Accordion functionality
    document.querySelectorAll(".accordion").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = button.nextElementSibling;
        panel.classList.toggle("show");
      });
    });
  }

  async loadProperties() {
    try {
      const response = await fetch("/wp-json/solvista/v1/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.filters),
      });

      const properties = await response.json();
      this.updateMapMarkers(properties);
    } catch (error) {
      console.error("Error loading properties:", error);
    }
  }

  updateMapMarkers(properties) {
    // Clear existing markers
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    // Add new markers
    properties.forEach((property) => {
      const marker = L.marker([property.latitude, property.longitude])
        .addTo(this.map)
        .bindPopup(this.createPopupContent(property));

      this.markers.push(marker);
    });

    // Fit map bounds to show all markers
    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds());
    }
  }

  createPopupContent(property) {
    return `
      <div class="property-info">
        <h3>${property.title}</h3>
        <p>Price: ${property.price}</p>
        <p>Bedrooms: ${property.bedrooms}</p>
        <p>Bathrooms: ${property.bathrooms}</p>
        <p>Area: ${property.area}m²</p>
        <a href="${property.url}" target="_blank">View Details</a>
      </div>
    `;
  }

  handleFilterChange(element) {
    const filterName = element.name;
    this.filters[filterName] = element.value;
    this.loadProperties();
  }

  handleQuickFilter(button) {
    const filter = button.dataset.filter;
    // Toggle active state
    button.classList.toggle("active");

    // Update filter value
    this.filters[filter] = button.classList.contains("active") ? "yes" : "";
    this.loadProperties();
  }

  clearFilters() {
    // Reset all filter values
    Object.keys(this.filters).forEach((key) => {
      this.filters[key] = "";
    });

    // Reset form elements
    document.querySelectorAll("select, input").forEach((element) => {
      element.value = "";
    });

    // Remove active class from quick filter buttons
    document.querySelectorAll(".quick-filter").forEach((button) => {
      button.classList.remove("active");
    });

    this.loadProperties();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.searchByMap = new SearchByMap();
});
