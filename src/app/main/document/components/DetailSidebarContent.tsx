import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, {useState, Component} from 'react';
import {useTransition} from "react-spring";
import {useTranslation} from "react-i18next";
//import { selectFileById } from './store/filesSlice';
import config from "../../../services/Config";

const useStyles = makeStyles({
    table: {
        '& th': {
            padding: '16px 0'
        }
    },
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
});

function DetailSidebarContent(props) {
    //const selectedItem = useSelector(state => selectFileById(state, state.fileManagerApp.files.selectedItemId));
const {selectedItem}=props
    const {client} = props
    const classes = useStyles();
    const {t} = useTranslation('task');

    const getDocumentUrlByFileName = (fileName : string) => {

        console.log("file name : " + fileName)
        // BackendApi.getDownloadDocumentByUser(clientId.toString(), fileName).then(data => {
        //     const url = window.URL.createObjectURL(new Blob([data]));
        //     console.log("beklenen url: " + url)
        //
        // })

        // var clientId  = sessionStorage.getItem("companyId");
        //console.log("clientId",clientId);
        var clientId = client?.id
        // url güncellendi
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + clientId + "/" + fileName
        console.log("yaratılan url: " + url)
        return url
    }

    var x=[];
    var y ="";
    for(let i=selectedItem?.filePath.length;i>=selectedItem?.filePath.length-selectedItem?.filePath.length;i--){
        if(selectedItem?.filePath[i]=='.'){
            break;
        }
        x.push(selectedItem?.filePath[i]);
    }
    x.shift();
    //ts-ignore
    y=x.toString();
    if (!selectedItem) {
        return null;
    }
    if(y =='g,p,j' || y == 'g,n,p' || y=='G,N,P' || y=='G,P,J'  || y == "G,E,P,J" || y == "g,e,p,j"){
        {return(
            <div>
            <Typography variant="subtitle1" className="py-16">
                <img src={getDocumentUrlByFileName(selectedItem.fileName)}/>
        </Typography>
        </div>
        )};
    }
    else{
        return(<div>
            <Typography variant="subtitle1" className="py-16">
                {/*<iframe src={getDocumentUrlByFileName(selectedItem.fileName)}/>*/}
            </Typography>
        </div>);
    }

    // return (
    //     <FuseAnimate animation="transition.slideUpIn" delay={200}>
    //         <div className="file-details p-16 sm:p-24">
    //             <Typography variant="subtitle1" className="py-16">
    //                 <iframe src={"assets/customer/"+ selectedItem.fileName} />
    //             </Typography>
    //
    //             <Typography variant="subtitle1" className="py-16">
    //                 {t("INFO")}
    //             </Typography>
    //
    //             <table className={clsx(classes.table, 'w-full text-justify')}>
    //                 <tbody>
    //                 <tr className="type">
    //                     <th>{t("TYPE")}</th>
    //                     <td>{selectedItem.documentType}</td>
    //                 </tr>
    //
    //                 {/*<tr className="size">*/}
    //                 {/*    <th>Size</th>*/}
    //                 {/*    <td>{selectedItem.size === '' ? '-' : selectedItem.size}</td>*/}
    //                 {/*</tr>*/}
    //
    //                 {/*<tr className="location">*/}
    //                 {/*    <th>Location</th>*/}
    //                 {/*    <td>{selectedItem.location}</td>*/}
    //                 {/*</tr>*/}
    //
    //                 {/*<tr className="owner">*/}
    //                 {/*    <th>Owner</th>*/}
    //                 {/*    <td>{selectedItem.owner}</td>*/}
    //                 {/*</tr>*/}
    //
    //                 {/*<tr className="modified">*/}
    //                 {/*    <th>Modified</th>*/}
    //                 {/*    <td>{selectedItem.modified}</td>*/}
    //                 {/*</tr>*/}
    //
    //                 {/*<tr className="opened">*/}
    //                 {/*    <th>Opened</th>*/}
    //                 {/*    <td>{selectedItem.opened}</td>*/}
    //                 {/*</tr>*/}
    //
    //                 <tr className="created">
    //                     <th>{t("DESCRIPTION")}</th>
    //                     <td>{selectedItem.fileDescription}</td>
    //                 </tr>
    //                 </tbody>
    //             </table>
    //         </div>
    //     </FuseAnimate>
    // );
}

export default DetailSidebarContent;
