const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const details = require("./details.json");
const fs = require('fs');
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server working");
});

app.post("/sendMail", (req, res) => {
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed send ${info.messageId}`);
    res.send(info);
  });
});

app.post("/saveUsers", (req, res) => { // tylko development
  let users = req.body;
  let dataUser = {"users": users}
  fs.writeFile(" ./../src/assets/users.json", JSON.stringify(dataUser), function(error) {
      if (error) {
        console.log('error', error);
        res.status(200).json({'status':'error', 'error':'error'});
      } else {
        console.log('Save users complete', users);
        res.status(200).json({'status':'ok'}) ;
      }
    }
  );
});


async function sendMail(user, callback) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // false for 587
    auth: {
      user: details.email,
      pass: details.password
    }
  });

  let mailOptions = {
    from: `Potwierdzenie hasła <${user.email}>`,
    to: user.email,
    subject: "[Demo App] Potwierdzenie hasła",
    html: `Użytkowniku ${user.firstName} ${user.lastName} twoje hasło do konta to:  <b>${user.password}</b>`
  };

  let info = await transporter.sendMail(mailOptions);
  callback(info);
}
