const userNameArr = [
  "Jacob",
  "Stye",
  "Jalion",
  "Pietter",
  "Boeta",
  "Danco"
] as const;

const messageArr = [
  "Anyone doing meth?",
  "cheers",
  "Dc?",
  "Dinner if you want?",
  "Gaming Gamers",
  "going to head to bed soon bro. play HHL tomorrow?",
  "Hello world",
  "Hi friends",
  "High or Low",
  "lekker",
  "mine?",
  "ok",
  "Pizza or Pies",
  "Sadge",
  "so so",
  "sure",
  "which",
  "will join soon just in a heavy match",
  "yes",
  "you playing comp?",
  "you playing hell let loose?",
  "you ready?",
]

export function FillTestData(userName: HTMLInputElement, messageInput:HTMLInputElement) {

  userName.value = userNameArr[Math.floor(userNameArr.length * Math.random()) ]
  messageInput.value = messageArr[Math.floor(messageArr.length * Math.random())]
}

export function FillWithMessage(messageInput:HTMLInputElement) {
  
  messageInput.value = messageArr[Math.floor(messageArr.length * Math.random())]
}

export function EmptyInputs(Inputs: HTMLInputElement[]) {

  Inputs.forEach(input => {

    input.value = ''
  })
}