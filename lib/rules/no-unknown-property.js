/**
 * @fileoverview Prevent usage of unknown DOM property
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var UNKNOWN_MESSAGE = 'Unknown property \'{{name}}\' found, use \'{{standardName}}\' instead';

var DOM_ATTRIBUTE_NAMES = {
  'accept-charset': 'acceptCharset',
  class: 'className',
  for: 'htmlFor',
  'http-equiv': 'httpEquiv'
};

var DOM_PROPERTY_NAMES = [
  // Standard
  'acceptCharset', 'accessKey', 'allowFullScreen', 'allowTransparency', 'autoComplete', 'autoFocus', 'autoPlay',
  'cellPadding', 'cellSpacing', 'charSet', 'classID', 'className', 'colSpan', 'contentEditable', 'contextMenu',
  'crossOrigin', 'dateTime', 'encType', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget',
  'frameBorder', 'hrefLang', 'htmlFor', 'httpEquiv', 'marginHeight', 'marginWidth', 'maxLength', 'mediaGroup',
  'noValidate', 'onBlur', 'onChange', 'onClick', 'onContextMenu', 'onCopy', 'onCut', 'onDoubleClick',
  'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop',
  'onFocus', 'onInput', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onMouseDown', 'onMouseEnter', 'onMouseLeave',
  'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onPaste', 'onScroll', 'onSubmit', 'onTouchCancel',
  'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onWheel',
  'radioGroup', 'readOnly', 'rowSpan', 'spellCheck', 'srcDoc', 'srcSet', 'tabIndex', 'useMap',
  // Non standard
  'autoCapitalize', 'autoCorrect',
  'autoSave',
  'itemProp', 'itemScope', 'itemType', 'itemRef', 'itemID',
  // SVG
  'clipPath', 'cx', 'cy', 'd', 'dx', 'dy', 'fill', 'fillOpacity', 'fontFamily',
  'fontSize', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'markerEnd',
  'markerMid', 'markerStart', 'offset', 'opacity', 'patternContentUnits',
  'patternUnits', 'points', 'preserveAspectRatio', 'r', 'rx', 'ry', 'spreadMethod',
  'stopColor', 'stopOpacity', 'stroke', 'strokeDasharray', 'strokeLinecap',
  'strokeOpacity', 'strokeWidth', 'textAnchor', 'transform', 'version',
  'viewBox', 'x1', 'x2', 'x', 'y1', 'y2', 'y',
  'xlink:Actuate', 'xlink:Arcrole', 'xlink:Href', 'xlink:Role', 'xlink:Show', 'xlink:Title', 'xlink:Type',
  'xml:Base', 'xml:Lang', 'xml:Space'
];

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Checks if a node matches the JSX tag convention.
 * @param {Object} node - JSX element being tested.
 * @returns {boolean} Whether or not the node name match the JSX tag convention.
 */
var tagConvention = /^[a-z][^-]*$/;
function isTagName(node) {
  if (tagConvention.test(node.parent.name.name)) {
    // http://www.w3.org/TR/custom-elements/#type-extension-semantics
    return !node.parent.attributes.some(function(attrNode) {
      return (
        attrNode.type === 'JSXAttribute' &&
        attrNode.name.type === 'JSXIdentifier' &&
        attrNode.name.name === 'is'
      );
    });
  }
  return false;
}

/**
 * Get the standard name of the attribute.
 * @param {String} name - Name of the attribute.
 * @returns {String} The standard name of the attribute.
 */
function getStandardName(name) {
  if (DOM_ATTRIBUTE_NAMES[name]) {
    return DOM_ATTRIBUTE_NAMES[name];
  }
  var i;
  var found = DOM_PROPERTY_NAMES.some(function(element, index) {
    i = index;
    return element.toLowerCase() === name;
  });
  return found ? DOM_PROPERTY_NAMES[i].replace(':', '') : null;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  return {

    JSXAttribute: function(node) {
      var name = context.getSource(node.name);
      var standardName = getStandardName(name);
      if (!isTagName(node) || !standardName) {
        return;
      }
      context.report(node, UNKNOWN_MESSAGE, {
        name: name,
        standardName: standardName
      });
    }
  };

};

module.exports.schema = [];
