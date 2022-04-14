from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from cashsys import settings
from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from authsys.tokens import generate_token
from django.core.mail import EmailMessage, send_mail
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from authsys.models import *
from authsys.form import *

# Create your views here.
# def get_register(request):
#     return render(request, "auth/reg.html")

# def get_signin(request):
#     return render(request, "auth/sgin.html")



def register(request):
    print("hahahahah")
    if (request.method == "POST"):
        unm = request.POST["username"]
        fnm = request.POST["firstname"]
        lnm = request.POST["lastname"]
        em = request.POST["email"]
        pw = request.POST["password"]
        pw2 = request.POST["confirmpassword"]

        # TODO: checks
        if User.objects.filter(username=unm):
            messages.error(request, "username already exists")
            return redirect("/auth/")

        if User.objects.filter(email=em):
            messages.error(request, "email already exists")
            return redirect("/auth/")

        if len(unm) > 10:
            messages.error(request, "username should be less than 10")
            return redirect("/auth/")

        if pw!=pw2:
            messages.error(request, "pw didn't match")
            return redirect("/auth/")

        if not unm.isalnum():
            messages.error(request, "username must be alpha-numeric")
            print("errrrrrrrr")
            return redirect("/auth/")

        # inner user for credentials, outer user for profiles
        # create base user
        myusr = User.objects.create_user(unm, em, pw)
        myusr.first_name = fnm
        myusr.last_name = lnm
        myusr.is_active = False
        myusr.save()

        # create profile user
        # TODO: add more profile information
        usrprof = UserProfile.objects.create(user=myusr, first_name=fnm, last_name=lnm)
        usrprof.username = unm
        usrprof.email = em
        usrprof.save()

        messages.success(request, "successfully created, confirmation sent!")

        # welcome email
        subject = "Welcome!"
        message = "Hi boy " + myusr.first_name + "!! \n" + "Welcome much more!!!!"
        from_email = settings.EMAIL_HOST_USER
        to_list = [myusr.email]
        send_mail(subject, message, from_email, to_list, fail_silently=False)

        # comfirm email
        current_site = get_current_site(request)
        email_subject = "confirm your email - Django logging in !!!"
        message2 = render_to_string("email_confirmation.html",{
            "name": myusr.first_name,
            "domain": current_site.domain,
            "uid": urlsafe_base64_encode(force_bytes(myusr.pk)),
            "token": generate_token.make_token(myusr)
        })
        email = EmailMessage(
            email_subject,
            message2,
            settings.EMAIL_HOST_USER, # sender
            [myusr.email], # receiver
        )
        email.fail_silently=True
        email.send()


        # success message?????
        # print("dne!!!")
        return render(request, "auth/regwait.html")
    
    elif (request.method == "GET"):
        return render(request, "auth/reg.html")
        # get_register(request)

    # elif (request.method == "DELETE"):

    # return render(request, "auth/reg.html")

def signin(request):
    # print("hahahahah")
    if (request.method == "POST"):
        username = request.POST["username"]
        password = request.POST["password"]

        usr = authenticate(username=username, password=password)
        if ((usr is not None) and usr.is_active):
            login(request, usr)
            fname = usr.username
            print(request.user.is_authenticated)
            return render(request, "auth/sginsucc.html", {"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url})

        else:
            # request.method = "GET"
            messages.error(request, "account does not exist, please register first")
            return render(request, "auth/reg.html")
            # return redirect("/auth/register")

    elif (request.method == "GET"):
        if (request.user.is_authenticated):
            usr = request.user
            return render(request, "auth/sginsucc.html",{"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url})
        else:
            return render(request, "auth/sgin.html")


def signout(request):
    logout(request)
    messages.success(request, "Logged out successfully")
    return redirect("/auth/")


def reset_send_mail(request):
    if request.method == "POST":
        email = request.POST["email"]
        # check email-user existance
        try:
            usr = User.objects.get(email=email)
        except User.DoesNotExist:
            # no such user  
            messages.error(request, "no such user")
            return render(request, "resetpw/resetpw.html")

        if usr.is_active:
            # send verification email
            current_site = get_current_site(request)
            email_subject = "confirm your email - Reset password"
            message2 = render_to_string("email_change_pw.html",{
                "name": usr.username,
                "domain": current_site.domain,
                "uid": urlsafe_base64_encode(force_bytes(usr.pk)),
                "token": generate_token.make_token(usr)
            })
            email_sent = EmailMessage(
                email_subject,
                message2,
                settings.EMAIL_HOST_USER, # sender
                [usr.email], # receiver
            )
            email_sent.fail_silently=True
            email_sent.send()

            return render(request, "resetpw/resetlink.html", {"user_name": (usr.username)})
        else:
            # not activated: send error message
            messages.error(request, "user not activated yet.")
            return render(request, "resetpw/resetpw.html")




    # return render(request, "resetpw/resetlink.html")


def register_activate(request, uid64d, token):
    try:
        uid = force_text(urlsafe_base64_decode(uid64d))
        myuser = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExists):
        # print("get error!!")
        return render(request, "activation_failed.html")


    if (myuser is not None and generate_token.check_token(myuser, token)):
        myuser.is_active = True
        myuser.save()
        login(request, myuser)
        # maybe redirect() by default generates "GET" request...
        return render(request, "auth/sucver.html")
    else:
        return render(request, "activation_failed.html")


def reset_activate(request, uid64d, token):
    try:
        uid = force_text(urlsafe_base64_decode(uid64d))
        myuser = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExists):
        print("geterr!!")
        return render(request, "activation_failed.html")


    if (myuser is not None and generate_token.check_token(myuser, token)):
        # Only when token verification succeeded can you query the password reset web-page
        # TODO: periodically set is_reset_active to False
        myuser.user_profile.is_reset_active = True
        myuser.user_profile.save()
        # print("acttt!")
        # print("usr name %s" %(myuser.username))
        # print("usr id %s" %(myuser.id))
        # print("activ sta %d" %(myuser.user_profile.is_reset_active))
        return render(request, "resetpw/setnwpw.html", {"uname":myuser.username, "uid":myuser.id})
    else:
        return render(request, "activation_failed.html")


def reset_pw(request):
    if request.method == "POST":
        # by default, the uid should be valid (for the hidden field)
        uid = int(request.POST["uid"]) # uid 
        pw = request.POST["pw"]
        pw2 = request.POST["pw2"]
        # print("uid is")
        # print(uid)
        # print(type(uid))

        if (pw==pw2):
            usr = User.objects.get(pk=uid)
            # print("usrname is")
            # print(usr.username)
            if (usr.user_profile.is_reset_active):
                usr.set_password(pw)
                usr.save()

                usr.user_profile.is_reset_active = False
                usr.user_profile.save()
                return render(request, "resetpw/resetsucc.html")
            else:
                # print("not active!!")
                # print("active sta %d" %(usr.user_profile.is_reset_active))
                messages.error(request, "validation outdated, please email-validate again")
                return render(request, "resetpw/setnwpw.html", {"uname":usr.username, "uid":usr.id})                


        else:
            messages.error(request, "password disagrees")
            return render(request, "resetpw/setnwpw.html", {"uname":"", "uid":uid})
        
    elif request.method == "GET":
        return render(request, "resetpw/resetpw.html")


def profile(request):
    if request.method == "POST":
        # print(request.POST)
        # print(request.FILES)
        usr = User.objects.get(id=request.user.id)
        profForm = UserProfileForm(request.POST, instance=usr.user_profile)
        usrForm = UserForm(request.POST, instance=usr)
        # print("hereee!!!")

        if (profForm.is_valid() and usrForm.is_valid()):
            # update the existing user's form in the database
            profile = profForm.save(commit=False)
            # update avatar
            if 'avatar' in request.FILES:
                profile.avatar = request.FILES['avatar']

            profile.save()
            
            # update deep User
            usrForm.save()
            
            messages.success(request, "profile update successful!")
            # redirect to the main page we just updated
            return render(request, "auth/sginsucc.html", {"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url})
    elif request.method == "GET":
        profForm = UserProfileForm(instance=request.user.user_profile)
        return render(request, "auth/usrprof.html", {"form": profForm})