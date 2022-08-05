let currency_symbol = "₺";
const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
});

export const numberFormat = (n: number) => {
    return formatter.format(n).replace(currency_symbol, '')
};

export const numberFormatWithTL = (n: number) => {
    return formatter.format(n)
};
export const numberFormatWithStrTL = (n: string) => {
    return formatter.format(Number(n))
};
export const formatNumber = (n: number) => {
    let formetedNumber = (Number(n)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let splitArray = formetedNumber.split(',');
    if (splitArray.length > 1) {
        formetedNumber = splitArray[0];
    }
    return (formetedNumber);
};

export const calculateTotalTax = function (items: any, prop: any, price: number) {//array objedeki tüm vergi oranları hesaplama
    return price - items.reduce(function (sum: number, b: any) {
        return sum - taxAmount(sum, b[prop]);
    }, price);
};
export const calculateTotalTaxRatio = function (items: any, prop: any, price: number) {
    let total = items.reduce(function (sum: number, b: any) {
        return sum - taxAmount(sum, b[prop]);
    }, price);
    return discountRatio(price, (price - total));
};
export const taxAmount = function (price: number, ratio: number) { //100'nin %18'i => 15,25 TL eder
    return (price - (price / ((Number(100) + Number(ratio)) / 100)));
};
export const taxRatio = function (price: number, ratio: number) { //800'nin %18'i => 84,74 TL eder
    return (price / (((Number(100) + Number(ratio))) / 100));
};
export const discountPrice = function (price: number, discount: number) { //500'nin %10 indirimi 450 eder
    return (Number(price) - ((Number(price) / Number(100)) * Number(discount)));
};
export const discountAmount = function (price: number, discount: number) { //500'nin %10'i => 50 TL eder
    return ((Number(price) / Number(100)) * Number(discount));
};
export const discountRatio = function (price: number, discount: number) { //500'ün 50 si % 10  eder
    return ((Number(discount) * Number(100)) / price);
};

export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max));
}
/**
 * Absolute Url
 * @param pathname
 */
export const toAbsoluteUrl = (pathname: string) =>
    process.env.PUBLIC_URL + pathname;

/**
 * Normalize Phone Number
 * @param payload
 */
export const normalizePhoneNumber = (payload: string) => {
    //normalize string and remove all unnecessary characters
    payload = payload.replace(/[^\d]/g, "");

    //check if number length equals to 10
    if (payload.length === 10) {
        //reformat and return phone number
        return payload.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    }

    return null;
};

export function isValidErrorResponse(err: any): boolean {
    return err.response && err.response.data && err.response.data.message
}

export function readFile(file:any) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }
export function blobToFile(theBlob:any, fileName:string){       
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
}

export function blobToImageFile(theBlob:any, fileName:string){       
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type})
}

export function stringToBlob(binaryData:any){    
    var characters = atob(binaryData);

    var arrayBufferView = new Uint8Array(characters.length ); 
	 for (var i = 0; i < characters.length; i++) {
	 arrayBufferView[i] = characters.charCodeAt(i);
     }
    return new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
 }