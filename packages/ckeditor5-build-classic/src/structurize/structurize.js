/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold
 */

 import { Plugin } from 'ckeditor5/src/core';
 import StructEdit from './structedit';
 import StructUI from './structui';
 
 /**
  * The bold feature.
  *
  * For a detailed overview check the {@glink features/basic-styles Basic styles feature documentation}
  * and the {@glink api/basic-styles package page}.
  *
  * This is a "glue" plugin which loads the {@link module:basic-styles/bold/boldediting~BoldEditing bold editing feature}
  * and {@link module:basic-styles/bold/boldui~BoldUI bold UI feature}.
  *
  * @extends module:core/plugin~Plugin
  */
 export default class Structurize extends Plugin {
   /**
    * @inheritDoc
    */
   static get requires() {
     return [ StructEdit, StructUI ];
   }
 
   /**
    * @inheritDoc
    */
   static get pluginName() {
     return 'Structurize';
   }
 }
 