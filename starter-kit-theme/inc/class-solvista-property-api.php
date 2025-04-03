<?php
/**
 * Solvista Property API Class
 */
class Solvista_Property_API
{
    public function __construct()
    {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes()
    {
        register_rest_route('solvista/v1', '/properties', array(
            'methods' => 'POST',
            'callback' => array($this, 'get_properties'),
            'permission_callback' => '__return_true'
        ));
    }

    public function get_properties($request)
    {
        $filters = $request->get_json_params();

        // Build the query based on filters
        $args = array(
            'post_type' => 'property',
            'posts_per_page' => -1,
            'meta_query' => array('relation' => 'AND')
        );

        // Add filters to meta query
        if (!empty($filters['location'])) {
            $args['meta_query'][] = array(
                'key' => 'location',
                'value' => $filters['location'],
                'compare' => '='
            );
        }

        if (!empty($filters['region'])) {
            $args['meta_query'][] = array(
                'key' => 'region',
                'value' => $filters['region'],
                'compare' => '='
            );
        }

        if (!empty($filters['propertyType'])) {
            $args['meta_query'][] = array(
                'key' => 'property_type',
                'value' => $filters['propertyType'],
                'compare' => '='
            );
        }

        if (!empty($filters['minPrice']) || !empty($filters['maxPrice'])) {
            $price_query = array('relation' => 'AND');

            if (!empty($filters['minPrice'])) {
                $price_query[] = array(
                    'key' => 'price',
                    'value' => $filters['minPrice'],
                    'compare' => '>=',
                    'type' => 'NUMERIC'
                );
            }

            if (!empty($filters['maxPrice'])) {
                $price_query[] = array(
                    'key' => 'price',
                    'value' => $filters['maxPrice'],
                    'compare' => '<=',
                    'type' => 'NUMERIC'
                );
            }

            $args['meta_query'][] = $price_query;
        }

        if (!empty($filters['bedrooms'])) {
            $args['meta_query'][] = array(
                'key' => 'bedrooms',
                'value' => $filters['bedrooms'],
                'compare' => '>=',
                'type' => 'NUMERIC'
            );
        }

        if (!empty($filters['bathrooms'])) {
            $args['meta_query'][] = array(
                'key' => 'bathrooms',
                'value' => $filters['bathrooms'],
                'compare' => '>=',
                'type' => 'NUMERIC'
            );
        }

        if (!empty($filters['minArea'])) {
            $args['meta_query'][] = array(
                'key' => 'area',
                'value' => $filters['minArea'],
                'compare' => '>=',
                'type' => 'NUMERIC'
            );
        }

        if (!empty($filters['refNumber'])) {
            $args['meta_query'][] = array(
                'key' => 'reference_number',
                'value' => $filters['refNumber'],
                'compare' => '='
            );
        }

        // Advanced filters
        $advanced_filters = array(
            'frontlineBeach',
            'frontlineGolf',
            'seaViews',
            'gatedCommunity',
            'andalusianStyle',
            'renovated'
        );

        foreach ($advanced_filters as $filter) {
            if (!empty($filters[$filter])) {
                $args['meta_query'][] = array(
                    'key' => $filter,
                    'value' => $filters[$filter],
                    'compare' => '='
                );
            }
        }

        // Get properties
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
                    'latitude' => get_post_meta($post_id, 'latitude', true),
                    'longitude' => get_post_meta($post_id, 'longitude', true),
                    'price' => get_post_meta($post_id, 'price', true),
                    'bedrooms' => get_post_meta($post_id, 'bedrooms', true),
                    'bathrooms' => get_post_meta($post_id, 'bathrooms', true),
                    'area' => get_post_meta($post_id, 'area', true),
                    'thumbnail' => get_the_post_thumbnail_url($post_id, 'thumbnail')
                );
            }
        }

        wp_reset_postdata();

        return rest_ensure_response($properties);
    }
}

// Initialize the API
new Solvista_Property_API();