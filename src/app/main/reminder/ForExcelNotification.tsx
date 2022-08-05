import React, {useEffect, useState} from "react";
import ReactExport from "react-export-excel";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import i18n from "i18next";
import api from "../../services/BackendApi";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ForExcelNotification(props){
    const {notificationExcel}= props;
    const {t} = useTranslation("task");

   const [list, setList] = useState([{
       companyName:"",
       name:"",
       surname:"",
       directorName :"",
       directorSurname:"",
       directorEmail : "",
       directorSecondName :"",
       directorSecondSurname:"",
       directorSecondEmail : ""
   }]);

   useEffect(()=>{

           setList([])
           for(let i = 0 ; i < notificationExcel?.length ; i++ ){
               let item = notificationExcel[i];

               if(item.company === null){
                   let temp = {
                       companyName : item?.founderOwner?.tradeAsName,
                       directorName: item?.founderOwner?.name,
                       directorSurname:item?.founderOwner?.surname,
                       directorEmail:item?.founderOwner?.email,
                       name : item?.customerClients[0]?.customerInfo?.userInfo?.name,
                       surname: item?.customerClients[0]?.customerInfo.userInfo?.surname
                   }
                   //@ts-ignore
                   setList((currentState) => [ ...currentState,temp]);
               }
               else if(item.company !== null){
                   let temp = {
                       companyName : item?.company?.name,
                       directorName: item?.company?.directorDetails[0]?.name,
                       directorSurname: item?.company?.directorDetails[0]?.surname,
                       directorEmail: item.company?.directorDetails[0]?.email,
                       directorSecondName :item?.company?.directorDetails[1]?.name,
                       directorSecondSurname:item?.company?.directorDetails[1]?.surname,
                       directorSecondEmail : item.company?.directorDetails[1]?.email,
                       name : item?.customerClients[0]?.customerInfo?.userInfo?.name,
                       surname: item?.customerClients[0]?.customerInfo?.userInfo?.surname
                   }
                   //@ts-ignore
                   setList((currentState) => [ ...currentState,temp]);
               }
           }

   },[notificationExcel]);

    function handleClick ()  {
        setTimeout(function(){
            window.location.reload();
        }, 4000);
    };

    // Bu .Tsx Yeni Eklendi .
    return (

        <ExcelFile
            element={
                <Button
                    onClick={()=> {handleClick()}}
                    color="primary"
                    variant="outlined"
                    startIcon={<InsertDriveFileIcon />}>
                    {t('EXCEL')}
                </Button>
            }
        >
            <ExcelSheet data={list} name="Notification List">
                <ExcelColumn label="Company Name" value="companyName"/>
                <ExcelColumn label="Name" value="name"/>
                <ExcelColumn label="Surname" value="surname"/>
                <ExcelColumn label="Director Name" value="directorName"/>
                <ExcelColumn label="Director Surname" value="directorSurname"/>
                <ExcelColumn label="Director Email" value="directorEmail"/>
                <ExcelColumn label="Second Director Name" value="directorSecondName"/>
                <ExcelColumn label="Second Director Surname" value="directorSecondSurname"/>
                <ExcelColumn label="Second Director Email" value="directorSecondEmail"/>
            </ExcelSheet>
        </ExcelFile>
    );
}
export default ForExcelNotification;