// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

module moveos_std::base64 {

    /// Function to decode base64.
    public fun base64_decode(str: vector<u8>): vector<u8> {
        native_base64_decode(json_str)
    }

    /// Function to encode base64.
    public fun base64_encode(str: vector<u8>): vector<u8> {
        native_base64_encode(json_str)
    }

    native fun native_base64_encode(str: vector<u8>): vector<u8>;

    native fun native_base64_decode(str: vector<u8>): vector<u8>;

    #[test_only]
    use std::vector;

    #[test_only]
    #[data_struct]
    struct Inner has copy, drop, store {
        value: u64,
    }
    #[test_only]
    #[data_struct]
    struct Test has copy, drop, store {
        balance: u128,
        age: u8,
        inner: Inner,
        bytes: vector<u8>, 
        inner_array: vector<Inner>,
        account: address,
    }

    #[test]
    fun test_from_json() {
        let json_str = b"{\"balance\": \"170141183460469231731687303715884105728\",\"age\":30,\"inner\":{\"value\":100},\"bytes\":[3,3,2,1],\"inner_array\":[{\"value\":101}],\"account\":\"0x42\"}";
        let obj = from_json<Test>(json_str);
        
        assert!(obj.balance == 170141183460469231731687303715884105728u128, 1);
        assert!(obj.age == 30u8, 2);
        assert!(obj.inner.value == 100u64, 3);

        // check bytes
        assert!(vector::length(&obj.bytes) == 4, 4);
        assert!(vector::borrow(&obj.bytes, 0) == &3u8, 5);
        assert!(vector::borrow(&obj.bytes, 1) == &3u8, 6);
        assert!(vector::borrow(&obj.bytes, 2) == &2u8, 7);
        assert!(vector::borrow(&obj.bytes, 3) == &1u8, 8);

        // check inner_array
        assert!(vector::length(&obj.inner_array) == 1, 9);
        assert!(vector::borrow(&obj.inner_array, 0).value == 101u64, 10);

        // check account
        assert!(obj.account == @0x42, 11);
    }
}