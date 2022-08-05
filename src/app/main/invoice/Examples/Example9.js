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
    Typography
} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
//import {BuyerInfo} from "../../types/UserModel";

import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import history from '@history';
import getSymbolFromCurrency from "currency-symbol-map";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },

    textField: {
        width: '25ch',
    },
    paper: {
        padding : "0px",
        textAlign: 'center',
        // height:"841px",
        // width:"595px",
        backgroundColor: "#FFFFFF",
        border: "solid",
        paddingTop : "20px",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    control: {
        padding: theme.spacing(1),
    },
    kutu : {
        border : 'solid',
        backgroundColor : 'white',
    },
    table: {
        minHeight : 100,
        // minWidth: 300,
        // maxWidth : 300,
        // border : 'solid',
        margin : theme.spacing(1),
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
}));
function createData(description, qty,unit, unitPrice,vatt, vat, total,) {
    return { description, qty,unit, unitPrice,vatt, vat, total,};
}

const rows = [
    createData('Camera Installation', 1, 'Pcs', "£ 300.00",'','',"£ 300.00"),
    createData('Camera Installation', 1, 'Pcs', "£ 300.00",'','',"£ 300.00"),
    createData('Camera Installation', 1, 'Pcs', "£ 300.00",'','',"£ 300.00"),
   ];
function InvoiceLayer3(invoice, client) {
    const classes = useStyles();
    return (
            <div className={classes.root}>
                <Grid container
                      className = {classes.paper}
                >
                    <Grid item xs={12} sm={6}>
                        <label >
                            <h2>FIX IT EXPRESS</h2>
                            <h3>XYZ & Computer Services<br/>
                                Mr Xyz Xyz
                            </h3>
                            <label>The Company address will ce there<br/>
                            </label>
                            <br/>
                            <br/>
                            <Grid item xs={12} sm={12} className={classes.kutu} style={{height : '70px'}}>
                                <h4>Xyz Sign and Construction Ltd</h4>
                                <label>
                                    Foxhill Building Wern Trading Estate<br/>
                                    Rogerstone Newport - NP10 9FQ
                                </label>
                            </Grid>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{textAlign :'right', paddingRight : '10px'}}>
                        <h1 style={{ color : 'red'}}>INVOICE</h1>
                        <label> Invoice Date :29.05.2020</label>
                        <br/>
                        <label> Invoice Number : FIX2020052901 </label><br/>
                        <label>Due Date : 29.05.2020</label>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{padding : '15px'}}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        {/*<TableCell align="right">Vat</TableCell>*/}
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row)=> (
                                        <TableRow key={row.description}>
                                            <TableCell component="th" scope="row">
                                                {row.description}
                                            </TableCell>
                                            <TableCell align="right">{row.unitPrice}</TableCell>
                                            {/*<TableCell align="right">{row.vatt}</TableCell>*/}
                                            <TableCell align="right">{row.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={6} sm={4}></Grid>
                    <Grid item xs={6} sm={4}></Grid>
                    <Grid item xs={6} sm={4}>
                        <label>
                            {/*<h7>VAT <span style={{color : 'red'}}>£30.00</span> </h7><br/>*/}
                            <h7>TOTAL <span style={{color : 'red'}}>£300.00</span> </h7>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <hr></hr>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{textAlign : 'left', fontSize : '12px'}}>
                        <p> Bank Name :BANK</p>
                        <br/>
                        <p>Sort code : 60-83-71 </p>
                        <br/>
                        <p>Account Number : 32879608</p>
                        <br/>
                        <p> IBAN : GB1234567890</p>
                    </Grid>

                </Grid>
            </div>
        );
}
export default InvoiceLayer3;
