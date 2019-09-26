import LS2Request from '@enact/webos/LS2Request';

const fwd = res => res;

const handler = (callback, map = fwd) => callback && (res => {
	if ((res.errorCode || res.returnValue === false)) {
		const err = new Error(res.errorText);
		err.code = res.errorCode;
		callback(err);
	} else {
		callback(map(res));
	}
});

const luna = (
		method,
		{subscribe = false, timeout = 0, ...params} = {},
		map
	) => (
	({onSuccess, onFailure, onTimeout, onComplete, ...additionalParams} = {}) => {
		const req = new LS2Request();
		req.send({
			service: 'luna://com.webos.service.applicationmanager',
			method,
			parameters: Object.assign({}, params, additionalParams),
			onSuccess: handler(onSuccess, map),
			onFailure: handler(onFailure),
			onTimeout: handler(onTimeout),
			onComplete: handler(onComplete, map),
			subscribe,
			timeout
		});
		return req;
	}
);

// For full spec and accepted options, see:
// https://wiki.lgsvl.com/display/webOSDocs/com.webos.service.applicationmanager+v4.1
const LunaProvider = {
	// Launch Point
	addLaunchPoint: luna('addLaunchPoint'),
	moveLaunchPoint: luna('moveLaunchPoint'),
	updateLaunchPoint: luna('updateLaunchPoint'),
	removeLaunchPoint: luna('removeLaunchPoint'),
	listLaunchPoints: luna('listLaunchPoints'), // subscribable

	// Application
	listApps: luna('listApps'), // subscribable
	running: luna('running'), // subscribable,
	getForegroundAppInfo: luna('getForegroundAppInfo'),  // subscribable
	setOrder: luna('setOrder'),

	// Application Handling
	launch: luna('launch'),
	pause: luna('pause'),
	close: luna('close'),
	closeByAppId: luna('closeByAppId'),

	// Application Specific
	getAppInfo: luna('getAppInfo'),
	getAppLifeStatus: luna('getAppLifeStatus'),  // subscribable
	getAppLifeEvents: luna('getAppLifeEvents'), // subscribable
	getAppStatus: luna('getAppStatus') // subscribable
};

export default LunaProvider;
export {LunaProvider};
