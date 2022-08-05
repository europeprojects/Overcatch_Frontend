import FuseAnimate from '@fuse/core/FuseAnimate';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from '@material-ui/icons/Close';
import {createStyles, lighten, makeStyles, Theme, useTheme, withStyles, WithStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
    TableContainer,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
    Checkbox,
    FormControlLabel, DialogContentText, Slide,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {array, func, number, object, oneOf, string} from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {removeSelectedContactId} from "../../../fuse-layouts/shared-components/chatPanel/store/contactsSlice";
import Icon from "@material-ui/core/Icon";
import {Delete, KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import * as path from "path";
import Documents from "../Documents";
import * as fs from "fs";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import {TransitionProps} from "@material-ui/core/transitions";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import api from "../../../services/BackendApi";
import DetailSidebarHeader from "./DetailSidebarHeader";
import DetailSidebarContent from "./DetailSidebarContent";
//import { setSelectedItem, selectFiles } from './store/filesSlice';

const useStyles = makeStyles({
    typeIcon: {
        '&.BANK:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.VISA:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        },
        '&.LETTER:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        },
        '&.UTR:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        },
        '&.NINO:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        },
        '&.PAYE:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        },
        '&.COMPANY:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        },
        '&.BRPCARD:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        },
        '&.OTHER:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        },
        '&.PASSPORT:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        },
        '&.TC:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        },
        '&.POLICEREGISTRATION:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        }
    },
    root: {
        width: '100%'
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
    },
    container:{
        maxHeight: 410
    }

});

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);


function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const {t} = useTranslation('task');
    const headCells = [
        {id: 'documentType', numeric: false, disablePadding: false, label: t("DOCUMENTTYPE"),sortable:true},
        {id: 'documentName', numeric: false, disablePadding: false, label: t('DOCUMENTNAME'),sortable:true},
        {id: 'fileName', numeric: true, disablePadding: false, label: t('FILENAME'),sortable:false},
        { id: 'createdDateTime', numeric: false, disablePadding: false, label: t('DATE'),sortable:true},
        { id: 'delete', numeric: false, disablePadding: false, label: t('DELETE'),sortable:false}

    ];
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortable ? (
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
                        ):headCell.label}

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

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });
export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

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

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    const [open, setOpen] = React.useState(false)
    const {selectedDocuments} = props
    const {t} = useTranslation('task');

    useEffect(() => {
        console.log("numselected", numSelected)
    }, [numSelected])
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    function deleteSelectedDocuments(selectedDocuments){
        console.log(selectedDocuments)
        if (selectedDocuments.length>0){
            for(var i=0; i<selectedDocuments.length; i++){
                api.deleteFileById(selectedDocuments[i].id).then(res => {
                    //window.location.reload()
                });
            }
        }
        setTimeout(function () {
            window.location = window.location;
        }, 100);
    }

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                    <Dialog onClose={handleClose}
                            open={open}
                        //TransitionComponent={Transition}
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle onClose={handleClose}
                                     id="alert-dialog-slide-title">{t("DELETEFILES")}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {selectedDocuments.length} {t("SELECTED")}. {t("DELETESELECTED")}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={ () => {deleteSelectedDocuments(selectedDocuments)}}>
                                {t("YES")}
                            </Button>
                            <Button onClick={handleClose} color="primary">
                                {t("NO")}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {t("DOCUMENTLIST")}
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton  aria-label="delete" onClick = { () => handleOpen()}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: number.isRequired,
    selectedDocuments: array,
};


function stableSort(array, comparator) {
    
    const stabilizedThis = array.map((el, index) => [el, index]);
    console.log(stabilizedThis)

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}


function descendingComparator(a, b, orderBy) {

        let sa =String(a[orderBy]).toLowerCase();
        let sb =String(b[orderBy]).toLowerCase();

        if (sb < sa) {
            return -1;
        }
        if (sb > sa) {
            return 1;
        }
        return 0;

}

function getComparator(order, orderBy) {
    
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}





//function setSelectedItem(state, document){

//  setSelectedItemId(document.id)
//  state.selectedItemId = document.id;
//}

//EKLEMEEE
/*let srcPath = path.join(__dirname, "../src");
function deneme3() {
const fs = require('fs-extra')
fs.remove(srcPath)
    .then(() => {
        console.log('success!')
    })
    .catch(err => {
        console.error(err)
    })}
function removeElement(elementId) {
     // Removes an element from the document.
    var element = document. getElementById(elementId);
    element. parentNode. removeChild(element);
     }
function deneme2(){
const deleteFile = './docs/deleteme.txt'
if (fs.existsSync(deleteFile)) {
    fs.unlink(deleteFile, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('deleted');
    })
}}
function deneme1() {
    ( document.getElementById("myTable") as HTMLInputElement).remove();
}*/
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

function FileList(props) {
    const dispatch = useDispatch();
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState();
    const {selectedItem, setSelectedItem} = props;
    //const files = useSelector(selectFiles);
    //const selectedItemId = useSelector(({ fileManagerApp }) => fileManagerApp.files.selectedItemId);
    const {documentList, setDocumentList} = props
    //const classes = useStyles();
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [page, setPage] = React.useState(0);
    //const [order, setOrder] = React.useState('asc');
    const [selected, setSelected] = React.useState([]);
    //const [orderBy, setOrderBy] = React.useState('');
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, documentList.length - page * rowsPerPage);
    const [dense, setDense] = React.useState(false);
    const isSelected = name => selected.indexOf(name) !== -1;
    const {onRequestSort} = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const [selectedDocuments, setSelectedDocuments] = React.useState([])

    useEffect(()=>{
        console.log(selectedItem)
    },[selectedItem])

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

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = documentList
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    });


    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };
    const handleClose2 = () => {
        setOpen2(false);
        // setTimeout(function () {
        //     window.location = window.location;
        // }, 100);
        // window.location.reload();//default refresh
    };

    const handleClose3 = () => {
        setOpen3(false);
        // setTimeout(function () {
        //     window.location = window.location;
        // }, 100);
        // window.location.reload();//default refresh
    };

    const handleClickOpen2 = (id) => {
        setOpen2(true);
        setSelectedId(id)
    };

    const deleteFile = (documentId) => {
        api.deleteFileById(documentId).then(res => {
            //window.location.reload()
        });
        handleClose2();
        setOpen3(false);
        setTimeout(function () {
            window.location = window.location;
        }, 100);
    };

    const classes = useStyles();

    function openPreview(document) {
        setOpen3(true)
        setSelectedItem(document)
    }

    function handleChange(document, checked){
        if (checked){
            // selected.push(document)
            // setSelected(selected)
            if(selected.indexOf(document) > -1)
                return
            setSelected(oldSelected => [...oldSelected, document]);
        }else{
            // selected.splice(selected.indexOf(document), 1)
            // setSelected(oldSelected => [...oldSelected, null])
            setSelected(selected.filter(item => item.id !== document.id));
        }
    }
    const {t} = useTranslation('task');

    useEffect(() => {
        console.log(selected.length)
    }, [selected])

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <Paper className="h-full">
                <EnhancedTableToolbar numSelected={selected.length} selectedDocuments = {selected}/>
                <TableContainer className={classes.container}>
                    <Table id="myTable"
                           className={classes.table}
                           aria-labelledby="tableTitle"
                           size={dense ? 'small' : 'medium'}
                           aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={documentList.length}
                        />
                        <TableBody>
                            {stableSort(documentList.filter(document => document.isActive != 0), getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((document, index) => {
                                    const isItemSelected = isSelected(document.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const dt = moment(document.createdDateTime).format("DD-MM-YYYY,h:mm:ss a");

                                    return (

                                        <TableRow id='myTable'
                                                  hover
                                                  // onClick={event => setSelectedItem(document)}
                                                  role="checkbox"
                                                  aria-checked={isItemSelected}
                                                  tabIndex={-1}
                                                  key={document.id}
                                                  selected={document?.id === selectedItem?.id}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selected.indexOf(document)>-1 ? true : false}
                                                    onChange = {(event, checked) => handleChange(document, checked)}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell align="left">{document.documentType}</TableCell>
                                            <TableCell
                                                align="left"
                                            >
                                                <a className="cursor-pointer"
                                                   onClick={event => openPreview(document)}>{document.documentName}</a>
                                            </TableCell>
                                            <TableCell align="right">{document.fileName}</TableCell>
                                            <TableCell align="right">{dt}</TableCell>
                                            <TableCell align="right">  <FuseAnimate animation="transition.expandIn" delay={200}>
                                                <IconButton onClick={() =>handleClickOpen2(document.id)}>
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </FuseAnimate></TableCell>
                                            <div>
                                                <Dialog  onClose={handleClose2}
                                                         open={open2}
                                                         // TransitionComponent={Transition}
                                                         aria-labelledby="alert-dialog-slide-title"
                                                         aria-describedby="alert-dialog-slide-description"
                                                >
                                                    <DialogTitle onClose={handleClose2}
                                                                 id="alert-dialog-slide-title">{t("DELETEFILE")}</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-slide-description">
                                                            {t("DELETESURE")}
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button  color="primary" onClick={() => deleteFile(selectedId)}>
                                                            {t("YES")}
                                                        </Button>
                                                        <Button onClick={handleClose2} color="primary">
                                                            {t("NO")}
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>

                                                <Dialog onClose={handleClose3}
                                                        open={open3}
                                                        // TransitionComponent={Transition}
                                                        aria-labelledby="alert-dialog-slide-title"
                                                        aria-describedby="alert-dialog-slide-description"
                                                >
                                                    <DialogTitle onClose={handleClose3}
                                                                 id="alert-dialog-slide-title">
                                                        <DetailSidebarHeader className="mt-3"
                                                                             selectedItem={selectedItem}
                                                                             client={selectedItem?.client}
                                                                             documentList={documentList} setDocumentList={setDocumentList}
                                                                                open3={open3} setOpen3={setOpen3}/>
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-slide-description">
                                                            <DetailSidebarContent selectedItem={selectedItem}  client={selectedItem?.client}/>
                                                        </DialogContentText>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableRow>
                                    );
                                })}

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={documentList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
            </Paper>
        </FuseAnimate>
    );
}

export default FileList;

//{files.map(item => {})}
