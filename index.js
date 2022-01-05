const express = require('express')

const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;
/* mongo connect */
const { MongoClient } = require('mongodb');
const { json } = require('express/lib/response')
/* port */
const port =process.env.PORT|| 5000;
 
/* middle wire */
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended:true}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rqzc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// pass:JvCXQStuQokAyvDK user:care-edu

async function run() {
    try {
        await client.connect();
        const database=client.db('care_edu')
        const teacherCollection=database.collection('teachers')
        const reviewCollection=database.collection('review')
        const eventSecondCollection=database.collection('eventSecond')
        const eventCollection=database.collection('events')
        const usersCollection=database.collection('users')
        const studentCollection=database.collection('student')
        
       
       
        /* get product */
    app.get('/teachers',async(req,res)=>{
        const query={}
        const cursor=teacherCollection.find(query)
        const teacher=await cursor.toArray();
        res.json( teacher);

      })
     
      /* get review */
    app.get('/review',async(req,res)=>{
      const query={}
      const cursor=reviewCollection.find(query)
      const review=await cursor.toArray();
      res.json(review);

    })
      /* get event */
    app.get('/events',async(req,res)=>{
      const query={}
      const cursor=eventCollection.find(query)
      const event=await cursor.toArray();
      res.json(event);

    })
      // /* get event2 */ index?
    app.get('/eventSecond',async(req,res)=>{
      const query={}
      const cursor=eventSecondCollection.find(query)
      const eventSecondP=await cursor.toArray();
      res.json(eventSecondP);

    })
      /* get event */
      app.get('/student',async(req,res)=>{
        const query={}
        const cursor=studentCollection.find(query)
        const students=await cursor.toArray();
        res.json(students);
  
      })
    
    /* amer id admin kina ta check korchi */
  app.get('/users/:email',async(req,res)=>{
    const email=req.params.email;
    /* find email */
    const query={email:email}; 
    const user=await usersCollection.findOne(query); 
    let isAdmin=false;
    if(user?.role==='admin'){
      isAdmin=true;
    }
    res.json({admin:isAdmin})

  })

  /* product add */
  app.post('/student',async(req,res)=>{
    const order=req.body
    const result=await studentCollection.insertOne(order)
    res.json(result);
})

  app.post('/users',async(req,res)=>{
    const user=req.body;
    const result=await usersCollection.insertOne(user)
    
    res.json(result);
})

/* add user at google login and prevent re-enter data in user database  */
app.put('/users' ,async(req,res)=>{
  const user=req.body;
  // console.log('put',user)
  const filter={email:user.email};
  const option={ upsert: true};
  const updateDoc={$set:user};
  const result=await usersCollection.updateOne(filter,updateDoc,option);
  
    res.json(result)

})
  
/* add role as admin a user */
app.put('/users/admin', async(req,res)=>{
const  user=req.body;
/* console.log('put',user) */
const filter={email:user.email};
const updateDoc={$set:{role:'admin'}};
const result=await usersCollection.updateOne(filter,updateDoc);
res.json(result)
})



      console.log('connected ok ')
    } finally {
      
    //   await client.close(); 
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running at 5000 port')
  })
  
  app.listen(port, () => {
    console.log(`Listening at ${port}`)
  })