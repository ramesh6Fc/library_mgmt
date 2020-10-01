const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("user")
 .readOwn("profile")
 .updateOwn("profile")
 .readAny("book")
 .updateAny('lend')
 
ac.grant("admin")
 .extend("user")
 .readAny("profile")
 .updateAny("profile")
 .deleteAny("profile")
 .createAny("book")
 .readAny("book")
 .updateAny("book")
 .deleteAny("book")
 .createAny("author")
 .readAny("author")
 .updateAny("author")
 .deleteAny("author")
 .createAny("publisher")
 .readAny("publisher")
 .updateAny("publisher")
 .deleteAny("publisher")
 
return ac;
})();