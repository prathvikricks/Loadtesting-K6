**Node.js Application: Authentication and Token Management**

**Overview**
This application is a web-based authentication system built with Node.js, Express, and JWT. It supports session-based login/logout and token-based authentication, providing both HTML and JSON responses. The app is designed to handle secure operations and tokenized access for APIs.






**Features**
Session-based Login
Secure login using sessions.
User credentials are validated against default credentials.






**Token-based API Access**
JWT tokens for secure API access.
Token expiry and validation mechanisms.



**User Dashboard**

A private route for authenticated users.


**Endpoints for Testing**
/time: Returns the current server time.
/random-message: Provides random motivational messages.


**Prerequisites**
Node.js: Ensure Node.js (version 14 or above) is installed.
npm: Comes with Node.js for package management.






**Installation**

Step 1: **Clone the Repository**

git clone https://github.com/prathvikricks/Loadtesting-K6.git


Step 3: **Start Project**

node server.js


Now The loadtesting tool setup 


Here we are using K6 with influxDB and Grafana we have to setupt these three trios to able to see the data and visulaize it.


**First i need to Pull all these files and run in docker 
**


I have InfluxDb and Grafana image that are running in container, when they are running i need to create a load testing script for K6 which is written in the files.

To run the k6 we need to install K6 first using brew install k6 and then use command ***k6 run --out influxdb=http://localhost:8086/k6 loadtest.js***

The above command will run the k6 and pushes the data into influxDB which is then used in Grafana as Datasource.

<img width="973" alt="Screenshot 2025-01-14 at 6 26 49 PM" src="https://github.com/user-attachments/assets/0c9ad9b7-6b0c-4a3b-9445-15e9e1d82bce" />

This is the setup for influxDB on Grafana
<img width="1470" alt="Screenshot 2025-01-14 at 6 27 26 PM" src="https://github.com/user-attachments/assets/73538bfa-f801-4902-af25-15248e88b1b1" />


<img width="1179" alt="Screenshot 2025-01-14 at 6 28 04 PM" src="https://github.com/user-attachments/assets/f7c78839-2638-4ddd-abed-cb23c4e98602" />

Then finally using a DashBoard Code **14801** for K6 i can visualize the Data on the Grafana

<img width="1470" alt="Screenshot 2025-01-14 at 6 29 22 PM" src="https://github.com/user-attachments/assets/7bbf4d20-83bd-47b2-ae08-89b0c6919993" />

<img width="1461" alt="Screenshot 2025-01-14 at 6 29 48 PM" src="https://github.com/user-attachments/assets/405f68c0-5b64-47d4-a7d9-ca8966ad9a3d" />



