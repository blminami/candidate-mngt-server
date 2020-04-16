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

npm run setup

TODO:
filtru - search by:

1. nume
2. skills
3. yearsOfExperience
4. search for key words in -> about, experience, skills, education, certifications

SELECT id, email FROM candidates WHERE to_tsvector(certifications) @@ to_tsquery('french & language');
