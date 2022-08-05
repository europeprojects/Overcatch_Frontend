import Icon from '@material-ui/core/Icon';
import React, {useEffect, useRef, useState} from 'react';
import {Div} from "../../../components/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Formsy from "formsy-react";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import {UserDTO, UserType} from "../../../types/UserModel";
import api from "../../../services/BackendApi";
import history from "../../../../@history/@history";
import PasswordChangeForm from "../../components/PasswordChangeForm";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {userUpdateFormSheme} from "../../validations/ValidationSchemes";
import {TextField} from "@material-ui/core";

// export type UserUpdateTabProps = {
//     onInput: (form: UserDTO) => void
// }



export type CustomerInfo = {
    user: UserDTO
}



function UserUpdateTab({user}: CustomerInfo) {
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const {t} = useTranslation('profile');
    const formState = useState<UserDTO>(user);
    const [form] = formState;

    const formik = useFormik({
        initialValues: {
            name:user.name,
            surname:user.surname,
            email:user.email,
            alternativeEmail:user.alternativeEmail,
            msisdn:user.msisdn,
            alternativeMsisdn:user.alternativeMsisdn,
            brpExpireDate:user.brpExpireDate,
            brpNumber:user.brpNumber,

        },
        validationSchema: userUpdateFormSheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSubmit(values)
            // alert(JSON.stringify(values))
        },
    });

    useEffect(() => { 
    }, [formState])

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model: UserDTO) {
        // UserService.addUser(model).then(result => {
        //     history.push('/users')
        // });,

        user.name=formik.values.name;
        user.surname=formik.values.surname;
        user.email=formik.values.email;
        user.alternativeEmail=formik.values.alternativeEmail;
        user.msisdn=formik.values.msisdn;
        user.alternativeMsisdn=formik.values.alternativeMsisdn;
        user.brpExpireDate=formik.values.brpExpireDate;
        user.brpNumber=formik.values.brpNumber;
        console.log(model);
        console.log(user)
        api.updateUser(user).then(() => {
            history.go(0)
        });

    }

    return (
        <div className="md:flex max-w-2xl">
            <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
                <Div>
                    <PasswordChangeForm user={user}></PasswordChangeForm>

                    <form
                        onSubmit={formik.handleSubmit}
                        ref={formRef}
                        className="flex flex-col justify-center w-full"
                    >
                        <Div>
                            <TextField
                                className="mb-16"
                                type="text"
                                name="name"
                                label={t("NAME")}
                                value={formik.values.name}
                                helperText={formik.touched?.name && formik.errors?.name}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                onChange={formik.handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                phone
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            <TextField
                                className="mb-16"
                                type="text"
                                name="surname"
                                label={t("SURNAME")}
                                value={formik.values.surname}
                                helperText={formik.touched?.surname && formik.errors?.surname}
                                error={formik.touched.surname && Boolean(formik.errors.surname)}
                                onChange={formik.handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                phone
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            <TextField
                                className="mb-16"
                                type="email"
                                name="email"
                                label={t("EMAIL")}
                                value={formik.values.email}
                                helperText={formik.touched?.email && formik.errors?.email}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                onChange={formik.handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                email
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            <TextField
                                className="mb-16"
                                type="email"
                                name="alternativeEmail"
                                label={t("ALTERNATIVEMAIL")}
                                value={formik.values.alternativeEmail}
                                helperText={formik.touched?.alternativeEmail && formik.errors?.alternativeEmail}
                                error={formik.touched.alternativeEmail && Boolean(formik.errors.alternativeEmail)}
                                onChange={formik.handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                email
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            <TextField
                                className="mb-16"
                                type="text"
                                name="msisdn"
                                label={t("PHONE")}
                                value={formik.values.msisdn}
                                helperText={formik.touched?.msisdn && formik.errors?.msisdn}
                                error={formik.touched.msisdn && Boolean(formik.errors.msisdn)}
                                onChange={formik.handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                phone
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            <TextField
                                className="mb-16"
                                type="text"
                                name="alternativeMsisdn"
                                label={t("ALTERNATIVEPHONE")}
                                value={formik.values.alternativeMsisdn}
                                helperText={formik.touched?.alternativeMsisdn && formik.errors?.alternativeMsisdn}
                                error={formik.touched.alternativeMsisdn && Boolean(formik.errors.alternativeMsisdn)}
                                onChange={formik.handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon className="text-20" color="action">
                                                phone
                                            </Icon>
                                        </InputAdornment>
                                    )
                                }}
                                variant="outlined"
                            />
                            {form.userType===UserType.CUSTOMER &&(
                                    <div>
                                    <TextFieldFormsy
                                        formState={formState}
                                        className="mb-16"
                                        type="text"
                                        name="BRP"
                                        label={t("BRPNUMBER")}
                                        value={form.brpNumber}
                                        validations={{
                                            minLength: 4
                                        }}
                                        validationErrors={{
                                            minLength: t("CHARLENGTH11")
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Icon className="text-20" color="action">
                                                        phone
                                                    </Icon>
                                                </InputAdornment>
                                            )
                                        }}
                                        variant="outlined"
                                        vi
                                        required
                                    />
                                <TextFieldFormsy
                                    type="date"
                                    name="brpExpireDate"
                                    className="mb-16"
                                    value={form?.brpExpireDate}
                                    id={"date"}
                                    label={t("BRPEXPIREDATE")}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max: '3000-01-01',
                                        min:'1000-01-01'
                                    }}
                                    validations={{
                                        minLength: 3
                                    }}
                                    validationErrors={{
                                        minLength: t("MINLENGTH100")
                                    }}

                                    variant="outlined"
                                    required
                                />
                                    </div>                            )}

                        </Div>
                        <Div alignItems={'center'} columns={1}>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="w-full mx-auto mt-16 normal-case"
                                aria-label="kaydet"
                                value="legacy"
                            >
                                {t("SAVE")}
                            </Button>
                            {/* <Button*/}
                            {/*    type="reset"*/}
                            {/*    variant="contained"*/}
                            {/*    color="inherit"*/}
                            {/*    className="w-full mx-auto mt-16 normal-case"*/}
                            {/*    aria-label="LOG IN"*/}
                            {/*    value="legacy"*/}
                            {/*>*/}
                            {/*    {t("CLEANFORM")}*/}
                            {/*</Button>*/}

                        </Div>
                    </form>
                </Div>
            </div>
        </div>
    );
}

export default UserUpdateTab;
