// import React, {useEffect, useMemo, useState} from "react";
import {TextField, TextFieldProps} from "@material-ui/core";
import React, {useEffect, useMemo, useState} from "react";
import {AddressInfo, DirectorDetail} from "../../types/UserModel";
import { Div } from "app/components/Grid";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";

export type DirectorFormProps = {
    onInput: (form: DirectorDetail) => void
}

export default function DirectorForm({onInput}: DirectorFormProps) {
    const formState = useState<DirectorDetail>({} as DirectorDetail);

    const [form] = formState;

    useEffect(() => {
        onInput(form)

    }, [form]);

    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }


    const {t} = useTranslation('application');

    return useMemo(() => (
        <Div gap={2}>
            <h3>{t("DIRECTORDETAIL")}</h3>
            <FormTextField onChange={onChanceClick}
                           required
                           label={t("DIRECTORNAME")}
                           fullWidth field="directorName"
                           formState={formState}
                           variant="outlined"/>
            <FormTextField
                id="visaExpiryDate"
                field="visaExpiryDate"
                label= {t("VISAEXPIRYDATE")}
                type="date"
                defaultValue="2017-05-24"
                className={"textField"}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: '3000-01-01',
                    min:'1000-01-01'
                }}
                variant="outlined"
                formState={formState}
            />
            <FormTextField onChange={onChanceClick}
                            
                           label={"Nino"}
                           fullWidth field="nino"
                           formState={formState}
                           variant="outlined"/>

            <FormTextField onChange={onChanceClick}
                            
                           label={t("EMPLOYEEUTR")}
                           fullWidth field="employeeUTR"
                           formState={formState}
                           variant="outlined"/>

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
