var express = require("express");
var router = express.Router();
const userModel = require("./../model/users");
const roleModel = require("./../model/roles");

/* creating new user */
router.post("/create", (req, res) => {
  roleModel.findOne({ RoleType: req.body.Role }).exec((err, role) => {
    if (err) {
      res.send({ status: 500, error: err });
    } else {
      var isAuthorized = "";
      if (req.body.CreatedBy == 1) {
        isAuthorized = "Approved";
      }
      let user = {
        UserId:
          req.body.UserName.substring(0, 3) + Math.floor(Math.random() * 99999), // this is auto generated and should be unique.
        UserName: req.body.UserName,
        Email: req.body.Email,
        Mobile: req.body.Mobile,
        Password: req.body.Password,
        RoleId: role.RoleId,
        isAuthorized: req.body.CreatedBy == 1 ? 'Approved':'Pending'
      };
      userModel.create(user, (err, data) => {
        if (err) {
          res.send({ status: 500, error: err });
        } else {
          res.send({ status: 200, uid: data.UserId });
        }
      });
    }
  });
});

/* get all users */
router.get("/", (req, res) => {
  userModel
    .find({}, { _id: 0, UserId: 1, UserName: 1, Email: 1, Mobile: 1 })
    .exec((err, user) => {
      if (err) {
        res.send({ status: 500, error: err });
      } else {
        res.send({ status: 200, user: user });
      }
    });
});

/* get all users based on user status like : pending, approved, rejected*/
router.post("/", (req, res) => {
  userModel
    .find(
      { isAuthorized: req.body.isAuthorized },
      { _id: 0, UserId: 1, UserName: 1, Email: 1, Mobile: 1 }
    )
    .exec((err, user) => {
      if (err) {
        res.send({ status: 500, error: err });
      } else {
        res.send({ status: 200, user: user, header: ['User Id', 'User Name', 'Email', 'Mobile'] });
      }
    });
});

// authorizing user for pending to "Approval or Rejection"
router.post("/authorized", (req, res) => {
  userModel
    .findOneAndUpdate(
      { UserId: req.body.UserId },
      { isAuthorized: req.body.isAuthorized }
    )
    .exec(err => {
      if (err) {
        res.send({ status: 500, error: err });
      } else {
        userModel
          .find(
            { isAuthorized: "Pending" },
            { _id: 0, UserId: 1, UserName: 1, Email: 1, Mobile: 1 }
          )
          .exec((err, user) => {
            if (err) {
              res.send({ status: 500, error: err });
            } else {
              console.log(user);
              res.send({ status: 200, user: user });
            }
          });
      }
    });
});

/* get user based on userId */
router.get("/:id", (req, res) => {
  userModel.findOne({ UserId: id }, (err, data) => {
    if (err) {
      res.send({ status: 500, error: err });
    }
    if (data) {
      res.send({ status: 200, data: data });
    } else {
      res.send({ status: 404, message: "not found" });
    }
  });
});

// check user name exist or not
router.post("/checkUserName", (req, res) => {
  userModel.findOne({ UserName: req.body.UserName }, (err, data) => {
    if (err) {
      res.send({ status: 500, error: err });
    }
    if (data) {
      res.send({ status: 200, message: "not available" });
    } else {
      res.send({ status: 404, message: "available" });
    }
  });
});

// check mobile exist or not
router.post("/checkMobileNo", (req, res) => {
  userModel.findOne({ Mobile: req.body.Mobile }, (err, data) => {
    if (err) {
      res.send({ status: 500, error: err });
    }
    if (data) {
      res.send({ status: 200, message: "not available" });
    } else {
      res.send({ status: 404, message: "available" });
    }
  });
});

// check email exist or not
router.post("/checkEmail", (req, res) => {
  userModel.findOne({ Email: req.body.Email }, (err, data) => {
    if (err) {
      res.send({ status: 500, error: err });
    }
    if (data) {
      res.send({ status: 200, message: "not available" });
    } else {
      res.send({ status: 404, message: "available" });
    }
  });
});

module.exports = router;
