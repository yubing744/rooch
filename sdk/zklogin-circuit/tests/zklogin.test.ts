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
        'NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ'
      // eslint-disable-next-line prettier/prettier, no-restricted-globals
      const signatureBigInt = BigInt('0x' + Buffer.from(jwtSignature, 'base64').toString('hex'))

      // public key
      const publicKeyPem = fs.readFileSync(path.join(__dirname, './keys/public_key.pem'), 'utf8')
      const pubKeyData = pki.publicKeyFromPem(publicKeyPem.toString())
      const pubkeyBigInt = BigInt(pubKeyData.n.toString())

      const witness = await circuit.calculateWitness({
        oauth_jwt: padString(
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0',
          512,
        ),
        oauth_signature: toCircomBigIntBytes(signatureBigInt),
        oauth_pubKey: toCircomBigIntBytes(pubkeyBigInt),
        sequence_number: BigInt(0),
        salt: BigInt(0),
      })

      await circuit.checkConstraints(witness)
      await circuit.assertOut(witness, {
        rooch_address: BigInt(
          '14171039412213110784417280324141189816472958262483829095867395698730945491308',
        ),
      })
    })
  })
})
