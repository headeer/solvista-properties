<?php
/**
 * Theme functions and definitions
 */

// Register scripts and styles
function solvista_enqueue_scripts()
{
    // Main theme styles
    wp_enqueue_style(
        'solvista-style',
        get_template_directory_uri() . '/assets/css/style.css',
        array(),
        '1.0.0'
    );

    // Leaflet CSS
    wp_enqueue_style(
        'leaflet-css',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        array(),
        '1.9.4'
    );

    // Leaflet JS
    wp_enqueue_script(
        'leaflet-js',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        array(),
        '1.9.4',
        true
    );

    // Search by Map script
    wp_enqueue_script(
        'search-by-map',
        get_template_directory_uri() . '/assets/js/search-by-map.js',
        array('jquery', 'leaflet-js'),
        '1.0.0',
        true
    );

    // Search by Map styles
    wp_enqueue_style(
        'search-by-map',
        get_template_directory_uri() . '/assets/css/search-by-map.css',
        array('leaflet-css'),
        '1.0.0'
    );

    // Ion Range Slider
    wp_enqueue_style('ion-range-slider', 'https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/css/ion.rangeSlider.min.css', array(), '2.3.1');
    wp_enqueue_script('ion-range-slider', 'https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/js/ion.rangeSlider.min.js', array('jquery'), '2.3.1', true);
}
add_action('wp_enqueue_scripts', 'solvista_enqueue_scripts');

// Register custom post type for properties
function solvista_register_property_post_type()
{
    $labels = array(
        'name' => 'Properties',
        'singular_name' => 'Property',
        'add_new' => 'Add New',
        'add_new_item' => 'Add New Property',
        'edit_item' => 'Edit Property',
        'new_item' => 'New Property',
        'view_item' => 'View Property',
        'search_items' => 'Search Properties',
        'not_found' => 'No properties found',
        'not_found_in_trash' => 'No properties found in Trash',
        'menu_name' => 'Properties'
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-building',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'rewrite' => array('slug' => 'properties')
    );

    register_post_type('property', $args);
}
add_action('init', 'solvista_register_property_post_type');

// Register custom meta boxes for properties
function solvista_register_property_meta_boxes()
{
    add_meta_box(
        'property_details',
        'Property Details',
        'solvista_property_details_callback',
        'property',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'solvista_register_property_meta_boxes');

// Property details meta box callback
function solvista_property_details_callback($post)
{
    wp_nonce_field('solvista_property_details', 'solvista_property_details_nonce');

    $meta_fields = array(
        'location' => 'Location',
        'region' => 'Region',
        'property_type' => 'Property Type',
        'price' => 'Price',
        'bedrooms' => 'Bedrooms',
        'bathrooms' => 'Bathrooms',
        'area' => 'Area (m²)',
        'reference_number' => 'Reference Number',
        'latitude' => 'Latitude',
        'longitude' => 'Longitude',
        'frontline_beach' => 'Frontline Beach',
        'frontline_golf' => 'Frontline Golf',
        'sea_views' => 'Sea Views',
        'gated_community' => 'Gated Community',
        'andalusian_style' => 'Andalusian Style',
        'renovated' => 'Renovated'
    );

    foreach ($meta_fields as $key => $label) {
        $value = get_post_meta($post->ID, $key, true);
        ?>
        <p>
            <label for="<?php echo $key; ?>"><?php echo $label; ?>:</label>
            <?php if (in_array($key, array('frontline_beach', 'frontline_golf', 'sea_views', 'gated_community', 'andalusian_style', 'renovated'))) { ?>
                <select name="<?php echo $key; ?>" id="<?php echo $key; ?>">
                    <option value="">Any</option>
                    <option value="yes" <?php selected($value, 'yes'); ?>>Yes</option>
                    <option value="no" <?php selected($value, 'no'); ?>>No</option>
                </select>
            <?php } else { ?>
                <input type="text" name="<?php echo $key; ?>" id="<?php echo $key; ?>" value="<?php echo esc_attr($value); ?>" />
            <?php } ?>
        </p>
        <?php
    }
}

// Save property meta data
function solvista_save_property_meta($post_id)
{
    if (!isset($_POST['solvista_property_details_nonce'])) {
        return;
    }

    if (!wp_verify_nonce($_POST['solvista_property_details_nonce'], 'solvista_property_details')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $meta_fields = array(
        'location',
        'region',
        'property_type',
        'price',
        'bedrooms',
        'bathrooms',
        'area',
        'reference_number',
        'latitude',
        'longitude',
        'frontline_beach',
        'frontline_golf',
        'sea_views',
        'gated_community',
        'andalusian_style',
        'renovated'
    );

    foreach ($meta_fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post_property', 'solvista_save_property_meta');

// Register REST API endpoint for properties
function solvista_register_properties_endpoint()
{
    register_rest_route('solvista/v1', '/properties', array(
        'methods' => 'POST',
        'callback' => 'solvista_get_properties',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'solvista_register_properties_endpoint');

// Properties endpoint callback
function solvista_get_properties($request)
{
    $filters = $request->get_json_params();

    $args = array(
        'post_type' => 'property',
        'posts_per_page' => -1,
        'meta_query' => array('relation' => 'AND')
    );

    // Add filters to meta query
    $meta_fields = array(
        'location' => 'location',
        'region' => 'region',
        'property_type' => 'property_type',
        'bedrooms' => 'bedrooms',
        'bathrooms' => 'bathrooms',
        'area' => 'area',
        'reference_number' => 'reference_number',
        'frontline_beach' => 'frontline_beach',
        'frontline_golf' => 'frontline_golf',
        'sea_views' => 'sea_views',
        'gated_community' => 'gated_community',
        'andalusian_style' => 'andalusian_style',
        'renovated' => 'renovated'
    );

    foreach ($meta_fields as $filter => $meta_key) {
        if (!empty($filters[$filter])) {
            $args['meta_query'][] = array(
                'key' => $meta_key,
                'value' => $filters[$filter],
                'compare' => '='
            );
        }
    }

    // Add price range filter
    if (!empty($filters['minPrice']) || !empty($filters['maxPrice'])) {
        $price_query = array('key' => 'price', 'type' => 'NUMERIC');
        if (!empty($filters['minPrice'])) {
            $price_query['value'] = $filters['minPrice'];
            $price_query['compare'] = '>=';
        }
        if (!empty($filters['maxPrice'])) {
            $price_query['value'] = $filters['maxPrice'];
            $price_query['compare'] = '<=';
        }
        $args['meta_query'][] = $price_query;
    }

    $query = new WP_Query($args);
    $properties = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $properties[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'url' => get_permalink(),
                'price' => get_post_meta(get_the_ID(), 'price', true),
                'bedrooms' => get_post_meta(get_the_ID(), 'bedrooms', true),
                'bathrooms' => get_post_meta(get_the_ID(), 'bathrooms', true),
                'area' => get_post_meta(get_the_ID(), 'area', true),
                'latitude' => get_post_meta(get_the_ID(), 'latitude', true),
                'longitude' => get_post_meta(get_the_ID(), 'longitude', true)
            );
        }
    }

    wp_reset_postdata();
    return $properties;
}

// Register custom page templates
function solvista_register_page_templates($templates)
{
    $templates['page-templates/main-page.php'] = 'Main Page with Map';
    return $templates;
}
add_filter('theme_page_templates', 'solvista_register_page_templates');

/**
 * Register Property Search Map Template
 */
function solvistaproperty_register_property_search_map_template($templates)
{
    $templates['page-templates/property-search-map.php'] = __('Property Search with Map', 'solvistaproperty');
    return $templates;
}
add_filter('theme_page_templates', 'solvistaproperty_register_property_search_map_template');

/**
 * Enqueue scripts and styles for property search map
 */
function solvistaproperty_enqueue_property_search_map_assets()
{
    if (is_page_template('page-templates/property-search-map.php')) {
        // Enqueue Font Awesome
        wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

        // Enqueue Leaflet CSS and JS
        wp_enqueue_style('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        wp_enqueue_script('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), null, true);

        // Enqueue template-specific CSS and JS
        wp_enqueue_style('property-search-map', get_template_directory_uri() . '/page-templates/property-search-map.css');
        wp_enqueue_script('property-search-map', get_template_directory_uri() . '/page-templates/property-search-map.js', array('leaflet'), '4.0.5', true);

        // Localize the script with API configuration
        wp_localize_script('property-search-map', 'propertySearchMapData', array(
            'apiUrl' => 'https://webapi.resales-online.com/V6/SearchProperties',
            'apiKey' => 'f9fe74f5822a04af7e4d5c399e8972474e1c3d15', // Replace with your actual API key
            'agencyId' => '1023133', // Replace with your actual agency ID
            'sandbox' => true
        ));
    }
}
add_action('wp_enqueue_scripts', 'solvistaproperty_enqueue_property_search_map_assets');

/**
 * Register REST API endpoint for properties
 */
function solvistaproperty_register_properties_endpoint()
{
    register_rest_route('solvistaproperty/v1', '/properties', array(
        'methods' => 'GET',
        'callback' => 'solvistaproperty_get_properties',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'solvistaproperty_register_properties_endpoint');

/**
 * Get properties based on filters
 */
function solvistaproperty_get_properties($request)
{
    // Get parameters from the request
    $params = $request->get_params();

    // Prepare API request parameters
    $api_params = array(
        'p_agency_filterid' => '1',
        'p1' => '1023133', // Your identifier
        'p2' => 'f9fe74f5822a04af7e4d5c399e8972474e1c3d15', // Your API key
        'P_sandbox' => 'true'
    );

    // Map form parameters to API parameters
    $param_mapping = array(
        'location_search' => 'location',
        'ptype_search' => 'property_type',
        'bed_search' => 'bedrooms',
        'price_search' => 'min_price',
        'pricemax_search' => 'max_price',
        'features_search' => 'features',
        'built_search' => 'built_area',
        'bath_search' => 'bathrooms',
        'sort_search' => 'sort_by',
        'rsoref' => 'reference'
    );

    // Handle location checkboxes
    if (!empty($params['location_search'])) {
        $locations = explode(',', $params['location_search']);
        // If Costa del Sol is selected, include all locations
        if (in_array('Costa del Sol', $locations)) {
            $api_params['location'] = 'Costa del Sol';
        } else {
            $api_params['location'] = implode(',', $locations);
        }
    }

    // Handle property types
    if (!empty($params['ptype_search'])) {
        $property_types = explode(',', $params['ptype_search']);
        $api_params['property_type'] = implode(',', $property_types);
    }

    // Handle price range
    if (!empty($params['price_search'])) {
        $api_params['min_price'] = $params['price_search'];
    }
    if (!empty($params['pricemax_search'])) {
        $api_params['max_price'] = $params['pricemax_search'];
    }

    // Handle features
    if (!empty($params['features_search'])) {
        $features = explode(',', $params['features_search']);
        $api_params['features'] = implode(',', $features);
    }

    // Handle built area
    if (!empty($params['built_search'])) {
        $api_params['built_area'] = $params['built_search'];
    }

    // Handle bathrooms
    if (!empty($params['bath_search'])) {
        $api_params['bathrooms'] = $params['bath_search'];
    }

    // Handle sorting
    if (!empty($params['sort_search'])) {
        $api_params['sort_by'] = $params['sort_search'];
    }

    // Handle reference number
    if (!empty($params['rsoref'])) {
        $api_params['reference'] = $params['rsoref'];
    }

    // Make API request
    $response = wp_remote_get(
        add_query_arg($api_params, 'https://webapi.resales-online.com/V6/SearchProperties'),
        array(
            'timeout' => 30,
            'headers' => array(
                'Accept' => 'application/json'
            )
        )
    );

    if (is_wp_error($response)) {
        return new WP_Error('api_error', $response->get_error_message());
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (!$data || !isset($data['Property'])) {
        return array();
    }

    // Transform API response to match our expected format
    $properties = array();
    foreach ($data['Property'] as $property) {
        $properties[] = array(
            'id' => $property['Reference'],
            'title' => $property['Title'],
            'url' => '/property/' . $property['Reference'],
            'thumbnail' => $property['MainImage'],
            'latitude' => $property['Latitude'],
            'longitude' => $property['Longitude'],
            'price' => $property['Price'],
            'currency' => $property['Currency'],
            'bedrooms' => $property['Bedrooms'],
            'bathrooms' => $property['Bathrooms'],
            'area' => $property['Area'],
            'location' => $property['Location'],
            'description' => $property['Description'],
            'property_type' => $property['PropertyType'],
            'features' => $property['Features'],
            'built_area' => $property['BuiltArea'],
            'sort_by' => $property['SortBy']
        );
    }

    return $properties;
}

/**
 * Register Property Custom Post Type
 */
function solvistaproperty_register_property_post_type()
{
    $labels = array(
        'name' => __('Properties', 'solvistaproperty'),
        'singular_name' => __('Property', 'solvistaproperty'),
        'menu_name' => __('Properties', 'solvistaproperty'),
        'add_new' => __('Add New', 'solvistaproperty'),
        'add_new_item' => __('Add New Property', 'solvistaproperty'),
        'edit_item' => __('Edit Property', 'solvistaproperty'),
        'new_item' => __('New Property', 'solvistaproperty'),
        'view_item' => __('View Property', 'solvistaproperty'),
        'search_items' => __('Search Properties', 'solvistaproperty'),
        'not_found' => __('No properties found', 'solvistaproperty'),
        'not_found_in_trash' => __('No properties found in Trash', 'solvistaproperty'),
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'property'),
        'capability_type' => 'post',
        'hierarchical' => false,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-building',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest' => true,
    );

    register_post_type('property', $args);

    // Register property meta fields
    $meta_fields = array(
        'property_location' => 'string',
        'property_type' => 'string',
        'property_price' => 'number',
        'property_bedrooms' => 'number',
        'property_bathrooms' => 'number',
        'property_area' => 'number',
        'property_latitude' => 'number',
        'property_longitude' => 'number',
        'property_reference' => 'string',
        'property_currency' => 'string'
    );

    foreach ($meta_fields as $field => $type) {
        register_post_meta('property', $field, array(
            'type' => $type,
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => $type === 'number' ? 'absint' : 'sanitize_text_field'
        ));
    }

    // Register quick filter meta fields
    $quick_filters = array(
        'frontline_beach',
        'frontline_golf',
        'sea_views',
        'gated_community',
        'andalusian_style',
        'renovated'
    );

    foreach ($quick_filters as $filter) {
        register_post_meta('property', 'property_' . $filter, array(
            'type' => 'boolean',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'rest_sanitize_boolean'
        ));
    }
}
add_action('init', 'solvistaproperty_register_property_post_type');