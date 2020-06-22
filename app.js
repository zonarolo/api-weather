const express = require("express");
const https = require("https");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = process.env.KEY;
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&APPID=${apiKey}`;

  https.get(url, (response) => {
    console.log(response.statusCode);

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write(`<p>The weather is currently ${description}</p>`);
      res.write(
        `<h3>The temperature in ${query} is ${temp} degrees Celcius.</h3>`
      );
      res.write(`<img src="${imageURL}" />`);
      res.send();
    });
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}.`));
