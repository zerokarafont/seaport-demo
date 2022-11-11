import { lambda } from '../../src/utils/request'

export async function save721Order(order) {
    return lambda.post('/order/create', {
        order
    })
}

export async function save1155Order(order) {
    return lambda.post('/order1155/createListing', {
        order
    })
}

export async function fulfillOrder(orderId) {
    return lambda.post("/order/fulfill", {
        orderId,
    })
}

export async function cancelOrder(orderId) {
    return lambda.post(`/order1155/cancel/${orderId}`)
}

export async function makeOffer(order) {
    return lambda.post("/order1155/makeOffer", {
        order
    })
}