## DataImport
#### Run up a FatFractal engine on your dev machine
( see http://fatfractal.com/docs/getting-started/ )
#### Deploy this sample locally
```Bash
cd DataImport
ffef deploylocal
```
#### Import some data!
We're going to Import the data from the [thing.json](DataImport/thing.json) file using the [simpleImport](DataImport/ff-scripts/DataImport.js#L7) extension
** NB: We're using http here, for convenience. ALWAYS use https when talking to the internet
```Bash
curl -H "Content-Type: application/octet-stream" \
     --data @thing.json \
     -u system:P4ssw0rd \
     http://localhost:8080/DataImport/ff/ext/simpleImport
```
You should have seen output something like :
```javascript
{"result":{"extensionResponse":"Extension did not set a response"},"statusMessage":"Added 5 new objects; ignored 0 which already existed"}
```
#### Let's see that data ...
```bash
curl http://localhost:8080/DataImport/ff/resources/Thing 
```
Sick of ugly JSON output? Well, thanks to Dave Dopson's https://github.com/ddopson/underscore-cli, now you can do this!
```bash
curl http://localhost:8080/DataImport/ff/resources/Thing | underscore print --outfmt pretty
```

