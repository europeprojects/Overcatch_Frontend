import FuseUtils from '@fuse/utils';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Div} from "../../components/Grid";
import DialogContentText from "@material-ui/core/DialogContentText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Formsy from "formsy-react";
import {
    createStyles, LinearProgress,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, Theme, withStyles
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SelectFormsy from "../../../@fuse/core/formsy/SelectFormsy";
import TextFieldFormsy from "../../../@fuse/core/formsy/TextFieldFormsy";
import Snackbar from "@material-ui/core/Snackbar";
import api from "../../services/BackendApi";
import {useSnackbar} from "notistack";
import MuiAlert from '@material-ui/lab/Alert'
import {Alert} from "@material-ui/lab";
import {isValidErrorResponse} from "../../utils/utils";
import {BankTransaction, BankType, DocumentClass} from "../../types/UserModel";
import BackendApi from "../../services/BackendApi";
import IconButton from "@material-ui/core/IconButton";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {number} from "prop-types";


interface Column {
    id: 'column1' | 'column2' | 'column3' | 'column4' | 'column5';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'column1', label: 'Column 1', minWidth: 170},
    {id: 'column2', label: 'Column 2', minWidth: 100},
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
    return {name, code, population, size, density};
}

const rows = [
    // createData('India', 'IN', 1324171354, 3287263),
    // createData('China', 'CN', 1403500365, 9596961),
    // createData('Italy', 'IT', 60483973, 301340),
    // createData('United States', 'US', 327167434, 9833520),
    // createData('Canada', 'CA', 37602103, 9984670),
    // createData('Australia', 'AU', 25475400, 7692024),
    // createData('Germany', 'DE', 83019200, 357578),
    // createData('Ireland', 'IE', 4857000, 70273),
    // createData('Mexico', 'MX', 126577691, 1972550),
    // createData('Japan', 'JP', 126317000, 377973),
    // createData('France', 'FR', 67022000, 640679),
    // createData('United Kingdom', 'GB', 67545757, 242495),
    // createData('Russia', 'RU', 146793744, 17098246),
    // createData('Nigeria', 'NG', 200962417, 923768),
    // createData('Brazil', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
    root: {
        width: '100%',
        padding: 15,
    },
    container: {
        maxHeight: 440,
    },
});


const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }),
)(LinearProgress);


interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

function Conversion(props) {
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
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
    const [description, setDescription] = React.useState();
    const [documentInfo, setDocument] = useState<DocumentClass>();
    const [error, setError] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [bankType, setBankType] = useState<string>('none');
    const [statementType, setStatementType] = useState<string>('none');
    const [clientType, setClientType] = useState<string>('none');
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [bankTransaction, setBankTransaction] = useState<BankTransaction>()


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
    useEffect(() => {
        console.log(bankType);
    }, [bankType])
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function changeSelf() {
        setIsSelfAssesment(true)
        setIsOther(false)
    }



    function handleChange2(e) {
        setFile(e.target.files[0])
    }

    function handleClick(e) {
        setProgress(0)
        e.preventDefault();
        console.log(file);
        let progressCallback = (loaded: number, total: number) => {
            setProgress(Math.round((loaded / total) * 100))
        };

        // setUploadDocumentList([...uploadDocumentList, document])

        api.uploadDocumentData2(file, "Bank", bankType, statementType, progressCallback).then((data) => {
            // history.push('/documentcreate' )
            // history.go(0)
            // setIsSuccess(true)ss})
            setFileName(data.processId)
            setHidden(true);
            setTimeout(function() { window.location=window.location;},4000);

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
        <Div>
            <div>
                <Formsy>
                    <Div columns={3} className={"p-20"}>
                        <SelectFormsy
                            className="my-16"
                            label="Select Bank"
                            value={bankType}
                            variant="outlined"
                            name="banks"
                            onChange={(e) => {
                                setBankType(e.target.value)
                            }}
                        >
                            <MenuItem value="none">
                                <em>Please Select</em>
                            </MenuItem>
                            {Object.keys(BankType)
                                .map(key => (<MenuItem value={key}>{BankType[key]}</MenuItem>))}

                        </SelectFormsy>
                        <SelectFormsy
                            className="my-16"
                            label="Select Client Type"
                            value={clientType}
                            variant="outlined"
                            name="type"
                            onChange={(e) => {
                                setClientType(e.target.value)
                            }}
                        >
                            <MenuItem value="none">
                                <em>Please Select</em>
                            </MenuItem>
                            <MenuItem value="ACCOUNT">Account</MenuItem>
                            <MenuItem value="BUSSINESS">Business</MenuItem>
                        </SelectFormsy>
                        <SelectFormsy
                            className="my-16"
                            label="Amount Type"
                            value={statementType}
                            variant="outlined"
                            name="type"
                            onChange={(e) => {
                                setStatementType(e.target.value)
                            }}
                        >
                            <MenuItem value="none">
                                <em>Please Select</em>
                            </MenuItem>
                            <MenuItem value="MULTIPLE">Multiple Amount</MenuItem>
                            <MenuItem value="SINGLE">Single Amount</MenuItem>
                        </SelectFormsy>
                    </Div>
                    <div className={"w-full p-20"}>
                        <BorderLinearProgress variant="determinate" value={progress}/>

                    </div>
                    <div className={"flex w-full justify-self-stretch mx-8 my-12"}>
                        <input className={"hidden"}
                               type="file"
                            // onClick={handleChange2}
                               onChange={handleChange2}
                               id="contained-button-file"
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span">
                                Upload
                            </Button>
                        </label>
                        <Button variant="contained" type="submit" color="secondary" onClick={handleClick}>
                            Save
                        </Button>
                        {/*<LinearProgress variant="determinate"*/}
                        {/*                  color={progress === 100 ? "secondary" : "primary"}*/}
                        {/*                  value={progress}/>*/}
                    </div>

                    <Div>
                        <Paper className={classes.root}>
                            <TableContainer className={classes.container}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{minWidth: column.minWidth}}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </Paper>
                        {/*<a className="truncate"*/}
                        {/*   onClick={() => getDownload()}>Download</a>*/}
                    </Div>


                </Formsy>

            </div>
            <Snackbar open={open1} autoHideDuration={3000}>
                <Alert severity="success">
                    {name}'s client is added successfuly
                </Alert>
            </Snackbar>

        </Div>
    );
}

export default Conversion;
