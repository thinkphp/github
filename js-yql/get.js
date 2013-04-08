if(typeof THINKPHP == 'undefined' || !THINKPHP) {

    /**
     * The THINKPHP global namespace object. If THINKPHP is already defined, the existing THINKPHP object 
     * will not be overwritten so that defined  
     * namespace are preverved
     * @class THINKPHP
     * @static
     */
    var THINKPHP = {};
}

/**
 * Registers a module with the THINKPHP object
 * @method register
 * @static
 * @param {String}   name    the name of the module (event, slider, etc)
 * @param {Function} mainClass a reference to class in the module.  This
 *                             class will be tagged with the version info
 *                             so that it will be possible to identify the
 *                             version that is in use when multiple versions
 *                             have loaded
 * @param {Object}   data      metadata object for the module.  Currently it
 *                             is expected to contain a "version" property
 *                             and a "build" property at minimum.
 */

 THINKPHP.register = function(name,mainClass,data) {
    /*todo*/
 }


 /**
  * Provides the language utilites and extensions used by the library
  * @class THINKPHP.lang
  */

 THINKPHP.lang = THINKPHP.lang || {};

 THINKPHP.lang = function() {

        function isString(o){return typeof(o) === 'string'}

        function isArray(o){return typeof(o) === 'object'}      

        function later(when,o,fn,data,periodic) {

                  when = when || 0;

                  o = o || {};

                  var m = fn, d = data,f,r;

                  if(THINKPHP.lang.isString(fn)) {

                       m = o[fn];  
                  } 

                  if(!THINKPHP.lang.isArray(d)) {

                       d = [data]; 
                  }

                  f = function() {m.apply(o, d);};

                  r = (periodic) ? setInterval(f,when) : setTimeout(f,when);

               return {

                      interval: periodic,

                      cancel: function(){

                              if(this.interval) {clearInterval(r);} else {clearTimeout(r);}
                      }
               };
        }; 

        function merge() {

           var args = arguments;

           if(!args[1]) args = [this,args[0]];

           for(var property in args[1]) {

                        args[0][property] = args[1][property];
           }

         return args[0];

        }
 
        return {later: later,isString: isString, isArray: isArray,merge: merge};
 }();

  THINKPHP.util = THINKPHP.util || {};

/**
 * insert into document script or link
 * @namespace THINKPHP.util
 * @class THINKPHP.util.lang
 */

 THINKPHP.util.Get = function() {

      var queues = {}, qidx = 0;

          /**
           * Return Data for callback
           * method _returnData
           * params q and msg
           * @private  
           */

          var _returnData = function(q,msg) {
  
                  return {
                           tId: q.tId,

                           win: q.scope,

                           data: q.data,

                           nodes: q.nodes,

                           msg: msg 
                         }; 
          };
          

          /**
           * The request failed, execute fail handler with whatever was accomplished
           * method _fail
           * params id (string) the id of the request
           * @private  
           */

          var _fail = function(id,msg) {

                 var q = queues[id];

                 if(q.onFailure) {

                      var sc = q.scope || q.win;

                      q.onFailure.call(sc,_returnData(q,msg));
                 }
          };

          /**
           * The request is complete, so executing the requester`s callback
           * method _finish
           * params id (string) the id of the request
           * @private  
           */

          var _finish = function(id) {
 
             var q = queues[id];
 
                 q.finished = true;

                 if(q.aborted) {
 
                    var msg = "Transaction " + id + " was aborted";

                    _fail(id,msg); 

                    return;  
                 }

                 //execute success callback
                 if(q.onSuccess) {

                     var sc = q.scope || q.win;

                     var msg = "Transaction was succeeded.";

                         q.onSuccess.call(sc,_returnData(q,msg));
                 }  

          };

          var _node = function(type,attr,win) {

                   var w = win || window,d = document, n = d.createElement(type);

                       for(var i in attr) {

                               if(attr.hasOwnProperty(i)) {

                                       n.setAttribute(i,attr[i]);
                               }
                       }

                return n;   
          };


    /**
     * Generates a script node
     * @method _scriptNode
     * @param url {string} the url for the css file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */
     var _scriptNode = function(url,win,charset) {

                   var c = charset || 'utf-8';

                   return _node("script",{"type": "text/javascript",

                                          "charset": c,

                                          "src": url}

                                         ,win); 

      };

    /**
     * Generates a link node
     * @method _linkNode
     * @param url {string} the url for the css file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */

     var _linkNode = function(url,win,charset) {

                   var c = charset || 'utf-8';

                   return _node("link",{"type": "text/css",

                                          "rel": "stylesheet",  

                                          "charset": c,

                                          "href": url}

                                         ,win); 
     };


          var _next = function(id,loaded) {
 
                 var q = queues[id];

                 if(q.aborted) {

                      var msg = "transaction " + id + " was aborted"; 

                      _fail(id,msg);

                      return; 
                 }

                 var url = q.url;

                 if(!url) {return;}   

                 if(q.type === 'script') { 

                      n = _scriptNode(url, document,"utf-8");

                 } else {

                      n = _linkNode(url, document, q.charset);
                 }

                 q.nodes.push(n);

                 document.getElementsByTagName('head')[0].appendChild(n); 

                 _finish(id);
          };

          var _queue = function(type,url,opts) {

                  var id = "q" + (qidx++); 

                      opts = opts || {};

                      queues[id] = THINKPHP.lang.merge(opts,{

                             tId: id,
 
                             type: type,

                             url: url,

                             aborted: false,

                             finished: false,

                             nodes: []
                      });

                    var q = queues[id];

                        q.win = q.win || window;

                        q.scope = q.scope || q.win;
                      

                  THINKPHP.lang.later(0, q, _next, id);

                  return {tId: id};
          };
    
          return {

                /*         
                 * @method script
                 * @static
                 * @param url {string|string[]} the url or urls to the script(s)
                 * @param opts {object} Options:
                 * 
                 *             callback: onSuccess(callback to execute when the script(s) are finished loading) 
                 *                       onFailure(callback to execute when the script(s) load operations fails) 
                 *
                 */
                          
                  script: function(url,opts){

                              return _queue("script",url,opts);
                  },


                /*         
                 * @method css
                 * @static
                 * @param url {string|string[]} the url or urls to the script(s)
                 * @param opts {object} Options:
                 * 
                 *             callback: onSuccess(callback to execute when the script(s) are finished loading) 
                 *                       onFailure(callback to execute when the script(s) load operations fails) 
                 *
                 */

                  css: function(url,opts){

                              return _queue("css",url,opts);
                  } 

 
                 }

 }();

 THINKPHP.register("get", THINKPHP.util.Get, {version: "1.0", build: "2009"});
