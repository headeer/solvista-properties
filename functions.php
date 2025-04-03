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