/**
 * Pings a url.
 * @param  {String} url
 * @param  {Number?} multiplier - optional, factor to adjust the ping by.  0.3 works well for HTTP servers.
 * @return {Promise} promise that resolves to a ping (ms, float).
 */
export default function ping(url, multiplier) {
  return new Promise(function(resolve, reject) {
    var start = new Date().getTime()
    var response = function() {
      var delta = new Date().getTime() - start
      delta *= multiplier || 1
      resolve(delta)
    }

    var img = new Image()
    img.onload = function() {
      response()
    }
    img.onerror = function(err) {
      reject(new Error('Timeout'))
    }
    img.src =
      url +
      '?random-no-cache=' +
      Math.floor((1 + Math.random()) * 0x10000).toString(16)

    // Set a timeout for max-pings, 5s.
    setTimeout(function() {
      // smart way to cancel request
      img.src = ''
      reject(Error('Timeout'))
    }, 1000)
  })
}
