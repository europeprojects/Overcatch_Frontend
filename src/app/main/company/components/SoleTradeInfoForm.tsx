// import React, {useEffect, useMemo, useState} from "react";
import {TextField, TextFieldProps} from "@material-ui/core";
import {Div} from "app/components/Grid";
import React, {useEffect, useMemo, useRef, useState} from "react";
import { FounderOwner} from "../../../types/UserModel";
import Formsy from "formsy-react";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";


export type FounderOwnerFormProps = {
    onInput: (form: FounderOwner) => void
    setTabValue: any
    tabValue:number
    formDetail: FounderOwner
}

export default function SoleTradeInfoForm({onInput,setTabValue,tabValue,formDetail}: FounderOwnerFormProps) {
    const formState = useState<FounderOwner>(formDetail);
    const [isFormValid, setIsFormValid] = useState(false);

    const formRef = useRef(null);
    const [form] = formState;

    useEffect(() => {
        onInput(form)
    }, [form]);


    const onChanceClick = (e: any) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    }

    const onNumberClick = (e: any) => {
        e.target.value = e.target.value.replace(/[a-zA-Z]/g, '');
    }

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmitPrevious(model:FounderOwner){
        console.log(model)
        onInput(model)

    }
    function handleSubmit(model:FounderOwner) {
        console.log(model);
        setTabValue(tabValue + 1)
        onInput(model)
    }


    const {t} = useTranslation('companyApplications');

    return useMemo(() => (
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                onChange={handleSubmitPrevious}
                ref={formRef}
                className="flex flex-col justify-center w-full"
            >
            <TextFieldFormsy

                id="visaDateIssue"
                field="visaDateIssue"
                label="Visa Date Issue"
                type="date"
                // onChange={handleOnChange}
                // value={formDetail.visaDateIssue}
                defaultValue={selectedDate}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: '3000-01-01',
                    min:'1000-01-01'
                }}
                name="visaDateIssue"
                className="my-16"
                variant="outlined"
                formState={formState}
            />

            <TextFieldFormsy
                className="my-16"

                id="visaExpiryDate"
                field="visaExpiryDate"
                // onChange={handleOnChange}
                // validations={{
                //     min: new Date(),
                // }}
                // validationErrors={{
                //     min: 'Min character length is 4',
                //
                // }}
                label= {t("VISAEXPIRYDATE")}
                type="date"
                // value={formDetail.visaExpiryDate}

                name="visaExpiryDate"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    max: '3000-01-01',
                    min:'1000-01-01'
                }}
                variant="outlined"
                defaultValue={selectedDate}
                formState={formState}/>


            <TextFieldFormsy

                             className="my-16"

                             name="maritalStatus"
                           label={t("MARITALSTATUS")}
                             value={formDetail.maritalStatus}
                           fullWidth field="maritalStatus"
                           formState={formState}
                           variant="outlined"/>

            <TextFieldFormsy
                type="number"
                className="my-16"
                id="outlined-number"
                name="numberOfDependence"

                value={formDetail.tradeAsName}
                label={"Number of Dependence"}
                fullWidth field="numberOfDependence"
                formState={formState}
                variant="outlined"/>
                <Div columns={2} >
                <Button  type="submit" onClick={()=>setTabValue(tabValue - 1)}
                        variant="contained"
                        color="secondary">
                    {t("PREVIOUS")}
                </Button>
                <Button  variant="contained" color="primary" type="submit">Continue</Button>
                </Div>
            </Formsy>
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
