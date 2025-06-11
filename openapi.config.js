import { generateService } from '@umijs/openapi'

export default generateService({
  requestLibPath: 'import request  from "@/utils/request"',
  schemaPath: 'http://127.0.0.1:8000/openapi.json',
  serversPath: './src/services',
})