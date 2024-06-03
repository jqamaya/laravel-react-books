# Laravel React Books
CRUD of books using Laravel for backend and ReactJS for frontend.

---

## CLIENT
### Requirements
- [React](https://react.dev/)
### Local Setup
1. Go to `client` directory: `cd client`
2. Copy the `.env.example` file and rename it to `.env`
3. Run the command `yarn` or `yarn install` to install the packages/dependencies.
4. Run the command `yarn start` to run the ReactJS app. This will run on `http://localhost:3000/`
---
## SERVER
### Requirements
- [Laravel](https://laravel.com/docs/6.x)
- [PHP](https://www.php.net/)
- [MySQL](https://www.mysql.com/)
### Local Setup
1. Go to `server` directory: `cd server`
1. Copy the `.env.example` file and rename it to `.env`\
   Update the database variables based on your local database config.\
   Create the database `laravel-react-books`.
1. Run the command `composer install` to install the packages/dependencies.
1. Run the command `php artisan key:generate` to generate an app key which will automatically update the `.env` file.
1. Run the command `php artisan migrate` to run the migrations and create database tables.
1. Run the command `php artisan serve` to run the Laravel app. This will run on `http://localhost:8000`
