# BlockMed event listener for the RewardDistributor contract

* Includes hardcoded ABI for RewardDistributor contract `0x16c60a50c0d9e2c191370e42aa9d2fb22b99f1fb`
* Uses web3 javascript library
* Run it with `node`
* We are using Infura endpoint `wss://ropsten.infura.io/ws` for Ropstan websocket
* Lookup metadata from IPFS proxy `http://ipfs.blcksync.info:8888`

## Setup

put project to default setup path `/mnt/blockmed-eth-event-listener`

log files will be written to `/var/log/blockmed-eth-event-listener/logs`

run npm install under `/mnt/blockmed-eth-event-listener/app`

```
npm install
```

## Run

Execute to listen to events in foregrand for testing

under `/mnt/blockmed-eth-event-listener/app`

```
$ node event_watcher.js
```

## Run as a Service

make event_watcher.js executable.

```
$ chmod +x app/event_watcher.js 
```

copy service definition file to `/etc/systemd/system/`

```
cp app/blockmed-eth-event-listener.service /etc/systemd/system/
```

reload systemd

```
systemctl daemon-reload
```

enable service

```
systemctl enable blockmed-eth-event-listener
```

check status

```
systemctl status blockmed-eth-event-listener
```

## How it works

### Event Watcher

When an event is fired, event_watcher will get event data.
The original event data as the following.

```
{"address":"0x16C60A50c0d9E2C191370E42aA9d2FB22B99F1fB","blockNumber":4498435,"transactionHash":"0xad80ae6b993b6172c9f7a6dad1b7d6b053b778d55596aa0624256657a6284b36","transactionIndex":6,"blockHash":"0x40bc90effad300b780924a0e3fb07860ec7a054f6b9eabbcf2157ba50938ac48","logIndex":9,"removed":false,"id":"log_24d99f93","returnValues":{"0":"0xfa7bd28B71fCC26396cEAd29B344130925c76503","1":"0xfa7bd28B71fCC26396cEAd29B344130925c76503","2":"QmWkq4e1dnzqcapCca6rYn8scPPhzb6YL6MUgG66Hom6Qs","3":"282565000000","accesser":"0xfa7bd28B71fCC26396cEAd29B344130925c76503","dataowner":"0xfa7bd28B71fCC26396cEAd29B344130925c76503","ipfsMetadataHash":"QmWkq4e1dnzqcapCca6rYn8scPPhzb6YL6MUgG66Hom6Qs","tokenCost":"282565000000"},"event":"PurchaseTxRecord","signature":"0xa3befe72bc9cef7405d0f78a12f282694027a4c40b3a8ed0839a121be48c766a","raw":{"data":"0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000041ca2fbb40000000000000000000000000000000000000000000000000000000000000002e516d576b71346531646e7a716361704363613672596e3873635050687a6236594c364d5567473636486f6d365173","topics":["0xa3befe72bc9cef7405d0f78a12f282694027a4c40b3a8ed0839a121be48c766a","0x000000000000000000000000fa7bd28b71fcc26396cead29b344130925c76503","0x000000000000000000000000fa7bd28b71fcc26396cead29b344130925c76503"]}}
```

`event_watcher` captures metadata refer from `ipfsMetadataHash` value.

The following new properties will be added into output data structure.
    - uid: Event unique Id, as a identifier used for deduplication when event re-import to data store.
    - metadataCaptureTime: time of retrieving metadata by event_watcher.
    - metadata: entire metadata json object without `encrypted` property.

For events which has no `ipfsMetadataHash` value such as event - `RewardTokens` will not have these properties.

### App & Event Log

Both app & event log are json format and will be generated under `/logs/`.
All log file is daily rotated with the following file format.

App Log: `app-YYYY-MM-DD.log`
Event Log: `event-YYYY-MM-DD.log`

### Filebeat

Filebeat will listen to the all log files and send to Logstash.

    - /var/log/blockmed-eth-event-listener/logs/app-*.log
    - /var/log/blockmed-eth-event-listener/logs/event-*.log

### Logstash

Logstash will process ETL tasks and send logs to Elasticsearch

Event logs will be indexed into separate Elasticsearch indeies for data partition.

Partition Rule: index name will be `blockmed-trans-%{blockNumer / 100000}`

Document Deduplicate Rule: document unique id for event log will be `%{transactionHash}|%{logIndex}`

## Event Log Example

Example of `event_watcher` final output.

```
{"address":"0x16C60A50c0d9E2C191370E42aA9d2FB22B99F1fB","blockNumber":4509301,"transactionHash":"0x0f20798a782cd8b3452097e885a405a60fd4bebe9a5039891e58a9c9afe1abe4","transactionIndex":10,"blockHash":"0x1c4918c1292fc1270f58fef1a49a3ccf647366d894e10de3032855c4709467dc","logIndex":10,"removed":false,"id":"log_045442bc","returnValues":{"0":"0xD4F84cB84c024235263702dE37982a0C0eFB666e","1":"0xD4F84cB84c024235263702dE37982a0C0eFB666e","2":"QmUqgBKJzxuYP6KdqNJZ3rpS4usc3JoPVtmdbUBCZJG9vD","3":"23820000000","accesser":"0xD4F84cB84c024235263702dE37982a0C0eFB666e","dataowner":"0xD4F84cB84c024235263702dE37982a0C0eFB666e","ipfsMetadataHash":"QmUqgBKJzxuYP6KdqNJZ3rpS4usc3JoPVtmdbUBCZJG9vD","tokenCost":"23820000000"},"event":"PurchaseTxRecord","signature":"0xa3befe72bc9cef7405d0f78a12f282694027a4c40b3a8ed0839a121be48c766a","raw":{"data":"0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000058bc85b00000000000000000000000000000000000000000000000000000000000000002e516d557167424b4a7a78755950364b64714e4a5a3372705334757363334a6f5056746d64625542435a4a47397644","topics":["0xa3befe72bc9cef7405d0f78a12f282694027a4c40b3a8ed0839a121be48c766a","0x000000000000000000000000d4f84cb84c024235263702de37982a0c0efb666e","0x000000000000000000000000d4f84cb84c024235263702de37982a0c0efb666e"]},"uid":"b709b150-f17a-11e8-8501-e92a6133c41b","metadataCaptureTime":"2018-11-26T12:56:39.396Z","metadata":{"description":"shrimp","filesize":4764}}
```