# Home Launcher for webOS Auto
The home screen and application launch-point manager gives the user access to run their apps and have basic controls over them.

This app is based on the EnactJS theme [Agate](https://github.com/enactjs/agate) and requires the [Enact CLI](https://github.com/enactjs/cli) tool to be installed, along with NodeJS and NPM.

## Installation
Generally, the app should be easy to run, once the related repos are cloned and linked.
The process should be as follows:

* Install enact/cli globally: `npm install -g @enact/cli`
* Clone Agate: `git clone https://github.com/enactjs/agate.git`
 * Switch to the new agate directory: `cd agate`
 * Link it: `npm link`
 * Return to the previous directory: `cd ..`
* Clone this repo `https://github.com/enyojs/webos-auto-home.git`
 * Switch to the new "webos-auto-home" directory: `cd webos-auto-home`
 * Install Home: `npm install`
 * Link Agate: `npm link @enact/agate`
* Serve the app: `npm run serve`

## Data Services
This app comes with a basic set of mock data which can be used if LUNA services are not available, like when testing on a development machine rather than the target hardware and platform.

To toggle between mock data and live luna services, edit the `.env` file at the root of this repo.

**Mock Data Mode**

```sh
MOCK_PROVIDER=Mock
LUNA_PROVIDER=Luna

REACT_APP_SERVICE_PROVIDER=$MOCK_PROVIDER
```

**Luna Live Data Mode**

```sh
MOCK_PROVIDER=Mock
LUNA_PROVIDER=Luna

REACT_APP_SERVICE_PROVIDER=$LUNA_PROVIDER
```
