import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import Scroller from '@enact/agate/Scroller';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';

import iconHomeLauncher from '../../assets/home-launcher-icon.svg';

import LauncherTile from '../components/LauncherTile';

import {
	setRemoveTargetAppInfo,
	enableOverlayRemove,
} from '../state/app';

import css from './Launcher.module.less';

// Examples of appData usage:
//	{key: 'app0', title: 'Edit', icon: 'setting',	iconColor: '#111'},
//	{key: 'app1', title: 'App 1', icon: 'bluetooth',		iconColor: '#02A594'},
//	{key: 'app2', title: 'App 2', icon: 'pairing',			iconColor: '#DC5247', progress: 0 },
//	{key: 'app3', title: 'App 3', icon: 'volume2',			iconColor: '#0072D0', progress: 0.2 },
//	{key: 'app4', title: 'App 4', icon: 'wifi',				iconColor: '#6C14D3', notification: 'Update' },
//	{key: 'app5', title: 'App 5', icon: 'user',				iconColor: '#705BD0'},
//	{key: 'app6', title: 'App 6', icon: 'notification',		iconColor: '#D2187E', progress: 0.75 , notification: '75% Almost Done' },
//	{key: 'app7', title: 'App 7', icon: 'user',				iconColor: '#E25852', notification: 'Update' },
//	{key: 'app8', title: 'App 8', icon: 'calendar',			iconColor: '#D9841A', progress: 1 },

// Manually add a custom component to the apps list
const staticLaunchPoints = [{key: 'app0', title: 'Edit', icon: iconHomeLauncher, iconColor: '#111'}];

const LauncherBase = kind({
	name: 'Launcher',

	propTypes: {
		appsList: PropTypes.array,
		onLaunchApp: PropTypes.func,
		ready: PropTypes.bool,
		spotlightDisabled: PropTypes.bool,
		setDeletePopupTimer: PropTypes.func,
		clearDeletePopupTimer: PropTypes.func
	},

	styles: {
		css,
		className: 'launcher'
	},

	computed: {
		className: ({ready, styler}) => styler.append({ready}),
		// eslint-disable-next-line enact/display-name
		renderItem: ({onLaunchApp, setDeletePopupTimer, clearDeletePopupTimer}) => (app, index) => {
			const {title, iconColor: color, id, launchPointId, progress, notification, lptype} = app;
			let icon = app.icon;
			if (icon && icon.indexOf(':') === -1 && icon.indexOf('/') === 0) {
				// Icon doesn't contain a protocol separator (:) so it's looking for local files.
				icon = 'file:' + icon;
			}
			const tileProps = {
				appid: id,
				lpid: launchPointId,
				lptype,
				color,
				icon,
				key: `app-${launchPointId}`,
				notification,
				onLaunchApp,
				setDeletePopupTimer,
				clearDeletePopupTimer,
				title,
				progress
			};
			return (
				<LauncherTile {...tileProps} first={index === 0}>
					{title}
				</LauncherTile>
			);
		}
	},

	render: ({appsList, renderItem, spotlightDisabled, ...rest}) => {
		delete rest.onLaunchApp;
		delete rest.setDeletePopupTimer;
		delete rest.clearDeletePopupTimer;
		delete rest.ready;
		return (
			<div {...rest}>
				<Scroller
					className={css.appsScroller}
					direction="horizontal"
					horizontalScrollbar="hidden"
					spotlightDisabled={spotlightDisabled}
				>
					<div className={css.appsList}>
						{appsList.map(renderItem)}
					</div>
				</Scroller>
			</div>
		);
	}
});

let deletePopupTimerId = 0;

const Launcher = ConsumerDecorator(
	{
		handlers: {
			setDeletePopupTimer: (ev, props, context) => {
				console.log('setDeletePopupTimer');
				console.log(ev);
				const {update} = context;
				if (deletePopupTimerId) {
					clearTimeout(deletePopupTimerId);
				}
				deletePopupTimerId = setTimeout(() => {
					update(setRemoveTargetAppInfo(ev));
					update(enableOverlayRemove);
				}, 1000);
			},
			clearDeletePopupTimer: () => {
				if (deletePopupTimerId) {
					console.log('clearDeletePopupTimer');
					clearTimeout(deletePopupTimerId);
				}
			}
		},
		mapStateToProps: {
			appsList: state => staticLaunchPoints.concat(state.launcher.launchPoints)
		}
	},
	LauncherBase
);


export default Launcher;
