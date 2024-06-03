# Laravel React Books
CRUD of books using Laravel for backend and ReactJS for frontend.
- [Video Recording](https://drive.google.com/file/d/1oPd6JFdlKPODtPvJmDieUok4REyypmRS/view?usp=sharing)

### Screenshots
Books List:
![image](https://github.com/jqamaya/laravel-react-books/assets/13392538/88ac28e1-93e7-4646-a7d5-30098a21776c)

Books List w/ Search:
![image](https://github.com/jqamaya/laravel-react-books/assets/13392538/edfd56bc-10c9-4622-a575-25fc0a5e8cb4)

Add New Book:
![image](https://github.com/jqamaya/laravel-react-books/assets/13392538/03e69e8b-694e-4d30-8924-4d6d498f17f7)

Edit Book:
![image](https://github.com/jqamaya/laravel-react-books/assets/13392538/26098680-a095-4c04-9721-de070123e007)

Delete Book Confirmation:
![image](https://github.com/jqamaya/laravel-react-books/assets/13392538/4c1fd58c-5302-49e7-ac2c-2e458aeb6c53)

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
- [Laravel](https://laravel.com/docs/11.x)
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
1. Run the command `php artisan test` to run the tests under `tests` directory.
