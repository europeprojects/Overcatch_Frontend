import React from 'react';
import {
    FormControl,
    Grid,
    TableCell, TextField,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import getSymbolFromCurrency from "currency-symbol-map";
import config from "../../services/Config";

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
        height: "841px",
        width: "550px",
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
        minWidth: 300,
        maxWidth : 1180,
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

function InvoiceLayer3(props) {
    const classes = useStyles();
    const {invoice} = props;
    const {client} = props;
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = sessionStorage.getItem("companyId")
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + client?.id + "/" + fileName
        return url
    }
    if((client?.vatNumber=="" && client?.vatNumber==null) || (client?.company?.vatNumber=="" && client?.company?.vatNumber==null)) {
        return (
            <div id='divToPrint' className={classes.root}>
                <Grid container
                      className = {classes.paper}
                >
                    <Grid item xs={12} sm={6}>
                        <label >
                            <h1>{invoice?.buyerName}</h1>
                            <label>{invoice?.buyerAddress}</label>
                            <label>{invoice?.buyerPhone}</label>
                            <label>{invoice?.buyerEmail}</label>
                            <br/>
                            <br/><br/>
                            <Grid item xs={12} sm={12} className={classes.kutu} style={{height : '100px'}}>
                                <h4>{client?.clientName}</h4>
                                <label>
                                    {invoice?.clientAddress}
                                </label><br/>
                                <label>{invoice?.web}</label><br/>
                                <label>e-mail:{invoice?.clientEmail}</label>
                            </Grid>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{textAlign :'right', paddingRight : '10px'}}>
                        <h1 style={{ color : 'red'}}>{invoice?.invoiceType}</h1>
                        <label> Invoice Date :{invoice?.invoiceDate}</label>
                        <br/>
                        <label> Invoice Number : {invoice?.invoiceCode}</label><br/>
                        {invoice?.dueDate?<label>Due Date: {invoice?.dueDate}</label>:<label></label>}
                    </Grid>
                    <Grid item xs={12} sm={12} style={{padding : '15px'}}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow style={{height:'10px'}}>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.invoiceDetails.map(detail=>(
                                        <TableRow key={detail?.itemDescription}>
                                            <TableCell component="th" scope="row">
                                                {detail?.itemDescription}
                                            </TableCell>
                                            <TableCell align="right">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.unitPrice)?.toFixed(2).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">{invoice?.quantity}</TableCell>
                                            <TableCell align="right">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.subTotal?.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} sm={11}>
                        {/*<h6 style={{textAlign : 'right'}}>VAT : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</h6>*/}
                        <h6 style={{textAlign : 'right'}}>TOTAL :{getSymbolFromCurrency(invoice?.currencyOfPayment)} {invoice?.total?.toFixed(2)}</h6>
                    </Grid>
                    <Grid xs={12} sm={1}></Grid>
                    <Grid xs={12} sm={12}><hr></hr></Grid>
                    <Grid item xs={12} sm={4} style={{textAlign : 'left', fontSize : '10px'}}>
                        <p> Bank Name : {invoice?.bank?.bankName}</p>
                        <br/>
                        <p>Sort code : {invoice?.bank?.sortCode} </p>
                        <br/>
                        <p>Account Number : {invoice?.bank?.accountNumber}</p>
                        <br/>
                        <p>IBAN : {invoice?.bank?.accountIBAN}</p>
                    </Grid>

                </Grid>
            </div>
        );
    }
    else{
        return (
            <div id='divToPrint' className={classes.root}>
                <Grid container
                      className = {classes.paper}
                >
                    <Grid item xs={12} sm={6}>
                        <label >
                            <h1>{invoice?.buyerName}</h1>
                            <label>{invoice?.buyerAddress}</label>
                            <label>{invoice?.buyerPhone}</label>
                            <label>{invoice?.buyerEmail}</label>
                            <br/>
                            <br/><br/>
                            <Grid item xs={12} sm={12} className={classes.kutu} style={{height : '100px'}}>
                                <h4>{client?.clientName}</h4>
                                <label>
                                    {invoice?.clientAddress}
                                </label><br/>
                                <label>{invoice?.web}</label><br/>
                                <label>e-mail:{invoice?.clientEmail}</label>
                            </Grid>
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{textAlign :'right', paddingRight : '10px'}}>
                        <h1 style={{ color : 'red'}}>{invoice?.invoiceType}</h1>
                        <label> Invoice Date :{invoice?.invoiceDate}</label>
                        <br/>
                        <label> Invoice Number : {invoice?.invoiceCode}</label><br/>
                        {invoice?.dueDate?<label>Due Date: {invoice?.dueDate}</label>:<label></label>}
                    </Grid>
                    <Grid item xs={12} sm={12} style={{padding : '15px'}}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow style={{height:'10px'}}>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice?.invoiceDetails?.map(detail=>(
                                        <TableRow key={detail?.itemDescription}>
                                            <TableCell component="th" scope="row">
                                                {detail?.itemDescription}
                                            </TableCell>
                                            <TableCell align="right">{detail?.unitPrice}</TableCell>
                                            <TableCell align="right">{detail?.quantity}</TableCell>
                                            <TableCell align="right">{getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.subTotal?.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} sm={11}>
                        <h6 style={{textAlign : 'right'}}>VAT : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</h6>
                        <h6 style={{textAlign : 'right'}}>TOTAL :{getSymbolFromCurrency(invoice?.currencyOfPayment)} {invoice?.total?.toFixed(2)}</h6>
                    </Grid>
                    <Grid xs={12} sm={1}></Grid>
                    <Grid xs={12} sm={12}><hr></hr></Grid>
                    <Grid item xs={12} sm={4} style={{textAlign : 'left', fontSize : '10px'}}>
                        <p> Bank Name : {invoice?.bank?.bankName}</p>
                        <br/>
                        <p>Sort code : {invoice?.bank?.sortCode} </p>
                        <br/>
                        <p>Account Number : {invoice?.bank?.accountNumber}</p>
                        <br/>
                        <p>IBAN : {invoice?.bank?.accountIBAN}</p>
                    </Grid>

                </Grid>
            </div>
        );
    }
}
export default InvoiceLayer3;
