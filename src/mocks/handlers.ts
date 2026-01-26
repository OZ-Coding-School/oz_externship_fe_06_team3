import { http, HttpResponse } from 'msw'
import { checkCodeHandler } from './handlers/checkCode'
import { examDeploymentDetailHandler } from './handlers/examDeploymentDetail'
import { examDeploymentsHandler } from './handlers/examDeployments'
import { loginHandler } from './auth.mock'

export const helloHandler = http.get('/api/hello', () => {
  return HttpResponse.json({ message: 'Hello, world!', code: 200 })
})

export const handlers = [
  helloHandler,
  examDeploymentsHandler,
  checkCodeHandler,
  examDeploymentDetailHandler,
  loginHandler,
]
