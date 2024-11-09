# cs546_wn_group1_final_project
Final project repository for CS546-WN Group 1 for the fall 2024 semester at Stevens.


Project Structure and building: 

The idea is to separate concerns for simplicity - 

DataAccess Layer - goal is to have this layer (files within the /data directory) just access, remove, update, and create data

These methods should be accessible to every method within the DomainLayer. Preferably we should organize this information by 
the collection we want to work with e.g. users, etc. 

We can also create templates, or data access objects, which are "empty" templates that we can use (e.g. we can create 
a users object template, where we can now use this template throughout the system to represent a user object)



Domain Layer - goal of this layer is to handle any processesing of the data previous to being inserted into the data. 
This layer is meant to have the data passed to it from the routes (controllers if you are familiar with MVC) and 
sends the processed (data with some changes to it) back to the DataAccess Layer which will handle storage 

e.g. Data comes in through routes (lets say a GET request which involves aggregating information from multiple collections)

We use the Domain Layer to actually aggregate the data by calling the get methods from different collections, filtering out the 
information that is not needed, storing in an object, and returning it to the calling function (the routes)

We present this data in some format to the user. This brings us to the UI layer: 

This layer is exactly what it sounds - just where we store the UI. normally, we would have a separate code entity that would 
have its own routes where it would make requests to the routes from, however since we are using express-handlebars, for our purposes 
I suggest we use it strictly to store UI files for viewing and simplicity of codebase navigating 

to debug and start: 

cd DomainLayer

npm start 

this will start the server where you can make requests