# fso

<https://fullstackopen.com/en/about/>  
FullStackOpen is a web development course organized by University of Helsinki.

Parts 0, 1, and 2 focused on the frontend, which I keep in [this](https://github.com/dj-mc/esb-r) repo.

I've finished part 3 and I'm currently working on part 4, which I keep here.
I've completed every exercise thrown at me (so far). I've also taken creative
liberties on how the project is both written and organized, with its intended
functionality intact. For example, for parts 0-2 I skipped straight to using
a custom configuration of esbuild + typescript instead of using CRA, webpack,
babel, etc. to compile jsx; because I wanted to learn those specific tools.

Learning to harness strict types onto react code was certainly interesting.  
I'm not using esbuild + typescript here (the backend) because there is no jsx to compile.

## notes to myself

You may need to whitelist your IP address.

`heroku login`  
`heroku config:set MONGODB_URI=<uri>`  
`git push heroku HEAD:master`

`dotenv` is installed as a normal dependency because Heroku was not installing dev deps last I tried.
