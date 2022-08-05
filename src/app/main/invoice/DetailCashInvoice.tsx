import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {useTranslation} from "react-i18next";
import config from "../../services/Config";

const useStyles = makeStyles({
    table: {
        '& th': {
            padding: '16px 0'
        }
    },
});

function DetailCashInvoice(props) {
    const {selectedItem} = props;

    const getDocumentUrlByFileName = (fileName: string) => {
        var id = fileName.split("-")[0]
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + id + "/" + fileName
        return url
    }
    var x = [];
    var y = "";
    for (let i = selectedItem?.fileName.length; i >= selectedItem?.fileName.length - selectedItem?.fileName.length; i--) {
        if (selectedItem?.fileName[i] == '.') {
            break;
        }
        x.push(selectedItem?.fileName[i]);
    }
    x.shift();
    //ts-ignore
    y = x.toString();
    if (!selectedItem) {
        return null;
    }
    if (y == 'g,p,j' || y == 'g,n,p' || y == 'G,N,P' || y == 'G,P,J' || y == "G,E,P,J" || y == "g,e,p,j") {
        return (
            <div>
                <Typography variant="subtitle1" className="py-16">
                    <img src={getDocumentUrlByFileName(selectedItem.fileName)}/>
                </Typography>
            </div>
        )

    } else {
        return (<div>
            <Typography variant="subtitle1" className="py-16">
            </Typography>
        </div>);
    }
}

export default DetailCashInvoice;