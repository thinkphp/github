if (!window.THINKPHP){
  document.write('<script type="text/javascript" src="get.js"></script>');
};

//show me love to Module Pattern
yqlWidget = function() {

    var yqlPublicQueryURL = 'http://query.yahooapis.com/v1/public/yql?';

    var widgetStack = [];

    var currString, resultFormat, queryInsert, setupConfig = [];

    var pattern = /\{([\w\-\.\[\]]+)\}/gi;

    var onYQLReqSuccess = function(resp){ if (setupConfig['debug'] && window.console){ console.log("GET request JSONP " + resp.msg); }}

    var onYQLReqFailure = function(resp){ if (setupConfig['debug'] && window.console){ console.log(resp.msg); }}

    var optional = null;

    //method: get YQL Data
    //description: Use the query provided as parameter to make a request to YQL endpoint to capture data 
     var getYQLData = function(query){ 

         document.getElementById(queryInsert).innerHTML = 'Loading...';  

         //prepare the URL for YQL query:
          var sURL = yqlPublicQueryURL + "q=" + encodeURIComponent(query) + "&format=json&callback=yqlWidget.getYQLDataCallback&&env=http%3A%2F%2Fdatatables.org%2Falltables.env";

          //make GET request to YQL with provided query
          var transactionObj = THINKPHP.util.Get.script(sURL, {

                onSuccess : onYQLReqSuccess,

                onFailure : onYQLReqFailure,

                scope : this
          });

        return transactionObj;
      }

    //method: parse YQL results
    //description: using the results set, parse the YQL results into display node
    var parseYQLResults = function(results) { 

                var firstChild;
 
                    //if we have no results then display an error on the console and return false
                    if(results == null) {

                       if (setupConfig['debug'] && window.console) { console.log("We have no valid results."); }

                       document.getElementById(queryInsert).innerHTML = 'No results';  

                       return null;

                    } else {

                       if (setupConfig['debug'] && window.console) { console.log("We have valid results."); }
                    }


                    for (var child in results){

                             if (results.hasOwnProperty(child)) {

                                         firstChild = results[child];

                                         break;
                             }//endif
                    }//endfor


                var html = "";

                    if(firstChild.length !== undefined) {

                           for(var i=0;i<firstChild.length;i++) { 

                              html += parseConfig(firstChild[i]); 
                           }
                        
                    } else {

                              html += parseConfig(firstChild);
                    }

                 document.getElementById(queryInsert).innerHTML = html;      

       yqlWidget.render();            

    }


    var parseYQLPath = function(results) { 

                var firstChild = results;

                    //if we have no results then display an error on the console and return false
                    if(firstChild == null) {

                       if (setupConfig['debug'] && window.console) { console.log("We have no valid results."); }

                       document.getElementById(queryInsert).innerHTML = 'No results';  

                       return null;

                    } else {

                       if (setupConfig['debug'] && window.console) { console.log("We have valid results."); }
                    }

                var html = "";

                    if(firstChild.length !== undefined) {

                           for(var i=0;i<firstChild.length;i++) { 

                              html += parseConfig(firstChild[i]); 
                           }
                        
                    } else {

                              html += parseConfig(firstChild);
                    }

                 document.getElementById(queryInsert).innerHTML = html; 

       optional = null;

       yqlWidget.render();            

    }
     

    //method: parse Config
    //description: loop through configuration array for provided data set node
    var parseConfig = function(node) { 

          var currString = node;

                   if(resultFormat) {

                        currString = resultFormat.replace(pattern,function(matchedSubstring,index,originalString){

                             if(index == 'email' && eval("currString."+index) != null) {

                                          return MD5(eval("currString."+index));

                             } else if(eval("currString."+index) != null) {

                                          return eval("currString."+index);
                             } else {

                                     return "Unknown";

                                    }
                       });

                   }//endif

          return currString;
    } 
   

    //public functions return
    return{

            push: function(query,config,format,insertEl,plus,final) {

                 if(query == null || format == null || insertEl == null) {

                             //if we have firebug the display in console the errors
                             if(setupConfig['debug'] && window.console) {

                                    console.log('Missing query, return format or insert element');

                                    return null; 
                             } 
                 }

                 if(final != null) widgetStack.push(final); 

                 //push in the stack function
                 widgetStack.push(function(){yqlWidget.init(query, config, format, insertEl,plus); }); 


            },

            //init the function and make request JSONP
            init: function(query,config,format,insertEl,plus) { 

                  if(plus) optional = plus;

                  if(config) setupConfig = config;

                  resultFormat = format;

                  queryInsert = insertEl; 

              return getYQLData(query); 
            },
 
            //callback jsonp
            getYQLDataCallback: function(json) {  

              var path;

                      if(!json.query.results) {

                          if(setupConfig['debug'] && window.console) { 

                                         console.log('YQL query returned no results'); 

                                         document.getElementById(queryInsert).innerHTML = 'No results found';  
                          }//endif

                          return null;

                      } else {

                          if (setupConfig['debug'] && window.console){ console.log('YQL query returned results'); }
                      }

                     if(!optional) {path = json.query.results;} else {path = eval('json.query.results'+'.'+optional);}

                     if(optional) {parseYQLPath(path);} else {parseYQLResults(path);}

            },

            //pop stack
            render: function() {

                    if(widgetStack.length > 0) {return widgetStack.pop()();}
            }

         };    
}();