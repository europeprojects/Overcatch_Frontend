import React, {useEffect, useMemo, useState} from 'react';
import {Document, Image, Page, PDFViewer, StyleSheet, Text, View} from '@react-pdf/renderer';
import {Node} from "slate";


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
        color: 'grey'
    },

});

export type PdfComponentProps = {
    selectedValue: any
}

function PdfComponent({selectedValue}: PdfComponentProps) {
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

    const [value, setValue] = useState<Node[]>(SampleInitialValue);
    // let [value2, setValue2] = useState<Node[]>(value);
    // const [dynamicFields, setDynamicFields] = useState<Node[]>(SampleInitialValue);




    // useEffect(() => {
    //     //@ts-ignore
    //     value.map((ch)=>ch.children.map((cc)=> {
    //         if (cc.code==true && invitedForm[cc.text])
    //         {
    //             //@ts-ignore
    //             let [state1, dispatch1] = ch;
    //             let [state2, dispatch2] = cc;
    //             //@ts-ignore
    //             dispatch2({
    //                 ...state1, ['text']: ("asdasd")
    //              });
    //             console.log(ch)
    //             console.log(state1)
    //             dispatch1({
    //                 ...state2, ['children']: [...state2,cc]
    //             });
    //             console.log(state2)
    //         }}) )
    // }, [invitedForm])

    // useEffect(() => {
    //     if (selectedValue === "0") {
    //         setValue(JSON.parse(localStorage.getItem('sample')));
    //     } else if (selectedValue === "10") {
    //         setValue(JSON.parse(localStorage.getItem('militaryservice')));
    //     } else if (selectedValue === "20") {
    //         setValue(JSON.parse(localStorage.getItem('Nıno')));
    //     } else if (selectedValue === "30") {
    //         setValue(JSON.parse(localStorage.getItem('AccountantLetter')));
    //     } else if (selectedValue === "40") {
    //         setValue(JSON.parse(localStorage.getItem('RentReference')));
    //     } else if (selectedValue === "50") {
    //         setValue(JSON.parse(localStorage.getItem('SchengenVisa')));
    //     } else if (selectedValue === "60") {
    //         setValue(JSON.parse(localStorage.getItem('FamilyFriendInvitation')));
    //     } else if (selectedValue === "70") {
    //         setValue(JSON.parse(localStorage.getItem('HMRC')));
    //     } else if (selectedValue === "80") {
    //         setValue(JSON.parse(localStorage.getItem('BankRef')));
    //     } else if (selectedValue === "90") {
    //         setValue(JSON.parse(localStorage.getItem('Clearance')));
    //     }
    // }, [selectedValue]);

// useEffect(() => {
//
//     localStorage.setItem('sample', window.btoa(JSON.stringify(value)));
//
//     }, [selectedValue]);

    const [text, setText] = useState([])
    const letter = [
        {
            type: styles.text1,
            text: '06th July 2020',
        },
        {
            type: styles.header,
            text: 'Our Ref: S220-D',
        },
        {
            type: styles.text2,
            text: 'For The Attention of Turkish Consulate, \n' + '\n' +
              'Rutland Lodge, \n' +
              'Rutland Gardens \n' +
              'Knightsbridge\n' +
              'London \n' +
              'SW7 1BW \n' + '\n' +
              'Dear Sirs,'

        },
        {
            type: styles.text3,
            text: 'RE: Mr SEMIH KIR D.O.B 28/04/1995 \n' + '\n' +
              'We are writing to confirm that Mr SEMIH KIR registered at 4A ROMBALD\'S STREET, LEEDS, LS12 2BG is our client. Mr KIR is director of SMH FITNESS LIMITED and commenced trading on 10th December 2019, we assist him to prepare his financial accounts and file his tax return to HM Revenue and Customs (HMRC). \n' +
              'Further we can confirm that SMH FITNESS LIMITED is using our address as a company registered address.\n' +
              'In our opinion, he has the ability to support the commitments he is responsible for and also consider him to be good, respectable and reasonable person who will be suitable to carry out the obligations expected of him. \n' +
              '\n' +
              'Please do not hesitate to contact us if you need any further information or explanations. \n' +
              '\n' +
              '\n' +
              'Yours faithfully, \n' +
              '\n' +
              'Right Accounting Ltd \n' +
              'Gulay Akbas'


        },

    ]

//     useEffect(()=>{
// setValue(
//     //@ts-ignore
//     value.map((ch)=>ch.children.map((cc)=>cc.code ? invitedForm[cc.text]:cc.text)))
//     },[value])

//     function updateValue() {
// // //@ts-ignore
// //         value.map((ch)=>ch.children.map((cc)=> {
// //             if (cc.code=true && i
// //             )
// //             {
// //                 //@ts-ignore
// //                 value.map((ch)=>ch.children.map((cc)=>cc.text = invitedForm[cc.text]))
// //             }
// //         }))
// //
// //     }
    // const letter = [
    //     {
    //         type: styles.header,
    //         children: [
    //             { text: 'This is editable ' },
    //             { text: 'rich', bold: true },
    //             { text: ' text, ' },
    //             { text: 'much', italic: true },
    //             { text: ' better than a ' },
    //             { text: '<textarea>', code: true },
    //             { text: '!' },
    //         ],
    //     },
    //     {
    //         type: styles.text1,
    //         children: [
    //             {
    //                 text:
    //                     "Since it's rich text, you can do things like turn a selection of text ",
    //             },
    //             { text: 'bold', bold: true },
    //             {
    //                 text:
    //                     ', or add a semantically rendered block quote in the middle of the page, like this:',
    //             },
    //         ],
    //     },
    //     {
    //         type: styles.text2,
    //         children: [{ text: 'A wise quote.' }],
    //     },
    //     {
    //         type: styles.text3,
    //         children: [{ text: 'Try it out for yourself!' }],
    //     },
    // ]
    //
    // useEffect(()=>{
    //     // valueChanger()
    //     console.log(value)
    //     //@ts-ignore
    //
    // },[invitedForm],)

//     function valueChanger(){
//         console.log(invitedForm["invitedName"])
//         //@ts-ignore
//         // value?.find(value1 => this.code === true && this.text === invitedForm[this.text])
//         // value?.map((ch)=>ch.children.map((cc)=>cc.code == true && cc.text==invitedForm[cc.text] ? (cc.text=invitedForm[cc.text]) && (console.log([invitedForm[cc.text]])) : cc.text))
// //@ts-ignore
//
//     }

    useEffect(()=>{
        if (selectedValue){
            setValue(selectedValue)
        }
        else {
            setValue(SampleInitialValue)
        }
    },[selectedValue])

    //Burda value değiştiğinde tekrar render edemeyip hata verdiği için use memo kullandım. Alternatif çözüm bakılacak
    // return useMemo(()=> (
    //     <PDFViewer className={"flex w-full h-full"}>
    //         <Document>
    //             <Page object-fit="fill" style={styles.page} size="A4">
    //
    //                 {/*<Image fixed src="/assets/images/pdf/image1.png"/>*/}
    //                 <View object-fit style={styles.view}>
    //                     {value?.map((ch) => <Text style={styles.text2}>{
    //
    //                             //@ts-ignore
    //                             ch.children.map((cc) => (
    //                                 <Text
    //                                     style={styles.text3}> {
    //                                     cc.text
    //                                 }
    //                                     {/*            <span style={{whiteSpace: "pre-line"}}>*/}
    //                                     {/*{cc.split("").join("\n")}*/}
    //                                     {/*</span>*/}
    //                                 </Text>
    //
    //                             ))
    //                         }
    //                         </Text>
    //                     )}
    //
    //                 </View>
    //             </Page>
    //         </Document>
    //     </PDFViewer>
    // ), [value])

    return (
      <PDFViewer className={"flex w-full h-full"}>
          <Document>
              <Page object-fit="fill" style={styles.pageNumber} size="A4">

                  {/*<Image fixed src="/assets/images/pdf/image1.png"/>*/}
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
    )


}

export default PdfComponent;


