import express, { response } from 'express';
import bcrypt  from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'Ollie',
      password : '',
      database : 'face-brain'
    }
  });

const saltRounds = 10;
const app = express();

// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


////

app.get('/', (req, res) => {
    db.select('*').from('users')
    .then( data => {
        res.json(data);
    });
    
    
})



app.post('/signin', (req, res) => {

    const { email, password} = req.body;
    
    db.select('email', 'hash').from('login')
        .where({email})
        .then(data=> {
        const isMatch = bcrypt.compareSync(password, data[0].hash); 
        
            if(isMatch) 
                {
              return db.select('*').from('users')
                .where({email})
                .then(user => {
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json('Unable to get user'))
                }
                else{
                    res.status(400).json('Wrong username or password');
                }
            
    })
    .catch(err => res.status(400).json('Wrong credentials'))
})


app.post('/register', (req, res) => {
    
    const {email, name, password} = req.body;

    if(!email || !name || !password){
    return res.status(400).send('Name, email & password are required');
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    
    if(!hash){
        return res.status(400).send('Password error');
    }

      db.transaction(trx =>{
          trx('login')
          .insert({
              hash: hash,
              email: email
          })
          .returning('email')
          .then(LoginEmail => {
             return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: LoginEmail[0].email,
                joined: new Date()
                })
            .then(user => {
                res.json(user[0])
                })
        })
        .then(trx.commit)
        .catch(err => {
            trx.rollback
             res.json(err) //remove database error messages
        })
      })
       
    .catch(err => res.status(400).json('Unable to register'))
})


app.get('/profile/:id', (req, res) => {
    
    const {id} = req.params;
    
    console.log(id);
    



    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
            res.json(user[0])
        }else {
            res.status(400).json('Not found');
        }
    })
    .catch(err =>{
        res.status(400).json('Not found');
    })
})


app.put('/image', (req, res) => {
    
    const {id} = req.body;
    
    db('users')
    .where({id})
    .increment('entries', 1)
    .returning('entries')
    .then(ent => {
        res.json(ent[0].entries);
    })
    .catch(err =>{
        res.status(400).json(`Can't get entries`);
    })
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries); //returns as object
    //     } 
    // })
   
})
app.listen(3000, () => {
    console.log('listening on 3000');
    
})

