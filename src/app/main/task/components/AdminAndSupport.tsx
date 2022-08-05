import React from 'react';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import AdminAndSupportList from "./AdminAndSupportList";
import { useEffect, useState } from 'react';
import api from 'app/services/BackendApi';
import {Link, useParams} from "react-router-dom";
import {Task, TaskDto} from "../../../types/UserModel";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import {ThemeProvider} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FuseAnimate from "../../../../@fuse/core/FuseAnimate";
import {useTranslation} from "react-i18next";
import {useSelector} from 'react-redux';
import {selectMainTheme} from 'app/store/fuse/settingsSlice';

export default function AdminAndSupport(props: any) {

    const [search, setSearch] = useState<string>("");
    const [supportType, setsupportType] = useState<string>("");
    const [statusType, setstatusType] = useState<string>("");
    const [confirmType, setComfirmType] = useState([]);
    const [module, setModule] = useState<string>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [orderStartDate, setOrderStartDate] = useState("");
    const [orderEndDate, setOrderEndDate] = useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [clientTypes, setClientTypes] = useState([]);
    const [aggrementTypes, setAggrementTypes] = useState([]);
    const [allType, setAllType] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [supportList, setSupportList] = useState([]);
    const [selectedModuleTypes, setSelectedModuleTypes] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [personel, setPersonel]= useState([]);
    const [personelId, setPersonelId] = useState(null);
    const [selectedPersonel,setSelectedPersonel]= useState();
    const {t} = useTranslation('task');
    const mainTheme = useSelector(selectMainTheme);
    const routeParams = useParams();
    // @ts-ignore
    const { moduleType } = routeParams; // ADMİN
    const [tasksList,setTasksList]=useState<TaskDto[]>([]);
    useEffect(()=>{
        api.getTaskModuleTypeAdminSupport(window.atob(moduleType)).then(res => {
            setModuleList(res)
        });
        getSupports();
        getTasksWithFilter();
        api.getPersonel().then(res => setPersonel(res));
    }, [])

    useEffect(()=>{
        if (allType.length>0) {
            api.getTaskModuleTypeAdminSupport(allType.toString()).then(res => {
                setModuleList(res);
            })
        }
        else {
            api.getTaskModuleTypeAdminSupport(window.atob(moduleType)).then(res => {
                setModuleList(res);
            })
        }
    }, [allType])

    function getSupports() {
        api.getSupportTask(search,supportType,statusType).then(res => {
           setSupportList(res)
        })
    }

    function handleClear(){
        setSearch("")
        setModule(null)
        setComfirmType([])
        setStartDate("")
        setEndDate("")
        setClientTypes([])
        setAggrementTypes([])
        setSelectedModuleTypes([])
        setSelectedDepartments([])
        setOrderEndDate("")
        setOrderStartDate("")
        setPersonelId("")
        api.getTasksWithFilterAdminSupport(window.atob(moduleType), "", null, "", "", "","", "", "", "","", null).then(res => {
            setTasksList(res)
            setPage(0)
        })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function getTasksWithFilter(){
        api.getTasksWithFilterAdminSupport(allType.length>0?allType.toString():window.atob(moduleType), selectedModuleTypes, confirmType, search,
            startDate, endDate,orderStartDate, orderEndDate, clientTypes?.length < 1 ? "" : clientTypes?.toString(), aggrementTypes?.length < 1 ? "" : aggrementTypes?.toString(), selectedDepartments?.length < 1 ? "" : selectedDepartments?.toString(), personelId).then(res => {
            setTasksList(res)
            setPage(0)
        })
    }

    useEffect(()=>{
        getTasksWithFilter()
    },[allType,selectedModuleTypes, confirmType, search, startDate, endDate, orderStartDate, orderEndDate, clientTypes, aggrementTypes,selectedDepartments, personelId])

    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 items-center justify-center px-12">
                    <div className="flex items-center">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Icon className="insert_drive_file">insert_drive_file</Icon>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t("TASKS")}
                            </Typography>
                        </FuseAnimate>
                    </div>
                    <ThemeProvider theme={mainTheme}>
                        <FuseAnimate animation="transition.slideDownIn" delay={300}>
                            <Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
                                <Icon color="action">{t("SEARCH")}</Icon>
                                <Input
                                    placeholder={t("SEARCHFORANYTHING")}
                                    className="flex flex-1 mx-8"
                                    disableUnderline
                                    fullWidth
                                    value={search}
                                    inputProps={{
                                        'aria-label': 'Search'
                                    }}
                                    onChange={(e)=>setSearch(e.target.value)}
                                />
                            </Paper>
                        </FuseAnimate>
                    </ThemeProvider>
                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                        <Button
                            className="ml-5 rounded-8 bg-white"
                            variant="contained"
                            onClick={handleClear}
                        >
                            <span className="hidden sm:flex">{t("CLEAR")}</span>
                        </Button>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                        <Button
                            component={Link}
                            role="button"
                            to="/tasks"
                            className="whitespace-no-wrap normal-case ml-6"
                            variant="contained"
                            color="secondary"
                        >
                            <span className="hidden sm:flex">{t("BACKTOMODULES")}</span>
                        </Button>
                    </FuseAnimate>
                </div>
            }
            content={<AdminAndSupportList
                tasksList={tasksList} setTasksList={setTasksList}
                confirmType={confirmType} setComfirmType={setComfirmType}
                module={module} setModule={setModule}
                page={page} setPage={setPage}
                rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
                handleChangeRowsPerPage={handleChangeRowsPerPage} handleChangePage={handleChangePage}
                clientTypes={clientTypes} setClientTypes={setClientTypes}
                aggrementTypes={aggrementTypes} setAggrementTypes={setAggrementTypes}
                allType={allType} setAllType={setAllType}
                startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
                orderStartDate={orderStartDate} setOrderStartDate={setOrderStartDate} orderEndDate={orderEndDate} setOrderEndDate={setOrderEndDate}
                moduleList={moduleList}
                selectedModuleTypes={selectedModuleTypes} setSelectedModuleTypes={setSelectedModuleTypes}
                selectedDepartments={selectedDepartments} setSelectedDepartments={setSelectedDepartments}
                personel={personel} setPersonel={setPersonel}
                selectedPersonel={selectedPersonel} setSelectedPersonel={setSelectedPersonel}
                personelId={personelId} setPersonelId={setPersonelId}
            />}
            innerScroll
        />
    );
}
