# fso

<https://fullstackopen.com/en/about/>  
FullStackOpen is a web development course organized by University of Helsinki.

Parts 0, 1, and 2 focused on the frontend, which I keep in [this](https://github.com/dj-mc/esb-r) repo.

I've finished part 3 and I'm currently working on part 4, which I keep here.
As I complete the course exercises I also take creative liberties on how the
project is both written and organized, with its intended functionality intact.
For example: during parts 0-2 I configured esbuild + typescript to render
react's jsx sugar, instead of using [CRA](https://create-react-app.dev/),
webpack, babel, etc. to compile jsx; I wanted to learn those specific tools.

## notes to myself

You may need to whitelist your IP address.

`heroku login`  
`heroku config:set MONGODB_URI=<uri>`  
`git push heroku HEAD:master`

`dotenv` and `cross-env` are installed as normal dependencies because heroku was
not installing dev deps last I tried.
