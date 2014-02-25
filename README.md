fatfractal-code-samples
=======================
You know, for FatFractal code samples

# DataImport
Assuming you've got a FatFractal engine running locally (see http://fatfractal.com/docs/getting-started/ )

then
* Deploy your app locally
```Bash
cd DataImport
ffef deploylocal
```

* Do an import
```Bash
curl -H "Content-Type: application/octet-stream" --data @thing.json -u system:Tricky\!\$\%\&\*\(Password --insecure https://localhost:8443/Samples/ff/ext/batchCreate
```


