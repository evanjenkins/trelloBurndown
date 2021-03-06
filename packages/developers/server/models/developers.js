'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var DeveloperSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true
  },
  developerId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  fullObject: {
    type: Object
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
//BoardSchema.path('title').validate(function(title) {
//  return !!title;
//}, 'Title cannot be blank');

/**
 * Validations
 */
DeveloperSchema.path('developerId').validate(function(developerId) {
  return !!developerId;
}, 'Dev cannot be blank');

DeveloperSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

DeveloperSchema.path('userId').validate(function(userId) {
  return !!userId;
}, 'Id cannot be blank');

/**
 * Statics
 */
DeveloperSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};
DeveloperSchema.statics.loadByUserId = function(userId, cb) {
  this.findOne({
    userId: userId
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Developer', DeveloperSchema);
