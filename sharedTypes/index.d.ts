type Client = {
  id: string,
  messageLog: string[],
  name: string
}

type JoiningMessage = {
  method: "Joining",
  payLoad: Client
}

type TextMessage = {
  method: "TextMessage",
  payLoad: string,
  name: Client['name']
}

type MessageFormat = JoiningMessage | TextMessage