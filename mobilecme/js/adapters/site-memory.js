define(function(require) {

  "use strict";

  var getData = function(section, id) {

    var deferred = $.Deferred(),
                   item = undefined;
    
    if (id === undefined) {
      item = data[section];
    }

    if (typeof (id) === "number") {
      item = data[section][id];
    }

    var d = data[section];
    for (var i = 0; i < d.length; i++) {
      if (d[i].id !== undefined && d[i].id === id) {
        item = data[section][i];
      }
    }
    
    if(item !== undefined) {
      deferred.resolve(item);
    } else {
      deferred.reject();
    }
    
    return deferred.promise();
    
  },
  
  data = require('json!../../data/jsontest.json');

  // The public API
  return {
    getData: getData
  };

});
