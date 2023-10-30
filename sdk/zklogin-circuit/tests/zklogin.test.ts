// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs'
import path from 'path'
import { pki } from 'node-forge'
import { wasm as wasm_tester } from 'circom_tester'
import { padString, toCircomBigIntBytes } from '@rooch/circomlib'

describe('ZKLogin Test', () => {
  jest.setTimeout(10 * 60 * 1000) // 10 minutes

  let circuit: any

  describe('ZKLoginVerify', () => {
    beforeAll(async () => {
      circuit = await wasm_tester(path.join(__dirname, './zklogin-verify-test.circom'), {
        // @dev During development recompile can be set to false if you are only making changes in the tests.
        // This will save time by not recompiling the circuit every time.
        // Compile: circom "./tests/email-verifier-test.circom" --r1cs --wasm --sym --c --wat --output "./tests/compiled-test-circuit"
        recompile: true,
        output: path.join(__dirname, './compiled-test-circuit'),
        include: path.join(__dirname, '../node_modules'),
      })
    })

    it('should ZKLoginVerify be ok', async function () {
      // signature
      const jwtSignature =
        'cZN0cIM_0LEha7VM8rd06njkuGfp65g4tmDx4I414Gv5vDzr0B7iE2xkROLQEL6ikpTwSoX3oAXIa3nRZF400MNky-YkVk1-y8R-yfKss_DgufLCoIRGZCugE60wlzmLq4HJZis4wJa6nVufsXzIVKlSJn9tVx_t0uModyc3BqbDGnF2xpJg6opVc12NxsRoNL3EIojK9D56aYxYuj4m58vik1OOFuiIwNFgueo0YkT_sJZEaMbMYdqxZOlsPp6zklf0ortb0VBHpiPtDUUmFSvADDQ6W-MIFQW0tHawmo_5RvwfNvpjHXSVeNFPzIGKD-nHo7XOmOf0VOe2Iu69Ag'
      // eslint-disable-next-line prettier/prettier, no-restricted-globals
      const signatureBigInt = BigInt('0x' + Buffer.from(jwtSignature, 'base64').toString('hex'))

      // public key
      const publicKeyPem = fs.readFileSync(path.join(__dirname, './jwt/public_key.pem'), 'utf8')
      const pubKeyData = pki.publicKeyFromPem(publicKeyPem.toString())
      const pubkeyBigInt = BigInt(pubKeyData.n.toString())

      const startTime = new Date().getTime()
      const witness = await circuit.calculateWitness({
        oauth_jwt: padString(
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdWQiOiI1NzU1MTkyMDAwMDAtbXNvcDllcDQ1dTJ1bzk4aGFwcW1uZ3Y4ZDgwMDAwMDAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6IjB4MDEiLCJzdWIiOiIxMTA0NjM0NTIxNjczMDMwMDAwMDAifQ',
          512,
        ),
        oauth_signature: toCircomBigIntBytes(signatureBigInt),
        oauth_pubKey: toCircomBigIntBytes(pubkeyBigInt),
        kc_name: padString('sub', 12),
      })
      console.log('proof time:', new Date().getTime() - startTime, 'ms')

      await circuit.checkConstraints(witness)
      await circuit.assertOut(witness, {
        nonce: padString('0x01', 32),
        kc_value: padString('110463452167303000000', 32),
      })
    })
  })
})
