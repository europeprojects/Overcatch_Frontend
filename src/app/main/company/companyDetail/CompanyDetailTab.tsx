import FusePageSimple from '@fuse/core/FusePageSimple';
import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useState } from 'react';
import Icon from "@material-ui/core/Icon";
import {TextField} from "@material-ui/core";
import {useTranslation} from "react-i18next";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function CompanyDetailTab(props) {

    const {t} = useTranslation('companyApplications');
    const [selectedTab, setSelectedTab] = useState(0);
    const {list , addressNewList , isEditable , handleAddress , handleAddressOld ,handleNewAddress} = props;

    const handleTabChange = (event, value) => {
        setSelectedTab(value);
    };
    //Bu .Tsx Yeni Eklendi
    return (
        <FusePageSimple
            contentToolbar={
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="off"
                    className="w-full h-64"
                >
                    <Tab className="h-64" label={t('OLDADRESS')} />
                    <Tab className="h-64" label={t('NEWADRESS')} />
                </Tabs>
            }
            content={
                <div className="p-24">
                    {selectedTab === 0 && (

                        <div className="table-responsive">
                            <table className="simple">
                                <thead>
                                <tr>
                                    <th>{t("TYPE")}</th>
                                    <th>{t("LINE1")}</th>
                                    <th>{t("LINE2")}</th>
                                    <th>{t("LINE3")}</th>
                                    <th>{t("POSTCODE")}</th>
                                    <th>{t("TOWNCITY")}</th>
                                    <th>{t("COUNTRY")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {list?.sort((a, b) => a.id - b.id).map((address, key) => (
                                    <tr key={address?.id}>
                                        <td>
                                            {address?.addressType !== null && address?.addressType?.toString() == "HOME" ?
                                                <Icon color="action">home</Icon> :
                                                <Icon color="action">business</Icon>}

                                            <span
                                                className="truncate">
                                                {address?.addressType !== null && address?.addressType?.toString() === "HOME" ? (t("RESIDENTIALADDRESS"))
                                                :
                                                (address?.addressType?.toString() === "BUSINESS" ? t("COMPANYREGISTERADDRESS") : t("BUSINESSTRADINGADDESS"))}</span>
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => handleAddress(address.id, e)}
                                                       disabled={isEditable === true ? false : true}
                                                       variant="outlined" name="number"
                                                       id="outlined-disabled" value={address?.number}
                                                       inputProps={{
                                                           maxlength: 150
                                                       }}/>
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => handleAddress(address.id, e)}
                                                       disabled={isEditable === true ? false : true}
                                                       variant="outlined" name="street"
                                                       id="outlined-disabled" value={address?.street}
                                                       inputProps={{
                                                           maxlength: 150
                                                       }}/>
                                        </td>

                                        <td>
                                            <TextField onChange={(e) => handleAddress(address.id, e)}
                                                       disabled={isEditable === true ? false : true}
                                                       variant="outlined" name="district"
                                                       id="outlined-disabled" value={address?.district}
                                                       inputProps={{
                                                           maxlength: 150
                                                       }}/>
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => handleAddress(address.id, e)}
                                                       disabled={isEditable === true ? false : true}
                                                       variant="outlined" name="postcode"
                                                       id="outlined-disabled" value={address?.postcode}
                                                       inputProps={{
                                                           maxlength: 150
                                                       }}/>
                                        </td>
                                        <td>
                                            <TextField onChange={(e) => handleAddress(address.id, e)}
                                                       disabled={isEditable === true ? false : true}
                                                       variant="outlined" name="city"
                                                       id="outlined-disabled"
                                                       value={address?.city}
                                                       inputProps={{
                                                           maxlength: 150
                                                       }}/>
                                        </td>

                                        <td>
                                            <TextField onChange={(e) => handleAddress(address.id, e)}
                                                       disabled={isEditable === true ? false : true}
                                                       variant="outlined" name="country"
                                                       id="outlined-disabled" value={address?.country}
                                                       inputProps={{
                                                           maxlength: 150
                                                       }}/>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {selectedTab === 1 && (
                        <div>
                            <div className="table-responsive">
                                <table className="simple">
                                    <thead>
                                    <tr>
                                        <th>{t("TYPE")}</th>
                                        <th>{t("LINE1")}</th>
                                        <th>{t("LINE2")}</th>
                                        <th>{t("LINE3")}</th>
                                        <th>{t("POSTCODE")}</th>
                                        <th>{t("TOWNCITY")}</th>
                                        <th>{t("COUNTRY")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {  (addressNewList.length === 0 ? list : addressNewList )?.sort((a, b) => a.id - b.id).map((address, key) => (
                                            <tr key={address?.id}>
                                                <td>
                                                    {address?.addressType !== null && address?.addressType?.toString() == "HOME" ?
                                                        <Icon color="action">home</Icon> :
                                                        <Icon color="action">business</Icon>}

                                                    <span
                                                        className="truncate">
                                                    {address?.addressType !== null && address?.addressType?.toString() === "HOME" ? (t("RESIDENTIALADDRESS"))
                                                    :
                                                    (address?.addressType?.toString() === "BUSINESS" ? t("COMPANYREGISTERADDRESS") : t("BUSINESSTRADINGADDESS"))}</span>
                                                </td>
                                                <td>
                                                    <TextField
                                                               onChange={(addressNewList.length === 0 ? (e) => handleAddress(address.id, e) :
                                                                                                        (e) => handleNewAddress(address.id, e))}
                                                               variant="outlined" name="number"
                                                               disabled={isEditable === true ? false : true}
                                                               id="outlined-disabled" value={address?.number}
                                                               inputProps={{
                                                                   maxlength: 150
                                                               }}>
                                                    </TextField>
                                                </td>
                                                <td>
                                                    <TextField onChange={(addressNewList.length === 0 ? (e) => handleAddress(address.id, e) :
                                                                                                     (e) => handleNewAddress(address.id, e))}
                                                               variant="outlined" name="street"
                                                               disabled={isEditable === true ? false : true}
                                                               id="outlined-disabled" value={address?.street}
                                                               inputProps={{
                                                                   maxlength: 150
                                                               }}>
                                                    </TextField>
                                                </td>

                                                <td>
                                                    <TextField onChange={(addressNewList.length === 0 ? (e) => handleAddress(address.id, e) :
                                                                                                        (e) => handleNewAddress(address.id, e))}
                                                               variant="outlined" name="district"
                                                               disabled={isEditable === true ? false : true}
                                                               id="outlined-disabled" value={address?.district}
                                                               inputProps={{
                                                                   maxlength: 150
                                                               }}>
                                                    </TextField>
                                                </td>
                                                <td>
                                                    <TextField onChange={(addressNewList.length === 0 ? (e) => handleAddress(address.id, e) :
                                                                                                        (e) => handleNewAddress(address.id, e))}
                                                               variant="outlined" name="postcode"
                                                               disabled={isEditable === true ? false : true}
                                                               id="outlined-disabled" value={address?.postcode}
                                                               inputProps={{
                                                                   maxlength: 150
                                                               }}>
                                                    </TextField>
                                                </td>
                                                <td>
                                                    <TextField onChange={(addressNewList.length === 0 ? (e) => handleAddress(address.id, e) :
                                                                                                        (e) => handleNewAddress(address.id, e))}
                                                               variant="outlined" name="city"
                                                               disabled={isEditable === true ? false : true}
                                                               id="outlined-disabled"
                                                               value={address?.city}
                                                               inputProps={{
                                                                   maxlength: 150
                                                               }}>
                                                    </TextField>
                                                </td>

                                                <td>
                                                    <TextField onChange={(addressNewList.length === 0 ? (e) => handleAddress(address.id, e) :
                                                                                                        (e) => handleNewAddress(address.id, e))}
                                                               variant="outlined" name="country"
                                                               disabled={isEditable === true ? false : true}
                                                               id="outlined-disabled" value={address?.country}
                                                               inputProps={{
                                                                   maxlength: 150
                                                               }}>
                                                    </TextField>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            }
        />
    );
}

export default CompanyDetailTab;
