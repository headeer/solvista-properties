<?php
/**
 * Template Name: Property Search with Map
 * 
 * This template can be used in any WordPress theme.
 * It includes all necessary styles and scripts.
 */

get_header();

// Add Font Awesome
wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

// Add Leaflet CSS and JS
wp_enqueue_style('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
wp_enqueue_script('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), null, true);

// Enqueue MarkerCluster
wp_enqueue_style('markercluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css');
wp_enqueue_style('markercluster-default', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css');
wp_enqueue_script('markercluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', array('leaflet'), null, true);
?>

<!-- SVG Icons -->
<svg style="display: none;">
    <symbol id="select-arrow-down" viewBox="0 0 10 6">
        <path d="M0 0L5 6L10 0" stroke-width="2" stroke="currentColor" fill="none" />
    </symbol>
</svg>

<!-- Header Content Area -->
<?php
if (defined('ELEMENTOR_VERSION')) {
    $header_content_id = get_theme_mod('property_search_map_header_content');
    if ($header_content_id) {
        echo \Elementor\Plugin::instance()->frontend->get_builder_content_for_display($header_content_id);
    }
}
?>

<!-- Property Search Header -->
<div class="property-search-header">
    <div class="container">
        <h1 class="property-search-title"><?php echo esc_html__('Property Search', 'solvistaproperty'); ?></h1>
        <p class="property-search-description">
            <?php echo esc_html__('Find your perfect property using our interactive map search. Filter by location, property type, price range, and more.', 'solvistaproperty'); ?>
        </p>
    </div>
</div>

<!-- Property Search Template -->
<div class="property-search-template">
    <!-- Filters Section -->
    <div class="filters-section">
        <div class="filters-header">
            <h2>Filters</h2>
            <button type="button" class="reset-filters">
                <i class="fas fa-undo"></i>
                Reset All Filters
            </button>
        </div>
        <div class="filters-grid">
            <!-- Location Filter -->
            <div class="form-group">
                <label class="filter-label">Location</label>
                <div class="form-label">
                    <input type="text" class="filter-search" placeholder="Search location..." data-filter="location">
                </div>
                <div class="vscomp-options">
                    <div class="vscomp-option group-title" data-value="location-group">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Costa del Sol</span>
                    </div>
                    <div class="vscomp-option location-option" data-value="Los Barrios">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Los Barrios</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Algeciras</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">San Roque</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">La Línea</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">La Alcaidesa</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">San Roque Club</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Sotogrande</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Sotogrande Alto</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Sotogrande Costa</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Marbella</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Estepona</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Benahavís</span>
                    </div>
                    <div class="vscomp-option location-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Mijas</span>
                    </div>
                </div>
            </div>

            <!-- Property Type Filter -->
            <div class="form-group">
                <label class="filter-label">Property Type</label>
                <div class="form-label">
                    <input type="text" class="filter-search" placeholder="Search property type..." data-filter="type">
                </div>
                <div class="vscomp-options">
                    <div class="vscomp-option group-title" data-value="apartment-group">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Apartment</span>
                    </div>
                    <div class="vscomp-option apartment-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Ground Floor Apartment</span>
                    </div>
                    <div class="vscomp-option apartment-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Middle Floor Apartment</span>
                    </div>
                    <div class="vscomp-option apartment-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Penthouse</span>
                    </div>
                    <div class="vscomp-option apartment-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Studio Apartment</span>
                    </div>
                    <div class="vscomp-option apartment-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Duplex Apartment</span>
                    </div>
                    <div class="vscomp-option apartment-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Triplex Apartment</span>
                    </div>
                    <div class="vscomp-option apartment-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Loft</span>
                    </div>
                    <div class="vscomp-option group-title" data-value="house-group">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">House</span>
                    </div>
                    <div class="vscomp-option house-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Detached House</span>
                    </div>
                    <div class="vscomp-option house-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Semi-Detached House</span>
                    </div>
                    <div class="vscomp-option house-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Terraced House</span>
                    </div>
                    <div class="vscomp-option house-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Villa</span>
                    </div>
                    <div class="vscomp-option house-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Country House</span>
                    </div>
                    <div class="vscomp-option house-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Cortijo</span>
                    </div>
                    <div class="vscomp-option house-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">Finca</span>
                    </div>
                </div>
            </div>

            <!-- Bedrooms Filter -->
            <div class="form-group">
                <label class="filter-label">Bedrooms</label>
                <div class="form-label">
                    <input type="text" class="filter-search" placeholder="Search bedrooms..." data-filter="bedrooms">
                </div>
                <div class="vscomp-options">
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">1</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">2</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">3</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">4</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">5+</span>
                    </div>
                </div>
            </div>

            <!-- Price Filter -->
            <div class="form-group">
                <label class="filter-label">Price Range</label>
                <div class="form-label">
                    <input type="text" class="filter-search" placeholder="Search price range..." data-filter="price">
                </div>
                <div class="vscomp-options">
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">€100,000 - €250,000</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">€250,000 - €500,000</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">€500,000 - €1,000,000</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">€1,000,000 - €2,000,000</span>
                    </div>
                    <div class="vscomp-option">
                        <span class="checkbox-icon"></span>
                        <span class="vscomp-option-text">€2,000,000+</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Filters -->
        <div class="quick-filters-grid">
            <button type="button" class="button-6" data-filter="frontline_beach">
                <i class="fas fa-umbrella-beach"></i>
                Frontline Beach
            </button>
            <button type="button" class="button-6" data-filter="frontline_golf">
                <i class="fas fa-golf-ball"></i>
                Frontline Golf
            </button>
            <button type="button" class="button-6" data-filter="sea_views">
                <i class="fas fa-water"></i>
                Sea Views
            </button>
            <button type="button" class="button-6" data-filter="gated_community">
                <i class="fas fa-door-closed"></i>
                Gated Community
            </button>
            <button type="button" class="button-6" data-filter="andalusian_style">
                <i class="fas fa-home"></i>
                Andalusian Style
            </button>
            <button type="button" class="button-6" data-filter="renovated">
                <i class="fas fa-hammer"></i>
                Renovated
            </button>
        </div>
    </div>

    <!-- Map and Listings Section -->
    <div class="map-listings-section">
        <!-- Map Section -->
        <div class="map-section">
            <div id="map" class="map-container"></div>
            <div class="map-loader">
                <div class="loader-spinner"></div>
                <div>Loading properties...</div>
            </div>
        </div>

        <!-- Property Listings -->
        <div class="property-listings">
            <div class="listings-header">
                <h2>Available Properties</h2>
                <div class="listings-count">12 properties found</div>
            </div>
            <div class="listings-container" id="property-listings">
                <!-- Property listings will be dynamically inserted here -->
            </div>
        </div>
    </div>
</div>

<!-- Footer Content Area -->
<?php
if (defined('ELEMENTOR_VERSION')) {
    $footer_content_id = get_theme_mod('property_search_map_footer_content');
    if ($footer_content_id) {
        echo \Elementor\Plugin::instance()->frontend->get_builder_content_for_display($footer_content_id);
    }
}
?>

<!-- Template-specific styles -->
<style>
    /* Reset and Base Styles */
    .property-search-template {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 0 1rem 2rem;
    }

    /* Property Search Header */
    .property-search-header {
        background-color: #1e293b;
        padding: 80px 0 4rem 0;
        margin-bottom: 2rem;
        text-align: center;
    }

    .property-search-header .property-search-title {
        font-size: 6.5rem;
        font-weight: 700;
        margin-top: 1rem;
        color: #ffffff;
        margin-bottom: 1rem;
    }

    .property-search-description {
        font-size: 2rem;
        color: #94a3b8;
        max-width: 600px;
        margin: 0 auto;
    }

    /* Filters Section */
    .filters-section {
        background-color: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        padding: 1.5rem;
        margin-bottom: 2rem;
        border-radius: 8px;
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

    .form-control {
        width: 100%;
        height: 42px;
        padding: 8px 12px;
        font-size: 15px;
        line-height: 1.5;
        color: #374151;
        background-color: #fff;
        border: 1px solid #E8EAED;
        border-radius: 5px;
        transition: all 150ms ease;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0L5 6L10 0' stroke='%236B7280' stroke-width='2' fill='none'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 10px 6px;
    }

    .form-control:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    /* Quick Filters Grid */
    .quick-filters-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 0.75rem;
        margin-top: 2rem;
    }

    .button-6 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        padding: 0.5rem 0.75rem;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        color: #64748b;
        font-size: 1.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 150ms ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }


    .button-6 i {
        font-size: 1.5rem;
    }

    /* Split Screen Layout */
    .split-screen-layout {
        display: flex;
        height: calc(100vh - 200px);
        margin-bottom: 2rem;
        border-radius: 8px;
        overflow: hidden;
    }

    /* Map Section */
    .map-section {
        flex: 1;
        position: relative;
        height: 100%;
    }

    .map-container {
        width: 100%;
        height: 100%;
        border-radius: 8px;
    }

    /* Property Listings */
    .property-listings {
        width: 100%;
        background: #fff;
        border-left: 1px solid #e2e8f0;
        overflow-y: auto;
    }

    .listings-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .listings-header h2 {
        font-size: 3rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
    }

    .listings-count {
        font-size: 2rem;
        color: #64748b;
        margin-top: 0.5rem;
    }

    .listings-container {
        padding: 1rem;
    }

    /* Property Card */
    .property-card {
        display: flex;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .property-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .property-card.active {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .property-image {
        width: 120px;
        height: 120px;
        background-size: cover;
        background-position: center;
    }

    .property-info {
        flex: 1;
        padding: 1rem;
    }

    .property-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
    }

    .property-location {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0 0 0.5rem 0;
    }

    .property-price {
        font-size: 1.125rem;
        font-weight: 600;
        color: #3b82f6;
        margin: 0 0 0.5rem 0;
    }

    .property-details {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        color: #64748b;
    }

    .property-detail {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    /* Map Popup Styles */
    .property-popup {
        padding: 1rem;
        max-width: 300px;
    }

    .property-popup h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: #1e293b;
    }

    .property-popup p {
        margin: 0 0 0.5rem 0;
        color: #64748b;
    }

    .view-property {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #3b82f6;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 0.5rem;
        transition: background-color 0.2s ease;
    }

    .view-property:hover {
        background-color: #2563eb;
    }

    /* Responsive Styles */
    @media (max-width: 1024px) {
        .split-screen-layout {
            flex-direction: column;
            height: auto;
        }

        .property-listings {
            width: 100%;
            height: 400px;
        }

        .map-section {
            height: 400px;
        }
    }

    @media (max-width: 768px) {
        .property-card {
            flex-direction: column;
        }

        .property-image {
            width: 100%;
            height: 200px;
        }
    }

    /* Custom Marker Styles */
    .custom-marker {
        background-color: #3b82f6;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .custom-marker.highlighted {
        background-color: #ef4444;
        transform: scale(1.2);
        z-index: 1000;
    }

    /* Marker Cluster Styles */
    .marker-cluster {
        background-color: rgba(59, 130, 246, 0.6);
        border: 2px solid #fff;
        border-radius: 50%;
        color: #fff;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .marker-cluster div {
        background-color: rgba(59, 130, 246, 0.8);
        border-radius: 50%;
        margin: 2px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }

    .marker-cluster-small {
        width: 30px;
        height: 30px;
    }

    .marker-cluster-small div {
        width: 26px;
        height: 26px;
        line-height: 26px;
        font-size: 10px;
    }

    .marker-cluster-medium {
        width: 40px;
        height: 40px;
    }

    .marker-cluster-medium div {
        width: 36px;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
    }

    .marker-cluster-large {
        width: 50px;
        height: 50px;
    }

    .marker-cluster-large div {
        width: 46px;
        height: 46px;
        line-height: 46px;
        font-size: 14px;
    }

    .filter-search {
        width: 100%;
        padding: 0.5rem;
        border: none;
        background: transparent;
        font-size: 14px;
        color: #374151;
        outline: none;
    }

    .filter-search::placeholder {
        color: #6b7280;
    }

    .vscomp-option.hidden {
        display: none;
    }

    .vscomp-option.highlighted {
        background-color: #f3f4f6;
    }
</style>

<?php get_footer(); ?>