/* eslint-disable no-undefined */

import curry from 'ramda/src/curry';

// Generic state getters/setters

const getAppState = curry((name, state) => state.app[name]);
const setAppState = curry((name, value, state) => {
	state.app[name] = value;
});

const getOverlayState = curry((name, state) => state.app.overlays[name]);
const setOverlayState = curry((name, value, state) => {
	state.app.overlays[name] = value;
});

// Specialized state retrieval functtions

const getLauncherShowing = getAppState('launcherShowing');
const getOverlayBluetooth = getOverlayState('bluetooth');
const getOverlayDisplaySharing = getOverlayState('displaySharing');
const getOverlayProfiles = getOverlayState('profiles');
const getOverlayInstall = getOverlayState('install');
const getOverlayRemove = getOverlayState('remove');
const getInstallTargetAppId = getAppState('installTargetAppId');
const getRemoveTargetAppInfo = getAppState('removeTargetAppInfo');

// Specialized state update functions

const enableLauncherShowing = setAppState('launcherShowing', true);
const disableLauncherShowing = setAppState('launcherShowing', false);
const toggleLauncherShowing = state => {
	setAppState('launcherShowing', !getLauncherShowing(state), state);
};

const enableOverlayBluetooth = setOverlayState('bluetooth', true);
const enableOverlayDisplaySharing = setOverlayState('displaySharing', true);
const enableOverlayProfiles = setOverlayState('profiles', true);
const enableOverlayInstall = setOverlayState('install', true);
const enableOverlayRemove = setOverlayState('remove', true);

const setInstallTargetAppId = setAppState('installTargetAppId');
const setRemoveTargetAppInfo = setAppState('removeTargetAppInfo');

const disableAllOverlays = state => {
	const overlays = getAppState('overlays', state);
	for (const o in overlays) {
		if (overlays[o]) {
			overlays[o] = false;
			// console.log('setOverlayState', o, false);
		}
	}
};

export {
	getLauncherShowing,
	getOverlayBluetooth,
	getOverlayDisplaySharing,
	getOverlayProfiles,
	getOverlayInstall,
	getOverlayRemove,
	getInstallTargetAppId,
	getRemoveTargetAppInfo,
	enableLauncherShowing,
	disableLauncherShowing,
	toggleLauncherShowing,
	enableOverlayBluetooth,
	enableOverlayDisplaySharing,
	enableOverlayProfiles,
	setInstallTargetAppId,
	setRemoveTargetAppInfo,
	setAppState,
	getAppState,
	enableOverlayInstall,
	enableOverlayRemove,
	disableAllOverlays
};
