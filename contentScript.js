// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.
const API_ENDPOINT = 'http://localhost:3000/api';

console.log(
  "This prints to the console of the page (injected only if the page url matched)"
);

// // start targeting the current URL's firm
// const currentUrl = window.location.href;
// console.log(`researching firm at ${currentUrl}`);

// const targetResponse = await fetch(`${API_ENDPOINT}/target`, {
//   method: 'POST',
//   body: JSON.stringify({ url: currentUrl }),
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// const targetPartner = await targetResponse.json();


let emoModeEnabled = false;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("messaged received", request);
  if (request.emoModeEnabled) {
    console.log('EMO MODE ENABLED 😊 😊 😊 ');
    emoModeEnabled = true;
  }
  console.log("the popup button was triggered");

  // add complete buttons.
  addCompleteButtons();

  sendResponse({ message: "trigger-success" });
 
});

function findLabelContainingElement(labelList, element) {
  for (let i = 0; i < labelList.length; i++) {
    const label = labelList[i];
    if (label.getAttribute("for") === element.id) {
      return label.textContent;
    }
  }
  return null;
}

function addCompleteButtons() {
  console.log("addCompleteButtons");
  // Get all <input> and <textarea> elements on the page
  const inputElems = document.querySelectorAll("input, textarea");
  const labelElems = document.querySelectorAll("label");

  // Loop through each element and add a "Complete" button after it
  inputElems.forEach((elem) => {
    // gets text for the associated label
    const labelText = findLabelContainingElement(labelElems, elem);
    const completeButton = document.createElement("button");
    completeButton.textContent = "✨Complete";
    completeButton.className = "ff-complete-button";

    let inputVal = elem.value;

    completeButton.addEventListener("click", async (e) => {
      e.preventDefault();

      console.log(elem.id, labelText, elem);
      completeButton.innerHTML = "Thinking...";
      try {
        console.log(`get answers. emo-mode?: ${emoModeEnabled}`);
        const response = await fetch(`${API_ENDPOINT}/search`, {
          method: "POST",
          // mode: 'no-cors',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            labelText
            // emoModeEnabled: emoModeEnabled
          }),
        });

        
        console.log('response', response);
        const data = await response.json(); // Save the data returned by the post request in a variable
        completeButton.innerHTML = "😊 Done";

        console.log("data", data);
        const answerText = data.answer;
        console.log("answer text", answerText);

        // Save the input value before setting it to the new value
        setInputValue(elem, answerText);
        // prevents clearing the input if you click inside it
        elem.addEventListener('focus', (event) => {
          event.stopImmediatePropagation();
        }, true); // Using the capture phase to handle the event before the original listener.

        // add explanation
        // const explanationDiv = document.createElement("div"); // Create a new <div> element to display the message
        // explanationDiv.className = "ff-explanation"; // Set the class of the div to "message"
        // explanationDiv.textContent = data.version;
        // elem.insertAdjacentElement("beforebegin", explanationDiv);
        // elem.insertAdjacentHTML("beforebegin", "<br>"); //spacing

      } catch (error) {
        console.log(error);
      }
    });

    // Set the input value back to its previous value when the user clicks on another "Complete" button
    elem.addEventListener("focus", () => {
      elem.value = inputVal;
    });

    elem.insertAdjacentElement("afterend", completeButton);
  });
}

function setInputValue(input, value) {
  const event = new InputEvent('input', { bubbles: true, cancelable: true });
  input.value = value;
  input.dispatchEvent(event);
}