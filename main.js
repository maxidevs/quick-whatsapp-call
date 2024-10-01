runSelectCountries();
eventPhoneInput();


function getCountries() {
  return new Promise((resolve, reject) => {
    fetch("/data/CountryCodes.json")
      .then(Response => Response.json())
      .then(data => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
  });
}

async function runSelectCountries() {
  const SELECT_COUNTRY = document.getElementById("SELECT_COUNTRY_CODE");
  const setCountries = (countries) => {
    for (let country of countries) {
      const option = document.createElement("option");
      const country_code = country.dial_code.replace("+", "");
      option.value = country_code;
      option.innerText = `(${country.dial_code}) - ${country.name}`;
      if (country_code === '57') {
        option.selected = true;
      }
      SELECT_COUNTRY.appendChild(option);
    }
  }
  const country_codes = await getCountries();
  setCountries(country_codes);
  return;
}

function preventStrings(input, evt) {
  //If enter
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
  const select_country_code = document.getElementById('SELECT_COUNTRY_CODE');
  const submitter = document.getElementById('submitter');
  const form = document.getElementById('form');
  const restoreForm = () => {
    form.setAttribute('action', '//wa.me/');
    submitter.disabled = true;
  }
  const parseTextParam = () => {
    let text = input_message.value;
    if (text.length > 0) {
      text = encodeURIComponent(text);
      //set value 
      input_message.value = text;
    }
    return;
  }
  //set focus on input
  input_phone.focus();
  /* Event Phone Input */
  input_phone.addEventListener('input', (e) => {
    /* Detect delete */
    const is_deleting = e.inputType == "deleteContentBackward" || e.inputType == "deleteContentForward";
    const is_pasting = e.inputType == "insertFromPaste";
    const is_autocompleting = e.inputType == null;
    if (is_deleting) {
      restoreForm();
      return;
    }
    /* Get the 10 first digits */
    const clean_value = e.target.value.replace(/\D/g, '');
    let numbers = clean_value.slice(0, 10);
    //var phone = numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2 $3');
    e.target.value = numbers;
    if (numbers.length == 10) {
      let action_url = form.getAttribute('action');
      let country_code = select_country_code.value;
      let full_number = String(country_code) + String(numbers);
      //add country code and phone number
      action_url = action_url + full_number;
      form.setAttribute('action', action_url);
      submitter.disabled = false;
    } else {
      restoreForm();
    }
  });
}
