//show me love to the Module Pattern
var githubbadge = function() {

    /* start Configuration */

    var config = {

        //github ID
        badgeID: 'gitbadge',

        //trigger class
        triggerGit: 'toGit',

        //profile ID
        profileID: 'gitprofile', 

        //repositories ID
        reposID: 'gitcontent',

        //username of repositories
        username: 'thinkphp',
 
        //pattern regexp
        loginmatch: /login-(\w+)/,

        //name of css
        styles: 'github.css',

        more: 'more',

        total: null,

        visible: 5,

        step: 2,

        loadingText: 'Loading...',

        loadingMore: 'Show 2 more repositories...'
    };

     /* end Configuration */


    //private variable
    var badge;

     /* Private methods */

    //init method
    function init() {

       //get object badge
       badge = document.getElementById(config.badgeID);

       //if we have object badge
       if(badge) {

               //get className of badge
               var c = badge.className;

          //if we have trigger class then execute more
          if(c.indexOf(config.triggerGit) !== -1) {

               //get username
               var login = config.loginmatch.exec(c);

                   //get username
                   login = login ? login[1] : config.username;

               //json for repositories
               var repos = "http://github.com/api/v1/json/"+login+"?callback=githubbadge.seed2";                           

               //json for info profile
               var info = "http://github.com/api/v2/json/user/show/"+login+"?callback=githubbadge.seed1";

                   //Add text Loading... into badge while loading
                   document.getElementById(config.profileID).innerHTML = document.getElementById(config.reposID).innerHTML = "Loading...";

                   //ADD LINK NODE
                   if(config.styles) {

                          loadLink(config.styles,function(){

                               if(window.console){ console.log('Loaded Link'); }
                          });
                   };

                   //ADD SCRIPT NODES
                   loadScript(info,function(url){

                        if(window.console) {console.log('Loaded JSON in SCRIPT NODE ' + url);} 

                        loadScript(repos,function(url){

                                 if(window.console) {console.log('Loaded JSON in SCRIPT NODE ' + url);} 

                                 addEventDelegation()
                        });
                   });

           }//endif triggerGit

       }//endif badge

    };//end function

    //function which appends a script into HEAD and load a JSON into SCRIPT NODE, 
    //then function callback is called and JSON loaded 
    //@param url (String) url to perform
    //@callback (Object function) function to callback if all is loaded successfully
    function loadScript(url,callback) {

             //create element 
             var script = document.createElement('script');

                 //set attributes
                 script.setAttribute('type','text/javascript');

                 script.setAttribute('charSet',"utf-8");

                 //if IE
                 if(script.readyState){

                       script.onreadystatechange = function() {

                              if(script.readyState == 'loaded' || script.readyState == 'complete') {

                                       script.onreadystatechange = null;

                                       callback();
                              }
                       };
 
                 //others browsers
                 } else {

                        script.onload = function(){

                             callback(url); 
                        };
                 }

                 //set attribute src
                 script.setAttribute('src',url);

                 //append script
                 document.getElementsByTagName('head')[0].appendChild(script);  

    };//end function


    //callback JSON which contains the JSON object with your profile
    //@param json (JSON Object) object which contains data from git
    function seedProfile(json) {

       //get email
       var email = json.user.email; 

       //get login
       var login = json.user.login;

       //get name
       var name = json.user.name;

       //get location
       var location = json.user.location;

       //hold in variable profile data and putout
       var profile = "<table><tbody>"+

                     "<tr><td rowspan='4'><img src='http://www.gravatar.com/avatar.php?gravatar_id="+MD5(email)+"&s=50 alt='gravatar'/></td></tr>"+

                     "<tr><td>"+login+"</td></tr>"+

                     "<tr><td>"+name+"</td></tr>"+

                     "<tr><td>"+location+"</td></tr>"+

                     "</tbody></table>";

           //display profile            
           document.getElementById(config.profileID).innerHTML = profile;  

    };//end function


    //callback JSON which contains the JSON object with repositories
    //@param json (JSON Object) object which contains data received from github.com API
    function seedContent(json) {

       //get object vector repositories
       var repos = json.user.repositories;

       //initialize output
       var output = '';
 
       //number total of repositories
       var n = repos.length; 
 
       //hold the number of repositories
       config.total = n;

       //loop through each repositories
       for(var i=0;i<config.visible;i++) { 

           //get name
           var name = repos[i].name;

           //get url
           var url = repos[i].url;

           //get description
           var description = repos[i].description;

               output += "<li><h3><img src='http://github.com/images/icons/public.png' alt='' /> " + name + "</h3><ul>" +

                         "<li><a href='"+url+"'>"+description+"</a></li></ul></li>";

       }//endfor
 
        //display repositories in specific zone
        document.getElementById(config.reposID).innerHTML = output; 


        //attach handler object with ID 'more' at type event 'click' then is fired when the element is clicked
        document.getElementById(config.more).onclick = function(e){ 

                 callLazy(function(){handleMore(json)},

                          function(){document.getElementById(config.more).getElementsByTagName('a')[0].innerHTML = config.loadingText;

                                     return true;},100); 

                 cancelClick(e);

        };//end handler function

    };//end function


    //when we click on the element with ID 'more' [object - $('more')] then fires this function
    //@param json (JSON Object) object which contains data for repositories received from github.com through API
    var handleMore = function(json) {

        var repos = json.user.repositories;

            document.getElementById(config.more).getElementsByTagName('a')[0].innerHTML = config.loadingMore;

                 if(config.visible < config.total) {

                         var n = config.visible;

                         config.visible += config.step; 

                         for(var i = n; i < config.visible; i++) {

                             if(repos[i]) {

                                 //grab name
                                 var name = repos[i].name; 

                                 //grab url
                                 var url = repos[i].url;

                                 //grab description
                                 var description = repos[i].description;

                                 var li = document.createElement('li');
 
                                 var h3 = document.createElement('h3');

                                 h3.className = 'x';

                                 var img = document.createElement('img');

                                 img.setAttribute('src','http://github.com/images/icons/public.png');

                                 h3.appendChild(img);

                                 h3.appendChild(document.createTextNode(' '+name));

                                 li.appendChild(h3);

                                 var ul = document.createElement('ul');
 
                                 var li2 = document.createElement('li');
 
                                 var a = document.createElement('a');

                                     a.setAttribute('href',url);

                                     a.appendChild(document.createTextNode(description));     

                                     li2.appendChild(a);
 
                                     ul.appendChild(li2); 

                                     li.appendChild(ul);

                                    document.getElementById(config.reposID).appendChild(li); 

                               }//endif

                         }//end for

                     //add functionality
                     addFunctionality();

                     //if haven't repositories then hidden the show marker
                     if(config.visible >= config.total) {document.getElementById(config.more).style.display = 'none';}

                 }//endif

    }

    //function which append functionality elemens inserted in element UL
    function addFunctionality() {

             var m = document.getElementById(config.reposID);

                 if(m) {

                       //get all elements which have the className 'x'
                       //var headers = m.getElementsByClassName('x');

                       var headers = getElementsByClassName('x',document.getElementById(config.reposID));
               
                           //loop through Headers 3
                           for(var i=0;i<headers.length;i++) {

                                   var content = headers[i].innerHTML;

                                   var but = document.createElement('button');

                                       headers[i].innerHTML = '';

                                       headers[i].appendChild(but);

                                       but.innerHTML = content;       
                           }//endfor


                       var headers3 = getElementsByClassName('x',document.getElementById(config.reposID)); 

                           for(var i=0;i<headers3.length;i++) {

                                      headers3[i].className = '';
                           }
                }//end if

    }//end addFunc

    //add event delegation to the menu
    //@param
    function addEventDelegation() {

             var m = document.getElementById(config.reposID);

                 if(m) {

                       //add selector .js
                       m.className = 'js';

                       //get all h3
                       var headers = m.getElementsByTagName('h3');

                        //add H3 borderTop solid
                        headers[0].style.borderTop = "1px solid #999";

                           //loop through Headers 3
                           for(var i=0;i<headers.length;i++) {

                                   var content = headers[i].innerHTML;

                                   var but = document.createElement('button');

                                       headers[i].innerHTML = '';

                                       headers[i].appendChild(but);

                                       but.innerHTML = content;       

                           }//endfor

                           //if FF    
                           if(window.addEventListener) {

                              m.addEventListener('click',function(e){

                                       var target = e.target;

                                           if(target.nodeName.toLowerCase() === 'button') {

                                                         var mom = target.parentNode.parentNode;

                                                             if(mom.className === 'open') {

                                                                    mom.className = '';

                                                             } else {

                                                                    mom.className = 'open';
                                                             }
                                           }//endif 

                              },true);

                           //if IE
                           } else if(window.attachEvent) {

                              m.attachEvent('onclick',function(e){

                                       var target = window.event.srcElement;

                                           if(target.nodeName.toLowerCase() === 'button') {

                                                         var mom = target.parentNode.parentNode;

                                                             if(mom.className === 'open') {

                                                                    mom.className = '';

                                                             } else {

                                                                    mom.className = 'open';
                                                             }
                                           }//endif 

                              });


                           }//end if-else

                 }//endif m
 
    };//end function

    //function which APPEND an ELEMENT Link into a HEAD tag and load stylesheet for webpage
    //@param url (String) url to call
    //@param callback (String) if the link is loaded then the function 'callback' is called
    //@return true;
    function loadLink(url,callback) {

             //create element
             var link = document.createElement('link');

                 //set attributes
                 link.setAttribute('rel','stylesheet');   


                 //if IE
                 if(link.readyState){

                       link.onreadystatechange = function() {

                              if(link.readyState == 'loaded' || link.readyState == 'complete') {

                                       link.onreadystatechange = null;

                                       callback();
                              }
                       };
 
                 //others browsers
                 } else {

                        link.onload = function(){

                             callback(); 
                        };
                 }


                 link.setAttribute('type','text/css');

                 link.setAttribute('href',url);                 

                 document.getElementsByTagName('head')[0].appendChild(link);

    };//end function

   /* utils functions */

    //prevent default cancel click
    //param e(Object) event click
    var cancelClick = function(e) {

        //if we have IE
        if(window.event) {

             window.event.cancelBubble = true;  

             window.event.returnValue = false;
        }

        //if we have FF
        if(e && e.preventDefault && e.stopPropagation) {

             e.preventDefault();

             e.stopPropagation();
        }
    }//end function cancelClick

    //callLazy function for defer a function
    //param fx (Object Function) function to call defer
    //param isReady (Object Function) function which is executed before first
    //param m (integer) max position in interval
    //param n (integer) n start position
    var callLazy = function(fx,isReady,m,n) {

        var max = (0 < m) ? m : 25;

        var index = (0 < n) ? n : 0;

        if(index > max) {return;}

        if(fx) {

               if(isReady()) {

                       setTimeout(function(){fx()},500);

               } else {

                       setTimeout(function(){callLazy.call(this,fx,isReady,max,index+1);},100);

               } //end if-else

        }//end if

    }//end function callLazy

    //private function 
    //@param searchClass (String) className's Element for search
    //@param node (String) node search
    //@param tag (String) tag search
    //@return arr (Object Array) return an array with elements pattern in class
    function getElementsByClassName(searchClass,node,tag) {

            var arr = [],k = 0;

            var pattern = new RegExp('(^|\\\s+)'+ searchClass +'(\\\s+|$)');

            if(node == null) {node = document;} 

            if(tag == null) {tag = "*";}

            var elems = node.getElementsByTagName(tag);

            for(var i=0;i<elems.length;i++) {
                    
                    if(pattern.test(elems[i].className)) {
 
                           arr[k++] = elems[i];  

                    }//endif
            }//end for

       return arr; 
    }
     
    //public methods
    return {init: init,seed1: seedProfile,seed2: seedContent};

}();//do EXEC

//initialize
githubbadge.init();

//334 lines