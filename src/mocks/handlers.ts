
import { http, HttpResponse } from 'msw'
import { examDeploymentsHandler } from './handlers/examDeployments'
import { checkCodeHandler } from './handlers/checkCode'

export const helloHandler = http.get('/api/hello', () => {
    return HttpResponse.json({ message: 'Hello, world!', code: 200 })
})

export const handlers = [helloHandler, examDeploymentsHandler, checkCodeHandler]
