var jsTag = angular.module('jsTag');

// TagsCollection Model
jsTag.factory('JSTagsCollection', ['JSTag', '$filter', function(JSTag, $filter) {
  
  // Constructor
  function JSTagsCollection(defaultTags) {
    this.tags = {};
    this.tagsCounter = 0;       // Not actually a counter of the amount of tags in the collection but instead used to
                                // insert tags at "unique" indexes when no id is given.
    for (var defaultTagKey in defaultTags) {
      var defaultTagValue = defaultTags[defaultTagKey];
      this.addTag(defaultTagValue);
    }
   
    this._onAddListenerList = [];
    this._onRemoveListenerList = [];
 
    this.unsetActiveTags();
    this.unsetEditedTag();
  }
  
  // *** Methods *** //
  
  // *** Object manipulation methods *** //
  
  // Adds a tag with received value and optional id
  JSTagsCollection.prototype.addTag = function(value, id) {
      var tagIndex = id || this.tagsCounter;

      var newTag = new JSTag(value, tagIndex);
      this.tags[tagIndex] = newTag;

      this.tagsCounter++; // TODO: only increment this when we actually use it for tagIndex
  

    angular.forEach(this._onAddListenerList, function (callback) {
      callback(newTag);
    });
  };
  
  // Removes the received tag
  JSTagsCollection.prototype.removeTag = function(tagIndex) {
    var tag = this.tags[tagIndex];
    delete this.tags[tagIndex];
    angular.forEach(this._onRemoveListenerList, function (callback) {
      callback(tag);
    });
  };

  JSTagsCollection.prototype.onAdd = function onAdd(callback) {
    this._onAddListenerList.push(callback);
  };

  JSTagsCollection.prototype.onRemove = function onRemove(callback) {
    this._onRemoveListenerList.push(callback);
  };

  // Returns the number of tags in collection
  JSTagsCollection.prototype.getNumberOfTags = function() {
    return getNumberOfProperties(this.tags);
  };
  
  // Returns the previous tag before the tag received as input
  // Returns same tag if it's the first
  JSTagsCollection.prototype.getPreviousTag = function(tag) {
    var firstTag = getFirstProperty(this.tags);
    if (firstTag.id === tag.id) {
      // Return same tag if we reached the beginning
      return tag;
    } else {
      return getPreviousProperty(this.tags, tag.id);
    }
  };
  
  // Returns the next tag after the tag received as input
  // Returns same tag if it's the last
  JSTagsCollection.prototype.getNextTag = function(tag) {
    var lastTag = getLastProperty(this.tags);
    if (tag.id === lastTag.id) {
      // Return same tag if we reached the end
      return tag;
    } else {
      return getNextProperty(this.tags, tag.id);
    }
  };
  
  // *** Active methods *** //
  
  // Checks if a specific tag is active
  JSTagsCollection.prototype.isTagActive = function(tag) {
    return $filter("inArray")(tag, this._activeTags);
  };
  
  // Sets tag to active
  JSTagsCollection.prototype.setActiveTag = function(tag) {
    if (!this.isTagActive(tag)) {
      this._activeTags.push(tag);
    }
  };
  
  // Sets the last tag to be active
  JSTagsCollection.prototype.setLastTagActive = function() {
    if (getNumberOfProperties(this.tags) > 0) {
      var lastTag = getLastProperty(this.tags);
      this.setActiveTag(lastTag);
    }
  };
  
  // Un-sets an active tag
  JSTagsCollection.prototype.unsetActiveTag = function(tag) {
    var removedTag = this._activeTags.splice(this._activeTags.indexOf(tag), 1);
  };
  
  // Un-sets all active tag
  JSTagsCollection.prototype.unsetActiveTags = function() {
    this._activeTags = [];
  };
  
  // Returns a JSTag only if there is 1 exactly active tags, otherwise null
  JSTagsCollection.prototype.getActiveTag = function() {
    var activeTag = null;
    if (this._activeTags.length === 1) {
      activeTag = this._activeTags[0];
    }
    
    return activeTag;
  };
  
  // Returns number of active tags
  JSTagsCollection.prototype.getNumOfActiveTags = function() {
    return this._activeTags.length;
  };
  
  // *** Edit methods *** //
  
  // Gets the edited tag
  JSTagsCollection.prototype.getEditedTag = function() {
    return this._editedTag;
  };
  
  // Checks if a tag is edited
  JSTagsCollection.prototype.isTagEdited = function(tag) {
    return tag === this._editedTag;
  };
  
  // Sets the tag in the _editedTag member
  JSTagsCollection.prototype.setEditedTag = function(tag) {
    this._editedTag = tag;
  };
  
  // Un-sets the 'edit' flag on a tag by it's given index
  JSTagsCollection.prototype.unsetEditedTag = function() {
    // Kill empty tags!
    if (this._editedTag !== undefined &&
        this._editedTag !== null &&
        this._editedTag.value === "") {
      this.removeTag(this._editedTag.id);
    }
    
    this._editedTag = null;
  };
  
  return JSTagsCollection;
}]);

// *** Extension methods used to iterate object like a dictionary. Used for the tags. *** //
// TODO: Find another place for these extension methods. Maybe filter.js
// TODO: Maybe use a regular array instead and delete them all :)

// Gets the number of properties, including inherited
function getNumberOfProperties(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

// Get the first property of an object, including inherited properties
function getFirstProperty(obj) {
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) return obj[key];
    }
    return null;
}

// Get the last property of an object, including inherited properties
function getLastProperty(obj) {
    var key, last = null;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) last = obj[key];
    }
    return last;
}

// Get the next property of an object whose properties keys are numbers, including inherited properties
function getNextProperty(obj, propertyId) {
  var keys = Object.keys(obj);
  var indexOfProperty = keys.indexOf(propertyId.toString());
  var keyOfNextProperty = keys[indexOfProperty + 1];
  return obj[keyOfNextProperty];
}

// Get the previous property of an object whose properties keys are numbers, including inherited properties
function getPreviousProperty(obj, propertyId) {
  var keys = Object.keys(obj);
  var indexOfProperty = keys.indexOf(propertyId.toString());
  var keyOfPreviousProperty = keys[indexOfProperty - 1];
  return obj[keyOfPreviousProperty];
}
