# inventory-management-system

### Project Overview
1. Inventory Management System using MERN stack.
2. An inventory management system to ease the management of inventory for various types on establishment.

### Flow Of Data
There are 3 types of user. Admin, Warehouse Staff, Store Manager.
Admin creates new products and send it to warehouse staff. warehouse staff may receive or reject based on warehouse condition. If received the product stock added to warehouse stock with the product information. Else product information stored but stock will not add. Admin can accept request from store manager to send X product Y amount. Admin can reject or accept the request. If accepted, the request goes to warehouse staff and base don warehouse the can or can not ship that product. If admin rejects the request, store manager can not get the product. Store manager can add new product but to add stock they must request for stock to admin. Here admin plays the role of business owner. All 3 recieve level based data to conduct their affairs. Store manager only has the data to manage his own store. warehouse staff has only the data for warehouse. Admin has access to all types of data with overview.

### How To Run
1. NodeJS must be installed. For backend, use "npm i" command to install necessary node modules.
2. For frontend, "npm i" to install necessary modules.
3. Local mongodb server needed to connect to database. Database Name:inv-management-sys. necessary database collection will be created automatically for new operation. inv-management-sys hase bson file that can be imported to mongodb to get used database.
4. Add .env file that has following lines (backend only),
PORT=<free port of choiced. example: 4000>
MONGODB_URI=<uri for local mongodb server with database name. example: "mongodb://localhost:27017/inv-management-sys">
JWT_SECRET=<Anything, this is for authentication purpose only for backend server. example: helloworld>
5. In case using provided inv-management-sys, username: admin, password:12345678, for other type of user example: username: ws00<number>, password: ws<number>2345678

### Features
1. Admin can register New Staff (warehouse staff, store manager)
2. Authtication and proper Authorization for data access and performing actions.
3. Dashboard to have overview based on authorization level. (Admin get all essential data, Warehouse Staff has only access to warehouse related data, Store Manager only has access to their own store related data). Addision of graph for better visualization.
4. Product addision, track of product or stock activity, track state of product through product state history.
5. Hanlding many types of error automatically. Precausions taken for accidental wrong inputs or clicks.
6. Implementaion of controlled access. Various measurements taken to handle unauthorized access.
7. Contrast color-scheme for better visual output.
