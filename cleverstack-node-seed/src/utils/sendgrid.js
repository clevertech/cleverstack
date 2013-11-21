
module.exports = function(config){
  var Q = require('q')
    , sendgrid = require( "sendgrid" )( config.apiUser, config.apiKey );

  return function( to, from, subject, text, html ){
      var deferred = Q.defer();

     
      var payload = {
        to      : to,
        from    : from,
        subject : subject,
        text    : text
      };

      if( html ){
        payload['html'] = html;
      }

      sendgrid.send( payload, function( err, response ) {
        
        if (err) { 
          console.log("SendGrid Error:  \n",err.toString());
          deferred.reject(err);
          return;
        }
        
        deferred.resolve(response);
      });

      return deferred.promise;
  }

};
