export default ({launcher} = {}) => ({
	// Major sections of the app (launcher, widgets, control buttons, etc)
	launcher: {
		launchPoints: []
	},
	// General/Global app settings (view management, general app state, etc)
	app: {
		removeTargetAppInfo: {},
		launcherShowing: (launcher === 'open'),
		overlays: {
			bluetooth: false,
			displaySharing: false,
			remove: false,
			profiles: false
		}
	}
});
