import React from 'react';
import {
    Grid,
    TableCell,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import config from "../../services/Config";
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
        padding : "30px",
        textAlign: 'center',
        backgroundColor: "#FFFFFF",
        border: "solid",
        height: "841px",
        width: "550px",
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

function InvoiceLayer4(props) {
    const classes = useStyles();
    const {invoice} = props;
    const {client} = props;
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = sessionStorage.getItem("companyId")
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + client?.id + "/" + fileName
        return url
    }
    if((client.vatNumber=="" && client.vatNumber==null) || (client.company?.vatNumber=="" && client.company?.vatNumber==null)) {
        return (
            <div id='divToPrint' className={classes.root}>
                <Grid container
                      className = {classes.paper}
                >
                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={12} sm={4} style={{textAlign : 'left'}}>
                            <label >
                                <strong>
                                    <h2>{invoice?.buyerName}</h2>
                                    <h4>{invoice?.buyerAddress}</h4>
                                    <label>Tel : {invoice?.buyerPhone}</label>
                                    <br/>
                                    <label>{invoice?.buyerEmail}</label>
                                    <br/>
                                </strong>
                                <br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <h2>{invoice?.invoiceType}</h2><br/>
                        </Grid>
                        <Grid item xs={12} sm={4} style={{textAlign :'right', paddingRight : '10px'}}>
                            <img src={getDocumentUrlByFileName(client.clientFileName)}
                                 alt="logo"/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '100px', paddingLeft : '10px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={6} style={{textAlign:'left'}} >
                            <label><strong>
                                {client?.clientName}<br/>
                                {invoice?.clientAddress}</strong>
                                {invoice?.clientPhone}<br/>
                                {invoice?.clientEmail}<br/>
                                {invoice?.web}<br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{textAlign:'left'}} >
                            <label>
                                INVOICE NO:<strong>{invoice?.invoiceCode}</strong><br/>
                                INVOICE DATE: {invoice?.invoiceDate}<br/>
                                {invoice?.dueDate?<label>DUE DATE: {invoice?.dueDate}</label>:<label></label>}
                                <br/>
                            </label>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} >
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Description</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center">Unit Price</TableCell>
                                        <TableCell align="center">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.invoiceDetails.map(detail=>(

                                        <TableRow key={invoice?.code} style={{height: '10px'}}>
                                            <TableCell align="center">{detail?.itemDescription}</TableCell>
                                            <TableCell align="center">{detail?.quantity}</TableCell>
                                            <TableCell align="center">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.unitPrice)?.toFixed(2).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="center">{getSymbolFromCurrency(invoice.currencyOfPayment)}{invoice?.total?.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '150px', paddingLeft : '20px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left', paddingRight : '30px'}} >
                            <label><strong>
                                Payment Details<br/>
                            </strong>
                                Name: {invoice?.buyerName}<br/>
                                Bank Name :{invoice?.bank?.bankName}<br/>
                                Sort Code :{invoice?.bank?.sortCode}<br/>
                                Account No : {invoice?.bank?.accountNumber}<br/>
                                IBAN : {invoice?.bank?.accountIBAN}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >
                            <label>
                                <strong> Total :{getSymbolFromCurrency(invoice.currencyOfPayment)} {invoice?.total?.toFixed(2)}</strong>
                            </label>
                        </Grid>
                        <hr/>
                        <Grid item xs={12} sm={12} style={{textAlign:"right"}}>
                        </Grid>
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
                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={12} sm={4} style={{textAlign : 'left'}}>
                            <label >
                                <strong>
                                    <h2>{invoice?.buyerName}</h2>
                                    <h4>{invoice?.buyerAddress}</h4>
                                    <label>Tel : {invoice?.buyerPhone}</label>
                                    <br/>
                                    <label>{invoice?.buyerEmail}</label>
                                    <br/>
                                </strong>
                                <br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <h2>{invoice?.invoiceType}</h2><br/>
                        </Grid>
                        <Grid item xs={12} sm={4} style={{textAlign :'right', paddingRight : '10px'}}>
                            <img src={getDocumentUrlByFileName(client.clientFileName)}
                                 alt="logo"/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '100px', paddingLeft : '10px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={6} style={{textAlign:'left'}} >
                            <label><strong>
                                {client?.clientName}<br/>
                                {invoice?.clientAddress}</strong>
                                {invoice?.clientPhone}<br/>
                                {invoice?.clientEmail}<br/>
                                {invoice?.web}<br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{textAlign:'left'}} >
                            <label>
                                INVOICE NO:<strong>{invoice?.invoiceCode}</strong><br/>
                                INVOICE DATE: {invoice?.invoiceDate}<br/>
                                {invoice?.dueDate?<label>DUE DATE: {invoice?.dueDate}</label>:<label></label>}<br/>
                            </label>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} >
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Description</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center">Unit Price</TableCell>
                                        <TableCell align="center">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.invoiceDetails.map(detail=>(

                                        <TableRow key={invoice?.code} style={{height: '10px'}}>
                                            <TableCell align="center">{detail?.itemDescription}</TableCell>
                                            <TableCell align="center">{detail?.quantity}</TableCell>
                                            <TableCell align="center">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.unitPrice)?.toFixed(2).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="center">{getSymbolFromCurrency(invoice.currencyOfPayment)}{invoice?.total?.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '150px', paddingLeft : '20px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left', paddingRight : '30px'}} >
                            <label><strong>
                               Payment Details<br/>
                            </strong>
                                Name: {invoice?.buyerName}<br/>
                                Bank Name :{invoice?.bank?.bankName}<br/>
                                Sort Code :{invoice?.bank?.sortCode}<br/>
                                Account No : {invoice?.bank?.accountNumber}<br/>
                                IBAN : {invoice?.bank?.accountIBAN}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >
                            <label>
                                VAT :{getSymbolFromCurrency(invoice.currencyOfPayment)} {invoice?.vat?.toFixed(2)}<br/>
                                <strong> Total :{getSymbolFromCurrency(invoice.currencyOfPayment)} {invoice?.total?.toFixed(2)}</strong>
                            </label>
                        </Grid>
                        <hr/>
                        <Grid item xs={12} sm={12} style={{textAlign:"right"}}>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default InvoiceLayer4;
