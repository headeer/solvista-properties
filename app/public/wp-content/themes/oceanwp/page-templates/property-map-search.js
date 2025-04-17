// Global filters object
const globalFilters = {
    location: 'Málaga',
    propertyType: '',
    minPrice: 0,
    maxPrice: 0,
    bedrooms: 0,
    bathrooms: 0,
    beach: false,
    golf: false,
    exclusive: false,
    modern: false,
    new: false,
    advanced: {}
};

// Add city coordinates at the top of the file
const cityCoordinates = {
    'Málaga': { lat: 36.7213, lng: -4.4217 },
    'Marbella': { lat: 36.5101, lng: -4.8824 },
    'Estepona': { lat: 36.4276, lng: -5.1459 },
    'Fuengirola': { lat: 36.5418, lng: -4.6243 },
    'Mijas': { lat: 36.5957, lng: -4.6375 },
    'Benalmadena': { lat: 36.5957, lng: -4.5725 },
    'Torremolinos': { lat: 36.6204, lng: -4.4998 },
    'Antequera': { lat: 37.0194, lng: -4.5612 },
    'Ronda': { lat: 36.7428, lng: -5.1666 },
    'Sotogrande': { lat: 36.2833, lng: -5.2833 }
};

// Property Search Map Script
class SearchByMap {
    constructor(config = {}) {
        this.config = {
            apiUrl: 'https://solvistaproperty.com/wp-json/resales/v1/map-properties',
            hasApiKey: true,
            itemsPerPage: 10,
            defaultLocation: 'Málaga',
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
        this.tooltipContainer = null;
        this.closeButton = null;
        this.currentBounds = null;
        this.visibleCities = new Set();
        this.debounceTimer = null;
        this.debounceDelay = 1000; // 1 second debounce
        this.isMapUpdating = false;
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

            // Only load properties if there are active filters
            if (Object.keys(globalFilters).some(key => {
                if (key === 'advanced') {
                    return globalFilters.advanced && Object.keys(globalFilters.advanced).length > 0;
                }
                return globalFilters[key] && globalFilters[key] !== 'null' && globalFilters[key] !== 0;
            })) {
                await this.loadProperties(1);
            }

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
            iconCreateFunction: function (cluster) {
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

        // Add debounced event listeners for map movement and zoom
        this.map.on('moveend', () => this.debouncedCheckVisibleCities());
        this.map.on('zoomend', () => this.debouncedCheckVisibleCities());
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
            Location: globalFilters.location || '',
            PMin: globalFilters.minPrice || 0,
            PMax: globalFilters.maxPrice || 1000000,
            PropertyType: globalFilters.propertyType || '',
            Beds: globalFilters.bedrooms || 0,
            Baths: globalFilters.bathrooms || 0
        });

        return `${this.config.apiUrl}?${params.toString()}`;
    }

    async loadProperties(page = 1) {
        this.currentPage = page;
        console.log('loadProperties', page);
        
        try {
            // Build API URL with filter parameters using correct case
            const params = new URLSearchParams();

            // Add filters with correct parameter names and comma separation for multiple values
            if (globalFilters.location) {
                const locations = Array.isArray(globalFilters.location) ? globalFilters.location : [globalFilters.location];
                if (locations.length > 0) {
                    params.set('Location', locations.join(','));
                }
            }
            if (globalFilters.propertyType) {
                const propertyTypes = Array.isArray(globalFilters.propertyType) ? globalFilters.propertyType : [globalFilters.propertyType];
                if (propertyTypes.length > 0) {
                    params.set('PropertyType', propertyTypes.join(','));
                }
            }
            if (globalFilters.minPrice > 0) params.set('PMin', globalFilters.minPrice);
            if (globalFilters.maxPrice > 0) params.set('PMax', globalFilters.maxPrice);
            if (globalFilters.bedrooms) {
                const bedrooms = Array.isArray(globalFilters.bedrooms) ? globalFilters.bedrooms : [globalFilters.bedrooms];
                if (bedrooms.length > 0) {
                    params.set('Beds', bedrooms.join(','));
                }
            }
            if (globalFilters.bathrooms) {
                const bathrooms = Array.isArray(globalFilters.bathrooms) ? globalFilters.bathrooms : [globalFilters.bathrooms];
                if (bathrooms.length > 0) {
                    params.set('Baths', bathrooms.join(','));
                }
            }

            // Add quick filters with correct parameter names
            if (globalFilters.beach) params.set('Beach', 'true');
            if (globalFilters.golf) params.set('Golf', 'true');
            if (globalFilters.exclusive) params.set('Exclusive', 'true');
            if (globalFilters.modern) params.set('Modern', 'true');
            if (globalFilters.new) params.set('New', 'true');

            // Add advanced filters with correct parameter names
            if (globalFilters.advanced) {
                Object.entries(globalFilters.advanced).forEach(([filterKey, value]) => {
                    if (value === true) {
                        params.set(`Filter_${filterKey}`, 'true');
                    }
                });
            }

            const apiUrl = `${this.config.apiUrl}?${params.toString()}`;
            console.log('API URL:', apiUrl);

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
            this.properties = this.processProperties(data);

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
        }
    }

    processProperties(properties) {
        // Create a map to track coordinates and their counts
        const coordinateMap = new Map();

        return properties.map(property => {
            // Get coordinates if available, otherwise use random Spain coordinates
            let latitude = parseFloat(property.gps_x);
            let longitude = parseFloat(property.gps_y);

            // Validate coordinates
            if (isNaN(latitude) || isNaN(longitude) ||
                latitude < -90 || latitude > 90 ||
                longitude < -180 || longitude > 180) {
                console.warn(`Invalid coordinates for property ${property.reference}: (${property.gps_x}, ${property.gps_y})`);
                const randomCoords = this.getRandomSpainCoordinates();
                latitude = parseFloat(randomCoords.latitude);
                longitude = parseFloat(randomCoords.longitude);
            }

            // Create a key for the coordinate
            const coordKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

            // Get the count of properties at this coordinate
            const count = coordinateMap.get(coordKey) || 0;
            coordinateMap.set(coordKey, count + 1);

            // Add a small random offset to markers at the same location
            const offset = count > 0 ? {
                lat: (Math.random() - 0.5) * 0.015, // ~100 meters max offset
                lng: (Math.random() - 0.5) * 0.015  // ~100 meters max offset
            } : { lat: 0, lng: 0 };

            // Create marker with validated coordinates and offset
            const markerLatLng = [latitude + offset.lat, longitude + offset.lng];

            return {
                id: property.reference,
                reference: property.reference,
                title: `Property ${property.reference}`,
                price: property.price || 0,
                location: property.location || 'Location not specified',
                bedrooms: property.bedrooms || "",
                bathrooms: property.bathrooms || "",
                area: property.area || 'Area not specified',
                image: property.pictureUrl,
                status: 'For Sale',
                propertyType: 'Property',
                latitude: markerLatLng[0],
                longitude: markerLatLng[1],
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
        });
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

                    // Create marker with validated coordinates
                    const marker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'custom-marker',
                            html: `<div class="price-marker">${this.formatPrice(property.price)}</div>`,
                            iconSize: [56,19],
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
        // Show loading indicator
        this.showLoadingIndicator();

        // Only update filters that are provided in newFilters
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] === undefined || newFilters[key] === null) {
                delete globalFilters[key];
            } else {
                globalFilters[key] = newFilters[key];
            }
        });

        // Update URL parameters
        this.updateUrlWithFilters();
        
        // Reload properties with the updated filters
        this.loadProperties(1).finally(() => {
            // Hide loading indicator when properties are loaded
            this.hideLoadingIndicator();
        });
    }

    showLoadingIndicator() {
        // Create or get loading indicator
        let loadingIndicator = document.getElementById('loading-indicator');
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'loading-indicator';
            loadingIndicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 50%;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                border-bottom: 1px solid #eee;
            `;
            loadingIndicator.innerHTML = `
                <div style="text-align: center;">
                    <div class="loader-spinner" style="
                        width: 50px;
                        height: 50px;
                        border: 5px solid #f3f3f3;
                        border-top: 5px solid #3498db;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    "></div>
                    <div style="font-size: 18px; color: #333;">Loading properties...</div>
                </div>
            `;
            document.body.appendChild(loadingIndicator);
        }
        loadingIndicator.style.display = 'flex';
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    updateUrlWithFilters() {
        const urlParams = new URLSearchParams(window.location.search);

        // Clear existing filter parameters
        for (const key of urlParams.keys()) {
            if (key.startsWith('filter_') ||
                key === 'Location' ||
                key === 'PropertyType' ||
                key === 'PMin' ||
                key === 'PMax' ||
                key === 'Beds' ||
                key === 'Baths' ||
                key === 'beach' ||
                key === 'golf' ||
                key === 'exclusive' ||
                key === 'modern' ||
                key === 'new') {
                urlParams.delete(key);
            }
        }

        // Add quick filters to URL
        if (globalFilters.beach) urlParams.set('beach', 'true');
        if (globalFilters.golf) urlParams.set('golf', 'true');
        if (globalFilters.exclusive) urlParams.set('exclusive', 'true');
        if (globalFilters.modern) urlParams.set('modern', 'true');
        if (globalFilters.new) urlParams.set('new', 'true');

        // Add advanced filters to URL (only if true)
        if (globalFilters.advanced) {
            Object.entries(globalFilters.advanced).forEach(([filterKey, value]) => {
                if (value === true) {
                    urlParams.set(`filter_${filterKey}`, 'true');
                }
            });
        }

        // Add other filters with correct case and comma separation for multiple values
        if (globalFilters.location) {
            const locations = Array.isArray(globalFilters.location) ? globalFilters.location : [globalFilters.location];
            if (locations.length > 0) {
                urlParams.set('Location', locations.join(','));
            }
        }
        if (globalFilters.propertyType) {
            const propertyTypes = Array.isArray(globalFilters.propertyType) ? globalFilters.propertyType : [globalFilters.propertyType];
            if (propertyTypes.length > 0) {
                urlParams.set('PropertyType', propertyTypes.join(','));
            }
        }
        if (globalFilters.minPrice > 0) {
            urlParams.set('PMin', globalFilters.minPrice);
        }
        if (globalFilters.maxPrice > 0) {
            urlParams.set('PMax', globalFilters.maxPrice);
        }
        if (globalFilters.bedrooms) {
            const bedrooms = Array.isArray(globalFilters.bedrooms) ? globalFilters.bedrooms : [globalFilters.bedrooms];
            if (bedrooms.length > 0) {
                urlParams.set('Beds', bedrooms.join(','));
            }
        }
        if (globalFilters.bathrooms) {
            const bathrooms = Array.isArray(globalFilters.bathrooms) ? globalFilters.bathrooms : [globalFilters.bathrooms];
            if (bathrooms.length > 0) {
                urlParams.set('Baths', bathrooms.join(','));
            }
        }

        // Update URL without reloading the page
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

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    const isClickInside = filterContent.contains(e.target) || filterToggle.contains(e.target);
                    if (!isClickInside) {
                        filterContent.classList.remove('active');
                        filterToggle.classList.remove('active');
                    }
                });

                filterContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            // Reset filters button
            const resetButton = document.querySelector('.reset-filters');
            if (resetButton) {
                resetButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.resetAllFilters();
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

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    const isClickInside = advancedPanel.contains(e.target) || advancedToggle.contains(e.target);
                    if (!isClickInside) {
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
                        advancedToggle?.closest('.advanced-filters-toggle')?.classList.remove('active');
                    }
                });
            }

            // Add global click handler for all dropdowns
            document.addEventListener('click', (e) => {
                // Close all select dropdowns when clicking outside
                document.querySelectorAll('.select-dropdown').forEach(dropdown => {
                    const select = dropdown.closest('.custom-select');
                    if (select && !select.contains(e.target)) {
                        dropdown.classList.remove('active');
                    }
                });

                // Close filter content when clicking outside
                if (filterContent && !filterContent.contains(e.target) && !filterToggle.contains(e.target)) {
                    filterContent.classList.remove('active');
                    filterToggle.classList.remove('active');
                }

                // Close advanced panel when clicking outside
                if (advancedPanel && !advancedPanel.contains(e.target) && !advancedToggle.contains(e.target)) {
                    advancedPanel.classList.remove('active');
                    advancedToggle.closest('.advanced-filters-toggle').classList.remove('active');
                }
            });

            // Initialize filters from URL parameters
            this.initializeFiltersFromUrl();

            // Advanced Filters Grid
            const advancedFiltersGrid = document.querySelector('.advanced-filters-grid');
            if (advancedFiltersGrid) {
                advancedFiltersGrid.addEventListener('click', (e) => {
                    const filterItem = e.target.closest('.filter-option');
                    if (!filterItem) return;

                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle active state
                    filterItem.classList.toggle('active');

                    // Get filter type and value
                    const filterType = filterItem.dataset.filterType;
                    const filterValue = filterItem.dataset.filterValue;

                    // Update filters object
                    if (!globalFilters.advanced) {
                        globalFilters.advanced = {};
                    }

                    if (!globalFilters.advanced[filterType]) {
                        globalFilters.advanced[filterType] = [];
                    }

                    if (filterItem.classList.contains('active')) {
                        // Add value if not already present
                        if (!globalFilters.advanced[filterType].includes(filterValue)) {
                            globalFilters.advanced[filterType].push(filterValue);
                        }
                    } else {
                        // Remove value
                        globalFilters.advanced[filterType] = globalFilters.advanced[filterType]
                            .filter(val => val !== filterValue);
                    }

                    // Update URL and reload properties
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }

        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    setupFilterControls() {
        // Location filter - ensure single selection
        const locationFilter = document.querySelector('.location-filter');
        if (locationFilter) {
            // Set initial value to Málaga
            locationFilter.value = 'Málaga';
            
            locationFilter.addEventListener('change', (e) => {
                // Only allow single location selection
                globalFilters.location = e.target.value;
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        }

        // Property type filter
        const propertyTypeFilter = document.querySelector('.property-type-filter');
        if (propertyTypeFilter) {
            propertyTypeFilter.addEventListener('change', (e) => {
                globalFilters.propertyType = e.target.value;
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        }

        // Price range filter
        const minPriceFilter = document.querySelector('.min-price-filter');
        const maxPriceFilter = document.querySelector('.max-price-filter');
        if (minPriceFilter) {
            minPriceFilter.addEventListener('change', (e) => {
                globalFilters.minPrice = e.target.value;
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        }
        if (maxPriceFilter) {
            maxPriceFilter.addEventListener('change', (e) => {
                globalFilters.maxPrice = e.target.value;
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        }

        // Bedrooms filter
        const bedroomsFilter = document.querySelector('.bedrooms-filter');
        if (bedroomsFilter) {
            bedroomsFilter.addEventListener('change', (e) => {
                globalFilters.bedrooms = e.target.value;
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        }

        // Bathrooms filter
        const bathroomsFilter = document.querySelector('.bathrooms-filter');
        if (bathroomsFilter) {
            bathroomsFilter.addEventListener('change', (e) => {
                globalFilters.bathrooms = e.target.value;
                this.updateUrlWithFilters();
                this.loadProperties(1);
            });
        }
    }

    initializeFiltersFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log('URL Parameters:', Object.fromEntries(urlParams.entries()));

        // Location - ensure single selection
        if (urlParams.has('Location')) {
            const locationFilter = document.querySelector('.location-filter');
            if (locationFilter) {
                const locationValue = urlParams.get('Location');
                console.log('Setting location from URL:', locationValue);
                locationFilter.value = locationValue;
                globalFilters.location = locationValue;
                
                // Find and check the corresponding checkbox
                const locationCheckbox = document.querySelector(`input[name="location"][value="${locationValue}"]`);
                if (locationCheckbox) {
                    console.log('Checking location checkbox:', locationValue);
                    locationCheckbox.checked = true;
                }
            }
        } else {
            // If no location in URL, set to Málaga
            const locationFilter = document.querySelector('.location-filter');
            if (locationFilter) {
                console.log('Setting default location to Málaga');
                locationFilter.value = 'Málaga';
                globalFilters.location = 'Málaga';
                
                // Find and check the Málaga checkbox
                const malagaCheckbox = document.querySelector('input[name="location"][value="Málaga"]');
                if (malagaCheckbox) {
                    console.log('Checking Málaga checkbox');
                    malagaCheckbox.checked = true;
                }
            }
        }

        // Update the selected text in the location filter
        this.updateSelectedText('location');

        // Property type
        if (urlParams.has('PropertyType')) {
            const propertyTypeFilter = document.querySelector('.property-type-filter');
            if (propertyTypeFilter) {
                const propertyTypes = urlParams.get('PropertyType').split(',');
                propertyTypeFilter.value = propertyTypes[0]; // Set first value as default
                globalFilters.propertyType = propertyTypes;
            }
        }

        // Price range
        if (urlParams.has('PMin')) {
            const minPriceFilter = document.querySelector('.min-price-filter');
            if (minPriceFilter) {
                minPriceFilter.value = urlParams.get('PMin');
                globalFilters.minPrice = parseInt(urlParams.get('PMin'));
            }
        }
        if (urlParams.has('PMax')) {
            const maxPriceFilter = document.querySelector('.max-price-filter');
            if (maxPriceFilter) {
                maxPriceFilter.value = urlParams.get('PMax');
                globalFilters.maxPrice = parseInt(urlParams.get('PMax'));
            }
        }

        // Bedrooms
        if (urlParams.has('Beds')) {
            const bedroomsFilter = document.querySelector('.bedrooms-filter');
            if (bedroomsFilter) {
                const bedrooms = urlParams.get('Beds').split(',').map(Number);
                bedroomsFilter.value = bedrooms[0]; // Set first value as default
                globalFilters.bedrooms = bedrooms;
            }
        }

        // Bathrooms
        if (urlParams.has('Baths')) {
            const bathroomsFilter = document.querySelector('.bathrooms-filter');
            if (bathroomsFilter) {
                const bathrooms = urlParams.get('Baths').split(',').map(Number);
                bathroomsFilter.value = bathrooms[0]; // Set first value as default
                globalFilters.bathrooms = bathrooms;

                // Check all corresponding checkboxes
                bathrooms.forEach(bath => {
                    const checkbox = document.querySelector(`input[name="bathrooms"][value="${bath}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        }

        // Quick filters
        if (urlParams.has('beach')) globalFilters.beach = true;
        if (urlParams.has('golf')) globalFilters.golf = true;
        if (urlParams.has('exclusive')) globalFilters.exclusive = true;
        if (urlParams.has('modern')) globalFilters.modern = true;
        if (urlParams.has('new')) globalFilters.new = true;

        // Advanced filters
        for (const [key, value] of urlParams.entries()) {
            if (key.startsWith('filter_')) {
                const filterType = key.replace('filter_', '');
                globalFilters.advanced[filterType] = value.split(',');
            }
        }

        // Update UI based on filters
        this.updateCheckboxesFromFilters(globalFilters);
        
        // Load properties if there are active filters
        if (Object.keys(globalFilters).some(key => {
            if (key === 'advanced') {
                return globalFilters.advanced && Object.keys(globalFilters.advanced).length > 0;
            }
            return globalFilters[key] && globalFilters[key] !== 'null' && globalFilters[key] !== 0;
        })) {
            if (this.searchByMap) {
                this.searchByMap.loadProperties(1);
            }
        }
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

        globalFilters.features = selectedFeatures;
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
                const isClickInside = advancedPanel.contains(e.target) || advancedToggle.contains(e.target);
                if (!isClickInside) {
                    advancedPanel.classList.remove('active');
                    advancedToggle.closest('.advanced-filters-toggle').classList.remove('active');
                }
            });

            // Handle filter option clicks
            const filterOptions = advancedPanel.querySelectorAll('.filter-option');
            filterOptions.forEach(option => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                const label = option.querySelector('label');

                if (checkbox && label) {
                    // Make the entire option clickable
             
                    // Handle checkbox changes
                    checkbox.addEventListener('change', () => {
                        // Update UI
                        option.classList.toggle('active', checkbox.checked);
                        label.classList.toggle('active', checkbox.checked);

                        // Get filter key from label's 'for' attribute
                        const filterKey = label.getAttribute('for');
                        if (!filterKey) return;

                        // Update filters object
                        if (!globalFilters.advanced) {
                            globalFilters.advanced = {};
                        }

                        // Set the filter value based on checkbox state
                        globalFilters.advanced[filterKey] = checkbox.checked;

                        // Update URL and reload properties
                        this.updateUrlWithFilters();
                        this.loadProperties(1);
                    });
                }
            });
        }
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
                globalFilters.beach = false;
                globalFilters.golf = false;
                globalFilters.exclusive = false;
                globalFilters.modern = false;
                globalFilters.new = false;

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
                switch (filterType) {
                    case 'beach':
                        globalFilters.beach = button.classList.contains('active');
                        break;
                    case 'golf':
                        globalFilters.golf = button.classList.contains('active');
                        break;
                    case 'exclusive':
                        globalFilters.exclusive = button.classList.contains('active');
                        break;
                    case 'modern':
                        globalFilters.modern = button.classList.contains('active');
                        break;
                    case 'new':
                        globalFilters.new = button.classList.contains('active');
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
        globalFilters.location = 'Málaga';
        globalFilters.propertyType = '';
        globalFilters.minPrice = 0;
        globalFilters.bedrooms = 0;
        globalFilters.bathrooms = 0;
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

    updateSelectedText(filterType) {
        const select = document.querySelector(`.custom-select[data-filter="${filterType}"]`);
        if (!select) {
            console.log(`Select element not found for filter type: ${filterType}`);
            return;
        }

        const header = select.querySelector('.select-header');
        const checkboxes = select.querySelectorAll(`input[name="${filterType}"]:checked`);

        if (!header) {
            console.log(`Header element not found for filter type: ${filterType}`);
            return;
        }

        console.log(`Updating selected text for ${filterType}. Checked checkboxes:`, Array.from(checkboxes).map(cb => cb.value));

        if (checkboxes.length === 0) {
            header.textContent = `All ${filterType.replace('_', ' ')}`;
            return;
        }

        const selectedValues = Array.from(checkboxes)
            .filter(checkbox => !checkbox.id.includes('-all'))
            .map(checkbox => checkbox.value);

        console.log(`Selected values for ${filterType}:`, selectedValues);

        if (selectedValues.length === 0) {
            header.textContent = `All ${filterType.replace('_', ' ')}`;
        } else if (selectedValues.length === 1) {
            header.textContent = selectedValues[0];
        } else {
            header.textContent = `${selectedValues.length} selected`;
        }

        // For location filter, ensure Málaga is selected if no other location is selected
        if (filterType === 'location' && selectedValues.length === 0) {
            const malagaCheckbox = select.querySelector('input[value="Málaga"]');
            if (malagaCheckbox) {
                console.log('No location selected, checking Málaga checkbox');
                malagaCheckbox.checked = true;
                header.textContent = 'Málaga';
            } else {
                console.log('Málaga checkbox not found');
            }
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

    resetAllFilters() {
        // Reset global filters
        globalFilters.location = 'Málaga';
        globalFilters.propertyType = '';
        globalFilters.minPrice = 0;
        globalFilters.maxPrice = 0;
        globalFilters.bedrooms = 0;
        globalFilters.bathrooms = 0;
        globalFilters.beach = false;
        globalFilters.golf = false;
        globalFilters.exclusive = false;
        globalFilters.modern = false;
        globalFilters.new = false;
        globalFilters.advanced = {};

        // Reset all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset all select elements
        document.querySelectorAll('select').forEach(select => {
            select.value = '';
        });

        // Reset location to Málaga
        const locationFilter = document.querySelector('.location-filter');
        if (locationFilter) {
            locationFilter.value = 'Málaga';
        }

        // Reset price inputs
        const minPriceFilter = document.querySelector('.min-price-filter');
        const maxPriceFilter = document.querySelector('.max-price-filter');
        if (minPriceFilter) minPriceFilter.value = '';
        if (maxPriceFilter) maxPriceFilter.value = '';

        // Update URL and reload properties
        this.updateUrlWithFilters();
        this.loadProperties(1);

        // Update selected text for all filters
        this.updateSelectedText('location');
        this.updateSelectedText('property_type');
        this.updateSelectedText('price');
        this.updateSelectedText('bedrooms');
        this.updateSelectedText('bathrooms');

        // Close all dropdowns
        document.querySelectorAll('.select-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        document.querySelectorAll('.filter-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.advanced-filters-panel').forEach(panel => {
            panel.classList.remove('active');
        });
    }

    debouncedCheckVisibleCities() {
        if (this.isMapUpdating) return;

        // Clear any existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Set new timer
        this.debounceTimer = setTimeout(() => {
            this.checkVisibleCities();
        }, this.debounceDelay);
    }

    checkVisibleCities() {
        if (!this.map || this.isMapUpdating) return;

        const bounds = this.map.getBounds();
        const newVisibleCities = new Set();

        // Check each city's coordinates against the current map bounds
        Object.entries(cityCoordinates).forEach(([city, coords]) => {
            const latLng = L.latLng(coords.lat, coords.lng);
            if (bounds.contains(latLng)) {
                newVisibleCities.add(city);
            }
        });

        // If visible cities have changed, update filters
        if (this.visibleCities.size !== newVisibleCities.size || 
            ![...this.visibleCities].every(city => newVisibleCities.has(city))) {
            
            this.visibleCities = newVisibleCities;
            this.updateFiltersFromVisibleCities();
        }
    }

    updateFiltersFromVisibleCities() {
        if (this.visibleCities.size === 0 || this.isMapUpdating) return;

        // Set updating state
        this.isMapUpdating = true;
        
        // Show global loader
        const globalLoader = document.querySelector('.global-loader');
        if (globalLoader) {
            globalLoader.style.display = 'flex';
            const loaderText = globalLoader.querySelector('.global-loader-text');
            const loaderSubtext = globalLoader.querySelector('.global-loader-subtext');
            if (loaderText) loaderText.textContent = 'Updating Map';
            if (loaderSubtext) loaderSubtext.textContent = 'Please wait while we update the visible properties...';
        }

        // Convert Set to Array for the filter
        const visibleCitiesArray = Array.from(this.visibleCities);
        
        // Update global filters
        globalFilters.location = visibleCitiesArray;
        
        // Update checkboxes
        document.querySelectorAll('input[name="location"]').forEach(checkbox => {
            checkbox.checked = visibleCitiesArray.includes(checkbox.value);
        });

        // Update URL and reload properties
        this.updateUrlWithFilters();
        
        // Load properties and hide loading indicator when done
        this.loadProperties(1).finally(() => {
            this.isMapUpdating = false;
            if (globalLoader) {
                globalLoader.style.display = 'none';
            }
        });
        
        // Update selected text
        this.updateSelectedText('location');
    }
}

// Initialize the map when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
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
        // Initialize SearchByMap first
        await window.searchByMap.initialize();
        // Then initialize PropertyFilters
        const propertyFilters = new PropertyFilters();
        propertyFilters.init();
    }
});

// PropertyFilters Class
class PropertyFilters {
    constructor() {
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

    showLoadingIndicator() {
        if (this.searchByMap) {
            this.searchByMap.showLoadingIndicator();
        }
    }

    hideLoadingIndicator() {
        if (this.searchByMap) {
            this.searchByMap.hideLoadingIndicator();
        }
    }

    updateCheckboxesFromFilters(filters) {
        if (this.searchByMap) {
            this.searchByMap.updateCheckboxesFromFilters(filters);
        }
    }

    updateSelectedText(filterType) {
        if (this.searchByMap) {
            this.searchByMap.updateSelectedText(filterType);
        }
    }

    updateFilters(newFilters) {
        // Show loading indicator
        this.showLoadingIndicator();

        // Only update filters that are provided in newFilters
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] === undefined || newFilters[key] === null) {
                delete globalFilters[key];
            } else {
                globalFilters[key] = newFilters[key];
            }
        });

        // Update URL parameters
        if (this.searchByMap) {
            this.searchByMap.updateUrlWithFilters();
            // Reload properties with the updated filters
            this.searchByMap.loadProperties(1).finally(() => {
                // Hide loading indicator when properties are loaded
                this.hideLoadingIndicator();
            });
        }
    }

    loadFiltersFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log('Loading filters from URL:', Object.fromEntries(urlParams.entries()));

        // Location - ensure single selection
        if (urlParams.has('Location')) {
            const locationFilter = document.querySelector('.location-filter');
            if (locationFilter) {
                const locationValue = urlParams.get('Location');
                console.log('Setting location from URL:', locationValue);
                locationFilter.value = locationValue;
                globalFilters.location = locationValue;
                
                // Find and check the corresponding checkbox
                const locationCheckbox = document.querySelector(`input[name="location"][value="${locationValue}"]`);
                if (locationCheckbox) {
                    console.log('Checking location checkbox:', locationValue);
                    locationCheckbox.checked = true;
                }
            }
        } else {
            // If no location in URL, set to Málaga
            const locationFilter = document.querySelector('.location-filter');
            if (locationFilter) {
                console.log('Setting default location to Málaga');
                locationFilter.value = 'Málaga';
                globalFilters.location = 'Málaga';
                
                // Find and check the Málaga checkbox
                const malagaCheckbox = document.querySelector('input[name="location"][value="Málaga"]');
                if (malagaCheckbox) {
                    console.log('Checking Málaga checkbox');
                    malagaCheckbox.checked = true;
                }
            }
        }

        // Update the selected text in the location filter
        this.updateSelectedText('location');

        // Property type
        if (urlParams.has('PropertyType')) {
            const propertyTypeFilter = document.querySelector('.property-type-filter');
            if (propertyTypeFilter) {
                const propertyTypes = urlParams.get('PropertyType').split(',');
                propertyTypeFilter.value = propertyTypes[0]; // Set first value as default
                globalFilters.propertyType = propertyTypes;
            }
        }

        // Price range
        if (urlParams.has('PMin')) {
            const minPriceFilter = document.querySelector('.min-price-filter');
            if (minPriceFilter) {
                minPriceFilter.value = urlParams.get('PMin');
                globalFilters.minPrice = parseInt(urlParams.get('PMin'));
            }
        }
        if (urlParams.has('PMax')) {
            const maxPriceFilter = document.querySelector('.max-price-filter');
            if (maxPriceFilter) {
                maxPriceFilter.value = urlParams.get('PMax');
                globalFilters.maxPrice = parseInt(urlParams.get('PMax'));
            }
        }

        // Bedrooms
        if (urlParams.has('Beds')) {
            const bedroomsFilter = document.querySelector('.bedrooms-filter');
            if (bedroomsFilter) {
                const bedrooms = urlParams.get('Beds').split(',').map(Number);
                bedroomsFilter.value = bedrooms[0]; // Set first value as default
                globalFilters.bedrooms = bedrooms;
            }
        }

        // Bathrooms
        if (urlParams.has('Baths')) {
            const bathroomsFilter = document.querySelector('.bathrooms-filter');
            if (bathroomsFilter) {
                const bathrooms = urlParams.get('Baths').split(',').map(Number);
                bathroomsFilter.value = bathrooms[0]; // Set first value as default
                globalFilters.bathrooms = bathrooms;

                // Check all corresponding checkboxes
                bathrooms.forEach(bath => {
                    const checkbox = document.querySelector(`input[name="bathrooms"][value="${bath}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        }

        // Quick filters
        if (urlParams.has('beach')) globalFilters.beach = true;
        if (urlParams.has('golf')) globalFilters.golf = true;
        if (urlParams.has('exclusive')) globalFilters.exclusive = true;
        if (urlParams.has('modern')) globalFilters.modern = true;
        if (urlParams.has('new')) globalFilters.new = true;

        // Advanced filters
        for (const [key, value] of urlParams.entries()) {
            if (key.startsWith('filter_')) {
                const filterType = key.replace('filter_', '');
                globalFilters.advanced[filterType] = value.split(',');
            }
        }

        // Update UI based on filters
        this.updateCheckboxesFromFilters(globalFilters);
        
        // Load properties if there are active filters
        if (Object.keys(globalFilters).some(key => {
            if (key === 'advanced') {
                return globalFilters.advanced && Object.keys(globalFilters.advanced).length > 0;
            }
            return globalFilters[key] && globalFilters[key] !== 'null' && globalFilters[key] !== 0;
        })) {
            if (this.searchByMap) {
                this.searchByMap.loadProperties(1);
            }
        }
    }

    setupEventListeners() {
        // Get all custom selects
        const customSelects = document.querySelectorAll('.custom-select');
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
                    this.updateFilters({ location: 'Málaga' }); // Default to Málaga when "All" is selected
                } else {
                    const allCheckbox = document.getElementById('location-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                    // Uncheck all other location checkboxes
                    locationCheckboxes.forEach(cb => {
                        if (cb !== checkbox && cb.id !== 'location-all') {
                            cb.checked = false;
                        }
                    });
                    this.updateFilters({ location: checkbox.value });
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
                    this.updateFilters({ bathrooms: [] });
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
}

// Add CSS animation for the spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);