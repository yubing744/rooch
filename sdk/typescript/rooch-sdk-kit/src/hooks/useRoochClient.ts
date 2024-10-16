// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

import { RoochClient } from '@roochnetwork/rooch-sdk'

import { useContext } from 'react'

import { RoochClientContext } from '../provider/clientProvider'

export function useRoochClientContext() {
  const client = useContext(RoochClientContext)

  if (!client) {
    console.log('error ?')
    throw new Error(
      'Could not find RoochClientContext. Ensure that you have set up the RoochClientProvider',
    )
  }

  return client
}

export function useRoochClient(): RoochClient {
  return useRoochClientContext().client
}
