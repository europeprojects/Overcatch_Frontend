import React, {useEffect, useState} from 'react';
import {lighten, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {
	AppBar,
	Button, Checkbox,
	createStyles,
	Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon,
	IconButton, ListItemText, MenuItem, Select,
	Slide,
	TablePagination,
	TableSortLabel, TextField,
	Toolbar,
	Tooltip,
	Typography
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {any, func, number, object, oneOf, string} from 'prop-types';
import {useSelector} from 'react-redux';
import history from "../../../../@history/@history";
import {useParams} from "react-router-dom";
import api from "../../../services/BackendApi";
import {Letter, LetterType} from "../../../types/UserModel";
import FusePageCarded from "../../../../@fuse/core/FusePageCarded/FusePageCarded";
import CloseIcon from "@material-ui/icons/Close";
import ReactPDF, {Document, Image, Page, PDFViewer, renderToFile, StyleSheet, Text, View} from "@react-pdf/renderer";
import {TransitionProps} from "@material-ui/core/transitions";
import SearchBar from "material-ui-search-bar";
import LetterHeader from "../components/LetterHeader";


import {withSnackbar} from "notistack";

import ReactDOM from 'react-dom';
import {useTranslation} from "react-i18next";
import moment from "moment";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {Div} from "../../../components/Grid";
import config from "../../../services/Config";
import Input from '@material-ui/core/Input';
import FuseScrollbars from "../../../../@fuse/core/FuseScrollbars";


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

const styles = StyleSheet.create({
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	title: {
		fontSize: 12,
		textAlign: 'center',
		fontFamily: 'Oswald'
	},
	author: {
		fontSize: 12,
		textAlign: 'center',
		marginBottom: 40,
	},
	subtitle: {
		fontSize: 18,
		margin: 12,
		fontFamily: 'Oswald'
	},
	text1: {
		marginTop: 140,
		marginLeft: 60,
		fontSize: 12,
		textAlign: 'justify',
		fontFamily: 'Times-Roman',
		position: 'absolute',
		paddingHorizontal: 35,

	},
	text2: {
		marginLeft: 10,
		fontSize: 12,
		textAlign: 'justify',
		fontFamily: 'Times-Roman',
		position: 'relative',
		paddingHorizontal: 35,
		fontWeight: 'bold',
		color:'black',

	},
	text3: {
		fontSize: 12,
		textAlign: 'justify',
		fontFamily: 'Times-Roman',
		position: 'relative',
		paddingHorizontal: 35,
		fontWeight: 'bold',
		color:'black',

	},
	image: {
		position: 'relative',
	},
	view: {
		position: 'absolute',
		textAlign: 'justify',
		paddingTop: 90,

	},
	header: {
		fontSize: 14,
		marginTop: 100,
		marginLeft: 60,
		position: 'absolute',
		fontFamily: 'Times-Roman',
	},
	pageNumber: {
		position: 'absolute',
		fontSize: 12,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: 'center',
		color: 'grey',
	},
});



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 80;
const MenuProps = {
	PaperProps: {
		style: {
			minHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 350,
		},
	},
};



function getStyles(name, letterName, theme) {
	return {
		fontWeight:
			letterName.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}



function EnhancedTableHead(props) {
	const {t} = useTranslation('letter');
	const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
	const [letterType,setLetterType]=useState<LetterType[]>([])
	const createSortHandler = property => event => {
		// onRequestSort(event, property);
		setPage(0)
		// setRowsPerPage()
		setOrderColumn(property)
		setOrderBy1(orderBy1 == "asc" ? "desc" : "asc")
	};
	const {selectedLetterTypes, setSelectedLetterTypes}  = props
	const {total, orderColumn, setOrderColumn} = props
	const {orderBy1, setOrderBy1} = props
	const {setPage, setRowsPerPage} = props

	const headCells = [
		{id: 'cc.letter_type_name', numeric: false, disablePadding: false, label: t("LETTERTYPE"),sortable:true},
		// {id: 'createDate', numeric: false, disablePadding: false, label: "Create Date"},
		{id: 'insert_time', numeric: false, disablePadding: false, label: t("CREATEDATE"),sortable:true},
		{id: 'd.document_name', numeric: false, disablePadding: false, label: t("DOCUMENT"),sortable:true},
		{id: 't.name', numeric: false, disablePadding: false, label: t("FIRSTNAME") + " " + t("LASTNAME"),sortable:true},
		// {id: 'company_name', numeric: false, disablePadding: false, label: t("Company Name")},
		// {id: 'status', numeric: false, disablePadding: false, label: t("Status")},
		{id: 'actions', numeric: false, disablePadding: false, label: t("SHOWLETTER"),sortable:false},



	];

	useEffect(()=>{
		api.getAllLetterTypes().then(response => {
		setLetterType(response)
		});
	},[])
	const theme = useTheme();
	const [letterName, setLetterName] = React.useState([]);

	const handleChange = (event) => {
		setLetterName(event.target.value);
	};

	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		setLetterName(value);
	};
useEffect(()=>{
	setLetterType([]);
	setLetterName([]);
	//letterType?.map((result)=>(
		//letterName.indexOf(result.id)=false
	//))

},[props.handleClear])

	function handleChangeCheckbox(value: string, checked: boolean, type: string) {
		if (type == 'cc.letter_type_name'){
			if(checked && !selectedLetterTypes.includes(value))
				setSelectedLetterTypes(oldArray => [...oldArray,value])
			else if(!checked && selectedLetterTypes.includes(value))
				setSelectedLetterTypes(selectedLetterTypes.filter(item => item != value))
			return
		}
	}

	// @ts-ignore
	// @ts-ignore
	return (
		<TableHead>
			<TableRow>

				{headCells.map(headCell => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderColumn === headCell.id ? orderBy1 : false}
					>
					{headCell?.id=='cc.letter_type_name' ?
						(
							<>
							{headCell?.label}
							<Select
								labelId="demo-mutiple-checkbox-label"
								id="demo-mutiple-checkbox"
								value={letterName}
								onChange={handleChange}
								input={<Input />}
								renderValue={(selected) => (selected as string[]).join(', ')}
								MenuProps={MenuProps}
							>
								{letterType?.map((result) => (
									<MenuItem key={result.id} >
										<Checkbox
											checked={selectedLetterTypes?.indexOf(result?.id?.toString()) > -1}
											onChange={(e,
													   checked) => {handleChangeCheckbox(result.id?.toString(), checked, headCell.id)}}/>
										<ListItemText primary={result?.letterTypeName} />
									</MenuItem>
								))}
							</Select>
							</>
						)
						:
						headCell.sortable ?
							<TableSortLabel
								active={orderColumn === headCell.id}
								direction={orderColumn === headCell.id ? orderBy1 : 'asc'}
								onClick={headCell.id != "actions" && createSortHandler(headCell.id)}
							>
								{headCell?.label}
								{headCell?.id=='cc.letter_type_name'?
									<Select
										labelId="demo-mutiple-checkbox-label"
										id="demo-mutiple-checkbox"
										value={letterName}
										onChange={handleChange}
										input={<Input />}
										renderValue={(selected) => (selected as string[]).join(', ')}
										MenuProps={MenuProps}
									>
										{letterType?.map((result) => (
											<MenuItem key={result.id} >
												<Checkbox
													checked={selectedLetterTypes?.indexOf(result?.id?.toString()) > -1}
													onChange={(e,
															   checked) => {handleChangeCheckbox(result.id?.toString(), checked, headCell.id)}}/>
												<ListItemText primary={result?.letterTypeName} />
											</MenuItem>
										))}
									</Select>
									:null}
							</TableSortLabel> :headCell.label
					}

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
	rowCount: number.isRequired,
	selectedLetterTypes: any,
	setSelectedLetterTypes: any,
	orderColumn:any,
	setOrderColumn:any,
	orderBy1:any,
	setOrderBy1:any,
	setPage: any,
	setRowsPerPage: any
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
					{/*{window.atob(props.moduleType)}*/}
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
		// height: "100%"
	},
	table: {
		minWidth: 750,
		// height: "100%"
	},
	container: {
		maxHeight: 600,
		// height: "100%"
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

const useStyles2 = makeStyles((theme: Theme) =>
	createStyles({
		appBar: {
			position: 'relative',
		},
		title: {
			marginLeft: theme.spacing(2),
			flex: 1,
		},
	}),
);

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

function CustomSentLettersList(props) {

	// @ts-ignore
	const routingData = history.location.displayRouteData;
	const classes = useStyles();
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const {page, setPage} = props
	const [dense, setDense] = React.useState(false);
	const [selectedLetterContent, setSelectedLetterContent] = useState([]);
	const [selectedLetter, setSelectedLetter] = useState(null);
	const {rowsPerPage, setRowsPerPage} = props
	const [open, setOpen] = useState(false);
	const {selectedLetterTypes, setSelectedLetterTypes}  = props
	const {total, orderColumn, setOrderColumn} = props
	const {orderBy1, setOrderBy1} = props

	const routeParams = useParams();
	//const [documents, setDocuments] = React.useState<DocumentInfo[]>(props .documents);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	const [letterList, setLetterList] = useState([]);
	// @ts-ignore
	const {moduleType} = routeParams;
	const clientId = useSelector(({company}) => company.currentCompanyId);
	//@ts-ignore
	const test = useSelector(({auth}) => auth.user.data.usersClient);
	const [open1, setOpen1] = React.useState(false);
	const classes2 = useStyles2();
	const [shown, setShown] = useState(false);
	const {t} = useTranslation('letter');
	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = letterList.map(n => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleClose2 = () => {
		setOpen1(false);
	};


	const Transition = React.forwardRef(function Transition(
		props: TransitionProps & { children?: React.ReactElement },
		ref: React.Ref<unknown>,
	) {
		return <Slide direction="up" ref={ref} {...props} />;
	});

	const [rows,setRows] = useState(props.data);

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleClickOpen = (letter) => {
		setSelectedLetterContent(JSON.parse(decodeURIComponent(escape(window.atob(letter?.letter)))));
		setSelectedLetter(letter)
		setOpen1(true);
	};

	const modalBody = () => (
		<Dialog fullScreen open={open1} onClose={handleClose2}
						TransitionComponent={Transition}>
			<AppBar className={classes2.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit"
											onClick={handleClose2} aria-label="close">
						<CloseIcon/>
					</IconButton>
					<Typography variant="h6" className={classes2.title}>
						{t("PREVIEWLETTER")}
					</Typography>
				</Toolbar>
			</AppBar>
			<PDFViewer className={"flex w-full h-full"}>

				<Document>
					<Page object-fit="fill" style={styles.pageNumber} size="A4">
						{( selectedLetter?.userRole == "MANAGER" || selectedLetter?.userRole == "EMPLOYEE" || (selectedLetter?.task?.taskConfirmations && selectedLetter?.task.taskConfirmations[0]?.taskConfirm == "DONE")) &&
						<Image fixed src="/assets/images/pdf/image1.png"/>
						}
						<View object-fit style={styles.view}>
							{/*@ts-ignore*/}
							{selectedLetterContent?.map((ch) => <Text style={styles.text2}>{

									//@ts-ignore
									ch.children.map((cc) => (
										<Text
											style={styles.text3}> {
											cc.text
										}
											{/*            <span style={{whiteSpace: "pre-line"}}>*/}
											{/*{cc.split("").join("\n")}*/}
											{/*</span>*/}
										</Text>

									))
								}
								</Text>
							)}

						</View>
					</Page>
				</Document>
			</PDFViewer>
		</Dialog>
	);


	const handleChangeDense = event => {
		setDense(event.target.checked);
	};
	const isSelected = name => selected.indexOf(name) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	//const [searched, setSearched] = useState<string>("");



	const requestSearch = (searchedVal: string) => {
		const filteredRows = props.data.filter((row) => {
			const nameSurname = row.client.customerClients[0].customerInfo.user.name +
				" " + row.client.customerClients[0].customerInfo.user.surname;
			// const companyName = row.client?.company?.name || row.client?.founderOwner?.name;
			// 	return nameSurname.toLowerCase().includes(searchedVal.toLowerCase()) || companyName.toLowerCase().includes(searchedVal.toLowerCase());
			return nameSurname.toLowerCase().includes(searchedVal.toLowerCase());
		});
		console.log("filtered", filteredRows)
		setRows(filteredRows);
	};

	const cancelSearch = () => {
		props.setSearch("");
		requestSearch(props.search);
	};
	console.log("rows",rows);


	useEffect(()=>{
		setRows(props.data)
	},[props.data])

	useEffect(()=>{

		 requestSearch(props.search);

	},[props.search])

	useEffect(()=>{
		setPage(0);

	},[props.selectedLetterTypes])

	// function setBgColor(status){
	// 	if(status == "DONE")
	// 		return "bg-green text-white hover:bg-green-700"
	// 	else if(status == "INPROGRESS")
	// 		return "bg-orange text-white hover:bg-orange-700"
	// 	else if(status == "REJECTED")
	// 		return "bg-red text-white hover:bg-red-700"
	// 	else if (status == "DEFAULT")
	// 		return "bg-blue text-white hover:bg-blue-700"
	// }

	// function handleClick2(letter) {
	// 	setSelectedLetter(letter)
	// 	setOpen(true)
	// }
	// function handleClose() {
	// 	setOpen(false)
	// }

	const getDocumentUrlByFileName = (client, document) => {
		var clientId = client?.id
		var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + clientId + "/" + document?.fileName
		return url
	}

	return (
		<div className={"w-full flex flex-col"}>
			<FuseScrollbars className="flex-grow overflow-x-auto">

				{/* @ts-ignore*/}
				{/*<EnhancedTableToolbar moduleType={moduleType} numSelected={selected.length} />*/}
				<TableContainer className={classes.container}>
					<Table
						stickyHeader={true}
						className="min-w-xl"
						aria-labelledby="tableTitle"
						// size={dense ? 'small' : 'medium'}
						// aria-label="enhanced table"

					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={letterList.length}
							selectedLetterTypes={selectedLetterTypes}
							setSelectedLetterTypes={setSelectedLetterTypes}
							orderColumn={orderColumn} setOrderColumn={setOrderColumn}
							orderBy1={orderBy1} setOrderBy1={setOrderBy1}
							setPage={setPage} setRowsPerPage={setRowsPerPage}
						/>
						<TableBody>
							{stableSort(rows, getComparator(order, orderBy))
								// .slice(0 * rowsPerPage, 1 * rowsPerPage + rowsPerPage)
								.map((letter, index) => {
									const isItemSelected = isSelected(letter.id);
									const labelId = `enhanced-table-checkbox-${index}`;
									const dt = moment(letter.createdDateTime).format('DD-MM-YYYY,h:mm:ss a');

									return (
										<TableRow
											hover
											// onClick={event => handleClick(event, task.id)}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={letter.id}
											selected={isItemSelected}
											// onClick={event => handledetails(letter)}
										>

											<TableCell scope="row" padding="default">
												{letter.letterType?.letterTypeName || "Custom Letter"}
											</TableCell>

											<TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">
													{letter.task?.taskConfirmations?.length > 0 ?
															letter.task?.taskConfirmations?.sort(function (a,b) {
																if(a.processDate < b.processDate)
																	return 1
																return -1
															})[0].processDate : (dt ? dt : "-")}
											</TableCell>
											<TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">
												{letter.document ?
													<a href={getDocumentUrlByFileName(letter.client, letter.document)}>{letter.document?.documentName}</a>
													:
													"-"
												}
											</TableCell>
											<TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">
												{letter.client.customerClients[0].customerInfo.user.name + " " +
												letter.client.customerClients[0].customerInfo.user.surname}
											</TableCell>
											{/*<TableCell style={{paddingLeft: "10px"}} scope="row" padding="none">*/}

											{/*	{letter.client.company?.name}*/}
											{/*</TableCell>*/}
											{/*<TableCell style={{paddingLeft: "10px"}} padding="none">*/}
											{/*	<Button*/}
											{/*		onClick={()=> handleClick2(letter)}*/}
											{/*		className={ letter?.userRole == "MANAGER" ? setBgColor("DONE") : (letter.task?.taskConfirmations?.length > 0 ?*/}
											{/*			setBgColor(letter?.task?.taskConfirmations?.sort(function (a,b) {*/}
											{/*				if(a.processDate < b.processDate)*/}
											{/*					return 1*/}
											{/*				return -1*/}
											{/*			})[0].taskConfirm) : setBgColor("DEFAULT")) }*/}
											{/*	>*/}

											{/*		{ letter?.userRole == "MANAGER" ? t("DONE") : (letter.task?.taskConfirmations?.length > 0 ?*/}
											{/*			t(letter.task?.taskConfirmations?.sort()[0].taskConfirm) : t("PENDINGTRANSACTION"))}*/}
											{/*	</Button>*/}
											{/*</TableCell>*/}
											<TableCell style={{paddingLeft: "10px"}} padding="none">
												<Button variant="contained" color="primary"
																onClick={()=>handleClickOpen(letter)}>{t("SHOWLETTER")}</Button>
											</TableCell>


										</TableRow>
									);
								})}
							{/*{emptyRows > 0 && (*/}
							{/*	<TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>*/}
							{/*		<TableCell colSpan={6}/>*/}
							{/*	</TableRow>*/}
							{/*)}*/}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					className="flex-shrink-0 border-t-1"
					rowsPerPageOptions={[5, 10, 25, 50, 100]}
					component="div"
					count={total}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					ActionsComponent={TablePaginationActions}
				/>
				{/*<Dialog*/}
				{/*	fullWidth={true}*/}
				{/*	maxWidth={"xs"}*/}
				{/*	open={open}*/}
				{/*	onClose={handleClose} aria-labelledby="customized-dialog-title" >*/}
				{/*	<DialogTitle id="customized-dialog-title" >*/}
				{/*		{t("PROCESSMESSAGE")}*/}
				{/*	</DialogTitle>*/}
				{/*	<DialogContent dividers>*/}

				{/*		{ selectedLetter?.userRole == "MANAGER" ?*/}
				{/*			<span className={ "p-6 " +*/}
				{/*			(setBgColor("DONE") )}>*/}
				{/*				{t("DONE")}*/}
				{/*			</span> :*/}

				{/*			selectedLetter?.task?.taskConfirmations?.length > 0 ?*/}
				{/*		selectedLetter?.task?.taskConfirmations?.map((confirmations, index) => (*/}
				{/*			<div className="my-8">*/}
				{/*				<p>*/}
				{/*					{confirmations.message ?*/}
				{/*						confirmations.message : t("NOMESSAGE")*/}
				{/*					}*/}
				{/*				</p>*/}
				{/*				{confirmations.personel &&*/}
				{/*				<Div columns={2} className="my-8 flex justify-center">*/}

				{/*					<Grid xs={6} md={12} lg={12} xl={12}>*/}
				{/*						<div className="flex justify-start items-center">*/}
                {/*                                    <span className={ "p-6 " +*/}
				{/*									(selectedLetter?.task?.taskConfirmations?.[index + 1] ?*/}
				{/*										setBgColor(selectedLetter?.task?.taskConfirmations?.[index + 1]?.taskConfirm) :*/}
				{/*										setBgColor("DEFAULT") )}>*/}
                {/*                                        {*/}
				{/*											selectedLetter?.task?.taskConfirmations?.[index + 1] ?*/}
				{/*												t(selectedLetter?.task?.taskConfirmations?.[index + 1]?.taskConfirm)*/}
				{/*												:*/}
				{/*												t("PENDINGTRANSACTION")*/}
				{/*										}*/}
                {/*                                    </span>*/}
				{/*							<Icon>arrow_right</Icon>*/}
				{/*							<span className={ "p-6 " + setBgColor(confirmations.taskConfirm)}>{t(confirmations.taskConfirm)}</span>*/}
				{/*						</div>*/}
				{/*					</Grid>*/}
				{/*					<Grid xs={6} md={12} lg={12} xl={12}>*/}
				{/*						<div>*/}
				{/*							<div className="my-8 flex justify-end">*/}
				{/*								{*/}
				{/*									confirmations.personel.user.name*/}
				{/*									+ " " +*/}
				{/*									confirmations.personel.user.surname*/}
				{/*								}*/}
				{/*							</div>*/}
				{/*							<div className="my-8 flex justify-end">*/}
				{/*								{*/}
				{/*									confirmations.processDate*/}
				{/*								}*/}
				{/*							</div>*/}
				{/*						</div>*/}
				{/*					</Grid>*/}
				{/*				</Div>*/}
				{/*				}*/}
				{/*				{index != selectedLetter?.task?.taskConfirmations?.length - 1 && <hr/>}*/}
				{/*			</div>*/}

				{/*		)) :*/}
				{/*			<span className={ "p-6 " + setBgColor("DEFAULT")}>*/}
				{/*				{t("PENDINGTRANSACTION")}*/}
				{/*			</span>*/}
				{/*		}*/}
				{/*	</DialogContent>*/}
				{/*	<DialogActions>*/}
				{/*		<Button variant="contained" color="primary"*/}
				{/*				onClick={()=>handleClickOpen(selectedLetter)}>*/}
				{/*			{t("SHOWLETTER")}*/}
				{/*		</Button>*/}
				{/*	</DialogActions>*/}
				{/*</Dialog>*/}
			</FuseScrollbars>

			{open1 && ReactDOM.createPortal(modalBody(), document.body)}

		</div>
	);
}

export default withSnackbar(CustomSentLettersList);

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}
