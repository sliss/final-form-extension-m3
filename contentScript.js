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
    completeButton.className = 'ff-complete-button';

    completeButton.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/api/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ questionText: 'what is your favorite color' })
        });
        
        const data = await response.json(); // Save the data returned by the post request in a variable
        console.log('data', data);
        // const answerText = data.answerText;
        const answerText = data.name;
        console.log('answer text', answerText);
        elem.value = answerText;

        // add explanation
        const explanationDiv = document.createElement('div'); // Create a new <div> element to display the message
        explanationDiv.className = 'ff-explanation'; // Set the class of the div to "message"
        // explanationDiv.value = data.explanation;
        explanationDiv.textContent = data.version;
        elem.insertAdjacentElement('beforebegin', explanationDiv);
        elem.insertAdjacentHTML('beforebegin', '<br>'); //spacing

      } catch (error) {
        console.error(error);
      }
    });

    elem.insertAdjacentElement('afterend', completeButton);
  });
}


// function getDivsWithInputFields() {
//   // Get all <div> elements on the page
//   const divs = document.getElementsByTagName("div");
  
//   // Create an array to store the <div> elements that contain input fields
//   const divsWithInputs = [];
  
//   // Loop through all <div> elements
//   for (let i = 0; i < divs.length; i++) {
//     const div = divs[i];
    
//     // Check if the <div> contains any input fields
//     const inputs = div.getElementsByTagName("input");
//     if (inputs.length > 0) {
//       divsWithInputs.push(div);
//     }
//   }
  
//   // Return the array of <div> elements that contain input fields
//   return divsWithInputs;
// }
