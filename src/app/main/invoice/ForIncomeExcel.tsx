import React, {useEffect} from "react";
import ReactExport from "react-export-excel";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ForIncomeExcel(props){
    const {list}= props;
    const {t} = useTranslation("document");
    useEffect(()=>{console.log(list,"list")},[list])
    return (
        <ExcelFile element={ <Button
            fullWidth={true}
            variant="contained"
            color="secondary">
            {t('DOWNLOADEXCEL')}
        </Button>}>
            <ExcelSheet data={list} name="Incomes">
                <ExcelColumn label="income type" value="cashInvoiceType"/>
                <ExcelColumn label="currency" value="currencyOfPayment"/>
                <ExcelColumn label="price" value="price"/>
                <ExcelColumn label="Date" value="invoiceDate"/>
            </ExcelSheet>
        </ExcelFile>
    );
}
export default ForIncomeExcel;