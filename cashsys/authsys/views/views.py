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
from cashapp.models import *
from authsys.form import *
# login decorator
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions

# query stuffs
from django.db.models import Q

# Create your views here.
# def get_register(request):
#     return render(request, "auth/reg.html")

# def get_signin(request):
#     return render(request, "auth/sgin.html")



def register(request):
    # print("hahahahah")
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
            # print("heer")
            return redirect("/auth/")

        if User.objects.filter(email=em):
            messages.error(request, "email already exists")
            # print("heerusr")
            return redirect("/auth/")

        if len(unm) > 10:
            messages.error(request, "username should be less than 10")
            # print("heerlen")
            return redirect("/auth/")

        if pw!=pw2:
            messages.error(request, "pw didn't match")
            # print("heerpw")
            return redirect("/auth/")

        if not unm.isalnum():
            messages.error(request, "username must be alpha-numeric")
            # print("errrrrrrrr")
            return redirect("/auth/")

        # print("heer")

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
    
# @api_view(["GET", 'PUT', "POST"])
# @permission_classes((permissions.AllowAny,))
def signin(request):
    # print("hahahahah")
    if (request.method == "POST"):
        username = request.POST["username"]
        password = request.POST["password"]

        usr = authenticate(username=username, password=password)
        if ((usr is not None) and usr.is_active and usr.user_profile):
            login(request, usr, backend='django.contrib.auth.backends.ModelBackend')
            fname = usr.username
            # print(request.user.is_authenticated)

            # get default account's id
            try:
                defacc = usr.user_profile.accounts.get(is_default=True)
                return JsonResponse(status=200, data={"success": True, "default_account_id": defacc.id, "uname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url}) 
            except:
                # no default account or more than 1 accounts
                return JsonResponse(status=401, data={"success": False})

        else:
            # request.method = "GET"
            # maybe the user is the superuser (which may not have profile)
            messages.error(request, "user does not exist, please register first")
            return JsonResponse(status=401, data={"success": False})
            # return redirect("/auth/register")

    elif (request.method == "GET"):
        if (request.user.is_authenticated):
            usr = request.user

            # avoid superuser from logging in from the normal interface 
            try: 
                prof = usr.user_profile
            except:
                return render(request, "auth/sgin.html")

            return render(request, "auth/sginsucc.html",{"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url})
        else:
            return render(request, "auth/sgin.html")

@login_required
def signout(request):
    logout(request, backend='django.contrib.auth.backends.ModelBackend')
    messages.success(request, "Logged out successfully")
    return redirect("/auth/")


def reset_send_mail(request):
    if request.method == "POST":
        email = request.POST["email"]
        pw1 = request.POST["pw1"]
        pw2 = request.POST["pw2"]
        # check email-user existance
        try:
            usr = User.objects.get(email=email)
        except User.DoesNotExist:
            # no such user  
            messages.error(request, "no such user")
            return render(request, "resetpw/resetpw.html")

        if usr.is_active:
            usr.is_reset_active = True
            usr.save()
            # send verification email
            current_site = get_current_site(request)
            email_subject = "confirm your email - Reset password"
            message2 = render_to_string("email_change_pw.html",{
                "name": usr.username,
                "domain": current_site.domain,
                "uid": urlsafe_base64_encode(force_bytes(usr.pk)),
                "token": generate_token.make_token(usr),
                "pw": urlsafe_base64_encode(force_bytes(pw1))
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
        # return JsonResponse(statu=401, data={"success": False})

    if (myuser is not None and generate_token.check_token(myuser, token)):
        myuser.is_active = True
        myuser.save()
        login(request, myuser, backend='django.contrib.auth.backends.ModelBackend')
        # maybe redirect() by default generates "GET" request...

        # create default account for the new user (login, should be returned)
        if (not Account.objects.filter(Q(userProfile__id=myuser.user_profile.id)&Q(is_default=True))):
            defacc = Account(userProfile=myuser.user_profile)
            defacc.is_default = True
            defacc.name = myuser.username + "'s first account"
            defacc.description = myuser.username + "'s first account, hello world!"
            defacc.save()

        return render(request, "auth/sucver.html")
        # return JsonResponse(statu=200, data={"is_active": True})
    else:
        return render(request, "activation_failed.html")
        # return JsonResponse(statu=401, data={"success": False})


def reset_activate(request, uid64d, token, pw):
    try:
        uid = force_text(urlsafe_base64_decode(uid64d))
        pw = force_text(urlsafe_base64_decode(pw))
        myuser = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExists):
        # print("geterr!!")
        return render(request, "activation_failed.html")


    if (myuser is not None and generate_token.check_token(myuser, token)):
        # Only when token verification succeeded can you query the password reset web-page
        # TODO: periodically set is_reset_active to False
        myuser.user_profile.is_reset_active = False
        myuser.user_profile.save()

        myuser.set_password(pw)
        myuser.save()
        # print("acttt!")
        # print("usr name %s" %(myuser.username))
        # print("usr id %s" %(myuser.id))
        # print("activ sta %d" %(myuser.user_profile.is_reset_active))
        return render(request, "resetpw/resetsucc.html")
    else:
        return render(request, "activation_failed.html")


def reset_pw(request):
    # if request.method == "POST":
    #     # by default, the uid should be valid (for the hidden field)
    #     uid = int(request.POST["uid"]) # uid 
    #     pw = request.POST["pw"]
    #     pw2 = request.POST["pw2"]
    #     # print("uid is")
    #     # print(uid)
    #     # print(type(uid))

    #     if (pw==pw2):
    #         usr = User.objects.get(pk=uid)
    #         # print("usrname is")
    #         # print(usr.username)
    #         if (usr.user_profile.is_reset_active):
    #             usr.set_password(pw)
    #             usr.save()

    #             usr.user_profile.is_reset_active = False
    #             usr.user_profile.save()
    #             return render(request, "resetpw/resetsucc.html")
    #         else:
    #             # print("not active!!")
    #             # print("active sta %d" %(usr.user_profile.is_reset_active))
    #             messages.error(request, "validation outdated, please email-validate again")
    #             return render(request, "resetpw/setnwpw.html", {"uname":usr.username, "uid":usr.id})                


    #     else:
    #         messages.error(request, "password disagrees")
    #         return render(request, "resetpw/setnwpw.html", {"uname":"", "uid":uid})    
    if request.method == "GET":
        return render(request, "resetpw/resetpw.html")

@login_required
def profile(request):
    if request.method == "POST":
        # print(request.POST)
        # print(request.FILES)
        usr = User.objects.get(id=request.user.id)
        unm = request.POST["username"]
        email = request.POST["email"]

        # profile validity check (upper-lower case sensitive)
        if User.objects.filter(Q(email=email)&~Q(id=request.user.id)):
            messages.error(request, "email exists")
            # print("heeremi")
            return redirect("/auth/profile/")

        if User.objects.filter(Q(username=unm)&~Q(id=request.user.id)):
            messages.error(request, "username already exists")
            # print("heer")
            return redirect("/auth/profile/")

        if len(unm) > 10:
            messages.error(request, "username should be less than 10")
            # print("heerlen")
            return redirect("/auth/profile/")

        if not unm.isalnum():
            messages.error(request, "username must be alpha-numeric")
            # print("errrrrrrrr")
            return redirect("/auth/profile/")

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
            # return JsonResponse()
            return render(request, "auth/sginsucc.html", {"fname": usr.username, "frname": usr.first_name, "laname": usr.last_name, "email": usr.email, "avatarUrl": usr.user_profile.avatar.url})
    elif request.method == "GET":
        profForm = UserProfileForm(instance=request.user.user_profile)
        return render(request, "auth/usrprof.html", {"form": profForm})