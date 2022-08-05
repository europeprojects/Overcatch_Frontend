import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import getSymbolFromCurrency from "currency-symbol-map";
import config from "../../services/Config";
import {Grid} from "@material-ui/core";


function Invoice4(props) {
    const {invoice} = props;
    const {client} = props;
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = sessionStorage.getItem("companyId")
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + client?.id + "/" + fileName
        return url
    }
    if((client.vatNumber=="" && client.vatNumber==null) || (client.company?.vatNumber=="" && client.company?.vatNumber==null)) {
        return (
            <Grid container id='divToPrint' style={{ height:"841px",width:"595px", padding:"20px"}}>
                <Grid container>
                    <Grid xs={12} sm={4} style={{marginLeft: "15px"}}>
                        <img src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                    </Grid>
                    <Grid xs={12} sm={8}> <label> </label></Grid>
                </Grid>
                <Grid xs={12} sm={4}>
                    <label style={{fontWeight: "bolder"}}> {invoice?.invoiceType}</label>
                </Grid>
                <Grid xs={12} sm={4}>
                    <label style={{fontWeight: "bold"}}>{client?.clientName} </label><br/>
                    <label style={{fontWeight: "bold"}}>{invoice?.clientAddress} </label><br/>
                    <label style={{fontWeight: "bold"}}>{invoice?.clientPhone} </label><br/>
                    <label style={{fontWeight: "bold"}}>{invoice?.clientEmail} </label><br/>
                    <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                </Grid>
                <Grid xs={12} sm={4}>
                    <label> Invoice Number: {invoice?.invoiceCode}</label><br/>
                    <label>Invoice Date: {invoice?.invoiceDate}</label><br/>
                    {invoice?.dueDate?<label>Due Date: {invoice?.dueDate}</label>:<label></label>}
                </Grid>
                <Grid xs={12} sm={12}>
                    <label style={{fontWeight: "bolder"}}>Billing Adrese</label><br/>
                    <label><b>Name:</b> {invoice?.buyerName}</label><br/>
                    <label><b>Adress:</b> {invoice?.buyerAddress}</label><br/>
                    <label><b>E-Mail:</b> {invoice?.buyerEmail}</label><br/>
                    <label><b>Phone:</b> {invoice?.buyerPhone}</label><br/>
                </Grid>
                <Grid xs={12} sm={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>DESCRIPTION </TableCell>
                                <TableCell>QUANTITY</TableCell>
                                <TableCell style={{width: "150px"}} align="right">UNIT PRICE</TableCell>
                                <TableCell>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service?.id}>
                                    <TableCell>{service?.itemDescription}</TableCell>
                                    <TableCell>{service?.quantity}</TableCell>
                                    <TableCell align="right">
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.unitPrice)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.amount)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid xs={12} sm={6}>
                    {/*<label> VAT </label><br/>*/}
                    <label style={{fontWeight: "bolder"}}>TOTAL</label><br/>
                </Grid>
                <Grid xs={12} sm={6}>
                    {/*<label style={{fontWeight: "bolder"}}> {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</label><br/>*/}
                    <label style={{fontWeight: "bolder"}}> {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}</label><br/>
                </Grid>
                <Grid xs={12} sm={12}>
                    <label> Payment Details</label><br/>
                    <label> Account Name : {client?.clientName}</label><br/>
                    <label> Bank Name : {invoice?.bank?.bankName}</label><br/>
                    <label> Sort Code: {invoice?.bank?.sortCode}</label><br/>
                    <label> Account Number: {invoice?.bank?.accountNumber}</label><br/>
                </Grid>
            </Grid>
        );
    }
    else{
        return (
            <Grid container id='divToPrint' style={{ height:"841px",width:"595px", padding:"20px"}}>
                <Grid container>
                    <Grid xs={12} sm={4} style={{marginLeft: "15px"}}>
                        <img src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                    </Grid>
                    <Grid xs={12} sm={8}> <label> </label></Grid>
                </Grid>
                <Grid xs={12} sm={4}>
                    <label style={{fontWeight: "bolder"}}> {invoice?.invoiceType}</label>
                </Grid>
                <Grid xs={12} sm={4}>
                    <label style={{fontWeight: "bold"}}>{client?.clientName} </label><br/>
                    <label style={{fontWeight: "bold"}}>{invoice?.clientAddress} </label><br/>
                    <label style={{fontWeight: "bold"}}>{invoice?.clientPhone} </label><br/>
                    <label style={{fontWeight: "bold"}}>{invoice?.clientEmail} </label><br/>
                    <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                </Grid>
                <Grid xs={12} sm={4}>
                    <label> Invoice Number: {invoice?.invoiceCode}</label><br/>
                    <label>Invoice Date: {invoice?.invoiceDate}</label><br/>
                    {invoice?.dueDate?<label>Due Date: {invoice?.dueDate}</label>:<label></label>}
                </Grid>
                <Grid xs={12} sm={12}>
                    <label style={{fontWeight: "bolder"}}>Billing Adrese</label><br/>
                    <label><b>Name:</b> {invoice?.buyerName}</label><br/>
                    <label><b>Adress:</b> {invoice?.buyerAddress}</label><br/>
                    <label><b>E-Mail:</b> {invoice?.buyerEmail}</label><br/>
                    <label><b>Phone:</b> {invoice?.buyerPhone}</label><br/>
                </Grid>
                <Grid xs={12} sm={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>DESCRIPTION </TableCell>
                                <TableCell>QUANTITY</TableCell>
                                <TableCell>UNIT PRICE</TableCell>
                                <TableCell>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service?.id}>
                                    <TableCell>{service?.itemDescription}</TableCell>
                                    <TableCell>{service?.quantity}</TableCell>
                                    <TableCell>
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.unitPrice)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.amount)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid xs={12} sm={6}>
                    <label> VAT </label><br/>
                    <label style={{fontWeight: "bolder"}}>TOTAL</label><br/>
                </Grid>
                <Grid xs={12} sm={6}>
                    <label
                        style={{fontWeight: "bolder"}}> {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</label><br/>
                     <label style={{fontWeight: "bolder"}}> {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}</label><br/>
                </Grid>
                <Grid xs={12} sm={12}>
                    <label> Payment Details</label><br/>
                    <label> Account Name : {client?.clientName}</label><br/>
                    <label> Bank Name : {invoice?.bank?.bankName}</label><br/>
                    <label> Sort Code: {invoice?.bank?.sortCode}</label><br/>
                    <label> Account Number: {invoice?.bank?.accountNumber}</label><br/>
                </Grid>
            </Grid>
        );
    }
}

export default Invoice4;