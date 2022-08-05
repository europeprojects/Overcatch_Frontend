import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import ApplicationTask from './ApplicationTask';
import history from "../../../../@history/@history";
import LetterTask from "../components/LetterTask";
import InvoiceUpdate from "../components/InvoiceUpdate";
import ExpenseDelete from "../components/ExpenseDelete";
import ExpenseUpdate from "../components/ExpenseUpdate";
import IncomeDelete from "../components/IncomeDelete";
import IncomeUpdate from "../components/IncomeUpdate"

function TaskDetailSelective(props: any) {
    //@ts-ignore
    const routeParams = useParams();
    //@ts-ignore
    const { taskid} = routeParams;
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    const taskId=window.atob(taskid);
    // let [moduleType,setModuleType] = React.useState("TEST");
    const [loading, setLoading] = useState(true);

    // useEffect(()=> {
    //
    //     console.log(taskid);
    //     api.getModuleType(window.atob(taskid)).then(response => {
    //         // setLetter2(response)
    //         // const {letter} = response;
    //         setModuleType(moduleType);
    //         console.log(response)
    //
    //         setLoading(false);
    //     })
    // },[])
    useEffect(()=> {
        if(routingData?.moduleType === undefined){
            history.push("/tasks/list/"+window.btoa("ADMIN"))
        }
        console.log(taskId);
    },[])
    // useEffect(() => {
    //     // @ts-ignore
    //     const { taskid } = routeParams;
    //     // @ts-ignore
    //     if (window.atob(taskid)){
    //         api.getClient(parseInt(window.atob(taskid))).then(response => {
    //             setClient(response);
    //             const {company, addressList, customerClients, founderOwner, documents} = response;
    //             setCustomerClients(customerClients);
    //
    //             if (company != null) {
    //
    //                 const {directorDetails} = company;
    //                 setDirectorDetails(directorDetails);
    //             }
    //             // setFormState(directorDetails[0]);
    //             setDocumentsList(documents)
    //             if (founderOwner != null) {
    //                 setFounderOwner(founderOwner);
    //             } else {
    //                 setCompany(company)
    //             }
    //             console.log(customerClients);
    //
    //             customerClients.map(customerResponse => {
    //                 console.log(customerResponse.customerInfo);
    //                 customerResponse.customerInfo.userInfo.brpExpireDate = customerResponse.customerInfo.brpExpireDate;
    //                 customerResponse.customerInfo.userInfo.brpNumber = customerResponse.customerInfo.brpNumber;
    //                 customerResponse.customerInfo.userInfo.payment = response.payment;
    //                 setUsers([...users, customerResponse?.customerInfo.userInfo]);
    //             });
    //             setAddressList(addressList);
    //         });
    //     } else {
    //         history.push("/tasks/list/"+window.btoa("ADMIN"))
    //     }
    //
    //
    // }, [])

    return (
        <div className="w-full h-full">
            {/*@ts-ignore*/}
            {routingData?.moduleType.toString() === "COMPANY_CREATE" && (<ApplicationTask taskid={taskid}></ApplicationTask>)}
            {routingData?.moduleType.toString() === "LETTER_MODULE" && (<LetterTask taskid={taskid}></LetterTask>)}
            {routingData?.moduleType.toString() === "INVOICE_UPDATE" && (<InvoiceUpdate taskid={taskid}></InvoiceUpdate>)}
            {routingData?.moduleType.toString() === "INVOICE_DELETE" && (<InvoiceUpdate taskid={taskid}></InvoiceUpdate>)}
            {routingData?.moduleType.toString() === "EXPENSE_DELETE" && (<ExpenseDelete taskid={taskid}></ExpenseDelete>)}
            {routingData?.moduleType.toString() === "EXPENSE_UPDATE" && (<ExpenseUpdate taskid={taskid}></ExpenseUpdate>)}
            {routingData?.moduleType.toString() === "INCOME_UPDATE" && (<IncomeUpdate taskid={taskid}></IncomeUpdate>)}
            {routingData?.moduleType.toString() === "INCOME_DELETE" && (<IncomeDelete taskid={taskid}></IncomeDelete>)}
        </div>
    );
}

export default TaskDetailSelective;
