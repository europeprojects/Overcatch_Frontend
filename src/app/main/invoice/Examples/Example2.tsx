import React from 'react';
import logo from './resim.jpg';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';




const useStyles = makeStyles({
    table: {
        maxWidth: 550,
        width:550,
    },
});

function createData(name, calories, fat, carbs) {
    return { name, calories, fat, carbs };
}

const rows = [
    createData('7 Inch Brown-Brown Freshly Baked Printed Pizza Box', 450, "£4.500", "£2,025.00"),
    createData('7 Inch White-Brown Freshly Baked Printed Pizza Box', 450, "£5.380", "£2,421.00"),
    createData('10 Inch White-Brown Freshly Baked Printed Pizza Box', 270, "£8.070", "£2,178.90"),
];

function Invoices({invoice}: any,{client}:any) {

    const classes = useStyles();
    return (

            <div style={{
                width: "575px",
                minHeight: "832px",
                marginLeft: "-40px",
                marginTop: "-100px",
                backgroundColor: "#FFFFFF"
            }}>
                <div style={{height: "16px", backgroundColor: "blue"}}></div>
                <div style={{height: "175px", backgroundColor: "#E6E6FA"}}>
                    <div style={{width: "120px", height: "175px", backgroundColor: "#E6E6FA", textAlign:'center'}}>
                        <br></br><br></br>
                        <img style={{marginBottom: "-350px",marginLeft:'75px'}} src={logo}/>
                    </div>
                    <div style={{
                        height: "175px",
                        width: "400px",
                        marginTop: "-175px",
                        marginLeft: "120px",
                        backgroundColor: "#E6E6FA",
                        textAlign:'center'
                    }}>
                        <div style={{marginLeft: "10px"}}>
                            <br></br><br></br>
                            <label style={{fontSize: "14px"}}>xyz Engineering & Consultancy Ltd.</label><br/>
                            <label style={{fontSize: "12px"}}>The Company address will be there</label><br/>
                            <label style={{fontSize: "12px"}}>Company Number: 12025947</label><br/>
                            <label style={{fontSize: "12px"}}>Tel: 07464 112233</label><br/>
                            <label style={{fontSize: "12px"}}>Email: xyz@xyz.co.uk</label><br/>
                        </div>
                    </div>
                    <div style={{
                        width: "160px",
                        height: "175px",
                        marginTop: "-175px",
                        marginLeft: "400px",
                        backgroundColor: "#E6E6FA"
                    }}>
                    </div>
                </div>
                <div style={{height: "651px", backgroundColor: "#FFFFFF"}}>
                    <div style={{height: "149px", backgroundColor: "#FFFFFF"}}>
                        <div style={{marginLeft: "25px"}}>
                            <label style={{fontWeight: "bold"}}>BILL TO</label><br></br><br></br>
                            <label>xyz Restaurants Limited</label><br></br>
                            <label>the restaurants address will be there</label><br></br>
                        </div>
                    </div>
                    <div style={{marginLeft: "300px", marginTop: "-150px", marginRight: "30px", fontSize: "10px"}}>
                        <label style={{fontSize: "24px"}}>Invoice</label><br/>
                        <label style={{fontSize: "14px", fontWeight: "bold"}}> Invoice Date: 28.05.2020</label><br></br>
                        <label style={{marginRight: "50px", fontSize: "14px", fontWeight: "bold"}}>Invoice number:2020052801</label><br></br>
                        <label style={{marginRight: "50px", fontSize: "14px", fontWeight: "bold"}}>Invoice Due:2020052801</label><br></br>

                        <br></br>
                    </div>
                    <div style={{minHeight: "249px", backgroundColor: "#FFFFFF"}}>

                        <TableContainer component={Paper}>
                            <Table className={classes.table} size={"small"} aria-label="a dense table">
                                <TableHead style={{backgroundColor: "#191970"}}>
                                    <TableRow>
                                        <TableCell style={{
                                            width: "400px",
                                            fontSize: "10px",
                                            color: "#FFFFFF"
                                        }}>DESCRIPTION</TableCell>
                                        <TableCell style={{width: "120px", fontSize: "10px", color: "#FFFFFF"}}
                                                   align="right">QTY</TableCell>
                                        <TableCell style={{width: "120px", fontSize: "10px", color: "#FFFFFF"}}
                                                   align="right">UNIT PRICE</TableCell>
                                        <TableCell style={{width: "140px", fontSize: "10px", color: "#FFFFFF"}}
                                                   align="right">TOTAL AMOUNT</TableCell>
                                        {/*<TableCell style={{width: "140px", fontSize: "10px", color: "#FFFFFF"}}*/}
                                        {/*           align="right">VAT</TableCell>*/}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.calories}</TableCell>
                                            <TableCell align="right">{row.fat}</TableCell>
                                            <TableCell align="right">{row.carbs}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                    <div style={{height: "176px", backgroundColor: "#FFFFFF"}}>
                        <div style={{height: "176px", width: "300px", backgroundColor: "#FFFFFF"}}>
                            <div>
                                <div style={{marginLeft: "75px", fontSize: "15px"}}>
                                    <label>Remarks / Payment Instructions:</label>
                                </div>
                                <div style={{marginLeft: "10px", borderColor: "black", border: "solid"}}>
                                    <label style={{fontWeight: "bold", fontSize: "12px"}}>Bank Account Details</label>
                                    <br></br><br></br>
                                    <label style={{fontSize: "12px"}}>XYZ ENGINEERING AND CONSULTANCY
                                        LTD.</label><br></br>
                                    <div>
                                        <label style={{fontSize: "10px"}}>Account No</label><br></br>
                                        <label style={{fontSize: "10px"}}>Sort Code</label><br/>
                                        <label style={{fontSize: "10px"}}>IBAN</label>
                                    </div>
                                    <div style={{marginLeft: "100px", marginTop: "-57px"}}>
                                        <label style={{fontSize: "10px"}}>: 85092264</label><br></br>
                                        <label style={{fontSize: "10px"}}>: 40-38-04</label><br/>
                                        <label style={{fontSize: "10px"}}>: GB1234567890</label>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div style={{marginLeft: "280px", marginTop: "-176px"}}>
                            {/*<label style={{marginLeft: "90px", fontWeight: "bolder"}}>VAT</label><br></br>*/}

                            <label style={{marginLeft: "88px", fontWeight: "bolder"}}>TOTAL</label><br></br>

                            <div style={{
                                marginTop: "-40px",
                                marginRight: "30px",
                                textAlign: "right",
                                fontWeight: "bolder"
                            }}>
                                {/*<label style={{color: "red"}}>£0.00</label><br></br>*/}
                                <label style={{
                                    height: "40px",
                                    fontWeight: "bolder",
                                    fontSize: "16px",
                                    backgroundColor: "#ADD8E6"
                                }}>£13,272.80</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{height: "16px", backgroundColor: "blue"}}></div>
            </div>
        );
}
export default Invoices;