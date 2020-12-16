# Serverless Application
The application is live at: https://wiy2cw8bz2.execute-api.ap-southeast-2.amazonaws.com/dev/users/

## Create a new user
```
POST https://wiy2cw8bz2.execute-api.ap-southeast-2.amazonaws.com/dev/users
```
Payload
```
{
	"data": {
		"type": "User",
		"firstName": "Aryan",
		"lastName": "Faghihi",
		"username": "aryanfaghihi",
		"credentials": "password",
		"email": "aryanfaghihi@email.com"
	}
}
```

## Retrieve a user
```
GET https://wiy2cw8bz2.execute-api.ap-southeast-2.amazonaws.com/dev/users/{id}
```
