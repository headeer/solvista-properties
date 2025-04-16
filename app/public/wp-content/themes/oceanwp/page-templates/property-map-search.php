<?php
/**
 * Template Name: Property final v2
 * Template Post Type: page
 * 
 * This is the main template for the property search map functionality.
 * It includes filters, map display, and property listings.
 */

get_header();
?>

<body <?php body_class(); ?>>
    <!-- Global Loader -->
    <div class="global-loader">
        <div class="global-loader-content">
            <div class="global-loader-spinner"></div>
            <div class="global-loader-text">Loading Properties</div>
            <div class="global-loader-subtext">Please wait while we fetch the latest listings...</div>
        </div>
    </div>

<!-- Add Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<

<!-- Add Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />

<!-- Add property map search CSS -->
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/page-templates/property-map-search.css">

<!-- Search by Map Header -->
<div class="search-by-map-header">
    <div class="search-by-map-header-content">
        <div class="search-by-map-title">
            <h1>Search by Map</h1>
            <p class="subtitle">Find your perfect property by exploring our interactive map</p>
        </div>
        <div class="search-by-map-breadcrumbs">
            <a href="<?php echo home_url(); ?>" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">/</span>
            <a href="<?php echo home_url('/properties/'); ?>" class="breadcrumb-link">Properties</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Search by Map</span>
        </div>
    </div>
</div>

<style>
/* Header Styles */
.search-by-map-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 60px 0 40px;
    margin-bottom: 40px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.search-by-map-header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.search-by-map-title {
    margin-bottom: 30px;
}

.search-by-map-title h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 15px;
    line-height: 1.2;
}

.search-by-map-title .subtitle {
    font-size: 1.1rem;
    color: #6c757d;
    margin: 0;
    line-height: 1.5;
}

/* Breadcrumbs Styles */
.search-by-map-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
}

.breadcrumb-link {
    color: #3498db;
    text-decoration: none;
    transition: color 0.3s ease;
    padding: 5px 0;
}

.breadcrumb-link:hover {
    color: #2980b9;
    text-decoration: underline;
}

.breadcrumb-separator {
    color: #95a5a6;
}

.breadcrumb-current {
    color: #7f8c8d;
    font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
    .search-by-map-header {
        padding: 40px 0 30px;
    }

    .search-by-map-title h1 {
        font-size: 2rem;
    }

    .search-by-map-title .subtitle {
        font-size: 1rem;
    }

    .search-by-map-breadcrumbs {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .search-by-map-header {
        padding: 30px 0 20px;
    }

    .search-by-map-title h1 {
        font-size: 1.75rem;
    }

    .search-by-map-breadcrumbs {
        flex-wrap: wrap;
    }
}
</style>

<div class="site-content">
    <!-- Filters Section -->
    <div class="filters-section">
        <form id="property-filters" class="filters-form">
            <!-- Main Filters -->
            <div class="filters-grid">
                <!-- Location -->
                <div class="form-group">
                    <label for="location" class="form-label">Location</label>
                    <div class="custom-select">
                        <div class="select-header">
                            <span class="selected-text">Choose location</span>
                            <span class="select-arrow">▼</span>
                        </div>
                        <div class="select-dropdown">
                            <div class="search-box">
                                <input type="text" placeholder="Search location...">
                            </div>
                            <hr class="select-divider">
                            <div class="options-container">
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-all" type="checkbox" name="location" value="all"/>
                                            <label class="cbx" for="location-all">
                                                <span>All Locations</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <!-- Main Areas -->
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-malaga" type="checkbox" name="location" value="Málaga" data-parent="all"/>
                                            <label class="cbx" for="location-malaga">
                                                <span>Málaga</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-marbella" type="checkbox" name="location" value="Marbella" data-parent="all"/>
                                            <label class="cbx" for="location-marbella">
                                                <span>Marbella</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-estepona" type="checkbox" name="location" value="Estepona" data-parent="all"/>
                                            <label class="cbx" for="location-estepona">
                                                <span>Estepona</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-fuengirola" type="checkbox" name="location" value="Fuengirola" data-parent="all"/>
                                            <label class="cbx" for="location-fuengirola">
                                                <span>Fuengirola</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-mijas" type="checkbox" name="location" value="Mijas" data-parent="all"/>
                                            <label class="cbx" for="location-mijas">
                                                <span>Mijas</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-benalmadena" type="checkbox" name="location" value="Benalmadena" data-parent="all"/>
                                            <label class="cbx" for="location-benalmadena">
                                                <span>Benalmadena</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-torremolinos" type="checkbox" name="location" value="Torremolinos" data-parent="all"/>
                                            <label class="cbx" for="location-torremolinos">
                                                <span>Torremolinos</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-antequera" type="checkbox" name="location" value="Antequera" data-parent="all"/>
                                            <label class="cbx" for="location-antequera">
                                                <span>Antequera</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-ronda" type="checkbox" name="location" value="Ronda" data-parent="all"/>
                                            <label class="cbx" for="location-ronda">
                                                <span>Ronda</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-sotogrande" type="checkbox" name="location" value="Sotogrande" data-parent="all"/>
                                            <label class="cbx" for="location-sotogrande">
                                                <span>Sotogrande</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Málaga Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-malaga-centro" type="checkbox" name="location" value="Málaga Centro" data-parent="Málaga"/>
                                            <label class="cbx" for="location-malaga-centro">
                                                <span>Málaga Centro</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-malaga-este" type="checkbox" name="location" value="Málaga Este" data-parent="Málaga Centro"/>
                                            <label class="cbx" for="location-malaga-este">
                                                <span>Málaga Este</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-puerto-torre" type="checkbox" name="location" value="Puerto de la Torre" data-parent="Málaga Centro"/>
                                            <label class="cbx" for="location-puerto-torre">
                                                <span>Puerto de la Torre</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Marbella Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-puerto-banus" type="checkbox" name="location" value="Puerto Banús" data-parent="Marbella"/>
                                            <label class="cbx" for="location-puerto-banus">
                                                <span>Puerto Banús</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-nueva-andalucia" type="checkbox" name="location" value="Nueva Andalucía" data-parent="Puerto Banús"/>
                                            <label class="cbx" for="location-nueva-andalucia">
                                                <span>Nueva Andalucía</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-golden-mile" type="checkbox" name="location" value="The Golden Mile" data-parent="Puerto Banús"/>
                                            <label class="cbx" for="location-golden-mile">
                                                <span>The Golden Mile</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-sierra-blanca" type="checkbox" name="location" value="Sierra Blanca" data-parent="Puerto Banús"/>
                                            <label class="cbx" for="location-sierra-blanca">
                                                <span>Sierra Blanca</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Estepona Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-new-golden-mile" type="checkbox" name="location" value="New Golden Mile" data-parent="Estepona"/>
                                            <label class="cbx" for="location-new-golden-mile">
                                                <span>New Golden Mile</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-cancelada" type="checkbox" name="location" value="Cancelada" data-parent="New Golden Mile"/>
                                            <label class="cbx" for="location-cancelada">
                                                <span>Cancelada</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-atalaya" type="checkbox" name="location" value="Atalaya" data-parent="New Golden Mile"/>
                                            <label class="cbx" for="location-atalaya">
                                                <span>Atalaya</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Fuengirola Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-los-boliches" type="checkbox" name="location" value="Los Boliches" data-parent="Fuengirola"/>
                                            <label class="cbx" for="location-los-boliches">
                                                <span>Los Boliches</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-carib-playa" type="checkbox" name="location" value="Carib Playa" data-parent="Los Boliches"/>
                                            <label class="cbx" for="location-carib-playa">
                                                <span>Carib Playa</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Mijas Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-mijas-costa" type="checkbox" name="location" value="Mijas Costa" data-parent="Mijas"/>
                                            <label class="cbx" for="location-mijas-costa">
                                                <span>Mijas Costa</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-la-cala" type="checkbox" name="location" value="La Cala de Mijas" data-parent="Mijas Costa"/>
                                            <label class="cbx" for="location-la-cala">
                                                <span>La Cala de Mijas</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-calahonda" type="checkbox" name="location" value="Calahonda" data-parent="Mijas Costa"/>
                                            <label class="cbx" for="location-calahonda">
                                                <span>Calahonda</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Benalmadena Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-benalmadena-costa" type="checkbox" name="location" value="Benalmadena Costa" data-parent="Benalmadena"/>
                                            <label class="cbx" for="location-benalmadena-costa">
                                                <span>Benalmadena Costa</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-arroyo-miel" type="checkbox" name="location" value="Arroyo de la Miel" data-parent="Benalmadena Costa"/>
                                            <label class="cbx" for="location-arroyo-miel">
                                                <span>Arroyo de la Miel</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Torremolinos Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-torremolinos-centro" type="checkbox" name="location" value="Torremolinos Centro" data-parent="Torremolinos"/>
                                            <label class="cbx" for="location-torremolinos-centro">
                                                <span>Torremolinos Centro</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-carihuela" type="checkbox" name="location" value="La Carihuela" data-parent="Torremolinos Centro"/>
                                            <label class="cbx" for="location-carihuela">
                                                <span>La Carihuela</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Sotogrande Sub-locations -->
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-sotogrande-costa" type="checkbox" name="location" value="Sotogrande Costa" data-parent="Sotogrande"/>
                                            <label class="cbx" for="location-sotogrande-costa">
                                                <span>Sotogrande Costa</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-sotogrande-marina" type="checkbox" name="location" value="Sotogrande Marina" data-parent="Sotogrande Costa"/>
                                            <label class="cbx" for="location-sotogrande-marina">
                                                <span>Sotogrande Marina</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-sotogrande-playa" type="checkbox" name="location" value="Sotogrande Playa" data-parent="Sotogrande Costa"/>
                                            <label class="cbx" for="location-sotogrande-playa">
                                                <span>Sotogrande Playa</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Property Type -->
                <div class="form-group">
                    <label for="property-type" class="form-label">Property Type</label>
                    <div class="custom-select">
                        <div class="select-header">
                            <span class="selected-text">Choose type</span>
                            <span class="select-arrow">▼</span>
                        </div>
                        <div class="select-dropdown">
                            <div class="search-box">
                                <input type="text" placeholder="Search property type...">
                            </div>
                            <hr class="select-divider">
                            <div class="options-container">
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-all" type="checkbox" name="property_type" value="all"/>
                                            <label class="cbx" for="property_type-all">
                                                <span>All Property Types</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-apartment" type="checkbox" name="property_type" value="1-1"/>
                                            <label class="cbx" for="property_type-apartment">
                                                <span>Apartment</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-ground-floor" type="checkbox" name="property_type" value="1-2" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-ground-floor">
                                                <span>Ground Floor Apartment</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-middle-floor" type="checkbox" name="property_type" value="1-4" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-middle-floor">
                                                <span>Middle Floor Apartment</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-top-floor" type="checkbox" name="property_type" value="1-5" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-top-floor">
                                                <span>Top Floor Apartment</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-penthouse" type="checkbox" name="property_type" value="1-6" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-penthouse">
                                                <span>Penthouse</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-penthouse-duplex" type="checkbox" name="property_type" value="1-7" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-penthouse-duplex">
                                                <span>Penthouse Duplex</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-duplex" type="checkbox" name="property_type" value="1-8" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-duplex">
                                                <span>Duplex</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-ground-floor-studio" type="checkbox" name="property_type" value="1-9" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-ground-floor-studio">
                                                <span>Ground Floor Studio</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-middle-floor-studio" type="checkbox" name="property_type" value="1-10" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-middle-floor-studio">
                                                <span>Middle Floor Studio</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-top-floor-studio" type="checkbox" name="property_type" value="1-11" data-parent="1-1"/>
                                            <label class="cbx" for="property_type-top-floor-studio">
                                                <span>Top Floor Studio</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-house" type="checkbox" name="property_type" value="2-1"/>
                                            <label class="cbx" for="property_type-house">
                                                <span>House</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-detached-villa" type="checkbox" name="property_type" value="2-2" data-parent="2-1"/>
                                            <label class="cbx" for="property_type-detached-villa">
                                                <span>Detached Villa</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-semi-detached" type="checkbox" name="property_type" value="2-4" data-parent="2-1"/>
                                            <label class="cbx" for="property_type-semi-detached">
                                                <span>Semi-Detached House</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-townhouse" type="checkbox" name="property_type" value="2-5" data-parent="2-1"/>
                                            <label class="cbx" for="property_type-townhouse">
                                                <span>Townhouse</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="property_type-finca" type="checkbox" name="property_type" value="2-6" data-parent="2-1"/>
                                            <label class="cbx" for="property_type-finca">
                                                <span>Finca - Cortijo</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Price -->
                <div class="form-group">
                    <label for="price" class="form-label">Price</label>
                    <div class="custom-select price-filter">
                        <div class="select-header">
                            <span class="selected-text">Choose price</span>
                            <span class="select-arrow">▼</span>
                        </div>
                        <div class="select-dropdown">
                            <div class="search-box">
                                <input type="text" placeholder="Search price...">
                            </div>
                            <hr class="select-divider">
                            <div class="options-container">
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-all" type="checkbox" name="price" value="all"/>
                                            <label class="cbx" for="price-all">
                                                
                                                <span>All Prices</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-50000" type="checkbox" name="price" value="50000" data-parent="all"/>
                                            <label class="cbx" for="price-50000">
                                                
                                                <span>€ 50,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-100000" type="checkbox" name="price" value="100000" data-parent="all"/>
                                            <label class="cbx" for="price-100000">
                                                
                                                <span>€ 100,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-150000" type="checkbox" name="price" value="150000" data-parent="all"/>
                                            <label class="cbx" for="price-150000">
                                                
                                                <span>€ 150,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-200000" type="checkbox" name="price" value="200000" data-parent="all"/>
                                            <label class="cbx" for="price-200000">
                                                
                                                <span>€ 200,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-250000" type="checkbox" name="price" value="250000" data-parent="all"/>
                                            <label class="cbx" for="price-250000">
                                                
                                                <span>€ 250,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-300000" type="checkbox" name="price" value="300000" data-parent="all"/>
                                            <label class="cbx" for="price-300000">
                                                
                                                <span>€ 300,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-400000" type="checkbox" name="price" value="400000" data-parent="all"/>
                                            <label class="cbx" for="price-400000">
                                                
                                                <span>€ 400,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-500000" type="checkbox" name="price" value="500000" data-parent="all"/>
                                            <label class="cbx" for="price-500000">
                                                
                                                <span>€ 500,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-750000" type="checkbox" name="price" value="750000" data-parent="all"/>
                                            <label class="cbx" for="price-750000">
                                                
                                                <span>€ 750,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-1000000" type="checkbox" name="price" value="1000000" data-parent="all"/>
                                            <label class="cbx" for="price-1000000">
                                                
                                                <span>€ 1,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-1500000" type="checkbox" name="price" value="1500000" data-parent="all"/>
                                            <label class="cbx" for="price-1500000">
                                                
                                                <span>€ 1,500,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-2000000" type="checkbox" name="price" value="2000000" data-parent="all"/>
                                            <label class="cbx" for="price-2000000">
                                                
                                                <span>€ 2,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-3000000" type="checkbox" name="price" value="3000000" data-parent="all"/>
                                            <label class="cbx" for="price-3000000">
                                                
                                                <span>€ 3,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-5000000" type="checkbox" name="price" value="5000000" data-parent="all"/>
                                            <label class="cbx" for="price-5000000">
                                                
                                                <span>€ 5,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-10000000" type="checkbox" name="price" value="10000000" data-parent="all"/>
                                            <label class="cbx" for="price-10000000">
                                                
                                                <span>€ 10,000,000</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bedrooms -->
                <div class="form-group">
                    <label for="bedrooms" class="form-label">Bedrooms</label>
                    <div class="custom-select">
                        <div class="select-header">
                            <span class="selected-text">Choose bedrooms</span>
                            <span class="select-arrow">▼</span>
                        </div>
                        <div class="select-dropdown">
                            <div class="search-box">
                                <input type="text" placeholder="Search bedrooms...">
                            </div>
                            <hr class="select-divider">
                            <div class="options-container">
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-all" type="checkbox" name="bedrooms" value="all"/>
                                            <label class="cbx" for="bedrooms-all">
                                                
                                                <span>All Bedrooms</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-0" type="checkbox" name="bedrooms" value="0" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-0">
                                                
                                                <span>0</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-1" type="checkbox" name="bedrooms" value="1" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-1">
                                                
                                                <span>1</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-2" type="checkbox" name="bedrooms" value="2" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-2">
                                                
                                                <span>2</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-3" type="checkbox" name="bedrooms" value="3" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-3">
                                                
                                                <span>3</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-4" type="checkbox" name="bedrooms" value="4" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-4">
                                                
                                                <span>4</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-5" type="checkbox" name="bedrooms" value="5" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-5">
                                                
                                                <span>5+</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bathrooms -->
                <div class="form-group">
                    <label for="bathrooms" class="form-label">Bathrooms</label>
                    <div class="custom-select">
                        <div class="select-header">
                            <span class="selected-text">Choose bathrooms</span>
                            <span class="select-arrow">▼</span>
                        </div>
                        <div class="select-dropdown">
                            <div class="search-box">
                                <input type="text" placeholder="Search bathrooms...">
                            </div>
                            <hr class="select-divider">
                            <div class="options-container">
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bathrooms-all" type="checkbox" name="bathrooms" value="all"/>
                                            <label class="cbx" for="bathrooms-all">
                                                
                                                <span>All Bathrooms</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bathrooms-0" type="checkbox" name="bathrooms" value="0" data-parent="all"/>
                                            <label class="cbx" for="bathrooms-0">
                                                
                                                <span>0</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bathrooms-1" type="checkbox" name="bathrooms" value="1" data-parent="all"/>
                                            <label class="cbx" for="bathrooms-1">
                                                
                                                <span>1</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bathrooms-2" type="checkbox" name="bathrooms" value="2" data-parent="all"/>
                                            <label class="cbx" for="bathrooms-2">
                                                
                                                <span>2</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bathrooms-3" type="checkbox" name="bathrooms" value="3" data-parent="all"/>
                                            <label class="cbx" for="bathrooms-3">
                                                
                                                <span>3</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bathrooms-4" type="checkbox" name="bathrooms" value="4" data-parent="all"/>
                                            <label class="cbx" for="bathrooms-4">
                                                
                                                <span>4</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bathrooms-5" type="checkbox" name="bathrooms" value="5" data-parent="all"/>
                                            <label class="cbx" for="bathrooms-5">
                                                
                                                <span>5+</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Quick Filters -->
            <div class="quick-filters">
                <button class="quick-filter-button" data-filter-type="beach" data-filter-value="true">
                    <i class="fas fa-umbrella-beach"></i>
                    Frontline Beach
                </button>
                <button class="quick-filter-button" data-filter-type="golf" data-filter-value="true">
                    <i class="fas fa-golf-ball"></i>
                    Frontline Golf
                </button>
                <button class="quick-filter-button" data-filter-type="exclusive" data-filter-value="true">
                    <i class="fas fa-crown"></i>
                    Exclusive/Premium
                </button>
                <button class="quick-filter-button" data-filter-type="modern" data-filter-value="true">
                    <i class="fas fa-building"></i>
                    Modern
                </button>
                <button class="quick-filter-button" data-filter-type="new" data-filter-value="true">
                    <i class="fas fa-home"></i>
                    New Development
                </button>
            </div>
            
            <!-- Advanced Filters Toggle -->
            <div class="advanced-filters-toggle">
                <button type="button" class="toggle-button">
                    <i class="fas fa-sliders-h"></i>
                    <span>Advanced Filters</span>
                </button>
            </div>
            
            <!-- Advanced Filters Panel -->
            <div class="advanced-filters-panel">
                <div class="advanced-filters-header">
                    <h3>Advanced Filters</h3>
                    <button type="button" class="close-panel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="advanced-filters-content">
                    <div class="advanced-filters-grid">
                        <div class="filter-option">
                            <input type="checkbox" id="frontline-beach" name="features" value="frontline-beach">
                            <label for="frontline-beach">
                                <i class="fas fa-umbrella-beach"></i>
                                <span>Frontline Beach</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="frontline-golf" name="features" value="frontline-golf">
                            <label for="frontline-golf">
                                <i class="fas fa-golf-ball"></i>
                                <span>Frontline Golf</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="exclusive" name="features" value="exclusive">
                            <label for="exclusive">
                                <i class="fas fa-crown"></i>
                                <span>Exclusive/Premium</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="modern" name="features" value="modern">
                            <label for="modern">
                                <i class="fas fa-building"></i>
                                <span>Modern</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="new-development" name="features" value="new-development">
                            <label for="new-development">
                                <i class="fas fa-home"></i>
                                <span>New Development</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="sea-views" name="features" value="sea-views">
                            <label for="sea-views">
                                <i class="fas fa-water"></i>
                                <span>Sea Views</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="exclusive-listing" name="features" value="exclusive-listing">
                            <label for="exclusive-listing">
                                <i class="fas fa-star"></i>
                                <span>Exclusive Listing</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="gated-community" name="features" value="gated-community">
                            <label for="gated-community">
                                <i class="fas fa-shield-alt"></i>
                                <span>Recommended Gated Community</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="andalusian" name="features" value="andalusian">
                            <label for="andalusian">
                                <i class="fas fa-archway"></i>
                                <span>Andalusian Style</span>
                            </label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="renovated" name="features" value="renovated">
                            <label for="renovated">
                                <i class="fas fa-hammer"></i>
                                <span>Renovated</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- Map and Properties Section -->
    <div class="property-search-map-container">
        <div id="map" class="property-search-map"></div>
        <div id="loading-indicator" class="loading-indicator">
            <div class="loader-container">
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading Properties</div>
                 <div class="loader-subtext">Please wait while we fetch the latest listings...</div>
            </div>
        </div>
        <div id="map-error" class="map-error"></div>
    </div>
</div>

<!-- Add Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>

<!-- Add property map search JS -->
<script src="<?php echo get_template_directory_uri(); ?>/page-templates/property-map-fallback.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/page-templates/property-map-search.js"></script>

<?php get_footer(); ?>