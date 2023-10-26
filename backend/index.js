const connectToMongo = require('./db')
const cors=require('cors')
const express = require('express')
const router=express.Router()
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

connectToMongo()
const app = express()
const port = process.env.PORT||4000

app.use(express.json())
// app.use(cors)
app.use(cors({
    origin: 'https://app-deploy-powerai.vercel.app'
  }));

 app.use('/api/auth', require('./routes/auth'))
 app.use('/api/notes', require('./routes/notes'))

//  // --------------------------deployment------------------------------

// const __dirn=path.resolve()
// const __dirname1 = path.resolve(__dirn,'..');


// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/powerai/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "powerai", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// // --------------------------deployment------------------------------

 app.post("/", async(req,res)=>{
    try{
        console.log(process.env.OPENAI_API_KEY)
      const prompt=req.body.prompt;
      console.log(prompt)
      const response = await openai.createCompletion({
          model: "text-davinci-001",
          prompt: `${prompt}`,
          temperature: 0,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.0,
      });
      console.log("hiss")
  
      console.log(response.data)
      res.status(200).send({
          bot:response.data.choices[0].text
      })
  
  
    }
    catch(error){
        res.status(500).send("Error captured");
    }
  })

app.listen(port,() =>{
    console.log(`Example app listening to localhost: ${port}`)  
})

