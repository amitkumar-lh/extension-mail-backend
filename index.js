const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const axios = require("axios");
const port = 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const json2html = require("node-json2html");


app.post("/send", (req, res) => {
  const obj = {};
  const array1 = req.body.datum||[];
  const array2 = req.body.labels||[];
  const arrofObjects = array1.map((value, index) => {
    return { time: value, websiteName: array2[index] };
  })
  const jsonObj = JSON.stringify(obj);

  let template = { "<>": "div", html: "${time}seconds -> ${websiteName}" };

  let data = arrofObjects;

  let htmlToRender = json2html.render(data, template);

  var transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, 
    service: "gmail",
    auth: {
      user: "amitbalharakr93@gmail.com",
      pass: "amit@123",
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });


  const mailOptions = {
    from: "amitbalharakr93@gmail.com", // sender address
    to: req.body.mail, // list of receivers
    subject: "Total time spent By You", // Subject line
    html: htmlToRender, // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


