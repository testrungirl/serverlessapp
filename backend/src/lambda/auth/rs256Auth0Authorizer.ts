
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJKvpS4gfFYNj9MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi10LTZhbGVrZi51cy5hdXRoMC5jb20wHhcNMjExMTI2MDc1OTAwWhcN
MzUwODA1MDc1OTAwWjAkMSIwIAYDVQQDExlkZXYtdC02YWxla2YudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0LuHffO7hFnbQ45u
K7Qz3wVwf+ya7Hn+Gl416gkTNsNCqMrmuj7tegGYD5Jxlo8XK6szb/zUMtNW5VQP
XsBFh3tPZEjOHo6IpzfsZwpJhBNOl2cTCYPWYrkmOvhrpXk9HEJ2/qV8aMVV+loQ
c8kL8z8eF7XZScA/Xq01rhzh96kbbdr4DabLuyztUh+nnxQ021a5xO3UzjCxArUO
haagHtS4PIohymsMWnCLkvCvFlgfkzXZWWa6pDcLFVOHcyXlvkoANRn556cvxbzu
UFZsFyaESNCvmePXUIPJybxOzYX82vuaMNLHnwqdOPHmW7AlnhSMI4jpwrZh19Mb
qcaXpwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBStZZMTiWTX
DtLeEwKUyZY+Zb4c3DAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ADF9urkWP1P2lMiBEYQV4WYbh1ZUU6SonTDWSMR8m4Vq3cceAR6d2Ce2uzaRb3Ux
I6sqsHv4NyEPSGzBJby1WIc83RGhZIj0MsIowSI19phFrRHnrkfmeW19VGcy7tCC
Bi+HXMouXuhYlUbZSYf5Cfpou/4kD7Gthqkrp0tW3mQ4EcxshxyTEoGgq7UU4MsY
W5ijKalr/ZH2lpV/Tapi0lGhCVSk2ujTH074WVtQx86YUXCCQxwbiD/XKBc++YeU
ZHOMGRnM4HxugBbw3njRR7kj/cnOG89xDmFgKsh5I91VuqOyMjkq5ACcQWzApNdh
56etxEoU7PpgcGCqpCg3r34=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)
    
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
