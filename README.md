fatfractal-code-samples
=======================
You know, for FatFractal code samples

### DataImport
####1 Run up a FatFractal engine on your dev machine (see http://fatfractal.com/docs/getting-started/ )
2 Deploy your app locally
```Bash
cd DataImport
ffef deploylocal
```
3 Import the data from the "thing.json" file using the "simpleImport" extension
** NB: We're using http here, for convenience. ALWAYS use https when talking to the internet
```Bash
curl -H "Content-Type: application/octet-stream" \
     --data @thing.json \
     -u system:Tricky\!\$\%\&\*\(Password \
     http://localhost:8080/DataImport/ff/ext/simpleImport
```
You should have seen output something like :
```javascript
{"result":{"extensionResponse":"Extension did not set a response"},"statusMessage":"Created 5 objects"}
```
4 Let's see that data ...
```bash
curl http://localhost:8080/DataImport/ff/resources/Thing 
```
Sick of ugly JSON output? Well, thanks to Dave Dopson's https://github.com/ddopson/underscore-cli, now you can do this!
```bash
curl http://localhost:8080/DataImport/ff/resources/Thing | underscore print --outfmt pretty
```
