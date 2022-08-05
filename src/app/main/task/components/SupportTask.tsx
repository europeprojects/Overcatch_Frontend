import React, { useEffect, useState } from 'react';
import { createStyles, lighten, makeStyles, Theme, useTheme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
	AppBar,
	Button,
	Checkbox, Grid,
	Icon,
	IconButton,
	ListItemText,
	Menu,
	MenuItem,
	Select,
	TablePagination,
	TableSortLabel, TextField,
	Toolbar,
	Tooltip,
	Typography
} from '@material-ui/core';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { any, func, number, object, oneOf, string } from 'prop-types';
import { useSelector } from 'react-redux';
import _, {divide} from 'lodash';
import { Divided, Help, HelpType} from '../../../types/UserModel';
import api from '../../../services/BackendApi';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import FuseScrollbars from '../../../../@fuse/core/FuseScrollbars';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import history from '../../../../@history/@history';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Formsy from 'formsy-react';
import { Div } from '../../../components/Grid';
import TextFieldFormsy from '../../../../@fuse/core/formsy/TextFieldFormsy';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import { KeyboardArrowLeft, KeyboardArrowRight, SelectAllOutlined, SelectAllRounded } from '@material-ui/icons';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import {useSnackbar} from "notistack";

function EnhancedTableHead(props) {
	const { t } = useTranslation('task');
	const headCells = [
		{
			id: 'type',
			align: 'right',
			disablePadding: false,
			label: t('TYPE'),
			sort: true,
			numeric: true
		},
		{
			id: 'fileName',
			align: 'left',
			disablePadding: false,
			label: t('FILENAME'),
			sort: true,
			numeric: true
		},
		{
			id: 'date',
			align: 'left',
			disablePadding: false,
			label: t('DATE'),
			sort: true,
			numeric: true
		},
		{
			id: 'client',
			align: 'Left',
			disablePadding: false,
			label: t('CLIENT'),
			sort: true,
			numeric: true
		},
		{
			id: 'bussName',
			align: 'Left',
			disablePadding: false,
			label: t('BUSINESSNAME'),
			sort: true,
			numeric: true
		},
		{
			id: 'status',
			align: 'left',
			disablePadding: false,
			label: t('STATUS'),
			sort: true,
			numeric: true
		}
	];
	const [helpTypes, setHelpTypes] = useState<HelpType[]>();
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};
	const { supportType, setSupportType, statusType, setStatusType } = props;

	useEffect(() => {
		api.getHelpTypes().then(response => setHelpTypes(response));
	}, []);

	function handleChangeCheckbox(value: any, checked: boolean, id: string) {
		if (id == 'type'){
			if(checked && !supportType.includes(value)){
				setSupportType(oldArray => [...oldArray,value]);
			}
			else if (!checked && supportType.includes(value)){
				setSupportType(supportType.filter(item => item != value))
			}
		}
		else if (id == 'status'){
			if(checked && !statusType.includes(value)){
				setStatusType(oldArray => [...oldArray,value]);
			}
			else if (!checked && statusType.includes(value)){
				setStatusType(statusType.filter(item => item != value))
			}
		}
	}

	return (
		<TableHead>
			{headCells.map(headCell =>
				headCell.id == 'type' ? (
					<TableCell
						key={headCell.id}
						style={{ padding: '5px', margin: '5px' }}
						// sortDirection={orderBy === headCell.id ? order : false}
					>
						<Formsy>
							<Div fullWidth>
								{t('SUPPORTTYPE')}
								<Select
									labelId="demo-mutiple-checkbox-label"
									id="demo-mutiple-checkbox"
									//multiple
									value={supportType}
									style={{maxWidth:"240px"}}
									//input={<Input />}
									renderValue={(selected) => (selected as string[]).join(',')}
									MenuProps={MenuProps}
									variant="outlined"
									name="supportType"
								>
									<MenuItem value={`supportType`}>{t('SUPPORTTYPE')}</MenuItem>
									{headCell.id == 'type' &&
										helpTypes?.map(ht => (
											<MenuItem value= {ht.id}>
												<Checkbox
													style={{color : '#172a3a'}}
													onChange={(e,checked) => {handleChangeCheckbox(ht?.helpTypeShowName, checked, headCell.id)}}
													checked={supportType.indexOf(ht?.helpTypeShowName) > -1}/>
												<ListItemText primary={t(ht?.helpTypeShowName.toString())} />
											</MenuItem>
										))}
								</Select>
							</Div>
						</Formsy>
					</TableCell>
				) : headCell.id == 'status' ? (
					<TableCell
						key={headCell.id}
						style={{ padding: '5px', margin: '5px' }}
						// sortDirection={orderBy === headCell.id ? order : false}
					>
						<Formsy>
							<Div fullWidth>
								{t('STATUS')}
								<Select
									labelId="demo-mutiple-checkbox-label"
									id="demo-mutiple-checkbox"
									//multiple
									value={statusType}
									//style={{height:'110px'}}
									//input={<Input />}
									renderValue={(selected) => (selected as string[]).join(',')}
									MenuProps={MenuProps}
									variant="outlined"
									name="status"
								>
									<MenuItem value='PENDING'>
										<Checkbox
											style={{color : '#172a3a'}}
											onChange={(e,checked) => {handleChangeCheckbox('PENDING', checked, headCell.id)}}
											checked={statusType.indexOf('PENDING') > -1}/>
										<ListItemText primary={t('PENDING')} />
									</MenuItem>
									<MenuItem value={`INPROGRESS`}>
										<Checkbox
											style={{color : '#172a3a'}}
											onChange={(e,checked) => {handleChangeCheckbox('INPROGRESS', checked, headCell.id)}}
											checked={statusType.indexOf('INPROGRESS') > -1}/>
										<ListItemText primary={t('INPROGRESS')} />
									</MenuItem>
									<MenuItem value={`DONE`}>
										<Checkbox
											style={{color : '#172a3a'}}
											onChange={(e,checked) => {handleChangeCheckbox('DONE', checked, headCell.id)}}
											checked={statusType.indexOf('DONE') > -1}/>
										<ListItemText primary={t('DONE')} />
									</MenuItem>
									<MenuItem value={`REJECTED`}>
										<Checkbox
											style={{color : '#172a3a'}}
											onChange={(e,checked) => {handleChangeCheckbox('REJECTED', checked, headCell.id)}}
											checked={statusType.indexOf('REJECTED') > -1}/>
										<ListItemText primary={t('REJECTED')} />
									</MenuItem>
								</Select>
							</Div>
						</Formsy>
					</TableCell>
				) : (
					<TableCell
						style={{ padding: '2px', textAlign: 'center' }}
						key={headCell.id}
						//align={headCell.numeric ? 'right' : 'left'}
						// padding={headCell.disablePadding ? 'none' : 'default'}
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
	supportType: any,
	setSupportType: any,
	statusType: any,
	setStatusType: any
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
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

const useStyles1 = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexShrink: 0,
			marginLeft: theme.spacing(2.5)
		}
	})
);

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
					Support List
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
	},
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

const HtmlTooltip = withStyles((theme: Theme) => ({
	tooltip: {
		backgroundColor: '#f5f5f9',
		color: 'rgba(0, 0, 0, 0.87)',
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(16),
		border: '1px solid #dadde9'
	}
}))(Tooltip);

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
			<IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
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

export default function SupportTask(props: any) {
	const classes = useStyles();
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});
	const [selected, setSelected] = React.useState([]);
	const [selectedHelp, setSelectedHelp] = React.useState<Help>();
	const [divided, setDivided] = useState<Divided>({} as Divided);
	const [page, setPage] = React.useState(0);
	const [helpList, setHelpList] = React.useState<Help[]>();
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	//@ts-ignore
	const [progress, setProgress] = React.useState(0);
	const [open, setOpen] = React.useState(false);
	const [openDivided, setOpenDivided] = React.useState(false);
	const mainTheme = useSelector(selectMainTheme);
	const [search, setSearch] = useState<string>(''); // Başlangıç değerleri "
	const [currentUser, setCurrentUser] = useState("");
	const { documents } = props;
	const [supportType, setSupportType] = useState([]);
	const [statusType, setStatusType] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [disabled, setDisabled] = useState(false);
	const { t } = useTranslation('task');

	useEffect(()=>{
		api.getCurrentUser().then(response => {
			// @ts-ignore
			setCurrentUser(response?.userType);
		});
	},[])

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
	
	const getDownload = (id: number, fileName: string) => {
		api.getDownloadDocumentByUser(id.toString(), fileName).then(data => {
			const url = window.URL.createObjectURL(new Blob([data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
		});
	};

	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = documents.map(n => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const progressCallback = (loaded: number, total: number) => {
		setProgress(Math.round((loaded / total) * 100));
	};

	function handleControl(){
		if(divided?.shareHolding == null || divided?.shareHolding?.toString().indexOf(",")> 0){
			if(divided?.shareHolding?.toString().indexOf(",")){
				enqueueSnackbar(<h4>Please use "." instead of ","</h4>, {
					variant: 'error',
				})
			}else {
				enqueueSnackbar(<h4>Please enter a valid share Holding</h4>, {
					variant: 'error',
				})
			}
			return false;
		}else if(divided?.amountPayable == null || divided?.amountPayable?.toString().indexOf(",")> 0){
			if(divided?.amountPayable?.toString().indexOf(",")){
				enqueueSnackbar(<h4>Please use "." instead of ","</h4>, {
					variant: 'error',
				})
			}else {enqueueSnackbar(<h4>Please enter a valid amount payable</h4>, {
				variant: 'error',
			})
			}
			return false;
		} else if(divided?.dividedEndDate == null){
			enqueueSnackbar(<h4>Please enter a valid end date number</h4>, {
				variant: 'error',
			})
			return false;
		}else if(divided?.paymentNumber == null || divided?.paymentNumber?.toString().indexOf(",")> 0){
			if(divided?.paymentNumber?.toString().indexOf(",")){
				enqueueSnackbar(<h4>Please use "." instead of ","</h4>, {
					variant: 'error',
				})
			}else {
				enqueueSnackbar(<h4>Please enter a valid payment number</h4>, {
					variant: 'error',
				})
			}
			return false;
		}else if(divided?.datePaymentRate == null){
			setDisabled(false);
			enqueueSnackbar(<h4>Please select a payment date</h4>, {
				variant: 'error',
			})
			return false;
		}else{
			try{
				const payment = parseFloat(divided.paymentNumber.toString())
				const share = parseFloat(divided.shareHolding.toString())
				const amount = parseFloat(divided.amountPayable.toString())
				const date = Date.parse(divided.datePaymentRate.toString());
				const endDate = Date.parse(divided.dividedEndDate.toString());

				if(payment && share && amount && date && endDate) {
					setDivided({...divided, paymentNumber: payment, amountPayable: amount,shareHolding: share,
						//@ts-ignore
						datePaymentRate:date, dividedEndDate: endDate});
					return true;
				}else{
					enqueueSnackbar(<h4>Please fill all of the blank with correct values</h4>, {
						variant: 'error',
					})
					return false;
				}
			}catch(e){
				return false;
			}
		}
	}

	const getProcess = (type: string, taskId, helpType : string) => {
		setDisabled(true);
		if(helpType == "Dividend Voucher"){
			if(handleControl()){
				//api.saveDivided(divided).then();
				api.answeredTicket(selectedHelp, null, progressCallback).then();
				api.getTaskConfirm(type, taskId, '').then(data => {
					history.go(0);
				});
			}else{
				setDisabled(false);
			}
		}else{
			api.answeredTicket(selectedHelp, null, progressCallback).then();
			api.getTaskConfirm(type, taskId, '').then(data => {
				history.go(0);
			});
		}
	};

	const handleClick = (event, name) => {
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

	const handleClose = () => {
		setOpen(false);
	};

	function handleForm(event) {
		setSelectedHelp({ ...selectedHelp, [event.target.name]: event.target.value });
	}

	function handleClear() {
		setPage(0);
		setSearch('');
		setSupportType([]);
		setStatusType([]);
	}

	useEffect(() => {
		api.getSupportTask(search, supportType.length < 1 ? "" : supportType.toString(), statusType.length < 1 ? "" : statusType.toString()).then(res => {
			setHelpList(res);
			setPage(0);
		});
	}, [supportType, statusType, search]);

	const getDivided = (n)=>{
		const divid = n?.divided;
		api.getByDirectorIdForDivided(divid).then((res)=>{
			setDivided(res);
			setSelectedHelp(n);
		}).finally(()=>
			setOpenDivided(true))
	}

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
								{t('SUPPORTPAGE')}
							</Typography>
						</FuseAnimate>
					</div>

					<ThemeProvider theme={mainTheme}>
						<FuseAnimate animation="transition.slideDownIn" delay={300}>
							<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
								<Icon color="action">search</Icon>

								<Input
									placeholder={t('CLIENT') + ' , ' + t('BUSINESSNAME')}
									className="flex flex-1 mx-8"
									disableUnderline
									fullWidth
									value={search}
									inputProps={{
										'aria-label': 'Search'
									}}
									onChange={e => setSearch(e.target.value)}
								/>
							</Paper>
						</FuseAnimate>
					</ThemeProvider>

					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<Button
							className="ml-5 rounded-8 bg-white"
							variant="contained"
							onClick={() => {
								handleClear();
							}}
						>
							{t('SEARCHCLEAR')}
						</Button>
					</FuseAnimate>
				</div>
			}
			content={
				<div className="w-full flex flex-col">
					<FuseScrollbars className="flex-grow overflow-x-auto">
						<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">

							<EnhancedTableHead
								classes={classes}
								numSelected={selected.length}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={helpList?.length}
								supportType={supportType}
								setSupportType={setSupportType}
								statusType={statusType}
								setStatusType={setStatusType}
							/>
							<TableBody>
								{_.orderBy(
									helpList,
									[
										o => {
											switch (order.id) {
												default: {
													return o[order.id];
												}
											}
										}
									],
									//@ts-ignore
									[order.direction]
								)
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map(n => {
										return (
											<TableRow
												className="h-64 cursor-pointer"
												hover
												tabIndex={-1}
												key={n.id}
											>
												{n.helpType?.helpTypeShowName == 'Dividend Voucher' ?
												(	n.task?.taskConfirmations?.length === 0 ?
														<TableCell
															onClick = {()=> {
																// getDivided();
																setSelectedHelp(n);
																setDivided({} as Divided);
																setOpenDivided(true);
															}}
														>
															{n.helpType?.helpTypeShowName}
														</TableCell>
														:
														<TableCell className="p-4 md:p-16 truncate" component="th" scope="row" onClick={event => {
															getDivided(n);
															// handleDivided(event, n);
														}} >
															{n?.helpType?.helpTypeShowName}
														</TableCell>
												)
													:
												<TableCell
													onClick={event => handleClick(event, n.id)}
													className="p-4 md:p-16 truncate" component="th" scope="row">
													{' '}
													{n.helpType?.helpTypeShowName}{' '}
												</TableCell>
												}
												<TableCell
													className="p-4 md:p-16"
													component="th"
													scope="row"
													align="left"
													onClick={(event) => {
														event.stopPropagation();
														handleClick(event,n.id)
													}}
												>
													{n.document?.fileName ? (
														<Button
															color={'primary'}
															variant={'outlined'}
															onClick={() =>
																getDownload(n.client.id, n.document?.fileName)
															}
														>
															{n.document?.fileName}
														</Button>
													) : (
														''
													)}
												</TableCell>

												<TableCell
													className="p-4 md:p-16 truncate"
													component="th"
													scope="row"
													align={'left'}
													onClick={event => handleClick(event, n.id)}
												>
													{moment(n?.createdDateTime).format('DD-MM-YYYY')}
												</TableCell>
												<TableCell
													className="p-4 md:p-16"
													component="th"
													scope="row"
													align="left"
													onClick={event => handleClick(event, n.id)}
												>
													{n.client.customerClients?.length === 1 ? (
														<Typography>
															{n.client?.customerClients[0]?.customerInfo?.userInfo?.name}{' '}
															{
																n.client.customerClients[0]?.customerInfo.userInfo
																	?.surname
															}
														</Typography>
													) : (
														<HtmlTooltip
															title={
																<React.Fragment>
																	{n.client.customerClients?.map(user => (
																		<Typography color="inherit">
																			{user.customerInfo.userInfo?.name}{' '}
																			{user.customerInfo.userInfo?.surname}{' '}
																		</Typography>
																	))}
																</React.Fragment>
															}
														>
															<Button>
																{n.client.customerClients?.length} Shareholder...
															</Button>
														</HtmlTooltip>
													)}
												</TableCell>

												<TableCell
													className="p-4 md:p-16 truncate"
													component="th"
													scope="row"
													align={'left'}
												>
													{' '}
													{n.client?.company
														? n.client.company.name
														: n.client.founderOwner.tradeAsName}{' '}
												</TableCell>

												<TableCell
													className="p-4 md:p-16 truncate"
													component="th"
													scope="row"
													align={'right'}
													onClick={event => event.stopPropagation()}
												>
													<Button
														variant="contained"
														color="primary"
													>
														{n.task?.taskConfirmations?.length === 0
															? t('PENDING')
															: t(
																n.task.taskConfirmations
																	.find(
																		i =>
																			i.id ===
																			Math.max(
																				...n.task?.taskConfirmations.map(
																					a => a.id
																				)
																			)
																	)
																	?.taskConfirm.toString()
															)}
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
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

					<Dialog
						fullWidth={true}
						maxWidth={'md'}
						open={open}
						onClose={handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle style={{ backgroundColor: '#132332', color: '#fff' }} id="alert-dialog-title">
							{t('DETAILS')}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								<Formsy>
									<Div columns={2}>
										<Div columns={1}>
											<Div columns={1}>
												<TextFieldFormsy
													id="outlined-multiline-static"
													label="Description"
													className="mb-16"
													multiline
													name="description"
													rows={5}
													variant="outlined"
													disabled={true}
													value={selectedHelp?.description}
												/>
											</Div>
											<Div columns={1}>
												<TextFieldFormsy
													id="outlined-multiline-static"
													label="Response"
													className="mb-16"
													multiline
													name="answer"
													rows={5}
													variant="outlined"
													value={selectedHelp?.answer}
													onChange={handleForm}
												/>
											</Div>
										</Div>
										<Div columns={1}>
											<Div columns={1}>
												{
													<TextFieldFormsy
														id="outlined-multiline-static"
														label={t('CLIENT')}
														className="mb-16"
														multiline
														name="client"
														variant="outlined"
														disabled={true}
														value={
															selectedHelp?.request_user?.name +
															' ' +
															selectedHelp?.request_user?.surname +
															'\n' +
															selectedHelp?.request_user?.msisdn +
															'\n' +
															selectedHelp?.request_user?.email
														}
													/>
												}
											</Div>
										</Div>
									</Div>
									<DialogActions>
										<Div className="flex flex-end">
											<Button
												variant="contained"
												autoFocus
												onClick={handleClose}
												color="secondary"
											>
												{t('CLOSE')}
											</Button>

											<PopupState variant="popover" popupId="demo-popup-menu">
												{popupState => (
													<React.Fragment>
														<Button
															variant="contained"
															color="primary"
															type="submit"
															{...bindTrigger(popupState)}
														>
															{t('SAVE')}
														</Button>
														<Menu {...bindMenu(popupState)}>
															<MenuItem
																disabled={disabled}
																onClick={event => {
																	event.stopPropagation();
																	getProcess('DONE', selectedHelp.task.id, selectedHelp?.helpType?.helpTypeShowName);
																}}
															>
																{t('DONE')}
															</MenuItem>

															<MenuItem
																disabled={disabled}
																onClick={event => {
																	getProcess('INPROGRESS', selectedHelp.task.id, selectedHelp?.helpType?.helpTypeShowName);
																}}
															>
																{t('INPROGRESS')}
															</MenuItem>

															<MenuItem
																disabled={disabled}
																value={'REJECTED'}
																onClick={event => {
																	getProcess("REJECTED", selectedHelp.task.id, selectedHelp.helpType.helpTypeShowName)}}
															>
																{t("REJECTED")}
															</MenuItem>
														</Menu>
													</React.Fragment>
												)}
											</PopupState>

										</Div>
									</DialogActions>
								</Formsy>
							</DialogContentText>
						</DialogContent>
					</Dialog>

					<Dialog open={openDivided} onClose={()=>setOpenDivided(false)}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit"
											onClick={()=>setOpenDivided(false)} aria-label="close">
									<CloseIcon/>
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									DIVIDEND VOUCHER
								</Typography>
								{selectedHelp?.task?.taskConfirmations.length>0?
									selectedHelp?.task?.taskConfirmations?.map((confirmation)=>
										confirmation?.taskConfirm?.toString() == "DONE"?
											<DialogTitle id="alert-dialog-title">
											</DialogTitle>:
											<PopupState variant="popover" popupId="demo-popup-menu">
												{popupState => (
													<React.Fragment>
														<Button
															variant="contained"
															color="primary"
															type="submit"
															{...bindTrigger(popupState)}
														>
															{t('SAVE')}
														</Button>
														<Menu {...bindMenu(popupState)}>
															<MenuItem
																disabled={disabled}
																onClick={event => {
																	event.stopPropagation();
																	getProcess('DONE', selectedHelp?.task?.id, selectedHelp?.helpType?.helpTypeShowName);
																}}
															>
																{t('DONE')}
															</MenuItem>
															<MenuItem
																disabled={disabled}
																value={'REJECTED'}
																onClick={event => {
																	getProcess("REJECTED", selectedHelp?.task?.id, selectedHelp?.helpType?.helpTypeShowName)}}
															>
																{t("REJECTED")}
															</MenuItem>
														</Menu>
													</React.Fragment>
												)}
											</PopupState>
									):
									<PopupState variant="popover" popupId="demo-popup-menu">
										{popupState => (
											<React.Fragment>
												<Button
													variant="contained"
													color="primary"
													type="submit"
													{...bindTrigger(popupState)}
												>
													{t('SAVE')}
												</Button>
												<Menu {...bindMenu(popupState)}>
													<MenuItem
														disabled={disabled}
														onClick={event => {
															event.stopPropagation();
															getProcess('DONE', selectedHelp?.task?.id, selectedHelp?.helpType?.helpTypeShowName);
														}}
													>
														{t('DONE')}
													</MenuItem>
													<MenuItem
														disabled={disabled}
														value={'REJECTED'}
														onClick={event => {
															getProcess("REJECTED", selectedHelp?.task?.id, selectedHelp?.helpType?.helpTypeShowName)}}
													>
														{t("REJECTED")}
													</MenuItem>
												</Menu>
											</React.Fragment>
										)}
									</PopupState>
								}
							</Toolbar>
						</AppBar>
						{
							(currentUser?.toString()=="MANAGER" || currentUser?.toString() == "EMPLOYEE")?
									<div style={{ width : "450px", height:"600px", marginTop : "50px"}} >
										<Grid item xs={12} sm={12}
											  style={{textAlign : "center", border : "black", margin : "2%", fontWeight : "bold"}}
										>
											<label style={{margin : "2%"}}>Dividend Voucher</label>
										</Grid>
										<Grid container  style={{textAlign : "center"}} >
											<Grid item xs={12} sm={6}>
												<label>Payment Number</label>
												<div>
													<TextField
														onChange={(e) => setDivided({...divided, directorId : selectedHelp?.divided,
															//@ts-ignore
															paymentNumber:e.target.value})}
														className="my-16 mx-6"
														name="invitedSurname"
														label="Payment Number"
														variant="outlined"
														value={divided?.paymentNumber}
													/>
												</div>
											</Grid>
											<Grid item xs={12} sm={6}>
												<label>Date Payment Made</label>
												<div>
													<TextField
														type="date"
														onChange={(e)=>setDivided({...divided, directorId : selectedHelp?.divided, datePaymentRate:e.target.value})}
														className="my-16 mx-6"
														name="invitedSurname"
														label={divided.datePaymentRate}
														variant="outlined"
														InputLabelProps={{
															shrink: true
														}}
														inputProps={{
															max: '3000-01-01',
															min:'1000-01-01'
														}}
														value={divided.datePaymentRate}
														// disabled={selectedHelp?.task?.taskConfirmations?.length>0?true:false}
													/>
												</div>
											</Grid>
											<Grid item xs={12} sm={12}>
												{selectedHelp?.client?.company?.name}
											</Grid>
											<Grid item xs={12} sm={6}>
												Employee Name & Address:<br/>
											</Grid>

											<Grid item xs={12} sm={6}></Grid>

											<Grid container style={{marginLeft : "10%", marginRight : "10%"}}>
												<Grid item xs={12} sm={4}>
													Shareholding
													<br/>
													<TextField
														onChange={(e)=>setDivided({...divided, directorId : selectedHelp?.divided,
															//@ts-ignore
															shareHolding:e.target.value})}
														className="my-16 mx-6"
														name="invitedSurname"
														label={selectedHelp?.taskConfirmations?.length > 0 ? divided?.shareHolding : "Share Holding"}
														variant="outlined"
														value={divided.shareHolding}
														// disabled={selectedHelp?.task?.taskConfirmations?.length>0?true:false}
													/>
												</Grid>
												<Grid item xs={12} sm={4}>

												</Grid>
												<Grid item xs={12} sm={4}>
													Amount Payable
													<br/>
													<TextField
														fullWidth={true}
														onChange={(e)=>{
															setDivided({...divided, directorId : selectedHelp?.divided,
																//@ts-ignore
																amountPayable:e.target.value })
														}}
														className="my-16 mx-6"
														name="invitedSurname"
														label="Amount Payable"
														variant="outlined"
														value={divided?.amountPayable}
													/>
												</Grid>

												<Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
													<label>
														This cheque is in payment of the Interim dividend<br/>
														for the year ended :
														<TextField
															type="date"
															onChange={(e)=>setDivided({...divided, directorId : divided?.directorId,
																dividedEndDate:e.target.value})}
															className="my-16 mx-6"
															name="dividedEndDate"
															label="Year End Date For Payment Rate"
															variant="outlined"
															InputLabelProps={{
																shrink: true
															}}
															inputProps={{
																max: '3000-01-01',
																min:'1000-01-01'
															}}
															value={divided?.dividedEndDate}
														/>
														<br/>
														paid at the rate of <label style={{color:"blue"}}>£
														{/*@ts-ignore*/}
														{divided?.amountPayable}
													</label>
														on those<br/>
														ordinary shares  registered in your name on <label style={{color:"blue"}}>
														{/*@ts-ignore*/}
														{divided?.dividedEndDate}
													</label>
														<br/>

													</label><br/>
													<label>
														Given on behalf of<br/>
														{selectedHelp?.client?.company?.name}<br/>
														<label style={{color:"blue"}}>
															Registered Office Address 17 Greenlanes, London, United Kingdom, N16 9BS
														</label>
													</label>
												</Grid>
											</Grid>
										</Grid>
									</div>
							 :
								<label/>
						}
					</Dialog>
				</div>
			}
			innerScroll
		/>
	);
}
