
document.addEventListener('DOMContentLoaded', function() {
const mainForm = document.querySelector('#mainForm');
const popupForm = document.querySelector('#popupForm');
popupForm.innerHTML = mainForm.innerHTML;

[mainForm, popupForm].forEach(form => {
   form.addEventListener('submit', handleSubmit);
});
});

let isSubmitting = false;

async function handleSubmit(event) {
event.preventDefault();

if (isSubmitting) return;
if (!validateMobileNumber(this)) return;

isSubmitting = true;
const submitBtn = this.querySelector('input[type="submit"]');
const originalText = submitBtn.value;
submitBtn.value = 'Submitting...';
submitBtn.disabled = true;

const formData = new FormData(this);
formData.append('Date', new Date().toLocaleString());

const scriptURL = 'https://script.google.com/macros/s/AKfycbwZoNwEEs5snqzSwsP2hcvZ-wysExawgyv7QKIfABOYtt4FlODZnDGVxhw2jz_dX7f9/exec';

try {
   const response = await fetch(scriptURL, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: new URLSearchParams(formData).toString()
   });

   if (response.ok) {
       this.reset();
       if (this.id === 'popupForm') {
           closePopup();
       }
       showThankYouMessage(this);
   } else {
       throw new Error('Network response was not ok.');
   }
} catch (error) {
   console.error('Error!', error.message);
   alert('Error submitting form. Please try again.');
} finally {
   isSubmitting = false;
   submitBtn.value = originalText;
   submitBtn.disabled = false;
}
}

function showThankYouMessage(form) {
const thankYouDiv = document.createElement('div');
thankYouDiv.style.cssText = `
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   background: white;
   padding: 20px;
   border-radius: 8px;
   box-shadow: 0 2px 10px rgba(0,0,0,0.1);
   text-align: center;
   z-index: 1001;
`;
thankYouDiv.innerHTML = `
   <h3 style="color: #c41e3a; margin-bottom: 15px;">Thank You!</h3>
   <p>Your form has been submitted successfully.</p>
   <p>We will contact you shortly.</p>
   <button onclick="this.parentElement.remove()" 
           style="margin-top: 15px; padding: 8px 20px; background: #c41e3a; 
                  color: white; border: none; border-radius: 4px; cursor: pointer;">
       Close
   </button>
`;
document.body.appendChild(thankYouDiv);
}

// Rest of the functions remain the same
function validateMobileNumber(form) {
const mobileInput = form.querySelector('[name="Mobile Number"]');
const mobileError = form.querySelector('#mobileError');
const mobileNumber = mobileInput.value.trim();

if (!/^\d{10}$/.test(mobileNumber)) {
   mobileError.textContent = 'Please enter a valid 10-digit mobile number';
   return false;
}

mobileError.textContent = '';
return true;
}

function openPopup() {
document.getElementById('popupContainer').style.display = 'flex';
}

function closePopup() {
document.getElementById('popupContainer').style.display = 'none';
}

setTimeout(openPopup, 5000);
