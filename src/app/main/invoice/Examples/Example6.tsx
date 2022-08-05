import React, {useEffect} from 'react';
import logo1 from "./resim.jpg";
import {makeStyles} from "@material-ui/core/styles";
import {darken} from "@material-ui/core/styles/colorManipulator";
import history from '@history';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import getSymbolFromCurrency from "currency-symbol-map";

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


function createData(description, quantity, vat, amount,) {
    return { description, quantity, vat, amount, };
}

const rows = [
    createData('Social Media service ', 1, 0, "€850"),
    createData('Social Media service ', 1, 0, "€850"),
    createData('Social Media service ', 1, 0, "€850"),
];

function InvoicePrintDialog({invoice}: any, {client}:any) {
    const classes = useStyles();
    return (
            <div style={{width:"595px",height:"842px",marginTop:"-150px",marginLeft:"-50px", backgroundColor: "#FFFFFF"}}>
                <div >
                    <div style={{width:"595px",height:"80px"}}></div>
                    <div style={{width:"375px",height:"97px"}}></div>
                    <div style={{marginLeft:"375px",marginTop:"-95px"}}>
                        <img src={logo1}/></div>
                </div>
                {/*<div style={{width:"595px",height:"71px"}}></div>*/}
                <div style={{width:"595px",height:"108px"}}>
                    <div style={{marginLeft:"100px"}}>
                        <label style={{fontWeight:"bolder"}}>INVOICE TYPE</label><br/><br/>
                        <label style={{fontWeight:"bold"}}>XYZ DESING  </label><br/>
                        <label style={{fontWeight:"bold"}}>The Company Address will be there</label><br/>
                        <label style={{fontWeight:"bold"}}>0 7843 111 222 </label><br/>
                        <label style={{fontWeight:"bold"}}>xyzdesign@gmail.com </label><br/>

                    </div>
                    <div style={{marginLeft:"400px",marginTop:"-80px",fontWeight:"bold"}}>
                        <label> Invoice Number : 20200709</label><br/>
                        <label>Invoice Date: 09/07/2020</label><br/>
                        <label>Due Date : 09/07/2020</label>
                    </div>
                </div>
                <div style={{width:"595px",height:"32px"}}></div>
                <div style={{width:"595px",height:"115px"}}>
                    <div  style={{marginLeft:"100px"}}>
                        <label style={{fontWeight:"bolder"}}>Billing Adrese</label><br/>
                        <label><b>Name:</b> TEST FIELD UK LTD T/A HORMONE LAB UK</label><br/>
                        <label><b>Adress:</b> First Floor 427 Green Lanes London</label><br/>
                        <label><b>E-Mail:</b> testfielduk@gmail.com</label><br/>
                        <label><b>Phone:</b> 0 7824 758 874</label><br/>
                    </div>
                </div>
                <div style={{width:"500px",minHeight:"107px",marginLeft:"50px"}}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:"250px"}} align="right">DESCRIPTION </TableCell>
                                    <TableCell style={{width:"75px"}} align="left">QUANTITY</TableCell>
                                    {/*<TableCell  style={{width:"75px"}} align="left">VAT AMOUNT</TableCell>*/}
                                    <TableCell style={{width:"75px"}} align="left">AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row?.description}>
                                        <TableCell align="center">{row?.description}</TableCell>
                                        <TableCell align="center">{row?.quantity}</TableCell>
                                        {/*<TableCell align="center">{row?.vat}</TableCell>*/}
                                        <TableCell component="th" scope="row">
                                            {getSymbolFromCurrency(invoice?.currencyOfPayment)} {row?.amount}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
                <div style={{width:"595px",height:"140px"}}>
                    <div style={{marginLeft:"100px"}}>
                        {/*<label style={{fontWeight:"bolder"}}>VAT : </label><br/>*/}
                        <label style={{fontWeight:"bolder"}}>TOTAL : </label><br/>
                    </div>
                    <div style={{marginLeft:"350px",marginTop:"-40px"}}>
                        {/*<label style={{fontWeight:"bolder"}}> €4,250</label><br/>*/}
                        <label style={{fontWeight:"bolder"}}> €4,250</label><br/>
                        <label> Account Details</label><br/>
                        <label> Bank Name : NATWEST Bank</label><br/>
                        <label> Sort Code : 60-12-18</label><br/>
                        <label> Acoount Number : 29247659</label><br/>
                    </div>
                </div>
            </div>
        );
}

export default InvoicePrintDialog;