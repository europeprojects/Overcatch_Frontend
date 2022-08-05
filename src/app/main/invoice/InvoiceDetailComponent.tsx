import React, {useEffect} from 'react';
import {Grid, TextField} from "@material-ui/core";
import {Client, InvoiceDetail} from "../../types/UserModel";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
        />
    );
}


export type InvoiceDetailComponentProps = {
    invoiceDetailList: InvoiceDetail[];
    setInvoiceDetailList: any
    total: number
    subtotal: number
    vatAmount: number
    setTotal: any
    setSubTotal: any
    setVatAmount: any
    index: number
    client: Client
}
function InvoiceDetailComponent({
                                    invoiceDetailList,
                                    setInvoiceDetailList,
                                    index,
                                    total,
                                    subtotal,
                                    vatAmount,
                                    setTotal,
                                    setSubTotal,
                                    setVatAmount,
                                    client
                                }: InvoiceDetailComponentProps) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newArr = [...invoiceDetailList];
        newArr[index] = {...newArr[index], [event.target.name]: event.target.value};
        setInvoiceDetailList(newArr);
    };
    const {t} = useTranslation('task');

    useEffect(()=>{
        let vatAmount;
        let amount;
        let quantity = invoiceDetailList[index].quantity
        let unitPrice = invoiceDetailList[index].unitPrice
        let vatRate = invoiceDetailList[index].vatRate
        if(quantity===undefined){
            invoiceDetailList[index].quantity=1;
            quantity=1;
        }
        if(quantity===undefined){
            invoiceDetailList[index].unitPrice=1;
            unitPrice=1;
        }
        if(quantity===undefined){
            invoiceDetailList[index].vatRate=0;
            vatRate=0;
        }
        if (quantity!==undefined && unitPrice!==undefined && vatRate!== undefined && vatRate<=100 && vatRate>=0 ){
            vatAmount = ((unitPrice / 100) * vatRate) * quantity;
            amount = (quantity * unitPrice) + vatAmount;
            let items = [...invoiceDetailList];
            let item = {...items[index]};
            item.amount = amount;
            item.vatAmount =vatAmount;
            items[index] = item;
            setInvoiceDetailList(items)
        }else{
            let items = [...invoiceDetailList];
            let item = {...items[index]};
            item.amount = amount;
            item.vatAmount =vatAmount;
            items[index] = item;
            setInvoiceDetailList(items)
        }
        },[invoiceDetailList[index].quantity,invoiceDetailList[index].unitPrice,invoiceDetailList[index].vatRate])

    return (
        <div className={"py-4"}>
                {((client?.vatNumber != "" && client?.vatNumber != null) || (client?.company?.vatNumber!="" && client?.company?.vatNumber!=null))?(
                    <Grid container spacing={1}
                          direction="row"
                          justify="space-between"
                          alignItems="flex-start"
                    >
                    <Grid item xs={12} sm={3}>
                        <TextField
                            onChange={handleChange}
                            required={true}
                            name={"itemDescription"}
                            id="item-description"
                            label={t('ITEMDESCRIPTION')}
                            variant="outlined"
                            value={invoiceDetailList[index].itemDescription}
                            fullWidth={true}
                            className={"object-center"}
                            size={"small"}
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <TextField
                        onChange={handleChange}
                        required={true}
                        name={"quantity"}
                        id="quantity"
                        label={t('INVOICEQUANTITY')}
                        variant="outlined"
                        value={invoiceDetailList[index].quantity}
                        fullWidth={true}
                        className={"object-center"}
                        size={"small"}
                        type={"number"}
                        InputProps={{inputProps: {min: 1}}}
                        InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                        onChange={handleChange}
                        required={true}
                        name={"unitPrice"}
                        id="formatted-numberformat-input"
                        label={t('INVOICEUNITPRICE')}
                        variant="outlined"
                        value={invoiceDetailList[index].unitPrice}
                        fullWidth={true}
                        className={"object-center"}
                        size={"small"}
                        //type={"number"}
                        InputProps={{
                            inputProps: {min: 0},
                            inputComponent: NumberFormatCustom as any,
                        }}
                        InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                        <TextField
                        onChange={handleChange}
                        name={"vatRate"}
                        id="vat-rate"
                        label={t('INVOICEVATRATE')}
                        variant="outlined"
                        value={invoiceDetailList[index].vatRate}
                        fullWidth={true}
                        className={"object-center"}
                        size={"small"}
                        type={"number"}
                        InputProps={{inputProps: {min: 0, max:100}
                        }}
                        InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                        onChange={handleChange}
                        disabled={true}
                        name={"vatAmount"}
                        id="vat-amount"
                        label={t('INVOICEVATAMOUNT')}
                        variant="outlined"
                        value={invoiceDetailList[index].vatAmount?.toFixed(2)}
                        fullWidth={true}
                        className={"object-center"}
                        size={"small"}
                        type={"number"}
                        InputLabelProps={{shrink: true}}
                        InputProps={{inputProps: {min: 0}}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                        onChange={handleChange}
                        disabled={true}
                        required={true}
                        name={"amount"}
                        id="amount"
                        label={t('AMOUNT')}
                        variant="outlined"
                        value={invoiceDetailList[index]?.amount}
                        size={"small"}
                        fullWidth={true}
                        className={"object-center"}
                        //type={"number"}
                        InputLabelProps={{shrink: true}}
                        InputProps={{inputProps: {min: 0},
                            inputComponent: NumberFormatCustom as any,
                        }}
                        />
                    </Grid>
                    </Grid>):(<Grid container spacing={1}
                                    direction="row"
                                    justify="space-between"
                                    alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            onChange={handleChange}
                            required={true}
                            name={"itemDescription"}
                            id="item-description"
                            label={t('ITEMDESCRIPTION')}
                            variant="outlined"
                            value={invoiceDetailList[index].itemDescription}
                            fullWidth={true}
                            className={"object-center"}
                            size={"small"}
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            onChange={handleChange}
                            required={true}
                            name={"quantity"}
                            id="quantity"
                            label={t('INVOICEQUANTITY')}
                            variant="outlined"
                            value={invoiceDetailList[index].quantity}
                            fullWidth={true}
                            className={"object-center"}
                            size={"small"}
                            type={"number"}
                            InputProps={{inputProps: {min: 1}}}
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            onChange={handleChange}
                            required={true}
                            name={"unitPrice"}
                            id="formatted-numberformat-input"
                            label={t('INVOICEUNITPRICE')}
                            variant="outlined"
                            value={invoiceDetailList[index].unitPrice}
                            fullWidth={true}
                            className={"object-center"}
                            size={"small"}
                            //type={"number"}
                            InputProps={{
                                inputProps: {min: 0},
                                inputComponent: NumberFormatCustom as any,
                            }}
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            onChange={handleChange}
                            disabled={true}
                            required={true}
                            name={"amount"}
                            id="amount"
                            label={t('AMOUNT')}
                            variant="outlined"
                            value={invoiceDetailList[index]?.amount}
                            size={"small"}
                            fullWidth={true}
                            className={"object-center"}
                            //type={"number"}
                            InputLabelProps={{shrink: true}}
                            InputProps={{inputProps: {min: 0},
                                inputComponent: NumberFormatCustom as any,
                            }}
                        />
                    </Grid>
                </Grid>)}
        </div>
    );
}

export default InvoiceDetailComponent;