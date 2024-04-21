import os
import requests
import datetime
from flask import Flask, session, render_template, request, redirect, jsonify
from flask_session import Session
from sqlalchemy import create_engine,text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker
from datetime import datetime
import uuid


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


# Check for environment variable 
#set os environment variable
os.environ["DATABASE_URL"] = "postgresql://postgres:hideurs06@localhost:5432/postgres"

if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))

db = scoped_session(sessionmaker(bind=engine))

@app.route("/")
def index():
    return redirect("/login")

# Login Page
@app.route("/login", methods=["GET", "POST"])
def login():
    try:
                
        if session.get("user_id"):
            return render_template("index.html",message="",user_name=session.get("user_name"), user_email=session.get("user_email"), user_id=session.get("user_id"))  
        
        if request.method == "POST":
            loginEmail = request.form.get("email")
            loginPassword = request.form.get("password")
        
            result = db.execute(text("SELECT * FROM users WHERE email = :email AND password=:password"), {"email":loginEmail, "password":loginPassword}).fetchone()
            
            if result is None:
                return render_template("login.html", message="Invalid email or password.")
            
            session["user_id"] = result[0]
            session["user_email"] = result[1]
            session["user_name"] = result[2]

            return redirect("/")
    
        if request.method == "GET":
            return render_template("login.html")
        
    except SQLAlchemyError as e:
        print(str(e))
  


# Register Page
@app.route("/register", methods=["GET", "POST"])
def register():
    
    if session.get("user_id"):
        return redirect("/login")
    
    if request.method == "POST":
        registerUsername = request.form.get("username")
        registerEmail = request.form.get("email")
        registerPassword = request.form.get("password")
        userid = str(uuid.uuid4())

        userquery = text("SELECT * FROM users WHERE username = :username")
        emailquery = text("SELECT * FROM users WHERE email = :email")
    
        userExists = db.execute(userquery, {"username": registerUsername}).fetchone() 
        emailExists = db.execute(emailquery, {"email": registerEmail}).fetchone() 
    
        if not userExists and not emailExists:
            db.execute(text("INSERT INTO users (id,email,username, password) VALUES (:id,:email,:username, :password)"), {"id":userid,"email":registerEmail,"username":registerUsername, "password":registerPassword})
            db.commit()
            
            session["user_id"] = userid
            session["user_name"] = registerUsername
            session["user_email"] = registerEmail
            
            return redirect("/")
        
        return render_template("signup.html", message="User with username or email already exists.")
    if request.method == "GET":
        return render_template("signup.html")

#Home Page
@app.route("/home", methods=["GET", "POST"])
def home():
    if session.get("user_id") is None:
        return redirect("/login")
    
    if request.method == "GET":
        return render_template("index.html", user_name=session.get("user_name"))


# Profile Page
@app.route("/profile", methods=["GET", "POST"])
def profile():
    
    if session.get("user_id") is None:
        return redirect("/login")
    
    if request.method == "POST":
        
        profileUpdateUsername = request.form.get("username")
        userid = session.get("user_id")
        profileUpdatePassword = request.form.get("password")

        userquery = text("SELECT * FROM users WHERE id = :id")
        
        userExists = db.execute(userquery, {"id":userid}).fetchone()
        
        if userExists:
            
            if userExists[2] == profileUpdateUsername:
                profileUpdateUsername = userExists[2]
            else:
                profileUpdateUsername = profileUpdateUsername
            
            if profileUpdatePassword is not None and profileUpdatePassword != "":
                profileUpdatePassword = profileUpdatePassword
            else:
                profileUpdatePassword = userExists[3]
                
            db.execute(text("UPDATE users SET username = :username, password = :password WHERE id = :id"), {"username": profileUpdateUsername,"password":profileUpdatePassword, "id": userid})
            db.commit()
            
            session["user_id"] = userid
            session["user_name"] = profileUpdateUsername
            
            return redirect("/home")
        
        return render_template("profile.html", message="User with username already exists.", user_name=session.get("user_name"), user_email=session.get("user_email"), user_id=session.get("user_id"))
        
    if request.method == "GET":
        return render_template("profile.html", user_name=session.get("user_name"), user_email=session.get("user_email"), user_id=session.get("user_id"))





# Logout Page
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")



if __name__ == '__main__':
    app.run(debug=True)