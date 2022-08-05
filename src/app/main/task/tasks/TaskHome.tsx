import React, {useEffect, useState} from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate/index';
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import api from "../../../services/BackendApi";
import ViewListIcon from '@material-ui/icons/ViewList';
import history from "../../../../@history/@history";
import {useTranslation} from "react-i18next";

function TaskHome(props) {
    const {t} = useTranslation('task');
    const [role,setRole]=useState();
    const [moduleTypes,setModuleTypes] = useState();

    let deger = 0;
    let deger1 = 0;

    function handleList(moduleType: any) {
        if (moduleType === "HELP_MODULE"){
            //@ts-ignore
            history.push('/supporttask')

        }else if(moduleType === "SUPPORT_ADMIN"){
            // @ts-ignore
            history.push(`/tasks/AdminAndSupport/${window.btoa("ADMIN"+","+"HELP_MODULE")}`);
        }
        else{
            // @ts-ignore
            history.push(`/tasks/list/${window.btoa(moduleType)}`);
        }
    }
    useEffect(()=>{
        api.getModuleTypes().then(res=>
            setModuleTypes(res)
        )
        api.getCurrentUser().then(res=>{
            //@ts-ignore
            setRole({...role, userType : res.userType});
        })
    },[])
    return (
        <div className="w-full">
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row sm:p-8 container">
                    <div className="flex flex-1 flex-col md:w-2/3 w-full">
                        <div className="self-center w-full h-full">
                            <div className="flex flex-col sm:flex sm:flex-row pb-32 ">
                                <div className="widget flex w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div   className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                                <option>
                                                    {t("TODAY")}
                                                </option>
                                                <option>
                                                    {t("YESTERDAY")}
                                                </option>
                                                <option>
                                                    {t("LASTWEEK")}
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("ADMINTASKS")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-blue">

                                                {/* @ts-ignore */}
                                                <b className="px-8">  {moduleTypes?.find(m => m?.moduleTypeEnum==='ADMIN')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='ADMIN')?.deger}</b>
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='ADMIN')?.confirmation}</b>
                                            </Typography>
                                            <IconButton  onClick={()=>handleList('ADMIN')} color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                                <div className="widget flex w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                                <option>
                                                    {t("TODAY")}
                                                </option>
                                                <option>
                                                    {t("YESTERDAY")}
                                                </option>
                                                <option>
                                                    {t("LASTWEEK")}
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("ALLTASKANDSUPPORT")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-red">
                                                {/* @ts-ignore */}
                                                {(moduleTypes?.find(m=>m?.moduleTypeEnum==='ADMIN')?.deger == null ? 0 :moduleTypes?.find(m=>m?.moduleTypeEnum==='ADMIN')?.deger ) + (moduleTypes?.find(m=>m?.moduleTypeEnum==='HELP_MODULE')?.deger==null? 0:moduleTypes?.find(m=>m?.moduleTypeEnum==='HELP_MODULE')?.deger)}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='SELFASSESMENT')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('SUPPORT_ADMIN')}  color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                                <div className="widget flex w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                                <option>
                                                    {t("TODAY")}
                                                </option>
                                                <option>
                                                    {t("YESTERDAY")}
                                                </option>
                                                <option>
                                                    {t("LASTWEEK")}
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("PAYROLLTASKS")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-green">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='PAYROLL')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='PAYROLL')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='PAYROLL' )?.confirmation}</b>
                                            </Typography>
                                            <IconButton  onClick={()=>handleList('PAYROLL')}  color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon  fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                                <div className="widget w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                                <option>
                                                    {t("TODAY")}
                                                </option>
                                                <option>
                                                    {t("YESTERDAY")}
                                                </option>
                                                <option>
                                                    {t("LASTWEEK")}
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("VATTASKS")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-red">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='VAT')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='VAT')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='VAT')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('VAT')}  color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                                <div className="widget w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                                <option>
                                                    {t("TODAY")}
                                                </option>
                                                <option>
                                                    {t("YESTERDAY")}
                                                </option>
                                                <option>
                                                    {t("LASTWEEK")}
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("COMPANYYEAREND")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-black">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='COMPANYYEAREND')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='COMPANYYEAREND')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='COMPANYYEAREND')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('COMPANYYEAREND')}  color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex sm:flex-row pb-32 ">
                                <div className="widget flex w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                                <option>
                                                    {t("TODAY")}
                                                </option>
                                                <option>
                                                    {t("YESTERDAY")}
                                                </option>
                                                <option>
                                                    {t("LASTWEEK")}
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("SOLETRADERACCOUNTS")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-darkblue">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='SOLETRADERACCOUNTS')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='SOLETRADERACCOUNTS')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='SOLETRADERACCOUNTS')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('SOLETRADERACCOUNTS')}  color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                                <div className="widget flex w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                                <option>
                                                    {t("TODAY")}
                                                </option>
                                                <option>
                                                    {t("YESTERDAY")}
                                                </option>
                                                <option>
                                                    {t("LASTWEEK")}
                                                </option>
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("SELFASSESMENT")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-red">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='SELFASSESMENT')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='SELFASSESMENT')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='SELFASSESMENT')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('SELFASSESMENT')}  color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>

                                <div className="widget w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                value={"Visa Extension"}
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("VISAEXTENSION")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-green">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='VISAEXTENSION')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='VISAEXTENSION')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='VISAEXTENSION')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('VISAEXTENSION')} color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                                {/* @ts-ignore */}
                                {role?.userType === 'MANAGER' &&
                                <div className="widget w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                value={"Manager"}
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("MANAGER")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-blue">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='MANAGER')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='MANAGER')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='MANAGER')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('MANAGER')} color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>
                                }
                                <div className="widget w-full sm:w-1/4 p-16">
                                    <Paper className="w-full rounded-8 shadow-1">
                                        <div className="flex items-center justify-between px-4 pt-4">
                                            <Select
                                                className="px-12"
                                                native
                                                value={"Support"}
                                                inputProps={{
                                                    name: 'currentRange'
                                                }}
                                                disableUnderline
                                            >
                                            </Select>
                                        </div>
                                        <div className="text-center pt-12 pb-28">
                                            <Typography className="text-20 leading-none pb-10">
                                                {t("SUPPORT")}
                                            </Typography>
                                            <Typography className="text-72 leading-none text-orange">
                                                {/* @ts-ignore */}
                                                {moduleTypes?.find(m => m?.moduleTypeEnum==='HELP_MODULE')?.deger == null? 0: moduleTypes?.find(m => m?.moduleTypeEnum==='HELP_MODULE')?.deger}
                                            </Typography>
                                            <Typography className="text-16" color="textSecondary">
                                                {t("PENDING")}
                                            </Typography>
                                        </div>
                                        <div className="flex items-center px-16 h-52 border-t-1">
                                            <Typography className="text-15 flex w-full" color="textSecondary">
                                                <span className="truncate">{t("INPROCESS")}</span>:
                                                {/* @ts-ignore */}
                                                <b className="px-8"> {moduleTypes?.find(m => m?.moduleTypeEnum==='HELP_MODULE')?.confirmation}</b>
                                            </Typography>
                                            <IconButton onClick={()=>handleList('HELP_MODULE')} color="primary" aria-label="add to shopping cart">
                                                <ViewListIcon fontSize={"large"} />
                                            </IconButton>
                                        </div>
                                    </Paper>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}


export default TaskHome;
