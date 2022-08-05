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
        height: "841px",
        width: "550px",
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

function InvoiceLayer2(props) {
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
                    <Grid item xs={12} sm={12} container>
                        <Grid item xs={12} sm={6} style={{textAlign : 'left'}}>
                            <label >
                                <strong>
                                    <h2>{client?.clientName} <br/></h2>
                                    <h2>{invoice?.usernameInputPlaceholder}</h2>
                                    <h2>{invoice?.clientEmail}</h2>
                                    <label>Phone: {invoice?.clientPhone}</label>
                                    <br/>
                                    <label>{invoice?.web}</label>
                                    <br/>
                                </strong>
                                <br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={2}></Grid>
                        <Grid item xs={12} sm={4} style={{textAlign :'right', paddingRight : '10px'}}>
                            <h1 style={{ color : 'blue'}}><strong>{invoice?.invoiceType}</strong></h1>

                            <img src={getDocumentUrlByFileName(client?.clientFileName)}
                                 alt="logo"/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '100px', paddingLeft : '10px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left'}} >
                            <label><strong>
                                BILL TO:<br/>
                                {invoice?.buyerName}<br/>
                                <label>{invoice?.buyerEmail}</label> <br/>
                                <label>{invoice?.buyerPhone}</label> <br/>
                                {invoice?.buyerAddress} <br/></strong>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >
                            <label><strong>
                                INVOICE NO: {invoice?.invoiceCode} <br/>
                                INVOICE DATE: {invoice?.invoiceDate} <br/>
                                {invoice?.dueDate?<label>DUE DATE:{invoice?.dueDate}</label>:<label></label>}
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
                                        <TableCell align="center">DESCRIPTION</TableCell>
                                        <TableCell align="center">QUANTITY</TableCell>
                                        <TableCell align="center">AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.invoiceDetails.map(detail=>(
                                        <TableRow key={invoice?.invoiceDate} style={{height: '10px'}}>
                                            <TableCell component="th" scope="row">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.unitPrice)?.toFixed(2).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="center">{detail?.itemDescription}</TableCell>
                                            <TableCell align="center">{detail?.quantity}</TableCell>
                                            <TableCell align="center">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.amount)?.toFixed(2).toLocaleString()}
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid container>
                            <Grid item xs={12} sm={6} style={{textAlign: 'right'}}>

                            </Grid>
                            <Grid item xs={12} sm={6} style={{textAlign: 'right'}}>
                                {/*<h4>VAT Total : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</h4><br/>*/}
                                <h2>Total : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}</h2>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '150px', paddingLeft : '20px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left', paddingRight : '30px'}} >
                            <label><strong>
                                Payment Details<br/>
                                Bank Name: {invoice?.bank?.bankName}<br/>
                                Sort Code:{invoice?.bank?.sortCode}<br/>
                                Account No:{invoice?.bank?.accountNumber}<br/>
                                IBAN: {invoice?.accountIBAN}<br/>
                            </strong>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >

                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{textAlign : 'center'}}>
                        <br/>
                        <p> THANK YOU FOR YOUR CUSTOM AND COOPERATION </p>
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
                        <Grid item xs={12} sm={6} style={{textAlign : 'left'}}>
                            <label >
                                <strong>
                                    <h2>{client?.clientName} <br/></h2>
                                    <h2>{invoice?.usernameInputPlaceholder}</h2>
                                    <h2>{invoice?.clientEmail}</h2>
                                    <label>Phone: {invoice?.clientPhone}</label>
                                    <br/>
                                    <label>{invoice?.web}</label>
                                    <br/>
                                </strong>
                                <br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={2}></Grid>
                        <Grid item xs={12} sm={4} style={{textAlign :'right', paddingRight : '10px'}}>
                            <h1 style={{ color : 'blue'}}><strong>{invoice?.invoiceType}</strong></h1>

                            <img src={getDocumentUrlByFileName(client?.clientFileName)}
                                 alt="logo"/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '100px', paddingLeft : '10px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left'}} >
                            <label><strong>
                                BILL TO:<br/>
                                {invoice?.buyerName}<br/>
                                <label>{invoice?.buyerEmail}</label> <br/>
                                <label>{invoice?.buyerPhone}</label> <br/>
                                {invoice?.buyerAddress} <br/></strong>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >
                            <label><strong>
                                INVOICE NO: {invoice?.invoiceCode} <br/>
                                INVOICE DATE: {invoice?.invoiceDate} <br/>
                                {invoice?.dueDate?<label>DUE DATE:{invoice?.dueDate}</label>:<label></label>}
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
                                        <TableCell align="center">DESCRIPTION</TableCell>
                                        <TableCell align="center">QUANTITY</TableCell>
                                        <TableCell align="center">AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.invoiceDetails.map(detail=>(
                                        <TableRow key={invoice?.invoiceDate} style={{height: '10px'}}>
                                            <TableCell component="th" scope="row">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.unitPrice)?.toFixed(2).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="center">{detail?.itemDescription}</TableCell>
                                            <TableCell align="center">{detail?.quantity}</TableCell>
                                            <TableCell align="center">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.amount)?.toFixed(2).toLocaleString()}
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid container>
                        <Grid item xs={12} sm={6} style={{textAlign: 'right'}}>

                        </Grid>
                        <Grid item xs={12} sm={6} style={{textAlign: 'right'}}>
                            <h4>VAT Total : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</h4><br/>
                            <h2>Total : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}</h2>
                        </Grid>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} sm={12} className={classes.kutu} style={{height : '150px', paddingLeft : '20px', paddingRight : '10px'}}>
                        <Grid item xs={12} sm={7} style={{textAlign:'left', paddingRight : '30px'}} >
                            <label><strong>
                                Payment Details<br/>
                                Bank Name: {invoice?.bank?.bankName}<br/>
                                Sort Code:{invoice?.bank?.sortCode}<br/>
                                Account No:{invoice?.bank?.accountNumber}<br/>
                                IBAN: {invoice?.accountIBAN}<br/>
                            </strong>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={5} style={{textAlign:'left'}} >

                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{textAlign : 'center'}}>
                        <br/>
                        <p> THANK YOU FOR YOUR CUSTOM AND COOPERATION </p>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default InvoiceLayer2;
