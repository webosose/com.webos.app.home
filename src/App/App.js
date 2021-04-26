import {adaptEvent, forward, handle} from '@enact/core/handle';
import AgateDecorator from '@enact/agate/AgateDecorator';
import compose from 'ramda/src/compose';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import platform from '@enact/core/platform';
import PopupMenu from '@enact/agate/PopupMenu';
import Button from '@enact/agate/Button';
import PropTypes from 'prop-types';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import React from 'react';
import Transition from '@enact/ui/Transition';

import service from '../service';
import Controls from '../views/Controls';
import Launcher from '../views/Launcher';
import {getQueryStringParams} from '../components/util';
import RemovePopupMenu from '../components/RemovePopupMenu';
import {
	addLaunchPoints,
	removeLaunchPoint,
	updateLaunchPoint
} from '../state/launcher';

import initialState from './initialState';

import css from './App.module.less';

// Set all keys in a given object to a new value
const setAllKeys = (obj, newValue) => {
	for (const k in obj) {
		obj[k] = newValue;
	}
};

const appIds = {
	settings: 'com.palm.app.settings'
};

let displayAffinity = 0;

const DoAfterTransition = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'DoAfterTransition';
		constructor (props) {
			super(props);
			this.state = {
				shown: false
			};
		}

		handleShow = () => this.setState({shown: true});
		handleHide = () => {
			this.setState({shown: false});
			if (typeof window !== 'undefined') {
				window.close();
			}
		};

		render () {
			return (
				<Wrapped
					onShow={this.handleShow}
					onHide={this.handleHide}
					animationReady={this.state.shown}
					{...this.props}
				/>
			);
		}
	};
});

const AnimationReadyLauncher = ({animationReady, onLaunchApp, spotlightDisabled, ...rest}) => (
	<Transition css={css} direction="down" className={css.launcherTransition} {...rest}>
		<Launcher onLaunchApp={onLaunchApp} spotlightDisabled={spotlightDisabled} ready={animationReady} />
	</Transition>
);

AnimationReadyLauncher.propTypes = {
	animationReady: PropTypes.bool,
	onLaunchApp: PropTypes.func,
	spotlightDisabled: PropTypes.bool
};


const AnimatedLauncher = DoAfterTransition(AnimationReadyLauncher);

const AppBase = kind({
	name: 'App',

	propTypes: {
		bluetoothShowing: PropTypes.bool,
		displaySharingShowing: PropTypes.bool,
		launcherShowing: PropTypes.bool,
		onActivateBluetooth: PropTypes.func,
		onActivateDisplaySharing: PropTypes.func,
		onActivateLauncher: PropTypes.func,
		onActivateProfiles: PropTypes.func,
		onHideEverything: PropTypes.func,
		onHidePopups: PropTypes.func,
		onLaunchApp: PropTypes.func,
		onLaunchSettings: PropTypes.func,
		onNavigate: PropTypes.func,
		profilesShowing: PropTypes.bool,
		removeShowing: PropTypes.bool,
		removeTargetAppInfo: PropTypes.object
	},

	styles: {
		css,
		className: 'app'
	},

	handlers: {
		onLaunchApp: handle(
			forward('onHideEverything'),
			forward('onLaunchApp')
		),
		onLaunchSettings: handle(
			adaptEvent(
				() => ({appid: appIds.settings}),
				forward('onLaunchApp')
			)
		)
	},

	computed: {
		// If this is running on webOS, remove the background, so this becomes an overlay app
		className: ({styler}) => styler.append({withBackground: !platform.webos})
	},

	render: ({
		bluetoothShowing,
		displaySharingShowing,
		launcherShowing,
		onActivateBluetooth,
		onActivateDisplaySharing,
		onActivateProfiles,
		onHideEverything,
		onHidePopups,
		onLaunchApp,
		onLaunchSettings,
		profilesShowing,
		removeShowing,
		removeTargetAppInfo,
		...rest
	}) => {
		delete rest.onActivateLauncher;
		delete rest.onNavigate;
		return (
			<div {...rest}>
				<Transition type="fade" visible={launcherShowing}>
					<div className={css.basement} onClick={onHideEverything} />
				</Transition>
				{/* DEV NOTE: Retaining for example purposes */}
				{/* <Button onClick={onActivateLauncher} selected={!launcherShowing} style={{position: 'absolute', bottom: ri.unit(ri.scale(12), 'rem'), display: (launcherShowing ? 'none' : 'block')}}>Open Launcher</Button> */}
				<Transition direction="up" visible={launcherShowing}>
					<Controls className={css.controls}>
						<buttons>
							<Button size="large" backgroundOpacity="lightOpaque" animateOnRender animationDelay={100} icon="notification" />
							<Button size="large" backgroundOpacity="lightOpaque" animateOnRender animationDelay={220} selected={profilesShowing} onClick={onActivateProfiles} icon="user" />
							<Button size="large" backgroundOpacity="lightOpaque" animateOnRender animationDelay={320} selected={bluetoothShowing} onClick={onActivateBluetooth} icon="bluetooth" />
							<Button size="large" backgroundOpacity="lightOpaque" animateOnRender animationDelay={440} selected={displaySharingShowing} onClick={onActivateDisplaySharing} icon="pairing" />
							<Button size="large" backgroundOpacity="lightOpaque" animateOnRender animationDelay={500} onClick={onLaunchSettings} icon="setting" />
						</buttons>
					</Controls>
				</Transition>

				<AnimatedLauncher visible={launcherShowing} spotlightDisabled={!launcherShowing} onLaunchApp={onLaunchApp} />
				<PopupMenu skinVariants="night" open={profilesShowing} title="Profiles">
					<Button size="huge" backgroundOpacity="lightOpaque" icon="profileA1" />
					<Button size="huge" backgroundOpacity="lightOpaque" icon="profileA2" />
					<Button size="huge" backgroundOpacity="lightOpaque" icon="profileA3" />
					<Button size="huge" backgroundOpacity="lightOpaque" icon="profileA4" />
					<Button size="huge" backgroundOpacity="lightOpaque" icon="cancel" onClick={onHidePopups} />
				</PopupMenu>
				<RemovePopupMenu open={removeShowing} onClose={onHidePopups} targetInfo={removeTargetAppInfo} />
			</div>
		);
	}
});

const AppDecorator = compose(
	AgateDecorator({overlay: true}),
	ProviderDecorator({
		state: initialState(getQueryStringParams())
	}),
	ConsumerDecorator({
		mount: (props, {update}) => {
			// console.log('mount');
			setTimeout(() => {
				update(state => {
					state.app.launcherShowing = true;
				});
			}, 0);

			// add a key handler to toggle launcher
			const onKeyUp = ({keyCode}) => {
				if (keyCode === 48) { // 0
					update(state => {
						state.app.launcherShowing = !state.app.launcherShowing;
					});
				}
				return true;
			};

			document.addEventListener('keyup', onKeyUp);
			document.addEventListener('webOSRelaunch', () => {
				update(state => {
					state.app.launcherShowing = true;
				});
			});
			document.addEventListener('webOSLocaleChange', () => {
				window.location.reload();
			});
			// Simulate a slow luna call
			// Remove the setTimeout to run at normal speed
			let serviceConnected = false;

			let listLaunchPoints = () => {
				if (serviceConnected) return;

				service.listLaunchPoints({
					subscribe: true,
					onSuccess: (res) => {
						// console.log('listLaunchPoints response', res);
						serviceConnected = true;
						if (res.launchPoints) {
							// console.log('displayAffinity : ', displayAffinity);
							update(state => {
								state.launcher.launchPoints = res.launchPoints; // .filter(i => appGroupList[displayAffinity].indexOf(i.id) >= 0);
							});
						} else if (res.launchPoint) {
							let updateInfo = res.launchPoint;
							let changeInfo = res.change;
							if (changeInfo === 'removed') {
								update(removeLaunchPoint(updateInfo));
							} else if (changeInfo === 'added') {
								update(addLaunchPoints([updateInfo]));
							} else {
								update(updateLaunchPoint(updateInfo));
							}
						}
					},
					onFailure: () => {
						// console.log('onFailure');
						serviceConnected = false;
					}
				});
				// var start = new Date().getTime();
				// while (new Date().getTime() < start + 2000);
				// console.log('time:', start);
			};
			setTimeout(listLaunchPoints, 300);
			setInterval(listLaunchPoints, 3000);

			// On unmount, run this returned method
			return () => {
				document.removeEventListener('keyup', onKeyUp);

				update(state => {
					state.launcher.launchPoints = [];
				});
			};
		},
		handlers: {
			onHideEverything: (ev, props, {update}) => {
				update(state => {
					state.app.launcherShowing = false;
					setAllKeys(state.app.overlays, false);
				});
				return true;
			},
			onHidePopups: (ev, props, {update}) => {
				update(state => {
					setAllKeys(state.app.overlays, false);
				});
			},
			onActivateLauncher: (ev, props, {update}) => {
				update(state => {
					state.app.launcherShowing = true;
				});
			},
			onActivateBluetooth: (ev, props, {update}) => {
				update(state => {
					setAllKeys(state.app.overlays, false);
					state.app.overlays.bluetooth = true;
				});
			},
			onActivateDisplaySharing: (ev, props, {update}) => {
				update(state => {
					setAllKeys(state.app.overlays, false);
					state.app.overlays.displaySharing = true;
				});
			},
			onActivateProfiles: (ev, props, {update}) => {
				update(state => {
					setAllKeys(state.app.overlays, false);
					state.app.overlays.profiles = true;
				});
			},
			onLaunchApp: ({launchPointId, appid}) => {
				displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
				// console.log('onLaunchApp');
				if (launchPointId) {
					// console.log('Launch with launchPointId: ', launchPointId);
					service.launch({
						launchPointId:launchPointId, params: {displayAffinity}
					});
				} else {
					// console.log('Launch with appId: ', appid);
					service.launch({
						id:appid, params: {displayAffinity}
					});
				}
				return true;
			}
			// DEV NOTE: Retaining for example purposes
			// onToggleLauncher: (ev, props, {update}) => {
			// 	update((state) => {
			// 		state.app.launcherShowing = !state.app.launcherShowing;
			// 	});
			// }
		},
		mapStateToProps: ({app}) => ({
			launcherShowing: app.launcherShowing,
			bluetoothShowing: app.overlays.bluetooth,
			displaySharingShowing: app.overlays.displaySharing,
			profilesShowing: app.overlays.profiles,
			removeShowing: app.overlays.remove,
			removeTargetAppInfo: app.removeTargetAppInfo
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
