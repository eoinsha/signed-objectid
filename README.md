# signed-objectid

[![Circle CI](https://circleci.com/gh/edappy/signed-objectid.svg?style=svg)](https://circleci.com/gh/edappy/signed-objectid)

Generate URL-safe signed codes based on 24-character hex string (like Mongo ObjectID)

- Requires Node 4+ (ES2015)

## Usage
- The secret used to sign keys can be specified as a string in the environment variable `SIGNED_CODE_SECRET`
- In the absence of `SIGNED_CODE_SECRET`, a fallback secret can be provided to the module function
- Only 24-character hex strings are supported. Anything else will throw an `Error`
- Any invalid or unverifiable input provided to `unsign` will return a `null`

```
const signedObjectId = require('signed-objectid')('DevTestSecret')
console.log(signedObjectId.sign('507f1f77bcf86cd799439011'))

// -> w9-jeWfZ8hayp94dM-euVr351i1KQMHxt6mLTEfFRiXRA5QZeNb4z7df8HU

console.log(signedObjectId.unsign('w9-jeWfZ8hayp94dM-euVr351i1KQMHxt6mLTEfFRiXRA5QZeNb4z7df8HU'))

// -> 507f1f77bcf86cd799439011
```
