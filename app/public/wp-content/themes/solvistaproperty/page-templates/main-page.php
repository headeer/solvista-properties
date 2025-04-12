<?php
/**
 * Template Name: Proper v1
 * Template Post Type: page
 * 
 * This is the main template for the property search map functionality.
 * It includes filters, map display, and property listings.
 */

get_header();
?>

<!-- Add Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<svg class="inline-svg">
    <symbol id="check-4" viewbox="0 0 12 10">
        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    </symbol>
</svg>
<!-- Search by Map Header -->
<div class="search-by-map-header">
    <div class="search-by-map-header-content">
        <h1>Search by Map</h1>
        <p>Find your perfect property by exploring our interactive map</p>
        <div class="search-by-map-breadcrumbs">
            <a href="<?php echo home_url(); ?>">Home</a>
            <span>/</span>
            <a href="<?php echo home_url('/properties/'); ?>">Properties</a>
            <span>/</span>
            <span>Search by Map</span>
        </div>
    </div>
</div>

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
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>All Locations</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-benalmadena" type="checkbox" name="location" value="Benalmadena" data-parent="all"/>
                                            <label class="cbx" for="location-benalmadena">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>Benalmadena</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-coín" type="checkbox" name="location" value="Coín" data-parent="all"/>
                                            <label class="cbx" for="location-coín">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>Coín</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-fuengirola" type="checkbox" name="location" value="Fuengirola" data-parent="all"/>
                                            <label class="cbx" for="location-fuengirola">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>Fuengirola</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-mijas" type="checkbox" name="location" value="Mijas" data-parent="all"/>
                                            <label class="cbx" for="location-mijas">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>Mijas</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="location-torremolinos" type="checkbox" name="location" value="Torremolinos" data-parent="all"/>
                                            <label class="cbx" for="location-torremolinos">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>Torremolinos</span>
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
                                    <div class="group-items">
                                        <div class="option-group">
                                            <div class="group-header">
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-apartment" type="checkbox" name="property_type" value="apartment"/>
                                                    <label class="cbx" for="property_type-apartment">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Apartment</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="group-items">
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-1" type="checkbox" name="property_type" value="1-1-1-1" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-1">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Ground Floor Apartment</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-2" type="checkbox" name="property_type" value="1-1-1-2" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-2">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>First Floor Apartment</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-3" type="checkbox" name="property_type" value="1-1-1-3" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-3">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Duplex Apartment</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-4" type="checkbox" name="property_type" value="1-1-1-4" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-4">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Middle Floor Apartment</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-5" type="checkbox" name="property_type" value="1-1-1-5" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-5">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Top Floor Apartment</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-6" type="checkbox" name="property_type" value="1-1-1-6" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-6">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Penthouse</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-7" type="checkbox" name="property_type" value="1-1-1-7" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-7">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Studio Apartment</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-1-1-1-8" type="checkbox" name="property_type" value="1-1-1-8" data-parent="apartment"/>
                                                    <label class="cbx" for="property_type-1-1-1-8">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Loft</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="option-group">
                                            <div class="group-header">
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-house" type="checkbox" name="property_type" value="house"/>
                                                    <label class="cbx" for="property_type-house">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>House</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="group-items">
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-1" type="checkbox" name="property_type" value="2-1-2-1" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-1">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Apartment</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-2" type="checkbox" name="property_type" value="2-1-2-2" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-2">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Bungalow</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-3" type="checkbox" name="property_type" value="2-1-2-3" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-3">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Chalet</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-4" type="checkbox" name="property_type" value="2-1-2-4" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-4">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Country House</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-5" type="checkbox" name="property_type" value="2-1-2-5" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-5">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Townhouse</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-6" type="checkbox" name="property_type" value="2-1-2-6" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-6">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Semi Detached</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-7" type="checkbox" name="property_type" value="2-1-2-7" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-7">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Finca</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-8" type="checkbox" name="property_type" value="2-1-2-8" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-8">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Villa</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-2-1-2-9" type="checkbox" name="property_type" value="2-1-2-9" data-parent="house"/>
                                                    <label class="cbx" for="property_type-2-1-2-9">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Cortijo</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="option-group">
                                            <div class="group-header">
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-plot" type="checkbox" name="property_type" value="plot"/>
                                                    <label class="cbx" for="property_type-plot">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Plot</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="group-items">
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-3-1-3-1" type="checkbox" name="property_type" value="3-1-3-1" data-parent="plot"/>
                                                    <label class="cbx" for="property_type-3-1-3-1">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Building Plot</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-3-1-3-2" type="checkbox" name="property_type" value="3-1-3-2" data-parent="plot"/>
                                                    <label class="cbx" for="property_type-3-1-3-2">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Residential Plot</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-3-1-3-3" type="checkbox" name="property_type" value="3-1-3-3" data-parent="plot"/>
                                                    <label class="cbx" for="property_type-3-1-3-3">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Commercial Plot</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-3-1-3-4" type="checkbox" name="property_type" value="3-1-3-4" data-parent="plot"/>
                                                    <label class="cbx" for="property_type-3-1-3-4">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Rustic Plot</span>
                                                    </label>
                                                </div>
                                                <div class="checkbox-wrapper-4">
                                                    <input class="inp-cbx" id="property_type-3-1-3-5" type="checkbox" name="property_type" value="3-1-3-5" data-parent="plot"/>
                                                    <label class="cbx" for="property_type-3-1-3-5">
                                                        <span>
                                                            <svg width="12px" height="10px">
                                                                <use xlink:href="#check-4"></use>
                                                            </svg>
                                                        </span>
                                                        <span>Urban Plot</span>
                                                    </label>
                                                </div>
                                            </div>
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
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>All Prices</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-50000" type="checkbox" name="price" value="50000" data-parent="all"/>
                                            <label class="cbx" for="price-50000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 50,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-100000" type="checkbox" name="price" value="100000" data-parent="all"/>
                                            <label class="cbx" for="price-100000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 100,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-150000" type="checkbox" name="price" value="150000" data-parent="all"/>
                                            <label class="cbx" for="price-150000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 150,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-200000" type="checkbox" name="price" value="200000" data-parent="all"/>
                                            <label class="cbx" for="price-200000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 200,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-250000" type="checkbox" name="price" value="250000" data-parent="all"/>
                                            <label class="cbx" for="price-250000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 250,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-300000" type="checkbox" name="price" value="300000" data-parent="all"/>
                                            <label class="cbx" for="price-300000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 300,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-400000" type="checkbox" name="price" value="400000" data-parent="all"/>
                                            <label class="cbx" for="price-400000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 400,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-500000" type="checkbox" name="price" value="500000" data-parent="all"/>
                                            <label class="cbx" for="price-500000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 500,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-750000" type="checkbox" name="price" value="750000" data-parent="all"/>
                                            <label class="cbx" for="price-750000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 750,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-1000000" type="checkbox" name="price" value="1000000" data-parent="all"/>
                                            <label class="cbx" for="price-1000000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 1,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-1500000" type="checkbox" name="price" value="1500000" data-parent="all"/>
                                            <label class="cbx" for="price-1500000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 1,500,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-2000000" type="checkbox" name="price" value="2000000" data-parent="all"/>
                                            <label class="cbx" for="price-2000000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 2,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-3000000" type="checkbox" name="price" value="3000000" data-parent="all"/>
                                            <label class="cbx" for="price-3000000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 3,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-5000000" type="checkbox" name="price" value="5000000" data-parent="all"/>
                                            <label class="cbx" for="price-5000000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>€ 5,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="price-10000000" type="checkbox" name="price" value="10000000" data-parent="all"/>
                                            <label class="cbx" for="price-10000000">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
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
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>All Bedrooms</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-0" type="checkbox" name="bedrooms" value="0" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-0">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>0</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-1" type="checkbox" name="bedrooms" value="1" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-1">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>1</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-2" type="checkbox" name="bedrooms" value="2" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-2">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>2</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-3" type="checkbox" name="bedrooms" value="3" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-3">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>3</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-4" type="checkbox" name="bedrooms" value="4" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-4">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
                                                <span>4</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="bedrooms-5" type="checkbox" name="bedrooms" value="5" data-parent="all"/>
                                            <label class="cbx" for="bedrooms-5">
                                                <span>
                                                    <svg width="12px" height="10px">
                                                        <use xlink:href="#check-4"></use>
                                                    </svg>
                                                </span>
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
                <button class="quick-filter-button" data-feature="1Category15">
                    <span class="button-text">New Development</span>
                </button>
                <button class="quick-filter-button" data-feature="1Setting22">
                    <span class="button-text">Frontline Beach</span>
                </button>
                <button class="quick-filter-button" data-feature="1Setting2">
                    <span class="button-text">Frontline Golf</span>
                </button>
                <button class="quick-filter-button" data-feature="1Category8">
                    <span class="button-text">Exclusive/Premium</span>
                </button>
                <button class="quick-filter-button" data-feature="1Category14">
                    <span class="button-text">Modern</span>
                </button>
            </div>
        </form>
    </div>

    <!-- Map and Property Listing Section -->
    <div class="map-listing-container" style="display: flex; gap: 1rem; margin-bottom: 2rem;">
        <!-- Map Section -->
        <div class="map-section" style="flex: 2;">
            <div id="map" class="map-container"></div>
            <div id="map-loader" class="map-loader">
                <div class="loader-spinner"></div>
                <span>Loading properties...</span>
            </div>
        </div>
        
        <!-- Property Listing Section -->
        <div class="property-listing-section" style="flex: 1;">
            <div class="property-listing-header">
                <h3 class="property-listing-title">Our Exclusive Listings <span class="property-count-display">(0 properties)</span></h3>
                <p class="property-listing-description">Discover our handpicked selection of premium properties in the Costa del Sol.</p>
            </div>
            <div class="property-listing-container" id="property-listings">
                <!-- Property listings will be dynamically added here -->
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    body .property-details .property-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}
    /* Fix price filter search */
    .price-filter .search-box input {
        width: 100%;
        box-sizing: border-box;
    }
</style>

<!-- Add Leaflet MarkerCluster CSS and JS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/page-templates/property-search-map.css">
<script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>

<script src="<?php echo get_template_directory_uri(); ?>/page-templates/property-search-map.js"></script>
<?php
get_footer();