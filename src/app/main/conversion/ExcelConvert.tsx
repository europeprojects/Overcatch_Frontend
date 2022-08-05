import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import Button from "@material-ui/core/Button";
import {Div} from "../../components/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Formsy from "formsy-react";

import {
    createStyles,
    Grid,
    LinearProgress,
    MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow,
    Theme,
    Typography,
    withStyles
} from "@material-ui/core";

import SelectFormsy from "../../../@fuse/core/formsy/SelectFormsy";
import Snackbar from "@material-ui/core/Snackbar";
import api from "../../services/BackendApi";
import BackendApi from "../../services/BackendApi";
import {useSnackbar, withSnackbar} from "notistack";
import {Alert} from "@material-ui/lab";
import {isValidErrorResponse} from "../../utils/utils";
import {BankType, DocumentClass} from "../../types/UserModel";
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import {useTranslation} from "react-i18next";

interface Column {
    id: 'column1' | 'column2' | 'column3' | 'column4' | 'column5';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'column1', label: 'Column 1', minWidth: 170 },
    { id: 'column2', label: 'Column 2', minWidth: 100 },
    {
        id: 'column3',
        label: 'Column 3',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'column4',
        label: 'Column 4',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'column5',
        label: 'Column 5',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toFixed(2),
    },
];

interface Data {
    name: string;
    code: string;
    population: number;
    size: number;
    density: number;
}

function createData(name: string, code: string, population: number, size: number): Data {
    const density = population / size;
    return { name, code, population, size, density };
}

const useStyles = makeStyles({
    root: {
        width: '50%',
        padding:8,
    },
    container: {
        maxHeight: 440,
    },
});
const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 400 : 500],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }),
)(LinearProgress);

const useStyles1 = makeStyles({
    layoutRoot: {}
});
function ExcelConvert(props) {
    const {t} = useTranslation('conversion');
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    // const searchText = useSelector(({ contactsApp }) => contactsApp.contacts?.searchText);
    // const user = useSelector(({ contactsApp }) => contactsApp.user?);
    const [filteredData, setFilteredData] = useState(null);
    const [userId, setUserId] = useState(0);
    const theme = useTheme();
    const [newClient, setNewClient] = useState(false);
    const [isSelfAssesment, setIsSelfAssesment] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [isOther, setIsOther] = useState(false);
    const [name, setName] = useState(false);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [progress, setProgress] = React.useState(0);
    const [hidden, setHidden] = useState(false);
    const [file, setFile] = React.useState<File>(null);
    const [loading, setLoading] = React.useState<Boolean>(null);
    const [description, setDescription] = React.useState();
    const [documentInfo, setDocument] = useState<DocumentClass>();
    const [error, setError] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [uploadFileName, setUploadFileName] = useState<string>(null);
    const [bankType,setBankType] = useState<string>('none');
    const [statementType,setStatementType] = useState<string>('none');
    const [clientType,setClientType] = useState<string>('none');
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const classes1 = useStyles1();
    const getDownload = () => {
        BackendApi.getDownloadStatement(fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })
    }
    useEffect(()=>{
        console.log(bankType);
    },[bankType])
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function changeSelf() {
        setIsSelfAssesment(true)
        setIsOther(false)
    }

    function handleChange2(e){
        if(!e.target.files[0].type.match('application/pdf')){
            props.enqueueSnackbar(<h4>{t("PLEASEUPLOADPDFFILEONLY")}</h4>,{
                variant: 'error',
            })
        }else{
            setFile(e.target.files[0])
            setUploadFileName(e.target.files[0].name)
        }
    }
    function handleClick (e){
        if(bankType==='none' || statementType ==='none' || clientType ==='none'){
            props.enqueueSnackbar(<h4>{t("PLEASESELECT")}.</h4>,{
                variant: 'error',
            })
            return;
        }
        setProgress(0)
        e.preventDefault();

        let progressCallback = (loaded: number, total: number) => {
            setProgress(Math.round((loaded / total) * 100))
        };

        // setUploadDocumentList([...uploadDocumentList, document])

        api.uploadDocumentData3(file, bankType,statementType, progressCallback).then((data) => {
            // history.push('/documentcreate' )
            // history.go(0)
            // setIsSuccess(true)ss})
            setFileName(data.processId)
            setHidden(true);

            // setResponseFile(data);
        }).catch(err => {
            if (isValidErrorResponse(err)) {
                setError(err.response.data.message)
            } else {
                setError("Service error");
            }
        });
    }
    return (
        <FusePageCarded
            classes={{
                root: classes1.layoutRoot
            }}
            header={
                <div className="py-30">
                </div>
            }
            contentToolbar={
                <div className="grid grid-cols-2 px-24">
                    <div><h2 className="float-left">{t("BANKSTATEMENTEXCELEXPORT")}</h2></div>


                    <div>
                        {hidden === true && (
                            <FuseAnimate animation="transition.bounceRightIn" delay={200}>
                                <div className=" float-right">
                                    <Button onClick={(e) => getDownload()} variant="contained" color="primary"
                                            startIcon={<GetAppIcon />}>
                                        {t("DOWNLOAD")}
                                    </Button></div></FuseAnimate>)
                        }</div>

                </div>

            }

            content={

                <div className="p-25">
                    <br/>
                    <br/>
                    <Div >
                        <div>
                            <Formsy >
                                {/*<Div columns={3} className={"p-20"}>*/}
                                <Grid xs={12} sm={12}>
                                    <SelectFormsy
                                        className="my-16 m-8"
                                        label={t("SELECTBANK")}
                                        value={bankType}
                                        variant="outlined"
                                        name="banks"
                                        onChange={(e)=>{setBankType(e.target.value)}}
                                    >
                                        <MenuItem value="none">
                                            <em>{t("PLEASESELECT")}</em>
                                        </MenuItem>
                                        {Object.keys(BankType)
                                            .map(key => ( <MenuItem value={key}>{BankType[key]}</MenuItem>))}

                                    </SelectFormsy>

                                    <SelectFormsy
                                        className="my-16 m-8 "

                                        label={t("SELECTCLIENTTYPE")}
                                        value={clientType}
                                        variant="outlined"
                                        name="type"
                                        onChange={(e)=>{setClientType(e.target.value)}}
                                    >
                                        <MenuItem value="none">
                                            <em>{t("PLEASESELECT")}</em>
                                        </MenuItem>
                                        <MenuItem value="ACCOUNT">{t("ACCOUNT")}</MenuItem>
                                        <MenuItem value="BUSSINESS">{t("BUSINESS")}</MenuItem>
                                    </SelectFormsy>

                                    <SelectFormsy
                                        className="my-16 m-8"

                                        label={t("AMOUNTTYPE")}
                                        value={statementType}
                                        variant="outlined"
                                        name="type"
                                        onChange={(e)=>{setStatementType(e.target.value)}}
                                    >
                                        <MenuItem value="none">
                                            <em>{t("PLEASESELECT")}</em>
                                        </MenuItem>
                                        <MenuItem value="MULTIPLE">{t("MULTIPLEAMOUNT")}</MenuItem>
                                        <MenuItem value="SINGLE">{t("SINGLEAMOUNT")}</MenuItem>
                                    </SelectFormsy>

                                </Grid>
                                {/*</Div>*/}

                                <div className={"flex w-full justify-self-stretch mx-8 my-12"}>


                                    <div className={classes.root}>
                                        {uploadFileName && <Typography className="-mt-2 font-bold text-base">{uploadFileName}</Typography>}
                                        <BorderLinearProgress variant="determinate" value={progress}/>
                                    </div>
                                    {/*<LinearProgress variant="determinate"*/}
                                    {/*                  color={progress === 100 ? "secondary" : "primary"}*/}
                                    {/*                  value={progress}/>*/}
                                    <input className={"hidden"}
                                           type="file"
                                           accept="application/pdf"
                                           onChange={handleChange2}
                                           id="contained-button-file"
                                    />
                                    <div>
                                        <label htmlFor="contained-button-file">
                                            <Button startIcon={<CloudUploadIcon />}  variant="contained" color="default" component="span">
                                                {t("UPLOAD")}
                                            </Button>

                                        </label>
                                        <Button startIcon={<SaveIcon />} disabled={uploadFileName ? false:true} className="mx-8" variant="contained" type="submit" color="secondary" onClick={handleClick} >
                                            {t("SAVE")}
                                        </Button>
                                    </div>


                                </div>
                                <Div className="flex flex-end p-5">


                                </Div>


                                {/*<Paper className={classes.root}>*/}
                                {/*    <TableContainer className={classes.container}>*/}
                                {/*        <Table stickyHeader aria-label="sticky table">*/}
                                {/*            <TableHead>*/}
                                {/*                <TableRow>*/}
                                {/*                    {columns.map((column) => (*/}
                                {/*                        <TableCell*/}
                                {/*                            key={column.id}*/}
                                {/*                            align={column.align}*/}
                                {/*                            style={{ minWidth: column.minWidth }}*/}
                                {/*                        >*/}
                                {/*                            {column.label}*/}
                                {/*                        </TableCell>*/}
                                {/*                    ))}*/}
                                {/*                </TableRow>*/}
                                {/*            </TableHead>*/}
                                {/*            <TableBody>*/}
                                {/*                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {*/}
                                {/*                    return (*/}
                                {/*                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>*/}
                                {/*                            {columns.map((column) => {*/}
                                {/*                                const value = row[column.id];*/}
                                {/*                                return (*/}
                                {/*                                    <TableCell key={column.id} align={column.align}>*/}
                                {/*                                        {column.format && typeof value === 'number' ? column.format(value) : value}*/}
                                {/*                                    </TableCell>*/}
                                {/*                                );*/}
                                {/*                            })}*/}
                                {/*                        </TableRow>*/}
                                {/*                    );*/}
                                {/*                })}*/}
                                {/*            </TableBody>*/}
                                {/*        </Table>*/}
                                {/*    </TableContainer>*/}
                                {/*    <TablePagination*/}
                                {/*        rowsPerPageOptions={[10, 25, 100]}*/}
                                {/*        component="div"*/}
                                {/*        count={rows.length}*/}
                                {/*        rowsPerPage={rowsPerPage}*/}
                                {/*        page={page}*/}
                                {/*        onChangePage={handleChangePage}*/}
                                {/*        onChangeRowsPerPage={handleChangeRowsPerPage}*/}
                                {/*    />*/}
                                {/*</Paper>*/}


                            </Formsy>

                        </div>
                        <Snackbar open={open1} autoHideDuration={3000} >
                            <Alert  severity="success">
                                {name}{t("CLIENTADDEDSUCCESFULLY")}
                            </Alert>
                        </Snackbar>

                    </Div>
                </div>
            }

        />
        );
    }



export default withSnackbar(ExcelConvert);