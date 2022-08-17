import React, {useCallback, useEffect, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
import {Editable, Slate, useSlate, withReact} from 'slate-react'
import {createEditor, Editor, Element as SlateElement, Node, Transforms,} from 'slate'
import {withHistory} from 'slate-history'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    Card,
    CardContent,
    makeStyles,
    StepConnector,
    StepLabel,
    Stepper,
    Step,
    TextField,
    Button as Btn,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    AppBar,
    Slide,
    createStyles,
    Toolbar as Tbar,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import {Button, Icon, Toolbar} from "../../letter/components/Components";
import api from "../../../services/BackendApi";
import {Client, Letter, LetterType} from "../../../types/UserModel";
import {useSelector} from 'react-redux';
import {Div} from "../../../components/Grid";
import FounderOwnerDetail from "../../clientApplication/components/FounderOwnerDetail";
import FounderOwnerDirector from "../../clientApplication/components/FounderOwnerDirector";
import FusePageCarded from "../../../../@fuse/core/FusePageCarded/FusePageCarded";
import BusinessCenter from "@material-ui/icons/BusinessCenter";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import DescriptionIcon from "@material-ui/icons/Description";
import clsx from "clsx";
import {Theme, useTheme, withStyles} from "@material-ui/core/styles";
import {Link, useParams} from "react-router-dom";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import BackendApi from "../../../services/BackendApi";
import history from "../../../../@history/@history";
import {TransitionProps} from "@material-ui/core/transitions";
import {Document, Image, Page, PDFViewer, StyleSheet, Text, View} from "@react-pdf/renderer";
import TasksStatus from "../task/TaskStatus";
import {DialogProps} from "@material-ui/core/Dialog";
import {useTranslation} from "react-i18next";
import config from "../../../services/Config";
import AttachFileIcon from '@material-ui/icons/AttachFile';


const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
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

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const useStyles = makeStyles({
    root: {
        // minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const SampleInitialValue = [
    {
        type: 'paragraph',
        children: [
            {text: 'This is editable '},
            {text: 'rich', bold: true},
            {text: ' text, '},
            {text: 'much', italic: true},
            {text: ' better than a '},
            {text: '<textarea>', code: true},
            {text: '!'},
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text:
                    "Since it's rich text, you can do things like turn a selection of text ",
            },
            {text: 'bold', bold: true},
            {
                text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
    },
    {
        type: 'block-quote',
        children: [{text: 'A wise quote.'}],
    },
    {
        type: 'paragraph',
        children: [{text: 'Try it out for yourself!'}],
    },
]
function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const {active, completed} = props;

    const icons = {
        1: <BusinessCenter/>,
        2: <AccountCircleIcon/>,
        3: <EditLocationIcon/>,
        4: <DescriptionIcon/>,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
        },
    },
    line: {
        height: 4,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundImage:
            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        backgroundImage:
            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
    },
});


const useStyles2 = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative'
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }),
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const RichTextExample = (props:any) => {
    const {t} = useTranslation('task');
    const [value, setValue] = useState<Node[]>(SampleInitialValue);
    const theme = useTheme();
    //@ts-ignore
    let routerParams = useParams();
    //@ts-ignore
    const { taskid } = routerParams;
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [client, setClient] = useState<Client>({} as Client);
    const [isLoading,setIsLoading]=useState(false)
    const classes2 = useStyles2();
    const [tabValue, setTabValue] = useState(0);
    const steps = [t('LETTERDETAIL'), t('CONFIRMATION')];
    const [activeStep, setActiveStep] = React.useState(0);
    const [isEdit,setIsEdit]=useState(true);
    const [letter,setLetter] = useState<Letter>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [confirm,setConfirm] = useState<string>();
    const [message,setMessage] = useState<string>();

    const handleClickOpen = () => {
        setOpen1(true);
    };

    const handleClose2 = () => {
        setOpen1(false);
    };

    useEffect(()=>{

        api.getLetterBytaskID(window.atob(taskid)).then(response => {
            // setLetter2(response)
            // const {letter} = response;
            setValue(JSON.parse(decodeURIComponent(escape(window.atob(response.letter)))))
            setLetter(response)
            console.log(response)
        })

        // api.getLetterByID(letterID).then(response => {
        //     setLetter2(response)
        //     const {letter} = response;
        //     setValue(letter)
        // })
        // taskID
   },[])

    const options = [
        'None',
        'Atria',
        'Callisto',
        'Dione',
        'Ganymede',
        'Hangouts Call',
        'Luna',
        'Oberon',
        'Phobos',
        'Pyxis',
        'Sedna',
        'Titania',
        'Triton',
        'Umbriel',
    ];
    useEffect(()=>{
        if(isEdit && letter!==undefined){
            console.log(letter);
            let letter2: Letter = {
                client: letter?.client,
                letter: window.btoa(unescape(encodeURIComponent(JSON.stringify(value)))),
                letterType: letter?.letterType,
                id: letter?.id,
                userRole: letter?.userRole,
                document: letter?.document
            }
            api.editLetter(letter2).then(res => console.log(res));

            console.log("save")
        }else{
            console.log("edit")
        }
    },[isEdit])
    function handleChangeTab(event, value) {
        setTabValue(value);
    }
    const getProcess = () => {
        setOpen2(false)
        setIsLoading(true);
        BackendApi.getTaskConfirm(confirm, parseInt(window.atob(taskid)),message).then(data => {
            history.push("/tasks/list/"+window.btoa("ADMIN"))
            setIsLoading(false)
        })
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClose3 = () => {
        setOpen2(false);
    };


    const getDownload = (client, doc) => {
        BackendApi.getDownloadDocumentByUser(client?.id, doc?.fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc?.fileName);
            document.body.appendChild(link);
            link.click();
        })
    }

    // @ts-ignore
    return (
        <FusePageCarded
            header={
                client && (

                    <div className="flex flex-1 w-full items-center justify-between">
                        <div className="flex flex-1 flex-col items-center sm:items-start">
                            {/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
                            <Typography
                                className="normal-case flex items-center sm:mb-12"
                                component={Link}
                                role="button"
                                    to={"/tasks/list/"+window.btoa("ADMIN")}
                                color="inherit"
                            >
                                <Icon className="text-20">
                                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                                </Icon>
                                <span className="mx-4">{t("TASKS")}</span>
                            </Typography>
                            {/*</FuseAnimate>*/}

                            <div className="flex flex-col min-w-0 items-center sm:items-start">
                                {/*<FuseAnimate animation="transition.slideLeftIn" delay={300}>*/}
                                <Typography className="text-16 sm:text-20 truncate">
                                    {t('LETTERTASK')}{` - ${window.atob(taskid)}`}
                                </Typography>
                                <Typography className="text-12 sm:text-12 truncate">
                                    {/*@ts-ignore*/}
                                    {t('PROCESSDATE')}{` - ${letter?.task?.processDate}`}
                                </Typography>
                                {/*</FuseAnimate>*/}

                                {/*<FuseAnimate animation="transition.slideLeftIn" delay={300}>*/}
                                <Typography className="text-14 sm:text-20 truncate" variant="caption">
                                    {/*{company.fullName} - {soleTraderCompany !=null ?"Sole Trader":"Incorpration"}*/}
                                </Typography>
                                {/*</FuseAnimate>*/}
                            </div>

                        </div>


                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>

                                    <Btn variant="contained" color="secondary" {...bindTrigger(popupState)}>
                                        {routingData?.confirmType == null ? (t('SELECTSTATE')):(t(routingData?.confirmType.toString()))}
                                    </Btn>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {
                                            setConfirm("INPROGRESS")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t("INPROCESS")}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("DONE")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t("DONE")}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("REJECTED");
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t("REJECTED")}</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>

                        {isLoading && (<CircularProgress color={"secondary"} className={"z-40 float-right"} />)}


                    </div>
                )
            }
            classes={{
                toolbar: 'p-0',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}

            contentToolbar={

                <Stepper className="w-full" alternativeLabel activeStep={activeStep} connector={<ColorlibConnector/>}>
                    {steps.map((label, indis) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}
                                       onClick={() => setActiveStep(indis)}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            }
            content={
                (

                    <div className="w-full">

                        <Dialog
                            fullWidth={true}
                            maxWidth={"xs"}
                                 open={open2}
                                 onClose={handleClose3} aria-labelledby="customized-dialog-title" >
                            <DialogTitle id="customized-dialog-title" >
                                {t("CONFIRMMESSAGE")}
                            </DialogTitle>
                            <DialogContent dividers>
                                    <FormControl className={"w-full"} >
                                        <TextField

                                            multiline
                                            // value={fileDescription}
                                            value={message}
                                            onChange={(e)=>setMessage(e.target.value)}
                                            rows={3}
                                            rowsMax={4}
                                            name="message"
                                            variant={"outlined"}
                                        />
                                    </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button variant={"contained"} onClick={handleClose3} color="secondary">
                                    {t("CLOSE")}
                                </Button>
                                <Button variant={"contained"} onClick={()=>getProcess()} color="primary">
                                    {t("SAVE")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                            {/*<IconButton*/}
                            {/*    className={"place-self-center"}*/}
                            {/*    aria-label="more"*/}
                            {/*    aria-controls="long-menu"*/}
                            {/*    aria-haspopup="true"*/}
                            {/*    onClick={handleClick}*/}
                            {/*>*/}
                            {/*    <MoreVertIcon />*/}
                            {/*</IconButton>*/}
                            {/*<Menu*/}
                            {/*    id="long-menu"*/}
                            {/*    anchorEl={anchorEl}*/}
                            {/*    keepMounted*/}
                            {/*    open={open}*/}
                            {/*    onClose={handleClose}*/}
                            {/*    PaperProps={{*/}
                            {/*        style: {*/}
                            {/*            maxHeight: 48 * 4.5,*/}
                            {/*            width: '20ch',*/}
                            {/*        },*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <MenuItem onClick={()=>{setIsEdit(isEdit===true? false:true); handleClose()}}>*/}
                            {/*        {isEdit===false ? ("Save Letter"):("Edit Letter")}*/}
                            {/*    </MenuItem>*/}
                            {/*    /!*<MenuItem onClick={()=>{alert("download"); handleClose()}}>*!/*/}
                            {/*    /!*    Download Letter*!/*/}
                            {/*    /!*</MenuItem>*!/*/}
                            {/*    <MenuItem onClick={()=>{handleClickOpen(); handleClose()}}>*/}
                            {/*        {t("PREVIEW")}*/}
                            {/*    </MenuItem>*/}
                            {/*</Menu>*/}
                        <Div className="m-32 w-3/5" columns={3}>
                            <Btn onClick={()=>{setIsEdit(isEdit===true? false:true); handleClose()}}
                                 variant="contained" color="primary">
                                {isEdit===false ? (t('SAVELETTER')):(t('EDITLETTER'))}
                            </Btn>
                            <Btn onClick={()=>{handleClickOpen(); handleClose()}}
                                 variant="contained" color="secondary">
                                {t("PREVIEW")}
                            </Btn>

                            {letter?.document && (
                                <Btn variant="contained" color="secondary" endIcon={<AttachFileIcon />}
                                    onClick={()=>getDownload(letter?.client, letter?.document)}
                                >
                                    {t("DOWNLOAD")}
                                </Btn>
                            )}

                        </Div>
                        <div className="grid justify-items-stretch ...">

                        </div>
                        <hr/>
                        <div className="p-16 sm:p-24 max-w-4xl">


                            <div>
                                {(activeStep === 0 && value!=null) && (
                                    <div className={isEdit==true ? "ml-300 opacity-75 max-w-2xl shadow-xl":"ml-300 max-w-2xl opacity-100 shadow-xl"}>
                                        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                                            <Card className="h-full">
                                                <div className="flex justify-center">
                                                    <Toolbar>
                                                        <MarkButton format="bold" icon="format_bold"/>
                                                        <MarkButton format="italic" icon="format_italic"/>
                                                        <MarkButton format="underline" icon="format_underlined"/>
                                                        <MarkButton format="code" icon="code"/>
                                                        <BlockButton format="heading-one" icon="looks_one"/>
                                                        <BlockButton format="heading-two" icon="looks_two"/>
                                                        <BlockButton format="numbered-list" icon="format_list_numbered"/>
                                                        <BlockButton format="bulleted-list" icon="format_list_bulleted"/>
                                                    </Toolbar>
                                                </div>

                                                <CardContent>
                                                    <div className="p-10">
                                                        <Editable
                                                            color={"red"}
                                                            readOnly={isEdit}
                                                            renderElement={renderElement}
                                                            renderLeaf={renderLeaf}
                                                            placeholder="Enter some rich text�"
                                                            spellCheck
                                                            autoFocus
                                                            onKeyDown={event => {
                                                                for (const hotkey in HOTKEYS) {
                                                                    if (isHotkey(hotkey, event as any)) {
                                                                        event.preventDefault()
                                                                        const mark = HOTKEYS[hotkey]
                                                                        toggleMark(editor, mark)
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                        </Slate>

                                    </div>
                                )}
                                {activeStep === 1 && (
                                    <div className="table-responsive">

                                        <table className="simple">
                                            <thead className="w-full">
                                            <tr>
                                                <th>{t("")}{t("CONFIRMTYPE")}</th>
                                                <th>{t("")}{t("PROCESSDATE")}</th>
                                                <th>{t("")}{t("APPROVEDSTAFF")}</th>
                                                <th>{t("")}{t("STAFFTYPE")}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {/*@ts-ignore*/}
                                            {letter?.task?.taskConfirmations?.map(confirm => (
                                                <tr key={confirm.id}>
                                                    <th>
                                                <span className="truncate">
                                                    {confirm?.taskConfirm.toString()==='INPROGRESS' || confirm?.taskConfirm.toString()==='DONE' ||
                                                    confirm?.taskConfirm.toString()==='REJECTED' ?
                                                        <TasksStatus id={confirm?.taskConfirm}></TasksStatus>
                                                        :<TasksStatus id={"DEFAULT"}></TasksStatus>}
                                                </span>
                                                    </th>
                                                    <td>
                                                        <span className="truncate">{confirm.processDate}</span>
                                                    </td>

                                                    <td>
                                                        <span className="truncate">{confirm.personel.userInfo.name} {confirm.personel.userInfo.surname}</span>
                                                    </td>
                                                    <td>
                                                        <span className="truncate">{confirm.personel.userInfo.userType}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                    </div>


                                )}
                            </div>
                        </div>
                        <Dialog fullScreen open={open1} onClose={handleClose2} TransitionComponent={Transition}>
                            <AppBar className={classes2.appBar}>
                                <Tbar>

                                    <IconButton edge="start" color="inherit" onClick={handleClose2} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h6" className={classes2.title}>
                                        {t("PREVIEWLETTER")}
                                    </Typography>
                                    {/*<Button autoFocus color="inherit" onClick={handleClose}>*/}
                                    {/*    save*/}
                                    {/*</Button>*/}
                                    </Tbar>
                            </AppBar>
                                    {useMemo(()=> (
                                    <PDFViewer className={"flex w-full h-full"}>
                                        <Document>
                                            <Page object-fit="fill" style={styles.pageNumber} size="A4">
                                                <Image fixed src="/assets/images/pdf/image1.png"/>
                                                <View object-fit style={styles.view}>
                                                    {value?.map((ch) => <Text style={styles.text2}>{

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
                                    ), [value])}

                        </Dialog>
                    </div>
                )
            }
            innerScroll
        />

    )
}


const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    // Transforms.unwrapNodes(editor, {
    //     match: n =>
    //         LIST_TYPES.includes(
    //             !Editor.isEditor(n) && SlateElement.isElement(n) && n.type as string
    //         ),
    //     split: true,
    // })
    const newProperties: Partial<SlateElement> = {
        //type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes(editor, newProperties)

    // if (!isActive && isList) {
    //     const block = {type: format, children: []}
    //     Transforms.wrapNodes(editor, block)
    // }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format) => {
    // const [match] = Editor.nodes(editor, {
    //     match: n =>
    //         !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    // })
    //
    // return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const Element = ({attributes, children, element}) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({attributes, children, leaf}) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const BlockButton = ({format, icon}) => {
    const editor = useSlate()
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

const MarkButton = ({format, icon}) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

export default RichTextExample
