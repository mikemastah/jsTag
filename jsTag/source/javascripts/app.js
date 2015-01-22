var jsTag = angular.module('jsTag', []);

// Defaults for jsTag (can be overridden as shown in example)
jsTag.constant('jsTagDefaults', {
  'edit': true,
  'defaultTags': [],
  'breakCodes': [
    13,  // Return
    188, // Comma
    27   // Escape
  ],
  'splitter': ',',
  'texts': {
    'inputPlaceHolder': "Input text",
    'removeSymbol': String.fromCharCode(215)
  },
    'tagDisplayKey': 'value',
    'tagIdKey': false
});