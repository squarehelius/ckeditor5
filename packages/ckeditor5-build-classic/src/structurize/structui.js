/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldui
 */

 import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
 import { ButtonView } from '@ckeditor/ckeditor5-ui/src';
 
 import structIcon from './struct.svg';
 
 const STRUCTURIZE = "structurize";
 
 /**
  * The bold UI feature. It introduces the Bold button.
  *
  * @extends module:core/plugin~Plugin
  */
 export default class StructUI extends Plugin {
   /**
    * @inheritDoc
    */
   static get pluginName() {
     return 'StructUI';
   }
 
   /**
    * @inheritDoc
    */
   init() {
     const editor = this.editor;
     const t = editor.t;
 
     // Add bold button to feature components.
     editor.ui.componentFactory.add( STRUCTURIZE, locale => {
       const command = editor.commands.get( STRUCTURIZE );
       const view = new ButtonView( locale );
 
       view.set( {
         label: "结构化",
         icon: structIcon,
         keystroke: 'CTRL+E',
         tooltip: true,
         isToggleable: true
       } );
 
       view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );
 
       // Execute command.
       this.listenTo( view, 'execute', () => {
         editor.execute( STRUCTURIZE );
         editor.editing.view.focus();
       } );
 
       return view;
     } );
   }
 }
 