// Property Search Map Script

// SearchByMap Class
class SearchByMap {
    constructor(config = {}) {
        this.config = {
            apiUrl: '/wp-json/resales/v1/map-properties',
            hasApiKey: true,
            itemsPerPage: 10,
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
        this.filters = new PropertyFilters();
    }

    initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            throw new Error('Map container not found');
        }

        this.map = L.map('map', {
            center: [40.4168, -3.7038],
            zoom: 6,
            zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        this.markerCluster = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
        });
        this.map.addLayer(this.markerCluster);
    }

    async loadScripts() {
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(leafletCss);
        
        const markerClusterCss = document.createElement('link');
        markerClusterCss.rel = 'stylesheet';
        markerClusterCss.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
        document.head.appendChild(markerClusterCss);
        
        const markerClusterDefaultCss = document.createElement('link');
        markerClusterDefaultCss.rel = 'stylesheet';
        markerClusterDefaultCss.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
        document.head.appendChild(markerClusterDefaultCss);
        
        await this.loadScript('https://unpkg.com/leaflet@1.7.1/dist/leaflet.js');
        await this.loadScript('https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js');
        await this.loadScript('/wp-content/themes/solvistaproperty/page-templates/fallback-data.js');
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = (error) => reject(error);
            document.head.appendChild(script);
        });
    }

    async initialize() {
        if (this.initialized) {
            return;
        }

        try {
            await this.loadScripts();
            this.initMap();
            await this.loadProperties();
            await this.filters.init();
            this.initialized = true;
        } catch (error) {
            throw error;
        }
    }

    async loadProperties(page = 1) {
        this.currentPage = page;
        this.isLoading = true;

        try {
            const response = await fetch(this.config.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                this.properties = data.map(property => ({
                    id: property.reference,
                    reference: property.reference,
                    title: `Property ${property.reference}`,
                    price: property.price,
                    location: 'Location not specified',
                    bedrooms: 0,
                    bathrooms: 0,
                    area: '0 m²',
                    image: '/wp-content/themes/solvistaproperty/assets/images/placeholder.svg',
                    status: 'For Sale',
                    propertyType: 'Property',
                    latitude: parseFloat(property.gps_y) || 0,
                    longitude: parseFloat(property.gps_x) || 0,
                    terrace: false,
                    pool: false,
                    garden: false,
                    parking: false
                }));
                this.displayProperties();
            } else {
                this.useFallbackData();
            }
        } catch (error) {
            this.useFallbackData();
        } finally {
            this.isLoading = false;
        }
    }

    setupMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Map container not found');
          return;
        }

        // Set map container height to ensure visibility
        mapContainer.style.height = '600px';
        mapContainer.style.width = '100%';

        // Initialize map with a default view of Spain
        this.map = L.map('map', {
            center: [40.4168, -3.7038],
            zoom: 6,
            zoomControl: true
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Initialize marker cluster group
        this.markerCluster = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
        });
        this.map.addLayer(this.markerCluster);

        console.log('Map initialized successfully');
    }

    setupEventListeners() {
        // Filter toggle
        const filterToggle = document.querySelector('.filter-toggle');
        const filterContent = document.querySelector('.filter-content');
        
        console.log('Filter Elements Debug:', {
            filterToggle: filterToggle ? 'Found' : 'Not Found',
            filterContent: filterContent ? 'Found' : 'Not Found'
        });
        
        if (filterToggle && filterContent) {
            console.log('Adding filter toggle event listener');
            
            // Toggle filter content visibility
            filterToggle.addEventListener('click', (e) => {
                console.log('Filter toggle clicked');
                e.stopPropagation();
                filterContent.classList.toggle('active');
                console.log('Filter content active:', filterContent.classList.contains('active'));
            });

            // Close filters when clicking outside
            document.addEventListener('click', (e) => {
                if (!filterContent.contains(e.target) && !filterToggle.contains(e.target)) {
                    console.log('Clicking outside filters, closing');
                    filterContent.classList.remove('active');
                }
            });

            // Prevent filter content from closing when clicking inside
            filterContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // View toggle
        const viewToggleButtons = document.querySelectorAll('.view-toggle button');
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const view = button.getAttribute('data-view');
                this.toggleView(view);
            });
        });

        // Mobile list toggle
        const mobileListToggle = document.querySelector('.mobile-list-toggle');
        const propertyListSection = document.querySelector('.property-listing-section');
        const closeListButton = document.querySelector('.close-list');
        
        if (mobileListToggle && propertyListSection) {
            mobileListToggle.addEventListener('click', () => {
                propertyListSection.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeListButton && propertyListSection) {
            closeListButton.addEventListener('click', () => {
                propertyListSection.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close list when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                propertyListSection.classList.contains('active') &&
                !propertyListSection.contains(e.target) &&
                !mobileListToggle.contains(e.target)) {
                propertyListSection.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    useFallbackData() {
        if (typeof FALLBACK_DATA !== 'undefined') {
            console.log('Using fallback data:', FALLBACK_DATA);
            this.properties = FALLBACK_DATA.properties.map(property => ({
                id: property.id,
                title: property.title,
                price: property.price,
                location: property.location,
                latitude: parseFloat(property.latitude),
                longitude: parseFloat(property.longitude),
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                area: property.area,
                image: property.image,
                propertyType: property.propertyType,
                status: property.status,
                reference: property.reference,
                currency: property.currency,
                built: property.built,
                plot: property.plot,
                terrace: property.terrace,
                pool: property.pool,
                garden: property.garden,
                parking: property.parking,
                features: property.features,
                pictures: property.pictures
            })).filter(property => property.latitude && property.longitude);
            
            console.log('Processed fallback properties:', this.properties.length);
            this.totalPages = Math.ceil(FALLBACK_DATA.total / this.config.itemsPerPage);
            this.displayProperties();
        } else {
            console.error('Fallback data not available');
        }
    }

    displayProperties() {
        // Get or create properties container
        let container = document.querySelector('.properties-container');
        if (!container) {
            console.log('Creating properties container');
            container = document.createElement('div');
            container.className = 'properties-container';
            
            // Find the map container
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                // Insert the properties container after the map
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

        // Clear existing markers
        if (this.markerCluster) {
            this.markerCluster.clearLayers();
        }

        // Create a feature group to store all markers
        const markers = [];

        // Add markers and cards for each property
        this.properties.forEach(property => {
            const marker = this.createMarker(property);
            if (marker) {
                markers.push(marker);
                this.createPropertyCard(property, propertiesGrid);
            }
        });

        // Add all markers to the cluster group
        if (markers.length > 0) {
            this.markerCluster.addLayers(markers);
            
            // Fit map bounds to show all markers
            const group = L.featureGroup(markers);
            this.map.fitBounds(group.getBounds(), {
                padding: [50, 50]
            });
        }

        console.log(`Displayed ${markers.length} properties on map and in listing`);
    }

    createMarker(property) {
        try {
            const lat = parseFloat(property.latitude);
            const lng = parseFloat(property.longitude);
            
            if (isNaN(lat) || isNaN(lng)) {
                console.warn('Invalid coordinates for property:', property.id);
                return null;
            }

            const marker = L.marker([lat, lng], {
                icon: L.divIcon({
        className: 'custom-marker',
        html: '<i class="fas fa-home"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
                })
            });

            const popup = L.popup({
                className: 'property-popup',
                maxWidth: 220,
                closeButton: true
            }).setContent(`
        <div class="property-popup">
          <div class="property-popup-content">
            <h3>${property.title}</h3>
            <p class="price">${property.price}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <div class="features">
                            <span><i class="fas fa-bed"></i> ${property.bedrooms} beds</span>
                            <span><i class="fas fa-bath"></i> ${property.bathrooms} baths</span>
                            <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
            </div>
                        <div class="property-popup-actions">
                            <a href="/property-details/?P_RefId=${property.reference}&P_ApiId=${property.id}" 
                               class="property-details-button">
                View Details
                            </a>
            </div>
          </div>
                </div>
            `);

            marker.bindPopup(popup);
            return marker;
        } catch (error) {
            console.error('Error creating marker:', error);
            return null;
        }
    }

    createPropertyCard(property, container) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-id', property.id);
        
        const featuresList = [];
        if (property.terrace) featuresList.push('Terrace');
        if (property.pool) featuresList.push('Pool');
        if (property.garden) featuresList.push('Garden');
        if (property.parking) featuresList.push('Parking');
        
        // Format price with thousands separator
        let formattedPrice = 'Price on request';
        if (property.price) {
            // If price already contains commas, return it as is
            if (property.price.toString().includes(',')) {
                formattedPrice = property.price;
            } else {
                const price = parseFloat(property.price);
                if (!isNaN(price)) {
                    formattedPrice = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: property.currency || 'EUR',
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0
                    }).format(price);
                }
            }
        }
        
        // Handle missing images with proper fallback
        let imageUrl;
        
        if (property.image) {
            // Check if it's a full URL or a relative path
            if (property.image.startsWith('http')) {
                imageUrl = property.image;
            } else {
                // Ensure the path starts with a slash
                imageUrl = property.image.startsWith('/') ? property.image : '/' + property.image;
            }
        } else if (property.pictures && property.pictures.length > 0) {
            // Use the first picture if available
            const firstPicture = property.pictures[0];
            if (firstPicture.startsWith('http')) {
                imageUrl = firstPicture;
            } else {
                imageUrl = firstPicture.startsWith('/') ? firstPicture : '/' + firstPicture;
            }
        }
        
        card.innerHTML = `
            <div class="property-image">
                <img src="${imageUrl}" 
                     alt="${property.title}"
                     onerror="this.onerror=null; this.src='/wp-content/themes/solvistaproperty/assets/images/placeholder.svg';">
                <div class="property-status">${property.status}</div>
            </div>
            <div class="property-details">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-price">${formattedPrice}</p>
                <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <div class="property-features">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} beds</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
                </div>
                ${featuresList.length > 0 ? `
                    <div class="property-amenities">
                        <i class="fas fa-star"></i>
                        ${featuresList.join(' • ')}
                    </div>
                ` : ''}
                <div class="property-type">${property.propertyType}</div>
                <a href="/property-details/?P_RefId=${property.reference}&P_ApiId=${property.id}" 
                   class="property-details-button">
                    View Details
                </a>
        </div>
      `;

        card.addEventListener('click', () => {
            this.highlightProperty(property.id);
            this.zoomToProperty(property.id);
        });
        
        container.appendChild(card);
    }

    highlightProperty(propertyId) {
      if (this.highlightedProperty) {
        const prevCard = document.querySelector(`.property-card[data-id="${this.highlightedProperty}"]`);
        if (prevCard) {
          prevCard.classList.remove('highlight');
        }
      }

      const card = document.querySelector(`.property-card[data-id="${propertyId}"]`);
      if (card) {
        card.classList.add('highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      this.highlightedProperty = propertyId;

      const marker = this.propertyMarkers[propertyId];
      if (marker) {
        marker.openPopup();
      }
    }

    zoomToProperty(propertyId) {
      const property = this.properties.find(p => p.id === propertyId);
      if (property) {
        this.map.setView([property.latitude, property.longitude], 15);
        
        const marker = this.propertyMarkers[propertyId];
        if (marker) {
          marker.openPopup();
        }
      }
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
    }

    async init() {
        await new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        this.setupFilterEventListeners();
    }

    applyFilters() {
        const properties = window.searchByMap?.properties || [];
        
        const filteredProperties = properties.filter(property => {
            if (this.filters.propertyType.length > 0 && 
                !this.filters.propertyType.includes(property.propertyType)) {
                return false;
            }
            
            if (this.filters.location.length > 0 && 
                !this.filters.location.includes(property.location)) {
                return false;
            }
            
            if (this.filters.bedrooms.length > 0 && 
                !this.filters.bedrooms.includes(property.bedrooms)) {
                return false;
            }
            
            if (this.filters.bathrooms.length > 0 && 
                !this.filters.bathrooms.includes(property.bathrooms)) {
                return false;
            }
            
            const price = parseFloat(property.price);
            if (!isNaN(price) && 
                (price < this.filters.priceRange.min || 
                 price > this.filters.priceRange.max)) {
                return false;
            }
            
            return true;
        });
        
        if (window.searchByMap) {
            window.searchByMap.properties = filteredProperties;
            window.searchByMap.displayProperties();
        }
    }

    setupFilterEventListeners() {
        console.log('Setting up filter event listeners...');
        
        // Get all custom selects
        const customSelects = document.querySelectorAll('.custom-select');
        console.log('Found custom selects:', customSelects.length);
        
        customSelects.forEach((select, index) => {
            console.log(`Processing select ${index + 1}:`, select);
            
            const header = select.querySelector('.select-header');
            const dropdown = select.querySelector('.select-dropdown');
            const searchBox = select.querySelector('.search-box input');
            
            console.log(`Select ${index + 1} elements:`, {
                header: header ? 'Found' : 'Not Found',
                dropdown: dropdown ? 'Found' : 'Not Found',
                searchBox: searchBox ? 'Found' : 'Not Found'
            });
            
            if (header && dropdown) {
                // Add click listener to header
                header.addEventListener('click', (e) => {
                    console.log('Header clicked!');
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
                    console.log('Dropdown active class toggled:', dropdown.classList.contains('active'));
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
        console.log('Found location checkboxes:', locationCheckboxes.length);
        
        locationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                console.log('Location checkbox changed:', checkbox.id, checkbox.checked);
                if (checkbox.id === 'location-all') {
                    const isChecked = checkbox.checked;
                    locationCheckboxes.forEach(cb => {
                        if (cb.id !== 'location-all') {
                            cb.checked = isChecked;
                        }
                    });
                } else {
                    const allCheckbox = document.getElementById('location-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                }
                this.updateSelectedText('location');
                this.applyFilters();
        });
      });
      
        // Property type checkboxes
        const propertyTypeCheckboxes = document.querySelectorAll('input[name="property_type"]');
        console.log('Found property type checkboxes:', propertyTypeCheckboxes.length);
        
        propertyTypeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                console.log('Property type checkbox changed:', checkbox.id, checkbox.checked);
                
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

                    // Handle parent-child relationship
                    if (checkbox.checked) {
                        // If a parent is checked, check all its children
                        const parentValue = checkbox.value;
                        propertyTypeCheckboxes.forEach(cb => {
                            if (cb.dataset.parent === parentValue) {
                                cb.checked = true;
                            }
                        });
                    } else {
                        // If a parent is unchecked, uncheck all its children
                        const parentValue = checkbox.value;
                        propertyTypeCheckboxes.forEach(cb => {
                            if (cb.dataset.parent === parentValue) {
                                cb.checked = false;
                            }
                        });

                        // If a child is unchecked, uncheck its parent
                        const childValue = checkbox.value;
                        const parentCheckbox = propertyTypeCheckboxes.find(cb => 
                            cb.value === checkbox.dataset.parent
                        );
                        if (parentCheckbox) {
                            parentCheckbox.checked = false;
                        }
                    }
                }
                this.updateSelectedText('property_type');
                this.applyFilters();
            });
        });

        // Price checkboxes
        const priceCheckboxes = document.querySelectorAll('input[name="price"]');
        console.log('Found price checkboxes:', priceCheckboxes.length);
        
        priceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                console.log('Price checkbox changed:', checkbox.id, checkbox.checked);
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
                this.applyFilters();
            });
        });

        // Bedrooms checkboxes
        const bedroomsCheckboxes = document.querySelectorAll('input[name="bedrooms"]');
        console.log('Found bedrooms checkboxes:', bedroomsCheckboxes.length);
        
        bedroomsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                console.log('Bedrooms checkbox changed:', checkbox.id, checkbox.checked);
                if (checkbox.id === 'bedrooms-all') {
                    const isChecked = checkbox.checked;
                    bedroomsCheckboxes.forEach(cb => {
                        if (cb.id !== 'bedrooms-all') {
                            cb.checked = isChecked;
                        }
                    });
                } else {
                    const allCheckbox = document.getElementById('bedrooms-all');
                    if (allCheckbox) {
                        allCheckbox.checked = false;
                    }
                }
                this.updateSelectedText('bedrooms');
                this.applyFilters();
      });
    });
    
        // Quick filters
        const quickFilterButtons = document.querySelectorAll('.quick-filter-button');
        quickFilterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                button.classList.toggle('active');
                this.applyFilters();
      });
    });
    
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select')) {
                console.log('Clicked outside, closing all dropdowns');
                customSelects.forEach(select => {
                    const dropdown = select.querySelector('.select-dropdown');
                    if (dropdown) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        });
    }

    updateSelectedText(filterType) {
        console.log('Updating selected text for:', filterType);
        
        const selectElement = document.querySelector(`.custom-select[data-filter="${filterType}"]`);
        if (!selectElement) {
            console.log('Select element not found for:', filterType);
            return;
        }

        const selectedText = selectElement.querySelector('.selected-text');
        if (!selectedText) {
            console.log('Selected text element not found');
            return;
        }

        const checkboxes = selectElement.querySelectorAll(`input[name="${filterType}"]:checked`);
        const allCheckbox = selectElement.querySelector(`input[name="${filterType}"][id="${filterType}-all"]`);
        
        console.log('Found checkboxes:', {
            total: checkboxes.length,
            allChecked: allCheckbox?.checked
        });

        if (allCheckbox && allCheckbox.checked) {
            selectedText.textContent = 'All';
            return;
        }

        if (checkboxes.length === 0) {
            selectedText.textContent = `Choose ${filterType.replace('_', ' ')}`;
            return;
        }

        const selectedValues = Array.from(checkboxes)
            .filter(cb => cb.id !== `${filterType}-all`)
            .map(cb => {
                const label = document.querySelector(`label[for="${cb.id}"] span:last-child`);
                return label ? label.textContent : cb.value;
            });

        console.log('Selected values:', selectedValues);

        if (selectedValues.length === 1) {
            selectedText.textContent = selectedValues[0];
        } else {
            selectedText.textContent = `${selectedValues.length} selected`;
        }
    }
}

// Global initialization flag
let isInitialized = false;

// Initialize the application
const initializeApp = async () => {
    if (isInitialized) {
        return;
    }

    try {
        window.searchByMap = new SearchByMap();
        await window.searchByMap.initialize();
        
        window.propertyFilters = new PropertyFilters();
        await window.propertyFilters.init();

        isInitialized = true;
    } catch (error) {
        throw error;
    }
};

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);