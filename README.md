
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
## Acknowledgements

**Node Modules used:**

1. mysql2
2. express
3. multer
4. nodemon(optional)

---
