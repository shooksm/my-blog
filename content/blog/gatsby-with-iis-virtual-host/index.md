---
title: Gatsby with an IIS Virtual Host
date: "2018-07-18T22:23:00.176Z"
---

For the most part, Gatsby has been easy to setup and use but did I had some trouble with all the `/static/` assets returning back 404 errors after posting to my host.

Previously I had used WordPress which implements a [Front Controller](https://en.wikipedia.org/wiki/Front_controller) pattern passing all traffic through the root index.php file. I removed the IIS rule rewriting all requests to index.php file. This should have let all the other requests pass through directly to the files but I would get 404 errors on every file not directly served from root of the virtual host. After troubleshooting different rewrite rules I finally got a hit on 404 errors in IIS happening because there were no mime types mapped. Since this was setup as a virtual host, I assume the parent host's mime types are not getting transferred down. I added a web.config at the root of the Gatsby site with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".css" mimeType="text/css" />
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".rss" mimeType="application/rss+xml; charset=UTF-8" />
      <mimeMap fileExtension=".html" mimeType="text/html; charset=UTF-8" />
      <mimeMap fileExtension=".xml" mimeType="application/xml; charset=UTF-8" />
      <!-- other common web mime types like images and fonts... -->
    </staticContent>
  </system.webServer>
</configuration>
```

This cleared up the 404 errors on the site. Hope this helps someone in the future.

**Additional Note:** I had found several lists of common web mime types online. They were pretty good lists but in some cases were missing newer file extensions like WOFF2 so double check to make sure you have all files represented with matching mime types.
