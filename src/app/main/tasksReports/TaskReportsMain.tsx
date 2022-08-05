import React, { useEffect, useState } from 'react';
import {createStyles, lighten, makeStyles, Theme, ThemeProvider, useTheme, withStyles} from '@material-ui/core/styles';
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import {Backdrop, CircularProgress, FormControlLabel, Grid, Icon, Paper, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import {useTranslation} from "react-i18next";
import {PageContainer} from "../reminder/notifCreate";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Button from "@material-ui/core/Button";
import history from "../../../@history/@history";

const useStyles = makeStyles(theme => ({
        layoutRoot: {
        },
        paper: {
            padding: theme.spacing(4),
            textAlign: 'center',
            color: '#172a3a',
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"},
        root: {
            width: '100%',
        },
    heading: {
            fontSize: theme.typography.pxToRem(15),
            // fontWeight: theme.typography.fontWeightRegular,
            },
    rootProgress:{
            flexGrow: 15,
            padding: 11,
         marginTop: 1,
                }
}));
export default function TaskReportsMain(props: any) {

    const classes = useStyles(props);
    const {t} = useTranslation('task');
    const handleClickEmployee = () =>{
        history.push('/stafflist');
    };
    const handleClickTaskList = (moduleType:string)=>{
        // @ts-ignore
        history.push(`/tasks/list/${window.btoa(moduleType)}`);
    };
    const handleClickDurationTask = ()=>{
        history.push('/inProgressAll')
    };
    const handleClickCompletedTask = ()=>{
        history.push('/completedTasks')
    };
    const handleCheck = (someThing)=>{

    };
    return(
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <Grid
                    container
                    direction="row"
                    // justify="space-between"
                    alignItems="center"
                    style={{paddingLeft:'10px',paddingRight:'10px'}}
                >
                    <Grid item xs={6} sm={1}>
                        <div className="flex flex-1 flex-col items-center sm:items-start">
                            <h2>{t('TASKS REPORT')}</h2>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={11}>
                        <Grid
                            container
                            direction="row"
                            alignItems="center">
                            <Grid item xs={6} sm={3}
                                  style={{textAlign:'right'}}>
                                <h4>{t('FILTERINFORMATION')}</h4>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="invoiceDate"
                                    color={'secondary'}
                                    className={"object-center"}
                                    id="date"
                                    label={t('INVOICEDATE')}
                                    // value={forFilter?.invoiceDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max: '3000-01-01',
                                        min:'1000-01-01'
                                    }}
                                    variant="outlined"
                                    // onChange={handleChangeForFilter}
                                />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="invoiceEndDate"
                                    className={"object-center"}
                                    id="date"
                                    label={t('INVOICEENDDATE')}
                                    // value={forFilter?.invoiceEndDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max: '3000-01-01',
                                        min:'1000-01-01'
                                    }}
                                    variant="outlined"
                                    // onChange={handleChangeForFilter}
                                />
                            </Grid>
                            <Grid xs={6} sm={3}>
                                <Button
                                    className="ml-5 rounded-8"
                                    variant="outlined"
                                    color="secondary"
                                    // onClick={() => {handleClear()}}
                                >
                                    {t("CLEAR")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            content={
                <div>
                    <Grid item container
                          direction="row"
                          justify="flex-start"
                          alignItems="flex-start"
                          spacing={2}
                          style={{paddingTop:'20px'}}
                    >
                        <Grid item xs={12} sm={3} lg={3}>
                            <Button
                                className=" rounded-8"
                                fullWidth={true}
                                // variant="contained"
                                variant="outlined"
                                color="primary"
                                onClick={() => {handleClickEmployee()}}
                            >
                                {t("Employee List")}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} lg={3}>
                            <Button
                                className="rounded-8"
                                fullWidth={true}
                                variant="outlined"
                                color="primary"
                                onClick={() => {handleClickTaskList("ADMIN")}}
                            >
                                {t("Task List")}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} lg={3}>
                            <Button
                                className="rounded-8"
                                fullWidth={true}
                                variant="outlined"
                                color="primary"
                                onClick={() => {handleClickDurationTask()}}
                            >
                                {t("average time of duration tasks")}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} lg={3}>
                            <Button
                                className="rounded-8"
                                fullWidth={true}
                                variant="outlined"
                                color="primary"
                                onClick={() => {handleClickCompletedTask()}}
                            >
                                {t("average time of completed tasks")}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container
                          direction="row"
                          justify="flex-start"
                          alignItems="flex-start"
                          spacing={1}
                          style={{paddingTop:'20px'}}>
                    </Grid>
                </div>
            }
        ></FusePageSimple>
    );
}