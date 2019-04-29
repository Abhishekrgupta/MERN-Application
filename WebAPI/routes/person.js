var express = require("express");
var router = express.Router();
const PersonModel = require("./../model/person");
const TempPersonModel = require("./../model/tempPerson");

/*
  new person profile creation based on userid
*/
router.post("/create", (request, response) => {
  var Person = {
    PersonId: request.body.PersonId,
    FullName: {
      FirstName: request.body.FullName.FirstName,
      MiddleName: request.body.FullName.MiddleName,
      LastName: request.body.FullName.LastName
    },
    Gender: request.body.Gender,
    DateOfBirth: request.body.DateOfBirth,
    Age: request.body.Age,
    Address: {
      FlatNumber: request.body.Address.FlatNumber,
      SocietyName: request.body.Address.SocietyName,
      AreaName: request.body.Address.AreaName
    },
    City: request.body.City,
    State: request.body.State,
    Pincode: request.body.Pincode,
    PhoneNo: request.body.PhoneNo,
    MobileNo: request.body.MobileNo,
    PhysicalDisability: request.body.PhysicalDisability,
    MaritalStatus: request.body.MaritalStatus,
    Education: request.body.Education,
    BirthSign: request.body.BirthSign
  };

  console.log(Person);
  if (request.body.CreatedBy == 1) {
    PersonModel.create(Person, (err, res) => {
      if (err) {
        response.send({ status: 500, error: err });
      } else {
        response.send({ status: 200, data: res });
      }
    });
  } else {
    TempPersonModel.create(Person, (err, res) => {
      if (err) {
        response.send({ status: 500, error: err });
      } else {
        response.send({ status: 200, data: res });
      }
    });
  }
});

/*
  getting person profile based on user/person id
*/
router.get("/:pid", (request, response) => {
  // this should be based on approved and pending status
  var pid = request.params.pid;
  PersonModel.find({ PersonId: pid }, (err, data) => {
    if (err) {
      response.send({ status: 500, err: err });
    } else if (data) {
      response.send({ status: 200, data: data });
    } else {
      response.send({ status: 404, message: "No Data Found" });
    }
  });
});

/*
  getting all person Approved profile
*/
// router.get("/", (request, response) => {
//   PersonModel.find(
//     {},
//     { _id: 0, PersonId: 1, FullName: 1, Gender: 1, City: 1, State: 1 }
//   ).exec((err, data) => {
//     if (err) {
//       response.send({ status: 500, err: err });
//     } else if (data) {
//       response.send({ status: 200, data: data });
//     } else {
//       response.send({ status: 404, message: "No Data Found" });
//     }
//   });
// });

/*
  getting all person profile based on status like "Pending, Approved and Reject"
*/
router.post("/", (req, res) => {
  if (req.body.isAuthorized === "Approved") {
    PersonModel.find(
      {},
      { _id: 0, PersonId: 1, FullName: 1, Gender: 1, City: 1, State: 1 }
    ).exec((err, person) => {
      if (err) {
        response.send({ status: 500, err: err });
      } else {
        res.send({ status: 200, person: person, header: ['Person Id', 'Full Name', 'Gender', 'City', 'State'] });
      }
    });
  } else if (req.body.isAuthorized === "Pending") {
    // have to use temp person collection
    TempPersonModel.find(
      {},
      { _id: 0, PersonId: 1, FullName: 1, Gender: 1, City: 1, State: 1 }
    ).exec((err, person) => {
      if (err) {
        response.send({ status: 500, err: err });
      } else {
        res.send({ status: 200, person: person, header: ['Person Id', 'Full Name', 'Gender', 'City', 'State'] });
      }
    });
  }
});

/*
  Approving person by admin
*/
router.post("/approve", (request, response) => {
  // getting Person Id
  var pid = request.body.PersonId;
  console.log(pid);

  // getting and removing data from temp_person collection
  TempPersonModel.findOne({ PersonId: pid }, { _id: 0, __v: 0 }).exec(
    (err, person) => {
      if (err) {
        response.send({ status: 500, err: err });
      } else if (person) {
        console.log(person);

        // preparing person model from temp_person model
        let Auth_Person = {
          PersonId: person.PersonId,
          FullName: person.FullName,
          Address: person.Address,
          PhysicalDisability: person.PhysicalDisability,
          BirthSign: person.BirthSign,
          Gender: person.Gender,
          Age: person.Age,
          City: person.City,
          State: person.State,
          Pincode: person.Pincode,
          DateOfBirth: person.DateOfBirth,
          PhoneNo: person.PhoneNo,
          MobileNo: person.MobileNo,
          MaritalStatus: person.MaritalStatus,
          Education: person.Education
        };

        // checking data available in person collection or not
        PersonModel.findOne({ PersonId: pid }).exec((err, data) => {
          if (err) {
            console.log(err);
            response.send({ status: 500, err: err });
            return;
          }

          if (data === null) {
            console.log("creating new user");

            // inserting new entry into person collection
            PersonModel.create(Auth_Person, (err, d) => {
              if (err) {
                response.send({ status: 500, err: err });
              } else {
                console.log("moved data to person/ new creation");

                TempPersonModel.remove({ PersonId: pid }).exec(err =>
                  console.log("deleted")
                );
                // getting all remaining temp person
                TempPersonModel.find(
                  {},
                  {
                    _id: 0,
                    PersonId: 1,
                    FullName: 1,
                    Gender: 1,
                    City: 1,
                    State: 1
                  }
                ).exec((err, data) => {
                  if (err) {
                    response.send({ status: 500, err: err });
                  }
                  if (data) {
                    console.log(data);
                    
                    response.send({ status: 200, data: data,  header: ['Person Id', 'Full Name', 'Gender', 'City', 'State']  });
                  } else {
                    response.send({
                      status: 500,
                      message: "some error occured"
                    });
                  }
                });
              }
            });
          } else {
            // inserting new entry into person collection
            console.log("updating user");

            PersonModel.findOneAndUpdate(
              { PersonId: Auth_Person.PersonId },
              Auth_Person,
              (err, d) => {
                if (err) {
                  response.send({ status: 500, err: err });
                } else {
                  console.log("moved data to person/ update");

                  TempPersonModel.remove({ PersonId: pid }).exec(err =>
                    console.log("deleted")
                  );
                  // getting all remaining temp person
                  TempPersonModel.find(
                    {},
                    {
                      _id: 0,
                      PersonId: 1,
                      FullName: 1,
                      Gender: 1,
                      City: 1,
                      State: 1
                    }
                  ).exec((err, data) => {
                    if (err) {
                      response.send({ status: 500, err: err });
                    }
                    if (data) {
                      response.send({ status: 200, data: data,   header: ['Person Id', 'Full Name', 'Gender', 'City', 'State'] });
                    } else {
                      response.send({
                        status: 500,
                        message: "some error occured"
                      });
                    }
                  });
                }
              }
            );
          }
        });
      } else {
        response.send({ status: 404, message: "No Data Found" });
      }
    }
  );
});

/*
  Updating person information
*/

/*
  update person profile creation based on userid/personid
*/
router.put("/update", (request, response) => {
  var Person = {
    PersonId: request.body.PersonId,
    FullName: {
      FirstName: request.body.FullName.FirstName,
      MiddleName: request.body.FullName.MiddleName,
      LastName: request.body.FullName.LastName
    },
    Gender: request.body.Gender,
    DateOfBirth: request.body.DateOfBirth,
    Age: request.body.Age,
    Address: {
      FlatNumber: request.body.Address.FlatNumber,
      SocietyName: request.body.Address.SocietyName,
      AreaName: request.body.Address.AreaName
    },
    City: request.body.City,
    State: request.body.State,
    Pincode: request.body.Pincode,
    PhoneNo: request.body.PhoneNo,
    MobileNo: request.body.MobileNo,
    PhysicalDisability: request.body.PhysicalDisability,
    MaritalStatus: request.body.MaritalStatus,
    Education: request.body.Education,
    BirthSign: request.body.BirthSign
  };

  console.log("inside update");

  console.log(Person);
  
  if (request.body.CreatedBy == 1) {
    PersonModel.update({PersonId: Person.PersonId},Person, (err, res) => {
      if (err) {
        response.send({ status: 500, error: err });
      } else {
        response.send({ status: 200, data: res });
      }
    });
  } else {
    TempPersonModel.create({PersonId: Person.PersonId},Person, (err, res) => {
      if (err) {
        response.send({ status: 500, error: err });
      } else {
        response.send({ status: 200, data: res });
      }
    });
  }
});

module.exports = router;
