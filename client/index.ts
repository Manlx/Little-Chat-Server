import { EmptyInputs, FillTestData, FillWithMessage } from "./testDataUtils.js"

console.log('nice!')

const ConnectButton: HTMLButtonElement = document.getElementById("ConnectButton") as HTMLButtonElement
const SendMessageButton: HTMLButtonElement = document.getElementById("SendMessageButton") as HTMLButtonElement

const SendMessageInput: HTMLInputElement = document.getElementById("SendMessageInput") as HTMLInputElement
const ConnectNameInput: HTMLInputElement = document.getElementById("ConnectNameInput") as HTMLInputElement

const AutoFillCheckBox: HTMLInputElement = document.getElementById("AutoFillCheckBox") as HTMLInputElement

const MessageDisplay: HTMLTextAreaElement = document.getElementById("MessageDisplay") as HTMLTextAreaElement

AutoFillCheckBox.addEventListener('change',() => {

  if (AutoFillCheckBox.checked) {

    FillTestData(ConnectNameInput,SendMessageInput)
  }
  else {

    EmptyInputs([ConnectNameInput, SendMessageInput])
  }
})

let wsClient: WebSocket | null = null;

let client: Client | null = null;

SendMessageButton.addEventListener('click', ()=>{

  const message: TextMessage = {
    method: 'TextMessage',
    payLoad: SendMessageInput.value,
    name: client?.name || "Unkown User"
  };

  MessageDisplay.value = `${MessageDisplay.value}\n${client?.name}: ${message.payLoad}`

  wsClient?.send(JSON.stringify(message))

  if (AutoFillCheckBox.checked) {

    FillWithMessage(SendMessageInput)
  }
})

ConnectButton.addEventListener('click', ()=>{

  wsClient = new WebSocket('ws://localhost:5000');

  wsClient.onopen = function() {

    client = {
      id: Date.now().toString(),
      messageLog: [],
      name: ConnectNameInput.value || "Unknown User"
    }

    const JoiningMessage: JoiningMessage = {
      method: "Joining",
      payLoad: client
    }

    MessageDisplay.value = `${MessageDisplay.value}\n${client.name} joining...`
  
    this.onmessage = async function (this: WebSocket, ev: MessageEvent<Blob>) {

      console.log(ev.data)
  
      const message: MessageFormat = typeof ev.data === "string" ? JSON.parse(ev.data) : JSON.parse(await ev.data.text())
    
      if (message.method === 'Joining') {
    
        MessageDisplay.value = `${MessageDisplay.value}\n${message.payLoad.name} joined`

        return;
      }

      if (message.method === 'TextMessage') {
    
        MessageDisplay.value = `${MessageDisplay.value}\n${message.name}: ${message.payLoad}`

        return;
      }
    }
  
    this.send(JSON.stringify(JoiningMessage))
  }

})