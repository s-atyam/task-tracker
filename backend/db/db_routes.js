const express = require("express");
const router = express.Router();
const conn_db = require("./config");

// Your AccountSID and Auth Token from console.twilio.com
const accountSid = ' Your Account Sid';
const authToken = ' Your Auth Token';

const client = require('twilio')(accountSid, authToken);

const sendSMS = (Message,phone)=>{
  client.messages
  .create({
    body: `-\n${Message}`,
    to: `+91${phone}`, // Text your number
    from: ' You Valid Twilio number', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}

// ROUTE 1 : to create new user: POST "/user/createuser"
router.post("/createuser", async (req, res) => {
  try {
    let responseData = { user: {}, task: [], depen: [] };
    
    let userID = Math.round(new Date().getTime());

    responseData.user = {user_id:userID,fname:req.body.fname,lname:req.body.lname,email:req.body.email,phoneNo:req.body.phone,password:req.body.password}

    let query = `INSERT INTO users values (${userID},'${req.body.fname}','${req.body.lname}','${req.body.email}',${req.body.phone},'${req.body.password}');`;
    conn_db.query(query,(err, rows, fields)=>{
      if (err) console.log(err);
    });

    query = `CREATE TABLE ${userID}_TASK (task_id INT,task_name VARCHAR(20), description VARCHAR(200), due_date date, status VARCHAR(20), created_at datetime,completed_at datetime,last_updated_at datetime)`;
    conn_db.query(query, (err, rows, fields) => {
      if (err) console.log(err);
    });
    query = `CREATE TABLE ${userID}_DEPENDENCY (task_id INT,dependency_id int)`;
    conn_db.query(query, (err, rows, fields) => {
      if (err) console.log(err);
    });
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

// ROUTE 2 : login user using credentials: GET "/user/login",
router.get("/login", async (req, res) => {
  try {
    let responseData = { user: {}, task: [], depen: [] };
    let query = `SELECT user_id,fname,lname,email,phoneNo,password FROM users WHERE email='${req.header(
      "email"
    )}'`;
    conn_db.query(query, async (err, rows, fields) => {
      if (err) {
        console.log("Error : " + err);
        res.json(err);
        return;
      } else if (rows.length !== 0) {
        if (rows[0].password === req.header("password")) {
          responseData.user = rows[0];
          query = `SELECT * FROM ${rows[0].user_id}_TASK`;
          conn_db.query(query, (err, rows, fields) => {
            if (err) console.log(err);
            responseData.task = rows;
          });
          query = `SELECT * FROM ${rows[0].user_id}_DEPENDENCY`;
          conn_db.query(query, (err, rows, fields) => {
            if (err) console.log(err);
            responseData.depen = rows;
            console.log(responseData);
            res.json(responseData);
          });
        } else {
          res.json("Wrong email or password!");
        }
      } else {
        res.json("Wrong email or password!");
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

// ROUTE 3 : to add task for the current user: POST "/user/addtask", login required
router.post("/createtask", (req, res) => {
  try {
    const { userDetails,userID, name, description, due_date, dependency } = req.body;
    let responseData = { user: {}, task: [], depen: [] };
    responseData.user = userDetails;
    let query = `SELECT * FROM ${userID}_TASK`;
    let newTaskID = 10000;
    let datecreated = formatDate(new Date());
    conn_db.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      newTaskID = newTaskID + rows.length + 1;

      query = `INSERT INTO ${userID}_TASK values (${newTaskID},'${name}','${description}','${due_date}','Not Completed','${datecreated}',null,'${datecreated}')`;
      conn_db.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
          query = `SELECT * FROM ${userID}_TASK`;
          conn_db.query(query, (err, rows, fields) => {
            if (err) console.log(err);
            responseData.task = rows;

            for (let i = 0; i < dependency.length; i++) {
              query = `INSERT INTO ${userID}_DEPENDENCY values (${newTaskID},${dependency[i]})`;
              conn_db.query(query, (err, rows, fields) => {
                if (err) console.log(err);
              });
            }
            query = `SELECT * FROM ${userID}_DEPENDENCY`;
            conn_db.query(query, (err, rows, fields) => {
              if (err) console.log(err);
              responseData.depen = rows;
              res.json(responseData);
            });
          });
        }
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

// ROUTE 4 : complete an existing task using: PUT "/user/complete", login reguired
router.put("/complete", async (req, res) => {
  const {userDetails,userID,taskId} = req.body;

  try {
    let responseData = { user: {}, task: [], depen: [], taskDepend:[] };
    let query = `SELECT * FROM ${userID}_DEPENDENCY WHERE task_id=${taskId}`;
    conn_db.query(query,(err,rows,fields)=>{
      if(rows.length===0){
        let query = `UPDATE ${userID}_TASK SET status='Completed', completed_at='${formatDate(new Date())}'  WHERE task_id=${taskId};`;
    responseData.user = userDetails;
    conn_db.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      query = `SELECT * FROM ${userID}_TASK`;
      conn_db.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        responseData.task = rows;
        query = `DELETE FROM ${userID}_DEPENDENCY WHERE dependency_id=${taskId};`;
        conn_db.query(query, (err, rows, fields) => {
          if (err) console.log(err);
          query = `SELECT * FROM ${userID}_DEPENDENCY`;
          conn_db.query(query, (err, rows, fields) => {
            if (err) console.log(err);
            responseData.depen = rows;
            res.json(responseData);
          });  
        });
      });
    });
  }else{
    responseData.taskDepend = rows;
    res.json(responseData);
      }
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});


// ROUTE 5 : to edit the email or phone for existing user using: PUT "/user/editemailphone", login reguired
router.put("/editemailphone", async (req, res) => {
  const {userID,task,depen,email,phone} = req.body;

  try {
    let responseData = { user: {}, task: task, depen: depen };
    let query = `UPDATE users SET email='${email}', phoneNo='${phone}'  WHERE user_id=${userID};`;
    conn_db.query(query,(err,rows,fields)=>{
      if (err) console.log(err);
      query = `SELECT * FROM users where user_id=${userID};`;
      conn_db.query(query,(err,rows,fields)=>{
        if (err) console.log(err);
        responseData.user = rows[0];
        res.json(responseData);
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

// ROUTE 6 : to send the sms for the current user (Action plan ) : PUT "/user/editemailphone", login reguired
router.post("/smsaction", (req, res) => {
  try {
    const {userID,phone} = req.body;
    let query = `SELECT * FROM ${userID}_TASK WHERE ${userID}_TASK.task_id NOT IN (SELECT ${userID}_DEPENDENCY.task_id FROM ${userID}_DEPENDENCY) AND ${userID}_TASK.status <> 'Completed' ORDER BY ${userID}_TASK.due_date ASC;`
    conn_db.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      console.log(rows)
      let message = ``;
      for(let i=0;i<rows.length;i++){
        message = message + `\n ${i+1}. ${rows[i].task_name}\n   Due : ${rows[i].due_date.toString().substring(0,15)}\n`;
      }
      sendSMS(message,phone);
      res.json(rows);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
