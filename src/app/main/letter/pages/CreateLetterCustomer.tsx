import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import React, {useRef, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import UserDialog from '../../user/UserDialog';
import ContactsHeader from '../../user/ContactsHeader';
import ContactsList from '../../user/ContactsList';
import ContactsSidebarContent from '../../user/ContactsSidebarContent';
import reducer from '../../user/store';
import { getContacts } from '../../user/store/contactsSlice';
import {Button} from "@material-ui/core";
import CreateLetterDialog from "../components/CreateLetterDialog";
import LetterCustomer from "./LetterCustomer";
//import { getUserData } from './store/userSlice';
import history from '../../../../@history/@history';
import CreateLetterUsers from '../components/CreateLetterUsers';
function Users(props:any) {
    const dispatch = useDispatch();

    const pageLayout = useRef(null);

    const [forControl,setForControl]=useState(true);

    useDeepCompareEffect(() => {
        console.log("Users")
        // @ts-ignore
        dispatch(getContacts());
        //dispatch(getUserData());
    }, [dispatch]);

    return (
        <div>
            <FusePageSimple
                classes={{
                    contentWrapper: 'p-0 sm:p-24 h-full',
                    content: 'flex flex-col h-full',
                    leftSidebar: 'w-256 border-0',
                    header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
                    wrapper: 'min-h-0'
                }}
                header={<ContactsHeader pageLayout={pageLayout} forControl={forControl} />}
                content={
                    <div>
                        <CreateLetterUsers/>
                    </div>
                }
                // leftSidebarContent={<ContactsSidebarContent />}
                sidebarInner
                ref={pageLayout}
                innerScroll
            />
            {/*<CreateLetterDialog></CreateLetterDialog>*/}
            {/*<UserDialog />*/}
        </div>
    );
}

export default withReducer('contactsApp', reducer)(Users);