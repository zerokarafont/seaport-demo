import { lambda } from '../../src/utils/request'

export async function saveOrder(data) {
    return lambda.post('/order/create', {
        data
    })
}