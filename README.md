# Custom URL Redirector for G Suite

G Suite doesn't support Custom URL's that require SSL. HSTS domains will not work as Custom URL's and so this is your solution until Google pulls their finger out.

## Getting Started

It is beyond the scope of this script to pull all the parts you need in place together to make this work. It's designed to operate on Google App Engine.

### Prerequisites

A Billing Enabled App Engine Project, Understanding of Domain Aliasing in App Engine, Understanding of SSL in App Engine, gcloud SDK tools installed locally

You must not have the subdomains you wish to use [configured in G Suite](https://admin.google.com/AdminHome?fral=1#CompanyProfile:flyout=customUrl) or they will catch fire.

### Installing

Once you have the code locally - you don't need to npm install anything - Google does that inside App Engine. If you are using HSTS - you will need to set the appropriate flag in the app.js file.

Get the project

```
git clone git@github.com:aicial/gsuite-redirector.git
```

Deploy it to Google Cloud App Engine

```
npm run deploy
```

Then connect the relevant [custom domains](https://console.cloud.google.com/appengine/settings/domains) - I'd suggest

```
mail.yourdomain.com
calendar.yourdomain.com
drive.yourdomain.com
sites.yourdomain.com
groups.yourdomain.com
```

Then configure your wildcard (or five unique certificates) [custom ssl](https://console.cloud.google.com/appengine/settings/certificates)

## HSTS

DO NOT set the HSTS flag unless you know the implications. It can break your entire domain (and every subdomain) for web traffic.

```
var useHSTS = true;   // May open a black hole
```

## Authors

* **Troy Kelly** - *Initial work* - [Really Really, Inc.](https://reallyreally.io)

See also the list of [contributors](https://github.com/aicial/gsuite-redirector/contributors) who participated in this project.

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to Google for not taking SSL seriously (but pretending they do)
