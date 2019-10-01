const noop = function () {};

const asyncSuccess = ({onComplete = noop, onSuccess = noop} = {}) => {
	// Async-invoke a onSuccess callback
	setTimeout(() => {
		onSuccess();
		onComplete();
	}, 1);
	return {cancel: noop};
};

const mock = action => ({onComplete = noop, onSuccess = noop, subscribe = false} = {}) => {
	let id, cancelled = false;
	action().then(res => {
		if (cancelled) return;
		setTimeout(() => {
			if (subscribe) {
				id = setInterval(() => {
					onSuccess(res);
					onComplete(res);
				}, Math.random() * 5000 + 2000);
			}
			onSuccess(res);
			onComplete(res);
		}, 20);
	});

	return {
		cancel: () => {
			if (id) clearInterval(id);
			cancelled = true;
		}
	};
};

// Copy all mock app assets to a root output ./mockapps directory
require.context(
	'!file-loader?name=mockapps/[folder]/[name].[ext]!./mockdata/assets',
	true,
	/\.png$/
);

const MockProvider = {
	// Launch Point
	addLaunchPoint: mock(() => import('./mockdata/addLaunchPoint.json')),
	moveLaunchPoint: asyncSuccess,
	updateLaunchPoint: asyncSuccess,
	removeLaunchPoint: asyncSuccess,
	listLaunchPoints: mock(() => import('./mockdata/listLaunchPoints.json')), // subscribable

	// Application
	listApps: mock(() => import('./mockdata/listApps.json')), // subscribable
	running: mock(() => import('./mockdata/running.json')), // subscribable,
	getForegroundAppInfo: mock(() => import('./mockdata/getForegroundAppInfo.json')),  // subscribable
	setOrder: asyncSuccess,

	// Application Handling
	launch: asyncSuccess,
	pause: asyncSuccess,
	close: asyncSuccess,
	closeByAppId: asyncSuccess,

	// Application Specific
	getAppInfo: mock(() => import('./mockdata/getAppInfo.json')),
	getAppLifeStatus: mock(() => import('./mockdata/getAppLifeStatus.json')),  // subscribable
	getAppLifeEvents: mock(() => import('./mockdata/getAppLifeEvents.json')), // subscribable
	getAppStatus: mock(() => import('./mockdata/getAppStatus.json'))
};

export default MockProvider;
export {MockProvider};
