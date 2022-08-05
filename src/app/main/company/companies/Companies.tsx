import withReducer from 'app/store/withReducer';
import React, { useEffect, useState } from 'react';
import api from 'app/services/BackendApi';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import CompanyList from "./CompanyList";
import CompanyListHeader from "./CompanyListHeader";
import {Client} from "../../../types/UserModel";

function Companies(props: any) {
	const [clientList, setClientList] = useState<Client[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(25);
	const [totalElements, setTotalElements] = React.useState(0);
	const [aggrementType, setAggrementType] = React.useState([])
	const [clientType, setClientType] = React.useState([])
	const [state, setState] = React.useState('')
	const [exist, setExist] = React.useState('')

	useEffect(()=>{
		setSearch("")
		setAggrementType([])
		setClientType([])
	},[])

	/*function handleClick(){
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage)
	}*/
	function handleChange(){
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage)
	}


	function handleClear(){

		setSearch("")
		setAggrementType([])
		setClientType([])
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage)
	}
	function getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage){
		api.getApplyCompaniesByFilter(aggrementType, clientType,exist , state, search).then(response => {
			setClientList(response);
			setClients(response);
			setTotalElements(response.totalElements);
		});
	}

	useEffect(() => {
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage);
	}, [aggrementType, clientType]);
	useEffect(() => {
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage);
	}, [page]);
	useEffect(() => {
		getCompaniesByFilter(aggrementType, clientType,exist , state,search, page, rowsPerPage);
	}, [rowsPerPage]);
	 function handleChangePage(page) {
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
