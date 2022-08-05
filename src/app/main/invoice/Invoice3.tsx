import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import getSymbolFromCurrency from "currency-symbol-map";
import config from "../../services/Config";
import {Grid} from "@material-ui/core";

function Invoice3(props) {
    const {invoice} = props;
    const {client} = props;
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = sessionStorage.getItem("companyId")
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + client?.id + "/" + fileName
        return url
    }
    if((client?.vatNumber=="" && client?.vatNumber==null) || (client?.company?.vatNumber=="" && client?.company?.vatNumber==null)) {
        return (
            <Grid container id='divToPrint'  style={{ height:"841px",width:"588px", padding:"20px"}} >
                <Grid xs={12} sm={4} >
                    <img src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                </Grid>
                <Grid xs={12} sm={8} style={{marginTop:"30px",textAlign:"left", fontWeight:"bold",}}>
                    <label>{client?.clientName} </label><br/>
                    <label>{client?.addressType}</label>
                    <label>{client?.city}</label>
                    <label style={{fontWeight: "bolder"}}>{invoice?.clientEmail}</label><br/>
                    <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                </Grid>
                <Grid xs={12} sm={2} ></Grid>
                <Grid xs={12} sm={4} style={{ fontWeight: "bold", fontSize: "13px"}}>
                    <label>{invoice?.buyerName}</label><br/>
                    <label>{invoice?.buyerAddress}</label><br/>
                    <label>E-Mail: {invoice?.buyerEmail}</label><br/>
                    <label>Tel: {invoice?.buyerPhone}</label><br/>
                </Grid>
                <Grid xs={12} sm={6} ></Grid>
                <Grid xs={12} sm={6} ></Grid>
                <Grid xs={12} sm={6} style={{textAlign:"left"}}>
                    <label><br/> Invoice Code: {invoice?.invoiceCode}</label>
                    <label><br/> Invoice Date: {invoice?.invoiceDate}</label>
                    {invoice?.dueDate?<label><br/> Due Date: {invoice?.dueDate}</label>:<label></label>}

                </Grid>
                <Grid xs={12}sm={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ITEM DESCRIPTION </TableCell>
                                <TableCell >QUANTITY</TableCell>
                                <TableCell >UNIT PRICE</TableCell>
                                <TableCell>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service.id}>
                                    <TableCell >{service?.itemDescription}</TableCell>
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
                <Grid xs={12} sm={12} style={{ height: "80px",border:"solid",textAlign:"right", marginLeft: "-2px", marginTop: "-2px"}}>
                    <br/>
                    {/*VAT       {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)} <hr style={{border:"solid"}}/>*/}
                    Total   {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}
                </Grid>
                <Grid xs={12} sm={12} style={{marginLeft: "30px", marginTop: "25px", fontSize: "11px", fontWeight: "bolder"}}>
                    <label>Authorized By: </label>
                    <div style={{
                        width: "267px",
                        height: "60px",
                        // border: "solid",
                        marginLeft: "105px",
                        marginTop: "-17px",
                        textAlign:'center'
                    }}>
                        <label> {client?.clientName}</label>
                    </div>
                </Grid>
                <Grid xs={12} sm={12} style={{textAlign:"left", fontSize:"15px", color:"grey"}}>
                    <label>Bank Name : {invoice?.bank?.bankName} </label><br/>
                    <label>Account No : {invoice?.bank?.accountNumber} </label><br/>
                    <label>Sort Code : {invoice?.bank?.sortCode}</label><br/>
                    <label>Phone : {invoice?.clientPhone}</label><br/>
                    <label>E-mail : {invoice?.clientEmail} </label><br/>
                </Grid>
            </Grid>
        );
    }
    else{
        return (
            <Grid container id='divToPrint'  style={{ height:"841px",width:"588px", padding:"20px"}} >
                <Grid xs={12} sm={4} >
                    <img src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                </Grid>
                <Grid xs={12} sm={8} style={{marginTop:"30px",textAlign:"left", fontWeight:"bold",}}>
                    <label>{client?.clientName} </label><br/>
                    <label>{client?.addressType}</label>
                    <label>{client?.city}</label>
                    <label style={{fontWeight: "bolder"}}>{invoice?.clientEmail}</label><br/>
                    <label style={{fontWeight: "bolder"}}>{invoice?.clientPhone}</label><br/>
                    <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                </Grid>
                <Grid xs={12} sm={2} ></Grid>
                <Grid xs={12} sm={4} style={{ fontWeight: "bold", fontSize: "13px"}}>
                    <label>{invoice?.buyerName}</label><br/>
                    <label>{invoice?.buyerAddress}</label><br/>
                    <label>E-Mail: {invoice?.buyerEmail}</label><br/>
                    <label>Tel: {invoice?.buyerPhone}</label><br/>
                </Grid>
                <Grid xs={12} sm={6} ></Grid>
                <Grid xs={12} sm={6} ></Grid>
                <Grid xs={12} sm={6} style={{textAlign:"left"}}>
                    <label><br/> Invoice Code: {invoice?.invoiceCode}</label>
                    <label><br/> Invoice Date: {invoice?.invoiceDate}</label>
                    {invoice?.dueDate?<label><br/> Due Date: {invoice?.dueDate}</label>:<label></label>}

                </Grid>
                <Grid xs={12}sm={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ITEM DESCRIPTION </TableCell>
                                <TableCell >QUANTITY</TableCell>
                                <TableCell >UNIT PRICE</TableCell>
                                <TableCell>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service.id}>
                                    <TableCell >{service?.itemDescription}</TableCell>
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
                <Grid xs={12} sm={12} style={{ height: "80px",border:"solid",textAlign:"right", marginLeft: "-2px", marginTop: "-2px"}}>
                    <br/>
                    VAT       {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)} <hr style={{border:"solid"}}/>
                    Total   {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}
                </Grid>
                <Grid xs={12} sm={12} style={{marginLeft: "30px", marginTop: "25px", fontSize: "11px", fontWeight: "bolder"}}>
                    <label>Authorized By: </label>
                    <div style={{
                        width: "267px",
                        height: "60px",
                        // border: "solid",
                        marginLeft: "105px",
                        marginTop: "-17px",
                        textAlign:'center'
                    }}>
                        <label> {client?.clientName}</label>
                    </div>
                </Grid>
                <Grid xs={12} sm={12} style={{textAlign:"left", fontSize:"15px", color:"grey"}}>
                    <label>Bank Name : {invoice?.bank?.bankName} </label><br/>
                    <label>Account No : {invoice?.bank?.accountNumber} </label><br/>
                    <label>Sort Code : {invoice?.bank?.sortCode}</label><br/>
                    <label>Phone : {invoice?.clientPhone}</label><br/>
                    <label>E-mail : {invoice?.clientEmail} </label><br/>
                </Grid>
            </Grid>
        );
    }
}

export default Invoice3;