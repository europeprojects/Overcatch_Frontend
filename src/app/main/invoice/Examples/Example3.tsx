import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {darken} from "@material-ui/core/styles/colorManipulator";
import history from '@history';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import getSymbolFromCurrency from "currency-symbol-map";
import logo1 from "./resim.jpg"

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
        maxWidth: 485,
        width:485,
    }
}));

function createData(description, quantity, vat, amount,) {
    return { description, quantity, vat, amount, };
}

const rows = [
    createData('SCADA Engineering Service', 1, 0, " £9,350.00"),
    createData('SCADA Engineering Service', 1, 0, " £9,350.00"),
    createData('SCADA Engineering Service', 1, 0, " £9,350.00"),
];

function InvoicePrintDialog({invoice}: any, {client}:any) {
    const classes = useStyles();
    return (
            <div style={{width:"595px",height:"842px",marginTop:"-150px",marginLeft:"-50px", backgroundColor: "#FFFFFF"}}>
                <div style={{width:"494px",height:"65px"}}></div>
                <div style={{width:"494px",minHeight:"800px",marginLeft:"50.5px"}}>
                    <div style={{width:"290px",height:"93px"}}>
                        <img className="w-80" src={logo1} alt="logo"/>
                    </div>
                    <div style={{marginLeft:"100px",marginTop:"-75px",fontSize:"12px"}}>
                        <label >XYZ LTD.</label><br></br>
                        <label>The Company address will be there</label>
                    </div>
                    {/*<div style={{width:"188px",height:"76px",marginTop:"-93px",marginLeft:"304px",fontWeight:"bold"}}>*/}
                    {/*    <br></br><br></br><label style={{marginTop:"35px"}}>Invoice :</label><label style={{marginLeft:"80px"}}>C00045</label>*/}
                    {/*</div>*/}
                    <div style={{width:"450px",height:"50px",marginTop:"51px"}}>

                        <div style={{marginLeft:"80px",fontWeight:"bold",fontSize:"10px"}}>
                            <label>XYZ Partners Limited</label><br></br>
                            <label>The Company address will be there</label><br></br>
                            <label>E-Mail: xyzpartners@gmail.com</label><br></br>
                            <label>Tel:  012 42 112233 </label><br></br>
                        </div>
                    </div>


                    <div style={{height:"302px",fontWeight:"bold"}}>
                        <div style={{textAlign: "right", marginRight: "50px"}}>
                            <label>invoice Code : C00045</label><br/>
                            <label>Invoice Date : 01/11/2020</label><br/>
                            <label>Due Date : 01/11/2020</label>
                        </div>
                        {/*<div style={{textAlign: "right", marginTop: "-20px"}}>*/}
                        {/*    <label>01/11/2020</label>*/}
                        {/*</div>*/}
                        <div style={{width:"485px",minHeight:"107px",marginTop:"25px"}}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell >ITEM DESCRIPTION </TableCell>
                                            <TableCell style={{width:"75px"}} align="right">QUANTITY</TableCell>
                                            {/*<TableCell  style={{width:"75px"}} align="right">VAT AMOUNT</TableCell>*/}
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
                        {/*<div style={{width:"494px",minHeight:"25px",border:"solid",marginLeft:"-2px",marginTop:"-2px",textAlign:"right"}}>*/}
                        {/*    <div style={{width:"404px",height:"25px",marginLeft:"-2px",marginTop:"-2px"}}>*/}
                        {/*        VAT*/}
                        {/*    </div>*/}
                        {/*    <div style={{width:"92px",minHeight:"25px",marginLeft:"400px",marginTop:"-25px"}}>*/}
                        {/*        €1,200*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div style={{width:"494px",minHeight:"25px",border:"solid",marginLeft:"-2px",marginTop:"-2px",textAlign:"right"}}>
                            <div style={{width:"404px",minHeight:"25px",marginLeft:"-2px",marginTop:"-2px"}}>
                                Total
                            </div>
                            <div style={{width:"92px",minHeight:"25px",marginLeft:"400px",marginTop:"-24px"}}>
                                €37,400
                            </div>
                        </div>
                        <div style={{marginLeft:"30px",marginTop:"25px",fontSize:"11px",fontWeight:"bolder"}}>
                            <label>Authorized By: </label>
                            <div style={{width:"267px",height:"60px",marginLeft:"105px",marginTop:"-16px"}}>
                                <label>XYZ Limited</label>
                            </div>
                        </div>
                        <div style={{minHeight:"129px",marginTop:"20px"}}>
                            <div style={{width:"80px",height:"129px",fontWeight:"bolder",fontSize:"11px"}}>
                                <label>XYZBank </label><br/>
                                <label>Account No  </label><br/>
                                <label>Sort Code </label><br/>
                                <label>IBAN </label><br/>
                                <label>Phone </label><br/>
                                <label>E-mail </label><br/>
                            </div>
                            <div style={{marginLeft:"80px",marginTop:"-129px",height:"129px",fontWeight:"bolder",fontSize:"11px"}}>
                                <label>:  Clapham Junction Branch </label><br/>
                                <label>:  27195924</label><br/>
                                <label>:  23-05-80</label><br/>
                                <label>:  GB1234567890</label><br/>
                                <label>:  0 7843 862 358 </label><br/>
                                :<Link to=""> info@xyzas.co.uk </Link><br/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
}

export default InvoicePrintDialog;