import axios from 'axios'
import { message } from 'antd'

function responseInterceptor(response) {
    return response.data
}
function errorInterceptor(tag) {
    return (error) => {
        const msg = typeof error === 'string' ? error : error.message 
        message.error(`${tag}:${msg}`)
    }
}

const moralis = axios.create({
    baseURL: '/moralis',
    // baseURL: 'https://8qqup4wcrb.execute-api.ca-central-1.amazonaws.com/test/forward/api/v2',
    timeout: 10000,
})
moralis.interceptors.response.use(responseInterceptor, errorInterceptor('moralis'))

const opensea = axios.create({
    baseURL: 'https://testnets-api.opensea.io/api/v1/',
    timeout: 3000
})
opensea.interceptors.response.use(responseInterceptor, errorInterceptor('opensea'))

const lambda = axios.create({
    baseURL: 'http://192.168.50.225:3030/api/',
    timeout: 10000
})
lambda.interceptors.response.use(responseInterceptor, errorInterceptor('lambda'))

const fetchMeta = axios.create()
fetchMeta.interceptors.response.use(responseInterceptor, (error) => {
    const msg = typeof error === 'string' ? error : error.message 
    console.error(`fetchMeta:${msg}`)
})

export {
    moralis,
    opensea,
    lambda,
    fetchMeta
}