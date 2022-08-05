import React, {useEffect, useState} from 'react';
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import {Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
import clsx from "clsx";
import {Invoice} from "../../types/UserModel";
import {makeStyles} from '@material-ui/core/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import api from "../../services/BackendApi";
import {useSelector} from "react-redux";
import history from '@history';
import getSymbolFromCurrency from "currency-symbol-map";
import moment from "moment";
import Pdf from "react-to-pdf";




const useStyles = makeStyles(theme => ({
    root: {
        background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 0%)`
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


function InvoicePrintDialog(props) {
    const classes = useStyles();
    //@ts-ignore
    const routingData = history.location.displayRouteData;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    const {client}=props;
    const {invoice}= props;
    const ref = React.createRef<HTMLDivElement>();
    return (
        <div id='divToPrint'>
        <FuseAnimate animation={{translateY: [0, '100%']}} duration={600} delay={200}>

            <Card  className="mx-auto w-xl print:w-full print:p-8 print:shadow-none rounded-8">
                <CardContent className="p-88 print:p-0">
                    <div className="App">
                        <div  ref={ref}>
                            <Pdf  targetRef={ref} filename="MyInvoice.pdf" >
                                {({ toPdf }) => <button  onClick={toPdf}>****</button>}
                            </Pdf>
                            <Typography color="textSecondary" className="mb-32">
                                {moment(invoice?.invoiceDate).format('DD-MM-YYYY')}
                            </Typography>


                            <div className="flex justify-between">
                                <div>
                                    <table className="mb-16">
                                        <tbody>
                                        <tr>
                                            <td className="pb-4">
                                                <Typography
                                                    className="font-light"
                                                    variant="h6"
                                                    color="textSecondary"
                                                >
                                                    INVOICE
                                                </Typography>
                                            </td>
                                            <td className="pb-4 px-16">
                                                <Typography className="font-light" variant="h6">
                                                    {invoice?.invoiceCode}
                                                </Typography>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <Typography color="textSecondary">INVOICE DATE</Typography>
                                            </td>
                                            <td className="px-16">
                                                <Typography>{moment(invoice?.invoiceDate).format('DD-MM-YYYY')}</Typography>
                                            </td>
                                        </tr>

                                        {invoice?.dueDate && (
                                            <tr>
                                                <td>
                                                    <Typography color="textSecondary">DUE DATE</Typography>
                                                </td>
                                                <td className="px-16">
                                                    <Typography>{moment(invoice?.dueDate).format('DD-MM-YYYY')}</Typography>
                                                </td>
                                            </tr>
                                        )}

                                        </tbody>
                                    </table>

                                    <Typography color="textSecondary">{invoice?.buyerName}</Typography>

                                    {invoice?.buyerAddress && (
                                        <Typography color="textSecondary">{invoice?.buyerAddress}</Typography>
                                    )}
                                    {invoice?.buyerPhone && (
                                        <Typography color="textSecondary">{invoice?.buyerPhone}</Typography>
                                    )}
                                    {invoice?.buyerEmail && (
                                        <Typography color="textSecondary">{invoice?.buyerEmail}</Typography>
                                    )}
                                    {/*{invoice.client.website && (*/}
                                    {/*    <Typography color="textSecondary">{invoice.buyer}</Typography>*/}
                                    {/*)}*/}
                                </div>

                                <div className={clsx(classes.seller, 'flex items-center p-16')}>
                                    <img className="w-80" src={`data:image/jpeg;base64,${invoice?.clientLogo}`}
                                         alt="logo"/>

                                    <div className={clsx(classes.divider, 'w-px mx-8 h-96 opacity-50')}/>

                                    <div className="px-8">
                                        <Typography color="inherit">{client?.clientName}</Typography>

                                        {invoice?.invoiceAddress && (
                                            <Typography color="inherit">{invoice?.clientAddress}</Typography>
                                        )}
                                        {invoice?.clientEmail && (
                                            <Typography color="inherit">{invoice?.clientEmail}</Typography>
                                        )}
                                        {invoice?.clientPhone && (
                                            <Typography color="inherit">{invoice?.clientPhone}</Typography>
                                        )}
                                        {/*{invoice.from.website && (*/}
                                        {/*    <Typography color="inherit">{invoice.from.website}</Typography>*/}
                                        {/*)}*/}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-64">
                                <Table className="simple">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>SERVICE</TableCell>
                                            {/*<TableCell>UNIT</TableCell>*/}
                                            <TableCell align="right">UNIT PRICE</TableCell>
                                            <TableCell align="right">QUANTITY</TableCell>
                                            <TableCell align="right">VAT RATE</TableCell>
                                            <TableCell align="right">VAT AMOUNT</TableCell>
                                            <TableCell align="right">TOTAL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice?.invoiceDetails?.map(service => (
                                            <TableRow key={service.id}>
                                                <TableCell>
                                                    <Typography
                                                        variant="subtitle1">{service?.itemDescription}</Typography>
                                                </TableCell>
                                                {/*<TableCell>{service.amount}</TableCell>*/}
                                                <TableCell align="right">
                                                    {getSymbolFromCurrency(invoice?.currencyOfPayment)} {service?.unitPrice}
                                                </TableCell>
                                                <TableCell align="right">{service?.quantity}</TableCell>
                                                <TableCell align="right">{service?.vatRate}</TableCell>
                                                <TableCell align="right">{service?.vatAmount}</TableCell>
                                                <TableCell align="right">{getSymbolFromCurrency(invoice?.currencyOfPayment)}{service?.amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Table className="simple mt-32">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    className="font-medium"
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    SUBTOTAL
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    className="font-medium"
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.subTotal}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    className="font-medium"
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    TAX
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    className="font-medium"
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.vat}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {/*<TableRow>*/}
                                        {/*    <TableCell>*/}
                                        {/*        <Typography*/}
                                        {/*            className="font-medium"*/}
                                        {/*            variant="subtitle1"*/}
                                        {/*            color="textSecondary"*/}
                                        {/*        >*/}
                                        {/*            DISCOUNT*/}
                                        {/*        </Typography>*/}
                                        {/*    </TableCell>*/}
                                        {/*    <TableCell align="right">*/}
                                        {/*        <Typography*/}
                                        {/*            className="font-medium"*/}
                                        {/*            variant="subtitle1"*/}
                                        {/*            color="textSecondary"*/}
                                        {/*        >*/}
                                        {/*            {formatter.format(invoice.total)}*/}
                                        {/*        </Typography>*/}
                                        {/*    </TableCell>*/}
                                        {/*</TableRow>*/}
                                        <TableRow>
                                            <TableCell>
                                                <Typography className="font-light" variant="h4" color="textSecondary">
                                                    TOTAL
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography className="font-light" variant="h4" color="textSecondary">
                                                    {getSymbolFromCurrency(invoice?.currencyOfPayment)}{invoice?.total}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mt-96">


                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <img className="w-32" src={`data:image/jpeg;base64,${invoice?.clientLogo}`}
                                             alt="logo"/>
                                    </div>
                                    <div>
                                        <table className="mb-16">
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <Typography color="textSecondary">COMPANY NUMBER</Typography>
                                                </td>
                                                <td className="px-16">
                                                    <Typography>{invoice?.companyNumber}</Typography>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Typography color="textSecondary">BANK NAME</Typography>
                                                </td>
                                                <td className="px-16">
                                                    <Typography>{invoice?.bankName}</Typography>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pb-4">
                                                    <Typography
                                                        color="textSecondary"
                                                    >
                                                        ACCOUNT NUMBER
                                                    </Typography>
                                                </td>
                                                <td className="pb-4 px-16">
                                                    <Typography>
                                                        {invoice?.accountNumber}
                                                    </Typography>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Typography color="textSecondary">SORT CODE</Typography>
                                                </td>
                                                <td className="px-16">
                                                    <Typography>{invoice?.sortCode}</Typography>
                                                </td>
                                            </tr>
                                            {invoice?.iban && (
                                                <tr>
                                                    <td>
                                                        <Typography color="textSecondary">IBAN</Typography>
                                                    </td>
                                                    <td className="px-16">
                                                        <Typography>{invoice?.iban}</Typography>
                                                    </td>
                                                </tr>
                                            )}

                                            </tbody>
                                        </table>
                                    </div>
                                    {/*<Typography*/}
                                    {/*    className="font-medium mb-64 px-24"*/}
                                    {/*    variant="caption"*/}
                                    {/*    color="textSecondary"*/}
                                    {/*>*/}
                                    {/*    In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac*/}
                                    {/*    congue dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet*/}
                                    {/*    facilisis pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus*/}
                                    {/*    dapibus. Etiam at felis volutpat est mollis lacinia. Mauris placerat sem sit*/}
                                    {/*    amet velit mollis, in porttitor ex finibus. Proin eu nibh id libero tincidunt*/}
                                    {/*    lacinia et eget eros.*/}
                                    {/*</Typography>*/}
                                </div>
                                {invoice?.dueDate && (<Typography className="mb-24 print:mb-12" variant="body1">
                                    Please pay until {invoice?.dueDate} . Thank you for your business.
                                </Typography>)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </FuseAnimate>
        </div>

    );
}
export default InvoicePrintDialog;