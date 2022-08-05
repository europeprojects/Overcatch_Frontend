import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import Invoice1 from './Invoice1'
import Invoice2 from './Invoice2'
import Invoice3 from './Invoice3'
import Invoice4 from './Invoice4'
import Invoice5 from './Invoice5'
import InvoiceLayer1 from "./invoiceLayer1";
import InvoiceLayer2 from "./invoiceLayer2";
import InvoiceLayer3 from "./InvoiceLayer3";
import InvoiceLayer4 from "./invoiceLayer4";
function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}
TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};
function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`
	};
}

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: 500
	}
}));

function ExamplePage(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [value, setValue] = React.useState(0);
	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabChange3 = (event, value) => {
		setSelectedTab(value);
	};


	return (
		<FusePageSimple
			classes={{

			}}
			contentToolbar={
				<Tabs
					value={selectedTab}
					onChange={handleTabChange3}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="on"
					className="w-full h-64"
				>
					<Tab className="h-64" label="Invoice 1" />
					<Tab className="h-64" label="Invoice 2" />
					<Tab className="h-64" label="Invoice 3" />
					<Tab className="h-64" label="Invoice 4" />
					<Tab className="h-64" label="Invoice 5" />
					<Tab className="h-64" label="Invoice 6" />
					<Tab className="h-64" label="Invoice 7" />
					<Tab className="h-64" label="Invoice 8" />
					<Tab className="h-64" label="Invoice 9" />
				</Tabs>

			}
			content={
				<div className="p-24">
					{selectedTab === 0 && (
						<div>
							<Invoice1></Invoice1>
						</div>
					)}
					{selectedTab === 1 && (
						<div>
							<Invoice2></Invoice2>
						</div>
					)}
					{selectedTab === 2 && (
						<div>
							<Invoice3></Invoice3>
						</div>
					)}
					{selectedTab === 3 && (
						<div>
							<Invoice4></Invoice4>
						</div>
					)}
					{selectedTab === 4 && (
						<div>
							<Invoice5></Invoice5>
						</div>
					)}
					{selectedTab === 5 && (
						<div>
							<InvoiceLayer1></InvoiceLayer1>
						</div>
					)}
					{selectedTab === 6 && (
						<div>
							<InvoiceLayer2></InvoiceLayer2>
						</div>
					)}
					{selectedTab === 7 && (
						<div>
							<InvoiceLayer3></InvoiceLayer3>
						</div>
					)}
					{selectedTab === 8 && (
						<div>
							<InvoiceLayer4></InvoiceLayer4>
						</div>
					)}

				</div>


			}
		/>
	);
}

export default ExamplePage;
