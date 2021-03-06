<?php

$url = "https://api.github.com/users/thinkphp/repos?sort=created";

$output = get($url);

$data = json_decode($output);

$repos = $data;

$output = '';

foreach($repos as $name) {
     $repo_name = $name->name;
     $repo_url = $name->url;
     $repo_desc = $name->description;
     $output .= "<a href='$repo_url' title='$repo_desc'>$repo_name</a>  ";
}


function get($url) {

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSLVERSION,3);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2); 
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT,2);

    $data = curl_exec($ch);

    curl_close($ch); 

    if(empty($data)) {return 'server timeout';}
                 else {return $data;}
}
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
   <title>My Projects on GitHub</title>
<!--
   <link rel="stylesheet" href="http://yui.yahooapis.com/2.8.0r4/build/reset-fonts-grids/reset-fonts-grids.css" type="text/css">
   <link rel="stylesheet" href="http://yui.yahooapis.com/2.7.0/build/base/base.css" type="text/css">
-->
   <style type="text/css">   
            html,body{font-family: verdana,sans-serif,georgia}
            h1{font-size: 45px;}
            h1 a {color: #393}
            .cpojer-links{ font-size:24px; }
  	.cpojer-links a	{
			display: inline-block;
			padding: 4px;
			outline: 0;
			color: #393;
			-webkit-transition-duration: 0.25s;
			-moz-transition-duration: 0.25s;
			-o-transition-duration: 0.25s;
			transition-duration: 0.25s;
			-webkit-transition-property: -webkit-transform;
			-moz-transition-property: -moz-transform;
			-o-transition-property: -o-transform;
			transition-property: transform;
			-webkit-transform: scale(1) rotate(0);
			-moz-transform: scale(1) rotate(0);
			-o-transform: scale(1) rotate(0);
			transform: scale(1) rotate(0);
		}
		.cpojer-links a:hover {
			background: #393;
			text-decoration: none;
			color: #fff;
			-webkit-border-radius: 4px;
			-moz-border-radius: 4px;
			-o-border-radius: 4px;
			border-radius: 4px;
			-webkit-transform: scale(1.05) rotate(-1deg);
			-moz-transform: scale(1.05) rotate(-1deg);
			-o-transform: scale(1.05) rotate(-1deg);
			transform: scale(1.05) rotate(-1deg);
		}
		.cpojer-links a:nth-child(2n):hover {
		  -webkit-transform: scale(1.05) rotate(1deg);
		  -moz-transform: scale(1.05) rotate(1deg);
		  -o-transform: scale(1.05) rotate(1deg);
		  transform: scale(1.05) rotate(1deg);
		}

  #ft{margin-top: 40px;}
  #ft p a{color: #393}
   </style>
</head>
<body>
<div id="doc2" class="yui-t7">
   <div id="hd" role="banner"><h1>My Projects on <a href="http://thinkphp.github.com">GitHub</a><img src="http://thinkphp.ro/images/github-logo.png"></h1></div>
   <div id="bd" role="main">
	<div class="cpojer-links">
            <?php echo$output; ?>
            <a title="more..." href="https://github.com/thinkphp/">more...</a> 
	</div>
	</div>
   <div id="ft" role="contentinfo"><p>follow @<a href="http://twitter.com/thinkphp">thinkphp</a> on Twitter</p></div>
</div>
</body>
</html>
