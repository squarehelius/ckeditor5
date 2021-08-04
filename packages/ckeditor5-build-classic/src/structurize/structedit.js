import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';
import { isWidget } from '@ckeditor/ckeditor5-widget/src/index';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';

const STRUCTURIZE = "structurize";

function isLinkElement( node ) {
	return node.is( 'attributeElement' ) && !!node.getAttribute("STRUCTURIZE");
}

function findLinkElementAncestor( position ) {
	return position.getAncestors().find( ancestor => isLinkElement( ancestor ) );
}

function createStructElement(modelAttributes, conversionApi) {
  const { writer } = conversionApi;
  const element = writer.createAttributeElement("span", {
    "class": "struct-style",
    "STRUCTURIZE": "yes"
  })
  return element
}

export default class StructEdit extends Plugin {

  static get pluginName() {
    return "StructEdit"
  }
  
  init() {
    const editor = this.editor;

    editor.editing.view.addObserver( ClickObserver );

    this._enableClick();

    editor.model.schema.extend( '$text', { allowAttributes: STRUCTURIZE } );
		editor.model.schema.setAttributeProperties( STRUCTURIZE, {
			isFormatting: true,
			copyOnEnter: true
		} );

    editor.conversion.for("dataDowncast").attributeToElement({
      model: STRUCTURIZE, 
      view: createStructElement
    });

    editor.conversion.for("editingDowncast").attributeToElement({
      model: STRUCTURIZE, 
      view: createStructElement
    });

		editor.commands.add( STRUCTURIZE, new AttributeCommand( editor, STRUCTURIZE ) );

		editor.keystrokes.set( 'CTRL+E', STRUCTURIZE );
  }

  _enableClick () {
    const viewDocument = this.editor.editing.view.document;

		// Handle click on view document and show panel when selection is placed inside the link element.
		// Keep panel open until selection will be inside the same link element.
		this.listenTo( viewDocument, 'click', () => {
			const parentLink = this._getSelectedLinkElement();

			if ( parentLink && parentLink.childCount == 1) {
				// Then show panel but keep focus inside editor editable.
        let searchText = parentLink.getChild(0).data;
				window.dispatchEvent(new CustomEvent("structSearch", {detail: searchText}));
			}
		} );
  }

  _getSelectedLinkElement() {
    const view = this.editor.editing.view;
		const selection = view.document.selection;
		const selectedElement = selection.getSelectedElement();

		// The selection is collapsed or some widget is selected (especially inline widget).
		if ( selection.isCollapsed || selectedElement && isWidget( selectedElement ) ) {
			return findLinkElementAncestor( selection.getFirstPosition() );
		} else {
			// The range for fully selected link is usually anchored in adjacent text nodes.
			// Trim it to get closer to the actual link element.
			const range = selection.getFirstRange().getTrimmed();
			const startLink = findLinkElementAncestor( range.start );
			const endLink = findLinkElementAncestor( range.end );
      console.log("test", range, startLink, endLink);

			if ( !startLink || startLink != endLink ) {
				return null;
			}

			// Check if the link element is fully selected.
			if ( view.createRangeIn( startLink ).getTrimmed().isEqual( range ) ) {
				return startLink;
			} else {
				return null;
			}
		}
  }
}