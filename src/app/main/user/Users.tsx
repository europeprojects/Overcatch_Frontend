import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import UserDialog from './UserDialog';
import ContactsHeader from './ContactsHeader';
import ContactsList from './ContactsList';
import ContactsSidebarContent from './ContactsSidebarContent';
import reducer from './store';
import { getContacts } from './store/contactsSlice';
//import { getUserData } from './store/userSlice';

function Users(props:any) {
	const dispatch = useDispatch();

	const pageLayout = useRef(null);
	const routeParams = useParams();

	useDeepCompareEffect(() => {
		// @ts-ignore
		dispatch(getContacts());
		//dispatch(getUserData());
	}, [dispatch, routeParams]);

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 h-full',
					content: 'flex flex-col ',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					wrapper: 'min-h-0'
				}}
				header={<ContactsHeader pageLayout={pageLayout} />}
				content={<ContactsList />}
				//contentToolbar={<ContactsSidebarContent />}
				//sidebarInner
				ref={pageLayout}
				innerScroll
			/>

			<UserDialog />
		</>
	);
}

export default withReducer('contactsApp', reducer)(Users);
