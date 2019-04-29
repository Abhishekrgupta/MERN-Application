const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const roleSchema = mongoose.Schema({
  //RoleId: Number,
  RoleType: {
    type: String
  }
});
roleSchema.plugin(AutoIncrement, {inc_field: 'RoleId'});
const Roles = (module.exports = mongoose.model("Roles", roleSchema, "Roles"));