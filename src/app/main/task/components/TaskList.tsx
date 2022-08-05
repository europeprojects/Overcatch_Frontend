import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {any} from 'prop-types';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
	Checkbox, IconButton, TablePagination, TableSortLabel,
	Toolbar, Typography, MenuItem, Grid,
	Select, Input, ListItemText, Button, DialogTitle, DialogContent, TextField
} from '@material-ui/core';
import clsx from 'clsx';
import {func, number, object, oneOf, string} from 'prop-types';
import history from "../../../../@history/@history";
import TasksStatus from "../task/TaskStatus";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import moment from "moment";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight, Label, Title} from "@material-ui/icons";
import Formsy from "formsy-react";
import {Div} from "../../../components/Grid";
import Icon from "@material-ui/core/Icon";
import Dialog from "@material-ui/core/Dialog";

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

const useStyles1 = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexShrink: 0,
			marginLeft: theme.spacing(2.5),
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

function EnhancedTableHead(props) {

	const { classes, order, orderBy, onRequestSort, personel, selectedPersonel, setSelectedPersonel, setPersonelId} = props;
	const {t} = useTranslation('task');
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};
	const {aggrementTypes, setAggrementTypes} = props
	const {clientTypes, setClientTypes} = props
	const {selectedModuleTypes, setSelectedModuleTypes} = props
	const {startDate, setStartDate} = props
	const {endDate, setEndDate} = props
	const {orderStartDate, setOrderStartDate} = props
	const {orderEndDate, setOrderEndDate} = props
	const {selectedDepartments, setSelectedDepartments}=props

	const headCells = [
		{ id: 'moduleType', numeric: false, disablePadding: false, label: t("MODULETYPE"),sortable:false},
		{ id: 'clientType', numeric: false, disablePadding: false, label: t("CLIENTTYPE"),sortable:false},
		{ id: 'agreementType', numeric: false, disablePadding: false, label: t("AGREEMENTTYPE"),sortable:false},
		{ id: 'customerFullName', numeric: false, disablePadding: false, label: t("CLIENTFULLNAME"),sortable:true},
		{ id: 'userFullName', numeric: false, disablePadding: false, label: t("APPLYFULLNAME"),sortable:true},
		{ id: 'processDate', numeric: false, disablePadding: false, label: t("ORDERDATE"),sortable:false},
		{ id: 'confirmDate', numeric: false, disablePadding: false, label: t("CONFIRMORDERDATE"),sortable:false},
		{ id: 'duration', numeric: false, disablePadding: false, label: t("DURATION"),sortable:false},
		{ id: 'personelFullName', numeric: false, disablePadding: false, label: t("APPROVEDSTAFF"),sortable:false},
		{ id: 'department', numeric: false, disablePadding: false, label: t("DEPARTMENT"),sortable:false},
		{ id: 'confirmType', numeric: false, disablePadding: false, label: t("CONFIRMTYPE"),sortable:false},
	];
	const { moduleList, confirmTypeClick, setConfirmTypeClick} = props

	function handleChangeCheckbox(value: string, checked: boolean, type: string) {
		if (type == 'clientType'){
			if(checked && !clientTypes.includes(value))
				setClientTypes(oldArray => [...oldArray,value])
			else if(!checked && clientTypes.includes(value))
				setClientTypes(clientTypes.filter(item => item != value))
			return
		}
		else if (type == 'agreementType'){
			if(checked && !aggrementTypes.includes(value))
				setAggrementTypes(oldArray => [...oldArray, value])
			else if(!checked && aggrementTypes.includes(value))
				setAggrementTypes(aggrementTypes.filter(item => item != value))
			return
		}
		else if (type == 'confirmType'){
			if(checked && !confirmTypeClick.includes(value))
				setConfirmTypeClick(oldArray => [...oldArray, value])
			else if(!checked && confirmTypeClick.includes(value))
				setConfirmTypeClick(confirmTypeClick.filter(item => item != value))
			return
		}
		else if (type == 'moduleType'){
			if(checked && !selectedModuleTypes.includes(value))
				setSelectedModuleTypes(oldArray => [...oldArray, value])
			else if(!checked && selectedModuleTypes.includes(value))
				setSelectedModuleTypes(selectedModuleTypes.filter(item => item != value))
			return
		}else if(type == 'department'){
			if(checked && !selectedDepartments.includes(value)){
				setSelectedDepartments(oldArray => [...oldArray, value])
			}else if(!checked && selectedDepartments.includes(value)){
				setSelectedDepartments(selectedDepartments.filter(item => item != value ))
			}
		}
	}
	function handleChange(event){
		setSelectedPersonel(event.target.value);
	}
	useEffect(()=>{
		setPersonelId(selectedPersonel?.id);
	},[selectedPersonel])

	return (
		<TableHead>
			{headCells.map(headCell => headCell.id=="moduleType" || headCell.id=="confirmType"
				? <TableCell
					key={headCell.id}
					style={{ padding:'5px' , margin: '5px'}}
				>
					{ headCell.id == "moduleType" ? t("MODULETYPE") : t("CONFIRMTYPE")}
					<Formsy>
						<Div fullWidth>
							<Select
								labelId="demo-mutiple-checkbox-label"
								id="demo-mutiple-checkbox"
								multiple
								value={headCell.id == 'moduleType' ? selectedModuleTypes : confirmTypeClick}
								style={{maxWidth:"100px"}}
								renderValue={(selected) => (selected as string[]).join(',')}
								MenuProps={MenuProps}
							>
								{
									headCell.id == "moduleType" ?
									(<div>
											<MenuItem  value={null}>
												<ListItemText primary={t("MODULETYPE")} />
											</MenuItem>
											{moduleList?.map((module) => (
												<div>
													<MenuItem value= {module.moduleTypeEnum}>
														<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(module.moduleTypeEnum, checked, headCell.id)}} checked={selectedModuleTypes.indexOf(module.moduleTypeEnum) > -1}/>
														<ListItemText primary={t(module.moduleTypeEnum)}  />
													</MenuItem>
												</div>
											))}
										</div>
									) : null
								}
								{
									headCell.id == "confirmType" &&
									<div>
										<MenuItem value= {`CONFIRMTYPE`}>
											{t("CONFIRMTYPE") }
										</MenuItem>
										<MenuItem value= {`PENDING`}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox("PENDING", checked, headCell.id)}} checked={confirmTypeClick.indexOf("PENDING") > -1} />
											<ListItemText primary={t("PENDING")} />
										</MenuItem>
										<MenuItem value= { `INPROGRESS`}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox("INPROGRESS", checked, headCell.id)}} checked={ confirmTypeClick.indexOf("INPROGRESS") > -1} />
											<ListItemText primary={ t('INPROGRESS')} />
										</MenuItem>
										<MenuItem value= { `REJECTED`}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox( "REJECTED", checked, headCell.id)}} checked={ confirmTypeClick.indexOf("REJECTED") > -1} />
											<ListItemText primary={ t('REJECTED')} />
										</MenuItem>
										<MenuItem value= { `DONE`}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox( "DONE", checked, headCell.id)}} checked={ confirmTypeClick.indexOf("DONE") > -1} />
											<ListItemText primary={ t('DONE')} />
										</MenuItem>
									</div>
								}
							</Select>
						</Div>
					</Formsy>

				</TableCell>
				:	(
					headCell.id == "clientType" || headCell.id == "agreementType" ?
						<TableCell
							key={headCell.id}
							style={{ padding: "2px" ,textAlign: 'center',minWidth:"75px" }}
							sortDirection={orderBy === headCell.id ? order : false}
						>
							{ headCell.id == "clientType" ? t("CLIENTTYPE") : t("AGREEMENTTYPE")}
							<Select
								labelId="demo-mutiple-checkbox-label"
								id="demo-mutiple-checkbox"
								multiple
								value={headCell.id == 'clientType' ? clientTypes : aggrementTypes}
								style={{maxWidth:"100px"}}
								input={<Input />}
								renderValue={(selected) => (selected as string[]).join(',')}
								MenuProps={MenuProps}
							>
								<MenuItem  value={headCell.id == 'clientType' ? null : null}>
									<ListItemText primary={headCell.id == 'clientType' ? t("CLIENTTYPE") : t("AGREEMENTTYPE")} />
								</MenuItem>
								<MenuItem  value={ headCell.id == 'clientType' ? "SOLETRADE" : "OTHER"}>
									<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientType' ? "SOLETRADE" : "OTHER", checked, headCell.id)}} checked={headCell.id == 'clientType' ? clientTypes.indexOf("SOLETRADE" ) > -1 : aggrementTypes.indexOf("OTHER") > -1} />
									<ListItemText primary={headCell.id == 'clientType' ? "SOLETRADE" : "OTHER"} />
								</MenuItem>
								<MenuItem  value={headCell.id == 'clientType' ? "LIMITED" : "ECAA"}>
									<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientType' ? "LIMITED" : "ECAA", checked, headCell.id)}} checked={headCell.id == 'clientType' ? clientTypes.indexOf("LIMITED" ) > -1 : aggrementTypes.indexOf("ECAA") > -1} />
									<ListItemText primary={headCell.id == 'clientType' ? "LIMITED" : "ECAA"} />
								</MenuItem>
								<MenuItem  value={headCell.id == 'clientType' ? "SELFASSESMENT" : "TRADING"}>
									<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(headCell.id == 'clientType' ? "SELFASSESMENT" : "TRADING", checked, headCell.id)}} checked={headCell.id == 'clientType' ? clientTypes.indexOf("SELFASSESMENT" ) > -1 : aggrementTypes.indexOf("TRADING") > -1} />
									<ListItemText primary={headCell.id == 'clientType' ? "SELFASSESMENT" : "TRADING"} />
								</MenuItem>
							</Select>
						</TableCell>
						:
						headCell.id == "confirmDate" || headCell.id == "processDate" ?
							<TableCell
								key={headCell.id}
								style={{ padding:'5px' , margin: '5px'}}
								align={"center"}
							>
								{headCell.id == "confirmDate" ? t("CONFIRMORDERDATE") : t("ORDERDATE")}
								<TextField
									//style={{ padding:'5px' , margin: '5px'}}
									style={{ marginTop:'-3px'}}
									type="date"
									size={'small'}
									name="startDate"
									color="secondary"
									margin="normal"
									className={'ml-16  object-center'}
									id="date"
									label={t("STARTDATETIME")}
									InputLabelProps={{
										shrink: true
									}}
									inputProps={{
										max: '3000-01-01',
										min:'1000-01-01'
									}}
									InputProps={{
										disableUnderline: true,
									}}
									value={headCell.id == "confirmDate"?startDate:orderStartDate}
									onChange={(event) =>
										headCell.id == "confirmDate"
											?setStartDate(event.target.value)
											:setOrderStartDate(event.target.value)
									}
								/>
								<TextField
									//style={{ padding:'5px' , margin: '5px'}}
									style={{ marginTop:'-3px'}}
									type="date"
									id={"date"}
									size={'small'}
									color="secondary"
									margin="normal"
									className={'ml-16  object-center'}
									name="endDate"
									label={t("ENDDATETIME")}
									InputLabelProps={{
										shrink: true
									}}
									inputProps={{
										max: '3000-01-01',
										min:'1000-01-01'
									}}
									InputProps={{
										disableUnderline: true,
									}}
									value={headCell.id == "confirmDate"?endDate:orderEndDate}
									onChange={(event) =>
										headCell.id == "confirmDate"
											?setEndDate(event.target.value)
											:setOrderEndDate(event.target.value)
									}
								/>
							</TableCell>
							:
							 headCell.id == "department" ?
							 	<TableCell
									key={headCell.id}
									style={{ padding: "2px" ,textAlign: 'center',minWidth:"75px" }}
							 		sortDirection={orderBy === headCell.id ? order : false}>
							 		department
							 		<Select
							 			labelId="demo-mutiple-checkbox-label"
							 			id="demo-mutiple-checkbox"
							 			multiple
										value={selectedDepartments}
										style={{maxWidth:"100px"}}
										input={<Input />}
										renderValue={(selected) => (selected as string[]).join(',')}
										MenuProps={MenuProps}
							 		>
							 			<MenuItem  value={"Admin"}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(
												"Admin", checked, headCell.id)}}
													  checked={selectedDepartments.indexOf("Admin") > -1} />
											<ListItemText primary={'Admin'} />
							 			</MenuItem>
										<MenuItem  value={"Accounts"}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(
												"Accounts", checked, headCell.id)}}
													  checked={selectedDepartments.indexOf("Accounts") > -1} />
											<ListItemText primary={'Accounts'} />
										</MenuItem>
										<MenuItem  value={"VAT"}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(
												"VAT", checked, headCell.id)}}
													  checked={selectedDepartments.indexOf("VAT") > -1} />
											<ListItemText primary={'VAT'} />
										</MenuItem>
										<MenuItem  value={"Payroll"}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(
												"Payroll", checked, headCell.id)}}
													  checked={selectedDepartments.indexOf("Payroll") > -1} />
											<ListItemText primary={'Payroll'} />
										</MenuItem>
							 		</Select>
							 	</TableCell>:
								 headCell.id == "personelFullName"?
									 <TableCell>
										 {headCell.label}
										 <Select
											 style={{ marginLeft: '8px' }}
											 className="my-16"
											 variant="standard"
											  onChange={e => handleChange(e)}
										 >
											 {personel?.map((pers)=>(
												 <MenuItem value={pers}>
													 {pers.user.name + " " + pers.user.surname}
												 </MenuItem>
											 ))}
										 </Select>
									 </TableCell>:
							(
								<TableCell
									style={{ padding: "2px" ,textAlign: 'center' }}
									key={headCell.id}
									sortDirection={orderBy === headCell.id ? order : false}
								>
									{headCell.sortable ?
										(
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
							)
				)
			)}
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
	moduleTypeClick: any,
	setModuleTypeClick:any,
	confirmTypeClick:any,
	setConfirmTypeClick:any,
	clientTypes: any,
	setClientTypes: any,
	aggrementTypes: any,
	setAggrementTypes: any,
	moduleList: any,
	selectedModuleTypes: any,
	setSelectedModuleTypes: any,
	confirmDate:any,
	setConfirmDate:any,
	startDate:any,
	setStartDate:any,
	endDate:any,
	setEndDate:any,
	orderStartDate:any,
	setOrderStartDate:any,
	orderEndDate:any,
	setOrderEndDate:any,
	selectedDepartments:any,
	setSelectedDepartments:any,
	tasksList : any,
	personel :any,
	setPersonel : any,
	selectedPersonel : any,
	setSelectedPersonel : any,
	personelId:number,
	setPersonelId:number,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 80;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
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

const EnhancedTableToolbar = props => {
	const classes = useToolbarStyles();
	const { numSelected } = props;

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
					{window.atob(props.moduleType)}
				</Typography>
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: number.isRequired
};

const useStyles = makeStyles(theme => ({
	margin: {
		margin: theme.spacing(1),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
	button: {
		margin: theme.spacing(1),
	},

	root: {
		width: '105%'
	},
	container: {
		//maxHeight:550,
		maxWidth : '105%'
	},

	paper: {
		width: '105%',
		//marginBottom: theme.spacing(2)
	},
	table: {
		// minWidth: 750
		width:'100%'
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


export default function TaskList(props: any) {
	// @ts-ignore
	const routingData = history.location.displayRouteData;
	const classes = useStyles();
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const {page, setPage} = props
	const [dense, setDense] = React.useState(false);
	const {rowsPerPage, setRowsPerPage} = props
	const routeParams = useParams();
	const [openDetail, setOpenDetail] = React.useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const {confirmDate, setComfirmDate} = props
	const {confirmType, setComfirmType} = props
	const {module, setModule} = props
	const {aggrementTypes, setAggrementTypes} = props
	const {clientTypes, setClientTypes} = props
	const {startDate, setStartDate} = props
	const {endDate, setEndDate} = props
	const {orderStartDate, setOrderStartDate} = props
	const {orderEndDate, setOrderEndDate} = props
	const {personelId, setPersonelId} = props

	const[id,setId]= useState(null)

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	const {tasksList , setTasksList}=props;
	// @ts-ignore
	const { moduleType } = routeParams;
	function handledetails(task: any) {

		// @ts-ignore
		history.push({
			pathname: '/tasks/detail/'+window.btoa(task?.id),
			displayRouteData: {
				clientId: task?.clientId,
				clientType: task?.clientType,
				moduleType: task?.moduleTypeEnum,
				userFolder: task?.userFolder,
				taskId: task?.id,
				confirmType: task?.confirmType
			}
		});;
	}
	function setBgColor(status){
		if(status == "DONE")
			return "bg-green text-white hover:bg-green-700"
		else if(status == "INPROGRESS")
			return "bg-orange text-white hover:bg-orange-700"
		else if(status == "REJECTED")
			return "bg-red text-white hover:bg-red-700"
		else if (status == "DEFAULT")
			return "bg-blue text-white hover:bg-blue-700"
	}
	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = tasksList?.map(n => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	function handleCloseDetail() {
		setOpenDetail(false)
	}
	const handleOpen = () => {
		setOpenDetail(true);
	};

	const isSelected = name => selected.indexOf(name) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, tasksList?.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>

				{/* @ts-ignore*/}
				<EnhancedTableToolbar moduleType={moduleType} numSelected={selected.length} />
				<TableContainer className={classes.container}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={dense ? 'small' : 'medium'}
						aria-label="enhanced table"
						stickyHeader={true}
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={tasksList?.length}
							moduleTypeClick={module}
							setModuleTypeClick={setModule}
							confirmTypeClick={confirmType}
							setConfirmTypeClick={setComfirmType}
							clientTypes={clientTypes} setClientTypes={setClientTypes}
							aggrementTypes={aggrementTypes} setAggrementTypes={setAggrementTypes}
							moduleList={props.moduleList}
							selectedModuleTypes={props.selectedModuleTypes} setSelectedModuleTypes={props.setSelectedModuleTypes}
							confirmDate={confirmDate}
							setConfirmDate={setComfirmDate}
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							orderStartDate={orderStartDate}
							setOrderStartDate={setOrderStartDate}
							orderEndDate={orderEndDate}
							setOrderEndDate={setOrderEndDate}
							selectedDepartments={props.selectedDepartments}
							setSelectedDepartments={props.setSelectedDepartments}
							tasksList = {props.tasksList}
							personel = {props.personel}
							setPersonel={props.setPersonel}
							selectedPersonel={props.selectedPersonel}
							setSelectedPersonel={props.setSelectedPersonel}
							personelId={props.personelId} setPersonelId={props.setPersonelId}
						/>

						<TableBody>
							{stableSort(tasksList, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((task, index) => {
									const isItemSelected = isSelected(task.id);
									const processdt = moment(task?.processDate).format('DD-MM-YYYY,h:mm:ss a')
									const confirmdt = moment(task?.confirmDate).format('DD-MM-YYYY,h:mm:ss a')

									return (
										<TableRow
											hover
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={task.id}
											selected={isItemSelected}
										>
											<TableCell onClick={event => handledetails(task)} style={{ fontSize:'12px' , fontWeight: 'bold' , marginLeft:'5px'}} scope="row" >
												{task.moduleTypeEnum}
											</TableCell>
											<TableCell onClick={event => handledetails(task)}  style={{ fontSize:'12px' , padding: "2px" ,textAlign: 'center' }}  scope="row" >
												{task.clientType}
											</TableCell>
											<TableCell onClick={event => handledetails(task)} style={{ padding: "2px" }} >
												{task.agreementType}
											</TableCell>
											<TableCell onClick={event => handledetails(task)} style={{ padding: "2px" }}  align="left"  scope="row" >
												{task?.customerFullName || 'Not Approved'}
											</TableCell>
											<TableCell onClick={event => handledetails(task)} style={{ padding: "2px" }} >
												{task.userFullName}
											</TableCell>

											<TableCell onClick={event => handledetails(task)} style={{ padding: "20px" }} >
												{processdt}
											</TableCell>

											<TableCell onClick={event => handledetails(task)} style={{ fontSize:'12px' , padding: "2px" ,textAlign: 'center' }}  >
												{task?.confirmDate===null || confirmdt}
											</TableCell>
											<TableCell style={{ padding: "0px" }} >
												<Button
													variant="outlined"
													color="primary"
													onClick={event => {
														handleOpen()
														//setId(task.id)
														setSelectedTask(task)
													}}
													className={classes.button}
													endIcon={<AccessTimeIcon></AccessTimeIcon>}>
													{task.processTime}
												</Button>
											</TableCell>
											<TableCell onClick={event => handledetails(task)} style={{ padding: "2px" }} >
												{task?.personelFullName || 'Not Approved'}
											</TableCell>
											<TableCell style={{ padding: "0px" }} >
												{task?.department}
											</TableCell>
											<TableCell onClick={event => handledetails(task)} style={{ padding: "0px" }} >
												{task?.confirmType==='INPROGRESS' || task?.confirmType==='DONE' || task?.confirmType==='REJECTED' ?
													<TasksStatus id={task?.confirmType}></TasksStatus>
													:<TasksStatus id={"DEFAULT"}></TasksStatus>}
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={tasksList?.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={props.handleChangePage}
					onRowsPerPageChange={props.handleChangeRowsPerPage}
					ActionsComponent={TablePaginationActions}
				/>
				<Dialog
					maxWidth={false}
					fullWidth={false}
					open={openDetail}
					onClose={handleCloseDetail} aria-labelledby="customized-dialog-title" >
					<DialogTitle id="customized-dialog-title" >
						{"Task History"}

					</DialogTitle>
					<DialogContent style={{minWidth:"400px"}} dividers={false}>
						{selectedTask?.task?.taskConfirmations?.length > 0 ?
							selectedTask?.task.taskConfirmations.map((confirmations, index) => (
								<div className="my-8">
									<Div columns={2} className="my-8 flex justify-center">
										<Grid xs={6} md={12} lg={12} xl={12}>
											<div className="flex justify-start items-center">
                                                    <span className={ "p-6 " +
													(index>0?
														setBgColor(selectedTask.task.taskConfirmations[index-1]?.taskConfirm)
														+ " " +
														confirmations.processDate
														:
														setBgColor("DEFAULT"))}>
                                                        {
															index>0?
																selectedTask.task.taskConfirmations[index-1]?.taskConfirm
																+ " " +
																selectedTask.task.taskConfirmations[index-1]?.processDate
																:
																"PENDINGTRANSACTION"
														}
                                                    </span>
												<Icon>arrow_right</Icon>
												<span className={ "p-6 " + setBgColor(confirmations.taskConfirm)}><br/>{confirmations.taskConfirm}
													<br/>
													{confirmations.processDate}<br/>
													{confirmations.personel?.userInfo?.name}<br/>
													{confirmations.personel?.userInfo?.surname}
												</span>
											</div>
										</Grid>
										<Grid xs={6} md={12} lg={12} xl={12}>
											<div>
											</div>
										</Grid>
									</Div>
									{index != selectedTask?.task?.taskConfirmations?.length - 1 && <hr/>}
								</div>
							)) :
							<span className={ "p-6 " + setBgColor("DEFAULT")}>
							                                   	{"PENDINGTRANSACTION"}
								<br/>
							</span>
						}<br/>
						<Grid style={{borderTop:"solid",borderTopWidth:"thin"}} container>
							<Grid xs={6} sm={6}>
								<Table size="small" padding="none">
									<b>MANAGER NOTES</b><br/>
									{selectedTask?.task?.taskConfirmations?.filter(confirmation=>confirmation?.personel?.userInfo?.userType=="MANAGER").map((confirmation)=>(confirmation?.message))}
								</Table>
							</Grid>
							<Grid xs={6} sm={6}>
								<Table size="small" padding="checkbox">
									<b>EMPLOYEE NOTES</b><br/>
									{/*{selectedTask?.userRole == "CLIENT"? :""}*/}
									{selectedTask?.task?.taskConfirmations?.filter(confirmation=>confirmation?.personel?.userInfo?.userType=="EMPLOYEE"+"\n").map((confirmation)=>(confirmation?.message))}
								</Table>
							</Grid>
						</Grid>
					</DialogContent>
				</Dialog>
			</Paper>
		</div>
	);
}

function stableSort(array, comparator) {
	const stabilizedThis = array?.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}
