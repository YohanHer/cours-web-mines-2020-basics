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
  let pageIndex = 0;
  let hasMessages = true;
  let messages = [];

  // GET https://ensmn.herokuapp.com/messages
  while (hasMessages) {
    // eslint-disable-next-line
    const pageMessages = await ky
      .get(`https://ensmn.herokuapp.com/messages?page=${pageIndex}`)
      .json();
    hasMessages = pageMessages.length > 0;
    pageIndex += 1;
    messages = messages.concat(pageMessages);
  }

  displayMessages(messages);
}

refreshMessages();

setInterval(() => {
  refreshMessages();
}, 1000);

function sendMessage(message) {
  // POST https://ensmn.herokuapp.com/messages (username, message)
  ky.post("https://ensmn.herokuapp.com/messages", { json: message });
  // After success, getMessages()
  refreshMessages();

  $("#message").val("");
}

$("body").on("submit", "#message-form", (event) => {
  event.preventDefault();
  const $form = $("#message-form");
  const data = $form.serializeArray();
  const messageData = {};
  data.forEach(({ name, value }) => {
    messageData[name] = value;
  });

  if (
    messageData.username == null ||
    messageData.username.length === 0 ||
    messageData.message == null ||
    messageData.message === 0
  ) {
    return;
  }
  sendMessage(messageData);
});
