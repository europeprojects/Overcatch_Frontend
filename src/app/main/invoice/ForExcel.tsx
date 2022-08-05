import React from "react";
import ReactExport from "react-export-excel";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ForExcel(props){
    const {list}= props;
    const {t} = useTranslation("document");
    return (
            <ExcelFile element={ <Button
                fullWidth={true}
                variant="contained"
                color="secondary">
                {t('DOWNLOADEXCEL')}
            </Button>}>
                <ExcelSheet data={list} name="Expenses">
                    <ExcelColumn label="invoice type" value="cashInvoiceType"/>
                    <ExcelColumn label="currency" value="currencyOfPayment"/>
                    <ExcelColumn label="price" value="price"/>
                    <ExcelColumn label="Date" value="invoiceDate"/>
                </ExcelSheet>
            </ExcelFile>
        );
}
export default ForExcel;