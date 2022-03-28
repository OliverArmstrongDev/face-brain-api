import express, { response } from 'express';
import bcrypt  from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import {handleRegister} from './controllers/register.js';
import {handleSignin} from './controllers/signin.js';
import { handleProfile } from './controllers/profile.js';
import { handleImage, handleAPICall } from './controllers/image.js';

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


const app = express();

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


app.get('/', (req, res) => {
    db.select('*').from('users')
    .then( data => {
        res.json(data);
    });
});

app.post('/register', (req, res) => {
    handleRegister(req, res, db, bcrypt)
});

//advance currying?
app.post('/signin', handleSignin(db, bcrypt));

app.get('/profile/:id', (req, res) => {
    handleProfile(req, res) 
    
    handleProfile(req, res, db )
});

app.put('/image', (req, res) => {
    handleImage(req, res, db )
});

app.post('/imageurl', (req, res) => {
    handleAPICall(req, res) 
});

app.listen(3000, () => {
    console.log('listening on 3000');
});

