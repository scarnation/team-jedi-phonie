import startApp from './app.mjs';

document.addEventListener('DOMContentLoaded', startApp);

//opening and closing the side navbar on smaller screen sizes
let bar = document.querySelector('.bx-menu')
let exit = document.querySelector('.bx-x')
let menu = document.querySelector('ul')

bar.addEventListener('click', () => {

  menu.style.transform = 'translateX(0%)'

})

exit.addEventListener('click', () => {
  menu.style.transform = 'translateX(100%)'
})

//adding color to the input field once it is filled 
let inputField = document.querySelectorAll('input')

inputField.forEach(input => {
  input.addEventListener('keyup', (e) => {

    if (input.value !== "") {
      input.style.backgroundColor = '#FAF5F3'
    }
    else {
      input.style.backgroundColor = '#fff'
    }
  })
})

// Changing network operators when alternating between Nigeria and Kenya

let kenyanOperators = document.querySelectorAll('.radio.kenya')
let nigerianOperators = document.querySelectorAll('.radio.nigeria')
let select = document.querySelector('select')



select.addEventListener('click', ()=>{
    
    if(select.value == 'Kenya'){
        
   kenyanOperators.forEach(item=>{
       item.style.display = 'flex'
   })

   
   nigerianOperators.forEach(item=>{
       item.style.display = 'none'
     
   })
   
}

if(select.value == 'Nigeria'){

    kenyanOperators.forEach(item=>{
       item.style.display = 'none'
      
   })
   //i sent a whatsapp msg to u 
  //lemme check it out
   nigerianOperators.forEach(item=>{
       item.style.display = 'flex'
   })
    
}

})


//Main phonie functionality
let phoneInput = document.getElementById("phoneInput");

//Regex pattern for major Nigerian Network providers
let nigeriaCarrierPattern = {
  mtn: "(((^0)|((^\\+)(234){1}0?)|((^234)0?))(7(0)(3|6)|8(0(3|6)|1(0|3|4|6))|9(0(3|6)|1(3)))\\d{7})",
  
  glo: "(((^0)|((^\\+)(234){1}0?)|((^234)0?))(7(05)|8(0(5|7)|1(1|5))|9(0|1)5)\\d{7})",
  
  airtel: "(((^0)|((^\\+)(234){1}0?)|((^234)0?))(70(1|2|4|8)|80(2|8)|90(1|2|4|7))\\d{7})",
  
  "9mobile": "(((^0)|((^\\+)(234){1}0?)|((^234)0?))(8(0(9)|1(7|8))|90(8|9))\\d{7})"
}

//store selected carrier
let selectedCarrier = document.querySelector("#selectCarrier");
selectedCarrier.addEventListener('click', knowCarrier);

//stores selected carrier in input data attribute
function knowCarrier(e) {
    let checkedCarrier = e.target.id;
    if (e.target.name !== "carrier") return;

    phoneInput.dataset.selectedPhoneNo = checkedCarrier;

    setPatternAttribute(checkedCarrier);
    if (phoneInput.value !== "") displayCarrier(phoneInput.value);
}

// sets input pattern to the pattern of the selected carrier
function setPatternAttribute(carrier) {
  phoneInput.setAttribute('pattern', nigeriaCarrierPattern[carrier]);
}

phoneInput.addEventListener('input', displayCarrier);

let carrierImg = document.querySelector("#carrier-img");

function displayCarrier() {
    let checkValidity = phoneInput.checkValidity();
    let formattedNo = formatPhoneNo(phoneInput.value);

    validateProcess(formattedNo)
    if (formattedNo.length == 3 && formattedNo.startsWith("0")) {
      displayPrefixesSuggestions(phoneInput.value);
    }
         
    if (checkValidity) {
      carrierImg.src = `images/${phoneInput.dataset.selectedPhoneNo}.svg`;
      carrierImg.style.height = "38px";
    }
    else {
      carrierImg.src = "images/alt.svg";
      carrierImg.style.height = "40px";
    }
}

//formats inputted phone number
function formatPhoneNo(phoneNo) {
    if (phoneNo.startsWith("+2340")) phoneNo = phoneNo.replace("+234", "");
    if (phoneNo.startsWith("2340")) phoneNo = phoneNo.replace("234", "");
    if (phoneNo.startsWith("+234")) phoneNo = phoneNo.replace("+234", "0");
    if (phoneNo.startsWith("234")) phoneNo = phoneNo.replace("234", "0");
    return phoneNo;
}

//stores possible carrier prefixes
let prefixesSuggestions = {
  mtn: ["0703", "0706", "0803", "0806", "0810", "0813", "0814", "0816", "0903", "0906", "0913"],
  glo: ["0705", "0805", "0807", "0811", "0815", "0905", "0915"],
  airtel: ["0701", "0702", "0704", "0708", "0802", "0808", "0901", "0902", "0904", "0904"],
  "9mobile": ["0809", "0817", "0818", "0908", "0909"]
}

function displayPrefixesSuggestions(phoneNo) {
    let selectedCarrier = phoneInput.dataset.selectedPhoneNo;
    if (!prefixesSuggestions[selectedCarrier]) return;
    let dataList = document.querySelector('#suggest-prefixes');
    dataList.replaceChildren();
    for (let value of prefixesSuggestions[selectedCarrier]) {
        if (value.startsWith(phoneNo)) {
          let option = document.createElement('option');
          option.value = value;
          dataList.append(option);
        }     
    }
}

function validateProcess(phoneNo) {
    let selectedCarrier = phoneInput.dataset.selectedPhoneNo;
    if (!selectedCarrier) return;
    let text = document.querySelector('#validate-process');
    if (phoneNo.length <= 3) {
        text.innerText = `No carrier detected yet`;
        return;
    }

    if (phoneInput.checkValidity()) {
      text.innerText = `phone number matches carrier ${selectedCarrier}`;
      return;
    }

    let regexPattern = new RegExp(phoneInput.getAttribute("pattern"));
  
    let testValidity = regexPattern.test(phoneNo.slice(0, 11));
    if (phoneNo.length > 11 && testValidity) {
        text.innerText = `You are on the right track phone number matches ${selectedCarrier} but no of characters exceeded`;
        return;
    }
        
    for (let value of prefixesSuggestions[selectedCarrier]) {
        if (value == phoneNo.slice(0, 4)) {
            text.innerText = `You are on the right track phone number matches the selected carrier ${selectedCarrier}`;
            return;
        }
    }   
    text.innerText = `phone number doesn't matches the selected carrier. You selected ${selectedCarrier}`;

}

//regex kenya equitel: ^(?:254|\+254|0)?(76[34][0-9]{6})$
  
 // safari: ^(?:254|\+254|0)?((?:(?:7(?:(?:[01249][0-9])|(?:5[789])|(?:6[89])))|(?:1(?:[1][0-5])))[0-9]{6})$
  //i saw nwei this time figuring this thing out 
 // airtel: ^(?:254|\+254|0)?((?:(?:7(?:(?:3[0-9])|(?:5[0-6])|(8[5-9])))|(?:1(?:[0][0-2])))[0-9]{6})$
  
//  "telcom/Orange": ^(?:254|\+254|0)?(77[0-6][0-9]{6})$








