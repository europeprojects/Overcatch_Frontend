import React, {useEffect, useState} from 'react';
//import FusePageCarded from '../../../@fuse/core/FusePageCarded/FusePageCarded';
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TableCell,
    TextField,
    Typography, withStyles
} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import getSymbolFromCurrency from "currency-symbol-map";
import history from '@history';
import {darken} from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            // flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(1),
        },

        textField: {
            width: '25ch',
        },
        paper: {
            padding: "30px",
            textAlign: 'center',
            height: "841px",
            width: "595px",
            backgroundColor: "#FFFFFF",
            border: "solid",
            // paddingTop : "20px",
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        control: {
            padding: theme.spacing(1),
        },
        kutu: {
            border: 'solid',
            backgroundColor: 'white',
        },
        table: {
            minWidth: 300,
            maxWidth : 600,
            // border: 'solid',
            margin: theme.spacing(1),
        },
        divider: {
            backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark)
        },
        seller: {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.getContrastText(theme.palette.primary.dark),
            marginRight: -88,
            paddingRight: 66,
            width: 480
        }
    });
});
function createData(qty, products, unitPrice, lineTotal,) {
    return { qty, products, unitPrice, lineTotal, };
}

const rows = [
    createData('96', "Small purse" , "£1.20", "£115.20"),
    createData('6', "Uj back bag ", "£5.99", "£35.94"),
    createData('100', "Uj small umbrella ", "£1.20", "£120.00"),
];

function InvoiceLayer1(invoice) {
    const classes = useStyles();
    const routingData = history.location.displayRouteData;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    if(!invoice?.vatNumber) {
        return (
            <div className={classes.root}>
                <Grid container
                >
                    <Grid item xs={12} sm={6} style={{textAlign: 'left', padding: '50px'}}>
                        <label>
                            <strong>
                                <h2><strong>XYZ Gifts Ltd</strong></h2>
                                <br/><br/>
                                <p><strong>17 Green Lanes
                                    LONDON
                                    ENGLAND
                                    N000 9BS</strong></p>
                                <label><strong>Phone:07401111111</strong></label>
                                <br/>
                                <label>xyzgiftsltd@gmail.com</label>
                            </strong>
                            <br/><br/>
                            <label><strong>TO</strong></label>
                            <br/><br/>
                            <label style={{color: 'blue'}}><strong>test Ltd</strong></label>
                            <br/>
                            <label>This is address row<br/>
                                W1D 1NS
                            </label>
                            <br/>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={3}>

                    </Grid>

                    <Grid item xs={12} sm={3} style={{textAlign: 'right', padding: '50px'}}>
                        <h1 style={{color: 'blue'}}><strong>INVOICE</strong></h1>
                        <br/>
                        <p>W.O. # [234]
                            <br/>
                            DATE : 13/12/2019</p>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TableContainer style={{paddingLeft: '50px', minHeight: '100px', paddingRight: '50px'}}>
                            <Table className={classes.table} aria-label='simple table' size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>QTY</TableCell>
                                        <TableCell align="right">PRODUCTS</TableCell>
                                        <TableCell align="right">UNIT PRICE</TableCell>
                                        <TableCell align="right">LINE TOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.qty}>
                                            <TableCell component="th" scope="row">
                                                {row.qty}
                                            </TableCell>
                                            <TableCell align="right">{row.products}</TableCell>
                                            <TableCell align="right">{row.unitPrice}</TableCell>
                                            <TableCell align="right">{row.lineTotal}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} sm={12} container style={{textAlign: 'center'}}>
                        <Grid item xs={12} sm={4}></Grid>
                        <Grid item xs={12} sm={4}></Grid>
                        <Grid item xs={12} sm={4} style={{textAlign: 'right', paddingRight: '50px'}}>
                            <p>
                                <br/>TOTAL MATERIAL : £838.14<br/>
                                TOTAL : £838.14

                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12} style={{paddingBottom: '50px'}}>
                            <p>Make all checks payable to XYZ Gifts Ltd

                                <br/>
                                <strong> THANK YOU FOR YOUR BUSSINESS </strong>
                            </p>
                            <hr/>
                            <br/>
                            <p><strong>XYZ Gifts Ltd Registered in England and Wales Registration No: 111111111
                                <br/>
                                BANK BANK: : 09-01-28 ACCOUNT NUMBER : 11111111
                            </strong>
                            </p>
                        </Grid>
                    </Grid>

                </Grid>
            </div>
        );
    }
    else{
        return (
            <div className={classes.root}>
                <Grid container
                >
                    <Grid item xs={12} sm={6} style={{textAlign : 'left', padding : '50px'}}>
                        <label >
                            <strong>
                                <h2><strong>XYZ Gifts Ltd</strong></h2>
                                <br/><br/>
                                <p><strong>17 Green Lanes
                                    LONDON
                                    ENGLAND
                                    N000 9BS</strong></p>
                                <label><strong>Phone:07401111111</strong></label>
                                <br/>
                                <label>xyzgiftsltd@gmail.com</label>
                            </strong>
                            <br/><br/>
                            <label><strong>TO</strong></label>
                            <br/><br/>
                            <label style={{color : 'blue'}}><strong>test Ltd</strong></label>
                            <br/>
                            <label>This is address row<br/>
                                W1D 1NS
                            </label>
                            <br/>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={3}>

                    </Grid>

                    <Grid item xs={12} sm={3} style={{textAlign :'right', padding : '50px'}}>
                        <h1 style={{ color : 'blue'}}><strong>INVOICE</strong></h1>
                        <br/>
                        <p>W.O. # [234]
                            <br/>
                            DATE : 13/12/2019</p>
                    </Grid>
                    <Grid item xs={12} sm={12} >
                        <TableContainer style={{paddingLeft : '50px', minHeight : '100px', paddingRight : '50px'}}>
                            <Table className={classes.table} aria-label = 'simple table' size = 'small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>QTY</TableCell>
                                        <TableCell align="right">PRODUCTS</TableCell>
                                        <TableCell align="right">UNIT PRICE</TableCell>
                                        <TableCell align="right">LINE TOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.qty}>
                                            <TableCell component="th" scope="row">
                                                {row.qty}
                                            </TableCell>
                                            <TableCell align="right">{row.products}</TableCell>
                                            <TableCell align="right">{row.unitPrice}</TableCell>
                                            <TableCell align="right">{row.lineTotal}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} sm={12} container style={{textAlign : 'center'}}>
                        <Grid item xs={12} sm={4}></Grid>
                        <Grid item xs={12} sm={4}></Grid>
                        <Grid item xs={12} sm={4} style={{textAlign:'right',paddingRight : '50px'}}>
                            <p>
                                <br/>TOTAL MATERIAL : £838.14<br/>
                                TOTAL : £838.14

                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12} style={{paddingBottom : '50px'}}>
                            <p>Make all checks payable to XYZ Gifts Ltd

                                <br/>
                                <strong> THANK YOU FOR YOUR BUSSINESS </strong>
                            </p>
                            <hr/>
                            <br/>
                            <p><strong>XYZ Gifts Ltd Registered in England  and Wales Registration No: 111111111
                                <br/>
                                BANK BANK: : 09-01-28 ACCOUNT NUMBER :  11111111
                            </strong>
                            </p>
                        </Grid>
                    </Grid>

                </Grid>
            </div>
        );
    }
}
export default InvoiceLayer1;
