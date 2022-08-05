import withReducer from 'app/store/withReducer';
import React, { useEffect, useState } from 'react';
import api from 'app/services/BackendApi';
import { useDispatch, useSelector } from 'react-redux';
import DocumentHeader from './components/DocumentHeader';
import FusePageCarded from '../../../@fuse/core/FusePageCarded/FusePageCarded';
import DocumentsList from './components/DocumentList';
import { DocumentInfo } from '../../types/UserModel';

function Documents(props: any) {
	const [documentList, setDocumentList] = useState<DocumentInfo[]>([]);
	const dispatch = useDispatch();
	const clientId = useSelector(({company}) => company.currentCompanyId);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		api.getDocuments(clientId).then(response => {
			setLoading(false);
			setDocumentList(response);
		});
	}, []);


	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<DocumentHeader />}
			content={

				<DocumentsList documents={documentList} />}
			innerScroll
		/>
	);
}

export default withReducer('documentsApp')(Documents);
