'use strict'

const crypto = require('crypto')

/**
 * @module
 *
 * Provides functions for generating and verifying HMAC signatures from hexadecimal strings for use as code strings for small data.
 * The encoded data+HMAC is suitable for use in URL paths as non-alphanumerical base64 characters are substituted.
 *
 * @param {string} [defaultSecret] Optional default secret used in the absence of the `SIGNED_CODE_SECRET` environment variable.
 */
module.exports = function (defaultSecret) {

  function getSecret() {
    return process.env.SIGNED_CODE_SECRET || defaultSecret
  }

  function getDigest(data) {
    const hmac = crypto.createHmac('sha256', getSecret())
    hmac.update(data, 'hex')
    return hmac.digest('base64')
  }

  return {
    /**
     * Signs a 24-character hexadecimal string and returns a combination of the encoded data and its HMAC
     *
     * @param {string} data 24-character hexadecimal string to be signed and encoded
     * @return {string} base64-encoded data with HMAC
     */
    sign: function sign(hex) {
      if (!/^[a-hA-H0-9]{24}$/.test(hex)) {
        throw new Error('Invalid data for code: ' + hex)
      }
      const encData = new Buffer(hex, 'hex').toString('base64')
      const result = `${encData}${getDigest(hex)}`.replace(/=/g, '$').replace(/\+/g, '@').replace(/\//g, '!').split('').reverse().join('')
      return result
    },

    /**
     * Decodes a signed code+HMAC and returns the decoded data if the HMAC is verified
     *
     * @param {string} code base64-encoded data with HMAC
     * @return {string} The original hexadecimal string data or `null` if verification failed.
     */
    unsign: function unsign(code) {
      if (code.length < 17) {
        return null
      }
      const normalised = code.replace(/\$/g,'=').replace(/@/g,'+').replace(/!/g,'/').split('').reverse().join('')
      // 24-hex chars always encodes to 16 base64 characters
      const encData = normalised.substring(0,16)
      const digest = normalised.substring(16)
      const data = new Buffer(encData, 'base64').toString('hex')
      if (getDigest(data) === digest) {
        return data
      }
      return null
    }
  }
}
