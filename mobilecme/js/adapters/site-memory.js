var params = {}, temp, i, l, collection, program, 
args = document.location.search.substring(1).split('&');
if (document.location.search.length > 0) {
  for ( i = 0, l = args.length; i < l; i++ ) {
      temp = args[i].split('=');
      params[temp[0]] = temp[1];
  }
  collection = params.collection, program = params.program;
} /*else {
  collection = "FPO", program = "BBB";
};

console.log("collection, program",params,collection, program);*/


//define(['json!data/getdata.php?type=program&id='+program, 'json!data/getdata.php?type=collection&id='+collection], function(data,sidebar){
define(['json!server/program/'+program, 'json!server/collection/'+collection], function(data,sidebar){

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
  getProgramID = function (section) {
    return data[section];
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
  };
  
  //data = require('json!data/jsontest.json'),
  //data = require('json!data/getdata.php?type=program&id=AAA'),
  //sidebar = require('json!data/getdata.php?type=collection&id=FPO'),
  //answers = require('json!data/answer.json');

  // The public API
  return {
    getData: getData,
    getProgramID: getProgramID,
    getStartPage: getStartPage,
    getSidebarData: getSidebarData,
    getAnswers: getAnswers
  };

});
