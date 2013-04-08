  (function(){

      //get gitbadge object
      var x = document.getElementById('gitbadge');

      //set triggergit as classname
      var triggergit = "toGit"; 

      //set pattern to retrieve the username
      var pattern = /\s?login-([^\s]+)/;

      //set matt as init username
      var initlogin = 'mattt';

          //if we have gitbadge then do it
          if(x) {

                //get classname
                var c = x.className; 

                //if classname contains triggergit then do it
                if(c.indexOf(triggergit) !== -1) {

                     //get login from match
                     var login = pattern.exec(c);

                         login = login ? login[1] : initlogin;

                //otherwise set initlogin as a username
                } else {
      
                  login = initlogin;  
                }        

          //otherwise set initlogin as a username
          }  else {

             login = initlogin;
          }

      //this function add events to the ul projects
      var addDesign = function() {

          //get HTML div
          var m = document.getElementById('git');

              //if element exists then do it
              if(m) {

                    //class to add to apply design/functionality
                    m.className = 'js';

                    //get all h3 
                    var headers = m.getElementsByTagName('h3');

                        //put first h3 borderTop solid
                        headers[0].style.borderTop = "1px solid #999";

                        //loop through headers and append a button with innerHTML h3
                        for(var i=0;headers[i];i++) {

                                var content = headers[i].innerHTML;

                                var but = document.createElement('button');

                                    headers[i].innerHTML = '';

                                    headers[i].appendChild(but);

                                    but.innerHTML = content;  
                        }

                        //Add events to the buttons using model event delegation

                        //if we have mozilla firefox
                        if(window.addEventListener) {                             
                              m.addEventListener('click',function(e){
                           
                                 var target = e.target;

                                     if(target.nodeName.toLowerCase() === 'button') {

                                                   var mom = target.parentNode.parentNode;

                                                      if(mom.className === 'open') {

                                                             mom.className = '';  

                                                      } else {

                                                             mom.className = 'open';

                                                      }//endifelse
                                     }//endif

                              },true);
 
                           //otherwise we have IE
                           } else if(window.attachEvent) {

                              m.attachEvent('onclick',function(e){
                           
                                 var target = window.event.srcElement

                                     if(target.nodeName.toLowerCase() === 'button') {

                                                   var mom = target.parentNode.parentNode;

                                                      if(mom.className === 'open') {

                                                             mom.className = '';  

                                                      } else {

                                                             mom.className = 'open';

                                                      }//endifelse
                                     }//endif

                              });
       
                           }//end if-else                      
     
              }//end if exists

          };//end function addDesign

          //configuration
          var config = {'debug' : true};

          //format HTML
          var format = '<li><h3><img src="http://github.com/images/icons/public.png" alt="" /> {name}</h3><ul><li><a href="{url}">{description}</a></li></ul></li>';

          //query YQL
          var yqlQuery = 'select * from github.user.repos where id="'+ login +'"';

          //element to insert
          var insertEl = 'git';

          //format HTML to display
          var format2 = '<table><tbody><tr><td rowspan="4"><img src="http://www.gravatar.com/avatar.php?gravatar_id={email}&s=50" alt="gravatar"/></td></tr><tr><td>{login}</td></tr><tr><td>{name}</td></tr><tr><td>{location}</td></tr></tbody></table>';

          //query YQL
          var yqlQuery2 = 'select * from github.user.info where id="'+ login +'"';

          //element to insert
          var insertEl2 = 'gitprofile';

              //push into stack
              yqlWidget.push(yqlQuery,config,format,insertEl,'repositories.repository',addDesign);

              //push into stack
              yqlWidget.push(yqlQuery2,config,format2,insertEl2);

              //pop stack
              yqlWidget.render();

              //add element LINK to the document
              THINKPHP.util.Get.css('gitHub.css',{onSuccess: function(resp){if(config['debug'] && window.console){console.log('GET request Link: '+ resp.msg);} },onFailure: function(o){if(window.console){console.log(o.msg);}},scope: this});
   })();
