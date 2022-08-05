import React from 'react';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import getSymbolFromCurrency from "currency-symbol-map";
import config from "../../services/Config";

function Invoice5(props) {
    const {invoice} = props;
    const {client} = props;
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = sessionStorage.getItem("companyId")
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + client?.id + "/" + fileName
        return url
    }
    if((client?.vatNumber=="" && client?.vatNumber==null) || (client?.company?.vatNumber=="" && client?.company?.vatNumber==null)) {
        return (
            <Grid container id='divToPrint' style={{ height:"841px",width:"588px", padding:"20px"}}>
                <Grid container>
                    <Grid xs={12} sm={6} style={{fontWeight: "bolder"}}>
                        <label>{invoice?.invoiceType}</label>
                    </Grid>
                    <Grid sm={2}></Grid>
                    <Grid xs={12} sm={4} style={{textAlign:"right"}} >
                        <img src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                    </Grid>
                </Grid>
                <Grid container style={{marginLeft:"40px"}}>
                    <Grid xs={12} sm={6}>
                        <label>{client?.clientName}</label><br/>
                        <label>{invoice?.clientAddress}</label><br/>
                        <label>{invoice?.clientPhone}</label><br/>
                        <label>{invoice?.clientEmail}</label><br/>
                        <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/><br/>
                        <label style={{fontWeight: "bolder"}}>Billing Adrese</label><br/>
                        <label>Name:{invoice?.buyerName}</label><br/>
                        <label>Address:{invoice?.buyerAddress} </label><br/>
                        <label>PHONE: {invoice?.buyerPhone}</label><br/>
                        <label>E-MAIL: {invoice?.buyerEmail}</label><br/>
                    </Grid>
                    <Grid xs={12} sm={6} style={{textAlign:"left",fontWeight: "bolder"}}>
                        <label>Invoice Number : {invoice?.invoiceCode}</label><br/>
                        <label>Invoice Date : {invoice?.invoiceDate}</label><br/>
                        {invoice?.dueDate? <label>Due Date : {invoice?.dueDate}</label>:<label></label>}
                        <br/>
                    </Grid>
                </Grid>
                <Grid xs={12} sm={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>QUANTITY</TableCell>
                                <TableCell>UNIT PRICE</TableCell>
                                <TableCell>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service?.id}>
                                    <TableCell component="th" scope="row" style={{fontSize: "10px", fontWeight: "bolder"}}>{service?.itemDescription}</TableCell>
                                    <TableCell>{service?.quantity}</TableCell>
                                    <TableCell>
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.unitPrice)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.amount)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid xs={12} sm={12} style={{textAlign:"right"}}>
                    {/*<label style={{fontWeight: "bolder"}}>VAT  : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</label><br/>*/}
                    <label style={{fontWeight: "bolder"}}>TOTAL: {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}</label>
                </Grid>
                <Grid container style={{marginLeft:"60px"}}>
                    <Grid xs={12} sm={6} >
                    </Grid>
                    <Grid xs={12} sm={6} style={{}}>
                        <label> Account Name : {client?.clientName}</label><br/>
                        <label> Bank Name : {invoice?.bank?.bankName}</label><br/>
                        <label> Sort Code: {invoice?.bank?.sortCode}</label><br/>
                        <label> Account Number : {invoice?.bank?.accountNumber}</label><br/>
                        <label> IBAN : {invoice?.bank?.iban}</label><br/>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
    else{
        return (
            <Grid container id='divToPrint' style={{ height:"841px",width:"588px", padding:"20px"}}>
                <Grid container>
                    <Grid xs={12} sm={6} style={{fontWeight: "bolder"}}>
                        <label>{invoice?.invoiceType}</label>
                    </Grid>
                    <Grid sm={2}></Grid>
                    <Grid xs={12} sm={4} style={{textAlign:"right"}} >
                        <img src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                    </Grid>
                </Grid>
                <Grid container style={{marginLeft:"40px"}}>
                    <Grid xs={12} sm={6}>
                        <label>{client?.clientName}</label><br/>
                        <label>{invoice?.clientAddress}</label><br/>
                        <label>{invoice?.clientPhone}</label><br/>
                        <label>{invoice?.clientEmail}</label><br/>
                        <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/><br/>
                        <label style={{fontWeight: "bolder"}}>Billing Adrese</label><br/>
                        <label>Name:{invoice?.buyerName}</label><br/>
                        <label>Address:{invoice?.buyerAddress} </label><br/>
                        <label>PHONE: {invoice?.buyerPhone}</label><br/>
                        <label>E-MAIL: {invoice?.buyerEmail}</label><br/>
                    </Grid>
                    <Grid xs={12} sm={6} style={{textAlign:"left",fontWeight: "bolder"}}>
                        <label>Invoice Number : {invoice?.invoiceCode}</label><br/>
                        <label>Invoice Date : {invoice?.invoiceDate}</label><br/>
                        {invoice?.dueDate? <label>Due Date : {invoice?.dueDate}</label>:<label></label>}
                       <br/>
                    </Grid>
                </Grid>
                <Grid xs={12} sm={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>QUANTITY</TableCell>
                                <TableCell>UNIT PRICE</TableCell>
                                <TableCell>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service?.id}>
                                    <TableCell component="th" scope="row" style={{fontSize: "10px", fontWeight: "bolder"}}>{service?.itemDescription}</TableCell>
                                    <TableCell>{service?.quantity}</TableCell>
                                    <TableCell>
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.unitPrice)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.amount)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid xs={12} sm={12} style={{textAlign:"right"}}>
                    <label style={{fontWeight: "bolder"}}>VAT  : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</label><br/>
                    <label style={{fontWeight: "bolder"}}>TOTAL: {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}</label>
                </Grid>
                <Grid container style={{marginLeft:"60px"}}>
                    <Grid xs={12} sm={6} >
                    </Grid>
                    <Grid xs={12} sm={6} style={{}}>
                        <label> Account Name : {client?.clientName}</label><br/>
                        <label> Bank Name : {invoice?.bank?.bankName}</label><br/>
                        <label> Sort Code: {invoice?.bank?.sortCode}</label><br/>
                        <label> Account Number : {invoice?.bank?.accountNumber}</label><br/>
                        <label> IBAN : {invoice?.bank?.iban}</label><br/>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Invoice5;
