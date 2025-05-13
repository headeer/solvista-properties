<?php
/**
 * Template Name: Property final v3
 * Template Post Type: page
 * 
 * This is the main template for the property search map functionality.
 * It includes filters, map display, and property listings.
 */

get_header();
?>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        /* Global font settings */
        .filters-section {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            font-size: 15px;
            color: #333;
        }
        
        /* Filter sections styles */
        .filters-section {
            background-color: #fff;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 4px;
        }
        
        /* Basic filters grid */
        .basic-filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        
        /* Advanced filters */
        .advanced-filters-container {
            display: none;
            margin-top: 15px;
        }
        
        .advanced-filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
        }
        
        /* Form element styles */
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 15px;
            color: #333;
        }
        
        /* Dropdown styling for all select elements */
        .custom-select, 
        .filter-select {
            position: relative;
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 6px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        
        .custom-select:hover, 
        .filter-select:hover {
            border-color: #bbb;
            box-shadow: 0 2px 5px rgba(0,0,0,0.08);
        }
        
        .custom-select.open {
            border-color: #ea682f;
            border-radius: 6px 6px 0 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        /* Custom select header */
        .select-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 10px;
            cursor: pointer;
            min-height: 38px;
            border-radius: 5px;
            transition: background-color 0.2s ease;
        }
        
        .custom-select:hover .select-header {
            background-color: #f8f8f8;
        }
        
        .custom-select.open .select-header {
            border-bottom: 1px solid #eee;
            background-color: #f9f9f9;
            border-radius: 5px 5px 0 0;
        }
        
        .selected-text {
            font-size: 15px;
            color: #555;
            transition: color 0.2s ease;
        }
        
        .custom-select.open .selected-text {
            color: #333;
            font-weight: 500;
        }
        
        .select-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #777;
            margin-left: 10px;
        }
        
        .arrow-svg {
            width: 20px;
            height: 20px;
            stroke: #777;
            transition: transform 0.3s ease, stroke 0.2s ease;
            /* Start with arrow pointing down */
            transform: rotate(180deg);
        }
        
        .custom-select.open .select-arrow .arrow-svg {
            /* Rotate to pointing up when open */
            transform: rotate(0deg);
            stroke: #ea682f;
        }
        
        /* Dropdown menu */
        .select-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 100;
            background-color: #fff;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 6px 6px;
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
            max-height: 280px;
            overflow-y: auto;
        }
        
        .custom-select.open .select-dropdown {
            display: block;
            animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Search box in dropdowns */
        .search-box {
            padding: 5px 8px;
            background-color: #f9f9f9;
            border-bottom: 1px solid #eee;
            position: sticky;
            top: 0;
            z-index: 2;
        }
        
        .search-box input {
            width: 100%;
            padding: 5px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05) inset;
        }
        
        .search-box input:focus {
            outline: none;
            border-color: #ea682f;
            box-shadow: 0 1px 3px rgba(52, 152, 219, 0.2) inset;
        }
        
        /* Divider in dropdowns */
        .select-divider {
            margin: 0;
            border: none;
            border-top: 1px solid #eee;
        }
        
        /* Options container */
        .options-container {
            padding: 2px 0;
        }
        
        /* Option groups */
        .option-group {
            margin-bottom: 3px;
            padding: 0;
        }
        
        .option-group:last-child {
            margin-bottom: 0;
        }
        
        .group-header {
            padding: 4px 8px 3px;
            font-weight: 600;
            color: #333;
            font-size: 13px;
            background-color: rgba(248, 248, 248, 0.5);
        }
        
        .group-items {
            padding: 1px 5px 1px 18px;
        }
        
        /* Checkbox styling */
        .checkbox-wrapper-4 {
            margin-bottom: 1px;
            border-radius: 3px;
        }
        
        .checkbox-wrapper-4:last-child {
            margin-bottom: 0;
        }
        
        .checkbox-wrapper-4 .cbx {
            display: block;
            cursor: pointer;
            font-size: 13px;
            color: #555;
            border-radius: 3px;
        }
        
        .checkbox-wrapper-4 .cbx:hover {
            color: #333;
            background-color: #f5f5f5;
        }
        
        .checkbox-wrapper-4 input:checked + .cbx {
            background-color: rgba(52, 152, 219, 0.08);
            color: #2980b9;
            font-weight: 500;
        }
        
        .checkbox-wrapper-4 .inp-cbx {
            display: none;
        }
        
        /* Standard dropdown select styling */
        select.filter-select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10.5l5 5 5-5" stroke="%23777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>');
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 20px;
            padding: 10px 35px 10px 14px;
            font-size: 15px;
            color: #555;
            min-height: 42px;
        }
        
        select.filter-select:focus {
            outline: none;
            border-color: #ea682f;
        }
        
        select.filter-select option {
            font-size: 15px;
            padding: 8px;
        }
        
        /* Toggle button styles */
        .toggle-advanced-filters-wrapper {
            margin: 0;
        }
        
        .toggle-advanced-filters {
            background-color: #f8f8f8;
            color: #333;
            border: 1px solid #ddd;
            padding: 10px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            height: 100%;
            min-height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: normal;
            text-transform: none;
            font-size: 15px;
        }
        
        .toggle-advanced-filters:hover {
            background-color: #e6e6e6;
        }
        
        .toggle-advanced-filters i {
            margin-right: 8px;
            color: white;
            font-size: 15px;
        }
        .page-template-property-map-search .ekit-template-content-header >div {
            background-color: black !important;
            margin-bottom: 132px;
        }
        /* Quick filters section */
        .quick-filters-section {
            margin-top: 20px;
        }
        
        .quick-filters-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }
        
        .quick-filter-button {
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 30px;
            padding: 8px 16px;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
        }
        
        .quick-filter-button i {
            margin-right: 8px;
            font-size: 15px;
            color: white;
        }
        
        .quick-filter-button:hover {
            background-color: #e6e6e6;
        }
        
        .quick-filter-button.active {
            background-color: #ea682f;
            color: white;
            border-color: #ea682f;
        }
        
        .quick-filter-button.active i {
            color: white;
        }
        
        /* Clear filters button styles */
        .clear-filters-row {
            display: flex;
            justify-content: center;
            margin-top: 15px;
        }
        
        .clear-all-filters {
            background-color: #f8f8f8;
            color: #e74c3c;
            border: 1px solid #ddd;
            border-radius: 2px!important;
            padding: 8px 16px!important;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .clear-all-filters:hover {
            background-color: #e74c3c;
            color: white;
            border-color: #e74c3c;
        }
        
        .clear-all-filters i {
            font-size: 15px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .basic-filters-grid,
            .advanced-filters-grid {
                grid-template-columns: 1fr;
            }
            
            .quick-filters-row {
                justify-content: flex-start;
                overflow-x: auto;
                padding-bottom: 10px;
            }
            
            .quick-filter-button {
                white-space: nowrap;
            }
        }
        
        /* Custom scrollbar for dropdowns */
        .select-dropdown::-webkit-scrollbar {
            width: 8px;
        }
        
        .select-dropdown::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 0 0 8px 0;
        }
        
        .select-dropdown::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 4px;
        }
        
        .select-dropdown::-webkit-scrollbar-thumb:hover {
            background: #ccc;
        }
        
        /* Empty state when nothing found in search */
        .options-container:empty::after {
            content: "No options found";
            display: block;
            padding: 16px;
            text-align: center;
            color: #999;
            font-style: italic;
        }
        
        /* Custom selection count badge */
        .selected-text[data-count]:not([data-count="0"])::after {
            content: attr(data-count);
            background-color: #ea682f;
            color: white;
            font-size: 12px;
            font-weight: 600;
            height: 20px;
            min-width: 20px;
            padding: 0 6px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            line-height: 1;
        }
        
        /* Property card styling - Premium Design */
        .property-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
            height: 100%;
            position: relative;
            border: 1px solid rgba(0,0,0,0.05);
        }
        
        .property-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
        
        .property-card.active {
            border: 2px solid #ea682f;
            box-shadow: 0 8px 20px rgba(52, 152, 219, 0.2);
        }
        
        /* Property status indicator */
        .property-status {
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 2;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 4px 8px;
            border-radius: 3px;
            color: #fff;
        }
        
        .status-new {
            background-color: #2ecc71;
        }
        
        .status-exclusive {
            background-color: #e74c3c;
        }
        
        .status-reduced {
            background-color: #f39c12;
        }
        
        /* Property image container with overlay gradient */
        .property-image {
            height: 200px;
            overflow: hidden;
            position: relative;
        }
        
        .property-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .property-card:hover .property-image img {
            transform: scale(1.05);
        }
        
        /* Property details container */
        .property-details {
            padding: 16px;
            display: flex;
            flex-direction: column;
        }
        
        /* Property type badge */
        .property-type {
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #777;
            margin-bottom: -2px;
        }
        
        /* Property title */
        .property-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: var( --e-global-typography-85f589e-font-family ), Sans-serif;
    font-size: var( --e-global-typography-85f589e-font-size );
    font-weight: var( --e-global-typography-85f589e-font-weight );
    text-transform: var( --e-global-typography-85f589e-text-transform );
    font-style: var( --e-global-typography-85f589e-font-style );
    text-decoration: var( --e-global-typography-85f589e-text-decoration );
    line-height: var( --e-global-typography-85f589e-line-height );
    letter-spacing: var( --e-global-typography-85f589e-letter-spacing );
    font-weight: 500;
    font-size: 30px!important;
    color: rgb(76, 75, 66)!important;
        }
        
        /* Property price */
        .property-price {
            font-size: 18px;
            font-weight: 700;
            color: #ea682f;
            display: flex;
            align-items: center;
        }
        
        .property-price.negotiable::after {
            content: 'Negotiable';
            font-size: 11px;
            font-weight: 500;
            background-color: rgba(52, 152, 219, 0.1);
            color: #ea682f;
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 8px;
        }
        
        /* Property location */
        .property-location {
            color: #666;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .property-location i {
            color: #999;
            font-size: 14px;
        }
        
        /* Property divider */
        .property-divider {
            height: 1px;
            background-color: #f0f0f0;
            margin: 2px 0;
        }
        
        /* Property features */
        .property-features {
            display: flex;
            justify-content: space-between;
            gap: 5px;
            color: #666;
            font-size: 13px;
            padding: 4px 0;
        }
        
        .property-feature {
            display: flex;
            align-items: center;
            gap: 4px;
            color: rgb(76, 75, 66);
            font-size: 16px;
        }
        .property-feature span{
            color: rgb(76, 75, 66);
            font-size: 14px;
        }
        
        .property-feature i {
            color: #999;
            font-size: 14px;
        }
        
        /* Action row */
        .property-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
        }
        
        /* Property link button */
        .property-link {
            display: inline-block;
            background-color: #ea682f;
            background-image: linear-gradient(135deg, #ea682f, #2980b9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            text-align: center;
            flex-grow: 1;
            box-shadow: 0 2px 5px rgba(52, 152, 219, 0.2);
        }
        
        .property-link:hover {
            background-image: linear-gradient(135deg, #2980b9, #2573a7);
            box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }
        
        /* Property favorite button */
        .property-favorite {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin-left: 10px;
            border: 1px solid #eee;
            background-color: #fff;
            color: #999;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .property-favorite:hover {
            background-color: #fff5f5;
            color: #e74c3c;
            border-color: #ffcece;
        }
        
        .property-favorite.active {
            background-color: #ffebeb;
            color: #e74c3c;
            border-color: #e74c3c;
        }
        
        /* Global Loader Styles */
        .global-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .global-loader.visible {
            visibility: visible;
            opacity: 0.6;
        }

        .global-loader .loader-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .global-loader .loader-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>

<body <?php body_class(); ?>>
    <!-- Global Loader -->
    <div class="global-loader" style="display: none;">
        <div class="global-loader-content">
            <div class="global-loader-spinner"></div>
            <div class="global-loader-text">Loading Properties</div>
            <div class="global-loader-subtext">Please wait while we fetch the latest listings...</div>
        </div>
    </div>

<!-- Add Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

<!-- Add Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />

<!-- Add property map search CSS -->
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/page-templates/property-map-search.css">

<!-- Add Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>

<!-- Add property map search JS -->
<script src="<?php echo get_template_directory_uri(); ?>/page-templates/property-map-fallback.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/page-templates/property-map-search.js"></script>

<script>
// Global loader functions
window.showGlobalLoader = function() {
    document.querySelector('.global-loader').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling while loading
}

window.hideGlobalLoader = function() {
    document.querySelector('.global-loader').style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Add loader to all AJAX requests
jQuery(document).ready(function($) {
    $(document).ajaxSend(function() {
        window.showGlobalLoader();
    });

    $(document).ajaxComplete(function() {
        window.hideGlobalLoader();
    });

    $(document).ajaxError(function() {
        window.hideGlobalLoader();
    });
});
</script>

<div class="site-content">
    <!-- Header Section -->
    <div class="map-search-header">
        <!-- Breadcrumbs -->
        <div class="map-search-breadcrumbs">
            <a href="/">Home</a>
            <span class="separator">/</span>
            <a href="/properties">Properties</a>
            <span class="separator">/</span>
            <span>Property Map Search</span>
        </div>

        <!-- Title Section -->
        <div class="map-search-title">
            <h1>Property Map Search</h1>
        </div>
        <div class="map-search-subtitle">
            Explore properties across Costa del Sol with our interactive map search. Find your perfect home by location, price, and amenities.
        </div>


    </div>

    <!-- Filters Section -->
    <div class="filters-section">
        <form id="property-filters" class="filters-form">
            <!-- Basic Filters Row -->
            <div class="basic-filters-grid">
                <!-- Location -->
                <div class="form-group">
                    <label for="location" class="form-label">Location</label>
                    <div class="custom-select" data-filter="location">
                        <div class="select-header">
                            <span class="selected-text">Choose location</span>
                            <span class="select-arrow">
                                <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
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
                    <div class="custom-select" data-filter="property_type">
                        <div class="select-header">
                            <span class="selected-text">Choose type</span>
                            <span class="select-arrow">
                                <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
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
                    <label for="price" class="form-label">Price From</label>
                    <div class="custom-select price-filter" data-filter="price">
                        <div class="select-header">
                            <span class="selected-text">Choose price</span>
                            <span class="select-arrow">
                                <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
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
                    <div class="custom-select" data-filter="bedrooms">
                        <div class="select-header">
                            <span class="selected-text">Choose bedrooms</span>
                            <span class="select-arrow">
                                <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
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

                <!-- Advanced Filters Button - Moved from bottom to replace bathrooms -->
                <div class="form-group toggle-advanced-filters-wrapper">
                    <label class="form-label">More Options</label>
                    <button type="button" class="toggle-advanced-filters form-control">
                        <i class="fas fa-sliders-h"></i>
                        <span>Advanced Filters</span>
                    </button>
                </div>
            </div>
            
            <!-- Advanced Filters Row (initially hidden) -->
            <div class="advanced-filters-container" style="display: none;">
                <div class="advanced-filters-grid">
                    <!-- Bathrooms - Moved from basic filters -->
                    <div class="form-group">
                        <label for="bathrooms" class="form-label">Bathrooms</label>
                        <div class="custom-select" data-filter="bathrooms">
                            <div class="select-header">
                                <span class="selected-text">Choose bathrooms</span>
                                <span class="select-arrow">
                                    <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
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
                    
                    <!-- Features -->
                    <div class="form-group">
                        <label for="features-select" class="form-label">Features</label>
                        <div class="custom-select" data-filter="features">
                            <div class="select-header">
                                <span class="selected-text">Choose features</span>
                                <span class="select-arrow">
                                    <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="select-dropdown">
                                <div class="search-box">
                                    <input type="text" placeholder="Search features...">
                                </div>
                                <hr class="select-divider">
                                <div class="options-container">
                                    <!-- Setting -->
                                    <div class="option-group">
                                        <div class="group-header">Setting</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-beachfront" type="checkbox" name="features" value="1Setting1" data-parent="setting"/>
                                                <label class="cbx" for="features-beachfront">
                                                    <span>Beachfront</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-frontline-golf" type="checkbox" name="features" value="1Setting2" data-parent="setting"/>
                                                <label class="cbx" for="features-frontline-golf">
                                                    <span>Frontline Golf</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Setting features similarly -->
                                        </div>
                                    </div>

                                    <!-- Orientation -->
                                    <div class="option-group">
                                        <div class="group-header">Orientation</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-north" type="checkbox" name="features" value="1Orientation1" data-parent="orientation"/>
                                                <label class="cbx" for="features-north">
                                                    <span>North Facing</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Orientation features -->
                                        </div>
                                    </div>

                                    <!-- Condition -->
                                    <div class="option-group">
                                        <div class="group-header">Condition</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-excellent" type="checkbox" name="features" value="1Condition1" data-parent="condition"/>
                                                <label class="cbx" for="features-excellent">
                                                    <span>Excellent Condition</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Condition features -->
                                        </div>
                                    </div>

                                    <!-- Pool -->
                                    <div class="option-group">
                                        <div class="group-header">Pool</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-communal-pool" type="checkbox" name="features" value="1Pool1" data-parent="pool"/>
                                                <label class="cbx" for="features-communal-pool">
                                                    <span>Communal Pool</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Pool features -->
                                        </div>
                                    </div>

                                    <!-- Climate Control -->
                                    <div class="option-group">
                                        <div class="group-header">Climate Control</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-ac" type="checkbox" name="features" value="1Climate Control1" data-parent="climate"/>
                                                <label class="cbx" for="features-ac">
                                                    <span>Air Conditioning</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Climate Control features -->
                                        </div>
                                    </div>

                                    <!-- Views -->
                                    <div class="option-group">
                                        <div class="group-header">Views</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-sea-views" type="checkbox" name="features" value="1Views1" data-parent="views"/>
                                                <label class="cbx" for="features-sea-views">
                                                    <span>Sea Views</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Views features -->
                                        </div>
                                    </div>

                                    <!-- Features -->
                                    <div class="option-group">
                                        <div class="group-header">Additional Features</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-covered-terrace" type="checkbox" name="features" value="1Features1" data-parent="features"/>
                                                <label class="cbx" for="features-covered-terrace">
                                                    <span>Covered Terrace</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Features -->
                                        </div>
                                    </div>

                                    <!-- Furniture -->
                                    <div class="option-group">
                                        <div class="group-header">Furniture</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-fully-furnished" type="checkbox" name="features" value="1Furniture1" data-parent="furniture"/>
                                                <label class="cbx" for="features-fully-furnished">
                                                    <span>Fully Furnished</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Furniture features -->
                                        </div>
                                    </div>

                                    <!-- Kitchen -->
                                    <div class="option-group">
                                        <div class="group-header">Kitchen</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-fitted-kitchen" type="checkbox" name="features" value="1Kitchen1" data-parent="kitchen"/>
                                                <label class="cbx" for="features-fitted-kitchen">
                                                    <span>Fully Fitted Kitchen</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Kitchen features -->
                                        </div>
                                    </div>

                                    <!-- Garden -->
                                    <div class="option-group">
                                        <div class="group-header">Garden</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-communal-garden" type="checkbox" name="features" value="1Garden1" data-parent="garden"/>
                                                <label class="cbx" for="features-communal-garden">
                                                    <span>Communal Garden</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Garden features -->
                                        </div>
                                    </div>

                                    <!-- Security -->
                                    <div class="option-group">
                                        <div class="group-header">Security</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-gated" type="checkbox" name="features" value="1Security1" data-parent="security"/>
                                                <label class="cbx" for="features-gated">
                                                    <span>Gated Complex</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Security features -->
                                        </div>
                                    </div>

                                    <!-- Parking -->
                                    <div class="option-group">
                                        <div class="group-header">Parking</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-underground" type="checkbox" name="features" value="1Parking1" data-parent="parking"/>
                                                <label class="cbx" for="features-underground">
                                                    <span>Underground Parking</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Parking features -->
                                        </div>
                                    </div>

                                    <!-- Utilities -->
                                    <div class="option-group">
                                        <div class="group-header">Utilities</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-electricity" type="checkbox" name="features" value="1Utilities1" data-parent="utilities"/>
                                                <label class="cbx" for="features-electricity">
                                                    <span>Electricity</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Utilities features -->
                                        </div>
                                    </div>

                                    <!-- Category -->
                                    <div class="option-group">
                                        <div class="group-header">Category</div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="features-bargain" type="checkbox" name="features" value="1Category1" data-parent="category"/>
                                                <label class="cbx" for="features-bargain">
                                                    <span>Bargain</span>
                                                </label>
                                            </div>
                                            <!-- Add all other Category features -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Min Built Size -->
                    <div class="form-group">
                        <label for="min-built-select" class="form-label">Min Built Size</label>
                        <div class="custom-select" data-filter="min-built">
                            <div class="select-header">
                                <span class="selected-text">Choose size</span>
                                <span class="select-arrow">
                                    <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="select-dropdown">
                                <div class="search-box">
                                    <input type="text" placeholder="Search size...">
                                </div>
                                <hr class="select-divider">
                                <div class="options-container">
                                    <div class="option-group">
                                        <div class="group-header">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="min-built-any" type="checkbox" name="min-built" value="any"/>
                                                <label class="cbx" for="min-built-any">
                                                    <span>Any Size</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="min-built-50" type="checkbox" name="min-built" value="50" data-parent="any"/>
                                                <label class="cbx" for="min-built-50">
                                                    <span>50+ m²</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="min-built-100" type="checkbox" name="min-built" value="100" data-parent="any"/>
                                                <label class="cbx" for="min-built-100">
                                                    <span>100+ m²</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="min-built-150" type="checkbox" name="min-built" value="150" data-parent="any"/>
                                                <label class="cbx" for="min-built-150">
                                                    <span>150+ m²</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="min-built-200" type="checkbox" name="min-built" value="200" data-parent="any"/>
                                                <label class="cbx" for="min-built-200">
                                                    <span>200+ m²</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="min-built-300" type="checkbox" name="min-built" value="300" data-parent="any"/>
                                                <label class="cbx" for="min-built-300">
                                                    <span>300+ m²</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Price To -->
                    <div class="custom-select" data-filter="max-price">
                        <label for="max-price-select" class="form-label">Price To</label>
                        <div class="select-header">
                            <span class="selected-text">Choose price to</span>
                            <span class="select-arrow">
                                <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </span>
                        </div>
                        <div class="select-dropdown">
                            <div class="search-box">
                                <input type="text" placeholder="Search price to...">
                            </div>
                            <hr class="select-divider">
                            <div class="options-container">
                                <div class="option-group">
                                    <div class="group-header">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="max-price-any" type="checkbox" name="max-price" value="any"/>
                                            <label class="cbx" for="max-price-any">
                                                <span>Any Price</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="group-items">
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="max-price-250000" type="checkbox" name="max-price" value="250000" data-parent="any"/>
                                            <label class="cbx" for="max-price-250000">
                                                <span>Up to €250,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="max-price-500000" type="checkbox" name="max-price" value="500000" data-parent="any"/>
                                            <label class="cbx" for="max-price-500000">
                                                <span>Up to €500,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="max-price-750000" type="checkbox" name="max-price" value="750000" data-parent="any"/>
                                            <label class="cbx" for="max-price-750000">
                                                <span>Up to €750,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="max-price-1000000" type="checkbox" name="max-price" value="1000000" data-parent="any"/>
                                            <label class="cbx" for="max-price-1000000">
                                                <span>Up to €1,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="max-price-2000000" type="checkbox" name="max-price" value="2000000" data-parent="any"/>
                                            <label class="cbx" for="max-price-2000000">
                                                <span>Up to €2,000,000</span>
                                            </label>
                                        </div>
                                        <div class="checkbox-wrapper-4">
                                            <input class="inp-cbx" id="max-price-5000000" type="checkbox" name="max-price" value="5000000" data-parent="any"/>
                                            <label class="cbx" for="max-price-5000000">
                                                <span>Up to €5,000,000</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sort By -->
                    <div class="form-group">
                        <label for="sort-select" class="form-label">Sort By</label>
                        <div class="custom-select" data-filter="sort">
                            <div class="select-header">
                                <span class="selected-text">Choose sorting</span>
                                <span class="select-arrow">
                                    <svg class="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 14.5l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="select-dropdown">
                                <div class="search-box">
                                    <input type="text" placeholder="Search sorting...">
                                </div>
                                <hr class="select-divider">
                                <div class="options-container">
                                    <div class="option-group">
                                        <div class="group-header">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="sort-default" type="checkbox" name="sort" value="default"/>
                                                <label class="cbx" for="sort-default">
                                                    <span>Default</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="group-items">
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="sort-price-asc" type="checkbox" name="sort" value="price-asc" data-parent="default"/>
                                                <label class="cbx" for="sort-price-asc">
                                                    <span>Price: Low to High</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="sort-price-desc" type="checkbox" name="sort" value="price-desc" data-parent="default"/>
                                                <label class="cbx" for="sort-price-desc">
                                                    <span>Price: High to Low</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="sort-date-desc" type="checkbox" name="sort" value="date-desc" data-parent="default"/>
                                                <label class="cbx" for="sort-date-desc">
                                                    <span>Newest First</span>
                                                </label>
                                            </div>
                                            <div class="checkbox-wrapper-4">
                                                <input class="inp-cbx" id="sort-size-desc" type="checkbox" name="sort" value="size-desc" data-parent="default"/>
                                                <label class="cbx" for="sort-size-desc">
                                                    <span>Size: Largest First</span>
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
            
            <!-- Quick Filters Section (separate row) -->
            <div class="quick-filters-section">
                <div class="quick-filters-container">
                    <div class="quick-filters-row">
                        <button type="button" class="quick-filter-button" data-filter="beachfront">
                            <i class="fas fa-umbrella-beach"></i>
                            <span>Beachfront</span>
                        </button>
                        <button type="button" class="quick-filter-button" data-filter="golf">
                            <i class="fas fa-golf-ball"></i>
                            <span>Golf</span>
                        </button>
                        <button type="button" class="quick-filter-button" data-filter="luxury">
                            <i class="fas fa-gem"></i>
                            <span>Luxury</span>
                        </button>
                        <button type="button" class="quick-filter-button" data-filter="new-development">
                            <i class="fas fa-hard-hat"></i>
                            <span>New Development</span>
                        </button>
                        <button type="button" class="quick-filter-button" data-filter="sea-view">
                            <i class="fas fa-water"></i>
                            <span>Sea View</span>
                        </button>
                        <button type="button" class="quick-filter-button" data-filter="investment">
                            <i class="fas fa-chart-line"></i>
                            <span>Investment</span>
                        </button>
                    </div>
                    <!-- Added clear all filters button -->
                    <div class="clear-filters-row">
                        <button type="button" class="clear-all-filters">
                            <i class="fas fa-times-circle"></i>
                            <span>Clear All Filters</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- Map and Properties Section -->
    <div class="property-search-map-container">
        <div class="property-search-layout">
            <div class="property-list-container">
                <div id="property-results-heading" class="property-results-heading">
                    <h2>Property Results</h2>
                    <p class="results-count">Showing <span id="results-count">0</span> properties</p>
                </div>
                <div id="property-list" class="property-list"></div>
                <div id="pagination" class="pagination-container"></div>
            </div>
            <div class="map-container">
                <div id="map" class="property-search-map"></div>
                <div id="loading-indicator" class="loading-indicator">
                    <div class="loader-container">
                        <div class="loader-spinner"></div>
                        <div class="loader-text">Loading Properties</div>
                        <div class="loader-subtext">Please wait while we fetch the latest listings...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php get_footer(); ?>