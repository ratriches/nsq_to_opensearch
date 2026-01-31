# Images Explanation

This document provides visual explanations and step-by-step screenshots for using the nsq-to-opensearch and OpenSearch dashboards. Each section corresponds to a specific image and describes what is shown.

**Prerequisite:** This guide assumes you have the nsq-to-opensearch stack running via Docker Compose.

## Table of Contents

- [img_01: Startup of nsq-to-opensearch](#img_01)
- [img_02: Startup of test service](#img_02)
- [img_03: Test service sending messages](#img_03)
- [img_04: nsq-to-opensearch processing messages](#img_04)
- [img_05: Access OpenSearch Dashboards](#img_05)
- [img_06: Set up Index Patterns](#img_06)
- [img_06_1: View created indexes](#img_06_1)
- [img_06_2: Refresh field list](#img_06_2)
- [img_07: Create Index Patterns](#img_07)
- [img_08: Finding the index](#img_08)
- [img_09: Define index pattern](#img_09)
- [img_10: Select timestamp field](#img_10)
- [img_11: Create index pattern](#img_11)
- [img_12: Index data fields and types](#img_12)
- [img_13: Discover menu](#img_13)
- [img_14: Select index pattern](#img_14)
- [img_15: Expand data](#img_15)
- [img_16: Index Management](#img_16)
- [img_16_1: Indexes data overview](#img_16_1)
- [img_16_2: Manage specific index](#img_16_2)

## img_01: Startup of nsq-to-opensearch
![img_01](images/img_01.png)
- Shows the startup of the 'nsq-to-opensearch' service.
- The "ERROR" messages are shown because there is no data yet (see the persistence directory).


## img_02: Startup of test service
![img_02](images/img_02.png)
- Shows the startup of the 'test' service.


## img_03: Test service sending messages
![img_03](images/img_03.png)
- Shows the 'test' service sending some messages.


## img_04: nsq-to-opensearch processing messages
![img_04](images/img_04.png)
- Shows the 'nsq-to-opensearch' service processing messages (coming from the 'test' service).


## img_05: Access OpenSearch Dashboards
![img_05](images/img_05.png)
- Then access [OpenSearch Dashboards](http://localhost:4040).
- On this page, click on **Manage** to set up a new index (see the `_index` field in [img_04](#img_04)).


## img_06: Set up Index Patterns
![img_06](images/img_06.png)
- Click on **Index Patterns** to set up the index.


## img_06_1: View created indexes
![img_06_1](images/img_06_1.png)
- After the step shown in [img_12](#img_12), you can access the **Index Patterns** menu again.
- This time, you will see the created indexes.
- You can click on any of them to review and manage their configuration.


## img_06_2: Refresh field list
![img_06_2](images/img_06_2.png)
- When new fields are sent to this index, you need to click on **Refresh field list** to enable searches for the new field.


## img_07: Create Index Patterns
![img_07](images/img_07.png)
- Click on **Index Patterns** to create the index.


## img_08: Finding the index
![img_08](images/img_08.png)
- Finding the index.


## img_09: Define index pattern
- Define the index pattern and click on **Next step**.
![img_09](images/img_09.png)

# img_10
<a name="img_10"></a>
- Select the 'timestamp' field from the index data.
![img_10](images/img_10.png)

# img_11
<a name="img_11"></a>
- Click on 'Create index pattern'.
![img_11](images/img_11.png)

# img_12
<a name="img_12"></a>
- Shows the index data fields and its types.
![img_12](images/img_12.png)

# img_13
<a name="img_13"></a>
- Click on the left 'menu' (the three lines icon), and on the 'Discover' menu item.
![img_13](images/img_13.png)

# img_14
<a name="img_14"></a>
- At the combo box (on the upper left), select the index pattern to view its data.
![img_14](images/img_14.png)

# img_15
<a name="img_15"></a>
- Then you can expand the data and do many other things.
![img_15](images/img_15.png)

# img_16
<a name="img_16"></a>
- You can click on the left 'menu' and on 'Index Management' to manage index data.
![img_16](images/img_16.png)

# img_16_1
<a name="img_16_1"></a>
- At the 'Index' menu you can see the indexes data.
- Note that each index has a trailing date to facilitate index management.
![img_16_1](images/img_16_1.png)

# img_16_2
<a name="img_16_2"></a>
- You can click on a specific index to manage its data.
![img_16_2](images/img_16_2.png)