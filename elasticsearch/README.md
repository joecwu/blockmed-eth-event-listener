# Elasticsearch Setup

## Setup Index Template

```
POST _template/blockmed-ipfs
{
  "index_patterns": [
    "blockmed-ipfs",
    "blockmed-ipfs-*",
    "backup-blockmed-ipfs-*"
  ],
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 2
  },
  "mappings": {
    "doc": {
      "properties": {
        "@timestamp": {
          "type": "date"
        },
        "@version": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "beat": {
          "properties": {
            "hostname": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }
            },
            "name": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }
            },
            "version": {
              "type": "keyword"
            }
          }
        },
        "blockHash": {
          "type": "keyword"
        },
        "blockNumber": {
          "type": "long"
        },
        "event": {
          "type": "keyword"
        },
        "fields": {
          "properties": {
            "appName": {
              "type": "keyword"
            },
            "appType": {
              "type": "keyword"
            }
          }
        },
        "host": {
          "properties": {
            "architecture": {
              "type": "keyword"
            },
            "containerized": {
              "type": "boolean"
            },
            "id": {
              "type": "keyword"
            },
            "name": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }
            },
            "os": {
              "properties": {
                "codename": {
                  "type": "keyword"
                },
                "family": {
                  "type": "keyword"
                },
                "platform": {
                  "type": "keyword"
                },
                "version": {
                  "type": "keyword"
                }
              }
            }
          }
        },
        "id": {
          "type": "keyword"
        },
        "indexBlockNumber": {
          "type": "long"
        },
        "input": {
          "properties": {
            "type": {
              "type": "keyword"
            }
          }
        },
        "logIndex": {
          "type": "long"
        },
        "metadata": {
          "properties": {
            "category": {
              "type": "keyword"
            },
            "description": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }
            },
            "filesize": {
              "type": "long"
            }
          }
        },
        "metadataCaptureTime": {
          "type": "date"
        },
        "offset": {
          "type": "long"
        },
        "prospector": {
          "properties": {
            "type": {
              "type": "keyword"
            }
          }
        },
        "accesser": {
          "type": "keyword"
        },
        "dataowner": {
          "type": "keyword"
        },
        "ethersSent": {
          "type": "long",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "ipfsMetadataHash": {
          "type": "keyword"
        },
        "registor": {
          "type": "keyword"
        },
        "tokenCost": {
          "type": "long",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "tokensGranted": {
          "type": "long",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "underlyingFileSize": {
          "type": "long",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "signature": {
          "type": "keyword"
        },
        "source": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "tags": {
          "type": "keyword"
        },
        "transactionHash": {
          "type": "keyword"
        },
        "transactionIndex": {
          "type": "long"
        },
        "uid": {
          "type": "keyword"
        }
      }
    }
  }
}
```

or curl command

```
curl -XPOST 'localhost:9200/_template/blockmed-ipfs' -H 'content-type:application/json' -d '{"index_patterns":["blockmed-ipfs","blockmed-ipfs-*","backup-blockmed-ipfs-*"],"settings":{"number_of_shards":5,"number_of_replicas":2},"mappings":{"doc":{"properties":{"@timestamp":{"type":"date"},"@version":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"beat":{"properties":{"hostname":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"name":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"version":{"type":"keyword"}}},"blockHash":{"type":"keyword"},"blockNumber":{"type":"long"},"event":{"type":"keyword"},"fields":{"properties":{"appName":{"type":"keyword"},"appType":{"type":"keyword"}}},"host":{"properties":{"architecture":{"type":"keyword"},"containerized":{"type":"boolean"},"id":{"type":"keyword"},"name":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"os":{"properties":{"codename":{"type":"keyword"},"family":{"type":"keyword"},"platform":{"type":"keyword"},"version":{"type":"keyword"}}}}},"id":{"type":"keyword"},"indexBlockNumber":{"type":"long"},"input":{"properties":{"type":{"type":"keyword"}}},"logIndex":{"type":"long"},"metadata":{"properties":{"category":{"type":"keyword"},"description":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"filesize":{"type":"long"}}},"metadataCaptureTime":{"type":"date"},"offset":{"type":"long"},"prospector":{"properties":{"type":{"type":"keyword"}}},"accesser":{"type":"keyword"},"dataowner":{"type":"keyword"},"ethersSent":{"type":"long","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"ipfsMetadataHash":{"type":"keyword"},"registor":{"type":"keyword"},"tokenCost":{"type":"long","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"tokensGranted":{"type":"long","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"underlyingFileSize":{"type":"long","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"signature":{"type":"keyword"},"source":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"tags":{"type":"keyword"},"transactionHash":{"type":"keyword"},"transactionIndex":{"type":"long"},"uid":{"type":"keyword"}}}}}'
```


## Search Template

Setup search template

We use [pre-registered-template](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html#pre-registered-templates) because we want to make `query_string` and `category` as optional params.
If there is no value or empty string, we will apply `{"match_all":{}}` query.

### for specific query string search

```
POST _scripts/blockmed-ipfs
{
  "script": {
    "lang": "mustache",
    "source": """{"size":{{size}},"from":{{from}},"query":{"bool":{"must":[{"bool":{"should":[{"match":{"metadata.description":"{{query_string}}"}}{{^query_string}},{"match_all":{}}{{/query_string}}]}}],"filter":{"bool":{"should":[{"term":{"metadata.category":"{{category}}"}}{{^category}},{"match_all":{}}{{/category}}]}}}},"sort":[{{#sort_by_time}}{"_script":{"script":{"source":"doc[\"metadataCaptureTime\"].date.getMillis()","lang":"painless"},"type":"number","order":"{{sort_order}}{{^sort_order}}desc{{/sort_order}}"}},{{/sort_by_time}}{{#sort_by_filesize}}{"metadata.filesize":{"order":"{{sort_order}}{{^sort_order}}desc{{/sort_order}}"}},{{/sort_by_filesize}}{{#sort_by_accessed}}{"_script":{"script":{"source":"doc[\"purchaseTxRecords\"].values.size()","lang":"painless"},"type":"number","order":"{{sort_order}}{{^sort_order}}desc{{/sort_order}}"}},{{/sort_by_accessed}}{"_score":{"order":"desc"}}],"highlight":{"fields":{"metadata.description":{}}}}"""
  }
}
```

or curl command

```
curl -XPOST 'localhost:9200/_scripts/blockmed-ipfs' -H 'content-type:application/json' -d '{"script":{"lang": "mustache","source": """{"size":{{size}},"from":{{from}},"query":{"bool":{"must":[{"bool":{"should":[{"match":{"metadata.description":"{{query_string}}"}}{{^query_string}},{"match_all":{}}{{/query_string}}]}}],"filter":{"bool":{"should":[{"term":{"metadata.category":"{{category}}"}}{{^category}},{"match_all":{}}{{/category}}]}}}},"sort":[{{#sort_by_time}}{"_script":{"script":{"source":"doc[\"metadataCaptureTime\"].date.getMillis()","lang":"painless"},"type":"number","order":"{{sort_order}}{{^sort_order}}desc{{/sort_order}}"}},{{/sort_by_time}}{{#sort_by_filesize}}{"metadata.filesize":{"order":"{{sort_order}}{{^sort_order}}desc{{/sort_order}}"}},{{/sort_by_filesize}}{{#sort_by_accessed}}{"_script":{"script":{"source":"doc[\"purchaseTxRecords\"].values.size()","lang":"painless"},"type":"number","order":"{{sort_order}}{{^sort_order}}desc{{/sort_order}}"}},{{/sort_by_accessed}}{"_score":{"order":"desc"}}],"highlight":{"fields":{"metadata.description":{}}}}"""}}'
```

Invoke search template

```
GET blockmed-trans-*/_search/template
{
    "id": "blockmed-ipfs", 
    "params": {
        "query_string": "elastic",
        "category": "data",
        "size": 10,
        "from": 0,
        "sort_by_time": "true",
        "sort_by_filesize": "",
        "sort_by_accessed": "",
        "sort_order": "asc"
    }
}
```

## Example

Search & Aggregate data

```
GET blockmed-trans-*/_search
{
  "size": 0,
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "metadata.description": "shrimp3"
          }
        }
      ]
    }
  },
  "aggs": {
    "ipfsMetadataHash": {
      "terms": {
        "field": "returnValues.ipfsMetadataHash",
        "size": 10
      },
      "aggs": {
        "PurchaseTxRecordCount": {
          "filter": {
            "term": {
              "event": "PurchaseTxRecord"
            }
          }
        },
        "top_hits": {
          "top_hits": {
            "sort": [
              {
                "blockNumber": {
                  "order": "desc"
                }
              }
            ],
            "_source": {
              "includes": [
                "event",
                "metadata",
                "returnValues"
              ]
            },
            "size": 1
          }
        },
        "filesize": {
          "max": {
            "field": "metadata.filesize"
          }
        },
        "bucket_sort": {
          "bucket_sort": {
            "sort": [
              {
                "PurchaseTxRecordCount._count": {
                  "order": "desc"
                }
              },
              {
                "filesize": {
                  "order": "desc"
                }
              }
            ]
          }
        }
      }
    }
  }
}
```


## Setup Ingest Pipeline (Deprecated)

*Deprecated 2018.11.28* using logstash to hand this task.

HTTP PUT `blockmed-trans.pipeline.json` to `{{es_host}}:{{es_port}}/_ingest/pipeline/blockmed-trans`

or use *dev-tools* from *Kibana* portal.

```
PUT _ingest/pipeline/blockmed-trans
{
  "description": "blockmed transaction pipeline",
  "processors": [
    {
      "set": {
        "field": "_id",
        "value": "{{transactionHash}}|{{logIndex}}"
      }
    },
    {
      "script": {
        "source": " ctx._index = 'blockmed-trans-' + (ctx.blockNumber/100000)"
      }
    }
  ]
}

```