<?php
/**
 * Template Name: Search by Map
 */

get_header();
?>

<div class="search-by-map-container">
    <div class="filters-section">
        <!-- Main Filters -->
        <div class="main-filters">
            <div class="filter-group">
                <label for="location">Location</label>
                <select id="location" name="location">
                    <option value="">Select Location</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="region">Regions/Areas</label>
                <select id="region" name="region">
                    <option value="">Select Region</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="property-type">Property Type</label>
                <select id="property-type" name="property-type">
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="semi-detached">Semi-Detached</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="min-price">Minimum Price</label>
                <input type="number" id="min-price" name="min-price" placeholder="Min Price">
            </div>

            <div class="filter-group">
                <label for="max-price">Maximum Price</label>
                <input type="number" id="max-price" name="max-price" placeholder="Max Price">
            </div>

            <div class="filter-group">
                <label for="bedrooms">Bedrooms</label>
                <select id="bedrooms" name="bedrooms">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="bathrooms">Bathrooms</label>
                <select id="bathrooms" name="bathrooms">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="min-area">Minimum Surface Area</label>
                <input type="number" id="min-area" name="min-area" placeholder="Min Area (m²)">
            </div>

            <div class="filter-group">
                <label for="ref-number">Reference Number</label>
                <input type="text" id="ref-number" name="ref-number" placeholder="Reference Number">
            </div>
        </div>

        <!-- Quick Selection Buttons -->
        <div class="quick-selection">
            <button class="quick-filter" data-filter="frontline-beach">Frontline Beach</button>
            <button class="quick-filter" data-filter="frontline-golf">Frontline Golf</button>
            <button class="quick-filter" data-filter="exclusive">Exclusive/Premium</button>
            <button class="quick-filter" data-filter="modern">Modern</button>
            <button class="quick-filter" data-filter="new-development">New Development</button>
        </div>

        <!-- Advanced Filters Accordion -->
        <div class="advanced-filters">
            <button class="accordion">Advanced Filters</button>
            <div class="panel">
                <div class="filter-group">
                    <label for="frontline-beach">Frontline Beach</label>
                    <select id="frontline-beach" name="frontline-beach">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="frontline-golf">Frontline Golf</label>
                    <select id="frontline-golf" name="frontline-golf">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="sea-views">Sea Views</label>
                    <select id="sea-views" name="sea-views">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="gated-community">Gated Community</label>
                    <select id="gated-community" name="gated-community">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="andalusian-style">Andalusian Style</label>
                    <select id="andalusian-style" name="andalusian-style">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="renovated">Renovated</label>
                    <select id="renovated" name="renovated">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div class="map-section">
        <div id="map"></div>
    </div>
</div>

<style>
    .search-by-map-container {
        display: flex;
        height: calc(100vh - var(--headerHeight) - var(--hatHeight));
    }

    .filters-section {
        width: 400px;
        padding: 20px;
        overflow-y: auto;
        background: #fff;
    }

    .map-section {
        flex: 1;
        position: relative;
    }

    #map {
        width: 100%;
        height: 100%;
    }

    .filter-group {
        margin-bottom: 15px;
    }

    .filter-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
    }

    .filter-group select,
    .filter-group input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .quick-selection {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 20px 0;
    }

    .quick-filter {
        padding: 8px 15px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
    }

    .quick-filter:hover {
        background: #e5e5e5;
    }

    .accordion {
        width: 100%;
        padding: 10px;
        background: #f5f5f5;
        border: none;
        text-align: left;
        cursor: pointer;
        margin: 10px 0;
    }

    .panel {
        display: none;
        padding: 10px;
        background: #fff;
    }

    .panel.show {
        display: block;
    }
</style>

<script>
    // Initialize Google Maps
    function initMap() {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 36.493403, lng: -4.754319 },
            zoom: 15
        });
    }

    // Accordion functionality
    document.querySelectorAll('.accordion').forEach(button => {
        button.addEventListener('click', () => {
            const panel = button.nextElementSibling;
            panel.classList.toggle('show');
        });
    });

    // Quick filter buttons
    document.querySelectorAll('.quick-filter').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            // Add filter logic here
        });
    });

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
</script>

<?php get_footer(); ?>