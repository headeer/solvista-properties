<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'F*. `G.qzZEmG3p&Q[1?L0R?c~6$,]9W8V/2SDCyZ.WXSgE0,vPWLK4@XP5J3%*5' );
define( 'SECURE_AUTH_KEY',   '@^v}s$=Us_K^ |zHg3LVuB<$scDvJk[IoA!3p&4DUP,MC)@;x4ye4HKeGJnR)[S2' );
define( 'LOGGED_IN_KEY',     '=KFv^Xw9AmeM:(N jU{K81Sx2i{Q/wP]>L^Y<O>*Hkk{xTvvGV9k(WFS}JKHP3-d' );
define( 'NONCE_KEY',         '[cpB!fBi!a~p&Ux mEHrnhpuJ$X}^aRW7^N:*NZzToid6XHFAo#80qI3UF)b;^%=' );
define( 'AUTH_SALT',         'Q?h{Lb]qVkDDSJ{6*LJE`m/I+860B[coEYQ9,Np>c5Z;^s?QYeCh$UvN` 5FxibA' );
define( 'SECURE_AUTH_SALT',  'W>C,^/G7]!mf1gqxN3sWDA<Hf+62Gal5)%4_K{?5%b7-TXR#3Z5Quy>8_3=$H`tS' );
define( 'LOGGED_IN_SALT',    '&[S=,_B@:`j$Qmp4?K0diGTXd$j-2Sf:uKuE(u;FqVzV*OL3z,DV_r%aXX` IxNo' );
define( 'NONCE_SALT',        '~>t~<,+LT7=eFFIKN*c0y=lJy[F$DBIaF7TkEmrfpu8/*~52|h3_L`:N|vYIOD#!' );
define( 'WP_CACHE_KEY_SALT', '%[a3sJ5)d%Ao]G&>cVz26Z*YI$jt:7%w^D[?nhbTp2?^/DkfO}j%[Sc7t2@ZtM=}' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
