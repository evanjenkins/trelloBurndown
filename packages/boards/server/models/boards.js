'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var BoardSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true
  },
  boardId: {
    type: String,
    required: true
  },
  devs: {
    type: Array
  },
  lists: {
    type: Array
  },
  memberships: {
    type: Array
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
BoardSchema.path('boardId').validate(function(boardId) {
  return !!boardId;
}, 'Board cannot be blank');

BoardSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

/**
 * Statics
 */
BoardSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Board', BoardSchema);
