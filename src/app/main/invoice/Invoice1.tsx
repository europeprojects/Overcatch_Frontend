import React from 'react';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import getSymbolFromCurrency from "currency-symbol-map";
import config from "../../services/Config";

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
        maxWidth: 300,
        width:300,
    },
    paper: {
        // padding : "30px",
        textAlign: 'center',
        height:"841px",
        width:"580px",
        backgroundColor: "#FFFFFF",
    },
}));

function Invoice1(props) {
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
            // <div style={{width:"595px",minHeight:"842px",marginLeft:"200px",paddingTop:"10px", backgroundColor: "#FFFFFF"}}>
            <div
                className={classes.paper} >
                <Grid id='divToPrint' container style={{padding:"30px", paddingRight:"45px", border:'solid'}}>
                    <Grid xs={12} sm={3}></Grid>
                    <Grid item xs={12} sm={6} alignContent={"center"} style={{marginBottom:'20px'}}>
                        <img className="w-160" src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                    </Grid>
                    <Grid xs={12} sm={3}></Grid>
                    <Grid container>
                        <Grid xs={12} sm={6} style={{textAlign:"left",}}>
                            <label style={{fontWeight:"bolder"}}>Bill to:</label><br/>
                            <label style={{fontWeight:"bolder"}}>{invoice?.buyerName}</label><br/>
                            <label style={{fontWeight:"bolder"}}>{invoice?.buyerAddress}</label><br/>
                            <label style={{fontWeight:"bolder"}}>{invoice?.buyerPhone}</label><br/>
                            <label style={{fontWeight:"bolder"}}>{invoice?.buyerEmail}</label><br/>
                        </Grid>
                        <Grid xs={12} sm={1}></Grid>
                        <Grid xs={12} sm={5} style={{textAlign:"left",}}>
                            <label style={{fontWeight:"bolder"}}>Invoice No:{invoice?.invoiceCode}</label><br/>
                            <label style={{fontWeight:"bolder"}}>Invoice Date:{invoice?.invoiceDate}</label><br/>
                            {invoice?.dueDate? <label>Due Date: {invoice?.dueDate} </label>:<label></label>}
                        </Grid>
                    </Grid>
                    <Grid xs={12} sm={12}  style={{ marginRight:"20px"}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:"175px"}}>DESCRIPTION </TableCell>
                                    <TableCell style={{width:"75px"}} align="right">QUANTITY</TableCell>
                                    <TableCell  style={{width:"150px"}} align="right">UNIT PRICE</TableCell>
                                    <TableCell style={{width:"75px"}} align="right">AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoice?.invoiceDetails?.map(service => (
                                    <TableRow key={service.id}>
                                        <TableCell align="left">{service?.itemDescription}</TableCell>
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
                    <Grid xs={12}sm={6} style={{borderTopStyle: "solid",
                        borderTopWidth: "5px",
                        textAlign:"left"}}><br/>
                        {/*<label style={{ fontWeight: "bolder", textDecoration: "underline"}}>Due Date:{invoice?.dueDate}</label><br/><br/>*/}
                        <label style={{fontWeight: "bolder"}}>Payment Info</label><br/><br/>
                        <label style={{fontWeight: "bold", textDecoration: "underline"}}>
                            Bank Account:{invoice?.bank?.accountNumber}</label><br/>
                        <label style={{fontWeight: "bold", textDecoration: "underline"}}>
                            Sort Code:{invoice?.bank?.sortCode}</label><br/>
                        <label style={{fontWeight: "bold", textDecoration: "underline"}}>
                            IBAN :{invoice?.bank?.accountIBAN}</label><br/>
                    </Grid>
                    <Grid xs={12}sm={6} style={{borderTopStyle: "solid",
                        borderTopWidth: "5px",
                        textAlign:"right"}}>
                        {/*<label>VAT Total: {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</label><br/><br/>*/}
                        <label style={{ fontWeight: "bolder", textDecoration: "underline", textAlign:'center'}}>
                            Total : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}
                        </label><br/>
                    </Grid>

                    <Grid xs={12} sm={12}style={{
                        paddingTop: "20px",
                        borderBottomStyle: "solid",
                        borderBottomWidth: "5px",
                        textAlign:"center"
                    }}>
                        <label style={{fontWeight: "bolder", fontSize: "14px"}}>THANK YOU FOR CHOOSING
                            US…</label>
                    </Grid>
                    <Grid xs={12} sm={12} style={{textAlign:"center"}}>
                        <label>{invoice?.clientAddress}</label><br/>
                        <label style={{width: "300px", textAlign: "center"}}>{invoice?.clientEmail}</label><br/>
                        <label style={{width: "300px", textAlign: "center"}}>{invoice?.clientPhone}</label><br/>
                        <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                    </Grid>
                </Grid>
            </div>
        );
    }
    else{
        return (
            <div
                className={classes.paper} >
                <Grid id='divToPrint' container style={{padding:"30px", paddingRight:"45px", border:'solid'}}>
                    <Grid xs={12} sm={3}></Grid>
                    <Grid item xs={12} sm={6} alignContent={"center"} style={{marginBottom:'20px'}}>
                        <img className="w-160" src={getDocumentUrlByFileName(client?.clientFileName)} alt="logo"/>
                    </Grid>
                    <Grid xs={12} sm={3}></Grid>
                    <Grid container>
                        <Grid xs={12} sm={6} style={{textAlign:"left",}}>
                        <label style={{fontWeight:"bolder"}}>Bill to:</label><br/>
                        <label style={{fontWeight:"bolder"}}>{invoice?.buyerName}</label><br/>
                        <label style={{fontWeight:"bolder"}}>{invoice?.buyerAddress}</label><br/>
                        <label style={{fontWeight:"bolder"}}>{invoice?.buyerPhone}</label><br/>
                        <label style={{fontWeight:"bolder"}}>{invoice?.buyerEmail}</label><br/>
                        </Grid>
                        <Grid xs={12} sm={1}></Grid>
                        <Grid xs={12} sm={5} style={{textAlign:"left",}}>
                        <label style={{fontWeight:"bolder"}}>Invoice No:{invoice?.invoiceCode}</label><br/>
                        <label style={{fontWeight:"bolder"}}>Invoice Date:{invoice?.invoiceDate}</label><br/>
                            {invoice?.dueDate? <label>Due Date: {invoice?.dueDate} </label>:<label></label>}
                        </Grid>
                    </Grid>
                    <Grid xs={12} sm={12}  style={{ marginRight:"20px"}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:"175px"}}>DESCRIPTION </TableCell>
                                    <TableCell style={{width:"75px"}} align="right">QUANTITY</TableCell>
                                    <TableCell  style={{width:"150px"}} align="right">UNIT PRICE</TableCell>
                                    <TableCell style={{width:"75px"}} align="right">AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoice?.invoiceDetails?.map(service => (
                                    <TableRow key={service.id}>
                                        <TableCell align="left">{service?.itemDescription}</TableCell>
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
                    <Grid xs={12}sm={6} style={{borderTopStyle: "solid",
                        borderTopWidth: "5px",
                        textAlign:"left"}}><br/>
                        {/*<label style={{ fontWeight: "bolder", textDecoration: "underline"}}>Due Date:{invoice?.dueDate}</label><br/><br/>*/}
                        <label style={{fontWeight: "bolder"}}>Payment Info</label><br/><br/>
                        <label style={{fontWeight: "bold", textDecoration: "underline"}}>
                            Bank Account:{invoice?.bank?.accountNumber}</label><br/>
                        <label style={{fontWeight: "bold", textDecoration: "underline"}}>
                            Sort Code:{invoice?.bank?.sortCode}</label><br/>
                        <label style={{fontWeight: "bold", textDecoration: "underline"}}>
                            IBAN :{invoice?.bank?.accountIBAN}</label><br/>
                    </Grid>
                    <Grid xs={12}sm={6} style={{borderTopStyle: "solid",
                        borderTopWidth: "5px",
                        textAlign:"right"}}>
                        <label>VAT Total: {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat?.toFixed(2)}</label><br/><br/>
                        <label style={{ fontWeight: "bolder", textDecoration: "underline", textAlign:'center'}}>
                            Total : {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total?.toFixed(2)}
                        </label><br/>
                    </Grid>

                    <Grid xs={12} sm={12}style={{
                        paddingTop: "20px",
                        borderBottomStyle: "solid",
                        borderBottomWidth: "5px",
                        textAlign:"center"
                    }}>
                        <label style={{fontWeight: "bolder", fontSize: "14px"}}>THANK YOU FOR CHOOSING
                            US…</label>
                    </Grid>
                    <Grid xs={12} sm={12} style={{textAlign:"center"}}>
                        <label>{invoice?.clientAddress}</label><br/>
                        <label style={{width: "300px", textAlign: "center"}}>{invoice?.clientEmail}</label><br/>
                        <label style={{width: "300px", textAlign: "center"}}>{invoice?.clientPhone}</label><br/>
                        <label style={{fontWeight: "bolder"}}>{invoice?.web}</label><br/>
                    </Grid>
                </Grid>
            </div>

        );
    }
}

export default Invoice1;
