## Creating Client-Side badges

We'll use JavaScript to display badges through the GitHub API v3, interface through which github allows its data to be queries and manipulated and we'll transfer the informations from github to JSON a lightweight format for transmitting text data based on REST

   //get repos from user
   var repos = "https://api.github.com/users/"+login+"/repos?sort=created&callback=githubbadge.seed2"
 
   //get profile from user
   var info = "https://api.github.com/users/thinkphp?callback=githubbadge.seed1"
