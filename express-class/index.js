// const express = new require("express");
// const app = express();

// // app.get("/", (req, res) => {
// //   res.send("Hello World!");
// // });

// var users = [
//   {
//     name: "Kathan",
//     kidneys: [
//       {
//         healthy: false,
//       },
//       {
//         healthy: true,
//       },
//     ],
//   },
// ];

// app.use(express.json());
// app.get("/", (req, res) => {
//   const kidneys = users[0].kidneys;
//   const healthyKidneys = kidneys.filter((kidney) => kidney.healthy).length;
//   const totalKidneys = kidneys.length;
//   //res.send(`There are ${healthyKidneys} healthy kidneys.`);
//   res.send(`There are ${totalKidneys - healthyKidneys} unhealthy kidneys.`);
// });

// app.post("/", (req, res) => {
//   const { name } = req.body;
//   users.push({ name }); // push new user
//   res.send("OK");
// });

// app.put("/", (req, res) => {});

// app.delete("/", (req, res) => {});

// app.listen(3131);

const express = require("express");
const app = express();

const users = [
  {
    name: "John",
    kidneys: [
      {
        healthy: false,
      },
    ],
  },
];

app.use(express.json());

app.get("/", function (req, res) {
  const johnKidneys = users[0].kidneys;
  const numberOfKidneys = johnKidneys.length;
  let numberOfHealthyKidneys = 0;
  for (let i = 0; i < johnKidneys.length; i++) {
    if (johnKidneys[i].healthy) {
      numberOfHealthyKidneys = numberOfHealthyKidneys + 1;
    }
  }
  const numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;
  res.json({
    numberOfKidneys,
    numberOfHealthyKidneys,
    numberOfUnhealthyKidneys,
  });
});

app.post("/", function (req, res) {
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy,
  });
  res.json({
    msg: "Done!",
  });
});

// 411
app.put("/", function (req, res) {
  for (let i = 0; i < users[0].kidneys.length; i++) {
    users[0].kidneys[i].healthy = true;
  }
  res.json({});
});

// removing all the unhealhty kidneys
app.delete("/", function (req, res) {
  if (isThereAtleastOneUnhealthyKidney()) {
    const newKidneys = [];
    for (let i = 0; i < users[0].kidneys.length; i++) {
      if (users[0].kidneys[i].healthy) {
        newKidneys.push({
          healthy: true,
        });
      }
    }
    users[0].kidneys = newKidneys;
    res.json({ msg: "done" });
  } else {
    res.status(411).json({
      msg: "You have no bad kidneys",
    });
  }
});

function isThereAtleastOneUnhealthyKidney() {
  let atleastOneUnhealthyKidney = false;
  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      atleastOneUnhealthyKidney = true;
    }
  }
  return atleastOneUnhealthyKidney;
}
app.listen(3000);
