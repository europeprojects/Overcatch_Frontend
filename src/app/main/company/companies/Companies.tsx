import withReducer from 'app/store/withReducer';
import React, { useEffect, useState } from 'react';
import api from 'app/services/BackendApi';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import CompanyList from "./CompanyList";
import CompanyListHeader from "./CompanyListHeader";
import {Client} from "../../../types/UserModel";


function Companies(props: any) {
	const [clientList, setClientList] = useState<Client[]>([]);
	const [clientListResult, setClientListResult] = useState<Client[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(25);
	const [totalElements, setTotalElements] = React.useState(0);
	const [aggrementType, setAggrementType] = React.useState([])
	const [clientType, setClientType] = React.useState([])
	const [state, setState] = React.useState('')
	const [exist, setExist] = React.useState('')

/* 	useEffect(()=>{
		setSearch("")
		setAggrementType([])
		setClientType([])
	},[]) */

	/*function handleClick(){
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage)
	}*/
	function handleChange(){
		console.log("******handleChange")
		console.log("**** client list length", clientList.length)
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage) 
	}
//directorDetails,name,clientName,addressList
	let findContent = (jsonArr, searchedItem) => {
		const result =  ["name","clientName"]
		
		  if(result.length > 0){
			setClientList(result as unknown as Client[])
		  }
	 
	 console.log("fuseresult---------",result)
	 console.log("CLİENT LİST SETLENİYOR",result.length)
	}

	const findInArray = (array, searchRegExp, fields) => {
		return array.filter((item) => {
			// returs true if at least one of fields value match to regexp
			return fields.map((field) => searchRegExp.test(item[field])).some(search);
		});
	};
	
	function handleClear(){
		console.log("CLEARRRRRR------------------------------")
setClientList(clientListResult)
		setSearch("")
		setAggrementType([])
		setClientType([])
		//getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage)
	}
	function getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage){
		
	if(clientList.length === 0){
		console.log("******getCompaniesByFilterSEARCH",search)
		console.log("******getCompaniesByFilterAGREMENTYPE",aggrementType)
		console.log("******getCompaniesByFilterCLİENTTYPE",clientType)
		api.getApplyCompaniesByFilter(aggrementType, clientType,exist , state, search).then(response => {
			console.log("******NEW SEARCH",search)
			console.log(findInArray(clientList, /EMRE/, ["Id", "Name"]));
			console.log("",response[0])
			
			console.log("******response--------------------------------",response.length)
			setClientList(response);
			setClientListResult(response)
			console.log("*****setClientList(response)")
			setClients(response);
			console.log("******setClients(response);")
			setTotalElements(response.totalElements);
			console.log("*****setTotalElements(response.totalElements);")
		});

	}
	else {
		console.log("CLİEN LİST DOLUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU=>",clientList.length)
		//findContent(clientList,search)
		const filteredArray = clientList.filter((row) => {
			let rest = row.clientName?.toLowerCase().includes(search.toLowerCase());
			if(!rest){
				
				return row.company?.directorDetails[0]?.name?.toLowerCase().includes(search.toLowerCase());
			}
			else{
				return rest;
			}
		  });
		  if(filteredArray.length > 0){
			setClientList(filteredArray);
		  }
		 
		console.log("------filteredArray-----",filteredArray.length)
	
	}
		
	}

useEffect(()=> {
	handleChangePage(page);
	console.log("*****RENDER RENDER RENDER******************",search)
},[])

	/* useEffect(() => {
		console.log("*****USEEFFECT")
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage);
	}, [aggrementType, clientType]); */
	
	 function handleChangePage(page) {
		console.log("*******HANDLECHANGEPAGE")

		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage);
	 }
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<CompanyListHeader search={search}
									   setSearch={setSearch}
									   handleChange={handleChange}
									   handleClear={handleClear}/> }
			content={<CompanyList search={search}
				                  clients={clientList}
								  totalElements={totalElements}
								  aggrementType={aggrementType}
								  setAggrementType={setAggrementType}
								  clientType={clientType}
								  setClientType={setClientType}
								  handleChangePage={handleChangePage} />}
			innerScroll
		/>
	);
}

export default withReducer('documentsApp')(Companies);
