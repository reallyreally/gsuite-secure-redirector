# Custom URL Redirector for G Suite

G Suite doesn't support Custom URL's that require SSL. HSTS domains will not work as Custom URL's and so this is your solution until Google pulls their finger out.

## Getting Started

It is beyond the scope of this script to pull all the parts you need in place together to make this work. It's designed to operate on Google App Engine.

### Prerequisites

**If using App Engine**: A Billing Enabled App Engine Project, Understanding of Domain Aliasing in App Engine, Understanding of SSL in App Engine, gcloud SDK tools installed locally

**If using Docker**: It's easy to run this inside docker (using [PM2](https://keymetrics.io/pm2/)) - you will need [Nginx](https://nginx.org/en/) (or something else) to handle connectivity.

You **must not** have the subdomains you wish to use [configured in G Suite](https://admin.google.com/AdminHome?fral=1#CompanyProfile:flyout=customUrl) or they will catch fire.

### Installing (App Engine)

Once you have the code locally - you don't need to npm install anything - Google does that inside App Engine. If you are using HSTS - you will need to set the appropriate flag in the app.js file.

Get the project

```
git clone https://github.com/reallyreally/gsuite-secure-redirector.git
```

Deploy it to Google Cloud App Engine

```
npm run deploy
```

Then connect the relevant [custom domains](https://console.cloud.google.com/appengine/settings/domains) - we suggest

```
mail.example.com
calendar.example.com
drive.example.com
sites.example.com
groups.example.com
```

Then configure your wildcard (or five unique certificates) [custom ssl](https://console.cloud.google.com/appengine/settings/certificates)

If you don't want to use the above - the redirector also supports
```
webmail.example.com
email.example.com
cal.example.com
calender.example.com
schedule.example.com
webcal.example.com
docs.example.com
files.example.com
```

### Installing (Docker)

This will not work stand-alone with Docker, you will need an nginx front end the handle the SSL connection.

**Starting the Container**
```
docker run -d -p 8080:8080 -e REPO="https://github.com/reallyreally/gsuite-secure-redirector.git" -e TRUST_PROXY="1" -e PORT=8080 --name gsuite-redirector really/node-pm2-git ./pm2.json
```

**Nginx**
Example config `/etc/nginx/conf.d/gsuite_redirector.conf`
```
server {
# The IP that you forwarded in your router (nginx proxy)
  listen       80;
  listen       [::]:80;

# Define the services to answer - you still need to configure DNS to point here
 server_name calendar.example.com;
 server_name cal.example.com;
 server_name drive.example.com;
 server_name groups.example.com;
 server_name mail.example.com;
 server_name sites.example.com;


# The internal IP of the VM that hosts your Apache config
 resolver 8.8.8.8 8.8.4.4 valid=300s;
 resolver_timeout 5s;
 set $upstream "http://localhost:8080";

 location / {

 proxy_pass_header Authorization;
 proxy_pass $upstream;
 proxy_set_header Host $host;
 proxy_set_header X-Real-IP $remote_addr;
 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 proxy_set_header X-Forwarded-Proto $scheme;
 proxy_http_version 1.1;
 proxy_set_header Connection "";
 proxy_buffering off;
 client_max_body_size 0;
 proxy_read_timeout 36000s;
 proxy_redirect off;

 }

    listen [::]:443;
    listen 443 ssl; # managed by Certbot
ssl_certificate /etc/letsencrypt/live/gsuite.example.com/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/gsuite.example.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot

    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    } # managed by Certbot

}
```

## HSTS

DO NOT set the [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) flag unless you know the implications. It can break your entire domain (and every subdomain) for web traffic with modern browsers.

To enable HSTS you need to enable the environment variable. If using App Engine (`app.yaml`):
```
env_variables:
  TRUST_PROXY: '1'
  USE_HSTS: '1'
```

If using Docker add the environment variable at run time `-e USE_HSTS=1`

## Authors

* **Troy Kelly** - *Initial work* - [Really Really, Inc.](https://really.ai)

See also the list of [contributors](https://github.com/reallyreally/gsuite-secure-redirector/graphs/contributors) who participated in this project.

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to Google for not taking SSL seriously (but pretending they do)
