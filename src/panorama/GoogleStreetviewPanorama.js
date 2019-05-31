import { ImagePanorama } from './ImagePanorama';
import { GoogleStreetLoader } from '../loaders/GoogleStreetLoader';
import 'three';

/**
 * Google streetview panorama
 * 
 * [How to get Panorama ID]{@link http://stackoverflow.com/questions/29916149/google-maps-streetview-how-to-get-panorama-id}
 * @constructor
 * @param {string} panoId - Panorama id from Google Streetview 
 * @param {string} [apiKey] - Google Street View API Key
 */
function GoogleStreetviewPanorama ( panoId, apiKey ) {

    ImagePanorama.call( this );

    this.panoId = panoId;

    this.gsvLoader = undefined;

    this.loadRequested = false;

    this.setupGoogleMapAPI( apiKey );

}

GoogleStreetviewPanorama.prototype = Object.assign( Object.create( ImagePanorama.prototype ), {

    constructor: GoogleStreetviewPanorama,

    /**
	 * Load Google Street View by panorama id
	 * @param {string} panoId - Gogogle Street View panorama id
	 */
    load: function ( panoId ) {

        this.loadRequested = true;

        panoId = ( panoId || this.panoId ) || {};

        if ( panoId && this.gsvLoader ) {

            this.loadGSVLoader( panoId );

        } else {

            this.gsvLoader = {};

        }

    },

    /**
	 * Setup Google Map API
	 */
    setupGoogleMapAPI: function ( apiKey ) {

        const script = document.createElement( 'script' );
        script.src = 'https://maps.googleapis.com/maps/api/js?';
        script.src += apiKey ? 'key=' + apiKey : '';
        script.onreadystatechange = this.setGSVLoader.bind( this );
        script.onload = this.setGSVLoader.bind( this );

        document.querySelector( 'head' ).appendChild( script );

    },

    /**
	 * Set GSV Loader
	 */
    setGSVLoader: function () {

        this.gsvLoader = new GoogleStreetLoader();

        if ( this.gsvLoader === {} || this.loadRequested ) {

            this.load();

        }

    },

    /**
	 * Get GSV Loader
	 * @return {object} GSV Loader instance
	 */
    getGSVLoader: function () {

        return this.gsvLoader;

    },

    /**
	 * Load GSV Loader
	 * @param  {string} panoId - Gogogle Street View panorama id
	 */
    loadGSVLoader: function ( panoId ) {

        this.loadRequested = false;

        this.gsvLoader.onProgress = this.onProgress.bind( this );

        this.gsvLoader.onPanoramaLoad = this.onLoad.bind( this );

        this.gsvLoader.setZoom( this.getZoomLevel() );

        this.gsvLoader.load( panoId );

        this.gsvLoader.loaded = true;
    },

    /**
	 * This will be called when panorama is loaded
	 * @param  {HTMLCanvasElement} canvas - Canvas where the tiles have been drawn
	 */
    onLoad: function ( canvas ) {

        if ( !this.gsvLoader ) { return; }

        ImagePanorama.prototype.onLoad.call( this, new THREE.Texture( canvas ) );

    },

    reset: function () {

        this.gsvLoader = undefined;

        ImagePanorama.prototype.reset.call( this );

    }

} );

export { GoogleStreetviewPanorama };