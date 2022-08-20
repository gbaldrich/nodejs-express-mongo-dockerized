# CREATE APP

- [ ] Install express and mongoose modules: 
```bash
npm install express mongoose
```
- [ ] Modify the package.json file to include a script for running the app using the command `nodemon index.js` in order to auto-reload the app when changes are made 
  
  **Note:** nodemon most be installed in the Dockerfile

  ```json
  {
    "dependencies": {
      "express": "^4.18.1",
      "mongoose": "^6.5.2"
    },
    "scripts": {                      
      "start": "nodemon index.js"    
    }                                 
  }
  ```
- [ ] Create the file `index.js`
- [ ] Code the app

	- Import the express module.
	
	```js
	const express = require('express')	
	```
	
	- Create a new express application and create a new constant with the selected port value.
	
	```js
	const app = express()
	const port = 3000
	```
	
	- Create a listener on the selected port.     ***Note:** always at the end of the file*
	
	```js
	app.listen(port, () => console.log(`App listening on port ${port}!`))
	```
	
	- Import the mongoose module.
	
	```js
	const mongoose = require('mongoose')	
	```
		
	- Create the connection URI and connect with the database.
	
	```js
  const MONGO_USER = 'user'
  const MONGO_PASSWORD = 'password'
  const MONGO_HOST = 'mongo-container' // Dockerized service name (in stead of 'localhost')
  const MONGO_PORT = '27017'
  const MONGO_DB = 'mydb' 	// Database name

  const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
	
	//Connect to DB
	mongooose.connect(mongoURI, { useNewUrlParser: true })
	```
		
	- Create a new Model.
	
	```js
	const Animal = mongooose.model('Animal', {
		name: String,
		age: Number,
		type: String
	})
	```
		
	- Create a new GET route for the application in the form of /find-all.
		- Read all the animals from the database (async/await)
	
	```js
	app.get('/find-all', 
	  async (req, res) => {
	    const animals = await Animal.find()
		console.log('Listing data')
	    res.send(animals)
	  }
	)
	```
	
	- Create a new GET route for the application in the form of /create
  	- Create a new animal in the database (async/await)
  	
	```js
	app.get('/create',
    async (req, res) => {
	    await Animal.create({
	      name: 'Lion',
	      age: 10,
	      type: 'Mammal'
	    }).then(() => {
	      console.log('Animal created')
		  res.send('Animal created')
	    })
	  }
	)
	```
	
	The full code should look like follows:
	
	```js
	const express = require('express')
	const app = express()
	const port = 3000

	const mongooose = require('mongoose')

	const MONGO_USER = 'user'
	const MONGO_PASSWORD = 'password'
	const MONGO_HOST = 'mongo-container'
	const MONGO_PORT = '27017'
	const MONGO_DB = 'mydb'

	const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

	mongooose.connect(mongoURI, { useNewUrlParser: true })

	const Animal = mongooose.model('Animal', {
	  name: String,
	  age: Number,
	  type: String
	})

	app.get('/find-all',
	  async (req, res) => {
	    const animals = await Animal.find()
	    res.send(animals)
	  }
	)

	app.get('/create',
    async (req, res) => {
	    await Animal.create({
	     name: 'Lion',
	      age: 10,
	      type: 'Mammal'
	    }).then(() => {
	      console.log('Animal created')
	    })
	  }
	)

	app.listen(port, () => console.log(`App listening on port ${port}!`))
	```
	
- [ ] Create a Dockerfile.dev file
	
	
	```dockerfile
	FROM node:18-apline		# Select the base image
	RUN npm install -g nodemon 	# Install nodemon globally in the container system path in order to reload the app when changes are made
	WORKDIR /app			# Estabilish the route of containter working directory
	COPY package*.json .		# Copy the packages*.json from the app folder
	RUN npm install		# Install all the dependences
	EXPOSE 3000			# Expose the port 3000
	CMD npm start			# Run the app
	```
- [ ] Create a docker-compose.yml file
    
    ```yml
    version: '3.9'

    services:
        node:
            build: 
                context: .
                dockerfile: Dockerfile.dev
            ports:
                - "3000:3000"
            links:
                - mongo-container
            volumes:
                - ./index.js:/app/index.js
        mongo-container: # This name most be igual to MONGO_HOST at index.js
            image: mongo:4.2.22-rc0-bionic
            #ports: # By commenting this, only NodeJs can access to MongoDb database
                #  - "27017:27017"
            environment:
                - MONGO_INITDB_ROOT_USERNAME=user
                - MONGO_INITDB_ROOT_PASSWORD=password
            volumes:
                - mongo-data:/data/db
    volumes:
    mongo-data:
    ```
	
	
	```