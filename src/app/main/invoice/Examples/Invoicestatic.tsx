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
import Example1 from './Example1'
import Example2 from './Example2'
import Example3 from './Example3'
import Example4 from './Example6'
import Example5 from './Example5'
import InvoicePrintDialog from "../InvoicePrintDialog";
import Example6 from "./Example6";
import Example7 from "./Example7";
import Example8 from "./Example8";
import Example9 from "./Example9";
import Example10 from "./Example10";
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

    const handleTabChange = (event, value) => {
        setSelectedTab(value);
    };


    return (
        <FusePageSimple
            classes={{

            }}
            header={
                <div className="p-24">
                    <h4>Invoices</h4>
                </div>
            }
            contentToolbar={
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="off"
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
                    <Tab className="h-64" label="Invoice 10" />
                </Tabs>
            }
            content={
                <div className="p-24">
                    {selectedTab === 0 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <InvoicePrintDialog></InvoicePrintDialog>
                        </div>
                    )}
                    {selectedTab === 1 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <Example1></Example1>
                        </div>
                    )}
                    {selectedTab === 2 && (
                        <div style={{marginLeft:"100px",marginTop:"150px"}}>
                            <Example2></Example2>
                        </div>
                    )}
                    {selectedTab === 3 && (
                        <div style={{marginLeft:"100px",marginTop:"150px"}}>
                            <Example3></Example3>
                        </div>
                    )}
                    {selectedTab === 4 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <Example5></Example5>
                        </div>
                    )}
                    {selectedTab === 5 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <Example6></Example6>
                        </div>
                    )}
                    {selectedTab === 6 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <Example7></Example7>
                        </div>
                    )}
                    {selectedTab === 7 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <Example8></Example8>
                        </div>
                    )}
                    {selectedTab === 8 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <Example9></Example9>
                        </div>
                    )}
                    {selectedTab === 9 && (
                        <div style={{marginLeft:"100px",marginTop:"100px"}}>
                            <Example10></Example10>
                        </div>
                    )}
                </div>
            }
        />
    );
}

export default ExamplePage;
