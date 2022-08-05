import withReducer from 'app/store/withReducer';
import React, { useEffect, useState } from 'react';
import api from 'app/services/BackendApi';
import { useDispatch, useSelector } from 'react-redux';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import {Client, CustomerClientDTO} from "../../../types/UserModel";
import MyClientListHeader from "./MyClientListHeader";
import MyClientsCompanyList from "./MyClientsCompanyList";

function MyClients(props: any) {
    const [clientList, setClientList] = useState<Client[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [search, setSearch] = useState<string>();
    const dispatch = useDispatch();
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [customerClients, setCustomerClients] = useState<CustomerClientDTO[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        api.getClient(clientId).then(response => {
            clientList.push(response)
            setClientList(clientList);
            const {company, addressList, customerClients, founderOwner,tasks, documents} = response;
            setCustomerClients(customerClients);
        });
    }, []);

    useEffect(()=>{
        if(search == ''){
            setClientList(clients);
        }else{
            const filtered = clients.filter(client => (
                client.company?.name.toLowerCase().match(search.toLowerCase())
            ));
            setClientList(filtered);
        }
    },[search])


    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={<MyClientListHeader search={search} setSearch={setSearch} />}
            content={<MyClientsCompanyList clients={clientList} />}
            innerScroll
        />
    );
}

export default withReducer('documentsApp')(MyClients);
