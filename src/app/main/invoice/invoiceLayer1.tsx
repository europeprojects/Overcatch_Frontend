import React from 'react';
import {
    Grid,
    TableCell,} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import getSymbolFromCurrency from "currency-symbol-map";
import config from "../../services/Config";

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            // flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(1),
        },

        textField: {
            width: '25ch',
        },
        paper: {
            padding: "30px",
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
        kutu: {
            border: 'solid',
            backgroundColor: 'white',
        },
        table: {
            minWidth: 300,
            // border: 'solid',
            margin: theme.spacing(1),
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
    });
});

function InvoiceLayer1(props) {
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
            <div id='divToPrint' style={{border: "solid", width:"100%"}}>
                <div className={classes.paper}>
                    <Grid container
                    >
                        <Grid item xs={12} sm={6} style={{textAlign: 'left', padding: '50px'}}>
                            <label>
                                <strong>
                                    <h2><strong>{invoice?.buyerName}</strong></h2>
                                    <br/><br/>
                                    <p>{invoice?.buyerAddress}</p>
                                    <label>Phone: {invoice?.buyerPhone}</label>
                                    <br/>
                                    <label>{invoice?.buyerEmail}</label>
                                    <br/>
                                    <label>web:{invoice?.web}</label>
                                </strong>
                                <br/><br/>
                                <label><strong>TO</strong></label>
                                <br/><br/>
                                <label style={{color: 'blue'}}><strong>{client?.clientName}</strong></label>
                                <br/>
                                <label>{invoice?.clientAddress}<br/>
                                </label>
                                <br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={3}>

                        </Grid>

                        <Grid item xs={12} sm={3} style={{textAlign: 'right', padding: '50px'}}>
                            <h1 style={{color: 'blue'}}><strong>INVOICE</strong></h1>
                            <br/>
                            <p>DATE : {invoice?.invoiceDate}</p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TableContainer style={{paddingLeft: '50px', minHeight: '100px', paddingRight: '50px'}}>
                                <Table className={classes.table} aria-label='simple table' size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>QTY</TableCell>
                                            <TableCell align="right">PRODUCTS</TableCell>
                                            <TableCell align="right">UNIT PRICES</TableCell>
                                            <TableCell align="right">LINE TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice?.invoiceDetails?.map(detail=>(
                                        <TableRow key={detail?.quantity}>
                                            <TableCell component="th" scope="row">
                                                {detail?.quantity?.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">{invoice?.buyerName}</TableCell>
                                            <TableCell align="right">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.unitPrice)?.toFixed(2).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.amount)?.toFixed(2).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        <Grid item xs={12} sm={12} container style={{textAlign: 'center'}}>
                            <Grid item xs={12} sm={4}></Grid>
                            <Grid item xs={12} sm={4}></Grid>
                            <Grid item xs={12} sm={4} style={{textAlign: 'right', paddingRight: '50px'}}>
                                <p>
                                    <br/>TOTAL : {invoice?.total?.toFixed(2)}{getSymbolFromCurrency(invoice?.currencyOfPayment)}
                                </p>
                            </Grid>
                            <Grid item xs={12} sm={12} style={{paddingBottom: '50px'}}>
                                <p>Make all checks payable to {invoice?.buyerName}
                                    <br/>
                                    <strong> THANK YOU FOR YOUR BUSSINESS </strong>
                                </p>
                                <hr/>
                                <br/>
                                <p><strong>{invoice?.buyerName} Registered in England
                                    <br/>
                                    {invoice?.bank?.bankName}: {invoice?.dueDate} ACCOUNT NUMBER : {invoice?.bank?.accountNumber}
                                </strong>
                                </p>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
    else{
        return (
            <div id='divToPrint' style={{width: "100%", minHeight: "832px", marginLeft: "10px", border: "solid"}}>
                <div className={classes.paper}>
                    <Grid container
                    >
                        <Grid item xs={12} sm={6} style={{textAlign: 'left', padding: '50px'}}>
                            <label>
                                <strong>
                                    <h2><strong>{invoice?.buyerName}</strong></h2>
                                    <br/><br/>
                                    <p>{invoice?.buyerAddress}</p>
                                    <label>Phone: {invoice?.buyerPhone}</label>
                                    <br/>
                                    <label>{invoice?.buyerEmail}</label>
                                    <br/>
                                    <label>web:{invoice?.web}</label>
                                </strong>
                                <br/><br/>
                                {/*<label><strong>TO</strong></label>*/}
                                <br/><br/>
                                <label style={{color: 'blue'}}><strong>{client?.clientName}</strong></label>
                                <br/>
                                <label>{invoice?.clientAddress}<br/>
                                </label>
                                <br/>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={1}>

                        </Grid>

                        <Grid item xs={12} sm={5} style={{textAlign: 'right', padding: '50px'}}>
                            <h1 style={{color: 'blue'}}><strong>INVOICE</strong></h1>
                            <br/>
                            <p>DATE : {invoice?.invoiceDate}</p><br/>
                            <label>Invoice Date : {invoice?.invoiceCode}</label>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TableContainer style={{paddingLeft: '50px', minHeight: '100px', paddingRight: '50px'}}>
                                <Table className={classes.table} aria-label='simple table' size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>QTY</TableCell>
                                            <TableCell align="right">PRODUCTS</TableCell>
                                            <TableCell align="right">UNIT PRICES</TableCell>
                                            <TableCell align="right">LINE TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.invoiceDetails.map(detail=>(
                                            <TableRow key={detail?.quantity}>
                                                <TableCell component="th" scope="row">
                                                    {invoice?.qty}
                                                    {detail?.quantity}
                                                </TableCell>
                                                <TableCell align="right">{invoice?.buyerName}</TableCell>
                                                <TableCell align="right">
                                                    {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.unitPrice)?.toFixed(2).toLocaleString()}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(detail?.amount)?.toFixed(2).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        <Grid item xs={12} sm={12} container style={{textAlign: 'center'}}>
                            <Grid item xs={12} sm={4}></Grid>
                            <Grid item xs={12} sm={4}></Grid>
                            <Grid item xs={12} sm={4} style={{textAlign: 'right', paddingRight: '50px'}}>
                                <p>
                                    <br/>TOTAL : {invoice?.total?.toFixed(2)}{getSymbolFromCurrency(invoice?.currencyOfPayment)}
                                </p>
                                <label>VAT Total: {invoice?.vat?.toFixed(2)}</label>
                            </Grid>
                            <Grid item xs={12} sm={12} style={{paddingBottom: '50px'}}>
                                <p>Make all checks payable to {invoice?.buyerName}
                                    <br/>
                                    <strong> THANK YOU FOR YOUR BUSSINESS </strong>
                                </p>
                                <hr/>
                                <br/>
                                <p><strong>{invoice?.buyerName} Registered in England
                                    <br/>
                                    {invoice?.bank?.bankName}: {invoice?.dueDate} ACCOUNT NUMBER : {invoice?.bank?.accountNumber}
                                </strong>
                                </p>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}
export default InvoiceLayer1;
