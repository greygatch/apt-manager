'use strict';

var Property = require('../../../models/property');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/properties/{propertyId}',
    config: {
      description: 'Get property',
      handler: function(request, reply){
        Property.find({_id: request.auth.credentials._id, managerId: request.auth.credentials.managerId}, function(err, property){
          return reply({property: property}).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'properties.show'
};
