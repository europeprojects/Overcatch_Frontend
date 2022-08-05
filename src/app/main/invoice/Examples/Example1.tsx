import React, {useEffect, useState} from 'react';
import {Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
import clsx from "clsx";
import {makeStyles} from '@material-ui/core/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import {useSelector} from "react-redux";
import history from '@history';
import getSymbolFromCurrency from "currency-symbol-map";
import logo1 from "./resim.jpg";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";


const useStyles = makeStyles(theme => ({
    root: {
        background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 80%)`
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
    },
    table: {
        maxWidth: 550,
        width:550,
    }
}));

function createData(description, quantity, vat, amount,) {
    return { description, quantity, vat, amount, };
}

const rows = [
    createData('Piano Lesson 05/11/2019', 1, 0, "£25"),
    createData('Piano Lesson 07/11/2019', 1, 0, "£25"),
    createData('Piano Lesson 12/11/2019', 1, 0, "£25"),
];


function InvoicePrintDialog({invoice}: any, {client}:any) {
    const classes = useStyles();
    return (
            <div style={{width:"575px",minHeight:"832px",marginLeft:"-40px",marginTop:"-100px" ,border:"solid"}}>
                <div style={{width:"570px",height:"150px",paddingTop:"25px"}}>
                    <div style={{width:"200px",height:"100px",marginLeft:"185px"}}>
                        <img src={logo1}/>
                    </div>
                </div>
                <div style={{width:"570px",height:"150px"}}>
                    <div style={{width:"200px",height:"150px",paddingLeft:"20px",paddingTop:"20px"}}>
                        <label style={{fontWeight:"bolder"}}>Bill to:</label><br/>
                        <label style={{fontWeight:"bolder"}}>Xyz Xyz</label><br/>
                        <label style={{fontWeight:"bolder"}}>The Company address will be here</label><br/>
                        <label style={{fontWeight:"bolder"}}>+441122334455667788</label><br/>
                        <label style={{fontWeight:"bolder"}}>xyzmusic@gmail.com</label><br/>
                    </div>
                    <div style={{width:"200px",height:"150px",marginLeft:"350px",marginTop:"-150px",paddingLeft:"20px",paddingTop:"40px"}}>
                        <label style={{fontWeight:"bolder"}}>Invoice No:20191101014</label><br/>
                        <label style={{fontWeight:"bolder"}}>Invoice Date:01/11/2019</label><br/>
                        <label style={{fontWeight: "bolder"}}>Due Date:15/11/2019</label><br/>
                    </div>
                </div>
                <div style={{width:"550px",minHeight:"200px",marginLeft:"10px"}}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:"250px"}}>ITEM DESCRIPTION </TableCell>
                                    <TableCell style={{width:"75px"}} align="right">QUANTITY</TableCell>
                                    {/*<TableCell  style={{width:"75npmpx"}} align="right">VAT AMOUNT</TableCell>*/}
                                    <TableCell style={{width:"75px"}} align="right">AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.description}>
                                        <TableCell align="center">{row.description}</TableCell>
                                        <TableCell align="center">{row.quantity}</TableCell>
                                        {/*<TableCell align="center">{row.vat}</TableCell>*/}
                                        <TableCell component="th" scope="row">
                                            {getSymbolFromCurrency(invoice?.currencyOfPayment)} {row.amount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div style={{width:"570px",height:"50px",borderTopStyle:"solid",borderTopWidth:"5px"}}>
                    {/*<label style={{marginLeft:"375px",fontWeight:"bolder",textDecoration:"underline"}}>VAT : £0</label><br/><br/><br/>*/}
                    <label style={{marginLeft:"450px",fontWeight:"bolder",textDecoration:"underline"}}>Total : £75</label>
                </div>
                <div style={{width:"570px",height:"120px"}}>
                    <label style={{fontWeight:"bolder"}}>Payment Info</label><br/><br/>
                    <label style={{fontWeight:"bold",textDecoration:"underline"}}>Bank Account:82580977</label><br/>
                    <label style={{fontWeight:"bold",textDecoration:"underline"}}>Sort Code:40-07-30</label><br/>
                    <label style={{fontWeight:"bold",textDecoration:"underline"}}>IBAN:GB1234567890</label><br/>
                </div>
                <div style={{width:"570px",height:"50px",paddingTop:"20px",borderBottomStyle:"solid",borderBottomWidth:"5px"}}>
                    <label style={{fontWeight:"bolder",marginLeft:"175px",fontSize:"14px"}}>THANK YOU FOR CHOOSING US…</label>
                </div>
                <div style={{width:"570px",minHeight:"50px"}}>
                    <div style={{width:"275px",minHeight:"50px",marginLeft:"150px"}}>
                        <label >The company address will be here </label><br/>
                        <label style={{width:"300px",textAlign:"center"}}>www.xyzmusic.co.uk</label><br/>
                        <label style={{width:"300px",textAlign:"center"}}>+4411442255223366</label><br/>
                        <label style={{width:"300px",textAlign:"center"}}>xyz@xyz.com.tr</label><br/>

                    </div>
                </div>
            </div>
        );
}

export default InvoicePrintDialog;
