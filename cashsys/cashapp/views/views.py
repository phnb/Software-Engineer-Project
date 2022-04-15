from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from cashsys import settings
from authsys.models import *
from authsys.form import *

# decorators
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

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

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class RecordModify(generics.GenericAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    # filter_backends = [ObjectPermissionsFilter]

    def get(self, request):
        user = request.user
        data = json.loads(request.body)
        is_many = data["is_many"]

        if (is_many):  
            # Getting data permuted by created time
            # filter records
            accid = data["account_id"]
            maxrec = data["record_max_num"]
            resrec = queryset.order_by("-created_time")[:min(maxrec, len(queryset))]

            # serialize and return
            recordSeri = RecordSerializer(resrec, many=True)
            return JsonResponse(code=201, data=recordSeri.data)
        else:
            # Getting data with record_id    
            record_id = data["record_id"]
            rec = queryset.filter(id=record_id)
            
            if (not rec):
                # record not exist
                return JsonResponse(code=400, data="record does not exist")
            
            recSeri = RecordSerializer(rec, many=True)
            return JsonResponse(code=201, data=recSeri.data)
            
    def post(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        # add new rec
        user = request.user
        data = json.loads(request.body)
        accid = data["account_id"]

        # set foreign key
        rec = Record()
        rec_acc = Account.objects.filter(pk=accid)
        rec.account = rec_acc
        # set plan (troublesome, by finding the overlapping plans and binding)
        validPlans = rec_acc.plans.all().filter(Q(start_time__lte=rec.created_time) & Q(end_time__gte=rec.created_time))
        # validPlans = []
        # for plan in planset:
        #     if ((plan.start_time <= rec.created_time) and (plan.end_time >= rec.created_time)):
        #         validPlans.append(plan)
        rec.plans.set(validPlans)

        # set other normal fields
        recSeri = RecordSerializer(rec, data=data, partial=True)
        if recSeri.is_valid():
            recSeri.save()
            return JsonResponse(code=201, data=recSeri.data)
        return JsonResponse(code=400, data="wrong parameters")

    def patch(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        # modify existing rec
        user = request.user
        data = json.loads(request.body)
        rec = queryset.filter(id=data["record_id"])
        
        # update changes in database and return
        recSeri = RecordSerializer(rec, data=data, partial=True)
        if recSeri.is_valid():
            recSeri.save()
            return JsonResponse(code=201, data=recSeri.data)
        return JsonResponse(code=400, data="wrong parameters")
    
    def delete(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        user = request.user
        data = json.loads(request.body)
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        delSet = queryset.filter(pk__in=delList)
        if delSet:
            delSet.delete()
            return JsonResponse(code=200, data={"success": True})
        else:
            return JsonResponse(code=200, data={"success": False})




    

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class AccountModify(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    # filter_backends = [ObjectPermissionsFilter]

    def get(self, request):
        user = request.user
        data = json.loads(request.body)
        is_many = data["is_many"]

        if (not is_many):
            # get according to account_id
            acc_id = data["account_id"]
            acc = queryset.filter(id=acc_id)

            # acc existance
            if (acc):  
                accSeri = AccountSerializer(acc)
                return JsonResponse(code=201, data=accSeri.data)
            else:
                JsonResponse(code=400, data="account does not exist")

        else:
            # get according to request.user
            usrAcc = queryset.filter(UserProfile__id=user.user_profile.id)
            accSer = AccountSerializer(usrAcc, many=True)
            return JsonResponse(code=201, data=accSer.data)
            
    def post(self, request):
        # add new account
        user = request.user
        data = json.loads(request.body)

        acc = Account()
        # set foreign key
        acc.userProfile = request.user.user_profile
        # set other normal fields
        accSeri = AccountSerializer(acc, data=data, partial=True)
        if accSeri.is_valid():
            accSeri.save()
            return JsonResponse(code=201, data=accSeri.data)
        return JsonResponse(code=400, data="wrong parameters")

    def patch(self, request):
        # modify existing account
        user = request.user
        data = json.loads(request.body)
        acc = queryset.filter(id=data["account_id"])
        
        # update changes in database and return
        accSeri = AccountSerializer(acc, data=data, partial=True)
        if accSeri.is_valid():
            accSeri.save()
            return JsonResponse(code=201, data=accSeri.data)
        return JsonResponse(code=400, data="wrong parameters")
    
    def delete(self, request):
        user = request.user
        data = json.loads(request.body)
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        delSet = queryset.filter(pk__in=delList)
        if delSet:
            delSet.delete()
            return JsonResponse(code=200, data={"success": True})
        else:
            return JsonResponse(code=200, data={"success": False})
    

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class PlanModify(generics.GenericAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    # filter_backends = [ObjectPermissionsFilter]

    def get(self, request):
        user = request.user
        data = json.loads(request.body)
        acc_many = data["is_account_many"]
        usr_many = data["is_user_many"]

        if acc_many:
            # Look for the plans of a given account
            accid = data["account_id"]
            planset = queryset.filter(account__id==accid)
            if not planset:
                # account has no plan
                return JsonResponse(code=201, data="")
            plseri = PlanSerializer(planset, many=True)
            return JsonResponse(code=201, data=plseri.data)

        elif usr_many:
            # Look for the plans of a given user
            upid = user.user_profile.id
            planset = queryset.filter(userProfile__id==upid)
            if not planset:
                # user has no plan
                return JsonResponse(code=201, data="")
            plseri = PlanSerializer(planset, many=True)
            return JsonResponse(code=201, data=plseri.data)

        else:
            # Look for a given plan_id's plan
            plan_id = data["plan_id"]
            plan = queryset.filter(id=plan_id)

            # plan existance
            if (plan):  
                planSeri = PlanSerializer(plan)
                return JsonResponse(code=201, data=planSeri.data)
            else:
                # plan does not exist
                JsonResponse(code=400, data="")

    # remaining and failed update logic?????
    def post(self, request):
        # add new plan
        user = request.user
        data = json.loads(request.body)
        # fields to change directly: name, description, start_time, end_time, budget
        # fields to change indirectly: remaining, failed
        data["remaining"] = data["budget"]
        
        plan = Plan()
        plan.userProfile = user.user_profile
        plan.account = Account.objects.filter(pk=data["account_id"])
        planSeri = PlanSerializer(plan, data=data, partial=True)
        if planSeri.is_valid():
            planSeri.save()
            return JsonResponse(code=201, data=planSeri.data)
        return JsonResponse(code=400, data="wrong parameters")

    def patch(self, request):
        # modify existing plan
        user = request.user
        data = json.loads(request.body)
        plan = queryset.filter(id=data["plan_id"])
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
            return JsonResponse(code=201, data=planSeri.data)
        return JsonResponse(code=400, data="wrong parameters")
    
    def delete(self, request):
        user = request.user
        data = json.loads(request.body)
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        delSet = queryset.filter(pk__in=delList)
        if delSet:
            delSet.delete()
            return JsonResponse(code=200, data={"success": True})
        else:
            return JsonResponse(code=200, data={"success": False})
    