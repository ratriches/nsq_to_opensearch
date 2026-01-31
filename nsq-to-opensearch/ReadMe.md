

# OpenSearch Index Management Guide

This guide explains how to manage log indexes in OpenSearch using the provided dashboards.

## Index Management

Access:  
http://localhost:4040/app/opensearch_index_management_dashboards#/indices?from=0&search=&showDataStreams=false&size=20&sortDirection=desc&sortField=index

- On this screen, you will see a list of log indexes that have already arrived in OpenSearch (click **Refresh** if necessary).
- Note that the index name always starts with `Log_` and ends with the creation date (e.g., `_2026_01_12`).
- This naming convention allows the cleanup routine to delete logs older than 7 days.

## Index Patterns

Access:  
http://localhost:4040/app/management/opensearch-dashboards/indexPatterns/

1. Click on **Create index pattern**.
2. In the **Index pattern name** field, enter the desired index name (e.g., `Log_index-name*` to match indexes from all dates).
3. Click **Next**, then select the **Time field** for the index.

To update the log fields:
- Click on the desired index name.
- This opens the index details, where you can view all mapped fields.
- In the upper right corner, click **Refresh field list** to update the list with any new fields received.

## Resetting an Index

To clear and recreate an index:
- Delete it on the **Index Patterns** page.
- You can either delete or refresh the index pattern.
- After receiving new logs, repeat the procedure to recreate the deleted index.

## More Information

For detailed explanations and screenshots, see [docs/imagesExplain.md](docs/imagesExplain.md).
