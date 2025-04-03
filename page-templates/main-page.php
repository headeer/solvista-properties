<?php
/**
 * Template Name: Main Page with Map
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

        <button id="clear-filters" class="clear-filters">Clear All Filters</button>
    </div>

    <div class="map-section">
        <div id="map"></div>
    </div>
</div>

<?php get_footer(); ?>