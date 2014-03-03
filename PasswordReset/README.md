# Password Reset sample code

## Here we illustrate:
* How appropriately authorized users can generate password reset requests
* A simple, parameterized password reset form
* How to send a simple email with a link to the password reset form

## To use:
* Run up a FatFractal engine on your dev machine
( see http://fatfractal.com/docs/getting-started/ )

* Edit PasswordReset.js and add in your SMTP credentials etc

* Deploy this sample locally
```Bash
cd /path/to/fatfractal-code-samples/PasswordReset
ffef deploylocal
```


* Create a test user
```Bash
curl "http://localhost:8080/PasswordReset/ff/ext/createTestUser?email=your_email_address@example.com"
```


