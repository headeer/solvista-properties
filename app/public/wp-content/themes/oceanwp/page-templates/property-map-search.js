// Global filters object
const globalFilters = {
    location: 'Málaga',
    propertyType: '',
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    bedrooms: 0,
    bathrooms: 0,
    beach: false,
    golf: false,
    exclusive: false,
    modern: false,
    new: false,
    seaview: false,
    investment: false,
    minBuilt: 0,
    features: '',
    sortOrder: 'default',
    advanced: {}
};

// Add sorting options
const sortOptions = {
    'default': { label: 'Default', fn: (a, b) => 0 },
    'price-asc': { label: 'Price (Low to High)', fn: (a, b) => parseInt(a.price || 0) - parseInt(b.price || 0) },
    'price-desc': { label: 'Price (High to Low)', fn: (a, b) => parseInt(b.price || 0) - parseInt(a.price || 0) },
    'size-asc': { label: 'Size (Small to Large)', fn: (a, b) => parseInt(a.propertySize || 0) - parseInt(b.propertySize || 0) },
    'size-desc': { label: 'Size (Large to Small)', fn: (a, b) => parseInt(b.propertySize || 0) - parseInt(a.propertySize || 0) },
    'newest': { label: 'Newest First', fn: (a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0) }
};

// Add debug mode
const DEBUG = true;

// Helper function for logging
function debug(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Add city coordinates at the top of the file
const cityCoordinates = {
    'Málaga': { lat: 36.7213, lng: -4.4217 },
    'Marbella': { lat: 36.5101, lng: -4.8824 },
    'Estepona': { lat: 36.4182, lng: -5.1456 },
    'Fuengirola': { lat: 36.5394, lng: -4.6245 },
    'Mijas': { lat: 36.5956, lng: -4.6378 },
    'Benalmadena': { lat: 36.5982, lng: -4.5148 },
    'Torremolinos': { lat: 36.6177, lng: -4.5005 },
    'Antequera': { lat: 37.0196, lng: -4.5599 },
    'Ronda': { lat: 36.7465, lng: -5.1651 },
    'Sotogrande': { lat: 36.2814, lng: -5.2714 }
};

// Add this at the top of the file, after the globalFilters object
const featureMap = {
    'Beachfront': '1Setting1',
    'Frontline Golf': '1Setting2',
    'Town': '1Setting3',
    'Suburban': '1Setting4',
    'Country': '1Setting5',
    'Commercial Area': '1Setting6',
    'Beachside': '1Setting7',
    'Port': '1Setting8',
    'Village': '1Setting9',
    'Mountain Pueblo': '1Setting10',
    'Close To Golf': '1Setting11',
    'Close To Port': '1Setting12',
    'Close To Shops': '1Setting13',
    'Close To Sea': '1Setting14',
    'Close To Town': '1Setting15',
    'Close To Schools': '1Setting16',
    'Close To Skiing': '1Setting17',
    'Close To Forest': '1Setting18',
    'Marina': '1Setting19',
    'Close To Marina': '1Setting20',
    'Urbanisation': '1Setting21',
    'Front Line Beach Complex': '1Setting22',
    
    // Pool features
    'Communal Pool': '1Pool1',
    'Private Pool': '1Pool2',
    'Indoor Pool': '1Pool3',
    'Heated Pool': '1Pool4',
    'Room For Pool': '1Pool5',
    'Childrens Pool': '1Pool6'
};

// Add CSS for sorting dropdown
function addSortingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .property-sorting-toolbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        
        .sorting-container {
            display: flex;
            align-items: center;
        }
        
        .sorting-container label {
            margin-right: 10px;
            font-weight: 500;
        }
        
        .sorting-dropdown {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
            cursor: pointer;
            min-width: 180px;
        }
        
        .sorting-dropdown:focus {
            outline: none;
            border-color: #0073aa;
        }

        /* Button Styles */
        .view-details-btn, .property-link {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1a1a1a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            text-align: center;
            font-size: 14px;
        }

        .view-details-btn:hover, .property-link:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .view-details-btn:active, .property-link:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Property Card Button Styles */
        .property-card .property-link {
            width: 100%;
            margin-top: 15px;
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 4px;
            text-align: center;
            display: block;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .property-card .property-link:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            color: white!important;
        }

        /* Popup Button Styles */
        .property-popup .view-details-btn {
            width: 100%;
            margin-top: 15px;
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 4px;
            text-align: center;
            display: block;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .property-popup .view-details-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Quick Filter Button Styles */
        .quick-filter-button {
            padding: 8px 16px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            color: #333;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .quick-filter-button:hover {
            opacity: 0.9;
            background-color: #e5e5e5;
        }

        .quick-filter-button.active {
            background-color: #1a1a1a;
            color: #ffffff;
            border-color: #1a1a1a;
        }

        .quick-filter-button.active:hover {
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
}

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
        
        // Store instance in window object for global access
        window.searchByMap = this;
        
        // Create debounced version of loadProperties that returns a Promise
        this.debouncedLoadProperties = (page) => {
            return new Promise((resolve, reject) => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.loadProperties(page)
                        .then(resolve)
                        .catch(reject);
                }, 300);
            });
        };
    }

    async initialize() {
        if (this.initialized) {
            return;
        }

        try {
            debug('Initializing SearchByMap');
            await this.loadScripts();
            
            // Add sorting styles
            addSortingStyles();
            
            this.initMap();
            this.setupFilterControls();
            this.initializeQuickFilters();
            this.setupEventListeners();
            
            // Initialize the max price filter manually
            this.initializeMaxPriceFilter();
            
            // Always load properties with default location
            await this.loadProperties(1);
            
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing map:', error);
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
            zoom: 14, // Increased initial zoom level
            zoomControl: true,
            minZoom: 11, // Higher min zoom level to prevent excessive zoom out
            maxZoom: 19, // Increased max zoom for more detail
            crs: L.CRS.EPSG3857, // Explicitly set the coordinate reference system
            scrollWheelZoom: 'center', // Center-focused zoom with scroll wheel
            wheelDebounceTime: 100 // Add debounce to wheel zooming
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Prevent zoom out beyond minZoom
        this.map.on('zoomend', () => {
            if (this.map.getZoom() < 11) {
                this.map.setZoom(11);
            }
        });

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

    getApiUrl(page = 1) {
        const params = new URLSearchParams();
        
        // Add location filter
        if (globalFilters.location) {
            params.append('Location', globalFilters.location);
        }
        
        // Add property type filter
        if (globalFilters.propertyType) {
            params.append('PropertyType', globalFilters.propertyType);
        }
        
        // Add price range filters
        if (globalFilters.minPrice > 0) {
            params.append('PMin', globalFilters.minPrice);
        }
        if (globalFilters.maxPrice > 0) {
            params.append('PMax', globalFilters.maxPrice);
        }
        
        // Add size range filters
        if (globalFilters.minSize > 0) {
            params.append('MinSize', globalFilters.minSize);
        }
        if (globalFilters.maxSize > 0) {
            params.append('MaxSize', globalFilters.maxSize);
        }
        
        // Add bedrooms filter
        if (globalFilters.bedrooms > 0) {
            params.append('Beds', globalFilters.bedrooms);
        }
        
        // Add bathrooms filter
        if (globalFilters.bathrooms > 0) {
            params.append('Baths', globalFilters.bathrooms);
        }
        
        // Add features filter
        if (globalFilters.features) {
            params.append('features', globalFilters.features);
        }
        
        // Add min built size filter - use MinSize instead
        if (globalFilters.minBuilt > 0) {
            params.append('MinSize', globalFilters.minBuilt);
        }
        
        // Add sort order filter
        if (globalFilters.sortOrder) {
            params.append('SortOrder', globalFilters.sortOrder);
        }
        
        // Add quick filters
        if (globalFilters.beach) {
            params.append('Beach', '1');
        }
        if (globalFilters.golf) {
            params.append('Golf', '1');
        }
        if (globalFilters.exclusive) {
            params.append('Exclusive', '1');
        }
        if (globalFilters.new) {
            params.append('New', '1');
        }
        if (globalFilters.seaview) {
            params.append('Seaview', '1');
        }
        if (globalFilters.investment) {
            params.append('Investment', '1');
        }
        
        // Add pagination
        params.append('page', page);
        
        return `${this.config.apiUrl}?${params.toString()}`;
    }

    async loadProperties(page = 1) {
        if (this.isLoading) {
            console.log('Properties are already loading, skipping request');
            return;
        }

        this.isLoading = true;
        this.currentPage = page;
        console.log('Loading properties, page:', page);
        
        try {
            // Show loader
            if (window.showGlobalLoader) {
                window.showGlobalLoader();
            }

            // Build API URL with filter parameters
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
            
            // Ensure both minPrice and maxPrice are properly set
            if (globalFilters.minPrice > 0) params.set('PMin', globalFilters.minPrice);
            if (globalFilters.maxPrice > 0) params.set('PMax', globalFilters.maxPrice);
            
            // Add size parameters
            if (globalFilters.minSize > 0) params.set('MinSize', globalFilters.minSize);
            if (globalFilters.maxSize > 0) params.set('MaxSize', globalFilters.maxSize);
            
            // Handle minBuilt as MinSize if minSize is not set
            if (globalFilters.minSize === 0 && globalFilters.minBuilt > 0) {
                params.set('MinSize', globalFilters.minBuilt);
            }
            
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
            if (globalFilters.seaview) params.set('SeaView', 'true');
            if (globalFilters.investment) params.set('Investment', 'true');

            // Add advanced filters with correct parameter names
            if (globalFilters.features && globalFilters.features !== 'any') params.set('Features', globalFilters.features);
            if (globalFilters.sortOrder && globalFilters.sortOrder !== 'default') params.set('SortOrder', globalFilters.sortOrder);

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
            this.totalPages = Math.ceil(this.properties.length / this.config.itemsPerPage);
            
            // Update URL with current filters
            this.updateUrlWithFilters();
            
            // Display properties
            this.displayProperties();
        } catch (error) {
            console.error('Error loading properties:', error);
            this.properties = [];
            this.totalPages = 0;
            this.displayProperties();
        } finally {
            // Hide loader
            if (window.hideGlobalLoader) {
                window.hideGlobalLoader();
            }
            this.isLoading = false;
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
                lat: (Math.random() - 0.5) * 0.015,
                lng: (Math.random() - 0.5) * 0.015
            } : { lat: 0, lng: 0 };

            // Create marker with validated coordinates and offset
            const markerLatLng = [latitude + offset.lat, longitude + offset.lng];

            return {
                id: property.reference,
                reference: property.reference,
                title: property.reference,
                price: property.price || 0,
                location: property.location || 'Location not specified',
                beds: property.beds || "",
                baths: property.baths || "",
                propertySize: property.propertySize || '',
                area: property.area || '',
                image: property.pictureUrl,
                status: 'For Sale',
                propertyType: property.propertyType || 'Property',
                latitude: markerLatLng[0],
                longitude: markerLatLng[1],
                province: property.province,
                description: property.description || '',
                features: [],
                dateAdded: new Date().toISOString(),
                isFeatured: false,
                isNew: false,
                isReduced: false,
                url: property.propertyUrl // Use the URL directly from the API response
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
        let container = document.querySelector('.property-list');
        if (!container) {
            container = document.createElement('div');
            container.className = 'property-list';
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.parentNode.insertBefore(container, mapContainer.nextSibling);
            } else {
                console.error('Map container not found, cannot create properties container');
                return;
            }
        }

        // Clear existing content
        container.innerHTML = '';

        // Update results count
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = this.properties.length;
        }

        if (this.properties.length === 0) {
            // Display no properties message
            const noProperties = document.createElement('div');
            noProperties.className = 'no-properties-message';
            noProperties.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No Properties Found</h3>
                <p>Try adjusting your search filters</p>
            `;
            container.appendChild(noProperties);
            return;
        }

        // Sort properties based on selected sort order
        this.sortProperties();

        // Create properties grid
        const propertiesGrid = document.createElement('div');
        propertiesGrid.className = 'properties-grid';
        container.appendChild(propertiesGrid);
        
        // Add new markers and create property cards
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
                            iconAnchor: [28, 38] // Adjusted to position marker lower
                        })
                    });

                    marker.propertyId = property.id;

                    // Create popup content
                    const popupContent = this.createPropertyPopup(property);
                    marker.bindPopup(popupContent, {
                        offset: L.point(0, -150), // Adjusted to position popup lower
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
        } else {
            console.warn('Map or markerCluster not initialized, skipping marker creation');
            this.properties.forEach(property => {
                this.createPropertyCard(property, propertiesGrid);
            });
        }
    }

    // New method to sort properties
    sortProperties() {
        if (!this.properties || this.properties.length === 0) return;

        debug('Sorting properties by:', globalFilters.sortOrder);
        
        // Get sorting function from options
        const sortOption = sortOptions[globalFilters.sortOrder] || sortOptions.default;
        
        // Apply sorting
        this.properties.sort(sortOption.fn);
        
        debug('Sorted properties:', this.properties.length);
    }

    // New method to create sorting dropdown
    createSortingDropdown(container) {
        // Check if sorting dropdown already exists
        if (document.getElementById('property-sorting-dropdown')) return;
        
        // Create sorting toolbar
        const sortingToolbar = document.createElement('div');
        sortingToolbar.className = 'property-sorting-toolbar';
        sortingToolbar.innerHTML = `
            <div class="sorting-container">
                <label for="property-sorting-dropdown">Sort By:</label>
                <select id="property-sorting-dropdown" class="sorting-dropdown">
                    ${Object.entries(sortOptions).map(([key, option]) => 
                        `<option value="${key}" ${globalFilters.sortOrder === key ? 'selected' : ''}>${option.label}</option>`
                    ).join('')}
                </select>
            </div>
        `;
        
        // Insert before the properties grid
        const propertiesGrid = container.querySelector('.properties-grid');
        if (propertiesGrid) {
            container.insertBefore(sortingToolbar, propertiesGrid);
        } else {
            container.appendChild(sortingToolbar);
        }
        
        // Add event listener to dropdown
        const sortingDropdown = document.getElementById('property-sorting-dropdown');
        if (sortingDropdown) {
            sortingDropdown.addEventListener('change', (e) => {
                const newSortOrder = e.target.value;
                debug('Sort order changed to:', newSortOrder);
                
                // Update global filter
                globalFilters.sortOrder = newSortOrder;
                
                // Sort properties and update display without fetching from API
                this.sortProperties();
                
                // Just redisplay the properties without making an API call
                const container = document.querySelector('.property-list');
                if (container) {
                    const propertiesGrid = container.querySelector('.properties-grid');
                    if (propertiesGrid) {
                        // Clear existing property cards
                        propertiesGrid.innerHTML = '';
                        
                        // Create property cards with sorted properties
                        this.properties.forEach(property => {
                            this.createPropertyCard(property, propertiesGrid);
                        });
                    }
                }
                
                // Update URL with new sort order
                this.updateUrlWithFilters();
            });
        }
    }

    updateFilters(newFilters) {
        debug('Updating filters:', newFilters);

        // Show loading indicator
        if (window.showGlobalLoader) {
            window.showGlobalLoader();
        }

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
        
        // Use the SearchByMap instance to load properties
        if (this.searchByMap) {
            this.searchByMap.debouncedLoadProperties(1)
                .then(() => {
                    // Hide loading indicator when properties are loaded
                    if (window.hideGlobalLoader) {
                        window.hideGlobalLoader();
                    }
                })
                .catch(error => {
                    console.error('Error loading properties:', error);
                    // Hide loading indicator even if there's an error
                    if (window.hideGlobalLoader) {
                        window.hideGlobalLoader();
                    }
                });
        } else {
            console.error('SearchByMap instance not found');
            if (window.hideGlobalLoader) {
                window.hideGlobalLoader();
            }
        }
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
                key === 'MinSize' ||
                key === 'MaxSize' ||
                key === 'Beds' ||
                key === 'Baths' ||
                key === 'beach' ||
                key === 'golf' ||
                key === 'exclusive' ||
                key === 'modern' ||
                key === 'new' ||
                key === 'seaview' ||
                key === 'investment' ||
                key === 'min-built' ||
                key === 'features' ||
                key === 'sort') {
                urlParams.delete(key);
            }
        }

        // Add quick filters to URL
        if (globalFilters.beach) urlParams.set('beach', 'true');
        if (globalFilters.golf) urlParams.set('golf', 'true');
        if (globalFilters.exclusive) urlParams.set('exclusive', 'true');
        if (globalFilters.modern) urlParams.set('modern', 'true');
        if (globalFilters.new) urlParams.set('new', 'true');
        if (globalFilters.seaview) urlParams.set('seaview', 'true');
        if (globalFilters.investment) urlParams.set('investment', 'true');

        // Add advanced filters to URL (only if true)
        if (globalFilters.minBuilt > 0) {
            urlParams.set('MinSize', globalFilters.minBuilt);
        } else if (globalFilters.minSize > 0) {
            urlParams.set('MinSize', globalFilters.minSize);
        }
        
        if (globalFilters.maxSize > 0) {
            urlParams.set('MaxSize', globalFilters.maxSize);
        }
        
        if (globalFilters.features && globalFilters.features !== 'any') urlParams.set('features', globalFilters.features);
        if (globalFilters.sortOrder && globalFilters.sortOrder !== 'default') urlParams.set('sort', globalFilters.sortOrder);

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
        if (globalFilters.minSize > 0) {
            urlParams.set('MinSize', globalFilters.minSize);
        }
        if (globalFilters.maxSize > 0) {
            urlParams.set('MaxSize', globalFilters.maxSize);
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
        
        // Log the updated URL for debugging
        console.log('Updated URL:', newUrl);
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

            // Toggle advanced filters
            const toggleAdvancedFiltersBtn = document.querySelector('.toggle-advanced-filters');
            const advancedFiltersContainer = document.querySelector('.advanced-filters-container');
            
            if (toggleAdvancedFiltersBtn && advancedFiltersContainer) {
                toggleAdvancedFiltersBtn.addEventListener('click', () => {
                    const isHidden = advancedFiltersContainer.style.display === 'none';
                    advancedFiltersContainer.style.display = isHidden ? 'block' : 'none';
                    
                    // Update button text
                    const buttonText = toggleAdvancedFiltersBtn.querySelector('span');
                    if (buttonText) {
                        buttonText.textContent = isHidden ? 'Hide Advanced Filters' : 'Advanced Filters';
                    }
                });
            }

            // Setup filter controls
            this.setupFilterControls();

            // Map container
            const mapContainer = document.querySelector('.property-search-map-container');
            if (mapContainer) {
                mapContainer.addEventListener('click', (e) => {
                    if (e.target === mapContainer) {
                        filterContent?.classList.remove('active');
                        filterToggle?.classList.remove('active');
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
            });

            // Initialize filters from URL parameters
            this.initializeFiltersFromUrl();

            // Add map movement detection
            if (this.map) {
                let mapMoveTimeout;
                let isMapLoading = false;

                // Disable map movement while loading
                const disableMapMovement = () => {
                    if (this.map) {
                        this.map.dragging.disable();
                        this.map.touchZoom.disable();
                        this.map.doubleClickZoom.disable();
                        this.map.scrollWheelZoom.disable();
                        this.map.boxZoom.disable();
                        this.map.keyboard.disable();
                    }
                };

                // Enable map movement after loading
                const enableMapMovement = () => {
                    if (this.map) {
                        this.map.dragging.enable();
                        this.map.touchZoom.enable();
                        this.map.doubleClickZoom.enable();
                        this.map.scrollWheelZoom.enable();
                        this.map.boxZoom.enable();
                        this.map.keyboard.enable();
                    }
                };

                this.map.on('moveend', () => {
                    if (isMapLoading) return;
                    if (mapMoveTimeout) clearTimeout(mapMoveTimeout);
                    mapMoveTimeout = setTimeout(async () => {
                        const bounds = this.map.getBounds();
                        const center = bounds.getCenter();
                        const citiesInView = [];
                        for (const [city, coords] of Object.entries(cityCoordinates)) {
                            const distance = this.calculateDistance(center.lat, center.lng, coords.lat, coords.lng);
                            if (distance <= 10) citiesInView.push(city);
                        }
                        if (!arraysEqual(citiesInView, lastVisibleCities)) {
                            lastVisibleCities = citiesInView.slice();
                            globalFilters.location = citiesInView;
                            // Update query params
                            if (typeof this.updateUrlWithFilters === 'function') {
                                this.updateUrlWithFilters();
                            } else if (window.searchByMap && typeof window.searchByMap.updateUrlWithFilters === 'function') {
                                window.searchByMap.updateUrlWithFilters();
                            }
                            // Update location filter UI
                            if (typeof this.updateCheckboxesFromFilters === 'function') {
                                this.updateCheckboxesFromFilters(globalFilters);
                            } else if (window.searchByMap && typeof window.searchByMap.updateCheckboxesFromFilters === 'function') {
                                window.searchByMap.updateCheckboxesFromFilters(globalFilters);
                            }
                            if (window.showGlobalLoader) {
                                window.showGlobalLoader();
                                isMapLoading = true;
                                disableMapMovement();
                            }
                            try {
                                await this.loadProperties(1);
                            } catch (error) {
                                console.error('Error loading properties:', error);
                            } finally {
                                if (window.hideGlobalLoader) window.hideGlobalLoader();
                                isMapLoading = false;
                                enableMapMovement();
                            }
                        } else {
                            console.log('Cities in view did not change, skipping API call.');
                        }
                    }, 500);
                });
            }

        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    setupFilterControls() {
        try {
            debug('Setting up filter controls');
            
            // Setup custom select dropdowns
            document.querySelectorAll('.custom-select').forEach(select => {
                const header = select.querySelector('.select-header');
                const dropdown = select.querySelector('.select-dropdown');
                
                if (header && dropdown) {
                    // Toggle dropdown on header click
                    header.addEventListener('click', (e) => {
                        e.stopPropagation();
                        
                        // Close all other dropdowns
                        document.querySelectorAll('.custom-select.open').forEach(otherSelect => {
                            if (otherSelect !== select) {
                                otherSelect.classList.remove('open');
                                otherSelect.querySelector('.select-dropdown').style.display = 'none';
                            }
                        });
                        
                        // Toggle this dropdown
                        const isOpen = select.classList.toggle('open');
                        dropdown.style.display = isOpen ? 'block' : 'none';
                    });
                    
                    // Setup search functionality
                    const searchInput = dropdown.querySelector('.search-box input');
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            const searchValue = e.target.value.toLowerCase();
                            const options = dropdown.querySelectorAll('.checkbox-wrapper-4');
                            
                            options.forEach(option => {
                                const text = option.textContent.toLowerCase();
                                option.style.display = text.includes(searchValue) ? '' : 'none';
                            });
                        });
                        
                        // Prevent dropdown from closing when clicking in search input
                        searchInput.addEventListener('click', (e) => {
                            e.stopPropagation();
                        });
                    }
                    
                    // Prevent dropdown from closing when clicking inside dropdown
                    dropdown.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
            });
            
            // Close all dropdowns when clicking outside
            document.addEventListener('click', () => {
                document.querySelectorAll('.custom-select.open').forEach(select => {
                    select.classList.remove('open');
                    const dropdown = select.querySelector('.select-dropdown');
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                });
            });

            // Location filter - ensure single selection
            const locationFilter = document.querySelector('.location-filter');
            if (locationFilter) {
                // Set initial value to Málaga
                locationFilter.value = 'Málaga';
                globalFilters.location = 'Málaga';
                
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
                    const value = e.target.value;
                    globalFilters.propertyType = value === 'any' ? '' : value;
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }

            // Price range filter
            const minPriceFilter = document.querySelector('.min-price-filter');
            const maxPriceFilter = document.querySelector('.max-price-filter');
            if (minPriceFilter) {
                minPriceFilter.addEventListener('change', (e) => {
                    const value = e.target.value;
                    globalFilters.minPrice = value === 'any' ? 0 : parseInt(value);
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }
            if (maxPriceFilter) {
                maxPriceFilter.addEventListener('change', (e) => {
                    const value = e.target.value;
                    globalFilters.maxPrice = value === 'any' ? 0 : parseInt(value);
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }

            // Size range filter - min size
            const minSizeFilter = document.querySelector('.min-size-filter');
            if (minSizeFilter) {
                minSizeFilter.addEventListener('change', (e) => {
                    const value = e.target.value;
                    globalFilters.minSize = value === 'any' ? 0 : parseInt(value);
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }
            
            // Size range filter - max size
            const maxSizeFilter = document.querySelector('.max-size-filter');
            if (maxSizeFilter) {
                maxSizeFilter.addEventListener('change', (e) => {
                    const value = e.target.value;
                    globalFilters.maxSize = value === 'any' ? 0 : parseInt(value);
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }

            // Bedrooms filter
            const bedroomsFilter = document.querySelector('.bedrooms-filter');
            if (bedroomsFilter) {
                bedroomsFilter.addEventListener('change', (e) => {
                    const value = e.target.value;
                    globalFilters.bedrooms = value === 'any' ? 0 : parseInt(value);
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }

            // Bathrooms filter
            const bathroomsFilter = document.querySelector('.bathrooms-filter');
            if (bathroomsFilter) {
                bathroomsFilter.addEventListener('change', (e) => {
                    const value = e.target.value;
                    globalFilters.bathrooms = value === 'any' ? 0 : parseInt(value);
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }

            // Features filter - handle checkboxes
            const featuresCheckboxes = document.querySelectorAll('input[name="features"]');
            if (featuresCheckboxes.length > 0) {
                featuresCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        const selectedFeatures = Array.from(featuresCheckboxes)
                            .filter(cb => cb.checked)
                            .map(cb => cb.value); // Use the value directly as it should be the ParamName
                        
                        globalFilters.features = selectedFeatures.join(',');
                        this.updateUrlWithFilters();
                        this.loadProperties(1);
                    });
                });
            }

            // Min Built Size filter - handle checkboxes as single selection
            const minBuiltCheckboxes = document.querySelectorAll('input[name="min-built"]');
            if (minBuiltCheckboxes.length > 0) {
                minBuiltCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        // Uncheck all other min-built checkboxes
                        minBuiltCheckboxes.forEach(cb => {
                            if (cb !== checkbox) {
                                cb.checked = false;
                            }
                        });
                        
                        const value = checkbox.value;
                        globalFilters.minBuilt = value === 'any' ? 0 : parseInt(value);
                        
                        // Update the selected text in the dropdown
                        const selectHeader = checkbox.closest('.custom-select').querySelector('.selected-text');
                        if (selectHeader) {
                            const label = checkbox.nextElementSibling.querySelector('span');
                            selectHeader.textContent = label ? label.textContent : 'Choose size';
                        }
                        
                        this.updateUrlWithFilters();
                        this.loadProperties(1);
                    });
                });
            }

            // Price To filter - handle checkboxes
            const maxPriceCheckboxes = document.querySelectorAll('input[name="max-price"]');
            debug('Price to checkboxes found:', maxPriceCheckboxes.length);
            if (maxPriceCheckboxes.length > 0) {
                maxPriceCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        debug('Price to checkbox changed:', checkbox.value);
                        
                        // Uncheck other price to checkboxes
                        maxPriceCheckboxes.forEach(cb => {
                            if (cb !== checkbox) {
                                cb.checked = false;
                            }
                        });
                        
                        const value = checkbox.value;
                        globalFilters.maxPrice = value === 'any' ? 0 : parseInt(value);
                        debug('Set maxPrice to:', globalFilters.maxPrice);
                        
                        // Update the selected text in the dropdown
                        const selectHeader = checkbox.closest('.custom-select')?.querySelector('.selected-text');
                        if (selectHeader) {
                            const label = checkbox.nextElementSibling?.querySelector('span');
                            selectHeader.textContent = label ? label.textContent : 'Choose price to';
                        }
                        
                        this.updateUrlWithFilters();
                        this.loadProperties(1);
                    });
                });
            } else {
                console.warn('No price to checkboxes found with name="max-price"');
                // Try to find checkboxes with alternative naming
                const altMaxPriceCheckboxes = document.querySelectorAll('.custom-select[data-filter="max-price"] input[type="checkbox"]');
                debug('Alternative price to checkboxes found:', altMaxPriceCheckboxes.length);
                if (altMaxPriceCheckboxes.length > 0) {
                    altMaxPriceCheckboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', (e) => {
                            debug('Alt price to checkbox changed:', checkbox.value);
                            
                            // Uncheck other price to checkboxes
                            altMaxPriceCheckboxes.forEach(cb => {
                                if (cb !== checkbox) {
                                    cb.checked = false;
                                }
                            });
                            
                            const value = checkbox.value;
                            globalFilters.maxPrice = value === 'any' ? 0 : parseInt(value);
                            debug('Set maxPrice to:', globalFilters.maxPrice);
                            
                            // Update the selected text in the dropdown
                            const selectHeader = checkbox.closest('.custom-select')?.querySelector('.selected-text');
                            if (selectHeader) {
                                const label = checkbox.nextElementSibling?.querySelector('span');
                                selectHeader.textContent = label ? label.textContent : 'Choose price to';
                            }
                            
                            this.updateUrlWithFilters();
                            this.loadProperties(1);
                        });
                    });
                }
            }

            // Quick filters
            const quickFilterButtons = document.querySelectorAll('.quick-filter-button');
            quickFilterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filterType = button.dataset.filter;
                    button.classList.toggle('active');
                    
                    // Update global filters based on button state
                    switch (filterType) {
                        case 'beachfront':
                            globalFilters.beach = button.classList.contains('active');
                            break;
                        case 'golf':
                            globalFilters.golf = button.classList.contains('active');
                            break;
                        case 'luxury':
                            globalFilters.exclusive = button.classList.contains('active');
                            break;
                        case 'new-development':
                            globalFilters.new = button.classList.contains('active');
                            break;
                        case 'sea-view':
                            globalFilters.seaview = button.classList.contains('active');
                            break;
                        case 'investment':
                            globalFilters.investment = button.classList.contains('active');
                            break;
                    }
                    
                    // Update URL and reload properties
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            });

            // Initialize filters from URL
            this.initializeFiltersFromUrl();

            // Sort filter - handle checkboxes
            const sortCheckboxes = document.querySelectorAll('input[name="sort"]');
            if (sortCheckboxes.length > 0) {
                debug('Found sort checkboxes:', sortCheckboxes.length);
                sortCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        debug('Sort checkbox changed:', checkbox.value);
                        
                        // Uncheck other sort checkboxes
                        sortCheckboxes.forEach(cb => {
                            if (cb !== checkbox) {
                                cb.checked = false;
                            }
                        });
                        
                        const value = checkbox.value;
                        
                        // Update the selected text in the dropdown
                        const selectHeader = checkbox.closest('.custom-select')?.querySelector('.selected-text');
                        if (selectHeader) {
                            const label = checkbox.nextElementSibling?.querySelector('span');
                            selectHeader.textContent = label ? label.textContent : 'Choose sorting';
                        }
                        
                        // Update global filter and resort
                        globalFilters.sortOrder = value;
                        
                        // Sort properties and update display without fetching from API
                        this.sortProperties();
                        
                        // Just redisplay the properties without making an API call
                        const container = document.querySelector('.property-list');
                        if (container) {
                            const propertiesGrid = container.querySelector('.properties-grid');
                            if (propertiesGrid) {
                                // Clear existing property cards
                                propertiesGrid.innerHTML = '';
                                
                                // Create property cards with sorted properties
                                this.properties.forEach(property => {
                                    this.createPropertyCard(property, propertiesGrid);
                                });
                            }
                        }
                        
                        // Update URL with new sort order
                        this.updateUrlWithFilters();
                    });
                });
            } else {
                console.warn('No sort checkboxes found with name="sort"');
            }

            // Reset filters button
            const resetButton = document.querySelector('.clear-all-filters');
            if (resetButton) {
                resetButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    debug('Clearing all filters');
                    
                    // Show loader
                    if (window.showGlobalLoader) {
                        window.showGlobalLoader();
                    }

                    // Reset all checkboxes
                    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        checkbox.checked = false;
                    });

                    // Reset all select dropdowns text
                    document.querySelectorAll('.custom-select .selected-text').forEach(text => {
                        const defaultText = text.closest('.custom-select').dataset.filter;
                        text.textContent = defaultText ? `Choose ${defaultText}` : 'Choose option';
                    });

                    // Reset global filters to default values
                    Object.assign(globalFilters, {
                        location: 'Málaga',
                        propertyType: '',
                        minPrice: 0,
                        maxPrice: 0,
                        minSize: 0,
                        maxSize: 0,
                        bedrooms: 0,
                        bathrooms: 0,
                        beach: false,
                        golf: false,
                        exclusive: false,
                        modern: false,
                        new: false,
                        seaview: false,
                        investment: false,
                        minBuilt: 0,
                        features: '',
                        sortOrder: 'default',
                        advanced: {}
                    });

                    // Reset quick filter buttons
                    document.querySelectorAll('.quick-filter-button').forEach(button => {
                        button.classList.remove('active');
                    });

                    // Reset location to Málaga
                    const locationFilter = document.querySelector('.location-filter');
                    if (locationFilter) {
                        locationFilter.value = 'Málaga';
                    }

                    // Check the Málaga checkbox
                    const malagaCheckbox = document.querySelector('input[name="location"][value="Málaga"]');
                    if (malagaCheckbox) {
                        malagaCheckbox.checked = true;
                    }

                    // Update URL and reload properties
                    this.updateUrlWithFilters();
                    this.loadProperties(1).finally(() => {
                        // Hide loader when done
                        if (window.hideGlobalLoader) {
                            window.hideGlobalLoader();
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error setting up filter controls:', error);
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

        // Size range
        if (urlParams.has('MinSize')) {
            const minSizeFilter = document.querySelector('.min-size-filter');
            if (minSizeFilter) {
                minSizeFilter.value = urlParams.get('MinSize');
                globalFilters.minSize = parseInt(urlParams.get('MinSize'));
            }
        }
        if (urlParams.has('MaxSize')) {
            const maxSizeFilter = document.querySelector('.max-size-filter');
            if (maxSizeFilter) {
                maxSizeFilter.value = urlParams.get('MaxSize');
                globalFilters.maxSize = parseInt(urlParams.get('MaxSize'));
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
                // Don't load properties here - it will be loaded by the initialize method
                // this.searchByMap.loadProperties(1);
            }
        }

        // Sort order
        if (urlParams.has('sort')) {
            const sortValue = urlParams.get('sort');
            const sortCheckbox = document.querySelector(`input[name="sort"][value="${sortValue}"]`);
            if (sortCheckbox) {
                sortCheckbox.checked = true;
                globalFilters.sortOrder = sortValue;
                
                // Update the selected text in the dropdown
                const selectHeader = sortCheckbox.closest('.custom-select')?.querySelector('.selected-text');
                if (selectHeader) {
                    const label = sortCheckbox.nextElementSibling?.querySelector('span');
                    selectHeader.textContent = label ? label.textContent : 'Choose sorting';
                }
            }
        }
    }

    showTooltip(content, latlng) {
        this.tooltipContainer.innerHTML = content;
        this.tooltipContainer.appendChild(this.closeButton);
        this.tooltipContainer.style.display = 'block';
        
        // Position the tooltip
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        // Get map dimensions
        const mapRect = mapContainer.getBoundingClientRect();
        
        // Get pixel coordinates relative to the map
        const point = this.map.latLngToContainerPoint(latlng);
        
        // Position tooltip below the marker with a small offset
        const tooltipTop = point.y + 10; // 10px below the marker
        const tooltipLeft = point.x + 10; // 10px to the right of the marker
        
        // Adjust if the tooltip would go outside the map
        this.tooltipContainer.style.top = `${tooltipTop}px`;
        this.tooltipContainer.style.left = `${tooltipLeft}px`;
    }

    updateAdvancedFilters() {
        const selectedFeatures = Array.from(document.querySelectorAll('.advanced-filters input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        
        // Update global filters with selected advanced filters
        globalFilters.features = selectedFeatures.join(',');
        this.updateUrlWithFilters();
        this.loadProperties(1);
    }

    initializeQuickFilters() {
        try {
            const quickFilters = document.querySelector('.quick-filters-section');
            if (!quickFilters) {
                console.warn('Quick filters section not found');
                return;
            }
            
            const clearAllButton = quickFilters.querySelector('.clear-all-filters');
            
            if (clearAllButton) {
                clearAllButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Reset quick filter buttons
                    document.querySelectorAll('.quick-filter-button').forEach(button => {
                        button.classList.remove('active');
                    });
                    
                    // Reset quick filter values in global filters
                    globalFilters.beach = false;
                    globalFilters.golf = false;
                    globalFilters.exclusive = false;
                    globalFilters.modern = false;
                    globalFilters.new = false;
                    globalFilters.seaview = false;
                    globalFilters.investment = false;
                    
                    // Update URL and reload properties
                    this.updateUrlWithFilters();
                    this.loadProperties(1);
                });
            }
            
            // Set initial state of quick filter buttons from URL params
            const urlParams = new URLSearchParams(window.location.search);
            document.querySelectorAll('.quick-filter-button').forEach(button => {
                const filterType = button.dataset.filter;
                let isActive = false;
                
                switch (filterType) {
                    case 'beachfront':
                        isActive = urlParams.has('beach') || globalFilters.beach;
                        globalFilters.beach = isActive;
                        break;
                    case 'golf':
                        isActive = urlParams.has('golf') || globalFilters.golf;
                        globalFilters.golf = isActive;
                        break;
                    case 'luxury':
                        isActive = urlParams.has('exclusive') || globalFilters.exclusive;
                        globalFilters.exclusive = isActive;
                        break;
                    case 'new-development':
                        isActive = urlParams.has('new') || globalFilters.new;
                        globalFilters.new = isActive;
                        break;
                    case 'sea-view':
                        isActive = urlParams.has('seaview') || globalFilters.seaview;
                        globalFilters.seaview = isActive;
                        break;
                    case 'investment':
                        isActive = urlParams.has('investment') || globalFilters.investment;
                        globalFilters.investment = isActive;
                        break;
                }
                
                if (isActive) {
                    button.classList.add('active');
                }
            });
        } catch (error) {
            console.warn('Error initializing quick filters:', error);
            // Graceful degradation - don't let this stop the whole map from working
        }
    }

    formatPrice(price) {
        if (!price) return 'Price on request';

        // Convert to number if it's a string
        const numPrice = typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : price;
        
        // Format the price with thousand separators
        return numPrice.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    createPropertyPopup(property) {
        return `
            <div class="property-popup">
                <div class="property-popup-image">
                    <img src="${property.image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABkCAYAAABkW8nwAAADT0lEQVR4Xu3YQU7CQBSG0XGp7H8DrpCNa5eq/02wsjQx4QpC9c17OQmJ0unfb+bo9PV6vV78IUAYFIG1YNWozHvDClrAClaFQGF02LAKWsAKVoVAYXTYsApawApWhUBhdNiwClrAClaFQGF02LAKWsAKVoVAYXTYsApawApWhUBhdNiwClrAClaFQGF02LAKWsAKVoVAYXTYsApawApWhUBhdNiwClrAClYFwePx+Lher7/fx+PxOJ/Ph+l0Os1F3O/3r7Omy+UyXK/X6/CZsra/XWvZeF6/rP94/qM1/e/7/Ot+wSrgTZhms9nw4+1q7bgnCxez2exrzcVi8XXdcv0E5AlitVp9rpv3W87Pt46X+zn2/MVehnVk0O/WPs5tdGtbXnc4HIbj8TgcDofher3efq3b+Xa7/XrNL2HL9e12O6xWq2GxWAy73W5YLpfDdrud9z3fb7fbzTDn80fn73a7+eVlYO33+3lfz3uez/lfr9f5pbfdbo9sfHjNYR1G9O0Fx+PxDGGCNCFYLpc3GOv1+lwul8NmsxlWq9Xw1xdYp9NpnguWPM+r2+12eP5Tul6v77jSrfn4sF68ElgvBjVfbkKRbnM8Hm8T0m1Sw1mv13fPV/bFVXq+cnVzeZ5X18O+5ytX+m5+7/zFtubLX3uB9SJiy7DNbdKJpvssp/V6vTxDmVCdz+fheUwp44Qzoys/oa7n13KiOU8jXZ2S5/yEK/ub+8n+Jp7Zmwxr7Xcez7vdb8B6AdCEJZPp9Xo9j++5+ix3mzRXnqTZZwYp3S3jl0FJjrtdLWOYIc1+Jqoz7HStPM+wbTabO9Tp9DLeSfdaXveEMVP6dNF0w+xnhnb+Z4vbvvK5+f/5y7hXwfqJVH6Xplvk9yn5QZlhffcFMzaV0clnc9c8Y5ZBzYhm/DK26ULpZrnOrGy9Xs/rmzV1a8v6dL90yQxtnmeks9cM6YxpdrfcXf6tOhPzHGn282x/P3HmtWsAlnEUKMACq0igMNqOBaygBaxgVQgURocNq6AFrGBVCBRGhw2roAWsYFUIFEaHDaugBaxgVQgURocNq6AFrGBVCBRGhw2roAWsYFUIFEaHDaugBaxgVQgURocNq6AFrGBVCBRGhw2roAWsYFUIFEaHDaugBaxgVQgURof9AXTSRXwu84FQAAAAAElFTkSuQmCC'}" alt="${property.title}">
                </div>
                <div class="property-popup-content">
                    <div class="price">${this.formatPrice(property.price)}</div>
                    <div class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</div>
                    <div class="features">
                        <span> ${property.beds === 1 ? 'Bedroom' : 'Bedrooms'}: ${property.beds || ''}</span>
                        <span> ${property.baths === 1 ? 'Bathroom' : 'Bathrooms'}: ${property.baths || ''}</span>
                        <span>sq ft: ${property.propertySize || ''}</span>
                        <span>ref. id: ${property.propertySize || ''}</span>
                    </div>
                    <div class="popup-actions">
                        <a href="${property.url}" class="view-details-btn" target="_blank">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    createPropertyCard(property, container) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.dataset.propertyId = property.id;
        
        const imageUrl = property.image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABkCAYAAABkW8nwAAADT0lEQVR4Xu3YQU7CQBSG0XGp7H8DrpCNa5eq/02wsjQx4QpC9c17OQmJ0unfb+bo9PV6vV78IUAYFIG1YNWozHvDClrAClaFQGF02LAKWsAKVoVAYXTYsApawApWhUBhdNiwClrAClaFQGF02LAKWsAKVoVAYXTYsApawApWhUBhdNiwClrAClaFQGF02LAKWsAKVoVAYXTYsApawApWhUBhdNiwClrAClYFwePx+Lher7/fx+PxOJ/Ph+l0Os1F3O/3r7Omy+UyXK/X6/CZsra/XWvZeF6/rP94/qM1/e/7/Ot+wSrgTZhms9nw4+1q7bgnCxez2exrzcVi8XXdcv0E5AlitVp9rpv3W87Pt46X+zn2/MVehnVk0O/WPs5tdGtbXnc4HIbj8TgcDofher3efq3b+Xa7/XrNL2HL9e12O6xWq2GxWAy73W5YLpfDdrud9z3fb7fbzTDn80fn73a7+eVlYO33+3lfz3uez/lfr9f5pbfdbo9sfHjNYR1G9O0Fx+PxDGGCNCFYLpc3GOv1+lwul8NmsxlWq9Xw1xdYp9NpnguWPM+r2+12eP5Tul6v77jSrfn4sF68ElgvBjVfbkKRbnM8Hm8T0m1Sw1mv13fPV/bFVXq+cnVzeZ5X18O+5ytX+m5+7/zFtubLX3uB9SJiy7DNbdKJpvssp/V6vTxDmVCdz+fheUwp44Qzoys/oa7n13KiOU8jXZ2S5/yEK/ub+8n+Jp7Zmwxr7Xcez7vdb8B6AdCEJZPp9Xo9j++5+ix3mzRXnqTZZwYp3S3jl0FJjrtdLWOYIc1+Jqoz7HStPM+wbTabO9Tp9DLeSfdaXveEMVP6dNF0w+xnhnb+Z4vbvvK5+f/5y7hXwfqJVH6Xplvk9yn5QZlhffcFMzaV0clnc9c8Y5ZBzYhm/DK26ULpZrnOrGy9Xs/rmzV1a8v6dL90yQxtnmeks9cM6YxpdrfcXf6tOhPzHGn282x/P3HmtWsAlnEUKMACq0igMNqOBaygBaxgVQgURocNq6AFrGBVCBRGhw2roAWsYFUIFEaHDaugBaxgVQgURocNq6AFrGBVCBRGhw2roAWsYFUIFEaHDaugBaxgVQgURocNq6AFrGBVCBRGhw2roAWsYFUIFEaHDaugBaxgVQgURof9AXTSRXwu84FQAAAAAElFTkSuQmCC';
    
    // Ensure property URL is properly constructed
    const propertyUrl = property.url || `/property/${property.reference}`;
    
    card.innerHTML = `
        <div class="property-image">
            <img src="${imageUrl}" alt="${property.title}">
        </div>
        <div class="property-details">
        <div class="property-title-container"><div class="property-title">${property.location}</div> 
        <div class="property-price">${this.formatPrice(property.price)}</div>
        </div>
            

            <div class="property-description">${property.description.length > 80 ? property.description.substring(0, 80) + '...' : property.description}</div>
           
             <div class="property-features">
            <div class="property-feature"> 
               <span>${property.beds || ''} </span> <span>${property.beds === 1 ? 'Bedroom' : 'Bedrooms'}</span>
            </div>

            <div class="property-feature"> 
               <span> ${property.baths || ''} </span><span>${property.baths === 1 ? 'Bathroom' : 'Bathrooms'}</span>
            </div>

            <div class="property-feature"> 
                        <span> ${property.propertySize || ''} </span><span>sq ft</span>
            </div>

            <div class="property-feature"> 
                        <span> ${property.propertySize || ''} </span><span>refid</span>
            </div>
            </div>
            <a href="${propertyUrl}" class="property-link" target="_blank">View Details</a>
        </div>
    `;
        
        // Add click handler to highlight on map
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on the "View Details" link
            if (e.target.classList.contains('property-link') || 
                e.target.parentElement.classList.contains('property-link')) {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all cards
            document.querySelectorAll('.property-card').forEach(c => c.classList.remove('active'));
            
            // Add active class to this card
            card.classList.add('active');
            
            // Show property on map
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
            
            if (isNaN(lat) || isNaN(lng)) {
                console.error('Invalid coordinates for property:', property);
                return;
            }
            
            // Create LatLng object
            const propertyLatLng = L.latLng(lat, lng);
            
            // Pan map to property location
            this.map.setView(propertyLatLng, 16);
            
            // Find marker for this property and open popup
            for (const marker of this.markers) {
                if (marker.options.propertyId === property.id) {
                    // Open popup for this marker
                    marker.openPopup();
                    
                    // Highlight marker
                    this.markers.forEach(m => {
                        const markerElement = m.getElement();
                        if (markerElement) {
                            markerElement.classList.remove('active');
                        }
                    });
                    
                    const markerElement = marker.getElement();
                    if (markerElement) {
                        markerElement.classList.add('active');
                    }
                    
                    break;
                }
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
        
        const selectedTextElement = select.querySelector('.selected-text');
        if (!selectedTextElement) {
            console.log(`Selected text element not found for filter type: ${filterType}`);
            return;
        }
        
        // Get all checked checkboxes for this filter
        const checkedCheckboxes = Array.from(select.querySelectorAll(`input[name="${filterType}"]:checked`));
        
        if (checkedCheckboxes.length === 0) {
            // No checkboxes checked, show default text
            selectedTextElement.textContent = `Choose ${filterType}`;
            return;
        }
        
        if (checkedCheckboxes.length === 1 && checkedCheckboxes[0].id === `${filterType}-all`) {
            // "All" option is checked
            selectedTextElement.textContent = `All ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`;
            return;
        }
        
        // Multiple options selected or specific option(s)
        if (checkedCheckboxes.length === 1) {
            // Single option
            selectedTextElement.textContent = checkedCheckboxes[0].nextElementSibling.textContent.trim();
        } else {
            // Multiple options
            selectedTextElement.textContent = `${checkedCheckboxes.length} ${filterType} selected`;
        }
    }

    updateCheckboxesFromFilters(filters) {
        // Update location checkboxes
        if (filters.location) {
            const locationCheckbox = document.querySelector(`input[name="location"][value="${filters.location}"]`);
            if (locationCheckbox) {
                locationCheckbox.checked = true;
                
                // Uncheck the "All" checkbox and other location checkboxes
                const allLocationCheckbox = document.getElementById('location-all');
                if (allLocationCheckbox) {
                    allLocationCheckbox.checked = false;
                }
                
                document.querySelectorAll('input[name="location"]').forEach(cb => {
                    if (cb !== locationCheckbox && cb.id !== 'location-all') {
                        cb.checked = false;
                    }
                });
                
                this.updateSelectedText('location');
            }
        }
        
        // Update property type checkboxes
        if (filters.propertyType) {
            // Clear existing property type selections
            document.querySelectorAll('input[name="property_type"]').forEach(cb => {
                cb.checked = false;
            });
            
            // Handle array or string
            const propertyTypes = Array.isArray(filters.propertyType) ? 
                filters.propertyType : [filters.propertyType];
            
            // Check corresponding checkboxes
            propertyTypes.forEach(type => {
                const checkbox = document.querySelector(`input[name="property_type"][value="${type}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            
            this.updateSelectedText('property_type');
        }
        
        // Update quick filter buttons
        document.querySelectorAll('.quick-filter-button').forEach(button => {
            const filterType = button.dataset.filter;
            
            switch (filterType) {
                case 'beachfront':
                    button.classList.toggle('active', !!filters.beach);
                    break;
                case 'golf':
                    button.classList.toggle('active', !!filters.golf);
                    break;
                case 'luxury':
                    button.classList.toggle('active', !!filters.exclusive);
                    break;
                case 'new-development':
                    button.classList.toggle('active', !!filters.new);
                    break;
                case 'sea-view':
                    button.classList.toggle('active', !!filters.seaview);
                    break;
                case 'investment':
                    button.classList.toggle('active', !!filters.investment);
                    break;
            }
        });
    }

    resetAllFilters() {
        // Reset global filters
        globalFilters.location = 'Málaga';
        globalFilters.propertyType = '';
        globalFilters.minPrice = 0;
        globalFilters.maxPrice = 0;
        globalFilters.minSize = 0;
        globalFilters.maxSize = 0;
        globalFilters.bedrooms = 0;
        globalFilters.bathrooms = 0;
        globalFilters.beach = false;
        globalFilters.golf = false;
        globalFilters.exclusive = false;
        globalFilters.modern = false;
        globalFilters.new = false;
        globalFilters.seaview = false;
        globalFilters.investment = false;
        globalFilters.minBuilt = 0;
        globalFilters.features = '';
        globalFilters.sortOrder = 'default';
        globalFilters.advanced = {};
        
        // Reset UI
        this.updateCheckboxesFromFilters(globalFilters);
        
        // Reset location to Málaga
        const locationFilter = document.querySelector('.location-filter');
        if (locationFilter) {
            locationFilter.value = 'Málaga';
        }
        
        // Check the Málaga checkbox
        const malagaCheckbox = document.querySelector('input[name="location"][value="Málaga"]');
        if (malagaCheckbox) {
            malagaCheckbox.checked = true;
        }
        
        // Update URL and reload properties
        this.updateUrlWithFilters();
        // Use debounced version to prevent double loading
        this.debouncedLoadProperties(1);
    }

    debouncedCheckVisibleCities() {
        if (this.isMapUpdating) return;
        
        // Clear any existing timer
        clearTimeout(this.debounceTimer);
        
        // Set a new timer
        this.debounceTimer = setTimeout(() => {
            this.checkVisibleCities();
        }, this.debounceDelay);
    }

    checkVisibleCities() {
        if (!this.map || this.isMapUpdating) return;
        
        const bounds = this.map.getBounds();
        this.visibleCities.clear();
        
        // Check which cities are visible in the current map bounds
        for (const [cityName, coords] of Object.entries(cityCoordinates)) {
            const cityLatLng = L.latLng(coords.lat, coords.lng);
            if (bounds.contains(cityLatLng)) {
                this.visibleCities.add(cityName);
            }
        }
        
        // Update current bounds
        this.currentBounds = bounds;
        
        // Update filters based on visible cities
        this.updateFiltersFromVisibleCities();
    }

    updateFiltersFromVisibleCities() {
        if (this.visibleCities.size === 0 || this.isMapUpdating) return;
        
        // Set updating state
        this.isMapUpdating = true;
        
        // If only one city is visible, update the location filter
        if (this.visibleCities.size === 1) {
            const visibleCity = Array.from(this.visibleCities)[0];
            
            // Only update if the location filter doesn't already match
            if (globalFilters.location !== visibleCity) {
                // Update the location filter
                globalFilters.location = visibleCity;
                
                // Update the UI
                const locationFilter = document.querySelector('.location-filter');
                if (locationFilter) {
                    locationFilter.value = visibleCity;
                }
                
                // Update checkboxes
                document.querySelectorAll('input[name="location"]').forEach(cb => {
                    cb.checked = cb.value === visibleCity;
                });
                
                // Update URL parameters (without reloading properties)
                this.updateUrlWithFilters();
            }
        }
        
        // Reset updating state after a short delay
        setTimeout(() => {
            this.isMapUpdating = false;
        }, 200);
        
        this.updateSelectedText('location');
    }

    // Helper function to calculate distance between two points in km
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // Initialize max price filter
    initializeMaxPriceFilter() {
        try {
            debug('Initializing price to filter');
            const maxPriceCheckboxes = document.querySelectorAll('input[name="max-price"]');
            debug('Found price to checkboxes:', maxPriceCheckboxes.length);
            
            // Set up event handlers
            maxPriceCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const value = checkbox.value;
                    debug('Price to changed to:', value);
                    
                    // Uncheck other checkboxes
                    maxPriceCheckboxes.forEach(cb => {
                        if (cb !== checkbox) {
                            cb.checked = false;
                        }
                    });
                    
                    // Update the filter
                    globalFilters.maxPrice = value === 'any' ? 0 : parseInt(value);
                    
                    // Update the selected text in the dropdown
                    const selectHeader = checkbox.closest('.custom-select')?.querySelector('.selected-text');
                    if (selectHeader) {
                        const label = checkbox.nextElementSibling?.querySelector('span');
                        selectHeader.textContent = label ? label.textContent : 'Choose price to';
                    }
                    
                    // Update URL and load properties (use updateFilters to prevent double loading)
                    this.updateFilters({ maxPrice: globalFilters.maxPrice });
                });
            });
            
            // Load initial value from URL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('PMax')) {
                const maxPrice = urlParams.get('PMax');
                debug('Setting initial price to from URL:', maxPrice);
                
                // Find and check the matching checkbox
                const matchingCheckbox = Array.from(maxPriceCheckboxes).find(cb => 
                    cb.value === maxPrice || (cb.value === 'any' && maxPrice === '0')
                );
                
                if (matchingCheckbox) {
                    matchingCheckbox.checked = true;
                    // Update the dropdown text
                    const selectHeader = matchingCheckbox.closest('.custom-select')?.querySelector('.selected-text');
                    if (selectHeader) {
                        const label = matchingCheckbox.nextElementSibling?.querySelector('span');
                        selectHeader.textContent = label ? label.textContent : 'Choose price to';
                    }
                    
                    // Update the filter without triggering a load (will be done after initialization)
                    globalFilters.maxPrice = maxPrice === '0' ? 0 : parseInt(maxPrice);
                }
            }
        } catch (error) {
            console.error('Error initializing price to filter:', error);
        }
    }
}

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
        if (window.showGlobalLoader) {
            window.showGlobalLoader();
        }

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
        
        // Use the SearchByMap instance to load properties
        if (this.searchByMap) {
            this.searchByMap.debouncedLoadProperties(1)
                .then(() => {
                    // Hide loading indicator when properties are loaded
                    if (window.hideGlobalLoader) {
                        window.hideGlobalLoader();
                    }
                })
                .catch(error => {
                    console.error('Error loading properties:', error);
                    // Hide loading indicator even if there's an error
                    if (window.hideGlobalLoader) {
                        window.hideGlobalLoader();
                    }
                });
        } else {
            console.error('SearchByMap instance not found');
            if (window.hideGlobalLoader) {
                window.hideGlobalLoader();
            }
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

        // Size range
        const minSizeFilter = document.querySelector('.min-size-filter');
        const maxSizeFilter = document.querySelector('.max-size-filter');
        if (minSizeFilter) {
            minSizeFilter.value = urlParams.get('MinSize');
            globalFilters.minSize = parseInt(urlParams.get('MinSize'));
        }
        if (maxSizeFilter) {
            maxSizeFilter.value = urlParams.get('MaxSize');
            globalFilters.maxSize = parseInt(urlParams.get('MaxSize'));
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
                // Don't load properties here - it will be loaded by the initialize method
                // this.searchByMap.loadProperties(1);
            }
        }

        // Sort order
        if (urlParams.has('sort')) {
            const sortValue = urlParams.get('sort');
            if (sortOptions[sortValue]) {
                globalFilters.sortOrder = sortValue;
                
                // Update sort dropdown if it exists
                const sortDropdown = document.getElementById('property-sorting-dropdown');
                if (sortDropdown) {
                    sortDropdown.value = sortValue;
                }
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

    updateUrlWithFilters() {
        const urlParams = new URLSearchParams(window.location.search);

        // Clear existing filter parameters
        for (const key of urlParams.keys()) {
            if (key.startsWith('filter_') ||
                key === 'Location' ||
                key === 'PropertyType' ||
                key === 'PMin' ||
                key === 'PMax' ||
                key === 'MinSize' ||
                key === 'MaxSize' ||
                key === 'Beds' ||
                key === 'Baths' ||
                key === 'beach' ||
                key === 'golf' ||
                key === 'exclusive' ||
                key === 'modern' ||
                key === 'new' ||
                key === 'seaview' ||
                key === 'investment' ||
                key === 'min-built' ||
                key === 'features' ||
                key === 'sort') {
                urlParams.delete(key);
            }
        }

        // Add quick filters to URL
        if (globalFilters.beach) urlParams.set('beach', 'true');
        if (globalFilters.golf) urlParams.set('golf', 'true');
        if (globalFilters.exclusive) urlParams.set('exclusive', 'true');
        if (globalFilters.modern) urlParams.set('modern', 'true');
        if (globalFilters.new) urlParams.set('new', 'true');
        if (globalFilters.seaview) urlParams.set('seaview', 'true');
        if (globalFilters.investment) urlParams.set('investment', 'true');

        // Add advanced filters to URL (only if true)
        if (globalFilters.minBuilt > 0) {
            urlParams.set('MinSize', globalFilters.minBuilt);
        } else if (globalFilters.minSize > 0) {
            urlParams.set('MinSize', globalFilters.minSize);
        }
        
        if (globalFilters.maxSize > 0) {
            urlParams.set('MaxSize', globalFilters.maxSize);
        }
        
        if (globalFilters.features && globalFilters.features !== 'any') urlParams.set('features', globalFilters.features);
        if (globalFilters.sortOrder && globalFilters.sortOrder !== 'default') urlParams.set('sort', globalFilters.sortOrder);

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
        if (globalFilters.minSize > 0) {
            urlParams.set('MinSize', globalFilters.minSize);
        }
        if (globalFilters.maxSize > 0) {
            urlParams.set('MaxSize', globalFilters.maxSize);
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
}

// Initialize the map when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize only if not already initialized
        if (!window.searchByMap) {
            window.searchByMap = new SearchByMap();
            // Initialize SearchByMap first
            await window.searchByMap.initialize();
            // Then initialize PropertyFilters
            const propertyFilters = new PropertyFilters();
            propertyFilters.init();
        }
    } catch (error) {
        console.error('Error initializing map:', error);
    }
});

// Add CSS animation for the spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Function to render a property card with the new premium design
function renderPropertyCard(property) {
    // Determine if the property has a status tag to display
    let statusBadge = '';
    if (property.is_new) {
        statusBadge = '<div class="property-status status-new">New</div>';
    } else if (property.is_exclusive) {
        statusBadge = '<div class="property-status status-exclusive">Exclusive</div>';
    } else if (property.is_reduced) {
        statusBadge = '<div class="property-status status-reduced">Reduced</div>';
    }
    
    // Generate the price display with optional negotiable indicator
    const priceClass = property.is_negotiable ? 'property-price negotiable' : 'property-price';
    
    // Create property card element
    const propertyCard = document.createElement('div');
    propertyCard.className = 'property-card';
    propertyCard.dataset.id = property.id;
    propertyCard.innerHTML = `
        ${statusBadge}
        <div class="property-image">
            <img src="${property.image}" alt="${property.title}">
        </div>
        <div class="property-details">
            <div class="property-type">${property.property_type || 'Residential'}</div>
            <div class="${priceClass}">€${formatPrice(property.price)}</div>
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${property.location}</span>
            </div>
            <div class="property-divider"></div>
            <div class="property-features">
            <div class="property-feature"> 
               <span>${property.beds || ''} </span> <span>${property.beds === 1 ? 'Bedroom' : 'Bedrooms'}</span>
            </div>

            <div class="property-feature"> 
               <span> ${property.baths || ''} </span><span>${property.baths === 1 ? 'Bathroom' : 'Bathrooms'}</span>
            </div>

            <div class="property-feature"> 
                        <span> ${property.propertySize || ''} </span><span>sq ft</span>
            </div>

            <div class="property-feature"> 
                        <span> ${property.propertySize || ''} </span><span>refid</span>
            </div>
            </div>
            <div class="property-actions">
                <a href="${property.url}" class="property-link">View Details</a>
                <button class="property-favorite" data-id="${property.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add click event to the favorite button
    const favoriteBtn = propertyCard.querySelector('.property-favorite');
    favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click
        this.classList.toggle('active');
        
        // Toggle the heart icon between outlined and filled
        const heartIcon = this.querySelector('i');
        if (heartIcon.classList.contains('far')) {
            heartIcon.classList.replace('far', 'fas');
        } else {
            heartIcon.classList.replace('fas', 'far');
        }
        
        // Here you would normally also save this to localStorage or a database
        const propertyId = this.dataset.id;
        toggleFavoriteProperty(propertyId);
    });
    
    // Make the card clickable to view details
    propertyCard.addEventListener('click', function() {
        window.location.href = property.url;
    });
    
    return propertyCard;
}

// Helper function to format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to toggle a property as favorite
function toggleFavoriteProperty(propertyId) {
    let favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
    
    if (favorites.includes(propertyId)) {
        favorites = favorites.filter(id => id !== propertyId);
    } else {
        favorites.push(propertyId);
    }
    
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
}

// Function to initialize favorites from localStorage
function initializeFavorites() {
    const favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
    
    // Mark all favorite buttons that match saved favorites
    favorites.forEach(propertyId => {
        const favoriteBtn = document.querySelector(`.property-favorite[data-id="${propertyId}"]`);
        if (favoriteBtn) {
            favoriteBtn.classList.add('active');
            const heartIcon = favoriteBtn.querySelector('i');
            heartIcon.classList.replace('far', 'fas');
        }
    });
}

// Call this when the property list is populated
// document.addEventListener('DOMContentLoaded', initializeFavorites);

let lastVisibleCities = [];
function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    const sortedA = a.slice().sort();
    const sortedB = b.slice().sort();
    for (let i = 0; i < sortedA.length; i++) {
        if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
}