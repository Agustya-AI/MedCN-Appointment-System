### This is Boilerplate of FastAPI + DJANGO + RUST for Rapid Memory Safe performance Critical Application Development


Starting with backend it's the main django settings app
- It's there for backend and automatic admin panel creation
- In this we'll define all models, from our backend infrastructure

Then server.py
- Here we'll handle the client facing API, this will be used to serve requests
- In the Api folder it's connected api and directory structure should be same as of django
- Everynew feature/functionality should be there in api as well as in main folder with the same name which signigies model is connected to routes in apis
- In that folder for eg: example_router every feature should be there isolated in that such as utils, models, routes and any other feature

Basemodel
- It's a high order function for every other model so we don't have to worry about common things such as delete flag, save, slug etc

Rust - It well be used with PyO3 bindings for writing performance critical code and calling it from fastapi side of the application