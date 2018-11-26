# Elasticsearch Setup

## Setup Pipeline

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
        "value": "{{uid}}"
      }
    },
    {
      "set": {
        "field": "ingestReceivedTime",
        "value": "{{_ingest.timestamp}}"
      }
    }
  ]
}

```

## Setup Index Template

TBD