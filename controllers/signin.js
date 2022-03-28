
const handleSignin = ( db, bcrypt) => (req, res) => {

    const { email, password} = req.body;
   
    if(!email || !password){
        return res.status(400).send('Email & password are required');
        }

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
}

export {handleSignin};