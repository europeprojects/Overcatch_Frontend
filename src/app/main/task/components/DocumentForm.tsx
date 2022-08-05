// import React, {useEffect, useMemo, useState} from "react";
import {
    createStyles,
    FormControlLabel, Icon,
    makeStyles,
    Radio,
    RadioGroup,
    TextField,
    TextFieldProps,
    Theme,
    Typography
} from "@material-ui/core";
import { Div } from "app/components/Grid";
import { useEffect, useMemo, useState } from "react";
import React from 'react';
import { DocumentInfo} from "../../../types/UserModel";
import Button from "@material-ui/core/Button"; 
import history from "../../../../@history/@history";
import FuseAnimate from "../../../../@fuse/core/FuseAnimate";
import clsx from "clsx";




export type DocumentFormProps = {
    onInput: (form: DocumentInfo) => void
}

export default function DocumentInfoForm({ onInput }: DocumentFormProps) {
    const formState = useState<DocumentInfo>({} as DocumentInfo);


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
        new Date('2014-08-18T21:11:54'),
    );

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const [form] = formState;
    useEffect(() => {
        onInput(form)

    }, [form]);

    function handleUploadChange(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsBinaryString(file);



        reader.onerror = () => {
            console.log('error on load image');
        };
    }




    return useMemo(() => (
        <Div gap={2}>

            <div>
                <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
                    <label
                        htmlFor="button-file"
                        className={clsx(

                            'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
                        )}
                    >
                        <input
                            accept="image/*"
                            className="hidden"
                            id="button-file"
                            type="file"
                            onChange={handleUploadChange}
                        />
                        <Icon fontSize="large" color="action">
                            cloud_upload
                        </Icon>
                    </label>

                </div>
            </div>


        </Div>
    ), [form])
};

//
function FormTextField(
    { formState, field, ...props }:
        TextFieldProps & { formState: any, field: string }
) {
    const [state, dispatch] = formState;
    // Performans sorunu olduğu için onChange yerine onBlur'da state güncellemesi yapıyoruz.
    return (
        <TextField  {...props} onBlur={e => dispatch({ ...state, [field]: e.target.value })} />
    )
}
