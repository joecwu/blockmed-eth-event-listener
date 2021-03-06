#! /usr/bin/env node
/*jshint esversion: 6*/

// run with local Provider
const Web3 = require("web3");
const uuidv1 = require("uuid/v1");
const config = require("config");
// enpoint_IPFS must end with `/`
const baseUrl_IPFS = config.get("ipfs.gateway_url");

// contract address 0x2098f0E37E74377380aAbD0B46b1Be7693B847D3 ABI on Rinkeby
// contract address 0x4C97efc3604FCaEE022E1Ef8FD567531F364E1aa ABI on Ropstan Testnet
const address = config.get("ethereum.contract.address");
const websocket_provider = config.get("ethereum.websocket_provider");
const contract_abi = [
  {
    constant: false,
    inputs: [
      { name: "ipfsMetadataHash", type: "string" },
      { name: "partialKey", type: "string" },
      { name: "indirectKeyIdx", type: "string" },
      { name: "seed", type: "uint256" },
      { name: "ipfsEncryptedHash", type: "string" },
      { name: "realFilesize", type: "uint256" }
    ],
    name: "encryptIPFS",
    outputs: [{ name: "", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "allowIpfsRegister", type: "bool" }],
    name: "activateRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newRewardExRate", type: "uint256" }],
    name: "setRewardExchangeRate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "ipfsMetadataHash", type: "string" }],
    name: "decryptIPFS",
    outputs: [{ name: "", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "rewardexchanger",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "ownerKill",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "currentTokenContract",
    outputs: [{ name: "tok_addr", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_exchanger", type: "address" }],
    name: "delegateExchangerAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "ipfsMetadataHash", type: "string" }],
    name: "fetchParallelKeyForIPFS",
    outputs: [
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "a", type: "uint256" }, { name: "b", type: "uint256" }],
    name: "safeSub",
    outputs: [{ name: "c", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "a", type: "uint256" }, { name: "b", type: "uint256" }],
    name: "safeDiv",
    outputs: [{ name: "c", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "exchanging_token_addr",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "pos",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "a", type: "uint256" }, { name: "b", type: "uint256" }],
    name: "safeMul",
    outputs: [{ name: "c", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "defaultRewardFileSize",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "allowIpfsReg",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "allowTokenEx",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "a", type: "uint256" }, { name: "b", type: "uint256" }],
    name: "safeAdd",
    outputs: [{ name: "c", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "fetchKeyForIPFS",
    outputs: [
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "_ex_tok_addr", type: "address" },
      { name: "enableTokenEx", type: "bool" },
      { name: "_pos", type: "uint256" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "dataowner", type: "address" },
      { indexed: false, name: "ethersSent", type: "uint256" },
      { indexed: false, name: "tokensGranted", type: "uint256" }
    ],
    name: "RewardTokens",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "registor", type: "address" },
      { indexed: false, name: "ipfsHash", type: "string" }
    ],
    name: "RegisteredFreeRecord",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "registor", type: "address" },
      { indexed: false, name: "ipfsMetadataHash", type: "string" },
      { indexed: false, name: "underlyingFileSize", type: "uint256" },
      { indexed: false, name: "tokenCost", type: "uint256" }
    ],
    name: "RegisteredEncryptedRecord",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "accesser", type: "address" },
      { indexed: true, name: "dataowner", type: "address" },
      { indexed: false, name: "ipfsMetadataHash", type: "string" },
      { indexed: false, name: "tokenCost", type: "uint256" }
    ],
    name: "PurchaseTxRecord",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "msg", type: "string" },
      { indexed: false, name: "allowIpfsREgistration", type: "bool" }
    ],
    name: "RewardEvent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "msg", type: "string" },
      { indexed: false, name: "newExchangeRate", type: "uint256" }
    ],
    name: "NewExchangeRate",
    type: "event"
  }
];

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");
var eventTransport = new transports.DailyRotateFile({
  filename: "logs/event-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "90d"
});
var ipfsTransport = new transports.DailyRotateFile({
  filename: "logs/ipfs-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "90d"
});
var appTransport = new transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "90d"
});
const eventLogger = createLogger({
  level: "info",
  format: printf(info => info.message),
  transports: [new transports.Console(), eventTransport]
});
const ipfsLogger = createLogger({
  level: "info",
  format: printf(info => info.message),
  transports: [new transports.Console(), ipfsTransport]
});
const logger = createLogger({
  level: "debug",
  format: combine(format.label({ uid: uuidv1() }), timestamp(), format.json()),
  transports: [new transports.Console(), appTransport]
});

function writeLogWithMetaInfo(result) {
  var ipfsMetadataHash = result.returnValues.ipfsMetadataHash;
  logger.debug("capturing metadata from ipfs", {
    ipfsHash: ipfsMetadataHash,
    baseUrl: baseUrl_IPFS
  });
  var Request = require("request");

  Request.get(
    {
      baseUrl: baseUrl_IPFS,
      uri: ipfsMetadataHash,
      time: true,
      timeout: 120 * 1000
    },
    (error, response, body) => {
      if (error) {
        return logger.error("capture meta error", {
          ipfsHash: ipfsMetadataHash,
          errObj: error
        });
      }
      try {
        logger.debug("captured metadata from ipfs", {
          ipfsHash: ipfsMetadataHash,
          elapsedTime: response.elapsedTime
        });
        var resp = JSON.parse(body);
        result.metadata = resp;
        // wirte log for blockmed-trans-
        delete result.metadata.encrypted;

        logger.debug("process ipfsData log.");
        // write additional log for blockmed-ipfs- data
        switch (result.event) {
          case "RegisteredEncryptedRecord":
            var ipfsDataObj = {
              uid: ipfsMetadataHash,
              transactionHash: result.transactionHash,
              logIndex: result.logIndex,
              transactionIndex: result.transactionIndex,
              blockHash: result.blockHash,
              indexBlockNumber: result.indexBlockNumber,
              event: result.event,
              purchaseTxRecords: [],
              //returnValues
              underlyingFileSize: result.returnValues.underlyingFileSize,
              tokenCost: result.returnValues.tokenCost,
              registor: result.returnValues.registor,
              ipfsMetadataHash: ipfsMetadataHash,
              //metadata
              metadataCaptureTime: result.metadataCaptureTime,
              metadata: resp
            };
            ipfsLogger.info(JSON.stringify(ipfsDataObj));
            break;
          case "PurchaseTxRecord":
            var ipfsDataPurchasedObj = {
              uid: ipfsMetadataHash,
              purchaseTxRecord: result.transactionHash + "|" + result.logIndex,
              event: result.event,
              //returnValues
              accesser: result.returnValues.accesser,
              dataowner: result.returnValues.dataowner,
              purchaseTime: result.metadataCaptureTime
            };
            ipfsLogger.info(JSON.stringify(ipfsDataPurchasedObj));
            break;
          default:
          //Do Nothing
        }

        eventLogger.info(JSON.stringify(result));
      } catch (e) {
        logger.error("error when parse metaInfo response.", {
          errObj: e,
          result: result,
          metadata_body: body
        });
        eventLogger.info(JSON.stringify(result));
      }
    }
  );
}

// old web3 versions 0.20.x
// web3.eth.contract(contractAbi).at(contractAddress);
// new web3 versions 1.0.x
// web3.eth.Contract(contractAbi, contractAddress);
const web3 = new Web3(new Web3.providers.WebsocketProvider(websocket_provider));
let contract_instance = new web3.eth.Contract(contract_abi, address);

logger.info(
  `BlockMed eth event listener started on [${
    process.env.NODE_ENV
  }] environment. ws provider:[${websocket_provider}] contract address:[${address}]`
);
contract_instance.events.allEvents((err, result) => {
  try {
    if (result) {
      logger.info("got event", result);
      // add general data into result obj
      var date = new Date();
      result.uid = uuidv1();
      result.metadataCaptureTime = date.toISOString();

      // retrieve metadata for all events which has ipfsMetadataHash
      if (result.returnValues.ipfsMetadataHash) {
        writeLogWithMetaInfo(result);
      } else {
        eventLogger.info(JSON.stringify(result));
      }
    } else {
      logger.error("got error event.", { error: err, result: result });
    }
  } catch (error) {
    logger.error("failed to process event.", { error: error, result: result });
  }
});
