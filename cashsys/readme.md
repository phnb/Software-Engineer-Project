Run with the following command (in the directory) to launch the backend server:

        python manage.py runserver 


Then, browse the address **127.0.0.1:8000/auth/**, click **Let's register!** if you don't have an account yet, and input your registration information. 

After submitting registration information an verification email would be sent to the email you filled in. (DON'T send too many EMAILs since The sender is me!!!). Then check your email to click the verification link to verify you account. After verification you can sign in with your account with the correct password.


**Database reminders:**
Before using the MySQL database, remember to create the corresponding user and database in advance. Specifically, you may log in to your MySQL database with root user first 

        mysql -uroot -pyour_password

Then, in the MySQL terminal, create the user and the database with certain names.

        > DROP DATABASE monager;
        > CREATE DATABASE monager;

        > DROP USER 'monager'@'localhost';
        > CREATE USER 'monager'@'localhost' IDENTIFIED BY '123456';
        > GRANT ALL ON monager.* TO 'monager'@'localhost';

After that, you may run migrations for the project:

        python manage.py makemigrations
        python manage.py migrate


