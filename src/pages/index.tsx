import {
  DAPP_ADDRESS,
  APTOS_FAUCET_URL,
  APTOS_NODE_URL,
  RESOURCE_ADDRESS
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { MoveResource } from "@martiandao/aptos-web3-bip44.js/dist/generated";
import { TokenId } from "@martiandao/aptos-web3-bip44.js/dist/";
import { useState } from "react";
import React from "react";
import * as Gen from "@martiandao/aptos-web3-bip44.js/dist/generated/index";
import {
  AptosAccount,
  WalletClient,
  HexString,
} from "@martiandao/aptos-web3-bip44.js";
import { bcsSerializeUint64, Deserializer } from "@martiandao/aptos-web3-bip44.js/dist/bcs";
// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {

  const { account, signAndSubmitTransaction } = useWallet();
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const [resource, setResource] = React.useState<MoveResource>();
  const [userTokens, setUserTokens] = React.useState<{
    tokens: Array<any>
  }>({
    tokens: [],
  });
  const [formInput, updateFormInput] = useState<{
    description: string;
    resource_path: string;
    addr_type: number;
    addr: string;
    addr_description: string;
    chains: Array<string>;
    
  }>({
    description: "",
    resource_path: "",
    addr_type: 1,
    addr: "",
    addr_description: "",
    chains: [],
  });

  async function create_miner() {
    await signAndSubmitTransaction(
      create_miner_handler(),
      { gas_unit_price: 100 }
    );
  }

  async function claim_reward() {
    await signAndSubmitTransaction(
      claim_reward_handler(),
      { gas_unit_price: 100 }
    );
  }

  async function create_addr() {
    await signAndSubmitTransaction(
      add_addr(),
      { gas_unit_price: 100 }
    );
  }

  async function get_resources() {
    console.log(client.aptosClient.getAccountResources(account!.address!.toString()));
  }

  async function get_resource() {
    const { description, resource_path, addr_type, addr, addr_description, chains } = formInput;
    console.log(client.aptosClient.getAccountResource(account!.address!.toString(), resource_path));
  }

  async function getToken(tokenId: TokenId, resourceHandle?: string) {
    let accountResource: { type: string; data: any };
    if (!resourceHandle) {
      const resources: Gen.MoveResource[] =
        await client.aptosClient.getAccountResources(
          account!.address!.toString()
        );
      accountResource = resources.find(
        (r) => r.type === "0x3::token::TokenStore"
      )!;
    }

    const tableItemRequest: Gen.TableItemRequest = {
      key_type: "0x3::token::TokenId",
      value_type: "0x3::token::Token",
      key: tokenId,
    };
    const token = await client.aptosClient.getTableItem(
      resourceHandle || accountResource!.data.tokens.handle,
      tableItemRequest
    );
    token.collection = tokenId.token_data_id.collection;
    return token;
  }

  
  async function getTokenResourceHandle(tokenId: TokenId) {
    const resources: Gen.MoveResource[] =
      await client.aptosClient.getAccountResources(tokenId.token_data_id.creator);
    const accountResource: { type: string; data: any } = resources.find(
      (r) => r.type === "0x3::token::TokenStore"
    )!;

    return accountResource.data.tokens.handle;
  }

  async function get_user_tokens() {
    const tokens = (await client.getTokenIds(account!.address!.toString()))
      .tokenIds;
    let token_list = []
    let counter = 0;
    for (let i = 0; i < tokens.length; ++i) {
      console.log(tokens[i].data.token_data_id.creator)
      console.log(RESOURCE_ADDRESS)
      if (tokens[i].data.property_version == "1" && tokens[i].data.token_data_id.creator == RESOURCE_ADDRESS) {
        console.log(tokens[i]);
        // const resourceHandle = await getTokenResourceHandle(tokens[i].data);
        const tokenData = await getToken(tokens[i].data);
        console.log(tokenData);
        let hexString = tokenData.token_properties.map.data[0]['value']['value'].slice(2);
        let deserializer = new Deserializer(new Uint8Array(hexString.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16))));
        let ll = deserializer.deserializeU64().toString();
        token_list[counter] = {"name": tokenData.id.token_data_id.name, "last claim timestamp": ll};
        counter++;
      }
    }
    setUserTokens({tokens: token_list});
  }

  function log_acct() {
    console.log(resource)
    console.log(account!.address!.toString());
  }

  function create_miner_handler() {
    const { description, resource_path, addr_type, addr, addr_description, chains } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::entrys::create_miner",
      type_arguments: [],
      arguments: [],
    };
  }

  function claim_reward_handler() {
    const { description, resource_path, addr_type, addr, addr_description, chains } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::entrys::claim_reward",
      type_arguments: [],
      arguments: [
        description
      ],
    };
  }

  async function get_resource_token() {
    client.aptosClient.getAccountResource(account!.address!.toString(),  "0x1::coin::CoinStore<" + DAPP_ADDRESS + "::resource::Resource>").then(
      setResource
    );
  }

  function add_addr() {
    const { description, resource_path, addr_type, addr, addr_description, chains } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::addr_aggregator::add_addr",
      type_arguments: [],
      arguments: [
        addr_type,
        addr,
        chains,
        addr_description,

      ],
    };
  }

  return (
    <div>
        {/* <input
          placeholder="Description for your DID"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        /> */}
        <br></br>
        <button
          onClick={create_miner}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Create Miner
        </button>
        <br></br>
        <input
          placeholder="input token name"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <br></br>
        <button
          onClick={claim_reward}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Claim Reward
        </button>
        {/* <button
          onClick={log_acct}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Log Acct
        </button>
        <br></br>
        <button
          onClick={get_resources}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Get Resources
        </button>
        <br></br>
        <input
          placeholder="0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, resource_path: e.target.value })
          }
        />
        <br></br>
        <button
          onClick={get_resource}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Get Resource
        </button> */}
        <br></br>
        <button
          onClick={get_user_tokens}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Get User Tokens
        </button>
        <p>{JSON.stringify(userTokens)}</p>
        <br></br>
        <button
          onClick={get_resource_token}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Get Resource Token Amount
        </button>
        <p>{ JSON.stringify(resource?.data) }</p>
        <br></br>

        {/* <input
          placeholder="Address Type"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, addr_type: parseInt(e.target.value) })
          }
        />
        <br></br>
        <input
          placeholder="Addr"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, addr: e.target.value })
          }
        />
        <br></br>
        <input
          placeholder="Addr Description"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, addr_description: e.target.value })
          }
        />
        <br></br>
        <input
          placeholder="Chains"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, chains: JSON.parse(e.target.value) })
          }
        />
        <br></br>
        <button
          onClick={create_addr}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Add Addr
        </button>
        <br></br>
        <button
          // onClick={create_addr}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Update Addr
        </button> */}
    </div>
  );
}
