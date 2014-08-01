define(function(require) {

  "use strict";

  var getData = function(section, id) {

    var deferred = $.Deferred(),
                   item = undefined;
    
    if (id === undefined || id === "null") {
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
  getStartPage = function (section) {
    return data[section][0].id;
  },
  getSidebarData = function (section, id) {

    var deferred = $.Deferred(),
                   item = undefined;
    
    if (id === undefined || id === "null") {
      item = sidebar[section];
    }

    if (typeof (id) === "number") {
      item = sidebar[section][id];
    }

    var d = sidebar[section];
    for (var i = 0; i < d.length; i++) {
      if (d[i].id !== undefined && d[i].id === id) {
        item = sidebar[section][i];
      }
    }
    
    if(item !== undefined) {
      deferred.resolve(item);
    } else {
      deferred.reject();
    }
    
    return deferred.promise();
  },
  getAnswers = function (section) {
    return answers[section][0];
  },
  
  //data = require('json!data/jsontest.json'),
  data = require('json!data/getdata.php?type=program&id=AAA'),
  sidebar = require('json!data/getdata.php?type=collection&id=FPO'),
  answers = require('json!data/answer.json');

  // The public API
  return {
    getData: getData,
    getStartPage: getStartPage,
    getSidebarData: getSidebarData,
    getAnswers: getAnswers
  };

});
