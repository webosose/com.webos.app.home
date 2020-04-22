import LabeledIconButton from '@enact/agate/LabeledIconButton';
import PopupMenu from '@enact/agate/PopupMenu';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import $L from '@enact/i18n/$L/$L';
import kind from '@enact/core/kind';
import compose from 'ramda/src/compose';
import React from 'react';
import PropTypes from 'prop-types';

import {
	disableAllOverlays
} from '../../state/app';

import css from './RemovePopupMenu.module.less';
import handle, { adaptEvent, forward } from '@enact/core/handle/handle';
import service from '../../service';

const SharedIconButtonProps = { backgroundOpacity: 'lightOpaque', inline: true, size: 'huge' };

const RemovePopupMenuBase = kind({
	name: 'RemovePopupMenu',

	propTypes: {
		targetInfo: PropTypes.object
	},

	styles: {
		css,
		className: 'RemovePopupMenu'
	},

	computed: {
		title: ({targetInfo}) => {
			if (targetInfo) {
				if (targetInfo.hasOwnProperty('title')) {
					// return targetInfo.title;
					return (targetInfo.title.length < 36) ? targetInfo.title : targetInfo.title.slice(0, 36) + '...';
				}
			}
			return $L('App title empty');
		}
	},

	handlers: {
		onHandleClick: handle(
			adaptEvent(
				(ev, {targetInfo}) => ({id: targetInfo.id, lptype: targetInfo.lptype}),
				forward('onRemoveApp')
			)
		)
	},

	render: ({ title, onHandleClick, ...rest }) => {
		delete rest.targetInfo;
		delete rest.onRemoveApp;

		return (
			<PopupMenu skinVariants="night" {...rest} title={title} closeButton>
				<LabeledIconButton
					{...SharedIconButtonProps}
					icon='uninstall'
					onClick={onHandleClick}
				>
					{$L('Remove')}
				</LabeledIconButton>
			</PopupMenu>
		);
	}
});

const RemovePopupMenuDecorator = compose(
	ConsumerDecorator({
		handlers: {
			onRemoveApp: (ev, props, {update}) => {
				console.log('onRemoveApp', ev);
				const {id, lptype} = ev;
				if (lptype !== 'bookmark') {
					return;
				}

				service.removeLaunchPoint({
					launchPointId : id,
					onSuccess: () => {
						console.log('removeLaunchPoint - onSuccess :', id);
					},
					onFailure: (err) => {
						console.warn(err);
					}
				});
				console.log('disableAllOverlays');
				update(disableAllOverlays);
			}
		}
	})
);

const RemovePopupMenu = RemovePopupMenuDecorator(RemovePopupMenuBase);

export default RemovePopupMenu;
export {
	RemovePopupMenu,
	RemovePopupMenuBase
};
