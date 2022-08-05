import React, {useEffect} from "react";
import ReactExport from "react-export-excel";
import Button from "@material-ui/core/Button";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ForIncomeExpenseExcel(props){
    const {expenseList, incomeList, bankList}= props;
    // useEffect(()=>{
    //     console.log(expenseList,"expensesList");
    //     console.log(incomeList,"incomeList");
    //     console.log(bankList,"bankList");
    // },[expenseList,incomeList,bankList])
    return (
        <ExcelFile element={
            <Button
            variant="outlined"
            color="secondary"
            className="ml-5 rounded-8"
        >
            DownLoad Excel
        </Button>}>
            <ExcelSheet data={incomeList} name="Incomes">
                <ExcelColumn label="invoice code" value="invoiceCode"/>
                <ExcelColumn label="invoice type" value="invoiceType"/>
                <ExcelColumn label="invoice total" value="total"/>
                <ExcelColumn label="invoice date" value="invoiceDate"/>
                <ExcelColumn label="invoice currency" value="currencyOfPayment"/>
                <ExcelColumn label="client" value={incomeList?.client?.id}/>
                <ExcelColumn label="email" value="clientEmail"/>
                <ExcelColumn label="phone" value="clientPhone"/>
                <ExcelColumn label="client name" value="buyerName"/>
            </ExcelSheet>
            <ExcelSheet data={expenseList} name="Expenses">
                <ExcelColumn label="invoice type" value="cashInvoiceType"/>
                <ExcelColumn label="currency" value="currencyOfPayment"/>
                <ExcelColumn label="price" value="price"/>
                <ExcelColumn label="Date" value="invoiceDate"/>
            </ExcelSheet>
            <ExcelSheet data={bankList} name="Bank Transaction Detail">
                <ExcelColumn label="invoice type" value="cashInvoiceType"/>
                <ExcelColumn label="currency" value="currencyOfPayment"/>
                <ExcelColumn label="price" value="price"/>
                <ExcelColumn label="Date" value="invoiceDate"/>
            </ExcelSheet>
        </ExcelFile>
    );
}
export default ForIncomeExpenseExcel;