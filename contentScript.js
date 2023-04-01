// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

console.log("This prints to the console of the page (injected only if the page url matched)")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('messaged received', request)
  if (request === 'triggered') {
      console.log('the popup button was triggered');
      
      // add complete buttons.
      addCompleteButtons();

      sendResponse({ message: 'trigger-success' });
  } else if (request.message === 'something_else') {
    // sendResponse({ message: 'success' });
  }
});

function addCompleteButtons() {
  console.log('addCompleteButtons');
  // Get all <input> and <textarea> elements on the page
  const inputElems = document.querySelectorAll('input, textarea');
  console.log('all inputs', inputElems);
  // Loop through each element and add a "Complete" button after it
  inputElems.forEach((elem) => {
    const completeButton = document.createElement('button');
    completeButton.textContent = '✨Complete';
    completeButton.className = 'complete-button';
    elem.insertAdjacentElement('afterend', completeButton);
  });
}


function getDivsWithInputFields() {
  // Get all <div> elements on the page
  const divs = document.getElementsByTagName("div");
  
  // Create an array to store the <div> elements that contain input fields
  const divsWithInputs = [];
  
  // Loop through all <div> elements
  for (let i = 0; i < divs.length; i++) {
    const div = divs[i];
    
    // Check if the <div> contains any input fields
    const inputs = div.getElementsByTagName("input");
    if (inputs.length > 0) {
      divsWithInputs.push(div);
    }
  }
  
  // Return the array of <div> elements that contain input fields
  return divsWithInputs;
}