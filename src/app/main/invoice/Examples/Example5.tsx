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
        maxWidth: 500,
        width:500,
    }
}));


function createData(description, amount) {
    return { description, amount };
}

const rows = [
    createData('Aluminium Door and Window Specification Study and Supplier Research',  "£2,10"),
    createData('Aluminium Door and Window Specification Study and Supplier Research',  "£2,10"),
    createData('Aluminium Door and Window Specification Study and Supplier Research',  "£2,10"),
];

function Example5({invoice}: any, {client}:any) {
    const classes = useStyles();
    return (
            <div>
                <div style={{width:"595px",height:"842px" ,marginTop:"-100px",marginLeft:"-50px", backgroundColor: "#FFFFFF"}}>
                    <div style={{width:"595px",height:"120px", backgroundColor: "#FFFFFF"}}>
                        <div style={{marginLeft:"50px", height : '50px', width : '100px' }}>
                            <img src={logo1} alt="logo"/>
                        </div>
                    </div>
                    {/*<div style={{width:"595px",height:"30px", backgroundColor: "#FFFFFF"}}>*/}
                    {/*    <label style={{fontSize:"18px",fontWeight:"bolder",marginLeft:"50px"}}>*/}
                    {/*        {invoice?.invoiceType}*/}
                    {/*    </label>*/}
                    {/*</div>*/}
                    <div style={{width:"595px",height:"60px", backgroundColor: "#FFFFFF"}}></div>
                    <div style={{width:"595px",height:"120px", backgroundColor: "#FFFFFF"}}>
                        <div><label style={{fontSize:"14px",fontWeight:"bolder",marginLeft:"50px"}}>
                            INVOICE TYPE</label></div>
                        <div style={{height:"120px",width:"200px",fontSize:"12px",marginLeft:"175px",marginTop:"-20px"}}>
                            <label>XYZ Design & Construction Ltd</label><br/>
                            <label>The Company address will be there</label><br/>
                            <label>Phone:  0 7824 111 111</label><br/>
                            <label>E-mail:  xyzdesign@gmail.com</label><br/>
                        </div>
                        <div style={{height:"120px",width:"175px",fontSize:"12px",marginLeft:"400px",marginTop:"-120px"}}>
                            <label>INVOICE NO: 20201118</label><br/>
                            <label>INVOICE DATE:  18/11/2020</label><br/>
                            <label>DUE DATE:  19/11/2020</label><br/>
                        </div>
                    </div>
                    <div style={{width:"595px",minHeight:"230px",backgroundColor: "#FFFFFF"}}>

                        <TableContainer style={{marginLeft:"50px",width:"500px"}} component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">DESCRIPTION</TableCell>
                                        <TableCell align="right">AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.description}>
                                            <TableCell align='left'  component="th" scope="row" style={{fontSize:"10px",fontWeight:"bolder"}}>
                                                {row?.description}
                                            </TableCell>
                                            <TableCell align="right">{row?.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{width:"500px",height:"30px",backgroundColor: "#FFFFFF",marginLeft:"50px"}}>
                            <label style={{fontWeight:"bolder"}}>TOTAL</label>
                            <label style={{marginLeft:"375px",fontWeight:"bolder"}}>£6,30</label>
                        </div>


                    </div>
                    <div style={{width:"595px",height:"140px", backgroundColor: "#FFFFFF"}}>
                        <div style={{marginLeft:"50px"}}>
                            <label style={{fontWeight:"bolder",fontSize:"12px",textDecoration:"underline"}}> PAYMENT DETAILS</label>
                            <div style={{width:"100px",height:"120px",backgroundColor:"#FFFFFF",fontSize:"11px",fontWeight:"bold"}}>
                                <label>ACCOUNT NAME</label><br/><br/>
                                <label>BANK</label><br/>
                                <label>SORT CODE</label><br/>
                                <label>ACCOUNT NO</label><br/>
                                <label>IBAN</label><br/>

                            </div>
                            <div style={{width:"300px",height:"120px",backgroundColor:"#FFFFFF",fontSize:"11px",fontWeight:"bold",marginTop:"-120px",marginLeft:"120px"}}>
                                <label>XYZ LTD
                                </label><br/><br/>
                                <label>NATWEST</label><br/>
                                <label>60-02-36</label><br/>
                                <label>67847749</label><br/>
                                <label>GB29NWBK6002111111111</label><br/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
}

export default Example5;
