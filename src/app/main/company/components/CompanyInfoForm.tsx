// import React, {useEffect, useMemo, useState} from "react";
import {
    createStyles,
    FormControl,
    FormControlLabel, FormLabel, InputLabel,
    makeStyles, MenuItem,
    Radio,
    RadioGroup, Select,
    TextField,
    TextFieldProps,
    Theme
} from "@material-ui/core";
import {Div} from "app/components/Grid";
import {useEffect, useMemo, useRef, useState} from "react";
import React from 'react';
import {Company, Client, UserDTO, UserType} from "../../../types/UserModel";
import Button from "@material-ui/core/Button";
import history from "../../../../@history/@history";
import Formsy from "formsy-react";
import api from "../../../services/BackendApi";
import {RadioGroupFormsy, SelectFormsy, TextFieldFormsy} from "../../../../@fuse/core/formsy";
import {useTransition} from "react-spring";
import {useTranslation} from "react-i18next";


export type CompanyInfoFormProps = {
    onInput: (form: Client) => void
    setTabValue: any
    tabValue:number
    formDetail: Client
}

export default function CompanyInfoForm({onInput,setTabValue,tabValue,formDetail}: CompanyInfoFormProps) {
    const formState = useState<Client>(formDetail);
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 200,
            },
        }),
    );

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const [form] = formState;
    useEffect(() => {
        onInput(form)

    }, [form]);

    //String Validation
    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }

    //Number Validation
    const onNumberClick = (e: any) => {
        e.target.value = e.target.value.replace(/[a-zA-Z]/g, '');
    }
    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model:Client) {
        setTabValue(tabValue + 1)
        //console.log(model);
        onInput(model)
    }



    const {t} = useTranslation('companyApplications');

    return useMemo(() => (
        <Div gap={2}>
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="flex flex-col justify-center w-full"
            >

                <Div columns={1}>
            <TextFieldFormsy
                className="my-16"
                id="mui-theme-provider-outlined-input"
                label={t("COMPANYNAME")}
                name="companyName"
                value={formDetail.notes}
                validations={{
                    minLength: 4,
                    isExisty:true
                }}
                validationErrors={{
                    minLength: t("MINLENGTH4"),
                    isExisty: t("CANTGO")
                }}
                fullWidth field="companyName"
                // formState={formState}
                oninvalid="setCustomValidity('Please Enter')"
                oninput="setCustomValidity('')"
                variant="outlined"
                required
               />
                </Div>
            <TextFieldFormsy onChange={onChanceClick}
                             className="my-16"
                           name="fullName"
                           label={t("FULLNAME")}
                             value={formDetail.notes}
                         validations={{
                             minLength: 4,
                         }}
                         validationErrors={{
                             minLength: t("MINLENGTH4"),

                         }}
                           fullWidth field="fullName"
                           // formState={formState}
                           variant="outlined"
                              />

            <TextFieldFormsy
                
                className="my-16"
                id="date"
                value={formDetail.notes}
                name="birthDay"
                label= {t("BIRTHDAY")}
                type="date"
                field="birthDay"
                defaultValue={selectedDate}
                // validations={{
                //     minLength: 4,
                // }}
                // validationErrors={{
                //     minLength: 'Min character length is 4'
                // }}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: '3000-01-01',
                    min:'1000-01-01'
                }}
                variant="outlined"
                // formState={formState}
            />

            <TextFieldFormsy onChange={onChanceClick}
                              
                             name="placeOfBirth"
                             className="my-16"
                             value={formDetail.notes}
                             validations={{
                                 minLength: 4,
                             }}
                             validationErrors={{
                                 minLength: t("MINLENGTH4"),

                             }}
                           label={t("PLACEOFBIRTH")}
                           fullWidth field="placeOfBirth"
                           // formState={formState}
                           variant="outlined"/>


            <TextFieldFormsy onChange={onNumberClick}
                              
                             name="phone"
                             type="number"
                             value={formDetail.notes}
                           label="GSM No"
                             className="my-16"
                             validations={{
                                 minLength: 4,
                             }}
                             validationErrors={{
                                 minLength: t("MINLENGTH4"),

                             }}
                           fullWidth field="phone"
                           // formState={formState}
                           variant="outlined"/>

            <TextFieldFormsy
                label="E-Mail"
                 
                name="email"
                type="email"
                value={formDetail.notes}
                validations={{
                    minLength: 4,
                    isEmail:true
                }}
                validationErrors={{
                    isEmail: t("VALIDMAIL"),
                    minLength: t("MINLENGTH4"),

                }}
                className="my-16"
                fullWidth field="email"
                // formState={formState}
                variant="outlined"/>

            <TextFieldFormsy onChange={onNumberClick}
                             value={formDetail.notes}
                             label= {t("NINO")}
                             className="my-16"
                             name="ninoNumber"
                             validations={{
                                 minLength: 4,
                             }}
                             validationErrors={{
                                 minLength: t("MINLENGTH4")
                             }}
                           fullWidth field="ninoNumber"
                           // formState={formState}
                           variant="outlined"/>

            <TextFieldFormsy
                value={formDetail.notes}
                label="UTR"
                className="my-16"
                name="utr"
                validations={{
                    maxLength: 10,
                }}
                validationErrors={{
                    maxLength: t("MAXCHAR10")
                }}
                fullWidth field="utr"
                // formState={formState}
                variant="outlined"/>

            <TextFieldFormsy
                value={formDetail.notes}
                label="Note"
                name="note"
                className="my-16"
                fullWidth field="note"
                formState={formState}
                 
                variant="outlined"/>

            <SelectFormsy
                className=" my-16"
                label= {t("COMPANYTITLE")}
                name="companyTitle"
                value={formDetail.notes? formDetail.notes:"LIMITED"}
                variant="outlined"
                required            >
                <MenuItem value="LIMITED">Limited</MenuItem>
                <MenuItem value="LTD">ltd</MenuItem>
            </SelectFormsy>
            <Button type="submit"
                    variant="contained"
                    color="primary" >
                {t("NEXT")}
            </Button>
            </Formsy>
        </Div>
    ), [form])
};

//
function FormTextField(
    {formState, field, ...props}:
        TextFieldProps & { formState: any, field: string }
) {
    const [state, dispatch] = formState;
    // Performans sorunu olduğu için onChange yerine onBlur'da state güncellemesi yapıyoruz.
    return (
        <TextField  {...props} onBlur={e => dispatch({...state, [field]: e.target.value})}/>
    )
}
