import "./css/index.css"
import IMask, { MaskedNumber } from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

const color = {
  mastercard: ["#C69347", "#DF6F29"],
  visa: ["#2D57F2", "#436D99"],
  default: ["black", "gray"],
}

const setCardType = (type) => {
  ccBgColor01.setAttribute("fill", color[type][0])
  ccBgColor02.setAttribute("fill", color[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
globalThis.setCardType = setCardType

const securityCodCVC = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCodCVC, securityCodePattern)

const expirationDateCard = document.querySelector("#expiration-date")
const expirationDateCardPattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateCardMasked = IMask(
  expirationDateCard,
  expirationDateCardPattern
)
const cardNumber = document.querySelector("#card-number")
const cardNumberCardPattern = {
  mask: [
    {
      mask: "0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "") //vai pegar apenas número
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => {
      return number.match(regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberCardPattern)
/*
    Regra visa 
    Inicia com "4", seguidos de mais 15 dígitos
    regex
    ^4\d{0,15} 
4234234423432344
*/
/*
    Regra Master 1
    Inicia com "5", seguido de um dígito entre 1 e 5, seguido de mais 2 dígitos REGEX " ^5[1-5]\d{0,2} "
    OU
    Inicia com "22", seguido de um dígito entre 2 e 9, seguido de mais 1 dígito REGEX "^22[2-9]\d{0,1}"
    OU
    Inicia com "2", sequido de um dígito entre 3 e 7 , seguido de mais 2 digitos REGEX "^2[3-7]\d{0,2}"
    
    REGEX GERAL
    (^5[1-5]\d{0,2}|^22[2-9]\d{0,1}|^2[3-7]\d{0,2})\d{0,12}

55001 +12
51002

2221

2700
    
*/

const addButton = document.querySelector("#button-add-card")

addButton.addEventListener("click", () => {
  console.log("111")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "NOME" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
const updateSecurityCode = (code) => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  updateNumberCard(cardNumberMasked.value)
})
const updateNumberCard = (number) => {
  const numberCard = document.querySelector(".cc-number")
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  numberCard.innerText = number.length === 0 ? "0000 0000 0000" : number
}

expirationDateCardMasked.on("accept", () => {
  updateExpirationcard(expirationDateCardMasked.value)
})
const updateExpirationcard = (date) => {
  const dateCard = document.querySelector(".cc-expiration .value")
  dateCard.innerText = date.length === 0 ? "00/00" : date
}
