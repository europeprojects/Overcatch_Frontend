import React, { useEffect, useState } from 'react';
import api from 'app/services/BackendApi';
import { useDispatch, useSelector } from 'react-redux';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import { Client } from '../../../types/UserModel';
import CompanyTable from '../companyApplications/CompanyTable';
import { useTranslation } from 'react-i18next';
import CompanyApplicationsHeader from './CompanyApplicationsHeader';
import _ from 'lodash';

function CompanyApplications(props: any) {
	const [clientList, setClientList] = useState<Client[]>([]);
	const dispatch = useDispatch();
	const { t } = useTranslation('companyApplications');
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState<string>('');
	const [clientType, setClientType] = React.useState([]);
	const [agreementType, setAgreementType] = React.useState([]);
	const [existing, setExisting] = React.useState('');
	const [state, setState] = React.useState('');

	function getApplyCompaniesByFilter() {
		api.getApplyCompaniesByFilter(agreementType?.length < 1 ? "" : agreementType?.toString(), clientType?.length < 1 ? "" : clientType?.toString(), existing, state, search).then(response => {
			setLoading(false);
			setClientList(_.orderBy(response,'id','desc'));
		});
	}

	function getApplyCompanies() {
		api.getApplyCompanies().then(response => {
			setLoading(false);
			setClientList(response);
		});
	}

	// useEffect(() => {
	// 	getApplyCompanies();
	// }, []);

	useEffect(() => {
		getApplyCompaniesByFilter();
	}, [clientType, agreementType, existing, state]);

	/*function handleClick() {
		getApplyCompaniesByFilter();
	}*/
	function handleChange() {
		getApplyCompaniesByFilter();
	}

	function handleClear() {
		setSearch('');
		setClientType([]);
		setAgreementType([]);
		setState('');
		setExisting('');
		getApplyCompaniesByFilter();
	}

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				<CompanyApplicationsHeader
					search={search}
					setSearch={setSearch}
					handleChange={handleChange}
					handleClear={handleClear}
				/>
			}
			content={
				<CompanyTable
					search={search}
					clients={clientList}
					clientType={clientType}
					setClientType={setClientType}
					agreementType={agreementType}
					setAgreementType={setAgreementType}
					existing={existing}
					setExisting={setExisting}
					state={state}
					setState={setState}
				/>
			}
		/>
	);
}
export default CompanyApplications;
