<?php
/**
 * Solvista Property Theme functions and definitions
 */

if (!defined('_S_VERSION')) {
    define('_S_VERSION', '1.0.0');
}

/**
 * Resales Online API Configuration
 */
define('RESALES_API_URL', 'https://api.resales-online.com/V6/');
define('RESALES_API_KEY', ''); // Add your API key here

/**
 * Helper function to make API requests to Resales Online
 */
function solvista_resales_api_request($endpoint, $params = array()) {
    $api_key = RESALES_API_KEY;
    if (empty($api_key)) {
        return new WP_Error('api_key_missing', 'Resales Online API key is not configured');
    }

    $params['p1'] = $api_key;
    $url = RESALES_API_URL . $endpoint . '?' . http_build_query($params);

    $response = wp_remote_get($url);
    if (is_wp_error($response)) {
        return $response;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return new WP_Error('json_decode_error', 'Failed to decode API response');
    }

    return $data;
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function solvista_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
}
add_action('after_setup_theme', 'solvista_setup');

/**
 * Enqueue scripts and styles.
 */
function solvista_enqueue_scripts() {
    // Register Leaflet CSS and JS
    wp_register_style('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    wp_register_script('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), null, true);
    
    // Register MarkerCluster CSS and JS
    wp_register_style('markercluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css');
    wp_register_style('markercluster-default', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css');
    wp_register_script('markercluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', array('leaflet'), null, true);
    
    // Enqueue our custom styles and scripts
    wp_enqueue_style('solvista-style', get_stylesheet_uri(), array(), _S_VERSION);
    wp_enqueue_script('solvista-script', get_template_directory_uri() . '/page-templates/main-page.js', array('jquery', 'leaflet', 'markercluster'), _S_VERSION, true);
    
    // Localize script with necessary data
    wp_localize_script('solvista-script', 'solvistaData', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('solvista_nonce'),
        'apiUrl' => rest_url('solvista/v1/properties'),
        'mapCenter' => array(
            'lat' => 51.5074,
            'lng' => -0.1278
        ),
        'mapZoom' => 13
    ));
}
add_action('wp_enqueue_scripts', 'solvista_enqueue_scripts');

/**
 * Register custom post type for properties
 */
function solvista_register_property_post_type() {
    $labels = array(
        'name'                  => _x('Properties', 'Post Type General Name', 'solvista'),
        'singular_name'         => _x('Property', 'Post Type Singular Name', 'solvista'),
        'menu_name'            => __('Properties', 'solvista'),
        'name_admin_bar'       => __('Property', 'solvista'),
        'archives'             => __('Property Archives', 'solvista'),
        'attributes'           => __('Property Attributes', 'solvista'),
        'parent_item_colon'    => __('Parent Property:', 'solvista'),
        'all_items'            => __('All Properties', 'solvista'),
        'add_new_item'         => __('Add New Property', 'solvista'),
        'add_new'              => __('Add New', 'solvista'),
        'new_item'             => __('New Property', 'solvista'),
        'edit_item'            => __('Edit Property', 'solvista'),
        'update_item'          => __('Update Property', 'solvista'),
        'view_item'            => __('View Property', 'solvista'),
        'view_items'           => __('View Properties', 'solvista'),
        'search_items'         => __('Search Property', 'solvista'),
        'not_found'            => __('Not found', 'solvista'),
        'not_found_in_trash'   => __('Not found in Trash', 'solvista'),
        'featured_image'       => __('Featured Image', 'solvista'),
        'set_featured_image'   => __('Set featured image', 'solvista'),
        'remove_featured_image'=> __('Remove featured image', 'solvista'),
        'use_featured_image'   => __('Use as featured image', 'solvista'),
        'insert_into_item'     => __('Insert into property', 'solvista'),
        'uploaded_to_this_item'=> __('Uploaded to this property', 'solvista'),
        'items_list'           => __('Properties list', 'solvista'),
        'items_list_navigation'=> __('Properties list navigation', 'solvista'),
        'filter_items_list'    => __('Filter properties list', 'solvista'),
    );
    
    $args = array(
        'label'                 => __('Property', 'solvista'),
        'description'           => __('Property listings', 'solvista'),
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'excerpt'),
        'taxonomies'            => array('property_type', 'property_location'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-building',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
    );
    
    register_post_type('property', $args);
}
add_action('init', 'solvista_register_property_post_type');

/**
 * Register property meta boxes
 */
function solvista_register_property_meta_boxes() {
    add_meta_box(
        'property_details',
        __('Property Details', 'solvista'),
        'solvista_property_details_callback',
        'property',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'solvista_register_property_meta_boxes');

/**
 * Property details meta box callback
 */
function solvista_property_details_callback($post) {
    wp_nonce_field('solvista_property_details', 'solvista_property_details_nonce');
    
    $price = get_post_meta($post->ID, '_property_price', true);
    $bedrooms = get_post_meta($post->ID, '_property_bedrooms', true);
    $bathrooms = get_post_meta($post->ID, '_property_bathrooms', true);
    $area = get_post_meta($post->ID, '_property_area', true);
    $address = get_post_meta($post->ID, '_property_address', true);
    $latitude = get_post_meta($post->ID, '_property_latitude', true);
    $longitude = get_post_meta($post->ID, '_property_longitude', true);
    
    ?>
    <div class="property-meta-box">
        <p>
            <label for="property_price"><?php _e('Price', 'solvista'); ?></label>
            <input type="text" id="property_price" name="property_price" value="<?php echo esc_attr($price); ?>">
        </p>
        <p>
            <label for="property_bedrooms"><?php _e('Bedrooms', 'solvista'); ?></label>
            <input type="number" id="property_bedrooms" name="property_bedrooms" value="<?php echo esc_attr($bedrooms); ?>">
        </p>
        <p>
            <label for="property_bathrooms"><?php _e('Bathrooms', 'solvista'); ?></label>
            <input type="number" id="property_bathrooms" name="property_bathrooms" value="<?php echo esc_attr($bathrooms); ?>">
        </p>
        <p>
            <label for="property_area"><?php _e('Area (sq ft)', 'solvista'); ?></label>
            <input type="number" id="property_area" name="property_area" value="<?php echo esc_attr($area); ?>">
        </p>
        <p>
            <label for="property_address"><?php _e('Address', 'solvista'); ?></label>
            <input type="text" id="property_address" name="property_address" value="<?php echo esc_attr($address); ?>">
        </p>
        <p>
            <label for="property_latitude"><?php _e('Latitude', 'solvista'); ?></label>
            <input type="text" id="property_latitude" name="property_latitude" value="<?php echo esc_attr($latitude); ?>">
        </p>
        <p>
            <label for="property_longitude"><?php _e('Longitude', 'solvista'); ?></label>
            <input type="text" id="property_longitude" name="property_longitude" value="<?php echo esc_attr($longitude); ?>">
        </p>
    </div>
    <?php
}

/**
 * Save property meta data
 */
function solvista_save_property_meta($post_id) {
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
    
    $fields = array(
        'property_price',
        'property_bedrooms',
        'property_bathrooms',
        'property_area',
        'property_address',
        'property_latitude',
        'property_longitude'
    );
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post_property', 'solvista_save_property_meta');

/**
 * Register REST API endpoints
 */
function solvista_register_rest_routes() {
    register_rest_route('solvista/v1', '/properties', array(
        'methods' => 'GET',
        'callback' => 'solvista_get_properties',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'solvista_register_rest_routes');

/**
 * Get properties for REST API
 */
function solvista_get_properties($request) {
    // Check if this is a direct API test
    if (isset($request['test_direct']) && $request['test_direct'] === 'true') {
        // Make a direct API call to Resales Online
        $params = array(
            'p2' => 'propertylistings', // Endpoint for property listings
            'p3' => 'json', // Response format
            'p4' => 5, // Number of results per page
            'p5' => 1 // Page number
        );
        
        $response = solvista_resales_api_request('propertylistings', $params);
        
        if (is_wp_error($response)) {
            return new WP_REST_Response(array(
                'error' => $response->get_error_message(),
                'status' => 'error',
                'message' => 'Failed to connect to Resales Online API'
            ), 500);
        }
        
        // Return the direct API response
        return new WP_REST_Response(array(
            'status' => 'success',
            'message' => 'Successfully connected to Resales Online API',
            'properties' => isset($response['PropertyListings']) ? $response['PropertyListings'] : array()
        ), 200);
    }
    
    // Get filters from request
    $filters = array();
    if (!empty($request['filters'])) {
        $filters = json_decode(stripslashes($request['filters']), true);
    }

    // Prepare API parameters
    $params = array(
        'p2' => 'propertylistings', // Endpoint for property listings
        'p3' => 'json', // Response format
        'p4' => 50, // Number of results per page
        'p5' => isset($request['page']) ? $request['page'] : 1 // Page number
    );

    // Add filters if provided
    if (!empty($filters)) {
        if (!empty($filters['property_type'])) {
            $params['p6'] = $filters['property_type']; // Property type
        }
        if (!empty($filters['property_location'])) {
            $params['p7'] = $filters['property_location']; // Location
        }
        if (!empty($filters['price_min'])) {
            $params['p8'] = $filters['price_min']; // Minimum price
        }
        if (!empty($filters['price_max'])) {
            $params['p9'] = $filters['price_max']; // Maximum price
        }
        if (!empty($filters['bedrooms'])) {
            $params['p10'] = $filters['bedrooms']; // Number of bedrooms
        }
    }

    // Make API request
    $response = solvista_resales_api_request('propertylistings', $params);
    
    if (is_wp_error($response)) {
        return new WP_REST_Response(array(
            'error' => $response->get_error_message()
        ), 500);
    }

    // Transform API response to match our frontend expectations
    $properties = array();
    if (!empty($response['PropertyListings'])) {
        foreach ($response['PropertyListings'] as $property) {
            $properties[] = array(
                'id' => $property['PropertyID'],
                'title' => $property['Title'],
                'content' => $property['Description'],
                'price' => $property['Price'],
                'bedrooms' => $property['Bedrooms'],
                'bathrooms' => $property['Bathrooms'],
                'area' => $property['BuildSize'],
                'address' => $property['Address'],
                'latitude' => $property['Latitude'],
                'longitude' => $property['Longitude'],
                'featured_image' => $property['MainImage'],
                'property_type' => array($property['PropertyType']),
                'property_location' => array($property['Location'])
            );
        }
    }

    return new WP_REST_Response(array(
        'properties' => $properties,
        'total' => $response['TotalResults'] ?? count($properties),
        'page' => $params['p5'],
        'total_pages' => ceil(($response['TotalResults'] ?? count($properties)) / $params['p4'])
    ), 200);
}

/**
 * Register AJAX handlers
 */
function solvista_property_search_ajax() {
    check_ajax_referer('solvista_nonce', 'nonce');
    
    $filters = isset($_POST['filters']) ? json_decode(stripslashes($_POST['filters']), true) : array();
    $properties = solvista_get_properties(new WP_REST_Request('GET', '/wp-json/solvista/v1/properties'));
    
    wp_send_json_success($properties);
}
add_action('wp_ajax_solvista_property_search', 'solvista_property_search_ajax');
add_action('wp_ajax_nopriv_solvista_property_search', 'solvista_property_search_ajax');

/**
 * Register custom page templates
 */
function solvista_register_page_templates($templates) {
    // Register main page template
    $templates['page-templates/main-page.php'] = 'Main Page with Map';
    
    return $templates;
}
add_filter('theme_page_templates', 'solvista_register_page_templates');

/**
 * Enqueue scripts and styles for the main page
 */
function solvista_main_page_scripts() {
    // Only load on main page template
    if (is_page_template('page-templates/main-page.php')) {
        // Add Leaflet CSS and JS
        wp_enqueue_style('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4');
        wp_enqueue_script('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true);

        // Add MarkerCluster CSS and JS
        wp_enqueue_style('markercluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css', array(), '1.4.1');
        wp_enqueue_style('markercluster-default', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css', array(), '1.4.1');
        wp_enqueue_script('markercluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', array('leaflet'), '1.4.1', true);

        // Add main page JS
        wp_enqueue_script('main-page', get_template_directory_uri() . '/page-templates/main-page.js', array('leaflet', 'markercluster'), _S_VERSION, true);

        // Add AJAX variables
        wp_localize_script('main-page', 'solvistaMainPage', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('solvista_nonce')
        ));
    }
}
add_action('wp_enqueue_scripts', 'solvista_main_page_scripts');

/**
 * Include main page template in template hierarchy
 */
function solvista_main_page_template_hierarchy($template) {
    if (is_page_template('page-templates/main-page.php')) {
        $template = get_template_directory() . '/page-templates/main-page.php';
    }
    return $template;
}
add_filter('template_include', 'solvista_main_page_template_hierarchy');

/**
 * Create shortcode for main page
 */
function solvista_main_page_shortcode($atts) {
    // Extract shortcode attributes
    $atts = shortcode_atts(array(
        'title' => 'Property Search',
        'description' => 'Find your perfect property using our interactive map search.'
    ), $atts);

    // Start output buffering
    ob_start();

    // Include the template
    include(get_template_directory() . '/page-templates/main-page.php');

    // Return the buffered content
    return ob_get_clean();
}
add_shortcode('main_page', 'solvista_main_page_shortcode');
add_shortcode('main_page', 'solvista_main_page_shortcode');
