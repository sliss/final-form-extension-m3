document.addEventListener("DOMContentLoaded", () => {
  const triggerButton = document.getElementById("triggerButton");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    triggerButton.addEventListener("click", () => {
      alert('button click');
      chrome.tabs.sendMessage(activeTab.id, "triggered", function (response){
        console.log('button was triggered.');
      });
      // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //   const activeTab = tabs[0];

        
      //   // chrome.scripting.executeScript({
      //   //   target: { tabId: activeTab.id },
      //   //   files: ["contentScript.js"],
      //   // });
      // });
    });
  });
});
