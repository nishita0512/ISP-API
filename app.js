import mysql from 'mysql2'
import express from 'express'
import multer from 'multer'

const app = express()
const mult = multer()

app.use(mult.array())
app.use(express.static('public'))

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'ISP'
}).promise();



app.get('/',(req,res)=>{
    res.send('ISP API')
})

//customer routes
app.get('/getAllCustomers', async function(req,res){
    const result = await pool.query("SELECT * FROM Customers")
    res.send(result[0])
})

app.get('/getCustomerById/:custId', async function(req,res){
    try{
        const allCustomers = await pool.query("SELECT * FROM Customers")
        const customer = allCustomers[0].find(c => c.custId == parseInt(req.params.custId))
        if(!customer){
            res.status(404).send("Customer Not Found")
        }
        else{
            const result = await pool.query(`SELECT * FROM Customers WHERE custId = ?`,[req.params.custId])
            const planEndDate = result[0][0]['planEndDate']
            const curTime = Date.now()
            if(planEndDate<curTime){
                result[0][0]['isActive'] = 0
                result[0][0]['dataUsed'] = 0
                await pool.query(`UPDATE Customers SET isActive=?, dataUsed=? WHERE custId=?`, [0, 0, req.params.custId])
            }
            res.send(result[0][0])
        }
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }
})

app.get('/deleteCustomer/:custId', async function(req,res){
    try{
        const allCustomers = await pool.query("SELECT * FROM Customers")
        const customer = allCustomers[0].find(c => c.custId == parseInt(req.params.custId))
        if(!customer){
            res.status(404).send("Customer Not Found")
        }
        const result = await pool.query(`DELETE FROM Customers WHERE custId = ?`,[req.params.custId])
        res.send("Successful")
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }

})

app.post('/addCustomer',async function(req,res){
    var name = req.body.name
    var hashedPassword = req.body.hashedPassword
    var address = req.body.address
    var longitude = req.body.longitude
    var latitude = req.body.latitude
    var phoneNo = req.body.phoneNo
    var email = req.body.email
    var customerSince = req.body.customerSince
    var planEndDate = req.body.planEndDate
    var planId = req.body.planId
    var isActive = req.body.isActive

    try{
        const result = await pool.query('INSERT INTO Customers(name, hashedPassword, address, longitude, latitude, phoneNo, email, customerSince, planEndDate, planId, isActive, dataUsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);',[name,hashedPassword,address,longitude,latitude,phoneNo,email,customerSince,planEndDate,planId,isActive])
        const myObj = {
            "custId":result[0].insertId,
            "name": name,
            "hashedPassword": hashedPassword, 
            "address": address,
            "longitude": longitude,
            "latitude": latitude,
            "phoneNo": phoneNo,
            "email": email,
            "customerSince": customerSince,
            "planEndDate":  planEndDate,
            "planId": planId,
            "isActive": isActive,
            "dataUsed": 0
        }
        console.log(name)
        res.send(myObj)
    }
    catch(e){
        console.log(e)
        res.status(403).send()
    }

})

app.post('/updateCustomerPlan',async function(req,res){
    var custId = req.body.custId
    var planEndDate = req.body.planEndDate
    var planId = req.body.planId
    var isActive = req.body.isActive

    try{
        const result = await pool.query(`UPDATE Customers SET planEndDate=?, planId=?, isActive=? WHERE custId=?`,[planEndDate,planId,isActive,custId])
        res.send("Successful")
    }
    catch(e){
        console.log(e)
        res.status(403).send("Failed")
    }

})

app.post('/updateCustomerPassword',async function(req,res){
    var custId = req.body.custId
    var oldHashedPassword = req.body.oldHashedPassword
    var newHashedPassword = req.body.newHashedPassword

    try{
        const result = await pool.query(`SELECT hashedPassword FROM Customers WHERE custId=?`,[custId])
        if(oldHashedPassword==result[0][0]['hashedPassword']){
            const result = await pool.query(`UPDATE Customers SET hashedPassword=? WHERE custId=?`,[newHashedPassword,custId])
            res.send("Successful") 
        }
        else{
            res.send('Incorrect Password')
        }
    }
    catch(e){
        console.log(e)
        res.status(403).send("Some Error Occurred")
    }

})

app.post('/updateCustomer', async function(req, res) {
    const { custId, name, hashedPassword, address, longitude, latitude, phoneNo, email, customerSince, planEndDate, planId, isActive } = req.body;
  
    try {
      const result = await pool.query('UPDATE Customers SET name=?, hashedPassword=?, address=?, longitude=?, latitude=?, phoneNo=?, email=?, customerSince=?, planEndDate=?, planId=?, isActive=? WHERE custId=?', [name, hashedPassword, address, longitude, latitude, phoneNo, email, customerSince, planEndDate, planId, isActive, custId]);
      console.log(name);
      res.send("Successful");
    } catch(e) {
      console.log(e);
      res.status(403).send("Failed");
    }
});

//plan routes
app.get('/getAllPlans', async function(req,res){
    const result = await pool.query("SELECT * FROM Plans")
    res.send(result[0])
})

app.get('/getPlanById/:id', async function(req,res){
    try{
        const allPlans = await pool.query("SELECT * FROM Plans")
        const plan = allPlans[0].find(c => c.id == parseInt(req.params.id))
        if(!plan){
            res.status(404).send("Id Not Found")
        }
        const result = await pool.query(`SELECT * FROM Plans WHERE id = ?`,[req.params.id])
        res.send(result[0][0])
    }
    catch(e){
        res.status(404).send("Plan not found")
    }
})

app.get('/deletePlan/:id', async function(req,res){
    try{
        const allPlans = await pool.query("SELECT * FROM Plans")
        const plan = allPlans[0].find(p => p.id == parseInt(req.params.id))
        if(!plan){
            res.status(404).send("Plan Not Found")
        }
        const result = await pool.query(`DELETE FROM Plans WHERE id = ?`,[req.params.id])
        res.send("Done")
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }

})

app.post('/addPlan',async function(req,res){
    var name = req.body.name
    var duration = req.body.duration
    var speed = req.body.speed
    var isLimited = req.body.isLimited
    var dataLimit = req.body.dataLimit
    var price = req.body.price

    try{
        const result = await pool.query(`INSERT INTO Plans (name, duration, speed, isLimited, dataLimit, price) VALUES (?, ?, ?, ?, ?, ?);`,[name,duration,speed,isLimited,dataLimit,price])
        res.send(result[0])
    }
    catch(e){
        console.log(e)
        res.status(403).send()
    }

})

//server routes
app.get('/getAllServers', async function(req,res){
    const result = await pool.query('SELECT * FROM Servers')
    res.send(result[0])
})

app.get('/getServerById/:id', async function(req,res){
    try{
        const allServers = await pool.query("SELECT * FROM Servers")
        const server = allServers[0].find(c => c.id == parseInt(req.params.id))
        if(!server){
            res.status(404).send("Server Not Found")
        }

        const result = await pool.query(`SELECT * FROM Servers WHERE id = ?`,[req.params.id])
        res.send(result[0][0])
    }
    catch(e){
        res.status(404).send("Server not found")
    }
})

app.get('/deleteServer/:id', async function(req,res){
    try{
        const allServers = await pool.query("SELECT * FROM Servers")
        const server = allServers[0].find(p => p.id == parseInt(req.params.id))
        if(!server){
            res.status(404).send("Server Not Found")
        }
        const result = await pool.query(`DELETE FROM Servers WHERE id = ?`,[req.params.id])
        res.send()
    }
    catch(e){
        console.log(e)
        res.status(400).send()
    }

})

app.post('/addServer',async function(req,res){
    var longitude = req.body.longitude
    var latitude = req.body.latitude
    var type = req.body.type
    var isActive = req.body.isActive
    var loadOnServer = req.body.loadOnServer

    try{
        const result = await pool.query(`INSERT INTO Servers (longitude, latitude, type, isActive, loadOnServer) VALUES (?,?,?,?,?);`,[longitude,latitude,type,isActive,loadOnServer])
        res.send(result[0])
    }
    catch(e){
        console.log(e)
        res.status(403).send()
    }

})

app.post('/updateServer',async function(req,res){
    var id = req.body.id
    var longitude = req.body.longitude
    var latitude = req.body.latitude
    var type = req.body.type
    var isActive = req.body.isActive
    var loadOnServer = req.body.loadOnServer

    try{
        const result = await pool.query(`UPDATE Servers SET latitude=?, longitude=?, type=?, isActive=?, loadOnServer=? WHERE id=?;`,[longitude,latitude,type,isActive,loadOnServer,id])
        res.send("Successful")
    }
    catch(e){
        console.log(e)
        res.status(403).send("Failed")
    }
})

//listener
app.listen(3000, () => {
    console.log("Listening of port 3000...")
})