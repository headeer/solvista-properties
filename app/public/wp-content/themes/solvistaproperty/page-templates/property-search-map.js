// Property Search Map Script
console.log('Property Search Map Script loaded');

// Check if already initialized to prevent double initialization
if (window?.searchByMapInitialized) {
  console.log('SearchByMap already initialized, skipping');
} else {
  window.searchByMapInitialized = true;
  console.log('initializing');

  // API Configuration
  const API_CONFIG = {
    baseUrl: '/wp-json/solvista/v1',
    endpoints: {
      properties: '/properties',
      filters: '/filters'
    }
  };

  // Fallback data for when API is not available
  const FALLBACK_DATA = {
    properties: [
      {
        id: 1,
        title: "Luxury Villa with Sea View",
        price: "€750,000",
        location: "Benalmádena",
        latitude: 36.5977,
        longitude: -4.5688,
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: 2,
        title: "Modern Apartment in City Center",
        price: "€250,000",
        location: "Fuengirola",
        latitude: 36.5393,
        longitude: -4.6247,
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: 3,
        title: "Country House with Garden",
        price: "€450,000",
        location: "Coín",
        latitude: 36.6596,
        longitude: -4.7584,
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: 4,
        title: "Penthouse with Terrace",
        price: "€550,000",
        location: "Torremolinos",
        latitude: 36.6203,
        longitude: -4.4998,
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: 5,
        title: "Beachfront Apartment",
        price: "€350,000",
        location: "Mijas",
        latitude: 36.5958,
        longitude: -4.6374,
        bedrooms: 2,
        bathrooms: 1,
        area: 90,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ],
    filters: {
      propertyType: [
        { value: "apartment", label: "Apartment" },
        { value: "villa", label: "Villa" },
        { value: "house", label: "House" },
        { value: "penthouse", label: "Penthouse" }
      ],
      bedrooms: [
        { value: "1", label: "1 Bedroom" },
        { value: "2", label: "2 Bedrooms" },
        { value: "3", label: "3 Bedrooms" },
        { value: "4", label: "4+ Bedrooms" }
      ],
      priceRange: [
        { value: "0-200000", label: "Up to €200,000" },
        { value: "200000-400000", label: "€200,000 - €400,000" },
        { value: "400000-600000", label: "€400,000 - €600,000" },
        { value: "600000-1000000", label: "€600,000 - €1,000,000" },
        { value: "1000000-999999999", label: "€1,000,000+" }
      ]
    }
  };

  // SearchByMap Class
  class SearchByMap {
    constructor() {
      this.map = null;
      this.markers = [];
      this.markerCluster = null;
      this.properties = [];
      this.currentPage = 1;
      this.totalPages = 1;
      this.filters = {};
      this.highlightedProperty = null;
      this.propertyMarkers = {}; // Store markers by property ID
      this.init();
    }

    init() {
      console.log('Initializing SearchByMap');
      
      // Check if map is already initialized
      if (this.map) {
        console.log('Map already initialized');
        return;
      }

      // Get map container
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }

      // Check if map container is already initialized with Leaflet
      if (mapContainer._leaflet_id) {
        console.log('Map container already initialized with Leaflet');
        return;
      }

      // Initialize map
      this.map = L.map('map').setView([36.7213, -4.4217], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Initialize marker cluster group
      try {
        this.markerCluster = L.markerClusterGroup();
        this.map.addLayer(this.markerCluster);
      } catch (error) {
        console.error('Error initializing marker cluster:', error);
      }

      // Load properties
      this.loadProperties();
      
      // Initialize filter functionality
      this.initializeFilters();
    }

    async loadProperties() {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}?filters=${JSON.stringify(this.filters)}&page=${this.currentPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        
        if (data.error) {
          console.error('API Error:', data.error);
          return;
        }

        this.properties = data.properties;
        this.totalPages = data.total_pages;
        
        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
        
        // Display properties
        this.displayProperties();
        
        // Update property count
        const countElement = document.querySelector('.listings-count');
        if (countElement) {
          countElement.textContent = `${data.total} properties found`;
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    }

    applyFiltersToProperties() {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Create a copy of the properties to filter
      let filteredProperties = [...this.properties];
      
      // Apply each filter
      for (const [key, value] of urlParams.entries()) {
        const filterValues = value.split(',');
        
        // Filter properties based on the filter values
        filteredProperties = filteredProperties.filter(property => {
          // Check if the property has the filter field
          if (property[key] !== undefined) {
            // If the property value is an array, check if any of the filter values are in it
            if (Array.isArray(property[key])) {
              return filterValues.some(filterValue => property[key].includes(filterValue));
            }
            // Otherwise, check if the property value matches any of the filter values
            return filterValues.includes(property[key].toString());
          }
          return false;
        });
      }
      
      // Update the properties with the filtered results
      this.properties = filteredProperties;
    }

    displayProperties() {
      console.log('Displaying properties');
      
      // Clear existing markers
      if (this.markerCluster) {
        this.markerCluster.clearLayers();
      }
      this.markers = [];
      this.propertyMarkers = {};

      // Check if properties is an array
      if (!Array.isArray(this.properties)) {
        console.error('Properties is not an array:', this.properties);
        this.properties = FALLBACK_DATA.properties;
      }

      // Get the property listing section
      const propertyListingSection = document.querySelector('.property-listing-section');
      if (!propertyListingSection) {
        console.error('Property listing section not found');
        return;
      }

      // Clear existing property cards
      propertyListingSection.innerHTML = '';
      
      // Add property count header
      const propertyCountHeader = document.createElement('div');
      propertyCountHeader.className = 'property-count-header';
      propertyCountHeader.innerHTML = `
        <h3>Properties Found: ${this.properties.length}</h3>
      `;
      propertyListingSection.appendChild(propertyCountHeader);

      // Add markers for each property and create property cards
      this.properties.forEach(property => {
        // Create marker
        const marker = this.createMarker(property);
        this.markers.push(marker);
        this.propertyMarkers[property.id] = marker;
        
        if (this.markerCluster) {
          this.markerCluster.addLayer(marker);
        }

        // Create property card
        this.createPropertyCard(property, propertyListingSection);
      });

      // Fit map bounds to show all markers
      this.fitMapBounds();
    }

    createPropertyCard(property, container) {
      const propertyCard = document.createElement('div');
      propertyCard.className = 'property-card';
      propertyCard.setAttribute('data-id', property.id);
      
      propertyCard.innerHTML = `
        <div class="property-image">
          <img src="${property.image}" alt="${property.title}">
        </div>
        <div class="property-details">
          <h3 class="property-title">${property.title}</h3>
          <p class="property-price">${property.price}</p>
          <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
          <div class="property-features">
            <span><i class="fas fa-bed"></i> ${property.bedrooms}</span>
            <span><i class="fas fa-bath"></i> ${property.bathrooms}</span>
            <span><i class="fas fa-ruler-combined"></i> ${property.area}m²</span>
          </div>
        </div>
      `;
      
      // Add click event listener
      propertyCard.addEventListener('click', () => {
        this.highlightProperty(property.id);
        this.zoomToProperty(property.id);
      });
      
      // Add to container
      container.appendChild(propertyCard);
    }

    createMarker(property) {
      const marker = L.marker([property.latitude, property.longitude], {
        icon: this.createCustomIcon()
      });

      const popup = this.createPopup(property);
      marker.bindPopup(popup);

      marker.on('click', () => {
        this.highlightProperty(property.id);
        this.zoomToProperty(property.id);
      });

      return marker;
    }

    createCustomIcon() {
      return L.divIcon({
        className: 'custom-marker',
        html: '<i class="fas fa-home"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });
    }

    createPopup(property) {
      const popupContent = `
        <div class="property-popup">
          <div class="property-popup-content">
            <h3>${property.title}</h3>
            <p class="price">${property.price}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <div class="features">
              <span><i class="fas fa-bed"></i> ${property.bedrooms}</span>
              <span><i class="fas fa-bath"></i> ${property.bathrooms}</span>
              <span><i class="fas fa-ruler-combined"></i> ${property.area}m²</span>
            </div>
            <div class="popup-actions">
              <button class="view-details-btn" onclick="window.searchByMap.viewPropertyDetails(${property.id})">
                View Details
              </button>
            </div>
          </div>
        </div>
      `;

      return L.popup({
        className: 'property-popup',
        maxWidth: 220,
        closeButton: true
      }).setContent(popupContent);
    }

    highlightProperty(propertyId) {
      console.log('Highlighting property:', propertyId);
      
      // Remove highlight from previously highlighted property
      if (this.highlightedProperty) {
        const prevCard = document.querySelector(`.property-card[data-id="${this.highlightedProperty}"]`);
        if (prevCard) {
          prevCard.classList.remove('highlight');
        }
      }

      // Add highlight to new property
      const card = document.querySelector(`.property-card[data-id="${propertyId}"]`);
      if (card) {
        card.classList.add('highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Update highlighted property
      this.highlightedProperty = propertyId;

      // Find and open popup for the property's marker
      const marker = this.propertyMarkers[propertyId];
      if (marker) {
        marker.openPopup();
      }
    }

    zoomToProperty(propertyId) {
      console.log('Zooming to property:', propertyId);
      
      const property = this.properties.find(p => p.id === propertyId);
      if (property) {
        // Zoom to property location
        this.map.setView([property.latitude, property.longitude], 15);
        
        // Open popup
        const marker = this.propertyMarkers[propertyId];
        if (marker) {
          marker.openPopup();
        }
      }
    }

    viewPropertyDetails(propertyId) {
      console.log('Viewing property details:', propertyId);
      
      // Find property card
      const card = document.querySelector(`.property-card[data-id="${propertyId}"]`);
      if (card) {
        // Scroll to card
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add temporary highlight
        card.classList.add('highlight');
        setTimeout(() => {
          card.classList.remove('highlight');
        }, 2000);
      }

      // Close popup
      this.map.closePopup();
    }

    fitMapBounds() {
      console.log('Fitting map bounds');
      
      // If a property is highlighted, don't fit bounds
      if (this.highlightedProperty) {
        return;
      }

      // Fit bounds to show all markers with padding
      if (this.markers.length > 0) {
        const group = L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds(), {
          padding: [50, 50]
        });
      }
    }
    
    initializeFilters() {
      console.log('Initializing filters');
      
      // Add event listeners to filter elements
      const filterElements = document.querySelectorAll('.filter-element');
      filterElements.forEach(element => {
        element.addEventListener('change', (e) => {
          this.updateFilter(e.target.name, e.target.value);
        });
      });
      
      // Add event listeners to quick selection buttons
      const quickSelectionButtons = document.querySelectorAll('.quick-selection button');
      quickSelectionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.toggleQuickSelection(e.target);
        });
      });
      
      // Add event listeners to filter toggles
      const filterToggles = document.querySelectorAll('.filter-toggle');
      filterToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          this.toggleFilter(e.target);
        });
      });
    }
    
    toggleQuickSelection(button) {
      console.log('Toggling quick selection:', button);
      
      // Toggle active class
      button.classList.toggle('active');
      
      // Get filter name and value
      const filterName = button.getAttribute('data-filter');
      const filterValue = button.getAttribute('data-value');
      
      if (button.classList.contains('active')) {
        // Apply filter
        this.updateFilter(filterName, filterValue);
      } else {
        // Remove filter
        this.updateFilter(filterName, '');
      }
    }
    
    toggleFilter(toggle) {
      console.log('Toggling filter:', toggle);
      
      // Toggle active class
      toggle.classList.toggle('active');
      
      // Get filter container
      const filterContainer = toggle.nextElementSibling;
      if (filterContainer) {
        // Toggle visibility
        if (toggle.classList.contains('active')) {
          filterContainer.style.display = 'block';
        } else {
          filterContainer.style.display = 'none';
        }
      }
    }
    
    updateFilter(name, value) {
      if (value === null || value === '') {
        delete this.filters[name];
      } else {
        this.filters[name] = value;
      }
      this.applyFilters();
    }
    
    applyFilters() {
      // Reset to first page when applying new filters
      this.currentPage = 1;
      
      // Update URL with current filters
      const urlParams = new URLSearchParams();
      Object.entries(this.filters).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value);
        }
      });
      
      // Update browser URL without reloading the page
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.pushState({}, '', newUrl);
      
      // Load properties with new filters
      this.loadProperties();
    }
  }

  // PropertyFilters Class
  class PropertyFilters {
    constructor() {
      this.filters = {
        propertyType: [],
        location: [],
        bedrooms: [],
        bathrooms: [],
        priceRange: {
          min: 0,
          max: 1000000
        }
      };
      this.quickFilters = {
        featured: false,
        new: false,
        reduced: false
      };
      this.init();
    }

    init() {
      this.loadFilterOptions();
      this.setupFilterEventListeners();
      this.setupQuickFilterEventListeners();
      this.loadFromQueryParams();
    }

    setupFilterEventListeners() {
      // Property Type Filter
      const propertyTypeFilter = document.getElementById('property-type-filter');
      if (propertyTypeFilter) {
        propertyTypeFilter.addEventListener('change', (e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
          this.filters.propertyType = selectedOptions;
          this.applyFilters();
        });
      }

      // Location Filter
      const locationFilter = document.getElementById('location-filter');
      if (locationFilter) {
        locationFilter.addEventListener('change', (e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
          this.filters.location = selectedOptions;
          this.applyFilters();
        });
      }

      // Bedrooms Filter
      const bedroomsFilter = document.getElementById('bedrooms-filter');
      if (bedroomsFilter) {
        bedroomsFilter.addEventListener('change', (e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
          this.filters.bedrooms = selectedOptions;
          this.applyFilters();
        });
      }

      // Bathrooms Filter
      const bathroomsFilter = document.getElementById('bathrooms-filter');
      if (bathroomsFilter) {
        bathroomsFilter.addEventListener('change', (e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
          this.filters.bathrooms = selectedOptions;
          this.applyFilters();
        });
      }

      // Price Range Filter
      const minPriceFilter = document.getElementById('min-price-filter');
      const maxPriceFilter = document.getElementById('max-price-filter');
      
      if (minPriceFilter && maxPriceFilter) {
        minPriceFilter.addEventListener('change', () => {
          this.filters.priceRange.min = parseInt(minPriceFilter.value) || 0;
          this.applyFilters();
        });
        
        maxPriceFilter.addEventListener('change', () => {
          this.filters.priceRange.max = parseInt(maxPriceFilter.value) || 1000000;
          this.applyFilters();
        });
      }

      // Custom checkbox event listeners
      document.querySelectorAll('.vscomp-option').forEach(option => {
        option.addEventListener('click', (e) => {
          const checkbox = option.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            this.updateFilterFromCheckbox(checkbox);
          }
        });
      });
    }

    updateFilterFromCheckbox(checkbox) {
      const filterType = checkbox.getAttribute('data-filter-type');
      const value = checkbox.value;
      
      if (filterType === 'propertyType') {
        if (checkbox.checked) {
          if (!this.filters.propertyType.includes(value)) {
            this.filters.propertyType.push(value);
          }
        } else {
          this.filters.propertyType = this.filters.propertyType.filter(v => v !== value);
        }
      } else if (filterType === 'location') {
        if (checkbox.checked) {
          if (!this.filters.location.includes(value)) {
            this.filters.location.push(value);
          }
        } else {
          this.filters.location = this.filters.location.filter(v => v !== value);
        }
      } else if (filterType === 'bedrooms') {
        if (checkbox.checked) {
          if (!this.filters.bedrooms.includes(value)) {
            this.filters.bedrooms.push(value);
          }
        } else {
          this.filters.bedrooms = this.filters.bedrooms.filter(v => v !== value);
        }
      } else if (filterType === 'bathrooms') {
        if (checkbox.checked) {
          if (!this.filters.bathrooms.includes(value)) {
            this.filters.bathrooms.push(value);
          }
        } else {
          this.filters.bathrooms = this.filters.bathrooms.filter(v => v !== value);
        }
      }
      
      this.applyFilters();
    }

    setupQuickFilterEventListeners() {
      const quickFilterButtons = document.querySelectorAll('.quick-selection button');
      quickFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filterType = button.getAttribute('data-filter');
          if (filterType) {
            this.quickFilters[filterType] = !this.quickFilters[filterType];
            button.classList.toggle('active');
            this.applyFilters();
          }
        });
      });
    }

    applyFilters() {
      // Update URL query parameters
      this.updateQueryParams();
      
      // Filter properties based on current filters
      const filteredProperties = this.filterProperties(window.searchByMap.properties);
      
      // Update property count
      this.updatePropertyCount(filteredProperties.length);
      
      // Display filtered properties
      window.searchByMap.displayProperties(filteredProperties);
    }

    filterProperties(properties) {
      return properties.filter(property => {
        // Property Type Filter
        if (this.filters.propertyType.length > 0 && !this.filters.propertyType.includes(property.type)) {
          return false;
        }
        
        // Location Filter
        if (this.filters.location.length > 0 && !this.filters.location.includes(property.location)) {
          return false;
        }
        
        // Bedrooms Filter
        if (this.filters.bedrooms.length > 0 && !this.filters.bedrooms.includes(property.bedrooms.toString())) {
          return false;
        }
        
        // Bathrooms Filter
        if (this.filters.bathrooms.length > 0 && !this.filters.bathrooms.includes(property.bathrooms.toString())) {
          return false;
        }
        
        // Price Range Filter
        const price = parseInt(property.price.replace(/[^0-9]/g, ''));
        
        // Check if any price filter is selected
        const priceFilters = document.querySelectorAll('.price-filter input[type="checkbox"]:checked');
        if (priceFilters.length > 0) {
          // Get the minimum price from all selected price filters
          let minSelectedPrice = 0;
          priceFilters.forEach(filter => {
            const filterValue = parseInt(filter.value);
            if (filterValue > minSelectedPrice) {
              minSelectedPrice = filterValue;
            }
          });
          
          // Show properties with price equal to or above the minimum selected price
          if (price < minSelectedPrice) {
            return false;
          }
        } else {
          // If no price filter is selected, apply the min/max range
          if (this.filters.priceRange.min > 0 && price < this.filters.priceRange.min) {
            return false;
          }
          if (this.filters.priceRange.max < 1000000 && price > this.filters.priceRange.max) {
            return false;
          }
        }
        
        // Quick Filters
        if (this.quickFilters.featured && !property.featured) {
          return false;
        }
        
        if (this.quickFilters.new && !property.isNew) {
          return false;
        }
        
        if (this.quickFilters.reduced && !property.reduced) {
          return false;
        }
        
        return true;
      });
    }

    updateQueryParams() {
      const params = new URLSearchParams();
      
      // Add property type filters
      if (this.filters.propertyType.length > 0) {
        params.set('propertyType', this.filters.propertyType.join(','));
      }
      
      // Add location filters
      if (this.filters.location.length > 0) {
        params.set('location', this.filters.location.join(','));
      }
      
      // Add bedrooms filters
      if (this.filters.bedrooms.length > 0) {
        params.set('bedrooms', this.filters.bedrooms.join(','));
      }
      
      // Add bathrooms filters
      if (this.filters.bathrooms.length > 0) {
        params.set('bathrooms', this.filters.bathrooms.join(','));
      }
      
      // Add price range
      if (this.filters.priceRange.min > 0) {
        params.set('minPrice', this.filters.priceRange.min.toString());
      }
      
      if (this.filters.priceRange.max < 1000000) {
        params.set('maxPrice', this.filters.priceRange.max.toString());
      }
      
      // Add quick filters
      if (this.quickFilters.featured) {
        params.set('featured', 'true');
      }
      
      if (this.quickFilters.new) {
        params.set('new', 'true');
      }
      
      if (this.quickFilters.reduced) {
        params.set('reduced', 'true');
      }
      
      // Update URL without reloading the page
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState({}, '', newUrl);
    }

    loadFromQueryParams() {
      const params = new URLSearchParams(window.location.search);
      
      // Load property type filters
      const propertyType = params.get('propertyType');
      if (propertyType) {
        this.filters.propertyType = propertyType.split(',');
        this.updateCheckboxes('propertyType', this.filters.propertyType);
      }
      
      // Load location filters
      const location = params.get('location');
      if (location) {
        this.filters.location = location.split(',');
        this.updateCheckboxes('location', this.filters.location);
      }
      
      // Load bedrooms filters
      const bedrooms = params.get('bedrooms');
      if (bedrooms) {
        this.filters.bedrooms = bedrooms.split(',');
        this.updateCheckboxes('bedrooms', this.filters.bedrooms);
      }
      
      // Load bathrooms filters
      const bathrooms = params.get('bathrooms');
      if (bathrooms) {
        this.filters.bathrooms = bathrooms.split(',');
        this.updateCheckboxes('bathrooms', this.filters.bathrooms);
      }
      
      // Load price range
      const minPrice = params.get('minPrice');
      if (minPrice) {
        this.filters.priceRange.min = parseInt(minPrice);
        const minPriceFilter = document.getElementById('min-price-filter');
        if (minPriceFilter) {
          minPriceFilter.value = minPrice;
        }
      }
      
      const maxPrice = params.get('maxPrice');
      if (maxPrice) {
        this.filters.priceRange.max = parseInt(maxPrice);
        const maxPriceFilter = document.getElementById('max-price-filter');
        if (maxPriceFilter) {
          maxPriceFilter.value = maxPrice;
        }
      }
      
      // Load quick filters
      const featured = params.get('featured');
      if (featured === 'true') {
        this.quickFilters.featured = true;
        this.updateQuickFilterButton('featured', true);
      }
      
      const newProperty = params.get('new');
      if (newProperty === 'true') {
        this.quickFilters.new = true;
        this.updateQuickFilterButton('new', true);
      }
      
      const reduced = params.get('reduced');
      if (reduced === 'true') {
        this.quickFilters.reduced = true;
        this.updateQuickFilterButton('reduced', true);
      }
      
      // Apply filters if any are loaded
      if (propertyType || location || bedrooms || bathrooms || minPrice || maxPrice || featured || newProperty || reduced) {
        this.applyFilters();
      }
    }

    updateCheckboxes(filterType, selectedValues) {
      document.querySelectorAll(`input[data-filter-type="${filterType}"]`).forEach(checkbox => {
        checkbox.checked = selectedValues.includes(checkbox.value);
      });
    }

    updateQuickFilterButton(filterType, isActive) {
      const button = document.querySelector(`.quick-selection button[data-filter="${filterType}"]`);
      if (button) {
        if (isActive) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      }
    }

    updatePropertyCount(count) {
      const countElement = document.querySelector('.property-count');
      if (countElement) {
        countElement.textContent = `${count} Properties Found`;
      }
    }

    loadFilterOptions() {
      // Use fallback data for filter options
      const filterOptions = FALLBACK_DATA.filterOptions;
      
      // Populate property type filter
      const propertyTypeFilter = document.getElementById('property-type-filter');
      if (propertyTypeFilter) {
        propertyTypeFilter.innerHTML = '';
        
        // Add parent options
        filterOptions.propertyTypes.forEach(type => {
          const option = document.createElement('option');
          option.value = type.id;
          option.textContent = type.name;
          option.setAttribute('data-parent', '0');
          propertyTypeFilter.appendChild(option);
          
          // Add child options
          if (type.children && type.children.length > 0) {
            type.children.forEach(child => {
              const childOption = document.createElement('option');
              childOption.value = child.id;
              childOption.textContent = `— ${child.name}`;
              childOption.setAttribute('data-parent', type.id);
              propertyTypeFilter.appendChild(childOption);
            });
          }
        });
      }
      
      // Populate location filter
      const locationFilter = document.getElementById('location-filter');
      if (locationFilter) {
        locationFilter.innerHTML = '';
        
        // Add parent options
        filterOptions.locations.forEach(location => {
          const option = document.createElement('option');
          option.value = location.id;
          option.textContent = location.name;
          option.setAttribute('data-parent', '0');
          locationFilter.appendChild(option);
          
          // Add child options
          if (location.children && location.children.length > 0) {
            location.children.forEach(child => {
              const childOption = document.createElement('option');
              childOption.value = child.id;
              childOption.textContent = `— ${child.name}`;
              childOption.setAttribute('data-parent', location.id);
              locationFilter.appendChild(childOption);
            });
          }
        });
      }
      
      // Populate bedrooms filter
      const bedroomsFilter = document.getElementById('bedrooms-filter');
      if (bedroomsFilter) {
        bedroomsFilter.innerHTML = '';
        filterOptions.bedrooms.forEach(bedroom => {
          const option = document.createElement('option');
          option.value = bedroom.id;
          option.textContent = bedroom.name;
          bedroomsFilter.appendChild(option);
        });
      }
      
      // Populate bathrooms filter
      const bathroomsFilter = document.getElementById('bathrooms-filter');
      if (bathroomsFilter) {
        bathroomsFilter.innerHTML = '';
        filterOptions.bathrooms.forEach(bathroom => {
          const option = document.createElement('option');
          option.value = bathroom.id;
          option.textContent = bathroom.name;
          bathroomsFilter.appendChild(option);
        });
      }
      
      // Set up custom checkboxes for multi-select
      this.setupCustomCheckboxes();
    }

    setupCustomCheckboxes() {
      // Create custom checkboxes for property type filter
      this.createCustomCheckboxes('property-type-filter', 'propertyType');
      
      // Create custom checkboxes for location filter
      this.createCustomCheckboxes('location-filter', 'location');
      
      // Create custom checkboxes for bedrooms filter
      this.createCustomCheckboxes('bedrooms-filter', 'bedrooms');
      
      // Create custom checkboxes for bathrooms filter
      this.createCustomCheckboxes('bathrooms-filter', 'bathrooms');
    }

    createCustomCheckboxes(selectId, filterType) {
      const select = document.getElementById(selectId);
      if (!select) return;
      
      const container = document.createElement('div');
      container.className = 'vscomp-options';
      container.setAttribute('data-filter-type', filterType);
      
      const options = Array.from(select.options);
      const groupedOptions = {};
      
      options.forEach(option => {
        const parentId = option.getAttribute('data-parent') || '0';
        if (!groupedOptions[parentId]) {
          groupedOptions[parentId] = [];
        }
        groupedOptions[parentId].push(option);
      });
      
      Object.keys(groupedOptions).forEach(parentId => {
        const parentOptions = groupedOptions[parentId];
        
        if (parentId !== '0') {
          const parentOption = options.find(opt => opt.value === parentId);
          if (parentOption) {
            const parentElement = document.createElement('div');
            parentElement.className = 'vscomp-option group-title';
            parentElement.textContent = parentOption.textContent;
            container.appendChild(parentElement);
          }
        }
        
        parentOptions.forEach(option => {
          if (option.getAttribute('data-parent') !== '0') {
            const optionElement = document.createElement('div');
            optionElement.className = 'vscomp-option';
            optionElement.setAttribute('data-value', option.value);
            
            const checkbox = createCheckbox(
              `${filterType}-${option.value}`,
              option.textContent.replace('— ', '')
            );
            
            optionElement.appendChild(checkbox);
            container.appendChild(optionElement);
          }
        });
      });
      
      select.style.display = 'none';
      select.parentNode.insertBefore(container, select.nextSibling);
    }
  }

  // Define toggleSelect function globally
  window.toggleSelect = function(element) {
    console.log('Toggle select clicked:', element);
    
    // Test API call
    fetch('/wp-json/solvista/v1/properties')
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
    
    // Close all other dropdowns first
    document.querySelectorAll('.select-dropdown').forEach(dropdown => {
      if (dropdown !== element.nextElementSibling) {
        dropdown.style.display = 'none';
        dropdown.classList.remove('active');
        const otherHeader = dropdown.previousElementSibling;
        if (otherHeader && otherHeader.classList.contains('select-header')) {
          otherHeader.classList.remove('active');
          const otherArrow = otherHeader.querySelector('.select-arrow');
          if (otherArrow) {
            otherArrow.style.transform = '';
          }
        }
      }
    });
    
    // Toggle active class on the header
    element.classList.toggle('active');
    
    // Find the dropdown container - it's the next sibling with class 'select-dropdown'
    const dropdownContainer = element.nextElementSibling;
    if (dropdownContainer && dropdownContainer.classList.contains('select-dropdown')) {
      // Toggle visibility using display property directly
      if (dropdownContainer.style.display === 'block') {
        dropdownContainer.style.display = 'none';
      } else {
        dropdownContainer.style.display = 'block';
      }
      
      // Also toggle the active class for styling
      dropdownContainer.classList.toggle('active');
      
      // Toggle arrow rotation
      const arrow = element.querySelector('.select-arrow');
      if (arrow) {
        arrow.style.transform = dropdownContainer.style.display === 'block' ? 'rotate(180deg)' : '';
      }
    }
  };

  // Update the filterOptions function to handle price values correctly
  window.filterOptions = function(input) {
    const searchText = input.value.toLowerCase();
    const optionsContainer = input.closest('.select-dropdown').querySelector('.options-container');
    const options = optionsContainer.querySelectorAll('.checkbox-wrapper-4');
    
    options.forEach(option => {
        const label = option.querySelector('.cbx span:last-child').textContent.toLowerCase();
        
        // Special handling for price values
        if (input.closest('.price-filter')) {
            // Extract numeric value from price text (e.g., "€ 50,000" -> "50000")
            const priceText = label.replace(/[^0-9]/g, '');
            const priceValue = parseInt(priceText, 10);
            
            if (label.includes(searchText) || priceText.includes(searchText)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        } else {
            // Standard text search for other filters
            if (label.includes(searchText)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        }
    });
  };

  // Function to create a checkbox with the new style
  function createCheckbox(id, label, checked = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'checkbox-wrapper-4';
    
    const input = document.createElement('input');
    input.className = 'inp-cbx';
    input.id = id;
    input.type = 'checkbox';
    input.checked = checked;
    input.setAttribute('data-filter-type', id.split('-')[0]);
    input.value = id.split('-')[1];
    
    const labelElement = document.createElement('label');
    labelElement.className = 'cbx';
    labelElement.htmlFor = id;
    
    const spanCheck = document.createElement('span');
    spanCheck.className = 'checkmark';
    
    const spanLabel = document.createElement('span');
    spanLabel.textContent = label;
    
    labelElement.appendChild(spanCheck);
    labelElement.appendChild(spanLabel);
    
    wrapper.appendChild(input);
    wrapper.appendChild(labelElement);
    
    return wrapper;
  }

  // Function to toggle all children checkboxes
  function toggleAllChildren(checkbox, filterName) {
    const groupItems = checkbox.closest('.option-group').querySelector('.group-items');
    const children = groupItems.querySelectorAll('.inp-cbx');
    
    children.forEach(child => {
      child.checked = checkbox.checked;
    });
    
    window.updateQueryParams();
  }

  // Function to update URL query parameters based on filter selections
  window.updateQueryParams = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get all filter elements
    const filterElements = document.querySelectorAll('.filter-element, .option-group');
    filterElements.forEach(element => {
      const filterName = element.getAttribute('data-filter-name') || element.querySelector('input[type="checkbox"]')?.name;
      if (filterName) {
        // Get selected values
        const selectedValues = [];
        const checkboxes = element.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
          if (checkbox.value !== 'all') {
            selectedValues.push(checkbox.value);
          }
        });
        
        // Update URL parameters
        if (selectedValues.length > 0) {
          urlParams.set(filterName, selectedValues.join(','));
        } else {
          urlParams.delete(filterName);
        }
      }
    });
    
    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
    
    // Dispatch event for API integration
    const event = new CustomEvent('filtersUpdated', {
      detail: {
        filters: Object.fromEntries(urlParams)
      }
    });
    document.dispatchEvent(event);
  };

  // Function to close all open dropdowns
  window.closeAllDropdowns = function() {
    document.querySelectorAll('.select-dropdown').forEach(dropdown => {
      dropdown.style.display = 'none';
      dropdown.classList.remove('active');
    });
    
    document.querySelectorAll('.select-header').forEach(header => {
      header.classList.remove('active');
      const arrow = header.querySelector('.select-arrow');
      if (arrow) {
        arrow.style.transform = '';
      }
    });
  };

  // Function to load filters from URL parameters
  window.loadFiltersFromUrl = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Apply filters from URL parameters
    for (const [key, value] of urlParams.entries()) {
      const filterElement = document.querySelector(`.filter-element[data-filter-name="${key}"]`);
      if (filterElement) {
        const values = value.split(',');
        const checkboxes = filterElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = values.includes(checkbox.value);
        });
      }
    }
  };

  // Initialize classes when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize SearchByMap
    window.searchByMap = new SearchByMap();
    
    // Initialize PropertyFilters
    window.propertyFilters = new PropertyFilters();
    
    // Load filters from URL parameters
    window.loadFiltersFromUrl();
    
    // Add event listeners to select headers
    document.querySelectorAll('.select-header').forEach(header => {
      header.addEventListener('click', function(e) {
        e.stopPropagation();
        window.toggleSelect(this);
      });
    });
    
    // Add event listeners to search inputs
    document.querySelectorAll('.search-box input').forEach(input => {
      input.addEventListener('keyup', function() {
        window.filterOptions(this);
      });
    });
    
    // Add event listeners to "all" checkboxes
    document.querySelectorAll('input[type="checkbox"][id$="-all"]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const filterType = this.id.split('-')[0];
        window.toggleAllChildren(this, filterType);
      });
    });
    
    // Add event listeners to filter checkboxes
    document.querySelectorAll('.filter-element input[type="checkbox"], .option input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        window.updateQueryParams();
      });
    });
    
    // Add event listener to document to close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.select-header') && !e.target.closest('.select-dropdown')) {
        window.closeAllDropdowns();
      }
    });
    
    // Listen for filter updates
    document.addEventListener('filtersUpdated', (e) => {
      console.log('Filters updated:', e.detail.filters);
      if (window.searchByMap) {
        // When API is ready, uncomment this line:
        // window.searchByMap.loadProperties(e.detail.filters);
        
        // For now, just reload properties with current filters
        window.searchByMap.loadProperties();
      }
    });
    
    // Add event listeners to all checkboxes
    document.querySelectorAll('.inp-cbx').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        window.updateQueryParams();
      });
    });
    
    // Test the backend connection
    testBackendConnection();
  });
  
  /**
   * Test function to verify backend connection with the provided API key
   */
  async function testBackendConnection() {
    console.log('Testing backend connection...');
    
    // Using the guaranteed successful API call example from the documentation
    const API_CONFIG = {
      agencyFilterId: '1',
      propertyId: '1023133',
      apiKey: 'f9fe74f5822a04af7e4d5c399e8972474e1c3d15',
      sandbox: 'true'
    };
    
    try {
      // Make a direct API call to the Resales Online API with the guaranteed working parameters
      const response = await fetch(`https://webapi.resales-online.com/V6/SearchProperties?p_agency_filterid=${API_CONFIG.agencyFilterId}&p1=${API_CONFIG.propertyId}&p2=${API_CONFIG.apiKey}&P_sandbox=${API_CONFIG.sandbox}`);
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Backend connection successful:', data);
      
      // Display the results in a test container
      const testContainer = document.createElement('div');
      testContainer.className = 'api-test-results';
      testContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 5px; max-width: 300px; max-height: 200px; overflow: auto; z-index: 9999;';
      
      let resultHtml = '<h4>Backend Connection Test Results</h4>';
      
      if (data.transaction && data.transaction.status === 'success') {
        resultHtml += `<p style="color: green;">Connection successful!</p>`;
        resultHtml += `<p>API Version: ${data.transaction.version || 'N/A'}</p>`;
        resultHtml += `<p>Service: ${data.transaction.service || 'N/A'}</p>`;
        
        if (data.QueryInfo) {
          resultHtml += `<p>Property Count: ${data.QueryInfo.PropertyCount || 'N/A'}</p>`;
          resultHtml += `<p>Current Page: ${data.QueryInfo.CurrentPage || 'N/A'}</p>`;
        }
        
        if (data.Property && data.Property.length > 0) {
          resultHtml += `<p>First property: ${data.Property[0].Reference || 'N/A'}</p>`;
          resultHtml += `<p>Location: ${data.Property[0].Location || 'N/A'}</p>`;
          resultHtml += `<p>Price: ${data.Property[0].Price || 'N/A'} ${data.Property[0].Currency || ''}</p>`;
        }
      } else if (data.error) {
        resultHtml += `<p style="color: red;">Error: ${data.error}</p>`;
      } else {
        resultHtml += `<p style="color: orange;">Unexpected response format</p>`;
        resultHtml += `<p>Response: ${JSON.stringify(data).substring(0, 100)}...</p>`;
      }
      
      resultHtml += '<button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px;">Close</button>';
      testContainer.innerHTML = resultHtml;
      
      document.body.appendChild(testContainer);
      
      return data;
    } catch (error) {
      console.error('Backend connection failed:', error);
      
      // Display error in a test container
      const testContainer = document.createElement('div');
      testContainer.className = 'api-test-results';
      testContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 5px; max-width: 300px; z-index: 9999;';
      testContainer.innerHTML = `
        <h4>Backend Connection Error</h4>
        <p style="color: red;">${error.message}</p>
        <p>Check console for more details.</p>
        <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px;">Close</button>
      `;
      
      document.body.appendChild(testContainer);
      
      return null;
    }
  }
}