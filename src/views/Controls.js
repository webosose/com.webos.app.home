import {Cell, Row} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
// import React from 'react';
import Slottable from '@enact/ui/Slottable';

const ControlsBase = kind({
	name: 'Controls',

	propTypes: {
		buttons: PropTypes.node,
		widget: PropTypes.node
	},

	render: ({buttons, children, widget, ...rest}) => {
		return (
			<Row align="start" {...rest}>
				<Cell shrink>
					{widget}
				</Cell>
				<Cell>
					{children}
				</Cell>
				<Cell shrink>
					{buttons}
				</Cell>
			</Row>
		);
	}
});

const Controls = Slottable({slots: ['buttons', 'widget']}, ControlsBase);

export default Controls;
export {Controls};
