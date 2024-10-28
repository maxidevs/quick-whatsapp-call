const IPINFO_TOKEN = '67782fed0e2fc9';

runSelectCountries();
eventPhoneInput();

//Whatsapp API:
//https://wa.me/?phone=XXXXXXXXXXXX&text=urlencodedtext
//Example: https://wa.me/?phone=573017470755&text=I'm%20inquiring%20about%20the%20apartment%20listing`

function geoLocation(){
  return new Promise( (resolve, reject) =>{
    fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`)
      .then( (resp)=> resp.json() )
      .then( (data)=>resolve(data) )  //if Ok, returns object with data.ip and data.country, e.g. "CO"
      .catch( (err)=> reject(err) )
  } )
}

async function geoLocation2(){
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    const data = await response.json();
    return data;
  } catch ( error) {
    console.log(error);
    throw error;
  }
};

function getCountries() {
  return new Promise((resolve, reject) => {
    fetch("./data/CountryCodes.json")
      .then(Response => Response.json())
      .then(data => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
  });
}

async function getCountries2(){
  try {
    const response = await fetch("./data/CountryCodes.json");
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function runSelectCountries() {
  const SELECT_COUNTRY_DATALIST = document.getElementById("SELECT_COUNTRY_CODE");
  const SELECT_COUNTRY_INPUT = document.getElementById("SELECT_COUNTRY_CODE_INPUT");

  const fillCountryList = (countries, currentCountry) => { //names the function to set given countries
    for (let country of countries) {
      const option = document.createElement("option");
      const country_dial_code = country.dial_code.replace("+", "");
      option.value = country_dial_code;  //value of option element
      option.innerText = `(${country.dial_code}) - ${country.name}`;

      if (country.code === currentCountry) {
        SELECT_COUNTRY_INPUT.value = country.dial_code.replace("+", "");  //whatsapp APi does not admit +
      }
      SELECT_COUNTRY_DATALIST.appendChild(option);
    }
  }

  const country_codes = await getCountries2(); //gets the country list
  const currentAccess = await geoLocation2();
  fillCountryList(country_codes, currentAccess.country);  //runs the set countries funct, now giving default country
  return;
}

function preventStrings(input, evt) {
  if (evt.which == 13) {
    return;
  }
  if (evt.which < 48 || evt.which > 57) {
    evt.preventDefault();
  }
}

function eventPhoneInput() {
  const input_phone = document.getElementById('INPUT_PHONE');
  const input_message = document.getElementById('INPUT_TEXT');
  const select_country_code = document.getElementById('SELECT_COUNTRY_CODE_INPUT');
  const submitter = document.getElementById('submitter');
  const form = document.getElementById('form');
  const restoreForm = () => { //important since when 10d, number is added to actionURL
    form.setAttribute('action', '//wa.me/');
    submitter.disabled = true;
  }
  input_phone.focus(); //set focus on input
  // Event Phone Input behavior added
  input_phone.addEventListener('input', (e) => {
    // Detect delete
    const is_deleting = e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward";
    const is_pasting = e.inputType == "insertFromPaste";
    const is_autocompleting = e.inputType == null;
    if (is_deleting) {
      restoreForm();
      return;
    }
    // Get the 10 first digits
    const clean_value = e.target.value.replace(/\D/g, '');
    let numbers = clean_value.slice(0, 10);     //var phone = numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2 $3');
    e.target.value = numbers;
    if (numbers.length == 10) {
      let action_url = form.getAttribute('action');
      let country_code = select_country_code.value;
      let full_number = String(country_code) + String(numbers);
      //add country code and phone number
      action_url += full_number;
      form.setAttribute('action', action_url);
      submitter.disabled = false;
    } else {
      restoreForm();
    }
  });
  form.addEventListener( 'submit', newSubmit );
}

function newSubmit(e){
  e.preventDefault();
  
  const country_codeInput = document.getElementById("SELECT_COUNTRY_CODE_INPUT");
  const numberInput = document.getElementById("INPUT_PHONE");
  const textInput = document.getElementById("INPUT_TEXT");
  const submitter = document.getElementById("submitter");

  const code = country_codeInput.value;
  const number = numberInput.value;
  let url = `https://wa.me/?phone=${code}${number}`;
  const text = textInput.value;

  if (text!==""){
    const urlencodedText = encodeURIComponent(text);
    url += `&text=${urlencodedText}`;
  }

  const submitArea = document.querySelector(".button-container");
  submitArea.setAttribute('aria-busy', 'true'); //custom property aria-busy
  submitter.disabled= true;

  setTimeout( ()=>{
    window.location.href = url; //changes the current window to the full URL
  }, 1500 );
}