/* eslint-disable no-undefined */

import curry from 'ramda/src/curry';

// a `findIndex` function to find a launch point in the state by id
const findLaunchPointById = (lpId) => ({launchPointId}) => (launchPointId === lpId);

// Generic state getters/setters

const getLauncherState = curry((name, state) => state.launcher[name]);
const setLauncherState = curry((name, value, state) => {
	state.launcher[name] = value;
});

// Specialized state retrieval functions

const getApps = getLauncherState('apps');
const getForegroundAppInfo = getLauncherState('foregroundAppInfo');
const getLaunchPoints = getLauncherState('launchPoints');
const getRunningApps = getLauncherState('runningApps');
const getAppStoreApps =  getLauncherState('appStoreApps');

// Specialized state update functions

const setLaunchPoints = setLauncherState('launchPoints');
const addLaunchPoints = curry((entries, state) => {
	const current = getLaunchPoints(state);
	setLaunchPoints([...current, ...entries], state);
});
const clearLaunchPoints = setLaunchPoints([]);
const removeLaunchPoint = curry((entry, state) => {
	const current = getLaunchPoints(state);
	current.splice(current.findIndex(findLaunchPointById(entry.launchPointId)), 1);
	setLaunchPoints(current, state);
});
const updateLaunchPoint = curry((entry, state) => {
	const current = getLaunchPoints(state);
	const index = current.findIndex(findLaunchPointById(entry.launchPointId));
	current[index] = entry;
	setLaunchPoints(current, state);
});

const setApps = setLauncherState('apps');
const setForegroundAppInfo = setLauncherState('foregroundAppInfo');
const setRunningApps = setLauncherState('runningApps');
const setAppStoreApps = curry((appInfo, state) => {
	state.launcher.appStoreApps[appInfo.id] = appInfo;
});

export {
	addLaunchPoints,
	clearLaunchPoints,
	getApps,
	getForegroundAppInfo,
	getLaunchPoints,
	getRunningApps,
	getAppStoreApps,
	removeLaunchPoint,
	setApps,
	setForegroundAppInfo,
	setLaunchPoints,
	setRunningApps,
	setAppStoreApps,
	updateLaunchPoint
};
