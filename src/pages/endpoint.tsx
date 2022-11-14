import {
  DAPP_ADDRESS,
  APTOS_FAUCET_URL,
  APTOS_NODE_URL
} from "../config/constants";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { MoveResource } from "@martiandao/aptos-web3-bip44.js/dist/generated";
import { useState } from "react";
import React from "react";
import {
  AptosAccount,
  WalletClient,
  HexString,
} from "@martiandao/aptos-web3-bip44.js";
// import { TypeTagVector } from "@martiandao/aptos-web3-bip44.js/dist/aptos_types";
// import {TypeTagParser} from "@martiandao/aptos-web3-bip44.js/dist/transaction_builder/builder_utils";
export default function Home() {

  const { account, signAndSubmitTransaction } = useWallet();
  const client = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);
  const [resource, setResource] = React.useState<MoveResource>();
  const [formInput, updateFormInput] = useState<{
    url: string;
    description: string;
    verification_url: string;
    
  }>({
    url: "",
    description: "",
    verification_url: "",
  });

  async function create_endpoints() {
    await signAndSubmitTransaction(
      init_endpoint_aggr(),
      { gas_unit_price: 100 }
    );
  }

  async function create_endpoint() {
    await signAndSubmitTransaction(
      add_endpoint(),
      { gas_unit_price: 100 }
    );
  }

  async function get_endpoint_resource() {
    client.aptosClient.getAccountResource(account!.address!.toString(),  DAPP_ADDRESS + "::endpoint_aggregator::EndpointAggregator").then(
      setResource
    );
  }

  function log_acct() {
    console.log(resource)
    console.log(account!.address!.toString());
  }

  function init_endpoint_aggr() {
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::endpoint_aggregator::create_endpoint_aggregator",
      type_arguments: [],
      arguments: [
      ],
    };
  }

  function add_endpoint() {
    const { url, description, verification_url } = formInput;
    return {
      type: "entry_function_payload",
      function: DAPP_ADDRESS + "::addr_aggregator::add_addr",
      type_arguments: [],
      arguments: [
        url, 
        description, 
        verification_url 
      ],
    };
  }

  return (
    <div>
        <button
          onClick={create_endpoints}
          className={
            "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
          }>
          Init EndpointAggregator in DID Contract
        </button>
        <br></br>
        <button
          onClick={get_endpoint_resource}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Get Endpoint Resource
        </button>
        {/* todo: format payload to w3c did standard */}
        <p>{JSON.stringify(resource)}</p>
        <input
          placeholder="Address Type"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, url: e.target.value })
          }
        />
        <br></br>
        <input
          placeholder="Addr"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <br></br>
        <input
          placeholder="Addr Description"
          className="mt-8 p-4 input input-bordered input-primary w-full"
          onChange={(e) =>
            updateFormInput({ ...formInput, verification_url: e.target.value })
          }
        />
        <br></br>
        <button
          onClick={create_endpoint}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Add Endpoint
        </button>
        <br></br>
        <button
          // onClick={create_addr}
            className={
              "btn btn-primary font-bold mt-4  text-white rounded p-4 shadow-lg"
            }>
            Update Endpoint
        </button>
    </div>
  );
}
