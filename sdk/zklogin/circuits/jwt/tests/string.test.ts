// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

import { wasm as wasm_tester } from 'circom_tester'
import { Scalar } from 'ffjavascript'
import path from 'path'
import { Felt } from '../src/types'

exports.p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617',
)

describe('String Test', () => {
  jest.setTimeout(10 * 60 * 1000) // 10 minutes

  let circuit: any

  beforeAll(async () => {
    circuit = await wasm_tester(path.join(__dirname, './string-charat-test.circom'), {
      // @dev During development recompile can be set to false if you are only making changes in the tests.
      // This will save time by not recompiling the circuit every time.
      // Compile: circom "./tests/email-verifier-test.circom" --r1cs --wasm --sym --c --wat --output "./tests/compiled-test-circuit"
      recompile: true,
      output: path.join(__dirname, './compiled-test-circuit'),
      include: path.join(__dirname, '../../../node_modules'),
    })
  })

  it('should chatAt be ok', async function () {
    const inputs = [
      [Felt.fromString('A'), 0, 65], // A
      [Felt.fromString('AB'), 1, 65], // B
    ]

    for (const [text, index, output] of inputs) {
      const witness = await circuit.calculateWitness({
        text: (text as Felt).toBigNumber(),
        index,
      })
      await circuit.checkConstraints(witness)
      await circuit.assertOut(witness, { ch: output })
    }
  })
})
