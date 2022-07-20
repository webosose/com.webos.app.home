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
		service,
		method,
		{subscribe = false, timeout = 0, ...params} = {},
		map
) => (
	({onSuccess, onFailure, onTimeout, onComplete, ...additionalParams} = {}) => {
		const req = new LS2Request();
		req.send({
			service: 'luna://' + service,
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

const LunaProvider = {
	removeApp: luna('com.webos.appInstallService', 'remove'),
	// Launch Point
	addLaunchPoint: luna('com.webos.service.applicationmanager', 'addLaunchPoint'),
	moveLaunchPoint: luna('com.webos.service.applicationmanager', 'moveLaunchPoint'),
	updateLaunchPoint: luna('com.webos.service.applicationmanager', 'updateLaunchPoint'),
	removeLaunchPoint: luna('com.webos.service.applicationmanager', 'removeLaunchPoint'),
	listLaunchPoints: luna('com.webos.service.applicationmanager', 'listLaunchPoints'), // subscribable

	// Application
	listApps: luna('com.webos.service.applicationmanager', 'listApps'), // subscribable
	running: luna('com.webos.service.applicationmanager', 'running'), // subscribable,
	getForegroundAppInfo: luna('com.webos.service.applicationmanager', 'getForegroundAppInfo'),  // subscribable
	setOrder: luna('com.webos.service.applicationmanager', 'setOrder'),

	// Application Handling
	launch: luna('com.webos.service.applicationmanager', 'launch'),
	pause: luna('com.webos.service.applicationmanager', 'pause'),
	close: luna('com.webos.service.applicationmanager', 'close'),
	closeByAppId: luna('com.webos.service.applicationmanager', 'closeByAppId'),

	// Application Specific
	getAppInfo: luna('com.webos.service.applicationmanager', 'getAppInfo'),
	getAppLifeStatus: luna('com.webos.service.applicationmanager', 'getAppLifeStatus'),  // subscribable
	getAppLifeEvents: luna('com.webos.service.applicationmanager', 'getAppLifeEvents'), // subscribable
	getAppStatus: luna('com.webos.service.applicationmanager', 'getAppStatus'), // subscribable

	//DB specific
	putKind: luna('com.webos.service.db', 'putKind'),
	put: luna('com.webos.service.db', 'put'),
	merge: luna('com.webos.service.db', 'merge'),
	find: luna('com.webos.service.db', 'find'),
};

export default LunaProvider;
export {LunaProvider};
