import { toFormatDebioCoin } from "@/common/lib/polkadot-provider/index"
import store from "@/store"

const defaultHandler = {
  get: function (target, name) {
    return Object.prototype.hasOwnProperty.call(target, name) ? target[name] : (dataEvent, value, valueMessage) => {
      const data = dataEvent[0]
      const id = data[value]
      const params = { number: id }
      const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")"
      return { data, id, params, wording }
    }
  }
}

const handler = {
  orders: async (dataEvent, value, valueMessage) => {
    const data = dataEvent[0]
    const id = data[value]
    const status = {
      UNPAID: "submitted"
    }
    const computeStatus = `has been ${status[data.status.toUpperCase()]}`
    const params = { id: id }

    const computeId = `${data[valueMessage].substr(0, 4)}...${ data[valueMessage].substr(data[valueMessage].length - 4)}`
    const computeWording = ` DBIO as a reward for completing the request test for ${computeId} from the service requested`

    const finalWording = data.status === "Fulfilled" && data.orderFlow === "StakingRequestService"
      ? computeWording
      : `for (${computeId}) ${computeStatus}`

    const wording = finalWording
    return { data, id, params, wording }
  },
  geneticTesting: async (dataEvent, value, valueMessage) => {
    const data = dataEvent[0]
    const id = data[value]
    const params = { orderId: id }
    const wording = valueMessage
    return { data, id, params, wording }
  },
  balances: async (dataEvent, value, valueMessage) => {
    const data = dataEvent
    const id = data[value]
    const params = { number: id }
    const finalText = await toFormatDebioCoin(data[valueMessage])
    const wording = finalText + " DBIO!"
    return { data, id, params, wording }
  },
  rewards: async (dataEvent, value, valueMessage) => {
    const web3 = store.getters["metamask/getWeb3"]
    const data = dataEvent;
    const id = data[value];
    const params = null;
    const finalText = await toFormatDebioCoin(data[valueMessage])
    const coin = web3.utils.fromWei(finalText, "kwei")
    const wording = `${coin} DBIO for registering in Debio Appchain`;
    return { data, id, params, wording }
  },
  serviceRequest: async (dataEvent, value, valueMessage) => {
    const data = dataEvent
    const id = isNaN(value) ? data[0][value] : data[value]
    const params = { page: 1 }
    const wording = valueMessage    

    return { data, id, params, wording}
  }
}

// If property not found, return defaultHandler
export const customerHandler = new Proxy(handler, defaultHandler)
