
# Internet Service Provider API

This is REST API for my ISP and ISP Admin applications.

**This App works along with my 2 other projects**:
1. [ISP](https://github.com/nishita0512/ISP): Admin control for this Application
2. [ISP Admin](https://github.com/nishita0512/ISPAdmin): A server for communication between Admin and User. 

## Set up:

1. Install modules:
2. Change username and password for mysql database in app.js
3. Change the port according to your need in app.js at line 297.
4. To run the application:
    ```nodemon app.js```
    or
    ```node app.js```

## Connect Apps on LAN:
1. Check the local ip address of your computer (It is usually like: 192.168.x.xxx).   
a. Windows (in cmd): `ipconfig`   
b. Linux: `ifconfig`   
2. Add this local ip address as BASE_URL to utils.Constants object in ISP and ISP Admin applications
3. Run the Applications

## SQL Queries:
Customer:   
   
```CREATE TABLE Customers(custId INT AUTO_INCREMENT PRIMARY KEY, hashedPassword VARCHAR(255), name VARCHAR(255),address VARCHAR(255),longitude DECIMAL(20, 15),latitude DECIMAL(20, 15),phoneNo VARCHAR(20),email VARCHAR(255),customerSince Long,planEndDate Long,planId INT,isActive BOOLEAN ,dataUsed LONG, FOREIGN KEY (planId) REFERENCES Plans(id)) AUTO_INCREMENT=100000;```

```INSERT INTO Customers(name, hashedPassword, address, longitude, latitude, phoneNo, email, customerSince, planEndDate, planId, isActive, dataUsed) VALUES ('Name', '07480fb9e85b9396af06f006cf1c95024af2531c65fb505cfbd0add1e2f31573', 'address', 19.105798820036836, 73.14341412531789, '5551234891', 'test@example.com', 1641019138000, 1682674087000, 1, true, 0),;```
   
Plans:   
   
```CREATE TABLE Plans (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255),duration INT,speed INT,isLimited BOOLEAN,dataLimit INT,price INT);   ```
   
```INSERT INTO Plans (name, duration, speed, isLimited, dataLimit, price) VALUES  ('Basic Plan', 30, 10, true, 1000, 499), ('Standard Plan', 60, 20, false, NULL, 999), ('Premium Plan', 90, 50, true, 5000, 1599);   ```
   
Servers:   
   
```CREATE TABLE Servers (id INT AUTO_INCREMENT PRIMARY KEY,longitude DECIMAL(20,15),latitude DECIMAL(20,15),type VARCHAR(255),isActive BOOLEAN,loadOnServer INT);   ```
   
```INSERT INTO Servers (longitude, latitude, type, isActive, loadOnServer) VALUES(19.01417798695729, 72.8469782518405, 'Large', true, 50),(19.216927235279993, 73.15023912110335, 'Medium', true, 80),(19.212712678509945, 72.97102464261462, 'Medium', true, 40),(19.136765834858682, 72.83946284118161, 'Small', true, 70),(19.077850808312686, 73.01370902899161, 'Medium', false, 30);```
   
## Acknowledgements

**Node Modules used:**

1. mysql2
2. express
3. multer
4. nodemon(optional)

---
