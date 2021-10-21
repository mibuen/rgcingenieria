const Joi = require('joi');

exports.quoteSchema = Joi.object({
  quotationId : Joi.required().
})
// Joi.string().regex(/^\d+$/)

// ^.{0}$