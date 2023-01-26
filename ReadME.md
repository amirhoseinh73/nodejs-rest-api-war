# Rest API for manage user data

> create login and register API for save user data and user projects

**Description**

Each user have multiple projects and each project includes multiple scenes.

project and scene data is a json that save into a file and file name store in DB.

-----------
## APIs

1. login/register
2. CRUD users
3. CRUD projects
4. CRUD scenes
5. upload image
6. upload video
7. upload zip include 3D models and extract it

## Run

> create .env file in ptoject root and simply add these 3 params:
1. APP_PORT=3000
2. DB_URL="mongodb+srv://user:pass@cluster0.m4kxb2i.mongodb.net/?retryWrites=true&w=majority"
3. APP_URL="http://localhost:3000" -> this is for public urls of uploaded files

> open terminal and run
```
npm run dev
```
