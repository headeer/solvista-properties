// Dummy property data with real images
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Marbella",
    location: "Marbella",
    price: "€2,500,000",
    bedrooms: 5,
    bathrooms: 4,
    area: "450m²",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    description: "Beautiful luxury villa with stunning sea views",
    lat: 36.5097,
    lng: -4.886,
    url: "/property/luxury-villa-marbella",
    features: ["frontline_beach", "sea_views", "gated_community"],
  },
  {
    id: 2,
    title: "Modern Apartment in Sotogrande",
    location: "Sotogrande",
    price: "€850,000",
    bedrooms: 3,
    bathrooms: 2,
    area: "180m²",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description: "Contemporary apartment with golf course views",
    lat: 36.2833,
    lng: -5.2833,
    url: "/property/modern-apartment-sotogrande",
    features: ["frontline_golf", "gated_community", "renovated"],
  },
  // Add more dummy properties with real images
  ...Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index + 3,
      title: `Property ${index + 3}`,
      location: "Marbella",
      price: `€${(Math.random() * 2000000 + 500000).toLocaleString()}`,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area: `${Math.floor(Math.random() * 300 + 100)}m²`,
      image: `https://images.unsplash.com/photo-${
        [
          "1560518883-ce09059eeffa",
          "1512917774080-9991f1c4c750",
          "1600596542815-ffad4c153aee9",
          "1600585154340-be6161a56a0c",
          "1600602640725-35e72d394e58",
          "1600602640725-35e72d394e58",
          "1600602640725-35e72d394e58",
          "1600602640725-35e72d394e58",
          "1600602640725-35e72d394e58",
          "1600602640725-35e72d394e58",
        ][index]
      }?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`,
      description: "Beautiful property with great features",
      lat: 36.5097 + (Math.random() - 0.5) * 0.1,
      lng: -4.886 + (Math.random() - 0.5) * 0.1,
      url: `/property/property-${index + 3}`,
      features: ["sea_views", "gated_community", "andalusian_style"],
    })),
];

class SearchByMap {
  constructor() {
    this.map = null;
    this.markers = new Map();
    this.markerCluster = null;
    this.highlightedMarker = null;
    this.init();
  }

  init() {
    console.log("SearchByMap init called");

    // Check if map container exists
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
      console.log("Map container not found");
      return;
    }

    // Check if map is already initialized
    if (mapContainer._leaflet_id) {
      console.log("Map already initialized, reusing existing map");
      try {
        // Try to get the existing map instance
        this.map = L.DomUtil.get("map")._leaflet_map;

        // Find or create marker cluster
        this.markerCluster = this.map
          .getLayers()
          .find((layer) => layer instanceof L.MarkerClusterGroup);
        if (!this.markerCluster) {
          console.log("Creating new marker cluster");
          this.markerCluster = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            iconCreateFunction: this.createClusterIcon.bind(this),
          });
          this.map.addLayer(this.markerCluster);
        }

        this.updateMarkers(properties);
        return;
      } catch (error) {
        console.error("Error accessing existing map:", error);
      }
    }

    console.log("Initializing new map");
    try {
      // Initialize map centered on Marbella
      this.map = L.map("map").setView([36.5097, -4.886], 13);

      // Add map tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      // Initialize marker cluster
      this.markerCluster = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: this.createClusterIcon.bind(this),
      });

      this.map.addLayer(this.markerCluster);
      this.updateMarkers(properties);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }

  createClusterIcon(cluster) {
    const count = cluster.getChildCount();
    let size = "small";

    if (count > 100) size = "large";
    else if (count > 10) size = "medium";

    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40),
      iconAnchor: L.point(20, 20),
    });
  }

  updateMarkers(properties) {
    // Clear existing markers
    this.markerCluster.clearLayers();
    this.markers.clear();

    properties.forEach((property) => {
      const marker = L.circleMarker([property.lat, property.lng], {
        radius: 16,
        fillColor: "#EA682F",
        color: "#FFFFFF",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: "custom-marker",
      });

      // Add popup with property details
      marker.bindPopup(`
        <div class="property-popup">
          <div class="property-popup-image" style="background-image: url(${property.image});"></div>
          <h3>${property.title}</h3>
          <p>${property.location}</p>
          <p>${property.price}</p>
          <p>${property.bedrooms} beds | ${property.bathrooms} baths | ${property.area}</p>
          <a href="${property.url}" class="view-details">View Details</a>
        </div>
      `);

      this.markers.set(property.id, marker);
      this.markerCluster.addLayer(marker);
    });
  }

  highlightProperty(propertyId) {
    // Remove highlight from previous marker
    if (this.highlightedMarker) {
      this.highlightedMarker.setStyle({
        fillColor: "#EA682F",
      });
    }

    const marker = this.markers.get(propertyId);
    if (marker) {
      marker.setStyle({
        fillColor: "#C7551E",
        radius: 20,
      });
      marker.addTo(this.map);
      this.highlightedMarker = marker;

      // Center map on highlighted marker
      this.map.setView(marker.getLatLng(), 15);
    }
  }
}

class PropertyFilters {
  constructor() {
    this.properties = properties;
    this.filteredProperties = [...properties];
    this.selectedFilters = {
      location: [],
      type: [],
      bedrooms: [],
      price: [],
      quickFilters: [],
    };
    this.map = new SearchByMap();
    this.init();
  }

  init() {
    // First render the property listings
    this.renderPropertyListings();

    // Then set up all the event listeners and filters
    this.setupEventListeners();
    this.setupSearchFilters();
    this.setupQuickFilters();
    this.setupFilterOptions();
    this.setupResetButton();

    // Load filters from URL and apply them
    this.loadFiltersFromURL();
    this.applyFilters();
  }

  loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Load location filters
    const locationFilters = urlParams.get("location");
    if (locationFilters) {
      this.selectedFilters.location = locationFilters.split(",");
    }

    // Load type filters
    const typeFilters = urlParams.get("type");
    if (typeFilters) {
      this.selectedFilters.type = typeFilters.split(",");
    }

    // Load bedroom filters
    const bedroomFilters = urlParams.get("bedrooms");
    if (bedroomFilters) {
      this.selectedFilters.bedrooms = bedroomFilters.split(",");
    }

    // Load price filters
    const priceFilters = urlParams.get("price");
    if (priceFilters) {
      this.selectedFilters.price = priceFilters.split(",");
    }

    // Load quick filters
    const quickFilters = urlParams.get("quick");
    if (quickFilters) {
      this.selectedFilters.quickFilters = quickFilters.split(",");
    }

    // Update UI to match URL parameters
    this.updateUIFromFilters();
  }

  updateUIFromFilters() {
    // Update location filters
    document
      .querySelectorAll('.vscomp-option[data-filter="location"]')
      .forEach((option) => {
        if (this.selectedFilters.location.includes(option.dataset.value)) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      });

    // Update type filters
    document
      .querySelectorAll('.vscomp-option[data-filter="type"]')
      .forEach((option) => {
        if (this.selectedFilters.type.includes(option.dataset.value)) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      });

    // Update bedroom filters
    document
      .querySelectorAll('.vscomp-option[data-filter="bedrooms"]')
      .forEach((option) => {
        if (this.selectedFilters.bedrooms.includes(option.dataset.value)) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      });

    // Update price filters
    document
      .querySelectorAll('.vscomp-option[data-filter="price"]')
      .forEach((option) => {
        if (this.selectedFilters.price.includes(option.dataset.value)) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      });

    // Update quick filters
    document
      .querySelectorAll(".quick-filters-grid .button-6")
      .forEach((button) => {
        if (this.selectedFilters.quickFilters.includes(button.dataset.filter)) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });
  }

  updateURLFromFilters() {
    console.log("Updating URL from filters:", this.selectedFilters);

    const urlParams = new URLSearchParams();

    // Only add parameters if there are selected filters
    if (
      this.selectedFilters.location &&
      this.selectedFilters.location.length > 0
    ) {
      urlParams.set("location", this.selectedFilters.location.join(","));
    }

    if (this.selectedFilters.type && this.selectedFilters.type.length > 0) {
      urlParams.set("type", this.selectedFilters.type.join(","));
    }

    if (
      this.selectedFilters.bedrooms &&
      this.selectedFilters.bedrooms.length > 0
    ) {
      urlParams.set("bedrooms", this.selectedFilters.bedrooms.join(","));
    }

    if (this.selectedFilters.price && this.selectedFilters.price.length > 0) {
      urlParams.set("price", this.selectedFilters.price.join(","));
    }

    if (
      this.selectedFilters.quickFilters &&
      this.selectedFilters.quickFilters.length > 0
    ) {
      urlParams.set("quick", this.selectedFilters.quickFilters.join(","));
    }

    // Create the new URL
    const newURL = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;

    console.log("New URL:", newURL);

    // Update the URL without reloading the page
    window.history.pushState({}, "", newURL);
  }

  setupFilterOptions() {
    console.log("Setting up filter options");

    document.querySelectorAll(".vscomp-option").forEach((option) => {
      // Single click handler for the entire option
      option.addEventListener("click", (e) => {
        // Ignore group titles
        if (option.classList.contains("group-title")) {
          console.log("Group title clicked, ignoring");
          return;
        }

        // Get the filter type from the parent container
        const filterContainer = option.closest(".vscomp-options");
        if (!filterContainer) {
          console.error("Could not find filter container");
          return;
        }

        // Try to get filter type from container's data-filter attribute
        let filterType = filterContainer.dataset.filter;

        // If not found, try to determine from the container's class or ID
        if (!filterType) {
          // Check if the container has a class that indicates the filter type
          const containerClasses = Array.from(filterContainer.classList);
          const filterClass = containerClasses.find(
            (cls) =>
              cls.includes("bedrooms") ||
              cls.includes("price") ||
              cls.includes("location") ||
              cls.includes("type")
          );

          if (filterClass) {
            // Extract filter type from class name
            if (filterClass.includes("bedrooms")) filterType = "bedrooms";
            else if (filterClass.includes("price")) filterType = "price";
            else if (filterClass.includes("location")) filterType = "location";
            else if (filterClass.includes("type")) filterType = "type";
          }

          // If still not found, try to determine from the option's class
          if (!filterType) {
            const optionClasses = Array.from(option.classList);
            const typeClass = optionClasses.find(
              (cls) =>
                cls.includes("apartment") ||
                cls.includes("villa") ||
                cls.includes("house") ||
                cls.includes("land") ||
                cls.includes("penthouse")
            );

            if (typeClass) {
              filterType = "type";
            }
          }

          // If still not found, try to determine from the option's text content
          if (!filterType) {
            const optionText = option
              .querySelector(".vscomp-option-text")
              ?.textContent.toLowerCase();
            if (optionText) {
              if (optionText.includes("bedroom") || /^\d+$/.test(optionText))
                filterType = "bedrooms";
              else if (optionText.includes("€") || optionText.includes("euro"))
                filterType = "price";
              else if (
                optionText.includes("villa") ||
                optionText.includes("apartment") ||
                optionText.includes("house") ||
                optionText.includes("land") ||
                optionText.includes("penthouse")
              )
                filterType = "type";
              else filterType = "location"; // Default to location if can't determine
            }
          }
        }

        if (!filterType) {
          console.error("Could not determine filter type");
          return;
        }

        // Get the value from the option
        let value = option.dataset.value;

        // If value is not set, try to get it from the option text
        if (!value) {
          const optionText = option.querySelector(
            ".vscomp-option-text"
          )?.textContent;
          if (optionText) {
            // For bedrooms, extract just the number
            if (filterType === "bedrooms") {
              const match = optionText.match(/\d+/);
              value = match ? match[0] : optionText.trim().toLowerCase();
            } else {
              value = optionText.trim().toLowerCase();
            }
          }
        }

        if (!value) {
          console.error("Value not found in option");
          return;
        }

        console.log(`Option clicked: ${filterType}, value: ${value}`);
        console.log(
          "Current selected state:",
          option.classList.contains("selected")
        );

        // Initialize the filter array if it doesn't exist
        if (!this.selectedFilters[filterType]) {
          this.selectedFilters[filterType] = [];
        }

        // Check if the value is already in the array
        const valueIndex = this.selectedFilters[filterType].indexOf(value);
        const isCurrentlySelected = valueIndex !== -1;

        // Toggle the value in the array
        if (isCurrentlySelected) {
          // Remove the value
          this.selectedFilters[filterType].splice(valueIndex, 1);
          console.log(`Removed ${value} from ${filterType} filters`);
          // Update visual state
          option.classList.remove("selected");
          const checkbox = option.querySelector(".checkbox-icon");
          if (checkbox) {
            checkbox.style.backgroundColor = "";
            checkbox.style.borderColor = "#d1d5db";
          }
        } else {
          // Add the value
          this.selectedFilters[filterType].push(value);
          console.log(`Added ${value} to ${filterType} filters`);
          // Update visual state
          option.classList.add("selected");
          const checkbox = option.querySelector(".checkbox-icon");
          if (checkbox) {
            checkbox.style.backgroundColor = "#EA682F";
            checkbox.style.borderColor = "#EA682F";
          }
        }

        console.log("Current filters:", this.selectedFilters);

        // Update all checkboxes to match the current filter state
        this.updateAllCheckboxes();

        this.updateURLFromFilters();
        this.applyFilters();
      });
    });

    // Add direct click handlers for checkboxes
    document.querySelectorAll(".checkbox-icon").forEach((checkbox) => {
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the option click handler from firing

        const option = checkbox.closest(".vscomp-option");
        if (!option || option.classList.contains("group-title")) return;

        // Get the filter type and value
        const filterContainer = option.closest(".vscomp-options");
        if (!filterContainer) return;

        let filterType = filterContainer.dataset.filter;
        if (!filterType) {
          // Try to determine filter type from container class
          const containerClasses = Array.from(filterContainer.classList);
          const filterClass = containerClasses.find(
            (cls) =>
              cls.includes("bedrooms") ||
              cls.includes("price") ||
              cls.includes("location") ||
              cls.includes("type")
          );

          if (filterClass) {
            if (filterClass.includes("bedrooms")) filterType = "bedrooms";
            else if (filterClass.includes("price")) filterType = "price";
            else if (filterClass.includes("location")) filterType = "location";
            else if (filterClass.includes("type")) filterType = "type";
          }
        }

        if (!filterType) return;

        // Get the value
        let value = option.dataset.value;
        if (!value) {
          const optionText = option.querySelector(
            ".vscomp-option-text"
          )?.textContent;
          if (optionText) {
            // For bedrooms, extract just the number
            if (filterType === "bedrooms") {
              const match = optionText.match(/\d+/);
              value = match ? match[0] : optionText.trim().toLowerCase();
            } else {
              value = optionText.trim().toLowerCase();
            }
          }
        }

        if (!value) return;

        // Initialize the filter array if it doesn't exist
        if (!this.selectedFilters[filterType]) {
          this.selectedFilters[filterType] = [];
        }

        // Check if the value is already in the array
        const valueIndex = this.selectedFilters[filterType].indexOf(value);
        const isCurrentlySelected = valueIndex !== -1;

        // Toggle the value in the array
        if (isCurrentlySelected) {
          // Remove the value
          this.selectedFilters[filterType].splice(valueIndex, 1);
          console.log(`Removed ${value} from ${filterType} filters`);
          // Update visual state
          option.classList.remove("selected");
          checkbox.style.backgroundColor = "";
          checkbox.style.borderColor = "#d1d5db";
        } else {
          // Add the value
          this.selectedFilters[filterType].push(value);
          console.log(`Added ${value} to ${filterType} filters`);
          // Update visual state
          option.classList.add("selected");
          checkbox.style.backgroundColor = "#EA682F";
          checkbox.style.borderColor = "#EA682F";
        }

        console.log("Current filters:", this.selectedFilters);

        // Update all checkboxes to match the current filter state
        this.updateAllCheckboxes();

        this.updateURLFromFilters();
        this.applyFilters();
      });
    });
  }

  // New method to update all checkboxes to match the current filter state
  updateAllCheckboxes() {
    // Update all checkboxes based on the current filter state
    document.querySelectorAll(".vscomp-option").forEach((option) => {
      if (option.classList.contains("group-title")) return;

      // Get the filter type and value
      const filterContainer = option.closest(".vscomp-options");
      if (!filterContainer) return;

      let filterType = filterContainer.dataset.filter;
      if (!filterType) {
        // Try to determine filter type from container class
        const containerClasses = Array.from(filterContainer.classList);
        const filterClass = containerClasses.find(
          (cls) =>
            cls.includes("bedrooms") ||
            cls.includes("price") ||
            cls.includes("location") ||
            cls.includes("type")
        );

        if (filterClass) {
          if (filterClass.includes("bedrooms")) filterType = "bedrooms";
          else if (filterClass.includes("price")) filterType = "price";
          else if (filterClass.includes("location")) filterType = "location";
          else if (filterClass.includes("type")) filterType = "type";
        }
      }

      if (!filterType) return;

      // Get the value
      let value = option.dataset.value;
      if (!value) {
        const optionText = option.querySelector(
          ".vscomp-option-text"
        )?.textContent;
        if (optionText) {
          // For bedrooms, extract just the number
          if (filterType === "bedrooms") {
            const match = optionText.match(/\d+/);
            value = match ? match[0] : optionText.trim().toLowerCase();
          } else {
            value = optionText.trim().toLowerCase();
          }
        }
      }

      if (!value) return;

      // Check if this value is in the selected filters
      const isSelected =
        this.selectedFilters[filterType] &&
        this.selectedFilters[filterType].includes(value);

      // Update the visual state
      if (isSelected) {
        option.classList.add("selected");
        const checkbox = option.querySelector(".checkbox-icon");
        if (checkbox) {
          checkbox.style.backgroundColor = "#EA682F";
          checkbox.style.borderColor = "#EA682F";
        }
      } else {
        option.classList.remove("selected");
        const checkbox = option.querySelector(".checkbox-icon");
        if (checkbox) {
          checkbox.style.backgroundColor = "";
          checkbox.style.borderColor = "#d1d5db";
        }
      }
    });
  }

  setupQuickFilters() {
    // Set initial opacity to 33% for all quick filter buttons
    document
      .querySelectorAll(".quick-filters-grid .button-6")
      .forEach((button) => {
        button.style.opacity = "0.33";
      });

    document
      .querySelectorAll(".quick-filters-grid .button-6")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.filter;
          const isActive = button.classList.contains("active");

          // Toggle active state
          button.classList.toggle("active");

          // Update opacity based on active state
          button.style.opacity = button.classList.contains("active")
            ? "1"
            : "0.33";

          // Update filters array
          if (!isActive) {
            this.selectedFilters.quickFilters.push(filter);
          } else {
            this.selectedFilters.quickFilters =
              this.selectedFilters.quickFilters.filter((f) => f !== filter);
          }

          this.updateURLFromFilters();
          this.applyFilters();
        });
      });
  }

  setupResetButton() {
    const resetButton = document.querySelector(".reset-filters");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        // Reset all filter selections
        this.selectedFilters = {
          location: [],
          type: [],
          bedrooms: [],
          price: [],
          quickFilters: [],
        };

        // Reset all filter UI elements
        document.querySelectorAll(".vscomp-option").forEach((option) => {
          if (!option.classList.contains("group-title")) {
            option.classList.remove("selected");
          }
        });

        // Reset all quick filter buttons
        document
          .querySelectorAll(".quick-filters-grid .button-6")
          .forEach((button) => {
            button.classList.remove("active");
            button.style.opacity = "0.33";
          });

        // Reset search inputs
        document.querySelectorAll(".filter-search").forEach((input) => {
          input.value = "";
        });

        // Update URL and apply filters
        this.updateURLFromFilters();
        this.applyFilters();
      });
    }
  }

  setupSearchFilters() {
    const searchInputs = document.querySelectorAll(".filter-search");
    searchInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        // Close all other filters
        document.querySelectorAll(".form-group").forEach((group) => {
          if (group !== input.closest(".form-group")) {
            group.classList.remove("active");
          }
        });
        // Open current filter
        const formGroup = input.closest(".form-group");
        formGroup.classList.add("active");
      });

      input.addEventListener("input", (e) => {
        const filterType = e.target.dataset.filter;
        const searchTerm = e.target.value.toLowerCase();
        this.filterOptions(filterType, searchTerm);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".form-group")) {
        document.querySelectorAll(".form-group").forEach((group) => {
          group.classList.remove("active");
        });
      }
    });
  }

  filterOptions(filterType, searchTerm) {
    const options = document.querySelectorAll(
      `.vscomp-options[data-filter="${filterType}"] .vscomp-option`
    );
    options.forEach((option) => {
      if (option.classList.contains("group-title")) return;

      const text = option
        .querySelector(".vscomp-option-text")
        .textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        option.classList.remove("hidden");
        option.classList.add("highlighted");
      } else {
        option.classList.add("hidden");
        option.classList.remove("highlighted");
      }
    });
  }

  applyFilters() {
    console.log("Applying filters:", this.selectedFilters);

    this.filteredProperties = this.properties.filter((property) => {
      // Location filter
      if (
        this.selectedFilters.location &&
        this.selectedFilters.location.length > 0 &&
        !this.selectedFilters.location.includes(property.location)
      ) {
        return false;
      }

      // Property type filter
      if (this.selectedFilters.type && this.selectedFilters.type.length > 0) {
        // Extract property type from title or description
        let propertyType = "";
        const title = property.title.toLowerCase();
        const description = property.description.toLowerCase();

        if (title.includes("villa") || description.includes("villa")) {
          propertyType = "villa";
        } else if (
          title.includes("apartment") ||
          description.includes("apartment")
        ) {
          propertyType = "apartment";
        } else if (title.includes("house") || description.includes("house")) {
          propertyType = "house";
        } else if (title.includes("land") || description.includes("land")) {
          propertyType = "land";
        } else if (
          title.includes("penthouse") ||
          description.includes("penthouse")
        ) {
          propertyType = "penthouse";
        }

        // If we couldn't determine the property type, skip this filter
        if (!propertyType) {
          return true;
        }

        // Check if the property type is in the selected filters
        if (!this.selectedFilters.type.includes(propertyType)) {
          return false;
        }
      }

      // Bedrooms filter
      if (
        this.selectedFilters.bedrooms &&
        this.selectedFilters.bedrooms.length > 0
      ) {
        const propertyBedrooms = property.bedrooms.toString();
        const matchesBedrooms = this.selectedFilters.bedrooms.some((filter) => {
          if (filter.includes("+")) {
            const minBedrooms = parseInt(filter);
            return parseInt(propertyBedrooms) >= minBedrooms;
          } else {
            return propertyBedrooms === filter;
          }
        });
        if (!matchesBedrooms) return false;
      }

      // Price filter
      if (this.selectedFilters.price && this.selectedFilters.price.length > 0) {
        const propertyPrice = parseInt(property.price.replace(/[^0-9]/g, ""));
        const matchesPrice = this.selectedFilters.price.some((range) => {
          if (range.includes("+")) {
            const minPrice = parseInt(range);
            return propertyPrice >= minPrice;
          } else {
            const [min, max] = range.split("-").map(Number);
            return propertyPrice >= min && propertyPrice <= max;
          }
        });
        if (!matchesPrice) return false;
      }

      // Quick filters
      if (
        this.selectedFilters.quickFilters &&
        this.selectedFilters.quickFilters.length > 0
      ) {
        return this.selectedFilters.quickFilters.every((filter) => {
          return property.features?.includes(filter);
        });
      }

      return true;
    });

    console.log("Filtered properties:", this.filteredProperties.length);

    // Update the display
    this.renderPropertyListings();
    this.map.updateMarkers(this.filteredProperties);
  }

  renderPropertyListings() {
    const container = document.querySelector(".listings-container");
    const countElement = document.querySelector(".listings-count");
    if (!container || !countElement) return;

    // Update property count
    countElement.textContent = `${this.filteredProperties.length} properties found`;

    // Render all properties
    container.innerHTML = this.filteredProperties
      .map(
        (property) => `
          <div class="rs-card" data-property-id="${property.id}">
            <div class="propimg" style="background-image: url(${property.image});">
              <div class="hoverdark">
                <div class="rs-display-middle">View</div>
              </div>
            </div>
            <div class="card-header">
              <div class="rs-row">
                <div class="rs-row">
                  <p class="proptitlecard" title="${property.title}">${property.title}</p>
                  <p class="proptitlecard2" title="${property.location}">${property.location}</p>
                </div>
                <div class="rs-row pricee">
                  <span>${property.price}</span>
                </div>
              </div>
              <div class="rs-row limited_description">${property.description}</div>
              <div class="rs-row pricee2">
                <div class="rs-display-container rs-border-bottom pricee3">
                  <div class="rs-display-left">${property.bedrooms}</div>
                  <div class="rs-display-right">Bedrooms</div>
                </div>
                <div class="rs-display-container rs-border-bottom pricee3">
                  <div class="rs-display-left">${property.bathrooms}</div>
                  <div class="rs-display-right">Bathrooms</div>
                </div>
                <div class="rs-display-container rs-border-bottom pricee3">
                  <div class="rs-display-left">${property.area}</div>
                  <div class="rs-display-right">sq ft</div>
                </div>
                <div class="rs-display-container rs-border-bottom pricee3">
                  <div class="rs-display-left">${property.id}</div>
                  <div class="rs-display-right">ref. id</div>
                </div>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }

  setupEventListeners() {
    const container = document.querySelector(".listings-container");
    if (!container) return;

    container.addEventListener("click", (e) => {
      const propertyCard = e.target.closest(".rs-card");
      if (propertyCard) {
        const propertyId = parseInt(propertyCard.dataset.propertyId);
        const property = this.filteredProperties.find(
          (p) => p.id === propertyId
        );
        if (property) {
          this.map.highlightProperty(propertyId);
        }
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PropertyFilters();
});

// Group Selection Handler for both Property Types and Locations
document.addEventListener("DOMContentLoaded", function () {
  // Handle all vscomp-options containers
  const optionsContainers = document.querySelectorAll(".vscomp-options");
  if (!optionsContainers.length) return;

  optionsContainers.forEach((container) => {
    // Handle group title clicks
    container.addEventListener("click", function (e) {
      const option = e.target.closest(".vscomp-option");
      if (!option) return;

      const isGroupTitle = option.classList.contains("group-title");
      if (!isGroupTitle) return;

      const groupValue = option.getAttribute("data-value");
      const isSelected = option.classList.contains("selected");

      // Toggle selection state
      option.classList.toggle("selected");

      // Get all options in this group
      const groupOptions = container.querySelectorAll(
        `.${groupValue.replace("-group", "-option")}`
      );

      // Update all options in the group
      groupOptions.forEach((groupOption) => {
        if (isSelected) {
          groupOption.classList.remove("selected");
        } else {
          groupOption.classList.add("selected");
        }
      });

      // Update group title checkbox state
      const checkbox = option.querySelector(".checkbox-icon");
      if (checkbox) {
        checkbox.style.backgroundColor = isSelected ? "" : "#3b82f6";
        checkbox.style.borderColor = isSelected ? "#d1d5db" : "#3b82f6";
      }
    });

    // Handle individual option clicks
    container.addEventListener("click", function (e) {
      const option = e.target.closest(".vscomp-option");
      if (!option || option.classList.contains("group-title")) return;

      const isSelected = option.classList.contains("selected");
      option.classList.toggle("selected");

      // Update checkbox state
      const checkbox = option.querySelector(".checkbox-icon");
      if (checkbox) {
        checkbox.style.backgroundColor = isSelected ? "" : "#3b82f6";
        checkbox.style.borderColor = isSelected ? "#d1d5db" : "#3b82f6";
      }

      // Check if all options in the group are selected
      const groupClass = Array.from(option.classList)
        .find((cls) => cls.endsWith("-option"))
        .replace("-option", "-group");

      const groupTitle = container.querySelector(
        `[data-value="${groupClass}"]`
      );
      if (groupTitle) {
        const allGroupOptions = container.querySelectorAll(
          `.${option.classList[1]}`
        );
        const allSelected = Array.from(allGroupOptions).every((opt) =>
          opt.classList.contains("selected")
        );

        groupTitle.classList.toggle("selected", allSelected);
        const groupCheckbox = groupTitle.querySelector(".checkbox-icon");
        if (groupCheckbox) {
          groupCheckbox.style.backgroundColor = allSelected ? "#3b82f6" : "";
          groupCheckbox.style.borderColor = allSelected ? "#3b82f6" : "#d1d5db";
        }
      }
    });
  });
});
