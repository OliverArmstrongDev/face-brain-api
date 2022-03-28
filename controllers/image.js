import Clarifai from 'clarifai';

const cApp = new Clarifai.App({
    apiKey: 'd9cd484adfb14fcf9dfaf48337fc2b5a'
   });


const handleAPICall = (req, res) =>{
    console.log('server input', req.body.input);
    
    cApp.models.predict(
        Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {res.json(data)})
        .catch(err => res.status(400).json('Unable to work with API'))
     
    };

const handleImage = (req, res, db) => {
    
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
};

export {handleImage, handleAPICall};
