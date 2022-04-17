from urllib import response
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from cashsys import settings
from authsys.models import *
from authsys.form import *

# permissions
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
# decorators
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.decorators import permission_classes

# DRF stuffs
from cashapp.serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics

# json stuffs
import json
from django.http.response import JsonResponse

# query stuffs
from django.db.models import Q

# signal stuffs
from cashapp.signals import RecordSaveHandler


def rectt(request):
    print("sdadasd")
    print(request.user.is_authenticated)
    print(request.user)
    return HttpResponse("ff")

@method_decorator(login_required, name='dispatch')
# @permission_classes((AllowAny, ))
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class RecordModify(generics.GenericAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = ()
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [BasicAuthentication]
    # filter_backends = [ObjectPermissionsFilter]

    def get(self, request):
        user = request.user
        body = request.body
        data = json.loads(body)
        is_many = data["is_many"]
        # print("hee")

        if (is_many):  
            # Getting data permuted by created time
            # filter records
            accid = data["account_id"]
            maxrec = data["record_max_num"]

            # avoid null-finding case
            try:
                # print(self.queryset.filter(account__id=accid))
                # print(self.queryset.filter(account__id=accid).order_by("-created_time"))
                # print(min(maxrec, self.queryset.count()))
                resrec = self.queryset.filter(account__id=accid).order_by("-created_time")[:min(maxrec, self.queryset.count())]
            except:
                resrec = None

            # serialize and return
            if resrec:
                recordSeri = RecordSerializer(resrec, many=True)
                return JsonResponse(status=201, data=recordSeri.data, safe=False)
            else:
                return JsonResponse(status=400, data={"success": False})
        else:
            # Getting data with record_id    
            record_id = data["record_id"]
            try:
                rec = self.queryset.get(id=record_id)
            except:
                rec = None
            
            if (not rec):
                # record not exist
                return JsonResponse(status=400, data={"success": False})
            
            recSeri = RecordSerializer(rec)
            return JsonResponse(status=201, data=recSeri.data)
            
    def post(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        # add new rec
        print("sdasa")
        print(request.user.is_authenticated)
        print(request.user)
        print(request.user.username)
        user = request.user
        data = request.data
        accid = data["account_id"]

        # set foreign key
        rec = Record()

        # avoid null rec
        try:
            rec_acc = Account.objects.get(pk=accid)
        except:
            rec_acc = None
            # no such account for the record's correspondance
            return JsonResponse(status=401, data={"success": False})
        
        rec.account = rec_acc

        # set plan (troublesome, by finding the overlapping plans and binding)
        # avoid null plan available
        try:
            # TODO: this condition needs testing!!!
            validPlans = rec_acc.plans.all().filter(Q(start_time__lte=rec.created_time) & Q(end_time__gte=rec.created_time))
            rec.plans.set(validPlans)
        except:
            validPlans = None
        # validPlans = []
        # for plan in planset:
        #     if ((plan.start_time <= rec.created_time) and (plan.end_time >= rec.created_time)):
        #         validPlans.append(plan)

        # set other normal fields
        recSeri = RecordSerializer(rec, data=data, partial=True)
        if recSeri.is_valid():
            rec = recSeri.save()
            # rec.save() # to invoke signal
            print("here")
            print(rec)
            print(recSeri.data)
            return JsonResponse(status=201, data=recSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})

    def patch(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        # modify existing rec
        user = request.user
        data = request.data
        try:
            rec = self.queryset.get(id=data["record_id"])
        except:
            return JsonResponse(status=400, data={"success": False})
        
        # update changes in database and return
        prev_amount = rec.amount
        recSeri = RecordSerializer(rec, data=data, partial=True)
        if recSeri.is_valid():
            # TODO: patch update problematic!!!!!!!
            rec = recSeri.save()
            RecordSaveHandler(Record, rec, False, prev_amount=prev_amount)
            return JsonResponse(status=201, data=recSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})
    
    def delete(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        user = request.user
        data = request.data
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        delSet = self.queryset.filter(pk__in=delList)
        if delSet:
            delSet.delete()
            return JsonResponse(status=200, data={"success": True})
        else:
            return JsonResponse(status=200, data={"success": False})




    

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class AccountModify(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = ()
    # permission_classes = [IsAuthenticated]
    authentication_classes = [BasicAuthentication]
    
    # filter_backends = [ObjectPermissionsFilter]

    def get(self, request):
        user = request.user
        # body = request.body
        data = request.data
        is_many = data["is_many"]

        if (not is_many):
            # get according to account_id
            acc_id = data["account_id"]
            acc = self.queryset.get(id=acc_id)

            # acc existance
            print(acc)
            # print("herrr!!!")
            if (acc):  
                accSeri = AccountSerializer(acc)
                return JsonResponse(status=201, data=accSeri.data) # safe=False guarantees the validity of returning a list of objects
            else:
                # "account does not exist"
                return JsonResponse(status=400, data={"success": False})

        else:
            # get according to request.user
            usrAcc = self.queryset.filter(userProfile__id=user.user_profile.id)
            
            # empty judgement
            if usrAcc:
                accSer = AccountSerializer(usrAcc, many=True)
                return JsonResponse(status=201, data=accSer.data, safe=False)
            else:
                return JsonResponse(status=400, data={"success": False})
            
    def post(self, request):
        # add new account
        user = request.user
        data = request.data
        print(user)
        print(user.username)
        print(user.is_authenticated)
        # print(data)
        # data = json.loads(body)
        if Account.objects.filter(name=data["name"]):
            # Account name already exists
            return JsonResponse(status=400, data={"success": False})

        acc = Account()
        print("in!")
        # set foreign key

        # avoid fucking error, not finding user
        try:
            acc.userProfile = request.user.user_profile
        except:
            print("SHIT, user not found")
            return JsonResponse(status=401, data={"success": False})

        # set other normal fields
        accSeri = AccountSerializer(acc, data=data, partial=True)
        if accSeri.is_valid():
            accSeri.save()
            return JsonResponse(status=201, data=accSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})

    def patch(self, request):
        # modify existing account
        user = request.user
        # body = request.body
        data = request.data
        acc = self.queryset.get(id=data["account_id"])
        if not acc:
            return JsonResponse(status=400, data={"success": False})
        
        # update changes in database and return
        accSeri = AccountSerializer(acc, data=data, partial=True)
        if accSeri.is_valid():
            accSeri.save()
            return JsonResponse(status=201, data=accSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})
    
    def delete(self, request):
        user = request.user
        # body = request.body
        data = request.data
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        delSet = self.queryset.filter(pk__in=delList)
        if delSet:
            delSet.delete()
            return JsonResponse(status=200, data={"success": True})
        else:
            return JsonResponse(status=200, data={"success": False})
    

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class PlanModify(generics.GenericAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    # filter_backends = [ObjectPermissionsFilter]

    def get(self, request):
        user = request.user
        data = request.data
        acc_many = data["is_account_many"]
        usr_many = data["is_user_many"]

        if acc_many:
            # Look for the plans of a given account
            accid = data["account_id"]
            planset = self.queryset.filter(account__id==accid)
            if not planset:
                # account has no plan
                return JsonResponse(status=201, data={"success": False})
            plseri = PlanSerializer(planset, many=True)
            return JsonResponse(status=201, data=plseri.data, safe=False)

        elif usr_many:
            # Look for the plans of a given user
            upid = user.user_profile.id
            planset = self.queryset.filter(userProfile__id==upid)
            if not planset:
                # user has no plan
                return JsonResponse(status=201, data={"success": False})
            plseri = PlanSerializer(planset, many=True)
            return JsonResponse(status=201, data=plseri.data, safe=False)

        else:
            # Look for a given plan_id's plan
            plan_id = data["plan_id"]
            plan = self.queryset.get(id=plan_id)

            # plan existance
            if (plan):  
                planSeri = PlanSerializer(plan)
                return JsonResponse(status=201, data=planSeri.data)
            else:
                # plan does not exist
                return JsonResponse(status=400, data={"success": False})

    # remaining and failed update logic?????
    def post(self, request):
        # add new plan
        user = request.user
        data = request.data
        # fields to change directly: name, description, start_time, end_time, budget
        # fields to change indirectly: remaining, failed
        data["remaining"] = data["budget"]
        
        plan = Plan()
        plan.userProfile = user.user_profile
        plan.account = Account.objects.get(pk=data["account_id"])
        planSeri = PlanSerializer(plan, data=data, partial=True)
        if planSeri.is_valid():
            planSeri.save()
            return JsonResponse(status=201, data=planSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})

    def patch(self, request):
        # modify existing plan
        user = request.user
        data = request.data
        plan = self.queryset.get(id=data["plan_id"])
        # original_buget = plan.budget
        # data["remaining"] = plan.remaining
        # data["failed"] = plan.failed

        # # fields to change directly: name, description, start_time, end_time, budget
        # # fields to change indirectly: remaining, failed
        # if (original_buget >= data["budget"]):
        #     # budget decrease
        #     data["remaining"] -= original_buget - data["budget"]
        #     # if fail after changing
        #     if (data["remaining"] <= 0):
        #         data["remaining"] = 0
        #         data["failed"] = True
        # else:
        #     # budget increase
        #     data["remaining"] += data["budget"] - original_buget

        # update changes in database and return
        planSeri = PlanSerializer(plan, data=data, partial=True)
        if planSeri.is_valid():
            planSeri.save() 
            return JsonResponse(status=201, data=planSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})
    
    def delete(self, request):
        user = request.user
        data = request.data
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        delSet = self.queryset.filter(pk__in=delList)
        if delSet:
            delSet.delete()
            return JsonResponse(status=200, data={"success": True})
        else:
            return JsonResponse(status=200, data={"success": False})
    