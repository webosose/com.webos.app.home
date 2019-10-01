import {adaptEvent, forward, handle} from '@enact/core/handle';
import AgateDecorator from '@enact/agate/AgateDecorator';
// DEV NOTE: Retaining for examples purposes (used by the Open Launcher button)
// import Button from '@enact/agate/Button';
import compose from 'ramda/src/compose';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import hoc from '@enact/core/hoc';
import IconButton from '@enact/agate/IconButton';
import kind from '@enact/core/kind';
import platform from '@enact/core/platform';
import PopupMenu from '@enact/agate/PopupMenu';
import PropTypes from 'prop-types';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import React from 'react';
import Transition from '@enact/ui/Transition';

import service from '../service';
import Controls from '../views/Controls';
import Launcher from '../views/Launcher';
import {getQueryStringParams} from '../components/util';

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
		}

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
		profilesShowing: PropTypes.bool
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
						<widget>
							<p>NYI - Weather Widget</p>
						</widget>

						<buttons>
							<IconButton size="large" backgroundOpacity="lightOpaque">notification</IconButton>
							<IconButton size="large" backgroundOpacity="lightOpaque" selected={profilesShowing} onClick={onActivateProfiles}>user</IconButton>
							<IconButton size="large" backgroundOpacity="lightOpaque" selected={bluetoothShowing} onClick={onActivateBluetooth}>bluetooth</IconButton>
							<IconButton size="large" backgroundOpacity="lightOpaque" selected={displaySharingShowing} onClick={onActivateDisplaySharing}>pairing</IconButton>
							<IconButton size="large" backgroundOpacity="lightOpaque" onClick={onLaunchSettings}>setting</IconButton>
						</buttons>
					</Controls>
				</Transition>

				<AnimatedLauncher visible={launcherShowing} spotlightDisabled={!launcherShowing} onLaunchApp={onLaunchApp} />
				<PopupMenu skin="gallium-night" open={profilesShowing} title="Profiles" closeButton onCloseButtonClick={onHidePopups}>
					<IconButton size="huge" backgroundOpacity="lightOpaque">profileA1</IconButton>
					<IconButton size="huge" backgroundOpacity="lightOpaque">profileA2</IconButton>
					<IconButton size="huge" backgroundOpacity="lightOpaque">profileA3</IconButton>
					<IconButton size="huge" backgroundOpacity="lightOpaque">profileA4</IconButton>
				</PopupMenu>
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
			document.addEventListener('webOSRelaunch', (data)=>{
				update(state => {
					state.app.launcherShowing = true;
				});
			});
			// Simulate a slow luna call
			// Remove the setTimeout to run at normal speed
			setTimeout(() => {
				service.listLaunchPoints({
					subscribe: true,
					onSuccess: ({launchPoints}) => {
						update(state => {
							state.launcher.launchPoints = launchPoints;
						});
					}
				});
			}, 300);

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
			onLaunchApp: ({appid: id}) => {
				service.launch({id});
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
			profilesShowing: app.overlays.profiles
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
