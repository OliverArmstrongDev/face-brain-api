

const handleRegister = (req, res, db, bcrypt) => {
    const saltRounds = 10;
    
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);

    if(!email || !name || !password){
    return res.status(400).send('Name, email & password are required');
    }
    
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
}

export {handleRegister};

 