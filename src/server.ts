import express, { Router, Request, Response, query } from 'express';
// import bodyParser from 'body-parser'; deprecated
const bodyParser = require('body-parser')

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get( "/cars/", 
    ( req: Request, res: Response ) => {
      let { make } = req.query
      
      let cars_list = cars;

      if (make) {
        cars_list = cars.filter((cars)=> cars.make===make);
      }

      //on retourne toujours la liste lorsque la requete réussi
      res.status(200).send(cars_list);
  } );


  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  
  app.get( "/cars/:id", 
  ( req: Request, res: Response ) => {
    let { id } = req.params;

    if ( !id ) {
      return res.status(400)
                .send(`id is required`);
    }

    //on essaie de trouve run car en fonction de l'id
    const car1 = cars.filter((cars)=> cars.id== Number(id));

    //car non trouvé
    if(car1 && car1.length ===0){
      return res.status(404).send('car is not found');
    }

    //si le car est trouvé
    return res.status(200).send(car1);
} );

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost

  app.post("/cars/", (req: Request, res: Response)=>{
    let {make, type, model, cost, id}=req.body;

    //s'assuerer que toutes les variables sont définies
    if(!id || !type || !model || !cost){
      //message envoyé si l'une des valeurs vient à manquer
      return res.status(400)
                .send(`make, id, type, model, cost are required`);
    }

      //si on obtient plutot un bon resultat
    const new_car: Car = {make:make, type:type, model:model, cost:cost,id:id}

      //ajout de la liste des car à notre variable locale
      cars.push(new_car);

      //envoyer l'objet car comme une reponse
      res.status(201).send(new_car);
  });
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
