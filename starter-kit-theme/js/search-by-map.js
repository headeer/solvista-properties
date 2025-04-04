class SearchByMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.filters = {
      location: "",
      propertyType: "",
      maxPrice: "",
      bedrooms: "",
      quickFilters: [],
    };

    this.init();
  }

  init() {
    this.initMap();
    this.initEventListeners();
    this.loadProperties();
  }

  initMap() {
    this.map = L.map("map").setView([36.5097, -4.886], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);
  }

  initEventListeners() {
    // Price slider
    const priceSlider = document.getElementById("max-price");
    const priceDisplay = document.getElementById("price-display");

    if (priceSlider && priceDisplay) {
      const updatePriceDisplay = () => {
        const value = parseInt(priceSlider.value);
        priceDisplay.textContent = `€${this.formatNumber(value)}`;
        this.filters.maxPrice = value;
        this.debounce(this.loadProperties.bind(this), 500)();
      };

      priceSlider.addEventListener("input", updatePriceDisplay);
    }

    // Form inputs
    document.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", (e) => {
        this.filters[e.target.id] = e.target.value;
        this.loadProperties();
      });
    });

    // Quick filters
    document.querySelectorAll(".quick-filter-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        button.classList.toggle("active");

        if (button.classList.contains("active")) {
          this.filters.quickFilters.push(filter);
        } else {
          this.filters.quickFilters = this.filters.quickFilters.filter(
            (f) => f !== filter
          );
        }

        this.loadProperties();
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

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

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
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">${
          property.title
        }</h3>
        <p class="text-blue-600 font-medium mb-2">€${this.formatNumber(
          property.price
        )}</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <i class="fas fa-bed mr-1"></i>
            ${property.bedrooms} beds
          </div>
          <div>
            <i class="fas fa-bath mr-1"></i>
            ${property.bathrooms} baths
          </div>
          <div>
            <i class="fas fa-ruler-combined mr-1"></i>
            ${property.area}m²
          </div>
          <div>
            <i class="fas fa-home mr-1"></i>
            ${property.type}
          </div>
        </div>
        <a href="${property.url}" 
           class="mt-3 block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          View Details
        </a>
      </div>
    `;
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.searchByMap = new SearchByMap();
});

document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const tabId = tab.getAttribute("data-tab");
      document.getElementById(`${tabId}-search`).classList.add("active");
    });
  });

  // Clear filters functionality
  const clearFiltersBtn = document.querySelector(".clear-filters");
  clearFiltersBtn.addEventListener("click", () => {
    // Reset all form inputs
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach((input) => {
      if (input.type === "number") {
        input.value = "";
      } else if (input.tagName === "SELECT") {
        input.selectedIndex = 0;
      } else {
        input.value = "";
      }
    });

    // Remove active class from quick filters
    const quickFilters = document.querySelectorAll(".quick-filter");
    quickFilters.forEach((filter) => filter.classList.remove("active"));

    // Trigger map update with cleared filters
    updateMapWithFilters();
  });

  // Quick filter functionality
  const quickFilters = document.querySelectorAll(".quick-filter");
  quickFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filter.classList.toggle("active");
      updateMapWithFilters();
    });
  });

  // Form input change handlers
  const formInputs = document.querySelectorAll("input, select");
  formInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateMapWithFilters();
    });
  });

  // Sidebar Toggle
  const expandFiltersBtn = document.querySelector(".expand-filters-btn");
  const closeSidebarBtn = document.querySelector(".close-sidebar");
  const sidebar = document.querySelector(".advanced-filters-sidebar");
  const applyFiltersBtn = document.querySelector(".apply-filters-btn");

  if (expandFiltersBtn && sidebar) {
    expandFiltersBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (sidebar && sidebar.classList.contains("active")) {
      const isClickInside =
        sidebar.contains(e.target) || expandFiltersBtn.contains(e.target);
      if (!isClickInside) {
        sidebar.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });

  // Apply filters
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      // Gather all filter values
      const filters = {
        location: document.getElementById("location").value,
        propertyType: document.getElementById("property-type").value,
        maxPrice: document.getElementById("max-price").value,
        bedrooms: document.getElementById("bedrooms").value,
        bathrooms: document.getElementById("bathrooms").value,
        minArea: document.getElementById("min-area").value,
        refNumber: document.getElementById("ref-number").value,
      };

      // Close sidebar
      if (sidebar) {
        sidebar.classList.remove("active");
        document.body.style.overflow = "";
      }

      // Update map with new filters
      updateMapWithFilters(filters);
    });
  }

  // Get all active filters
  function getActiveFilters() {
    const filters = {
      location: document.getElementById("location").value,
      propertyType: document.getElementById("property-type").value,
      maxPrice: document.getElementById("max-price").value,
      bedrooms: document.getElementById("bedrooms").value,
      bathrooms: document.getElementById("bathrooms").value,
      minArea: document.getElementById("min-area").value,
      refNumber: document.getElementById("ref-number").value,
      quickFilters: Array.from(
        document.querySelectorAll(".quick-filter.active")
      ).map((filter) => filter.dataset.filter),
    };

    return filters;
  }

  // Update map with filters
  function updateMapWithFilters(filters) {
    console.log("Updating map with filters:", filters);
    // Here you would implement the logic to update the map markers
    // based on the active filters
  }
});
