

## Instructions to run the code

* Run Express Backend:

cd backend/
npm install
npm run server


* Run React Frontend:

cd frontend
npm install/
npm start

- The frontend is hosted on port 3000 and backend on port 3001

## To run docker

* In the root directory run 

sudo docker-compose up --build


## Assumptions

* For Registration:
    * Age shaould be +ve
    * Contact Number is of 10 digits
    * A user can report a post multiple times
    * All details cannot be edited
    * A user is allowed to report their own post
    * All substrings of banned words are replaced. 
    * If a user is blocked, they are kicked out of the subgreddiit and cannot request to join again just like any other user.
    * If a report is ignored or blocked , it is not deleted from database
    * The tokens in localStorage are not changed
    * In CAS/Google login user is taken to a different page after login for entering other ueful details.
    * username and email are unique
