import {useForm} from '@fuse/hooks';
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
} from './store/contactsSlice';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {Div} from "app/components/Grid";
import {useFormik} from "formik";
import {newEmployeeValidations} from "../validations/ValidationSchemes";
import {useTranslation} from "react-i18next";
import config from "../../services/Config";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import api from "../../services/BackendApi";

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
    userType: 'EMPLOYEE',
    department:''
};

function UserDialog(props) {
    const dispatch = useDispatch();
    const contactDialog = useSelector(({contactsApp}) => contactsApp.contacts.contactDialog);
    const [disabled, setDisabled] = useState(false);
    const {form, setForm} = useForm(userDTO);
    const { t } = useTranslation('usercreate');
    const [openErrorMessgae, setOpenErrorMessgae] = React.useState(false);


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
            formik.values.department=contactDialog.data.department
            setForm({...contactDialog.data});
        }

        /**
         * Dialog type: 'new'
         */
        setDisabled(false)
        if (contactDialog.type === 'new') {
            setForm({
                ...userDTO,
                ...contactDialog.data
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
            formik.values.department=""
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
        formik.values.id=""
        formik.values.email=""
        formik.values.name=""
        formik.values.surname=""
        formik.values.type=""
        formik.values.msisdn=""
        formik.values.photoURL=""
        formik.values.userType=""
        formik.values.department=""


        return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
    }

    function canBeSubmitted() {
        return form.name.length > 0 && form.surname.length > 0 && form.email.length > 0;

    }

    function handleSubmit(value) {
        if(value.userType === "CLIENT")
            value.userType = "CUSTOMER"
        // event.preventDefault();
        if (contactDialog.type === 'new') {
            dispatch(addContact(value));
        } else {
            dispatch(updateContact(value));
        }
        closeComposeDialog();
    }

    function handleRemove(user) {
        api.getUserById(user?.id).then(res =>{
            if (!res.isPassChanged){
                dispatch(removeContact(user.id));
                closeComposeDialog();
            }
            else
                setOpenErrorMessgae(true)
        })
    }

    // function getDepartments() {
    //
    //     api.getAllDepartments().then((res)=> {
    //         setDepartment(res);
    //     } );
    // }
    //
    // useEffect(() => {
    //     getDepartments()
    // }, []);

    function handleCloseError(){
        setOpenErrorMessgae(false)
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
            department:'',
        },
        validationSchema: newEmployeeValidations,
        onSubmit: (values) => {
            console.log("Values :" , values);
            // @ts-ignore
            handleSubmit(values)
            setDisabled(true)
            // alert(JSON.stringify(values))
        },
    });

    const getPhotoUrlByFileName = (id, photoUrl) => {
        var id = id
        var filename = photoUrl
        var url = config.BACKEND_API_URL + "/api/file/downloadPhoto/" + id + "/" + filename
        return url
    }
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
                        {contactDialog.type === 'new' ? t("NEWEMPLOYEE") : t("EDITEMPLOOYE")}
                    </Typography>
                </Toolbar>
                <div className="flex flex-col items-center justify-center pb-24">
                    {formik.values.photoURL != null && formik.values.photoURL != "" ?
                        <Avatar className="w-96 h-96" alt="contact avatar" src={getPhotoUrlByFileName(formik.values.id, formik.values.photoURL)}/>
                        :
                        <Avatar className="w-96 h-96" alt="contact avatar" src={formik.values.photoURL}/>
                    }
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
                                //inputProps={{ maxLength: 15, minLength:10}}
                                value={formik.values.msisdn}
                                onChange={formik.handleChange}
                                error={formik.touched.msisdn && Boolean(formik.errors.msisdn)}
                                helperText={formik.touched.msisdn && formik.errors.msisdn}
                                variant="outlined"
                                fullWidth
                                type="text"
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

                            <Select fullWidth variant="outlined"
                                    id="userType"
                                    className="mb-24"
                                    label={t("PERSONELTYPE")}
                                    name="userType"
                                    value={formik.values.userType}
                                    onChange={formik.handleChange}
                                    error={formik.touched.userType && Boolean(formik.errors.userType)}
                                    helperText={formik.touched.userType && formik.errors.userType}
                                    displayEmpty
                                    disabled={contactDialog.type === 'edit'}
                            >
                                <MenuItem value="" disabled>
                                    <em>{t("SELECTTYPE")}</em>
                                </MenuItem>
                                {contactDialog.type === 'edit' && (
                                    <MenuItem key="CUSTOMER" value="CLIENT">
                                        {t("CLIENT")}
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

                        {formik.values.userType=="EMPLOYEE"
                            ?
                            <div className="flex">

                                <div className="min-w-48 pt-20">
                                    <Icon color="action">workoutline</Icon>
                                </div>
                                <Select fullWidth variant="outlined"
                                        id="department"
                                        className="mb-24"
                                        name="department"
                                        value={formik.values.department}
                                        onChange={formik.handleChange}
                                        error={formik.touched.department && Boolean(formik.errors.department)}
                                        helperText={formik.touched.department && formik.errors.department}
                                        displayEmpty
                                        disabled={contactDialog.type === 'edit'}>

                                    <MenuItem value="" disabled>
                                        <em>{t("DEPARTMENT")}</em>
                                    </MenuItem>
                                    <MenuItem value="Admin">{t("Admin")}</MenuItem>
                                    <MenuItem value="Accounts">{t("Accounts")}</MenuItem>
                                    <MenuItem value="VAT">VAT</MenuItem>
                                    <MenuItem value="Payroll">{t("Payroll")}</MenuItem>
                                </Select>
                            </div>
                            :null
                        }
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
                            <Button
                                variant="contained"
                                color="primary"
                                type="close"
                                // disabled={disabled}
                                onClick={ev =>  contactDialog.type === 'new' ? dispatch(closeNewContactDialog()) : dispatch(closeEditContactDialog())}
                                // disabled={!canBeSubmitted()}
                            >
                                {t("CLOSE")}
                            </Button>
                        </div>
                        <IconButton onClick={() => {handleRemove(form)}}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </DialogActions>
                )}
            </form>
            <Snackbar open={openErrorMessgae} autoHideDuration={6000} onClose={()=> handleCloseError()}>
                <Alert onClose={()=>handleCloseError()} severity="error" variant="filled">
                    {t("ACTIVEUSERCANTDELETE")}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}

export default UserDialog;
