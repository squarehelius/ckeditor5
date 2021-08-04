/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ButtonView } from '@ckeditor/ckeditor5-ui/src';
import axios from 'axios';

import ai_icon from './ai.svg';

const IMAGE_REC_UI = "imageRec"
const url = "https://service-nhgdeels-1301119996.usw.apigw.tencentcs.com/release/ocr"

/**
* The bold UI feature. It introduces the Bold button.
*
* @extends module:core/plugin~Plugin
*/
export default class ImageRecUI extends Plugin {
  /**
  * @inheritDoc
  */
  static get pluginName() {
    return 'ImageRecUI';
  }

  /**
  * @inheritDoc
  */
  init() {
    const editor = this.editor;
    const t = editor.t;

    // Add bold button to feature components.
    editor.ui.componentFactory.add( IMAGE_REC_UI, locale => {
      const view = new ButtonView( locale );

      view.set( {
        label: "AI识表格",
        icon: ai_icon,
        tooltip: true,
        isToggleable: false
      } );

      // Execute command.
      view.on( 'execute', async () => {
        const imageUtils = editor.plugins.get( 'ImageUtils' );
        const tableUtils = editor.plugins.get( 'TableUtils' );
		    const element = imageUtils.getClosestSelectedImageElement( editor.model.document.selection );
        let base64 = element.getAttribute("src");
        let params = new URLSearchParams({
          "base64url": base64
        })
        let res = await axios.post(url, params, {timeout: 60000});
        console.log(res);
        let tables = [];
        res.data.TableDetections.forEach((table) => {
          let numRow = 0
          let numCol = 0;
          let isValid = false
          let cells = table['Cells'];
          cells.forEach((cell) => {
            if(cell.RowBr > numRow) {
              numRow = cell.RowBr;
            }
            if(cell.ColBr > numCol) {
              numCol = cell.ColBr;
            }
            if(cell.RowTl >= 0) {
              isValid = true;
            }
          })
          if(isValid) {
            tables.push({row: numRow, col: numCol, cells: cells});
          }
        })
        editor.model.change( writer => {
          // Create a table of 2 rows and 7 columns:
          tables.forEach(table => {
            console.log(table);
            const tableEle = tableUtils.createTable( writer, {rows: table["col"], columns: table["row"]});
            table["cells"].forEach(cell => {
              let crow = cell['RowTl'];
              let ccol = cell['ColTl'];
              let paragraph = tableEle.getChild(crow).getChild(ccol).getChild(0);
              writer.insertText(cell["Text"], paragraph, 0);
            })
            editor.model.insertContent( tableEle );
          })
        });
      } );

    return view;
    } );
  }
}
 