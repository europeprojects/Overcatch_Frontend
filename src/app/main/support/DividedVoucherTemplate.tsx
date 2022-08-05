import React, {useEffect} from 'react';
import {
    Grid,TextField
} from "@material-ui/core";


function DividedVoucherTemplate(props) {

    const {helpType , divided, setDivided} = props;

    useEffect(()=>{
        setDivided({...divided, directorId: helpType.divided});
    },[])

    return (
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
                             onChange={(e) =>setDivided({...divided, directorId: helpType?.divided, paymentNumber: e.target.value})}
                             className="my-16 mx-6"
                             name="invitedSurname"
                             label="Payment Number"
                             variant="outlined"
                             value={divided?.paymentNumber}
                             disabled={true}
                        />
                   </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <label>Date Payment Made</label>
                    <div>
                        <TextField
                            type="date"
                            onChange={(e)=>setDivided({...divided, directorId : helpType?.divided, datePaymentRate:e.target.value})}
                            className="my-16 mx-6"
                            name="invitedSurname"
                            label="datePaymentRate"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                max: '3000-01-01',
                                min:'1000-01-01'
                            }}
                            value={divided?.datePaymentRate}
                            disabled={true}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} sm={12}>
                    {helpType?.client?.company?.name}
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
                            onChange={(e)=>setDivided({...divided, directorId : helpType?.divided, shareHolding:e.target.value})}
                            className="my-16 mx-6"
                            name="invitedSurname"
                            label="Share Holding"
                            variant="outlined"
                            value={divided?.shareHolding}
                            disabled={true}
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
                                    setDivided({...divided, directorId : helpType?.divided, amountPayable:e.target.value })
                                }}
                                className="my-16 mx-6"
                                name="invitedSurname"
                                label="Amount Payable"
                                variant="outlined"
                                value={divided?.amountPayable}
                                disabled={true}
                            />
                    </Grid>

                    <Grid item xs={12} sm={12} style={{textAlign:"left",marginLeft : "10%", marginRight : "10%"}}>
                        <label>
                            This cheque is in payment of the Interim dividend<br/>
                            for the year ended :
                            <TextField
                            type="date"
                            onChange={(e)=>setDivided({...divided, directorId : helpType?.divided, dividedEndDate:e.target.value})}
                            className="my-16 mx-6"
                            name="endDateDivided"
                            label="End Date For Dividend"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                max: '3000-01-01',
                                min:'1000-01-01'
                            }}
                            value={divided?.dividedEndDate}
                            disabled={true}
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
                            {helpType?.client?.company?.name}<br/>
                            <label style={{color:"blue"}}>
                                Registered Office Address 17 Greenlanes, London, United Kingdom, N16 9BS
                            </label>
                        </label>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default DividedVoucherTemplate;
