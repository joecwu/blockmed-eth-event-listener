# Elasticsearch Setup

## Setup Index Template

TBD



## Search Template

Setup search template

### for specific query string search

```
POST _scripts/blockmed-trans-aggs
{
  "script": {
    "lang": "mustache",
    "source": {
      "size": 0,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "metadata.description": "{{query_string}}"
              }
            }
          ]
        }
      },
      "aggs": {
        "ipfsMetadataHash": {
          "terms": {
            "field": "returnValues.ipfsMetadataHash.keyword",
            "size": 10
          },
          "aggs": {
            "PurchaseTxRecordCount": {
              "filter": {
                "term": {
                  "event.keyword": "PurchaseTxRecord"
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
  }
}
```

Invoke search template

```
GET blockmed-trans-*/_search/template
{
    "id": "blockmed-trans-aggs", 
    "params": {
        "query_string": "shrimp"
    }
}
```

### for search all data

```
POST _scripts/blockmed-trans-aggs-all
{
  "script": {
    "lang": "mustache",
    "source": {
      "size": 0,
      "aggs": {
        "ipfsMetadataHash": {
          "terms": {
            "field": "returnValues.ipfsMetadataHash.keyword",
            "size": 10
          },
          "aggs": {
            "PurchaseTxRecordCount": {
              "filter": {
                "term": {
                  "event.keyword": "PurchaseTxRecord"
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
  }
}
```

Invoke search template

```
GET blockmed-trans-*/_search/template
{
    "id": "blockmed-trans-aggs-all"
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
        "field": "returnValues.ipfsMetadataHash.keyword",
        "size": 10
      },
      "aggs": {
        "PurchaseTxRecordCount": {
          "filter": {
            "term": {
              "event.keyword": "PurchaseTxRecord"
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