// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

import { TEXT_TO_FELT_MAX_LEN } from '../constants'
import { addHexPrefix, removeHexPrefix } from './encode'
import { isHex, isStringWholeNumber } from './num'

/**
 * Test if string contains only ASCII characters (string can be ascii text)
 */
export function isASCII(str: string) {
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]*$/.test(str)
}

/**
 * Test if string is a Cairo short string (string has less or equal 31 characters)
 */
export function isShortString(str: string) {
  return str.length <= TEXT_TO_FELT_MAX_LEN
}

/**
 * Test if string contains only numbers (string can be converted to decimal number)
 */
export function isDecimalString(str: string): boolean {
  return /^[0-9]*$/i.test(str)
}

/**
 * Test if value is a free-from string text, and not a hex string or number string
 */
export function isText(val: any) {
  return typeof val === 'string' && !isHex(val) && !isStringWholeNumber(val)
}

/**
 * Test if value is short text
 */
export const isShortText = (val: any) => isText(val) && isShortString(val)

/**
 * Test if value is long text
 */
export const isLongText = (val: any) => isText(val) && !isShortString(val)

/**
 * Split long text into short strings
 */
export function splitLongString(longStr: string): string[] {
  const regex = RegExp(`[^]{1,${TEXT_TO_FELT_MAX_LEN}}`, 'g')
  return longStr.match(regex) || []
}

/**
 * Convert an ASCII string to a hexadecimal string.
 * @param str short string (ASCII string, 31 characters max)
 * @returns format: hex-string 248 bits max
 * @example
 * ```typescript
 * const myEncodedString: string = encodeShortString("uri/pict/t38.jpg")
 * // return hex string (ex."0x7572692f706963742f7433382e6a7067")
 * ```
 */
export function encodeShortString(str: string): string {
  if (!isASCII(str)) throw new Error(`${str} is not an ASCII string`)
  if (!isShortString(str)) throw new Error(`${str} is too long`)
  return addHexPrefix(str.replace(/./g, (char) => char.charCodeAt(0).toString(16)))
}

/**
 * Convert a hexadecimal or decimal string to an ASCII string.
 * @param str representing a 248 bit max number (ex. "0x1A4F64EA56" or "236942575435676423")
 * @returns format: short string 31 characters max
 * @example
 * ```typescript
 * const myDecodedString: string = decodeShortString("0x7572692f706963742f7433382e6a7067")
 * // return string (ex."uri/pict/t38.jpg")
 * ```
 */
export function decodeShortString(str: string): string {
  if (!isASCII(str)) throw new Error(`${str} is not an ASCII string`)
  if (isHex(str)) {
    return removeHexPrefix(str).replace(/.{2}/g, (hex) => String.fromCharCode(parseInt(hex, 16)))
  }
  if (isDecimalString(str)) {
    return decodeShortString('0X'.concat(BigInt(str).toString(16)))
  }
  throw new Error(`${str} is not Hex or decimal`)
}
