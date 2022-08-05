import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {useFormik} from "formik";
import {
    Grid,
    Button,
    Icon,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
    TableContainer,
    TextField
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {func, number, object, oneOf, string} from 'prop-types';
import {useSelector} from 'react-redux';
import _ from "lodash";
import {HelpType} from "../../../../src/app/types/UserModel";
import history from "../../../@history/@history";
import api from "../../services/BackendApi"
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import {Div} from "app/components/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {useTranslation} from "react-i18next";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import FuseAnimate from '@fuse/core/FuseAnimate';
import Paper from '@material-ui/core/Paper';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import {supportSettingsScheme} from "../validations/ValidationSchemes";

function ProductsTableHead(props) {
    const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);
    const {t} = useTranslation('task');

    const rows = [
        {
            id: 'topic',
            align: 'left',
            disablePadding: false,
            label:t("TOPİC"),
            sort: true
        },
        {
            id: 'email',
            align: 'left',
            disablePadding: false,
            label:t("RESPONSIBLEEMAIL"),
            sort: true
        },
        {
            id: 'duration',
            align: 'Left',
            disablePadding: false,
            label:t("CLOSEDURATION"),
            sort: true
        },
        {
            id: 'action',
            align: 'left',
            disablePadding: false,
            label:t("ACTION"),
            sort: true
        },
    ];

    function openSelectedProductsMenu(event) {
        setSelectedProductsMenu(event.currentTarget);
    }

    function closeSelectedProductsMenu() {
        setSelectedProductsMenu(null);
    }

    return (
        <TableHead>
            <TableRow className="h-64">
                <TableCell padding="none" className="w-40 md:w-64 text-center z-99">
                    {props.numSelected > 0 && (
                        <div
                            className={clsx(
                                'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1',
                            )}
                        >
                            <IconButton
                                aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
                                aria-haspopup="true"
                                onClick={openSelectedProductsMenu}
                            >
                                <Icon>more_horiz</Icon>
                            </IconButton>
                            <Menu
                                id="selectedProductsMenu"
                                anchorEl={selectedProductsMenu}
                                open={Boolean(selectedProductsMenu)}
                                onClose={closeSelectedProductsMenu}
                            >
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            closeSelectedProductsMenu();
                                        }}
                                    >
                                        <ListItemIcon className="min-w-40">
                                            <Icon>delete</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary="Remove"/>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    )}
                </TableCell>
                {rows.map(row => {
                    return (
                        <TableCell
                            className="p-12 md:p-16"
                            key={row.id}
                            //@ts-ignore
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={props.order.id === row.id ? props.order.direction : false}
                        >
                            {  row.sort &&row.label}
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const headCells = [
    {id: 'ProcessID', numeric: false, disablePadding: true, label: 'Process ID'},
    {id: 'userID', numeric: true, disablePadding: false, label: 'User'},
    {id: 'documentName', numeric: true, disablePadding: false, label: 'Document Name'},
    {id: 'fileName', numeric: true, disablePadding: false, label: 'File Name'},
    {id: 'fileDescription', numeric: true, disablePadding: false, label: 'File Description'}
];

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };


}

EnhancedTableHead.propTypes = {
    classes: object.isRequired,
    numSelected: number.isRequired,
    onRequestSort: func.isRequired,
    onSelectAllClick: func.isRequired,
    order: oneOf(['asc', 'desc']).isRequired,
    orderBy: string.isRequired,
    rowCount: number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    title: {
        flex: '1 1 100%'
    }
}));

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const {numSelected} = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Support List
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: number.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
       maxHeight: 450
    },
    table: {
        minWidth: 750
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

export default function SupportSettings(props: any) {

    const classes = useStyles();
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [search, setSearch] = useState<string>("");  // Başlangıç değerleri ""
    const [buyer, setBuyer] = useState<HelpType>();
    const [helpList, setHelpList] = React.useState<HelpType[]>();
    const [selectedHelp, setSelectedHelp] = React.useState<HelpType>({} as HelpType);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = useState<HelpType>({} as HelpType);

    const formik = useFormik({
        initialValues: {
            helpTypeShowName:'',
            duration: 3,
            email:'',
            divided:null
        },
        validationSchema: supportSettingsScheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSave(values)
        },
    });

    const handleSave = (values) => {

        let helpTypePost : HelpType;

        if(selectedHelp.id){
            value.email = formik.values.email;
            value.helpTypeShowName = formik.values.helpTypeShowName;
            value.duration = formik.values.duration;
            value.divided = formik.values.divided;
            value.id = selectedHelp.id;
            helpTypePost = {
                id:value.id,
                email:value.email,
                helpTypeShowName:value.helpTypeShowName,
                duration:value.duration,
                divided:value.divided
            };
            api.updateHelpType(helpTypePost).then(res => {
                history.push("/supportSettings");
                getHelpTypes();
                selectedHelp.id = null;
                setSelectedHelp(selectedHelp)
            })
        }
        else {
            value.email = formik.values.email;
            value.helpTypeShowName = formik.values.helpTypeShowName;
            value.duration = formik.values.duration;

            helpTypePost = {
                id:null,
                email:value.email,
                helpTypeShowName:value.helpTypeShowName,
                duration:value.duration,
                divided:value.divided,
            };
            api.saveHelpType(helpTypePost).then(res => {
                history.push("/supportSettings");
                getHelpTypes();
            })
        }
        setOpen(false);
        return helpTypePost;
    };

    function handleRequestSort(event, property) {
        const id = property;
        let direction = 'desc';

        if (order.id === property && order.direction === 'desc') {
            direction = 'asc';
        }

        setOrder({
            direction,
            id
        });
    }

    const {documents} = props;
    const getDownload = (id:number,fileName: string) => {
        api.getDownloadDocumentByUser(id.toString(), fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })
    }

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = documents.map(n => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    function handleClickDialog() {
        setOpen(true);
    }

    const handleClick = (event, helpType) => {
        setSelectedHelp(helpType);
        formik.values.helpTypeShowName = helpType.helpTypeShowName;
        formik.values.email = helpType.email;
        formik.values.duration = helpType.duration;
        setOpen(true);
    };


    const handleClickPost = () => {
        formik.values.email = '';
        formik.values.duration = 3;
        formik.values.helpTypeShowName = '';
        setOpen(true);
    };

    const handleClickOpen = (selectedBuyer) => {
        setBuyer(selectedBuyer);
        setOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleForm(event) {
        setSelectedHelp({...selectedHelp, [event.target.name]: event.target.value})
    }

    function handleClickSearch() {
        setPage(0)
        getSupport(search);
    }

    function getHelpTypes() {
        api.getHelpTypes().then( res =>  {
            setHelpList(res)
        })
    }

    useEffect(() => {
        getHelpTypes();
    }, [])

    function getSupport(search){
        api.getSupport(search).then(res => {
            setHelpList(res);
        });
    }
    const {t} = useTranslation('task');
    // @ts-ignore
    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <Div columns={6} className={'my-auto'}>

                    <div className="flex flex-center">
                        <div className="flex-none mt-16 mb-12 my-16">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Icon className="insert_drive_file">contact_support</Icon>
                            </FuseAnimate>
                        </div>
                        <div className="flex-1 mt-12 mb-12 my-16">
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography variant="h6">
                                    {t('SUPPORTSETTINGS')}
                                </Typography>
                            </FuseAnimate>
                        </div>
                    </div>

                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>

                    <div className="flex-1 mt-12 mb-12 my-16 flex-end">
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Button variant="contained" color="default"
                                    onClick={() => handleClickPost()}
                            >   {t("ADDNEWSUPPORT")}
                            </Button>
                        </FuseAnimate>
                    </div>
                </Div>
            }
            content={
                <div className={classes.root}>
                    <TableContainer className={classes.paper}>
                        <Table stickyHeader aria-labelledby="tableTitle">
                            <ProductsTableHead
                                numSelected={selected.length}
                                order={order}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={helpList?.length}
                            />
                            <TableBody>
                                {_.orderBy( helpList,[o => {
                                        switch (order.id) {
                                            default: {
                                                return o[order.id];
                                            }
                                        }
                                    }
                                    ],
                                    //@ts-ignore
                                    [order.direction]
                                )   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(n => {
                                        return (
                                            <TableRow
                                                className="h-64 cursor-pointer" hover tabIndex={-1} key={n.id}>

                                                <TableCell className="w-40 md:w-64 text-center" padding="none"></TableCell>
                                                <TableCell className="p-4 md:p-16 truncate" component="th" scope="row"> {n?.helpTypeShowName} </TableCell>
                                                <TableCell className="p-4 md:p-16 truncate" component="th" scope="row"> {n?.email} </TableCell>
                                                <TableCell className="p-12 md:p-16 truncate" component="th" scope="row"> {n?.duration} </TableCell>
                                                <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
                                                    <IconButton
                                                        onClick={event => {
                                                            handleClick(event, n)

                                                        }}
                                                    >
                                                        <Icon color="secondary">create</Icon>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        className="flex-shrink-0 border-t-1"
                        component="div"
                        count={helpList?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page'
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page'
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}

                    />
                    <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                        <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                            <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                                <Dialog fullWidth={true} maxWidth={"md"} onClose={handleClose}
                                        aria-labelledby="customized-dialog-title" open={open}>
                                    <form onSubmit={formik.handleSubmit}>
                                        <DialogTitle id="customized-dialog-title">
                                            {t("ADDNEWSUPPORT")}
                                        </DialogTitle>
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
                                                            <TextField
                                                                name={"helpTypeShowName"}
                                                                id="helpTypeShowName"
                                                                label={t("TOPICOFREQUEST")}
                                                                variant="outlined"
                                                                value={formik.values.helpTypeShowName}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.helpTypeShowName && Boolean(formik.errors.helpTypeShowName)}
                                                                helperText={formik.touched.helpTypeShowName && formik.errors.helpTypeShowName}
                                                                fullWidth={true}
                                                                className={"object-center"}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        justify="space-evenly"
                                                        alignItems="center"
                                                        spacing={3}>
                                                        <Grid item xs>
                                                            <TextField
                                                                className={"object-center"}
                                                                name={"email"}
                                                                id="email"
                                                                label={t("RESPONSIBLEEMAIL")}
                                                                variant="outlined"
                                                                fullWidth={true}
                                                                value={formik.values.email}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                                helperText={formik.touched.email && formik.errors.email}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        justify="space-evenly"
                                                        alignItems="center"
                                                        spacing={3}>
                                                        <Grid item xs>
                                                            <TextField
                                                                className={"object-center"}
                                                                name={"duration"}
                                                                id="duration"
                                                                label={t("CLOSEDURATION")}
                                                                variant="outlined"
                                                                fullWidth={true}
                                                                value={formik.values.duration}
                                                                onChange={formik.handleChange}
                                                                error={formik.touched.duration && Boolean(formik.errors.duration)}
                                                                helperText={formik.touched.duration && formik.errors.duration}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus type={"submit"} color="primary"> {t("SAVECHANGES")}</Button>
                                            <Button color="primary" onClick={handleClose}> {t("CLOSE")}</Button>
                                        </DialogActions>
                                    </form>
                                </Dialog>
                            </Paper>
                        </FuseAnimate>
                    </div>
                </div>
            }
            innerScroll
        ></FusePageCarded>
    );
}
