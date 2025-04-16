// Property Search Map Script
class SearchByMap {
    constructor(config = {}) {
        this.config = {
            apiUrl: 'https://solvistaproperty.com/wp-json/resales/v1/map-properties',
            hasApiKey: true,
            itemsPerPage: 10,
            defaultLocation: 'Malaga',
            ...config
        };
        this.map = null;
        this.markers = [];
        this.properties = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.isLoading = false;
        this.markerCluster = null;
        this.initialized = false;
        this.filters = {
            location: this.config.defaultLocation,
            propertyType: '',
            minPrice: 0,
            bedrooms: 0,
            bathrooms: 0
        };
        this.tooltipContainer = null;
        this.closeButton = null;

        // Initialize the map when the DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    async initialize() {
        if (this.initialized) {
            return;
        }

        try {
            await this.loadScripts();
            this.initMap();
            this.setupFilterControls();
            this.initializeQuickFilters();
            this.initializeAdvancedFilters();
            this.setupEventListeners();
            await this.loadProperties(1);
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing map:', error);
            const errorContainer = document.getElementById('map-error');
            if (errorContainer) {
                errorContainer.innerHTML = `<p>Error initializing map: ${error.message}</p>`;
                errorContainer.style.display = 'block';
            }
        }
    }

    async loadScripts() {
        return new Promise((resolve, reject) => {
            if (typeof L !== 'undefined') {
                resolve();
                return;
            }

            const leafletCss = document.createElement('link');
            leafletCss.rel = 'stylesheet';
            leafletCss.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
            document.head.appendChild(leafletCss);

            const leafletScript = document.createElement('script');
            leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
            leafletScript.onload = () => {
                const markerClusterCss = document.createElement('link');
                markerClusterCss.rel = 'stylesheet';
                markerClusterCss.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
                document.head.appendChild(markerClusterCss);

                const markerClusterScript = document.createElement('script');
                markerClusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
                markerClusterScript.onload = resolve;
                markerClusterScript.onerror = reject;
                document.body.appendChild(markerClusterScript);
            };
            leafletScript.onerror = reject;
            document.body.appendChild(leafletScript);
        });
    }

    initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            throw new Error('Map container not found');
        }

        // Check if map is already initialized
        if (this.map) {
            return;
        }

        // Initialize map with Costa del Sol coordinates
        this.map = L.map('map', {
            center: L.latLng(36.7213, -4.4217), // Costa del Sol coordinates
            zoom: 12, // Increased initial zoom level
            zoomControl: true,
            minZoom: 8,
            maxZoom: 19, // Increased max zoom for more detail
            crs: L.CRS.EPSG3857 // Explicitly set the coordinate reference system
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Initialize marker cluster group with improved settings
        this.markerCluster = L.markerClusterGroup({
            maxClusterRadius: 40, // Reduced cluster radius for better precision
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 16, // Show individual markers at higher zoom level
            spiderfyDistanceMultiplier: 1.5, // Increase spacing between spiderfied markers
            iconCreateFunction: function(cluster) {
                const childCount = cluster.getChildCount();
                let size = 'small';
                if (childCount > 50) {
                    size = 'large';
                } else if (childCount > 20) {
                    size = 'medium';
                }
                return L.divIcon({
                    html: `<div class="marker-cluster marker-cluster-${size}">
                            <div class="marker-cluster-count">${childCount}</div>
                          </div>`,
                    className: 'marker-cluster',
                    iconSize: new L.Point(40, 40)
                });
            }
        });
        this.map.addLayer(this.markerCluster);

        // Add tooltip container to the map
        this.tooltipContainer = L.DomUtil.create('div', 'property-tooltip');
        this.tooltipContainer.style.display = 'none';
        mapContainer.appendChild(this.tooltipContainer);

        // Add close button to tooltip
        this.closeButton = L.DomUtil.create('button', 'tooltip-close');
        this.closeButton.innerHTML = '×';
        this.tooltipContainer.appendChild(this.closeButton);
        this.closeButton.addEventListener('click', () => {
            this.tooltipContainer.style.display = 'none';
        });

        // Add zoom level change handler
        this.map.on('zoomend', () => {
            const currentZoom = this.map.getZoom();
            if (currentZoom >= 16) {
                this.markerCluster.options.disableClusteringAtZoom = currentZoom;
            } else {
                this.markerCluster.options.disableClusteringAtZoom = 16;
            }
        });
    }

    getRandomSpainCoordinates() {
        // Spain's approximate boundaries
        const minLat = 36.0;
        const maxLat = 44.0;
        const minLng = -9.0;
        const maxLng = 3.0;
        
        return {
            latitude: (Math.random() * (maxLat - minLat) + minLat).toFixed(6),
            longitude: (Math.random() * (maxLng - minLng) + minLng).toFixed(6)
        };
    }

    getApiUrl() {
        const params = new URLSearchParams({
            Location: this.filters.location || '',
            PMin: this.filters.minPrice || 0,
            PMax: this.filters.maxPrice || 1000000,
            PropertyType: this.filters.propertyType || '',
            Beds: this.filters.bedrooms || 0,
            Baths: this.filters.bathrooms || 0
        });

        return `${this.config.apiUrl}?${params.toString()}`;
    }

    async loadProperties(page = 1) {
        this.currentPage = page;
        
        // Show global loader
        const loader = document.querySelector('.global-loader');
        if (loader) {
            loader.classList.add('active');
        }

        try {
            // Build API URL with filter parameters
            const params = new URLSearchParams();
            
            // Only add parameters that have actual values
            if (this.filters.location) {
                const locations = Array.isArray(this.filters.location) ? this.filters.location : [this.filters.location];
                params.set('Location', locations.join(','));
            }
            if (this.filters.minPrice > 0) params.set('PMin', this.filters.minPrice);
            if (this.filters.propertyType) {
                const propertyTypes = Array.isArray(this.filters.propertyType) ? this.filters.propertyType : [this.filters.propertyType];
                params.set('PropertyType', propertyTypes.join(','));
            }
            if (this.filters.bedrooms) {
                const bedrooms = Array.isArray(this.filters.bedrooms) ? this.filters.bedrooms : [this.filters.bedrooms];
                params.set('Beds', bedrooms.join(','));
            }
            if (this.filters.bathrooms) {
                const bathrooms = Array.isArray(this.filters.bathrooms) ? this.filters.bathrooms : [this.filters.bathrooms];
                params.set('Baths', bathrooms.join(','));
            }

            const apiUrl = `${this.config.apiUrl}?${params.toString()}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                throw new Error('API response is not in the expected format');
            }
            
            // Process properties
            this.properties = data.map(property => {
                // Get coordinates if available, otherwise use random Spain coordinates
                let latitude = parseFloat(property.gps_x);
                let longitude = parseFloat(property.gps_y);
                
                console.log('Raw coordinates:', property.gps_x, property.gps_y); // Debug log
                console.log('Parsed coordinates:', latitude, longitude); // Debug log
                
                // Validate coordinates
                if (isNaN(latitude) || isNaN(longitude) || 
                    latitude < -90 || latitude > 90 || 
                    longitude < -180 || longitude > 180) {
                    console.warn(`Invalid coordinates for property ${property.reference}: (${property.gps_x}, ${property.gps_y})`);
                    const randomCoords = this.getRandomSpainCoordinates();
                    latitude = parseFloat(randomCoords.latitude);
                    longitude = parseFloat(randomCoords.longitude);
                    console.log('Using random coordinates:', latitude, longitude); // Debug log
                }
                
                // Ensure coordinates are numbers
                latitude = Number(latitude);
                longitude = Number(longitude);
                
                const processedProperty = {
                    id: property.reference,
                    reference: property.reference,
                    title: `Property ${property.reference}`,
                    price: property.price || 0,
                    location: property.location || 'Location not specified',
                    bedrooms: property.bedrooms || "", // Not provided in the API
                    bathrooms: property.bathrooms || "", // Not provided in the API
                    area: property.area || 'Area not specified',
                    image: property.pictureUrl,
                    status: 'For Sale',
                    propertyType: 'Property',
                    latitude: latitude,
                    longitude: longitude,
                    province: property.province,
                    area: property.area,
                    description: '',
                    features: [],
                    dateAdded: new Date().toISOString(),
                    isFeatured: false,
                    isNew: false,
                    isReduced: false,
                    viewDetails: property.propertyUrl || `/property/${property.reference}`
                };
                return processedProperty;
            });
            
            if (this.properties.length === 0) {
                throw new Error('No properties found');
            }
            
            this.totalPages = Math.ceil(this.properties.length / this.config.itemsPerPage);
            this.displayProperties();
        } catch (error) {
            console.error('Error loading properties:', error);
            const errorContainer = document.getElementById('map-error');
            if (errorContainer) {
                errorContainer.innerHTML = `<p>Error loading properties: ${error.message}</p>`;
                errorContainer.style.display = 'block';
            }
        } finally {
            // Hide global loader
            const loader = document.querySelector('.global-loader');
            if (loader) {
                loader.classList.remove('active');
            }
        }
    }

    displayProperties() {
        // Clear existing markers only if markerCluster is initialized
        if (this.markerCluster) {
            this.markerCluster.clearLayers();
        }
        this.markers = [];

        // Get or create properties container
        let container = document.querySelector('.properties-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'properties-container';
            
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.parentNode.insertBefore(container, mapContainer.nextSibling);
            } else {
                console.error('Map container not found, cannot create properties container');
                return;
            }
        }

        // Create property listing section
        let listingSection = document.querySelector('.property-listing-section');
        if (!listingSection) {
            listingSection = document.createElement('div');
            listingSection.className = 'property-listing-section';
            container.appendChild(listingSection);
        }

        // Clear existing content
        listingSection.innerHTML = '';
        
        // Create header
        const header = document.createElement('h2');
        header.textContent = `${this.properties.length} Properties Found`;
        listingSection.appendChild(header);

        // Create properties grid
        const propertiesGrid = document.createElement('div');
        propertiesGrid.className = 'properties-grid';
        listingSection.appendChild(propertiesGrid);
        const coordinateMap = new Map();

        // Add new markers only if map and markerCluster are initialized
        if (this.map && this.markerCluster) {
            this.properties.forEach(property => {
                try {
                    // Validate coordinates before creating marker
                    const lat = parseFloat(property.latitude);
                    const lng = parseFloat(property.longitude);
                    
                    if (isNaN(lat) || isNaN(lng) || 
                        lat < -90 || lat > 90 || 
                        lng < -180 || lng > 180) {
                        console.warn(`Skipping property ${property.id} due to invalid coordinates: (${property.latitude}, ${property.longitude})`);
                        return;
                    }

                    // Create a key for the coordinate
                    const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
                    
                    // Get the count of properties at this coordinate
                    const count = coordinateMap.get(coordKey) || 0;
                    coordinateMap.set(coordKey, count + 1);

                    // Add a small random offset to markers at the same location
                    const offset = count > 0 ? {
                        lat: (Math.random() - 0.5) * 0.001,
                        lng: (Math.random() - 0.5) * 0.001
                    } : { lat: 0, lng: 0 };

                    // Create marker with validated coordinates
                    const markerLatLng = [lat + offset.lat, lng + offset.lng];
                    console.log('Creating marker at:', markerLatLng);

                    const marker = L.marker(markerLatLng, {
                        icon: L.divIcon({
                            className: 'custom-marker',
                            html: `<div class="price-marker">${this.formatPrice(property.price)}</div>`,
                            iconSize: [120, 30],
                            iconAnchor: [60, 15]
                        })
                    });

                    marker.propertyId = property.id;
                    
                    // Create popup content
                    const popupContent = this.createPropertyPopup(property);
                    marker.bindPopup(popupContent, {
                        offset: L.point(0, -15),
                        className: 'property-popup',
                        maxWidth: 300,
                        minWidth: 200
                    });

                    // Add click event to marker
                    marker.on('click', (e) => {
                        console.log('Marker clicked:', property.id);
                        this.showPropertyOnMap(property);
                    });

                    this.markers.push(marker);
                    this.markerCluster.addLayer(marker);

                    // Create property card
                    this.createPropertyCard(property, propertiesGrid);
                } catch (error) {
                    console.error(`Error creating marker for property ${property.id}:`, error);
                }
            });

            // Update map bounds to show all markers with padding
            if (this.markers.length > 0) {
                try {
                    const group = new L.featureGroup(this.markers);
                    const bounds = group.getBounds();
                    console.log('Map bounds:', bounds);
                    
                    // Add padding and set max zoom level
                    this.map.fitBounds(bounds, { 
                        padding: [50, 50],
                        maxZoom: 12,
                        animate: true
                    });
                } catch (error) {
                    console.error('Error setting map bounds:', error);
                }
            }
        } else {
            console.warn('Map or markerCluster not initialized, skipping marker creation');
        }
    }

    updateFilters(newFilters) {
        // Only update filters that are provided in newFilters
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] === undefined || newFilters[key] === null) {
                delete this.filters[key];
            } else {
                this.filters[key] = newFilters[key];
            }
        });
        
        this.updateUrlParams();
        this.loadProperties();
    }

    updateUrlParams() {
        const urlParams = new URLSearchParams();
        
        // Only add parameters that have actual values
        if (this.filters.location) {
            const locations = Array.isArray(this.filters.location) ? this.filters.location : [this.filters.location];
            urlParams.set('location', locations.join(','));
        }
        if (this.filters.propertyType) {
            const propertyTypes = Array.isArray(this.filters.propertyType) ? this.filters.propertyType : [this.filters.propertyType];
            urlParams.set('propertyType', propertyTypes.join(','));
        }
        if (this.filters.minPrice > 0) urlParams.set('minPrice', this.filters.minPrice);
        if (this.filters.bedrooms) {
            const bedrooms = Array.isArray(this.filters.bedrooms) ? this.filters.bedrooms : [this.filters.bedrooms];
            urlParams.set('bedrooms', bedrooms.join(','));
        }
        if (this.filters.bathrooms) {
            const bathrooms = Array.isArray(this.filters.bathrooms) ? this.filters.bathrooms : [this.filters.bathrooms];
            urlParams.set('bathrooms', bathrooms.join(','));
        }

        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    }

    setupEventListeners() {
        try {
        // Filter toggle
        const filterToggle = document.querySelector('.filter-toggle');
        const filterContent = document.querySelector('.filter-content');
        
        if (filterToggle && filterContent) {
            filterToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                e.stopPropagation();
                filterContent.classList.toggle('active');
                    filterToggle.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!filterContent.contains(e.target) && !filterToggle.contains(e.target)) {
                    filterContent.classList.remove('active');
                        filterToggle.classList.remove('active');
                }
            });

            filterContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

            // Advanced Filters Toggle
            const advancedToggle = document.querySelector('.advanced-filters-toggle .toggle-button');
            const advancedPanel = document.querySelector('.advanced-filters-panel');
            
            if (advancedToggle && advancedPanel) {
                advancedToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    advancedPanel.classList.toggle('active');
                    advancedToggle.closest('.advanced-filters-toggle').classList.toggle('active');
                });

                document.addEventListener('click', (e) => {
                    if (!advancedPanel.contains(e.target) && !advancedToggle.contains(e.target)) {
                        advancedPanel.classList.remove('active');
                        advancedToggle.closest('.advanced-filters-toggle').classList.remove('active');
                    }
                });

                advancedPanel.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            // Setup filter controls
            this.setupFilterControls();

            // Advanced Filters Accordion
            const accordionHeader = document.querySelector('.accordion-header');
            const accordionContent = document.querySelector('.accordion-content');
            const accordionIcon = document.querySelector('.accordion-icon');

            if (accordionHeader && accordionContent && accordionIcon) {
                accordionHeader.addEventListener('click', () => {
                    accordionContent.classList.toggle('active');
                    accordionIcon.classList.toggle('active');
                });
            }

            // Map container
            const mapContainer = document.querySelector('.property-search-map-container');
            if (mapContainer) {
                mapContainer.addEventListener('click', (e) => {
                    if (e.target === mapContainer) {
                        filterContent?.classList.remove('active');
                        filterToggle?.classList.remove('active');
                        advancedPanel?.classList.remove('active');
                        advancedToggle?.classList.remove('active');
                    }
                });
            }

            // Initialize filters from URL parameters
            this.initializeFiltersFromUrl();

        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    setupFilterControls() {
        // Location filter
        const locationFilter = document.querySelector('.location-filter');
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filters.location = e.target.value;
                this.updateUrlParams();
                this.loadProperties();
            });
        }

        // Property type filter
        const propertyTypeFilter = document.querySelector('.property-type-filter');
        if (propertyTypeFilter) {
            propertyTypeFilter.addEventListener('change', (e) => {
                this.filters.propertyType = e.target.value;
                this.updateUrlParams();
                this.loadProperties();
            });
        }

        // Price range filter
        const minPriceFilter = document.querySelector('.min-price-filter');
        const maxPriceFilter = document.querySelector('.max-price-filter');
        if (minPriceFilter) {
            minPriceFilter.addEventListener('change', (e) => {
                this.filters.minPrice = e.target.value;
                this.updateUrlParams();
                this.loadProperties();
            });
        }
        if (maxPriceFilter) {
            maxPriceFilter.addEventListener('change', (e) => {
                this.filters.maxPrice = e.target.value;
                this.updateUrlParams();
                this.loadProperties();
            });
        }

        // Bedrooms filter
        const bedroomsFilter = document.querySelector('.bedrooms-filter');
        if (bedroomsFilter) {
            bedroomsFilter.addEventListener('change', (e) => {
                this.filters.bedrooms = e.target.value;
                this.updateUrlParams();
                this.loadProperties();
            });
        }

        // Bathrooms filter
        const bathroomsFilter = document.querySelector('.bathrooms-filter');
        if (bathroomsFilter) {
            bathroomsFilter.addEventListener('change', (e) => {
                this.filters.bathrooms = e.target.value;
                this.updateUrlParams();
                this.loadProperties();
            });
        }
    }

    initializeFiltersFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Location
        if (urlParams.has('location')) {
            const locationFilter = document.querySelector('.location-filter');
            if (locationFilter) {
                locationFilter.value = urlParams.get('location');
                this.filters.location = urlParams.get('location');
            }
        }

        // Property type
        if (urlParams.has('propertyType')) {
            const propertyTypeFilter = document.querySelector('.property-type-filter');
            if (propertyTypeFilter) {
                propertyTypeFilter.value = urlParams.get('propertyType');
                this.filters.propertyType = urlParams.get('propertyType');
            }
        }

        // Price range
        if (urlParams.has('minPrice')) {
            const minPriceFilter = document.querySelector('.min-price-filter');
            if (minPriceFilter) {
                minPriceFilter.value = urlParams.get('minPrice');
                this.filters.minPrice = urlParams.get('minPrice');
            }
        }
        if (urlParams.has('maxPrice')) {
            const maxPriceFilter = document.querySelector('.max-price-filter');
            if (maxPriceFilter) {
                maxPriceFilter.value = urlParams.get('maxPrice');
                this.filters.maxPrice = urlParams.get('maxPrice');
            }
        }

        // Bedrooms
        if (urlParams.has('bedrooms')) {
            const bedroomsFilter = document.querySelector('.bedrooms-filter');
            if (bedroomsFilter) {
                bedroomsFilter.value = urlParams.get('bedrooms');
                this.filters.bedrooms = urlParams.get('bedrooms');
            }
        }

        // Bathrooms
        if (urlParams.has('bathrooms')) {
            const bathroomsFilter = document.querySelector('.bathrooms-filter');
            if (bathroomsFilter) {
                bathroomsFilter.value = urlParams.get('bathrooms');
                this.filters.bathrooms = urlParams.get('bathrooms');
            }
        }

        // Load properties with initial filters
        this.loadProperties();
    }

    showTooltip(content, latlng) {
        this.tooltipContainer.innerHTML = content;
        this.tooltipContainer.appendChild(this.closeButton);
        this.tooltipContainer.style.display = 'block';

        // Position tooltip
        const point = this.map.latLngToLayerPoint(latlng);
        const tooltipWidth = this.tooltipContainer.offsetWidth;
        const tooltipHeight = this.tooltipContainer.offsetHeight;
        const mapWidth = this.map.getSize().x;
        const mapHeight = this.map.getSize().y;

        let left = point.x - tooltipWidth / 2;
        let top = point.y - tooltipHeight - 20;

        // Adjust position if tooltip goes outside map bounds
        if (left < 0) left = 0;
        if (left + tooltipWidth > mapWidth) left = mapWidth - tooltipWidth;
        if (top < 0) top = point.y + 20;
        if (top + tooltipHeight > mapHeight) top = mapHeight - tooltipHeight;

        this.tooltipContainer.style.left = left + 'px';
        this.tooltipContainer.style.top = top + 'px';
    }

    updateAdvancedFilters() {
        const selectedFeatures = Array.from(document.querySelectorAll('.advanced-filters input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        this.filters.features = selectedFeatures;
        this.loadProperties(1);
    }

    initializeAdvancedFilters() {
        const advancedToggle = document.querySelector('.advanced-filters-toggle');
        const advancedPanel = document.querySelector('.advanced-filters-panel');
        const closeButton = document.querySelector('.close-panel');
        
        if (advancedToggle && advancedPanel) {
            // Toggle panel visibility
            advancedToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                advancedPanel.classList.toggle('active');
                advancedToggle.classList.toggle('active');
            });

            // Close panel when clicking close button
            if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    advancedPanel.classList.remove('active');
                    advancedToggle.classList.remove('active');
                });
            }

            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!advancedPanel.contains(e.target) && !advancedToggle.contains(e.target)) {
                    advancedPanel.classList.remove('active');
                    advancedToggle.classList.remove('active');
                }
            });

            // Handle filter option clicks
            const filterOptions = advancedPanel.querySelectorAll('.filter-option');
            filterOptions.forEach(option => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                const label = option.querySelector('label');
                
                if (checkbox && label) {
                    // Make the entire option clickable
                    option.addEventListener('click', (e) => {
                        // Prevent double-triggering if clicking the checkbox directly
                        if (e.target !== checkbox) {
                            checkbox.checked = !checkbox.checked;
                            
                            // Update active state
                            option.classList.toggle('active');
                            label.classList.toggle('active');
                            
                            // Trigger the change event manually
                            const event = new Event('change', { bubbles: true });
                            checkbox.dispatchEvent(event);
                        }
                    });

                    // Handle checkbox changes
                    checkbox.addEventListener('change', () => {
                        // Update UI
                        option.classList.toggle('active', checkbox.checked);
                        label.classList.toggle('active', checkbox.checked);
                        
                        // Get filter type and value
                        const filterType = checkbox.getAttribute('data-filter-type');
                        const filterValue = checkbox.value;
                        
                        // Update filters object
                        if (!this.filters.advanced) {
                            this.filters.advanced = {};
                        }
                        
                        if (!this.filters.advanced[filterType]) {
                            this.filters.advanced[filterType] = [];
                        }
                        
                        if (checkbox.checked) {
                            // Add value if not already present
                            if (!this.filters.advanced[filterType].includes(filterValue)) {
                                this.filters.advanced[filterType].push(filterValue);
                            }
                        } else {
                            // Remove value
                            this.filters.advanced[filterType] = this.filters.advanced[filterType]
                                .filter(val => val !== filterValue);
                        }
                        
                        // Update URL and reload properties
                        this.updateUrlWithFilters();
                        this.loadProperties(1);
                    });
                }
            });
        }
    }

    updateUrlWithFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Clear existing filter parameters
        for (const key of urlParams.keys()) {
            if (key.startsWith('filter_') || 
                key === 'location' || 
                key === 'propertyType' || 
                key === 'minPrice' || 
                key === 'bedrooms' || 
                key === 'bathrooms' ||
                key === 'beach' ||
                key === 'golf' ||
                key === 'exclusive' ||
                key === 'modern' ||
                key === 'new') {
                urlParams.delete(key);
            }
        }
        
        // Add quick filters to URL
        if (this.filters.beach) urlParams.set('beach', 'true');
        if (this.filters.golf) urlParams.set('golf', 'true');
        if (this.filters.exclusive) urlParams.set('exclusive', 'true');
        if (this.filters.modern) urlParams.set('modern', 'true');
        if (this.filters.new) urlParams.set('new', 'true');
        
        // Add advanced filters to URL
        if (this.filters.advanced) {
            Object.entries(this.filters.advanced).forEach(([filterType, values]) => {
                if (values && values.length > 0 && values[0] !== null) {
                    urlParams.set(`filter_${filterType}`, values.join(','));
                }
            });
        }
        
        // Add other filters only if they have non-null values
        if (this.filters.location && this.filters.location !== 'null') {
            urlParams.set('location', this.filters.location);
        }
        if (this.filters.propertyType && this.filters.propertyType !== 'null') {
            urlParams.set('propertyType', this.filters.propertyType);
        }
        if (this.filters.minPrice > 0) {
            urlParams.set('minPrice', this.filters.minPrice);
        }
        if (this.filters.bedrooms > 0) {
            urlParams.set('bedrooms', this.filters.bedrooms);
        }
        if (this.filters.bathrooms > 0) {
            urlParams.set('bathrooms', this.filters.bathrooms);
        }
        
        // Update URL without reloading the page
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    }

    initializeQuickFilters() {
        const quickFilters = document.querySelector('.quick-filters');
        const clearAllButton = quickFilters.querySelector('.clear-all-filters');
        
        // Clear all filters functionality
        if (clearAllButton) {
            clearAllButton.addEventListener('click', () => {
                // Remove active class from all quick filter buttons
                const quickFilterButtons = quickFilters.querySelectorAll('.quick-filter-button');
                quickFilterButtons.forEach(button => {
                    button.classList.remove('active');
                });
                
                // Reset all quick filter values
                this.filters.beach = false;
                this.filters.golf = false;
                this.filters.exclusive = false;
                this.filters.modern = false;
                this.filters.new = false;
                
                // Reset advanced filters
                this.resetAdvancedFilters();
                
                // Update URL and reload properties
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        }
        
        // Quick filter buttons functionality
        const quickFilterButtons = quickFilters.querySelectorAll('.quick-filter-button');
        quickFilterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filterType = button.getAttribute('data-filter-type');
                
                // Toggle active state
                button.classList.toggle('active');
                
                // Update filters based on the quick filter type
                switch(filterType) {
                    case 'beach':
                        this.filters.beach = button.classList.contains('active');
                        break;
                    case 'golf':
                        this.filters.golf = button.classList.contains('active');
                        break;
                    case 'exclusive':
                        this.filters.exclusive = button.classList.contains('active');
                        break;
                    case 'modern':
                        this.filters.modern = button.classList.contains('active');
                        break;
                    case 'new':
                        this.filters.new = button.classList.contains('active');
                        break;
                }
                
                // Update URL and reload properties
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        });
    }

    resetAdvancedFilters() {
        // Reset all checkboxes
        const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            const option = checkbox.closest('.filter-option');
            if (option) {
                option.classList.remove('active');
            }
        });
        
        // Reset filter values
        this.filters.location = '';
        this.filters.propertyType = '';
        this.filters.minPrice = 0;
        this.filters.bedrooms = 0;
        this.filters.bathrooms = 0;
    }

    formatPrice(price) {
        if (!price) return 'Price on request';
        
        // Convert to number if it's a string
        const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
        
        // Format the price with thousands separator and currency symbol
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(numericPrice);
    }

    createPropertyPopup(property) {
        return `
            <div class="property-popup">
                <div class="property-popup-image">
                    <img src="${property.image}" alt="${this.formatPrice(property.price)}" 
                         onerror="this.onerror=null; this.src='/wp-content/themes/solvistaproperty/assets/images/placeholder.svg';">
                </div>
                <div class="property-popup-content">
                    <h3>${this.formatPrice(property.price)}</h3>
                    <p class="property-popup-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                    <div class="property-popup-features">
                        <span><i class="fas fa-bed"></i> ${property.bedrooms} beds</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms} baths</span>
                        <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
                    </div>
                    <a href="${property.viewDetails}" class="property-popup-button">View Details</a>
                </div>
            </div>
        `;
    }

    createPropertyCard(property, container) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.dataset.propertyId = property.id;
        
        card.innerHTML = `
            <div class="property-image">
                <img src="${property.image}" alt="${this.formatPrice(property.price)}"
                     onerror="this.onerror=null; this.src='/wp-content/themes/oceanwp/assets/images/placeholder.jpg';">
            </div>
            <div class="property-details">
                <h3 class="property-title">${this.formatPrice(property.price)}</h3>
                <div class="property-features">
                    <span class="property-feature">
                        <i class="fas fa-bed"></i>
                        <span class="feature-value">${property.bedrooms} beds</span>
                    </span>
                    <span class="property-feature">
                        <i class="fas fa-bath"></i>
                        <span class="feature-value">${property.bathrooms} baths</span>
                    </span>
                    <span class="property-feature">
                        <i class="fas fa-ruler-combined"></i>
                        <span class="feature-value">${property.area}</span>
                    </span>
                </div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span class="location-text">${property.location}</span>
                </div>
                <a href="${property.viewDetails}" class="property-link">View Details</a>
            </div>
        `;

        // Add click handler to the card
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the "View Details" link
            if (e.target.closest('.property-link')) {
                return;
            }

            // Validate coordinates before showing on map
            const lat = parseFloat(property.latitude);
            const lng = parseFloat(property.longitude);
            
            if (isNaN(lat) || isNaN(lng) || 
                lat < -90 || lat > 90 || 
                lng < -180 || lng > 180) {
                console.error('Invalid coordinates for property:', property.id, lat, lng);
                return;
            }

            this.showPropertyOnMap(property);
        });

        container.appendChild(card);
        return card;
    }

    showPropertyOnMap(property) {
        try {
            // Validate coordinates before proceeding
            const lat = parseFloat(property.latitude);
            const lng = parseFloat(property.longitude);
            
            console.log('Property coordinates:', { lat, lng, raw: { lat: property.latitude, lng: property.longitude } });
            
            if (isNaN(lat) || isNaN(lng) || 
                lat < -90 || lat > 90 || 
                lng < -180 || lng > 180) {
                console.error('Invalid coordinates for property:', property.id, lat, lng);
                return;
            }

            // Remove active class from all cards
            document.querySelectorAll('.property-card').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            const card = document.querySelector(`.property-card[data-property-id="${property.id}"]`);
            if (card) {
                card.classList.add('active');
                // Scroll card into view
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Find the corresponding marker
            const marker = this.markers.find(m => m.propertyId === property.id);
            if (marker) {
                try {
                    // Ensure the map is initialized
                    if (!this.map) {
                        console.error('Map not initialized');
                        return;
                    }

                    // Create a new LatLng object with validated coordinates
                    const latLng = L.latLng(lat, lng);
                    console.log('Flying to coordinates:', latLng);

                    // First pan to the location
                    this.map.panTo(latLng);

                    // Then zoom in with animation
                    this.map.setView(latLng, 17, { // Increased zoom level
                        animate: true,
                        duration: 1.5
                    });

                    // Open popup after a short delay to ensure smooth animation
                    setTimeout(() => {
                        if (marker && marker.openPopup) {
                            marker.openPopup();
                        }
                    }, 1000);

                    // Highlight the marker
                    if (marker.setIcon) {
                        marker.setIcon(L.divIcon({
                            className: 'custom-marker active',
                            html: `<div class="price-marker">${this.formatPrice(property.price)}</div>`,
                            iconSize: [120, 30],
                            iconAnchor: [60, 15]
                        }));
                    }
                } catch (error) {
                    console.error('Error flying to marker:', error);
                }
            } else {
                console.warn('Marker not found for property:', property.id);
            }
        } catch (error) {
            console.error('Error showing property on map:', error);
        }
    }
}

// Initialize the map when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add error container if it doesn't exist
    if (!document.getElementById('map-error')) {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'map-error';
        errorContainer.style.display = 'none';
        errorContainer.style.padding = '20px';
        errorContainer.style.margin = '20px';
        errorContainer.style.border = '1px solid #ff0000';
        errorContainer.style.color = '#ff0000';
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.parentNode.insertBefore(errorContainer, mapContainer);
        }
    }

    // Initialize only if not already initialized
    if (!window.searchByMap) {
        window.searchByMap = new SearchByMap();
        const propertyFilters = new PropertyFilters();
        propertyFilters.init();
    }
});

// PropertyFilters Class
class PropertyFilters {
    constructor() {
        this.filters = {
            location: '',
            propertyType: '',
            minPrice: 0,
            bedrooms: 0,
            bathrooms: 0
        };
        this.apiUrl = 'https://solvistaproperty.com/wp-json/resales/v1/map-properties';
        this.searchByMap = null;
    }

    init() {
        this.setupEventListeners();
        // Get reference to SearchByMap instance
        this.searchByMap = window.searchByMap;
        // Load initial filters from URL
        this.loadFiltersFromUrl();
    }

    loadFiltersFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const filters = {};
        
        if (urlParams.has('location')) filters.location = urlParams.get('location');
        if (urlParams.has('propertyType')) filters.propertyType = urlParams.get('propertyType');
        if (urlParams.has('minPrice')) filters.minPrice = parseInt(urlParams.get('minPrice'));
        if (urlParams.has('bedrooms')) filters.bedrooms = parseInt(urlParams.get('bedrooms'));
        if (urlParams.has('bathrooms')) filters.bathrooms = parseInt(urlParams.get('bathrooms'));

        if (Object.keys(filters).length > 0) {
            this.updateFilters(filters);
            this.updateCheckboxesFromFilters(filters);
        }
    }

    updateCheckboxesFromFilters(filters) {
        // Update location checkboxes
        if (filters.location) {
            const locationCheckbox = document.querySelector(`input[name="location"][value="${filters.location}"]`);
            if (locationCheckbox) {
                locationCheckbox.checked = true;
                this.updateSelectedText('location');
            }
        }

        // Update property type checkboxes
        if (filters.propertyType) {
            const propertyTypeMap = {
                '2-3': 'apartment',
                '2-4': 'villa',
                '2-5': 'townhouse',
                '2-6': 'penthouse',
                '2-7': 'plot',
                '2-8': 'commercial'
            };
            const checkboxValue = propertyTypeMap[filters.propertyType];
            if (checkboxValue) {
                const propertyTypeCheckbox = document.querySelector(`input[name="property_type"][value="${checkboxValue}"]`);
                if (propertyTypeCheckbox) {
                    propertyTypeCheckbox.checked = true;
                    this.updateSelectedText('property_type');
                }
            }
        }

        // Update price checkboxes
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            const priceCheckbox = document.querySelector(`input[name="price"][value="${filters.minPrice}-${filters.maxPrice}"]`);
            if (priceCheckbox) {
                priceCheckbox.checked = true;
                this.updateSelectedText('price');
            }
        }

        // Update bedrooms checkboxes
        if (filters.bedrooms) {
            const bedroomsCheckbox = document.querySelector(`input[name="bedrooms"][value="${filters.bedrooms}"]`);
            if (bedroomsCheckbox) {
                bedroomsCheckbox.checked = true;
                this.updateSelectedText('bedrooms');
            }
        }

        // Update bathrooms checkboxes
        if (filters.bathrooms) {
            const bathroomsCheckbox = document.querySelector(`input[name="bathrooms"][value="${filters.bathrooms}"]`);
            if (bathroomsCheckbox) {
                bathroomsCheckbox.checked = true;
                this.updateSelectedText('bathrooms');
            }
        }
    }

    updateFilters(newFilters) {
        // Only update filters that are provided in newFilters
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] === undefined || newFilters[key] === null) {
                delete this.filters[key];
            } else {
                this.filters[key] = newFilters[key];
            }
        });
        
        this.updateUrlParams();
        this.loadProperties();
    }

    updateUrlParams() {
        const urlParams = new URLSearchParams();
        
        // Only add parameters that have actual values
        if (this.filters.location) {
            const locations = Array.isArray(this.filters.location) ? this.filters.location : [this.filters.location];
            urlParams.set('location', locations.join(','));
        }
        if (this.filters.propertyType) {
            const propertyTypes = Array.isArray(this.filters.propertyType) ? this.filters.propertyType : [this.filters.propertyType];
            urlParams.set('propertyType', propertyTypes.join(','));
        }
        if (this.filters.minPrice > 0) urlParams.set('minPrice', this.filters.minPrice);
        if (this.filters.bedrooms) {
            const bedrooms = Array.isArray(this.filters.bedrooms) ? this.filters.bedrooms : [this.filters.bedrooms];
            urlParams.set('bedrooms', bedrooms.join(','));
        }
        if (this.filters.bathrooms) {
            const bathrooms = Array.isArray(this.filters.bathrooms) ? this.filters.bathrooms : [this.filters.bathrooms];
            urlParams.set('bathrooms', bathrooms.join(','));
        }

        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    }

    async loadProperties() {
        const loadingIndicator = document.getElementById('loading-indicator');
        const mainContainer = document.querySelector('.property-search-map');
        const mapContainer = document.getElementById('map');
        const propertyListing = document.querySelector('.property-listing-section');
        const filtersSection = document.querySelector('.filters-section');
        const quickFilters = document.querySelector('.quick-filters');
        const advancedFilters = document.querySelector('.advanced-filters-panel');
        const mobileFilters = document.querySelector('.mobile-filters-panel');

        // Show loading states
        if (loadingIndicator) {
            loadingIndicator.classList.add('active');
            loadingIndicator.innerHTML = `
                <div class="loader-container">
                    <div class="loader-spinner"></div>
                    <div class="loader-text">Loading Properties</div>
                    <div class="loader-subtext">Please wait while we fetch the latest listings...</div>
                </div>
            `;
        }

        // Add loading classes to containers
        if (mainContainer) mainContainer.classList.add('loading');
        if (mapContainer) mapContainer.classList.add('loading');
        if (propertyListing) propertyListing.classList.add('loading');
        if (filtersSection) filtersSection.classList.add('loading');
        if (quickFilters) quickFilters.classList.add('loading');
        if (advancedFilters) advancedFilters.classList.add('loading');
        if (mobileFilters) mobileFilters.classList.add('loading');

       

        try {
            // Build API URL with filter parameters
            const params = new URLSearchParams();
            
            // Only add parameters that have actual values
            if (this.filters.location) {
                const locations = Array.isArray(this.filters.location) ? this.filters.location : [this.filters.location];
                params.set('Location', locations.join(','));
            }
            if (this.filters.minPrice > 0) params.set('PMin', this.filters.minPrice);
            if (this.filters.propertyType) {
                const propertyTypes = Array.isArray(this.filters.propertyType) ? this.filters.propertyType : [this.filters.propertyType];
                params.set('PropertyType', propertyTypes.join(','));
            }
            if (this.filters.bedrooms) {
                const bedrooms = Array.isArray(this.filters.bedrooms) ? this.filters.bedrooms : [this.filters.bedrooms];
                params.set('Beds', bedrooms.join(','));
            }
            if (this.filters.bathrooms) {
                const bathrooms = Array.isArray(this.filters.bathrooms) ? this.filters.bathrooms : [this.filters.bathrooms];
                params.set('Baths', bathrooms.join(','));
            }

            const apiUrl = `${this.apiUrl}?${params.toString()}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                throw new Error('API response is not in the expected format');
            }

            // Update SearchByMap properties and refresh display
            if (this.searchByMap) {
                this.searchByMap.properties = data.map(property => ({
                    id: property.reference,
                    reference: property.reference,
                    title: `Property ${property.reference}`,
                    price: property.price || 0,
                    location: property.location || 'Location not specified',
                    bedrooms: 0,
                    bathrooms: 0,
                    area: property.area || 'Area not specified',
                    image: property.pictureUrl || '/wp-content/themes/oceanwp/assets/images/placeholder.jpg',
                    status: 'For Sale',
                    propertyType: 'Property',
                    latitude: parseFloat(property.gps_x),
                    longitude: parseFloat(property.gps_y),
                    province: property.province,
                    area: property.area,
                    description: '',
                    features: [],
                    dateAdded: new Date().toISOString(),
                    isFeatured: false,
                    isNew: false,
                    isReduced: false,
                    viewDetails: property.propertyUrl || `/property/${property.reference}`
                }));
                this.searchByMap.displayProperties();
            }
        } catch (error) {
            const errorContainer = document.getElementById('map-error');
            if (errorContainer) {
                errorContainer.innerHTML = `<p>Error loading properties: ${error.message}</p>`;
                errorContainer.style.display = 'block';
            }
        } finally {
            // Remove loading states
            if (loadingIndicator) {
                loadingIndicator.classList.remove('active');
            }
            if (mainContainer) mainContainer.classList.remove('loading');
            if (mapContainer) mapContainer.classList.remove('loading');
            if (propertyListing) propertyListing.classList.remove('loading');
            if (filtersSection) filtersSection.classList.remove('loading');
            if (quickFilters) quickFilters.classList.remove('loading');
            if (advancedFilters) advancedFilters.classList.remove('loading');
            if (mobileFilters) mobileFilters.classList.remove('loading');
        }
    }

    setupEventListeners() {
        // Get all custom selects
        const customSelects = document.querySelectorAll('.custom-select');
        console.log(customSelects);
        customSelects.forEach((select) => {
            const header = select.querySelector('.select-header');
            const dropdown = select.querySelector('.select-dropdown');
            const searchBox = select.querySelector('.search-box input');
            
            if (header && dropdown) {
                // Add click listener to header
                header.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Close all other dropdowns
                    customSelects.forEach(otherSelect => {
                        if (otherSelect !== select) {
                            const otherDropdown = otherSelect.querySelector('.select-dropdown');
                            if (otherDropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                });
            }

            // Add search functionality if search box exists
            if (searchBox) {
                searchBox.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const options = select.querySelectorAll('.option-group');
                    
                    options.forEach(group => {
                        const groupHeader = group.querySelector('.group-header');
                        const groupItems = group.querySelectorAll('.group-items .checkbox-wrapper-4');
                        let hasVisibleItems = false;

                        // Check if group header matches search
                        const headerText = groupHeader.textContent.toLowerCase();
                        const headerMatches = headerText.includes(searchTerm);
                        groupHeader.style.display = headerMatches ? 'block' : 'none';

                        // Check each item in the group
                        groupItems.forEach(item => {
                            const itemText = item.textContent.toLowerCase();
                            const matches = itemText.includes(searchTerm);
                            item.style.display = matches ? 'block' : 'none';
                            if (matches) hasVisibleItems = true;
                        });

                        // Show/hide group based on matches
                        group.style.display = (headerMatches || hasVisibleItems) ? 'block' : 'none';
                    });
                });
            }
        });
        
        // Location checkboxes
        const locationCheckboxes = document.querySelectorAll('input[name="location"]');
        locationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (checkbox.id === 'location-all') {
                    const isChecked = checkbox.checked;
                    locationCheckboxes.forEach(cb => {
                        if (cb.id !== 'location-all') {
                            cb.checked = isChecked;
                        }
                    });
                    this.updateFilters({ location: '' });
                } else {
                    const allCheckbox = document.getElementById('location-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                    const selectedLocations = Array.from(locationCheckboxes)
                        .filter(cb => cb.checked && cb.id !== 'location-all')
                        .map(cb => cb.value);
                    this.updateFilters({ location: selectedLocations });
                }
                this.updateSelectedText('location');
        });
      });
      
        // Property type checkboxes
        const propertyTypeCheckboxes = document.querySelectorAll('input[name="property_type"]');
        propertyTypeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (checkbox.id === 'property_type-all') {
                    const isChecked = checkbox.checked;
                    propertyTypeCheckboxes.forEach(cb => {
                        if (cb.id !== 'property_type-all') {
                            cb.checked = isChecked;
                        }
                    });
      } else {
                    const allCheckbox = document.getElementById('property_type-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                    const selectedTypes = Array.from(propertyTypeCheckboxes)
                        .filter(cb => cb.checked && cb.id !== 'property_type-all')
                        .map(cb => {
                            const propertyTypeMap = {
                                'apartment': '2-3',
                                'villa': '2-4',
                                'townhouse': '2-5',
                                'penthouse': '2-6',
                                'plot': '2-7',
                                'commercial': '2-8'
                            };
                            return propertyTypeMap[cb.value] || cb.value;
                        });
                    this.updateFilters({ propertyType: selectedTypes });
                }
                this.updateSelectedText('property_type');
            });
        });

        // Price checkboxes
        const priceCheckboxes = document.querySelectorAll('input[name="price"]');
        
        priceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (checkbox.id === 'price-all') {
                    const isChecked = checkbox.checked;
                    priceCheckboxes.forEach(cb => {
                        if (cb.id !== 'price-all') {
                            cb.checked = isChecked;
                        }
                    });
        } else {
                    const allCheckbox = document.getElementById('price-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                }
                this.updateSelectedText('price');
                this.updateFilters({ 
                    minPrice: parseInt(checkbox.value.split('-')[0]),
                    maxPrice: parseInt(checkbox.value.split('-')[1])
                });
            });
        });

        // Bedrooms checkboxes
        const bedroomsCheckboxes = document.querySelectorAll('input[name="bedrooms"]');
        bedroomsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (checkbox.id === 'bedrooms-all') {
                    const isChecked = checkbox.checked;
                    bedroomsCheckboxes.forEach(cb => {
                        if (cb.id !== 'bedrooms-all') {
                            cb.checked = isChecked;
                        }
                    });
                    this.updateFilters({ bedrooms: 0 });
                } else {
                    const allCheckbox = document.getElementById('bedrooms-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                    const selectedBedrooms = Array.from(bedroomsCheckboxes)
                        .filter(cb => cb.checked && cb.id !== 'bedrooms-all')
                        .map(cb => parseInt(cb.value));
                    this.updateFilters({ bedrooms: selectedBedrooms });
                }
                this.updateSelectedText('bedrooms');
      });
    });
    
        // Bathrooms checkboxes
        const bathroomsCheckboxes = document.querySelectorAll('input[name="bathrooms"]');
        bathroomsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (checkbox.id === 'bathrooms-all') {
                    const isChecked = checkbox.checked;
                    bathroomsCheckboxes.forEach(cb => {
                        if (cb.id !== 'bathrooms-all') {
                            cb.checked = isChecked;
                        }
                    });
                    this.updateFilters({ bathrooms: 0 });
                } else {
                    const allCheckbox = document.getElementById('bathrooms-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                    const selectedBathrooms = Array.from(bathroomsCheckboxes)
                        .filter(cb => cb.checked && cb.id !== 'bathrooms-all')
                        .map(cb => parseInt(cb.value));
                    this.updateFilters({ bathrooms: selectedBathrooms });
                }
                this.updateSelectedText('bathrooms');
            });
        });
    }

    updateSelectedText(filterType) {
        const select = document.querySelector(`.custom-select[data-filter="${filterType}"]`);
        if (!select) return;

        const header = select.querySelector('.select-header');
        const checkboxes = select.querySelectorAll(`input[name="${filterType}"]:checked`);
        
        if (!header) return;

        if (checkboxes.length === 0) {
            header.textContent = `All ${filterType.replace('_', ' ')}`;
            return;
        }

        const selectedValues = Array.from(checkboxes)
            .filter(checkbox => !checkbox.id.includes('-all'))
            .map(checkbox => checkbox.value);

        if (selectedValues.length === 0) {
            header.textContent = `All ${filterType.replace('_', ' ')}`;
        } else if (selectedValues.length === 1) {
            header.textContent = selectedValues[0];
        } else {
            header.textContent = `${selectedValues.length} selected`;
        }
    }
}