//Whatsapp API:
//https://wa.me/?phone=XXXXXXXXXXXX&text=urlencodedtext
//Example: https://wa.me/?phone=573017470755&text=I'm%20inquiring%20about%20the%20apartment%20listing`

const IPINFO_TOKEN = '67782fed0e2fc9';

const form = document.getElementById('form');
const submitter = document.getElementById('submitter');
const country_code = document.getElementById('SELECT_COUNTRY_CODE_INPUT');
form.addEventListener( 'submit', newSubmit ); //adds the listener
const input_phone = document.getElementById('INPUT_PHONE');

runSelectCountries();

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

function preventStrings(input, e) { //this listens to the keypress event.
  //fires before character is added. Cancellable, repeated if held. Data focused on key pressed 
  if (e.which == 13) {  //enter
    return;
  }
  if (e.which < 48 || e.which > 57) {
    e.preventDefault();  //non-digits
  }
  if (input.value.length>=10){
    e.preventDefault();  //after 10 chars (digits)
  }
}

function handleInput(input, e) {  //this listens to the input event. More general. reads more than keys
  //Fires after input is updated, can access to the updated input value. Allows real-time formatting
  let is_deleting="";
  input.id== "INPUT_PHONE"? is_deleting = e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward" 
  : is_deleting=false;
  console.log(is_deleting);
  if (is_deleting){
    //important since everytime 10d, number is added to actionURL
    form.setAttribute('action', '//wa.me/');
    submitter.disabled = true;
    if (input_phone.value.length>=10) {
      input_phone.value = input_phone.value.replace(/\D/g, '');
      input_phone.value = input_phone.value.slice(-9);
    }
    return;
  }
  if (input.value.length >= 10 && country_code.value) {
    submitter.disabled = false;  //enabling button (after 10th char is updated)
  } 
  
  const clean_value = input_phone.value.replace(/\D/g, ''); //replaces all non-digits for ""
  let numbers = clean_value.slice(-10);  // Get the last 10 digits
  console.log(`Input ${input.id} length: ${input.value.length}. numbers: ${numbers}`)
  let formatted_phone = numbers.replace(/(\d{3})(\d{3})(\d{4})/, `(+${country_code.value}) $1 $2 $3`);
  input_phone.value = formatted_phone;    //updates the status of the input
  if (numbers.length >= 10 && country_code.value) {
    const message = document.getElementById("INPUT_TEXT").value.trim();
    let full_number = String(country_code.value) + String(numbers);
    const baseURL = `https://wa.me/${full_number}`;
    const action_url = message ? `${baseURL}?text=${encodeURIComponent(message)}` : baseURL;
    console.log("URL is being updated to " + action_url);
    form.setAttribute('action', action_url);
  } else {
    form.setAttribute('action', '//wa.me/');
    submitter.disabled = true;
    return;
  }
}

function newSubmit(e){    //when finally submitted
  e.preventDefault();

  const submitArea = document.querySelector(".button-container");
  submitArea.setAttribute('aria-busy', 'true'); //custom property aria-busy
  submitter.disabled= true;

  setTimeout( ()=>{
    window.location.href = url; //changes the current window to the full URL
  }, 1000 );
  const url = form.getAttribute('action');
  window.open(url);
}