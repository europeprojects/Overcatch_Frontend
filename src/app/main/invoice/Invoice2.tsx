import React from 'react';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import getSymbolFromCurrency from "currency-symbol-map";
import config from "../../services/Config";

function Invoice21(props) {
    const {invoice} = props;
    const {client} = props;
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = sessionStorage.getItem("companyId")
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + client?.id + "/" + fileName
        return url
    }
    if((client?.vatNumber=="" && client?.vatNumber==null) || (client?.company?.vatNumber=="" && client?.company?.vatNumber==null)) {
        return (
            <Grid container id='divToPrint' style={{ height:"841px",width:"585px", padding:"10px"}} >
                <Grid xs={12} sm={12} style={{height: "70px", backgroundColor: "#FFFFFF"}}></Grid>
                <Grid xs={12} sm={12} style={{height: "16px", backgroundColor: "blue"}}></Grid>
                <Grid xs={12} sm={2} style={{ backgroundColor: "#E6E6FA"}}></Grid>
                <Grid xs={12} sm={4} style={{ backgroundColor: "#E6E6FA"}}>
                    <br></br><br></br>
                    <img  src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo" style={{textAlign:'center'}}/>
                </Grid>
                <Grid xs={12} sm={6} style={{textAlign:"left", backgroundColor: "#E6E6FA"}}>
                    <br></br><br></br>
                    <label style={{fontSize: "14px"}}>{client?.clientName}</label><br></br>
                    <label style={{fontSize: "12px"}}>{invoice?.clientAddress}</label><br></br>
                    <label style={{fontSize: "12px"}}>Tel: {invoice?.clientPhone}</label><br></br>
                    <label style={{fontSize: "12px"}}>Email: {invoice?.clientEmail}</label><br></br>
                    <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                </Grid>
                <Grid xs={6} sm={6} style={{textAlign: "left"}}>
                    <label style={{fontWeight: "bold"}}>BILL TO</label><br></br><br></br>
                    <label>{invoice?.buyerName}</label><br></br>
                    <label>{invoice?.buyerAddress}</label><br></br>
                    <label>{invoice?.buyerPhone}</label><br></br>
                    <label>{invoice?.buyerEmail}</label>
                </Grid>
                <Grid xs={6} sm={6} style={{ textAlign:'left'}}>
                    <label style={{fontSize: "20px"}}>{invoice?.invoiceType}</label><br/>
                    <br/>
                    <label style={{fontSize: "14px", fontWeight: "bold"}}>Invoice Date: {invoice?.invoiceDate}</label>
                    <br/>
                    <label style={{ fontSize: "14px", fontWeight: "bold"}}>Invoice Number: {invoice?.invoiceCode}</label>
                    <br/>
                    {invoice?.dueDate? <label>Due Date: {invoice?.dueDate} </label>: <label></label>}
                </Grid>
                <Grid xs={12} sm={12} style={{ backgroundColor: "#FFFFFF"}}>
                    <Table>
                        <TableHead style={{backgroundColor:'darkblue'}}>
                            <TableRow >
                                <TableCell style={{color:'white'}}>ITEM DESCRIPTION </TableCell>
                                <TableCell align="right" style={{color:'white'}}>QUANTITY</TableCell>
                                <TableCell align="right" style={{color:'white'}}>UNIT PRICE</TableCell>
                                <TableCell align="right" style={{color:'white'}}>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service.id}>
                                    <TableCell >{service?.itemDescription}</TableCell>
                                    <TableCell align="right">{service?.quantity}</TableCell>
                                    <TableCell align="right">
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.unitPrice)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.amount)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid xs={12} sm={6}>
                    <label style={{fontSize: "10px"}}>Remarks / Payment Instructions:</label><br/>
                    <div style={{border:'solid'}}>
                        <label style={{fontWeight: "bold", fontSize: "12px"}}>Bank Account Details</label><br/>
                        <label style={{fontSize: "12px"}}>{client?.clientName}</label><br/>
                        <label style={{fontSize: "10px"}}>Account No : {invoice?.bank?.accountNumber}</label><br/>
                        <label style={{fontSize: "10px"}}>Sort Code : {invoice?.bank?.sortCode}</label><br/>
                        <label style={{fontSize: "10px"}}> IBAN : {invoice?.bank?.accountIBAN}</label>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} style={{textAlign:"center"}}>
                    {/*<label>VAT: {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</label><br/>*/}
                    <label style={{ fontWeight: "bolder", fontSize: "16px"}}> Total:</label>
                    {/*<label style={{marginLeft: "122px", fontWeight: "bolder"}}>VAT &</label><br></br>*/}
                    <label style={{ fontWeight: "bolder"}}> </label>
                    <label style={{ fontWeight: "bolder"}}> </label>

                    <label style={{
                        height: "40px",
                        fontWeight: "bolder",
                        fontSize: "16px",
                        backgroundColor: "#ADD8E6"
                    }}>{getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total}</label>
                </Grid>

                <label style={{color: "red"}}> </label>
                <label> </label>
                {/*<label>{invoice?.vat}%</label><br></br>*/}
                <label> </label>
                <label> </label>

                <Grid xs={12} sm={12} style={{height: "16px", backgroundColor: "blue"}}></Grid>
                <Grid xs={12} sm={12} style={{height: "70px", backgroundColor: "#FFFFFF"}}></Grid>
            </Grid>
        );
    }
    else{
        return (
            <Grid container id='divToPrint' style={{ height:"841px",width:"585px", padding:"10px"}} >
                <Grid xs={12} sm={12} style={{height: "70px", backgroundColor: "#FFFFFF"}}></Grid>
                <Grid xs={12} sm={12} style={{height: "16px", backgroundColor: "blue"}}></Grid>
                <Grid xs={12} sm={2} style={{ backgroundColor: "#E6E6FA"}}></Grid>
                <Grid xs={12} sm={4} style={{ backgroundColor: "#E6E6FA"}}>
                    <br></br><br></br>
                    <img  src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo" style={{textAlign:'center'}}/>
                </Grid>
                <Grid xs={12} sm={6} style={{textAlign:"left", backgroundColor: "#E6E6FA"}}>
                    <br></br><br></br>
                    <label style={{fontSize: "14px"}}>{client?.clientName}</label><br></br>
                    <label style={{fontSize: "12px"}}>{invoice?.clientAddress}</label><br></br>
                    <label style={{fontSize: "12px"}}>Tel: {invoice?.clientPhone}</label><br></br>
                    <label style={{fontSize: "12px"}}>Email: {invoice?.clientEmail}</label><br></br>
                    <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                </Grid>
                <Grid xs={6} sm={6} style={{textAlign: "left"}}>
                    <label style={{fontWeight: "bold"}}>BILL TO</label><br></br><br></br>
                    <label>{invoice?.buyerName}</label><br></br>
                    <label>{invoice?.buyerAddress}</label><br></br>
                    <label>{invoice?.buyerPhone}</label><br></br>
                    <label>{invoice?.buyerEmail}</label>
                </Grid>
                <Grid xs={6} sm={6} style={{ textAlign:'left'}}>
                        <label style={{fontSize: "20px"}}>{invoice?.invoiceType}</label><br/>
                        <br/>
                        <label style={{fontSize: "14px", fontWeight: "bold"}}>Invoice Date: {invoice?.invoiceDate}</label>
                        <br/>
                        <label style={{ fontSize: "14px", fontWeight: "bold"}}>Invoice Number: {invoice?.invoiceCode}</label>
                        <br/>
                    {invoice?.dueDate? <label>Due Date: {invoice?.dueDate} </label>: <label></label>}
                </Grid>
                <Grid xs={12} sm={12} style={{ backgroundColor: "#FFFFFF"}}>
                    <Table>
                        <TableHead style={{backgroundColor:'darkblue'}}>
                            <TableRow >
                                <TableCell style={{color:'white'}}>ITEM DESCRIPTION </TableCell>
                                <TableCell align="right" style={{color:'white'}}>QUANTITY</TableCell>
                                <TableCell align="right" style={{color:'white'}}>UNIT PRICE</TableCell>
                                <TableCell align="right" style={{color:'white'}}>AMOUNT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice?.invoiceDetails?.map(service => (
                                <TableRow key={service.id}>
                                    <TableCell >{service?.itemDescription}</TableCell>
                                    <TableCell align="right">{service?.quantity}</TableCell>
                                    <TableCell align="right">
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.unitPrice)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        {getSymbolFromCurrency(invoice?.currencyOfPayment)} {parseFloat(service?.amount)?.toFixed(2).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid xs={12} sm={6}>
                    <label style={{fontSize: "10px"}}>Remarks / Payment Instructions:</label><br/>
                    <div style={{border:'solid'}}>
                        <label style={{fontWeight: "bold", fontSize: "12px"}}>Bank Account Details</label><br/>
                        <label style={{fontSize: "12px"}}>{client?.clientName}</label><br/>
                        <label style={{fontSize: "10px"}}>Account No : {invoice?.bank?.accountNumber}</label><br/>
                        <label style={{fontSize: "10px"}}>Sort Code : {invoice?.bank?.sortCode}</label><br/>
                        <label style={{fontSize: "10px"}}> IBAN : {invoice?.bank?.accountIBAN}</label>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} style={{textAlign:"center"}}>
                    <label>VAT: {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat}</label><br/>
                    <label style={{ fontWeight: "bolder", fontSize: "16px"}}> Total:</label>
                    {/*<label style={{marginLeft: "122px", fontWeight: "bolder"}}>VAT &</label><br></br>*/}
                    <label style={{ fontWeight: "bolder"}}> </label>
                    <label style={{ fontWeight: "bolder"}}> </label>

                    <label style={{
                        height: "40px",
                        fontWeight: "bolder",
                        fontSize: "16px",
                        backgroundColor: "#ADD8E6"
                    }}>{getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total}</label>
                </Grid>

                <label style={{color: "red"}}> </label>
                <label> </label>
                <label> </label>
                <label> </label>

                <Grid xs={12} sm={12} style={{height: "16px", backgroundColor: "blue"}}></Grid>
                <Grid xs={12} sm={12} style={{height: "70px", backgroundColor: "#FFFFFF"}}></Grid>
            </Grid>
        );
    }
}
export default Invoice21;
