## About The Project

Server application for candidate management softaware.

- Automate the process of creating a candidate profile by simply uploading the candidate's CV and extracting all the data on server-side.
- Advanced search criteria and flexible filters defined by the client applications can be applied on the candidates profiles for retreiving the perfect match for a job
- Manage all the emails, jobs, interviews and events as part of the same software
- Never miss a scheduled event or interview by enabling the push notifications
- Analytics dashboard

## Server structure

**public** - This is where all of your static web files will go, including HTML, CSS, front-end JavaScript, images, and fonts. ‘Static’ means that these files don’t contain any dynamic server-side information.

**route** - This is where we will keep the JavaScript files that are responsible for calling certain functions based on the route a user requests. Routes are the different paths within our web app that follow the root domain, like ‘/’ or ‘/contact’, or ‘/about’.

**controller** - This is where we will keep the JavaScript files that contain the functions we want to run depending on the route. Most of these files will be referenced by files in our routes folder.

**models** - This is where we will keep all files that are responsible for interfacing with our database.

_api/route-name_ -> all routes prefixed with `api`

## Client - server configuration

`app.use(express.static(path.join(__dirname, '../client/dist')));`

**app.get('\*', (req, res) => {
res.sendFile(path.join(\_\_dirname, '../client/dist/index.html'));
});** -> to be inserted after all routes

npm install --save-dev @babel/core @babel/node
npm install --save babel-polyfill

npm run setup
