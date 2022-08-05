import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles, useTheme} from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
    Button,
    Checkbox,
    Icon,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList, Paper, TableContainer, TablePagination,
    TableSortLabel, Theme,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {func, number, object, oneOf, string} from 'prop-types';
import FusePageCarded from "../../../@fuse/core/FusePageCarded/FusePageCarded";
import FuseScrollbars from "../../../@fuse/core/FuseScrollbars";
import {useSelector} from 'react-redux';
import api from "../../services/BackendApi";
import BackendApi from "../../services/BackendApi";
import _ from "lodash";
import {BankTransactionDetail, Help} from "../../types/UserModel";
import {useParams} from "react-router-dom";
import history from '@history';
import {useTranslation} from "react-i18next";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";

import {Delete, KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";


interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}


function ProductsTableHead(props) {
    const classes = useStyles(props);
    const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);
    const {t} = useTranslation('conversion');
    const createSortHandler = property => event => {
        props.onRequestSort(event, property);
    };

    const rows = [
        {
            id: 'processDate',
            align: 'left',
            disablePadding: false,
            label: t("PROCESSDATE"),
            sort: true
        },

        {
            id: 'transactionType',
            align: 'left',
            disablePadding: false,
            label: t("TRANSACTIONTYPE"),
            sort: true
        },
        {
            id: 'description',
            align: 'left',
            disablePadding: false,
            label: t("DESCRIPTION"),
            sort: true
        },
        {
            id: 'moneyIn',
            align: 'left',
            disablePadding: false,
            label: t("MONEYIN"),
            sort: true
        },
        {
            id: 'moneyOut',
            align: 'left',
            disablePadding: false,
            label: t("MONEYOUT"),
            sort: true
        },
        {
            id: 'balance',
            align: 'right',
            disablePadding: false,
            label: t("BALANCE"),
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
                    <Checkbox
                        indeterminate={props.numSelected > 0 && props.numSelected < props.rowCount}
                        checked={props.numSelected === props.rowCount}
                        onChange={props.onSelectAllClick}
                    />
                    {props.numSelected > 0 && (
                        <div
                            className={clsx(
                                'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1',
                                // classes.actionsButtonWrapper
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
                            className="p-4 md:p-16"
                            key={row.id}
                            //@ts-ignore
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={props.order.id === row.id ? props.order.direction : false}
                        >
                            {row.sort && (
                                <Tooltip
                                    title="Sort"
                                    placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={props.order.id === row.id}
                                        direction={props.order.direction}
                                        onClick={createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            )}
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
    return stabilizedThis.map(el => el[0]);
}


function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const {t} = useTranslation('conversion');


    const headCells = [
        {id: 'processDate', numeric: false, disablePadding: true, label: t("PROCESSDATE")},
        {id: 'transactionType', numeric: true, disablePadding: false, label: t("TRANSACTIONTYPE")},
        {id: 'description', numeric: true, disablePadding: false, label: t("DESCRIPTION")},
        {id: 'moneyIn', numeric: true, disablePadding: false, label: t("MONEYIN")},
        {id: 'moneyOut', numeric: true, disablePadding: false, label: t("MONEYOUT")},
        {id: 'balance', numeric: true, disablePadding: false, label: t("BALANCE")},

    ];

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{'aria-label': 'select all desserts'}}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
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
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
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

export default function DocumentsList(props: any) {
    const classes = useStyles();
    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });
    const {t} = useTranslation('conversion');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [helpList, setHelpList] = React.useState<Help[]>();
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    // const [documents, setDocuments] = React.useState<DocumentInfo[]>(props.documents);
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [open, setOpen] = React.useState(false);
    const [selectedHelp, setSelectedHelp] = React.useState<Help>();
    const [details, setDetails] = useState<BankTransactionDetail[]>();
    const [details2, setDetails2] = useState<BankTransactionDetail[]>();
    const routeParams = useParams();
    // @ts-ignore
    const { transactionId } = routeParams;
    // @ts-ignore
    const routingData = history.location.displayRouteData;

    useEffect(()=>{console.log(routingData)},[routingData])

    // function handleCheck(event, id) {
    //     	const selectedIndex = selected.indexOf(id);
    //     	let newSelected = [];
    //
    //     	if (selectedIndex === -1) {
    //     		newSelected = newSelected.concat(selected, id);
    //     	} else if (selectedIndex === 0) {
    //     		newSelected = newSelected.concat(selected.slice(1));
    //     	} else if (selectedIndex === selected.length - 1) {
    //     		newSelected = newSelected.concat(selected.slice(0, -1));
    //     	} else if (selectedIndex > 0) {
    //     		newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    //     	}
    //
    //     	setSelected(newSelected);
    //     }

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



    useEffect(()=>{
        api.getBankTransactionDetails(transactionId.toString()).then(res => {
            setDetails(res);
            let temporal = res.forEach(function(v){ delete v.id });
            setDetails2(temporal)
        })
    }, [])

    const getDownload = (fileName: string) => {
        BackendApi.getDownloadDocumentByUser(clientId.toString(), fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })
    }


    useEffect(()=>{
        console.log(helpList)
    },[helpList])

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = documents.map(n => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };



    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        // let newSelected = [];
        //
        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(selected, name);
        // } else if (selectedIndex === 0) {
        //     newSelected = newSelected.concat(selected.slice(1));
        // } else if (selectedIndex === selected.length - 1) {
        //     newSelected = newSelected.concat(selected.slice(0, -1));
        // } else if (selectedIndex > 0) {
        //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        // }
        //
        // setSelected(newSelected);
        setSelectedHelp(helpList.find(i => i.id === name));
        setOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(array[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = routingData.fileName+".csv";

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }



    const Export = ({ onExport }) => (

        // @ts-ignore
        <Button  onClick={e => onExport(e.target.value)} variant="contained" color="secondary">
            <Icon>get_app</Icon>
            {/*Export CSV*/}
            {t("EXPORTCSV")}
        </Button>
    );

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, documents?.length - page * rowsPerPage);
    const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(details2)} />, []);


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

    const useStyles1 = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexShrink: 0,
                marginLeft: theme.spacing(2.5),
            },
        }),
    );

    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={<div className="flex w-full md:py-24">
                <div className={"auto-cols-auto"}>
                    <h1 className={"self-start"}>{t("TRANSACTIONDETAIL")}</h1>
                    <div className={"self-end"}>
                        <Export onExport={() => downloadCSV(details)}></Export>
                    </div>
                </div>
            </div>}
            content={
                <div className="w-full flex flex-col pb-20 ">

                    <FuseScrollbars className="flex-grow overflow-x-auto">
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t("PROCESSDATE")}</TableCell>
                                        <TableCell align="left">{t("DESCRIPTION")}</TableCell>
                                        <TableCell align="right">{t("MONEYIN")}</TableCell>
                                        <TableCell align="right">{t("MONEYIN")}</TableCell>
                                        <TableCell align="right">{t("MONEYIN")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {details?.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.processDate}
                                            </TableCell>
                                            <TableCell align="left">{row.description}</TableCell>
                                            <TableCell align="right">{row.moneyIn}</TableCell>
                                            <TableCell align="right">{row.moneyOut}</TableCell>
                                            <TableCell align="right">{row.balance}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/*<Table stickyHeader className="min-w-xl"*/}
                        {/*       aria-labelledby="tableTitle"*/}
                        {/*       size={"small"}>*/}
                        {/*    <ProductsTableHead*/}
                        {/*        numSelected={selected.length}*/}
                        {/*        order={order}*/}
                        {/*        onSelectAllClick={handleSelectAllClick}*/}
                        {/*        onRequestSort={handleRequestSort}*/}
                        {/*        rowCount={details?.length}*/}
                        {/*    />*/}

                        {/*    <TableBody>*/}
                        {/*        {_.orderBy(*/}
                        {/*            details,*/}
                        {/*            [*/}
                        {/*                o => {*/}
                        {/*                    switch (order.id) {*/}
                        {/*                        // case 'categories': {*/}
                        {/*                        //     //@ts-ignore*/}
                        {/*                        // 	return o.helpType.helpTypeShowName;*/}
                        {/*                        // }*/}
                        {/*                        default: {*/}
                        {/*                            return o[order.id];*/}
                        {/*                        }*/}
                        {/*                    }*/}
                        {/*                }*/}
                        {/*            ],*/}
                        {/*            //@ts-ignore*/}
                        {/*            [order.direction]*/}
                        {/*        )*/}
                        {/*            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)*/}
                        {/*            .map(n => {*/}
                        {/*                const isSelected = selected.indexOf(n.id) !== -1;*/}
                        {/*                return (*/}
                        {/*                    <TableRow*/}
                        {/*                        style={{height: 5 } }*/}
                        {/*                        className="h-64 cursor-pointer"*/}
                        {/*                        hover*/}
                        {/*                        // role="checkbox"*/}
                        {/*                        // aria-checked={isSelected}*/}
                        {/*                        tabIndex={-1}*/}
                        {/*                        key={n.id}*/}
                        {/*                        // selected={isSelected}*/}
                        {/*                        // onClick={event => handleClick(event, n.id)}*/}
                        {/*                    >*/}
                        {/*                        <TableCell className="w-40 md:w-64 text-center" padding="none">*/}
                        {/*                            <Checkbox*/}
                        {/*                                checked={isSelected}*/}
                        {/*                                onClick={event => event.stopPropagation()}*/}
                        {/*                                // onChange={event => handleCheck(event, n.id)}*/}
                        {/*                            />*/}
                        {/*                        </TableCell>*/}



                        {/*                        <TableCell className="p-4 md:p-16" component="th" scope="row">*/}
                        {/*                            {n.processDate}*/}
                        {/*                        </TableCell>*/}
                        {/*                        <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">*/}
                        {/*                            {n.transactionType}*/}
                        {/*                        </TableCell>*/}
                        {/*                        <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">*/}
                        {/*                            {n.description}*/}
                        {/*                        </TableCell>*/}
                        {/*                        <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">*/}
                        {/*                            {n.moneyIn}*/}
                        {/*                        </TableCell>*/}
                        {/*                        <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">*/}
                        {/*                            {n.moneyOut}*/}
                        {/*                        </TableCell>*/}
                        {/*                        <TableCell className="p-4 md:p-16 truncate" component="th" align={"right"} scope="row">*/}
                        {/*                            {n.balance}*/}
                        {/*                        </TableCell>*/}

                        {/*                        /!*<TableCell className="p-4 md:p-16" component="th" scope="row" align="right">*!/*/}
                        {/*                        /!*	{n.active ? (*!/*/}
                        {/*                        /!*		<Icon className="text-green text-20">check_circle</Icon>*!/*/}
                        {/*                        /!*	) : (*!/*/}
                        {/*                        /!*		<Icon className="text-red text-20">remove_circle</Icon>*!/*/}
                        {/*                        /!*	)}*!/*/}
                        {/*                        /!*</TableCell>*!/*/}
                        {/*                    </TableRow>*/}
                        {/*                );*/}
                        {/*            })}*/}
                        {/*    </TableBody>*/}
                        {/*</Table>*/}
                    </FuseScrollbars>

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

                </div>
            }

            innerScroll
        />
    );
}
