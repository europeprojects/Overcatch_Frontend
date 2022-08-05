import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import {useTranslation} from "react-i18next";

function SentLettersHeader(props) {
    const dispatch = useDispatch();
    const mainTheme = useSelector(selectMainTheme);
    const {t} = useTranslation('letter');
    const{data}=props;
    function handleClick() {
        props.handleClick()
    }

    function handleClear() {
        props.handleClear()
    }

    return (
        <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Icon className="insert_drive_file">insert_drive_file</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                        {t("SENTLETTERS")}
                    </Typography>
                </FuseAnimate>
            </div>

            <div className="flex flex-1 items-center justify-center px-12">
                <ThemeProvider theme={mainTheme}>
                    <FuseAnimate animation="transition.slideDownIn" delay={300}>
                        <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
                            <Icon color="action">{t("SEARCH")}</Icon>

                            <Input
                                placeholder={t("SEARCHCLIENT")}
                                className="flex flex-1 mx-8"
                                disableUnderline
                                fullWidth
                                //value={props.search}
                                inputProps={{
                                    'aria-label': 'Search'
                                }}
                                //onChange={(e)=>props.setSearch(e.target.value)}
                            />
                        </Paper>
                    </FuseAnimate>
                </ThemeProvider>
                <Button
                    className="ml-5 rounded-8 bg-white"
                    variant="contained"
                    onClick={() => {handleClick()}}
                >
                    {t("SEARCH")}
                </Button>
                <Button
                    className="ml-5 rounded-8 bg-white"
                    variant="contained"
                    onClick={() => {handleClear()}}
                >
                    {t("CLEAR")}
                </Button>
            </div>
        </div>
    );
}

export default SentLettersHeader;
