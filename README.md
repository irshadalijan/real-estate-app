# Real Estate App
## Backend API (server)
## Local Setup with Docker
Make sure Docker is installed
- Rename `server/env.sample` to `server/.env` file
- First build the docker image, open the terminal in root directory, run the following command
  - `docker-compose up -d server`

## Local Setup without Docker
- Make sure mongodb is installed and running
- Update mongodb url to mongodb://127.0.0.1:27017 or leave it empty as default is already set.
  Run following commands to run backend
  - `cd server`
  - `npm install`
  - `npm start`

API is up and running and accessible via [Backend URL](http://127.0.0.1:5001)


## Web app (Client)
### With Docker
  - If using Docker then you don't have do anything as client should be running in docker already.
  
### Without Docker
  - `cd Client` 
  - `npm install`
  - `npm start`

- You should be able to access web app via [Frontend URL](http://localhost:3000/) 


