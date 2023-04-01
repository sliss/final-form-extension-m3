document.addEventListener("DOMContentLoaded", () => {
  const triggerButton = document.getElementById("triggerButton");
  const emoModeCheckbox = document.getElementById("emo-mode");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    triggerButton.addEventListener("click", () => {
      chrome.tabs.sendMessage(activeTab.id, { 
        triggered: true,
        emoModeEnabled: emoModeCheckbox.checked 
      }, function (response){
        console.log('button was triggered.');
      });
    });
  });
});
