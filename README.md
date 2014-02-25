fatfractal-code-samples
=======================
You know, for FatFractal code samples

### DataImport
* Run up a FatFractal engine on your dev machine (see http://fatfractal.com/docs/getting-started/ )
* Deploy your app locally
```Bash
cd DataImport
ffef deploylocal
```
* Do an import
```Bash
curl -H "Content-Type: application/octet-stream" \
     --data @thing.json \
     -u system:Tricky\!\$\%\&\*\(Password \
     http://localhost:8080/Samples/ff/ext/batchCreate
```
> Note: Always use https in production

