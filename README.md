# Group 14 Project: Moneger
CSC4001 Group Project



## Frontend

> A React-native project
### Build Setup

``` bash
# install dependencies
yarn install
# start the android device and install our app in the device
yarn android

```

For setting up the react native environment, check out the [guide](https://www.react-native.cn/docs/environment-setup)


## Backend

Run with the following command (in the directory) to launch the backend server:

        python manage.py runserver 


After submitting registration information to the backend an verification email would be sent to the email you filled in (by default, the email backend is redirected to the terminal, and you may change that on *info.py* and *settings.py*). Then check the email to click the verification link to verify you account. After verification you can sign in with your account with the correct password.

### Database reminders:
Before using the MySQL database, remember to create the corresponding user and database in advance. Specifically, you may log in to your MySQL database with root user first 

        mysql -uroot -pyour_password

Then, in the MySQL terminal, create the user and the database with certain names.

        > DROP DATABASE monager;
        > CREATE DATABASE monager;

        > DROP USER 'monager'@'localhost';
        > CREATE USER 'monager'@'localhost' IDENTIFIED BY '123456';
        > GRANT ALL ON *.* TO 'monager'@'localhost';

After that, you may run migrations for the project:

        python manage.py makemigrations
        python manage.py migrate


## Tests:
View-based and url-based unit tests of the app "cashapp" are provided. You may run all the unit tests one-shot with the following command:

        python manage.py test cashapp.tests

or, you may run tests for a particular unit:

        python manage.py test cashapp.tests.test_views_record
        python manage.py test cashapp.tests.test_views_account
        python manage.py test cashapp.tests.test_views_plan
