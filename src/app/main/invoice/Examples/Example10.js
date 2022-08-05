import React, {useEffect, useState} from 'react';
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
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import resim from "./resim.jpg";
import history from '@history';

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
        padding : "30px",
        textAlign: 'center',
        // height:"841px",
        // width:"595px",
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
    kutu : {
        border : 'solid',
        backgroundColor : 'white',
    },
    table: {
        minHeight : 100,
        minWidth: 300,
        maxWidth : 400,
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

function createData(code, unit, qty, description, notes, price, dcs, vat, total) {
    return { code, unit, qty, description, notes, price, dcs, vat, total };
}

const rows = [
    createData('DRK0098', 'SBOX', 120, "COLA COKE CAN GB 24X33CL",'', 7.50,0.00,20.0,1080.0),
    createData('DRK0090', 'SBOX', 120, "DIET COLA CAN 24*33CL",'', 7.50,0.00,20.0,1080.0,'', 7.50,0.00,20.0,1080.0),
    createData('10519', 'UNIT', 15, "DIET COLA 12X1LT",'', 7.50,0.00,20.0,1080.0),
];
function InvoiceLayer4(invoice,client) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container
                  className={classes.paper}
            >
                <Grid item xs={12} sm={12} container>
                    <Grid item xs={12} sm={4} style={{textAlign: 'left'}}>
                        <label>
                            <strong>
                                <h2>XYZ FOODS LTD</h2>
                                <h4>17 Green Lanes, Newington Green<br/>
                                    London N16 9BS</h4>
                                <label>Tel : 0 782 561 1111</label>
                                <br/>
                                <label>info@xyzfoods.co.uk</label>
                            </strong>
                            <br/>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <h2>INVOICE</h2>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{textAlign: 'right', paddingRight: '10px'}}>
                        <img className="w-80" src={resim}
                             alt="logo"/>
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={12} className={classes.kutu}
                      style={{height: '200px', paddingLeft: '10px', paddingRight: '10px'}}>
                    <Grid item xs={12} sm={6} style={{textAlign: 'left'}}>
                        <label><strong>
                            TEST GLOBAL LTD<br/>
                            X ROAD<br/>
                            UNIT B13-14<br/>
                            N18 3 HT</strong>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{textAlign: 'left'}}>
                        <label>
                            INVOICE NO:<strong>0000279</strong><br/>
                            INVOICE DATE: 04/12/2020<br/>
                            DUE DATE : 04/12/2020
                        </label>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TableContainer>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">QTY</TableCell>
                                    <TableCell align="center">Description</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    {/*<TableCell align="center">VAT</TableCell>*/}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows?.map((row) => (
                                    <TableRow key={row.code}>
                                        <TableCell align="center">{row?.qty}</TableCell>
                                        <TableCell align="center">{row?.description}</TableCell>
                                        <TableCell align="center">{row?.price}£</TableCell>
                                        {/*<TableCell align="center">{row?.vat}£</TableCell>*/}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid container item xs={12} sm={12} className={classes.kutu}
                      style={{height: '250px', paddingLeft: '20px', paddingRight: '10px'}}>
                    <Grid item xs={12} sm={7} style={{textAlign: 'left', paddingRight: '30px'}}>
                        <label><strong>
                            Payment Details<br/>
                            Name: XYZ FOODS LTD<br/>
                            Bank Name :BANK<br/>
                            Sort Code :60-07-32 <br/>
                            Account No : 47510080<br/>
                            IBAN : GB11234567890
                        </strong>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={5} style={{textAlign: 'left'}}>
                        <label>
                            {/*VAT Total : £2797.02<br/>*/}
                            <strong> Total : £16782.12</strong>
                        </label>
                    </Grid>
                    <hr/>
                    <Grid item xs={12} sm={12} style={{textAlign: "right"}}>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
export default InvoiceLayer4;
