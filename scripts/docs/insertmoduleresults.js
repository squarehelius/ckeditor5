/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

const fs = require( 'fs' );

module.exports = function insertModuleResults( path ) {
	if ( !fs.existsSync( path ) ) {
		console.error( `"${ path }" does not exist!` );
		return null;
	}

	try {
		const module = require( path );
		return module();
	} catch ( e ) {
		console.error( e );
	}

	return null;
};
