import {useForm} from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    removeContact,
    updateContact,
    addContact,
    closeNewContactDialog,
    closeEditContactDialog
} from '../../user/store/contactsSlice';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {Div} from "app/components/Grid";
import Menu from "@material-ui/core/Menu";
import {useFormik} from "formik";
import * as yup from "yup";
import {newEmployeeValidations} from "../../validations/ValidationSchemes";
import {useTranslation} from "react-i18next";

const userDTO = {
    id: '',
    password: '',
    name: '',
    payment: '',
    surname: '',
    email: '',
    msisdn: '',
    status: '',
    photoURL: '',
    userType: 'EMPLOYEE'
};


function UserDialog(props) {
    const dispatch = useDispatch();
    const contactDialog = useSelector(({contactsApp}) => contactsApp.contacts.contactDialog);
    const [disabled, setDisabled] = useState(false);
    const {form, handleChange, setForm} = useForm(userDTO);
    const { t } = useTranslation('usercreate');

    const initDialog = useCallback(() => {
        /**
         * Dialog type: 'edit'
         */
        if (contactDialog.type === 'edit' && contactDialog.data) {
            formik.values.id=contactDialog.data.id
            formik.values.email=contactDialog.data.email
            formik.values.name=contactDialog.data.name
            formik.values.surname=contactDialog.data.surname
            formik.values.type=contactDialog.data.type
            formik.values.msisdn=contactDialog.data.msisdn
            formik.values.photoURL=contactDialog.data.photoURL
            formik.values.userType=contactDialog.data.userType
            setForm({...contactDialog.data});
        }

        /**
         * Dialog type: 'new'
         */
        if (contactDialog.type === 'new') {
            setForm({
                ...userDTO,
                ...contactDialog.data
                //id: FuseUtils.generateGUID()
            });
            setDisabled(false)
            formik.values.id=""
            formik.values.email=""
            formik.values.name=""
            formik.values.surname=""
            formik.values.type=""
            formik.values.msisdn=""
            formik.values.photoURL=""
            formik.values.userType=""
        }
    }, [contactDialog.data, contactDialog.type, setForm]);

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (contactDialog.props.open) {
            initDialog();
        }
    }, [contactDialog.props.open, initDialog]);

    function closeComposeDialog() {
        //@ts-ignore
        return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
        formik.values.id=""
        formik.values.email=""
        formik.values.name=""
        formik.values.surname=""
        formik.values.type=""
        formik.values.msisdn=""
        formik.values.photoURL=""
        formik.values.userType=""
    }

    function canBeSubmitted() {
        return form.name.length > 0 && form.surname.length > 0 && form.email.length > 0;

    }

    function handleSubmit(value) {
        // event.preventDefault();
        if (contactDialog.type === 'new') {
            //@ts-ignore
            dispatch(addContact(value));
        } else {
            //@ts-ignore
            dispatch(updateContact(value));
        }
        closeComposeDialog();
    }

    function handleRemove() {
        //@ts-ignore
        dispatch(removeContact(form.id));
        closeComposeDialog();
    }


    const formik = useFormik({
        initialValues: {
            id:'',
            email: '',
            name: '',
            surname: '',
            msisdn: '',
            userType:'',
            photoURL: '',
            type:'',
        },
        validationSchema: newEmployeeValidations,
        onSubmit: (values) => {
            // @ts-ignore
            handleSubmit(values)
            setDisabled(true)
            // alert(JSON.stringify(values))
        },
    });

    return (
        <Dialog
            classes={{
                paper: 'm-24 rounded-8'
            }}
            {...contactDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="md"
        >
            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {contactDialog.type === 'new' ? t("NEWEMPLOYEE") : 'Edit Employee'}
                    </Typography>
                </Toolbar>
                <div className="flex flex-col items-center justify-center pb-24">
                    <Avatar className="w-96 h-96" alt="contact avatar" src={formik.values.photoURL}/>
                    {contactDialog.type === 'edit' && (
                        <Typography variant="h6" color="inherit" className="pt-8">
                            {formik.values.name}
                        </Typography>
                    )}
                </div>
            </AppBar>
            <form  onSubmit={formik.handleSubmit} className="flex flex-col md:overflow-hidden">
                <DialogContent classes={{root: 'p-24'}}>
                    <Div box columns={2}>
                        <div className="flex">
                            <div className="min-w-48 pt-20">
                                <Icon color="action">account_circle</Icon>
                            </div>

                            <TextField
                                className="mb-24"
                                label={t("NAME")}
                                autoFocus
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                variant="outlined"
                                fullWidth
                            />
                        </div>

                        <div className="flex">
                            <div className="min-w-48 pt-20"/>
                            <TextField
                                className="mb-24"
                                label={t("LASTNAME")}
                                id="lastName"
                                name="surname"
                                value={formik.values.surname}
                                onChange={formik.handleChange}
                                error={formik.touched.surname && Boolean(formik.errors.surname)}
                                helperText={formik.touched.surname && formik.errors.surname}
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                        <div className="flex">
                            <div className="min-w-48 pt-20">
                                <Icon color="action">phone</Icon>
                            </div>
                            <TextField
                                className="mb-24"
                                label={t("PHONE")}
                                id="phone"
                                name="msisdn"
                                inputProps={{ maxLength: 15, minLength:10}}
                                value={formik.values.msisdn}
                                onChange={formik.handleChange}
                                error={formik.touched.msisdn && Boolean(formik.errors.msisdn)}
                                helperText={formik.touched.msisdn && formik.errors.msisdn}
                                variant="outlined"
                                fullWidth
                                type={"number"}
                            />
                        </div>

                        <div className="flex">
                            <div className="min-w-48 pt-20">
                                <Icon color="action">email</Icon>
                            </div>
                            <TextField
                                type="email"
                                className="mb-24"
                                label={t("EMAIL")}
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                variant="outlined"
                                fullWidth
                            />
                        </div>


                        <div className="flex">
                            <div className="min-w-48 pt-20">
                                <Icon color="action">person</Icon>
                            </div>
                            <Select fullWidth variant="outlined" id="userType"
                                    label={t("PERSONELTYPE")}
                                    name="userType"
                                    value={formik.values.userType}
                                    onChange={formik.handleChange}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                    displayEmpty
                                    disabled={formik.values.userType === 'CLIENT'}
                            >

                                <MenuItem value="" disabled>
                                    <em>{t("SELECTTYPE")}</em>
                                </MenuItem>
                                {contactDialog.type === 'edit' && (
                                    <MenuItem key="CLIENT" value="CLIENT">
                                        {t("CUSTOMER")}
                                    </MenuItem>
                                )}
                                <MenuItem key="EMPLOYEE" value="EMPLOYEE">
                                    {t("EMPLOYEE")}
                                </MenuItem>
                                <MenuItem key="MANAGER" value="MANAGER">
                                    {t("MANAGER")}
                                </MenuItem>

                            </Select>
                        </div>

                    </Div>
                </DialogContent>
                {formik.values.type === 'new' ? (
                    <DialogActions className="justify-between p-8">
                        <div className="px-16">
                            <Button
                                variant="contained"
                                color="primary"
                                // onClick={handleSubmit}
                                type="submit"
                                // disabled={!canBeSubmitted()}
                            >
                                {t("ADD")}
                            </Button>
                        </div>
                    </DialogActions>
                ) : (
                    <DialogActions className="justify-between p-8">
                        <div className="px-16">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={disabled}
                                // onClick={handleSubmit}
                                // disabled={!canBeSubmitted()}
                            >
                                {t("SAVE")}
                            </Button>
                        </div>
                        <IconButton onClick={handleRemove}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </DialogActions>
                )}
            </form>
        </Dialog>
    );
}

export default UserDialog;
