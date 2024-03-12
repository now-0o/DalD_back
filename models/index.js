const Item = require("./Item");
const Type = require("./Type");
const Status = require("./Status");
const History = require("./History");

Type.hasMany(Item);
Item.belongsTo(Type);

Status.hasMany(Item);
Item.belongsTo(Status);

Type.hasMany(History);
History.belongsTo(Type);

Status.hasMany(History);
History.belongsTo(Status);

Item.hasMany(History);
History.belongsTo(Item);

module.exports = {
  Item,
  Status,
  Type,
  History,
};
