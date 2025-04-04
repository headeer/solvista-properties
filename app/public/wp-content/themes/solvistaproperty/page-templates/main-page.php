<?php
/**
 * Template Name: Main Page with Map
 */

get_header();
?>

<div class="site-content">
    <!-- Filters Section -->
    <div class="filters-section">
        <form id="property-filters" class="filters-form">
            <!-- Main Filters -->
            <div class="filters-grid">
                <!-- Location -->
                <div class="form-group">
                    <label for="location" class="form-label">Location</label>
                    <div class="select">
                        <select id="location" name="location" required>
                            <option value="" disabled selected>Select location</option>
                            <option value="Marbella">Marbella</option>
                            <option value="Estepona">Estepona</option>
                            <option value="Benahavís">Benahavís</option>
                            <option value="Mijas">Mijas</option>
                        </select>
                        <svg>
                            <use xlink:href="#select-arrow-down"></use>
                        </svg>
                    </div>
                </div>

                <!-- Property Type -->
                <div class="form-group">
                    <label for="property-type" class="form-label">Property Type</label>
                    <div class="select">
                        <select id="property-type" name="property_type" required>
                            <option value="" disabled selected>Select type</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Villa</option>
                            <option value="townhouse">Townhouse</option>
                            <option value="semi-detached">Semi-Detached</option>
                        </select>
                        <svg>
                            <use xlink:href="#select-arrow-down"></use>
                        </svg>
                    </div>
                </div>

                <!-- Price Range -->
                <div class="form-group">
                    <label for="price-range" class="form-label">Price Range</label>
                    <div class="price-range">
                        <div class="price-inputs">
                            <div class="price-input">
                                <div class="price-input-wrapper">
                                    <span class="currency-symbol">$</span>
                                    <input type="number" id="min-price" name="min_price" class="form-control" value="0"
                                        min="0" max="5000000" step="1000" />
                                </div>
                                <label class="price-label">Min Price</label>
                            </div>
                            <div class="price-input">
                                <div class="price-input-wrapper">
                                    <span class="currency-symbol">$</span>
                                    <input type="number" id="max-price" name="max_price" class="form-control"
                                        value="5000000" min="0" max="5000000" step="1000" />
                                </div>
                                <label class="price-label">Max Price</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bedrooms -->
                <div class="form-group">
                    <label for="bedrooms" class="form-label">Bedrooms</label>
                    <div class="select">
                        <select id="bedrooms" name="bedrooms" required>
                            <option value="" disabled selected>Select bedrooms</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                        </select>
                        <svg>
                            <use xlink:href="#select-arrow-down"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <!-- Quick Filters -->
            <div class="quick-filters-grid">
                <button type="button" class="button-6" data-filter="frontline_beach" name="frontline_beach">
                    <i class="fas fa-umbrella-beach"></i>
                    Frontline Beach
                </button>
                <button type="button" class="button-6" data-filter="frontline_golf" name="frontline_golf">
                    <i class="fas fa-golf-ball"></i>
                    Frontline Golf
                </button>
                <button type="button" class="button-6" data-filter="sea_views" name="sea_views">
                    <i class="fas fa-water"></i>
                    Sea Views
                </button>
                <button type="button" class="button-6" data-filter="gated_community" name="gated_community">
                    <i class="fas fa-door-closed"></i>
                    Gated Community
                </button>
                <button type="button" class="button-6" data-filter="andalusian_style" name="andalusian_style">
                    <i class="fas fa-home"></i>
                    Andalusian Style
                </button>
                <button type="button" class="button-6" data-filter="renovated" name="renovated">
                    <i class="fas fa-hammer"></i>
                    Renovated
                </button>
            </div>
        </form>
    </div>

    <!-- Map Section -->
    <div class="map-section">
        <div id="map" class="map-container"></div>
        <div id="map-loader" class="map-loader">
            <div class="loader-spinner"></div>
            <span>Loading properties...</span>
        </div>
    </div>


</div>

<style>
    /* Base Layout */
    .site-content {
        width: 100%;
        margin: 0 auto;
        padding: 0 1rem;
    }

    /* Filters Section */
    .filters-section {
        background-color: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        padding: 1.5rem;
        margin-bottom: 2rem;
    }

    .filters-form {
        max-width: 1280px;
        margin: 0 auto;
    }

    /* Form Elements */
    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        font-size: 2rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.5rem;
    }

    /* Price Range Styles */
    .price-range {
        width: 100%;
    }

    .price-inputs {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
    }

    .price-input {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .price-label {
        font-size: 1.5rem;
        color: #6B7280;
        font-weight: 500;
        text-align: left;
    }

    .price-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 200px;
    }

    .currency-symbol {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #6B7280;
        font-size: 15px;
        pointer-events: none;
    }

    .price-input input[type="number"] {
        width: 100%;
        height: 36px;
        padding: 0 40px 0 32px;
        font-size: 15px;
        line-height: 1.5;
        color: #374151;
        background-color: #fff;
        border: 1px solid #E8EAED;
        border-radius: 5px;
        transition: all 150ms ease;
        -moz-appearance: textfield;
        text-align: center;
        box-shadow: 0 1px 3px -2px #9098A9;
    }

    .price-input input[type="number"]:focus {
        outline: none;
        border-color: #0077FF;
        box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
    }

    /* Grid Layouts */
    .filters-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .quick-filters-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        padding-top: 1.5rem;
        border-top: 1px solid #E5E7EB;
    }

    /* Map Section */
    .map-section {
        position: relative;
        flex: 1;
        height: 500px;
        margin-bottom: 2rem;
    }

    .map-container {
        position: absolute;
        inset: 0;
    }

    /* Results Section */
    .results-section {
        background-color: #fff;
        padding: 2rem 0;
    }

    .results-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    /* Responsive Design */
    @media (min-width: 768px) {
        .filters-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .quick-filters-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .filters-grid {
            grid-template-columns: repeat(4, 1fr);
        }

        .quick-filters-grid {
            grid-template-columns: repeat(6, 1fr);
        }
    }

    @media (max-width: 640px) {
        .price-inputs {
            gap: 1rem;
        }

        .price-input-wrapper {
            min-width: 160px;
        }

        .price-input input[type="number"] {
            height: 38px;
            font-size: 14px;
            padding: 6px 32px 6px 28px;
        }

        .currency-symbol {
            font-size: 14px;
            left: 10px;
        }

        .price-label {
            font-size: 1.5rem;
        }

        .button-6 {
            font-size: 13px;
            padding: 0.4rem 0.6rem;
            min-height: 2rem;
        }

        .button-6 i {
            margin-right: 0.5rem;
            font-size: 1.5rem;
        }
    }

    .elementor-kit-52 button,
    .elementor-kit-52 input[type="button"],
    .elementor-kit-52 input[type="submit"],
    .elementor-kit-52 .elementor-button {
        font-size: 1.7rem;
    }

    /* Select Styling */
    .select {
        position: relative;
        min-width: 200px;
    }

    .select svg {
        position: absolute;
        right: 12px;
        top: calc(50% - 3px);
        width: 10px;
        height: 6px;
        stroke-width: 2px;
        stroke: #9098A9;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        pointer-events: none;
    }

    .select select {
        -webkit-appearance: none;
        padding: 8px 40px 8px 12px;
        width: 100%;
        border: 1px solid #E8EAED;
        border-radius: 5px;
        background: white;
        box-shadow: 0 1px 3px -2px #9098A9;
        cursor: pointer;
        font-family: inherit;
        font-size: 15px;
        transition: all 150ms ease;
    }

    .select select:required:invalid {
        color: #5A667F;
    }

    .select select option {
        color: #223254;
    }

    .select select option[value=""][disabled] {
        display: none;
    }

    .select select:focus {
        outline: none;
        border-color: #0077FF;
        box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
    }

    .select:hover svg {
        stroke: #0077FF;
    }

    /* Button Styling */
    .button-6 {
        align-items: center;
        background-color: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: .25rem;
        box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
        box-sizing: border-box;
        color: rgba(0, 0, 0, 0.85);
        cursor: pointer;
        display: inline-flex;
        font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        justify-content: center;
        line-height: 1.25;
        margin: 0;
        min-height: 2.5rem;
        padding: 0.5rem 0.75rem;
        position: relative;
        text-decoration: none;
        transition: all 250ms;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: baseline;
        width: 100%;
    }

    .button-6:hover,
    .button-6:focus {
        border-color: rgba(0, 0, 0, 0.15);
        box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
        color: rgba(0, 0, 0, 0.65);
    }

    .button-6:hover {
        transform: translateY(-1px);
    }

    .button-6:active {
        background-color: #F0F0F1;
        border-color: rgba(0, 0, 0, 0.15);
        box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
        color: rgba(0, 0, 0, 0.65);
        transform: translateY(0);
    }

    .button-6 i {
        margin-right: 0.5rem;
        font-size: 1rem;
    }

    /* Map Loader Styles */
    .map-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        display: none;
    }

    .map-loader.active {
        display: flex;
    }

    .map-loader span {
        color: #374151;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .loader-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #E5E7EB;
        border-top-color: #0077FF;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>

<script>
    class PropertyFilters {
        constructor() {
            this.form = document.getElementById('property-filters');
            this.quickFilters = new Set();
            this.debounceTimer = null;
            this.mapLoader = document.getElementById('map-loader');
            this.init();
        }

        init() {
            this.initPriceRange();
            this.initQuickFilters();
            this.initFormListeners();
        }

        initPriceRange() {
            const minInput = document.getElementById('min-price');
            const maxInput = document.getElementById('max-price');
            const priceGap = 1000;

            minInput.addEventListener('input', () => {
                let min = parseInt(minInput.value) || 0;
                const max = parseInt(maxInput.value) || 5000000;

                if (min > max) {
                    min = max;
                    minInput.value = max;
                }
                this.handleFilterChange();
            });

            maxInput.addEventListener('input', () => {
                const min = parseInt(minInput.value) || 0;
                let max = parseInt(maxInput.value) || 5000000;

                if (max < min) {
                    max = min;
                    maxInput.value = min;
                }
                this.handleFilterChange();
            });
        }

        initQuickFilters() {
            document.querySelectorAll('.button-6[data-filter]').forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.dataset.filter;
                    button.classList.toggle('active');

                    if (button.classList.contains('active')) {
                        this.quickFilters.add(filter);
                    } else {
                        this.quickFilters.delete(filter);
                    }

                    this.handleFilterChange();
                });
            });
        }

        initFormListeners() {
            // Listen for changes on all form elements
            this.form.querySelectorAll('select, input').forEach(element => {
                element.addEventListener('change', () => this.handleFilterChange());
            });
        }

        handleFilterChange() {
            // Clear previous timer
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }

            // Set new timer
            this.debounceTimer = setTimeout(() => {
                this.updateResults();
            }, 500);
        }

        async updateResults() {
            // Show loader
            this.mapLoader.classList.add('active');

            const formData = new FormData(this.form);
            const params = new URLSearchParams();

            // Add form data
            for (let [key, value] of formData.entries()) {
                if (value) {
                    params.append(key, value);
                }
            }

            // Add quick filters
            this.quickFilters.forEach(filter => {
                params.append(filter, '1');
            });

            try {
                // Make API request
                const response = await fetch('/wp-json/solvista/v1/properties?' + params.toString(), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                this.updateMap(data);
                this.updateResultsList(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
                // Handle error (show message to user, etc.)
            } finally {
                // Hide loader
                this.mapLoader.classList.remove('active');
            }
        }

        updateMap(properties) {
            // Clear existing markers
            if (window.searchByMap) {
                window.searchByMap.updateMapMarkers(properties);
            }
        }

        updateResultsList(properties) {
            // Update the results section with new data
            const resultsContainer = document.querySelector('.property-results');
            if (resultsContainer) {
                // Update the results using the shortcode or custom template
                // This depends on how you want to display the results
            }
        }
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        window.propertyFilters = new PropertyFilters();
    });
</script>

<?php
get_footer();