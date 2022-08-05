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
import {Link} from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import {withSnackbar} from "notistack";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import resim from './resim.jpg';
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
function createData(unitPrice, description, amount, vatAmount) {
    return { unitPrice, description, amount,vatAmount };
}

const rows = [
    createData('£210.00' ,'Electrical design for locate fire alarm,', '£2170.00','£170.00' ),
    createData('£210.00', 'Electrical design for locate fire alarm,', '£2170.00','£170.00'),
    createData('£210.00', 'sounders, fire alarm panel, emergency lighting, fire exit', '£2170.00','£170.00'),
];
function InvoiceLayer2(invoice, client) {
    const classes = useStyles();
    return (
            <div className={classes.root}>
                <Grid container
                      className = {classes.paper}
                >
                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={12} sm={6} style={{textAlign : 'left'}}>
                            <label >
                                <strong>
                                    <h4>XYZ ENGINEERING CONSULTANCY <br/>
                                        Xyz Xyz</h4>
                                    <h4>TEST<br/>
                                        London, UK</h4>
                                    <label>Phone: 0759 270 1111 </label>
                                    <br/>
                                    <label>www.xyzengineeringconsultancy.co.uk<br/>
                                        info@xyzengineeringconsultancy.co.uk</label>
                                </strong>
                                <br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={2}></Grid>
                        <Grid item xs={12} sm={4} style={{textAlign :'right', paddingRight : '10px'}}>
                            <h1 style={{ color : 'blue'}}><strong>INVOICE</strong></h1>
                            <br/>
                            <img className="w-80" src={resim}
                                 alt="logo"/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '110px', paddingLeft : '10px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left'}} >
                            <label><strong>
                                BILL TO:<br/>
                                Mrs Xyz Xyz<br/>
                                Test Restaurant <br/>
                                The Company address will be there
                                <br/></strong>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >
                            <label><strong>
                                INVOICE NO: 20201101A <br/>
                                INVOICE DATE: 01/11/2020<br/>
                                DUE DATE :02/12/2020
                                <br/></strong>
                            </label>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} >
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>UNIT PRICE</TableCell>
                                        <TableCell align="left">DESCRIPTION</TableCell>
                                        {/*<TableCell align="right">VAT AMOUNT</TableCell>*/}
                                        <TableCell align="right">AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row?.unitPrice} >
                                            <TableCell component="th" scope="row">
                                                {row.unitPrice}
                                            </TableCell>
                                            <TableCell align="center">{row?.description}</TableCell>
                                            {/*<TableCell align="center">{row?.vatAmount}</TableCell>*/}
                                            <TableCell align="center">{row?.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid item xs={12} sm={12} style={{textAlign: 'right'}}>
                            {/*<h2>VAT : £170.00</h2>*/}
                            <h2>TOTAl : £2170.00</h2>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '150px', paddingLeft : '20px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left', paddingRight : '30px'}} >
                            <label><strong>
                                Payment Details<br/>
                                Bank Name: Santander<br/>
                                Sort Code :09-01-29<br/>
                                Account No:48425324<br/>
                                Reference:  Xyz Engineering Consultancy
                                <br/>
                            </strong>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{textAlign : 'center'}}>
                        <br/>
                        <p> THANK YOU FOR YOUR CUSTOM AND COOPERATION </p>
                        <br/>
                    </Grid>
                </Grid>
            </div>
        );
}
export default InvoiceLayer2;
