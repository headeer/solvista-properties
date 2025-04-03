<?php
/**
 * Theme functions and definitions
 */

// Register scripts and styles
function solvista_enqueue_scripts()
{
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
        get_template_directory_uri() . '/js/search-by-map.js',
        array('jquery', 'leaflet-js'),
        '1.0.0',
        true
    );

    // Search by Map styles
    wp_enqueue_style(
        'search-by-map',
        get_template_directory_uri() . '/css/search-by-map.css',
        array('leaflet-css'),
        '1.0.0'
    );
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

// Register settings for Google Maps API key
function solvista_register_settings()
{
    // Remove Google Maps API key setting
    // register_setting('solvista_options', 'solvista_google_maps_api_key');
}
add_action('admin_init', 'solvista_register_settings');

// Add settings page
function solvista_add_settings_page()
{
    // Remove settings page since we don't need it anymore
    // add_options_page(
    //     'Solvista Settings',
    //     'Solvista Settings',
    //     'manage_options',
    //     'solvista-settings',
    //     'solvista_settings_page'
    // );
}
add_action('admin_menu', 'solvista_add_settings_page');

// Remove settings page callback since we don't need it anymore
// function solvista_settings_page()
// {
//     ?>
// <div class="wrap">
    // <h1>Solvista Settings</h1>
    // <form method="post" action="options.php">
        // <?php settings_fields('solvista_options'); ?>
        // <table class="form-table">
            // <tr>
                // <th scope="row">
                    // <label for="solvista_google_maps_api_key">Google Maps API Key</label>
                    // </th>
                // <td>
                    // <input type="text" id="solvista_google_maps_api_key" name="solvista_google_maps_api_key" //
                        value="<?php echo esc_attr(get_option('solvista_google_maps_api_key')); ?>" //
                        class="regular-text" />
                    // </td>
                // </tr>
            // </table>
        // <?php submit_button(); ?>
        // </form>
    // </div>
// <?php
// }

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

    // Price range filter
    if (!empty($filters['min_price']) || !empty($filters['max_price'])) {
        $price_query = array('relation' => 'AND');

        if (!empty($filters['min_price'])) {
            $price_query[] = array(
                'key' => 'price',
                'value' => $filters['min_price'],
                'compare' => '>=',
                'type' => 'NUMERIC'
            );
        }

        if (!empty($filters['max_price'])) {
            $price_query[] = array(
                'key' => 'price',
                'value' => $filters['max_price'],
                'compare' => '<=',
                'type' => 'NUMERIC'
            );
        }

        $args['meta_query'][] = $price_query;
    }

    // Area filter
    if (!empty($filters['min_area'])) {
        $args['meta_query'][] = array(
            'key' => 'area',
            'value' => $filters['min_area'],
            'compare' => '>=',
            'type' => 'NUMERIC'
        );
    }

    // Reference number filter
    if (!empty($filters['ref_number'])) {
        $args['meta_query'][] = array(
            'key' => 'reference_number',
            'value' => $filters['ref_number'],
            'compare' => '='
        );
    }

    $query = new WP_Query($args);
    $properties = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();

            $properties[] = array(
                'id' => $post_id,
                'title' => get_the_title(),
                'url' => get_permalink(),
                'price' => get_post_meta($post_id, 'price', true),
                'bedrooms' => get_post_meta($post_id, 'bedrooms', true),
                'bathrooms' => get_post_meta($post_id, 'bathrooms', true),
                'area' => get_post_meta($post_id, 'area', true),
                'latitude' => get_post_meta($post_id, 'latitude', true),
                'longitude' => get_post_meta($post_id, 'longitude', true),
                'frontline_beach' => get_post_meta($post_id, 'frontline_beach', true),
                'frontline_golf' => get_post_meta($post_id, 'frontline_golf', true),
                'sea_views' => get_post_meta($post_id, 'sea_views', true),
                'gated_community' => get_post_meta($post_id, 'gated_community', true),
                'andalusian_style' => get_post_meta($post_id, 'andalusian_style', true),
                'renovated' => get_post_meta($post_id, 'renovated', true)
            );
        }
    }

    wp_reset_postdata();
    return rest_ensure_response($properties);
}