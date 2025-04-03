<?php
/**
 * Template Name: Main Page with Map
 */

get_header();
?>

<div class="site-content">
    <div class="search-by-map-container">
        <!-- Filters Section -->
        <div class="filters-section">
            <h2>Search Properties</h2>

            <!-- Quick Selection -->
            <div class="quick-selection">
                <button data-filter="frontline_beach">Frontline Beach</button>
                <button data-filter="frontline_golf">Frontline Golf</button>
                <button data-filter="sea_views">Sea Views</button>
                <button data-filter="gated_community">Gated Community</button>
                <button data-filter="andalusian_style">Andalusian Style</button>
                <button data-filter="renovated">Renovated</button>
            </div>

            <!-- Advanced Filters -->
            <div class="advanced-filters">
                <div class="filter-group">
                    <label for="location">Location</label>
                    <select id="location">
                        <option value="">Any Location</option>
                        <option value="Marbella">Marbella</option>
                        <option value="Estepona">Estepona</option>
                        <option value="Benahavís">Benahavís</option>
                        <option value="Mijas">Mijas</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="region">Region</label>
                    <select id="region">
                        <option value="">Any Region</option>
                        <option value="Golden Mile">Golden Mile</option>
                        <option value="La Alquería">La Alquería</option>
                        <option value="Nueva Andalucía">Nueva Andalucía</option>
                        <option value="Sierra Blanca">Sierra Blanca</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="property_type">Property Type</label>
                    <select id="property_type">
                        <option value="">Any Type</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Townhouse">Townhouse</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label>Price Range</label>
                    <div class="price-range">
                        <input type="number" id="min_price" placeholder="Min Price">
                        <input type="number" id="max_price" placeholder="Max Price">
                    </div>
                </div>

                <div class="filter-group">
                    <label for="bedrooms">Bedrooms</label>
                    <select id="bedrooms">
                        <option value="">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="bathrooms">Bathrooms</label>
                    <select id="bathrooms">
                        <option value="">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="area">Area (m²)</label>
                    <input type="number" id="area" placeholder="Enter area">
                </div>

                <div class="filter-group">
                    <label for="frontline_beach">Frontline Beach</label>
                    <select id="frontline_beach">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="frontline_golf">Frontline Golf</label>
                    <select id="frontline_golf">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="sea_views">Sea Views</label>
                    <select id="sea_views">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="gated_community">Gated Community</label>
                    <select id="gated_community">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="andalusian_style">Andalusian Style</label>
                    <select id="andalusian_style">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="renovated">Renovated</label>
                    <select id="renovated">
                        <option value="">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Map Section -->
        <div class="map-section">
            <div id="map"></div>
        </div>
    </div>
</div>

<?php
get_footer();