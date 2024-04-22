# ENGO-651-Final-Project-Group-4

* John Oluwamayomikun Oyeniyi (30158233) : Development and QA
* Eric Akuamoah (30191151) : Development and Presenter

### Project Overview:

The project's goal is to create an app that can assist in recommending the best place to get short term stay at preferred locations in Calgary. Information about the short term rentals from the city of calgary is used. The nearest available accomodation to users location can be seen following user login.


### Required libraries
* Flask
* Flask-Session
* psycopg2-binary
* psycopg2-binary
* SQLAlchemy
* requests
* flask_sqlalchemy
* SQLAlchemy You can find all of these libraries in the requirements.txt and install all of them by running this command pip3 install -r requirements.txt in the terminal window.

### Some Program files

* map.js - contains logic for home page including map creation and analytics
* index.html - home page template
* login.html - login page template
* profile.html -  updates user profile templates
* signup.html - register page template
* app.py - app file, contains GET/POST request logic for each page
* usertable.sql - where data about users are stored
* main.css - has styling of the pages

### Restful API Backend

* Login Page: Post request to authenticate user and check credentials in database / Get request to render template
* Profile Page: Post request to add new user record to database / Get request to render template
* Home (index) Page: Post request to add update to update list / Get request to render template and get list of updates from database
* Signup Page: Get request to render template

### Use Cases
* Users can search available short term rentals in the city of calgary.
* Users can see a heat map of the traffic incidents in the city
* Users can share live location on the map
* users can run analyses with their live location

### Commands to run
pip/pip3 install requirement.txt
set FLASK_APP=app.py
set FLASK_DEBUG=1
set DATABASE_URL=###
run app.py
