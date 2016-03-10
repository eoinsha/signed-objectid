const signedObjectId = require('./index')('DevTestSecret')
console.log(signedObjectId.sign('507f1f77bcf86cd799439011'))

console.log(signedObjectId.unsign('$w9@jeWfZ8hayp94dM@euVr351i1KQMHxt6mLTEfFRiXRA5QZeNb4z7df8HU'))

