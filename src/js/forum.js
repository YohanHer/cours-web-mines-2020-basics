import ky from "ky";
import $ from "jquery";

function getMessageView(message) {
  return `<div class="card my-3">
  <div class="card-body">
      <p class="card-text">${message.content}</p>
  </div>
  <div class="card-footer text-muted text-right msg-origin">
      By ${message.author}, ${message.timestamp}
  </div>
</div>`;
}

function displayMessages(messages) {
  const $messageContainer = $("#card-container");
  // Clear list content on view
  $messageContainer.empty();
  // Iterate on messages and display getMessageView(message);
  $messageContainer.append(messages.map((message) => getMessageView(message)));
}

async function refreshMessages() {
  // GET https://ensmn.herokuapp.com/messages
  const messages = await ky.get("https://ensmn.herokuapp.com/messages").json();
  displayMessages(messages);
}

refreshMessages();

//  setInterval(() => {
//  refreshMessages();
//  }, 1000);

//  function sendMessage(message) {
// POST https://ensmn.herokuapp.com/messages (username, message)
// After success, getMessages()
//  }
