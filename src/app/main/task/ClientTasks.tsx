import React, {useEffect, useState} from 'react';
import {createStyles, lighten, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Checkbox, IconButton, TablePagination, TableSortLabel, Toolbar, Tooltip,
Typography,Select,MenuItem,Input,ListItemText
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {any, func, number, object, oneOf, string} from 'prop-types';
import {useSelector} from 'react-redux';
import history from "../../../@history/@history";

import {useParams} from "react-router-dom";
import api from "../../services/BackendApi";
import TasksStatus from "./task/TaskStatus";
import FusePageCarded from "../../../@fuse/core/FusePageCarded/FusePageCarded";
import {useTranslation} from "react-i18next";
import moment from "moment";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

function rowComparator(a,b) {
	if (b < a) {
		return -1;
	}
	else if (b > a) {
		return 1;
	}
	return 0;
}
function descendingComparator(a, b, orderBy) {
	if(orderBy==="invoiceDate")
	{
		let da= new Date(a[orderBy]).getTime();
		let db= new Date(b[orderBy]).getTime();
		console.log()
		return rowComparator(da,db)
	}
	else {

		return rowComparator(a[orderBy],b[orderBy])
	}

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
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort,setConfirmTypeSelected,confirmTypeSelected,moduleList,setModuleList,selectedModuleTypes,setSelectedModuleTypes} = props;
	const {t} = useTranslation('task');
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	

	const headCells = [
		// { id: 'id', numeric: false, disablePadding: true, label: t("TASKID")},
		{ id: 'moduleTypeEnum', numeric: false, disablePadding: false, label: t("MODULETYPE"),sortable:true},
		{ id: 'processDate', numeric: false, disablePadding: false, label: t("ORDERDATE"),sortable:true},
		{ id: 'customerFullName', numeric: false, disablePadding: false, label: t("CUSTOMERFULLNAME"),sortable:false},
		{ id: 'userFullName', numeric: false, disablePadding: false, label: t("APPLYFULLNAME"),sortable:false},
		{ id: 'clientType', numeric: false, disablePadding: false, label: t("CLIENTTYPE"),sortable:false},
		{ id: 'agreementType', numeric: false, disablePadding: false, label: t("AGREEMENTTYPE"),sortable:false},
		{ id: 'confirmDate', numeric: false, disablePadding: false, label: t("CONFIRMORDERDATE"),sortable:true},
		{ id: 'personelFullName', numeric: false, disablePadding: false, label: t("APPROVEDSTAFF"),sortable:false},
		{ id: 'confirmType', numeric: false, disablePadding: false, label: t("CONFIRMTYPE"),sortable:true}

	];


	function handleChangeCheckbox(value: string, checked: boolean,type:String) {

		if(type==="confirmType")
		{
			//task?.confirmType==='INPROGRESS' || task?.confirmType==='DONE' || task?.confirmType==='RED'
			if(checked && !confirmTypeSelected.includes(value))
			{
				setConfirmTypeSelected(confirmTypeSelected=>[...confirmTypeSelected,value]);
				console.log(confirmTypeSelected)
			}
			else if(!checked && confirmTypeSelected.includes(value))
				setConfirmTypeSelected(confirmTypeSelected.filter(item => item != value))

		}
		else
		{
			if(checked && !selectedModuleTypes.includes(value))
			{
				console.log(value)
				setSelectedModuleTypes(selectedModuleTypes=>[...selectedModuleTypes,value]);
				console.log(selectedModuleTypes)
			}
			else if(!checked && selectedModuleTypes.includes(value))
				setSelectedModuleTypes(selectedModuleTypes.filter(item => item != value))
		}

	}



	return (
		<TableHead>
			<TableRow>
				{/*<TableCell padding="checkbox">*/}
				{/*	<Checkbox*/}
				{/*		indeterminate={numSelected > 0 && numSelected < rowCount}*/}
				{/*		checked={rowCount > 0 && numSelected === rowCount}*/}
				{/*		onChange={onSelectAllClick}*/}
				{/*		inputProps={{ 'aria-label': 'select all desserts' }}*/}
				{/*	/>*/}
				{/*</TableCell>*/}

				{headCells.map(headCell => (
					headCell.id =="confirmType" || headCell.id =='moduleTypeEnum'?
					<TableCell>
						{headCell.id =="confirmType" ?
							(
								<>
								<span style={{marginRight:"20px"}}>{headCell.label}</span>
							<Select
								multiple
								labelId="demo-mutiple-checkbox-label"
								id="demo-mutiple-checkbox"
								value={confirmTypeSelected}
								label="myletter"
								style={{maxWidth:"80px"}}
								input={<Input />}
								renderValue={(selected) => (selected as string[]).join(',')}
								MenuProps={{
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "left"
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left"
									},
									getContentAnchorEl: null
								}}
							>
								<MenuItem value={'INPROGRESS'}>
									<Checkbox onChange={(e,checked) => {handleChangeCheckbox("INPROGRESS", checked,headCell.id)}}  checked = {confirmTypeSelected.indexOf("INPROGRESS") > -1 }/>
									<ListItemText primary={"INPROGRESS"} />
								</MenuItem>
								<MenuItem value={'DONE'}>
									<Checkbox onChange={(e,checked) => {handleChangeCheckbox("DONE", checked,headCell.id)}}  checked = {confirmTypeSelected.indexOf("DONE") > -1 }/>
									<ListItemText primary={"DONE"} />
								</MenuItem>
								<MenuItem value={'RED'}>
									<Checkbox onChange={(e,checked) => {handleChangeCheckbox("RED", checked,headCell.id)}}  checked = {confirmTypeSelected.indexOf("RED") > -1 }/>
									<ListItemText primary={"RED"} />
								</MenuItem>
							</Select>
								</>
							):
							<div>
								<span style={{marginRight:"20px"}}>{headCell.label}</span>
								<Select
								multiple
								labelId="demo-mutiple-checkbox-label2"
								id="demo-mutiple-checkbox2"
								value={selectedModuleTypes}
								label="myletter2"
								style={{maxWidth:"80px"}}
								input={<Input />}
								renderValue={(selected) => (selected as string[]).join(',')}
								MenuProps={{
								anchorOrigin: {
									vertical: "bottom",
									horizontal: "left"
								},
								transformOrigin: {
									vertical: "top",
									horizontal: "left"
								},
								getContentAnchorEl: null
							}}
								>
								<MenuItem  value={null}>
									<ListItemText primary={t("MODULETYPE")} />
								</MenuItem>
								{moduleList?.map((module) => (
									<div>
										<MenuItem value= {module}>
											<Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(module, checked, headCell.id)}} checked={selectedModuleTypes.indexOf(module) > -1}/>
											<ListItemText primary={t(module)}  />
										</MenuItem>
									</div>
								))}
								</Select>
							</div>
						}


				  </TableCell>
					:
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
	rowCount: number.isRequired,
	confirmTypeSelected:any,
	setConfirmTypeSelected:any,
	moduleList:[],
	setModuleList : any,
	setSelectedModuleTypes:any,
	selectedModuleTypes:any,
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
					{/*{window.atob(props.moduleType)}*/}
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete">
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
	numSelected: number.isRequired
};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	container:{
		width: '100%',
		maxHeight: 480
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


export default function TaskList(props: any) {

	// @ts-ignore
	const routingData = history.location.displayRouteData;
	const classes = useStyles();
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(25);
	const routeParams = useParams();
	const [moduleList,setModuleList] = useState([])
	const [confirmTypeSelected, setConfirmTypeSelected] = React.useState([]);
    const [filteredClientTaskList,setFilteredClientTaskList] = useState([])
	const [selectedModuleTypes,setSelectedModuleTypes]=useState([]);
	//const [documents, setDocuments] = React.useState<DocumentInfo[]>(props.documents);
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	const [tasks,setTasks]=useState([]);
	// @ts-ignore
	const { moduleType } = routeParams;
	const clientId = useSelector(({company}) => company.currentCompanyId);


	// const list=props;
	// 	useEffect(() => {
	// 	console.log('Props olan');
	// 	console.log(props);
	// 	setTasks(props);
	//
	// }, []);

	// @ts-ignore
	useEffect(() => {
		console.log(clientId)

		//@ts-ignore
		api.getTaskListByClientID(clientId).then(response => {

			const distinctItem = [... new Set(response.map(item => item.moduleTypeEnum))]
			setModuleList(distinctItem);
			setTasks(response);
			setFilteredClientTaskList(response);
			//getAllModuleType(response)

		});

	}, []);


	useEffect(()=>{
		//console.log(tasks)
		//getAllModuleType()
	})
	useEffect(()=>{
		if(tasks!==null && tasks!== undefined)
		{
			filterByTypes(confirmTypeSelected,selectedModuleTypes);
		}
	
		
	},[confirmTypeSelected,selectedModuleTypes])

	function filterByTypes(confirmTypeSelected:any,selectedModuleTypes:any) {
		setFilteredClientTaskList([])
		if(confirmTypeSelected.length>0 && selectedModuleTypes.length>0)
		{
			filterForAll(selectedModuleTypes,confirmTypeSelected)
		}
		else if(confirmTypeSelected.length>0)
		{
			filterForConfirmType(confirmTypeSelected)
		}
		else if(selectedModuleTypes.length>0)
		{
			filterForModuleTypes(selectedModuleTypes)
		}
		else
		{
			setFilteredClientTaskList(tasks)
		}
	}

	function filterForConfirmType(confirmTypeSelected:any) {

		confirmTypeSelected.map((confirmType)=>{

			//console.log(confirmType)
			if(confirmTypeSelected.indexOf(confirmType)>-1)
			{
				const temp = tasks.filter((task)=>task?.confirmType===confirmType)
				setFilteredClientTaskList(filteredClientTaskList=>[...filteredClientTaskList,...temp])
			}
		})

	}

	function filterForAll(selectedModuleTypes:any,confirmTypeSelected:any) {

		selectedModuleTypes.map((moduleType)=>{
			confirmTypeSelected.map((confirmType)=>{
				if(confirmTypeSelected.indexOf(confirmType)>-1)
				{
					const temp = tasks.filter((task)=>task?.confirmType===confirmType && (selectedModuleTypes.indexOf(moduleType)>-1? task.moduleTypeEnum===moduleType:false))
					setFilteredClientTaskList(filteredClientTaskList=>[...filteredClientTaskList,...temp])
				}
			})
		})
	}

	function filterForModuleTypes(selectedModuleTypes:any) {
		/*confirmTypeSelected.map((confirmType)=>{
			setFilteredClientTaskList([])
			console.log(confirmType)
			if(confirmTypeSelected.indexOf(confirmType)>-1)
			{
				const temp = tasks.filter((task)=>task?.confirmType===confirmType)
				setFilteredClientTaskList(filteredClientTaskList=>[...filteredClientTaskList,...temp])
			}
		})*/
		selectedModuleTypes.map((moduleType)=>{
			console.log(moduleType+"2")
			if(selectedModuleTypes.indexOf(moduleType)>-1)
			{
				const temp = tasks.filter((task)=>task.moduleTypeEnum===moduleType)
				setFilteredClientTaskList(filteredClientTaskList=>[...filteredClientTaskList,...temp])
			}
		})

	}

	function handledetails(task: any) {

		// @ts-ignore
		// history.push({
		// 	pathname: '/tasks/detail/'+window.btoa(task?.id),
		// 	displayRouteData: {
		// 		clientId: task?.clientId,
		// 		clientType: task?.clientType,
		// 		moduleType: task?.moduleTypeEnum,
		// 		userFolder: task?.userFolder,
		// 		taskId: task?.id,
		// 		confirmType: task?.confirmType
		// 	}
		// });
		// // @ts-ignore
		// history.push({
		// 	pathname: '/tasks/detail/'+window.btoa(task?.clientId),
		// 	displayRouteData: {
		// 		taskId: task?.id
		// 	}
		// });
	}
	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = tasks.map(n => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

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
	const isSelected = name => selected.indexOf(name) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, tasks.length - page * rowsPerPage);

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			// header={<DocumentHeader />}
			content={

				<div className={classes.root}>
					<Paper className={classes.paper}>

						{/* @ts-ignore*/}
						{/*<EnhancedTableToolbar moduleType={moduleType} numSelected={selected.length} />*/}
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
									rowCount={tasks.length}
									confirmTypeSelected={confirmTypeSelected}
									setConfirmTypeSelected={setConfirmTypeSelected}
									moduleList = {moduleList}
									setModuleList = {setModuleList}
									selectedModuleTypes={selectedModuleTypes}
									setSelectedModuleTypes={setSelectedModuleTypes}

								/>
								<TableBody>
									{stableSort(filteredClientTaskList, getComparator(order, orderBy))
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((task, index) => {
											const isItemSelected = isSelected(task.id);
											const labelId = `enhanced-table-checkbox-${index}`;
											const cfdate = moment(task?.confirmDate).format('DD-MM-YYYY,h:mm:ss a')
											const prdate = moment(task.processDate).format('DD-MM-YYYY,h:mm:ss a')


											return (
												<TableRow
													hover
													// onClick={event => handleClick(event, task.id)}
													role="checkbox"
													aria-checked={isItemSelected}
													tabIndex={-1}
													key={task.id}
													selected={isItemSelected}
													onClick={event => handledetails(task)}
												>
													{/*<TableCell padding="checkbox">*/}
													{/*	<Checkbox*/}
													{/*		checked={isItemSelected}*/}
													{/*		inputProps={{ 'aria-labelledby': labelId }}*/}
													{/*	/>*/}
													{/*</TableCell>*/}
													{/*<TableCell component="th" scope="row" padding="default">*/}
													{/*	{task.id}*/}
													{/*</TableCell>*/}
													<TableCell  scope="row" padding="none">
														{task.moduleTypeEnum}
													</TableCell>

													<TableCell  style={{ paddingLeft: "10px" }}  scope="row" padding="none">
														{prdate}
													</TableCell>
													<TableCell style={{ paddingLeft: "10px" }} padding="none">
														{task?.customerFullName || 'Not Approved'}
													</TableCell>
													<TableCell style={{ paddingLeft: "10px" }}  align="left"  scope="row" padding="none">
														{task.userFullName}
													</TableCell>
													<TableCell style={{ paddingLeft: "10px" }} padding="none">
														{task.clientType}
													</TableCell>
													<TableCell style={{ paddingLeft: "10px" }} padding="none">
														{task.agreementType}
													</TableCell>
													<TableCell style={{ paddingLeft: "10px" }} padding="none">
														{cfdate || 'Not Approved'}
													</TableCell>
													<TableCell style={{ paddingLeft: "10px" }} padding="none">
														{task?.personelFullName || 'Not Approved'}
													</TableCell>
													<TableCell style={{ paddingLeft: "10px" }} padding="none">
														{task?.confirmType==='INPROGRESS' || task?.confirmType==='DONE' || task?.confirmType==='RED' ?
															<TasksStatus id={task?.confirmType}></TasksStatus>
															:<TasksStatus id={"DEFAULT"}></TasksStatus>}
													</TableCell>

													{/*<TableCell  align="left"   padding="none">
												{task?.taskConfirmations?.length >0 ? <TasksStatus id={task.taskConfirmations[task.taskConfirmations.length-1].taskConfirm}></TasksStatus>
												:<TasksStatus id={"DEFAULT"}></TasksStatus>}
											</TableCell>*/}
													{/*<TableCell align="right">{documents.documentName}</TableCell>*/}
													{/*<TableCell align="right">{documents.fileName}</TableCell>*/}
													{/*<TableCell align="right">{documents.fileDescription}</TableCell>*/}
												</TableRow>
											);
										})}

								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={tasks.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</Paper>
					{/*<FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />*/}
				</div>}
			innerScroll
		/>

	)
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
