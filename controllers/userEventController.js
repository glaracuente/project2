var express = require("express");

var router = express.Router();

// Import the model (cat.js) to use its database functions.
var userEvent = require("../models/userEvent.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  userEvent.allUsers(function(data) {
    console.log(data);
    res.render("index", { users: data });
  });
});

router.get("/userpage/:id", function(req, res) {
  userEvent.getUsersEvents(req.params.id, function(data) {
    var userEventsObj = {
      allEvents: data,
      singleUserEvent: data[0]
    }
    console.log(userEventsObj);
    res.render("userPortal", userEventsObj);
  });
});

// ======================================================================================================================

router.post("/api/create_event/:id", function(req, res) {

 
  

  userEvent.create([
    "userid", "title","from_date","to_date","invites"
  ], [
    req.params.id, req.body.title, req.body.from_date, req.body.to_date,JSON.stringify(req.body.invites)
  ], function(result) {
    res.json({ id: result.insertId });
  });
});

// ============================================================================================================================
router.get("/new_event/:id", function(req, res) {
  userEvent.allUsers(function(data) {
    var userIdStr = req.params.id;
    var userIdInt = parseInt(userIdStr, 10);

    var users = {
      currentUser:[],
      others:[]

    }
  
    for(i=0;i<data.length;i++){

      if(data[i].id === userIdInt){
        users.currentUser.push(data[i])

        
      }

      else{
       users.others.push(data[i]);
      }
    }

    var pasthis = {
    current: users.currentUser[0],
     others:  users.others

    }
  

    res.render("create", pasthis);
  });
});
// ============================================================================================================================

router.put("/event/:id", function(req, res) {
  userEvent.update({
    title: req.body.title
  }, req.params.id, function(result) {
    if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

router.delete("/event/:id", function(req, res) {
  userEvent.delete(req.params.id, function(result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

// Export routes for server.js to use.
module.exports = router;
