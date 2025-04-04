<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if (!function_exists('twentytwentyfive_post_format_setup')):
	/**
	 * Adds theme support for post formats.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_post_format_setup()
	{
		add_theme_support('post-formats', array('aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video'));
	}
endif;
add_action('after_setup_theme', 'twentytwentyfive_post_format_setup');

// Enqueues editor-style.css in the editors.
if (!function_exists('twentytwentyfive_editor_style')):
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_editor_style()
	{
		add_editor_style(get_parent_theme_file_uri('assets/css/editor-style.css'));
	}
endif;
add_action('after_setup_theme', 'twentytwentyfive_editor_style');

// Enqueues style.css on the front.
if (!function_exists('twentytwentyfive_enqueue_styles')):
	/**
	 * Enqueues style.css on the front.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_styles()
	{
		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri('style.css'),
			array(),
			wp_get_theme()->get('Version')
		);
	}
endif;
add_action('wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles');

// Registers custom block styles.
if (!function_exists('twentytwentyfive_block_styles')):
	/**
	 * Registers custom block styles.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_block_styles()
	{
		register_block_style(
			'core/list',
			array(
				'name' => 'checkmark-list',
				'label' => __('Checkmark', 'twentytwentyfive'),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action('init', 'twentytwentyfive_block_styles');

// Registers pattern categories.
if (!function_exists('twentytwentyfive_pattern_categories')):
	/**
	 * Registers pattern categories.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_pattern_categories()
	{

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label' => __('Pages', 'twentytwentyfive'),
				'description' => __('A collection of full page layouts.', 'twentytwentyfive'),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label' => __('Post formats', 'twentytwentyfive'),
				'description' => __('A collection of post format patterns.', 'twentytwentyfive'),
			)
		);
	}
endif;
add_action('init', 'twentytwentyfive_pattern_categories');

// Registers block binding sources.
if (!function_exists('twentytwentyfive_register_block_bindings')):
	/**
	 * Registers the post format block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_block_bindings()
	{
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label' => _x('Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive'),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action('init', 'twentytwentyfive_register_block_bindings');

// Registers block binding callback function for the post format name.
if (!function_exists('twentytwentyfive_format_binding')):
	/**
	 * Callback function for the post format name block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return string|void Post format name, or nothing if the format is 'standard'.
	 */
	function twentytwentyfive_format_binding()
	{
		$post_format_slug = get_post_format();

		if ($post_format_slug && 'standard' !== $post_format_slug) {
			return get_post_format_string($post_format_slug);
		}
	}
endif;

/**
 * Register Property Search Map Template
 */
function twentytwentyfive_register_property_search_map_template($templates)
{
	$templates['page-templates/property-search-map.php'] = __('Property Search with Map', 'twentytwentyfive');
	return $templates;
}
add_filter('theme_page_templates', 'twentytwentyfive_register_property_search_map_template');

/**
 * Enqueue scripts and styles for property search map
 */
function twentytwentyfive_enqueue_property_search_map_assets()
{
	// Only enqueue on pages using the property search map template
	if (is_page_template('page-templates/property-search-map.php')) {
		// Font Awesome
		wp_enqueue_style(
			'font-awesome',
			'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
			array(),
			'5.15.4'
		);

		// Leaflet CSS
		wp_enqueue_style(
			'leaflet',
			'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
			array(),
			'1.9.4'
		);

		// Leaflet JS
		wp_enqueue_script(
			'leaflet',
			'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
			array(),
			'1.9.4',
			true
		);

		// Template-specific styles
		wp_enqueue_style(
			'property-search-map',
			get_template_directory_uri() . '/page-templates/property-search-map.css',
			array('leaflet'),
			'1.0.0'
		);

		// Template-specific scripts
		wp_enqueue_script(
			'property-search-map',
			get_template_directory_uri() . '/page-templates/property-search-map.js',
			array('jquery', 'leaflet'),
			'1.0.0',
			true
		);

		// Localize script with REST API URL
		wp_localize_script('property-search-map', 'propertySearchMap', array(
			'restUrl' => rest_url('solvista/v1/properties'),
			'nonce' => wp_create_nonce('wp_rest')
		));
	}
}
add_action('wp_enqueue_scripts', 'twentytwentyfive_enqueue_property_search_map_assets');

/**
 * Register Property Custom Post Type
 */
function twentytwentyfive_register_property_post_type()
{
	$labels = array(
		'name' => 'Properties',
		'singular_name' => 'Property',
		'menu_name' => 'Properties',
		'add_new' => 'Add New',
		'add_new_item' => 'Add New Property',
		'edit_item' => 'Edit Property',
		'new_item' => 'New Property',
		'view_item' => 'View Property',
		'search_items' => 'Search Properties',
		'not_found' => 'No properties found',
		'not_found_in_trash' => 'No properties found in Trash',
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
	register_post_meta('property', 'property_location', array(
		'type' => 'string',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'sanitize_text_field'
	));

	register_post_meta('property', 'property_type', array(
		'type' => 'string',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'sanitize_text_field'
	));

	register_post_meta('property', 'property_price', array(
		'type' => 'number',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'absint'
	));

	register_post_meta('property', 'property_bedrooms', array(
		'type' => 'number',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'absint'
	));

	register_post_meta('property', 'property_bathrooms', array(
		'type' => 'number',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'absint'
	));

	register_post_meta('property', 'property_area', array(
		'type' => 'number',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'absint'
	));

	register_post_meta('property', 'property_latitude', array(
		'type' => 'number',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'floatval'
	));

	register_post_meta('property', 'property_longitude', array(
		'type' => 'number',
		'single' => true,
		'show_in_rest' => true,
		'sanitize_callback' => 'floatval'
	));

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
add_action('init', 'twentytwentyfive_register_property_post_type');

/**
 * Register REST API endpoint for properties
 */
function twentytwentyfive_register_properties_endpoint()
{
	register_rest_route('solvista/v1', '/properties', array(
		'methods' => 'GET',
		'callback' => 'twentytwentyfive_get_properties',
		'permission_callback' => '__return_true'
	));
}
add_action('rest_api_init', 'twentytwentyfive_register_properties_endpoint');

/**
 * Get properties based on filters
 */
function twentytwentyfive_get_properties($request)
{
	// Get parameters from the request
	$params = $request->get_params();

	// Query properties based on parameters
	$args = array(
		'post_type' => 'property',
		'posts_per_page' => -1,
		'meta_query' => array()
	);

	// Add filters based on parameters
	if (!empty($params['location'])) {
		$args['meta_query'][] = array(
			'key' => 'property_location',
			'value' => $params['location']
		);
	}

	if (!empty($params['property_type'])) {
		$args['meta_query'][] = array(
			'key' => 'property_type',
			'value' => $params['property_type']
		);
	}

	if (!empty($params['bedrooms'])) {
		$args['meta_query'][] = array(
			'key' => 'property_bedrooms',
			'value' => $params['bedrooms'],
			'compare' => '>=',
			'type' => 'NUMERIC'
		);
	}

	if (!empty($params['min_price'])) {
		$args['meta_query'][] = array(
			'key' => 'property_price',
			'value' => $params['min_price'],
			'compare' => '>=',
			'type' => 'NUMERIC'
		);
	}

	if (!empty($params['max_price'])) {
		$args['meta_query'][] = array(
			'key' => 'property_price',
			'value' => $params['max_price'],
			'compare' => '<=',
			'type' => 'NUMERIC'
		);
	}

	// Add quick filters
	$quick_filters = array(
		'frontline_beach',
		'frontline_golf',
		'sea_views',
		'gated_community',
		'andalusian_style',
		'renovated'
	);

	foreach ($quick_filters as $filter) {
		if (!empty($params[$filter])) {
			$args['meta_query'][] = array(
				'key' => 'property_' . $filter,
				'value' => '1',
				'compare' => '='
			);
		}
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
				'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'),
				'latitude' => get_post_meta(get_the_ID(), 'property_latitude', true),
				'longitude' => get_post_meta(get_the_ID(), 'property_longitude', true),
				'price' => get_post_meta(get_the_ID(), 'property_price', true),
				'bedrooms' => get_post_meta(get_the_ID(), 'property_bedrooms', true),
				'bathrooms' => get_post_meta(get_the_ID(), 'property_bathrooms', true),
				'area' => get_post_meta(get_the_ID(), 'property_area', true)
			);
		}
	}

	wp_reset_postdata();
	return $properties;
}
