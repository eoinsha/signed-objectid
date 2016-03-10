'use strict'
const chai = require('chai')
const expect = chai.expect
chai.use(require('dirty-chai'))

describe('signed-codes', function () {

  [undefined, 'SecretOverride'].forEach((defaultSecret) => {

    describe(`with defaultSecret=${defaultSecret}`, () => {
      const signedObjectId = require('../index')(defaultSecret)

      before(() => {
        if (!defaultSecret) {
          process.env.SIGNED_CODE_SECRET = 'SecretFromEnvironment'
        }
      })

      after(() => delete process.env.SIGNED_CODE_SECRET)

      it('generates a string code for an ObjectID-style input', () => {
        const data = '507f1f77bcf86cd799439011'
        const code = signedObjectId.sign(data)
        expect(code).to.exist()
        expect(code).to.be.a('string').with.length.within(2, 256)
        const decodedData = signedObjectId.unsign(code)
        expect(decodedData).to.equal(data)
      })

      it('fails to encode invalid hex', () => {
        const data = 'X07f1f77bcf86cd799439011'
        expect(() => signedObjectId.sign(data)).to.throw(Error)
      })

      it('fails to encode invalid hex length', () => {
        const data = '507f1f77bcf86cd7994390112'
        expect(() => signedObjectId.sign(data)).to.throw(Error)
      })

      it('fails to decode a code that is too short', () => {
        const code = 'abcd'
        expect(signedObjectId.unsign(code)).to.be.a('null')
      })

      it('fails to decode invalid encoded code', () => {
        const code = 'abcdefghijklmnopqrstuvwxyz'
        expect(signedObjectId.unsign(code)).to.be.a('null')
      })
    })
  })
})
