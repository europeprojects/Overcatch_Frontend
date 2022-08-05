import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles,Theme, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import api from "../../../services/BackendApi";
import {PersonelDTO} from "../../../types/UserModel";
import {UserDTO} from "../../../types/UserModel";
import {useTranslation} from "react-i18next";
import FusePageCarded from "../../../../@fuse/core/FusePageCarded";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import {
    Grid,
    Button,
    Icon,
    IconButton,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
    TableContainer,
    TextField
} from '@material-ui/core';
import {withSnackbar} from "notistack";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,

        },
    }),
);

const useStyles2 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 650
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}));




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

function StaffList(props: any) {
    const classes = useStyles();
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });

    const [page, setPage] = React.useState(0);
    const [page1, setPage1] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rowsPerPage1, setRowsPerPage1] = React.useState(5);
    const [personelList, setPersonelList] = React.useState([]);
    const [confirmList, setConfirmList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDetail, setOpenDetail] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedType, setSelectedType] = useState<PersonelDTO>({} as PersonelDTO);
    const [personel, setpersonel] = useState<PersonelDTO>({} as PersonelDTO);
    const [id, setId] = useState();

    function getPersonel () {
        api.getPersonel().then(res => {
        console.log(res)
            setPersonelList(res)
        })
    }



    useEffect(() => {
      console.log(personelList)
    }, [personelList])
    useEffect(() => {
        getPersonel()
    }, [])


    function getTasksByPersonelId () {
        api.getTasksByPersonelId(id).then(res => {
            console.log(res)
            setConfirmList(res)
        })
    }

    useEffect(() => {
        console.log(confirmList)
    }, [confirmList])
     useEffect(() => {
         if(id!=null)
         getTasksByPersonelId()
     }, [id])



      const handleClickDetail = (event, row) => {

        setSelectedType(row);
        setOpenDetail(true);
    };


    const handleClickDelete = (row) => {
        setpersonel(row);
        setOpenDelete(true);
    };

    useEffect(() => {

    }, [selectedType])

    //const handleClickPost = () => {
    //  formik.values.name = '';
        //setOpen(true);
    //};

    const handleClickOpen = (selectedBuyer) => {
          setOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangePage1 = (event, newPage) => {
        setPage1(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeRowsPerPage1 = event => {
        setRowsPerPage1(parseInt(event.target.value, 10));
        setPage1(0);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenDetail(false);
    };

    const [orderBy, setOrderBy] = React.useState('calories');
    const {t}=useTranslation('task');
    // @ts-ignore
    return (
        <FusePageCarded
            classes={{
                // content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between">
                    <div className="flex flex-1 flex-col items-center sm:items-start">
                        {/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
                        <h1>{t("STAFF")}</h1>
                    </div>
                </div>
            }
            content={
                <div>
                            <TableContainer
                                component={Paper}
                            >
                                <Table stickyHeader aria-label="sticky table"

                                       className={classes.table}  size={"small"}

                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align={"center"}>
                                                {t("STAFFNAME")}
                                            </TableCell>
                                            <TableCell align={"center"}>
                                                {t("DEPARTMENT")}
                                            </TableCell>
                                            <TableCell align={"center"}>
                                                {t("DETAIL")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stableSort(personelList, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((person, index) => {

                                                return (

                                                    <TableRow hover role="checkbox" tabIndex={-1} key={person?.id}>

                                                        <TableCell
                                                            onClick={() => handleClickOpen(person)}
                                                        >
                                                            {person?.user?.name+" "+person?.user?.surname}

                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {person?.department?.name}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            <IconButton
                                                                onClick={event => {
                                                                    setId(person.id)
                                                                    handleClickDetail(event, person)
                                                                    setpersonel(person)
                                                                }}
                                                            >
                                                                <Icon>person</Icon>


                                                            </IconButton>
                                                        </TableCell>

                                                        <Dialog fullWidth={true} maxWidth={"md"} onClose={handleClose}
                                                                aria-labelledby="customized-dialog-title" open={openDetail}>

                                                                 <DialogContent dividers>
                                                                    <div className={"w-full p-32"}>
                                                                        <div className={"w-full"}>

                                                                            <Grid
                                                                                container
                                                                                direction="row"
                                                                                justify="space-evenly"
                                                                                alignItems="center"
                                                                                spacing={3}
                                                                            >
                                                                                <Grid item xs>
                                                                                    <TableContainer component={Paper}>
                                                                                        <Table stickyHeader aria-label="sticky table"

                                                                                               className={classes.table}  size={"small"}
                                                                                        >
                                                                                            <TableHead>
                                                                                                <TableRow>

                                                                                                    <TableCell align={"center"}>
                                                                                                        {t("TASKS")}
                                                                                                    </TableCell>
                                                                                                    <TableCell align={"center"}>
                                                                                                        {t("STATUS")}
                                                                                                    </TableCell>
                                                                                                    <TableCell align={"center"}>
                                                                                                        {t("DATE")}
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            </TableHead>

                                                                                            <TableBody>
                                                                                                {stableSort(confirmList, getComparator(order, orderBy))
                                                                                                    .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1)
                                                                                                    .map((status, index) => {

                                                                                                        return (
                                                                                                            <TableRow hover  tabIndex={-1} key={status?.id}>
                                                                                                                <TableCell>
                                                                                                                    {status?.tasks?.moduleType?.moduleTypeEnum}
                                                                                                                </TableCell>
                                                                                                                <TableCell align={"center"}>
                                                                                                                    {status?.taskConfirm}

                                                                                                                </TableCell>

                                                                                                                <TableCell
                                                                                                                    align={"center"}

                                                                                                                >{status?.processDate}

                                                                                                                </TableCell>

                                                                                                            </TableRow>
                                                                                                        );
                                                                                                    })}
                                                                                            </TableBody>
                                                                                        </Table>
                                                                                        <TablePagination
                                                                                            rowsPerPageOptions={[5, 10, 25]}
                                                                                            component="div"
                                                                                            count={confirmList.length}
                                                                                            rowsPerPage={rowsPerPage1}
                                                                                            page={page1}
                                                                                            onPageChange={handleChangePage1}
                                                                                            onRowsPerPageChange={handleChangeRowsPerPage1}
                                                                                            ActionsComponent={TablePaginationActions}
                                                                                        />
                                                                                    </TableContainer>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose} color="primary"> {t("CLOSE")}</Button>
                                                                </DialogActions>

                                                        </Dialog>


                                                        </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={3}
                        count={personelList?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </div>
            }
            innerScroll
        ></FusePageCarded>
    );
}

export default withSnackbar(StaffList);