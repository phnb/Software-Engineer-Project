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
            return redirect("/auth/register")

        if len(unm) > 10:
            messages.error(request, "username should be less than 10")

        if pw!=pw2:
            messages.error(request, "pw didn't match")

        if not unm.isalnum():
            messages.error(request, "username must be alpha-numeric")
            print("errrrrrrrr")
            return redirect("/auth/")

        myusr = User.objects.create_user(unm, em, pw)
        myusr.first_name = fnm
        myusr.last_name = lnm
        myusr.is_active = False
        myusr.save()

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
        print("dne!!!")
        return render(request, "auth/regwait.html")
    
    elif (request.method == "GET"):
        return render(request, "auth/reg.html")
        # get_register(request)

    # return render(request, "auth/reg.html")


def signin(request):
    # print("hahahahah")
    if (request.method == "POST"):
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(username=username, password=password)
        if ((user is not None) and user.is_active):
            login(request, user)
            fname = user.first_name
            return render(request, "auth/sginsucc.html", {"fname": fname})

        else:
            request.method = "GET"
            return redirect("/auth/register")

    elif (request.method == "GET"):
        return render(request, "auth/sgin.html")


def signout(request):
    logout(request)
    messages.success(request, "Logged out successfully")
    return redirect("/auth/")


def activate(request, uid64d, token):
    try:
        uid = force_text(urlsafe_base64_decode(uid64d))
        myuser = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExists):
        myuser = None

    if (myuser is not None and generate_token.check_token(myuser, token)):
        myuser.is_active = True
        myuser.save()
        login(request, myuser)
        # maybe redirect() by default generates "GET" request...
        return render(request, "auth/sucver.html")
    else:
        return render(request, "activation_failed.html")


