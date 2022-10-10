# fso

<https://fullstackopen.com/en/about/>  
FullStackOpen is a web development course organized by University of Helsinki.

Parts 0, 1, and 2 focused on the frontend, which I keep in [this](https://github.com/dj-mc/esb-r) repo.

I've finished part 3 and I'm currently working on part 4, which I keep here.
As I complete the course exercises I also take creative liberties in how the
project is written/organized, with its intended functionality intact.

For example: during parts 0-2 I configured esbuild + typescript to render
react's jsx sugar, instead of using [CRA](https://create-react-app.dev/),
webpack, babel, etc. to compile it. I wanted to learn typescript but the course
doesn't cover it until much later, and so I've used esbuild to compile that too.

## notes to self

`heroku login`  
`heroku config:set MONGODB_URI=<uri>`  
`git push heroku HEAD:master`

`dotenv` is installed as a normal dependency because heroku was not installing
dev deps last I tried. I would like to remove this package if possible.

FullStackOpen wants me to install `cross-env` and `express-async-errors`, but
this project omits their usage due to a lack of maintenance/interest.
