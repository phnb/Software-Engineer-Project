import re
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
from datetime import datetime 
from datetime import timedelta 
import pytz
from cashsys.settings import SECOND_ERROR_PARAM

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

# signal stuffs
from cashapp.signals import RecordSaveHandler

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class RecordModify(generics.GenericAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = []
    # filter_backends = [ObjectPermissionsFilter]

    # input: "true"/"false", output: T/F
    def bool_to_bool(self, bol):
        if (bol=='true'):
            return True
        else:
            return False

    # input: "4", output: 4
    def int_to_int(self, num):
        return int(num)

    def get(self, request):
        user = request.user
        # body = request.body
        data = request.query_params
        # data = request.query_params.dict()
        is_many = self.bool_to_bool(data["is_many"])


        # is_many: controls the number of records to be searched
        # is_many_time: controls the time-range filtering
        try: 
            is_many_time = self.bool_to_bool(data["is_many_time"])
        except:
            is_many_time = False

        if (is_many):  
            if (not is_many_time):
                # Getting data permuted by created time
                # filter records
                # print(data["account_id"])
                accid = self.int_to_int(data["account_id"])
                maxrec = self.int_to_int(data["record_max_num"])
                # print(accid)

                # avoid null-finding case
                try:
                    resrec = self.queryset.filter(account__id=accid).order_by("-start_time")[:min(maxrec, self.queryset.count())]
                except:
                    resrec = None

                # serialize and return
                if resrec:
                    recordSeri = RecordSerializer(resrec, many=True)
                    return JsonResponse(status=201, data=recordSeri.data, safe=False)
                else:
                    return JsonResponse(status=400, data={"success": False})
            else:
                accid = data["account_id"]
                stt_time = data["start_time"]
                end_time = data["end_time"]
                # print(stt_time)
                # print(end_time)
                accid = self.int_to_int(data["account_id"]) 

                # filter the records within the time range
                end_time = datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%S.%fZ')
                end_time = end_time - timedelta(seconds=SECOND_ERROR_PARAM)
                end_time = end_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                
                stt_time = datetime.strptime(stt_time, '%Y-%m-%dT%H:%M:%S.%fZ')
                stt_time = stt_time - timedelta(seconds=SECOND_ERROR_PARAM)
                stt_time = stt_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                # print(end_time)
                # print(stt_time)

                try:
                    rangeRec = self.queryset.filter(Q(account__id=accid) & Q(start_time__gte=stt_time) & Q(start_time__lte=end_time))
                except:
                    return JsonResponse(status=400, data={"success": False})

                incomeRec = rangeRec.filter(is_income=True).order_by("-amount")
                outcomeRec = rangeRec.filter(is_income=False).order_by("-amount")
                incomeSeri = RecordSerializer(incomeRec, many=True, allow_null=True)
                outcomeSeri = RecordSerializer(outcomeRec, many=True, allow_null=True)
                return JsonResponse(status=201, data={"income_records": incomeSeri.data, "outcome_records": outcomeSeri.data})


                # serialize and return
        else:
            # Getting data with record_id    
            record_id = self.int_to_int(data["record_id"])
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
        data = request.data
        accid = data["account_id"]

        # user_id re-authenticate for stronger robustness
        try:
            uid = data["uid"]
            verify_usr = User.objects.get(pk=uid)
            if (not verify_usr.is_authenticated):
                # user unauthenticated
                return JsonResponse(status=401, data={"success": False})
        except:
            # user_id not found
            return JsonResponse(status=401, data={"success": False})

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
        
        # set other normal fields
        recSeri = RecordSerializer(rec, data=data, partial=True)
        if recSeri.is_valid():
            rec = recSeri.save()
            # rec.save() # to invoke signal

            # set plan (troublesome, by finding the overlapping plans and binding)
            # avoid null plan available
            try:
                validPlans = rec_acc.plans.all().filter(Q(start_time__lte=datetime.now(tz=pytz.utc).replace(tzinfo=None)) & Q(end_time__gte=datetime.now(tz=pytz.utc).replace(tzinfo=None)))
                # for plan in validPlans:
                for plan in validPlans:
                    rec.plans.add(plan.id)
                    if not rec.is_income:
                        plan.remaining -= rec.amount
                        if plan.remaining <= 0:
                            plan.failed = True
                        plan.save()

            except:
                pass

            return JsonResponse(status=201, data=recSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})

    def patch(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        # modify existing rec
        # user = request.user
        data = request.data
        try:
            rec = self.queryset.get(id=data["record_id"])
        except:
            return JsonResponse(status=400, data={"success": False})

        # update changes in database and return
        prev_amount = rec.amount
        prev_is_income = rec.is_income
        recSeri = RecordSerializer(rec, data=data, partial=True)
        if recSeri.is_valid():
            rec = recSeri.save()
            RecordSaveHandler(Record, rec, False, prev_amount=prev_amount, prev_is_income=prev_is_income)
            return JsonResponse(status=201, data=recSeri.data)
        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})
    
    def delete(self, request):
        # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
        # user = request.user
        data = request.data
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        try:
            # print(delList)
            delSet = self.queryset.filter(id__in=delList)
        except:
            # invalid id input
            return JsonResponse(status=401, data={"success": False})

        if delSet.count() is not 0:
            delSet.delete()
            return JsonResponse(status=200, data={"success": True})
        else:
            # no such records
            return JsonResponse(status=401, data={"success": False})




    

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class AccountModify(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = []
    # filter_backends = [ObjectPermissionsFilter]

    # input: ["true"]/["false"], output: T/F
    def bool_to_bool(self, bol):
        if (bol=='true'):
            return True
        else:
            return False

    # input: ["4"], output: 4
    def int_to_int(self, num):
        return int(num)
        
    def get(self, request):
        user = request.user
        # body = request.body
        data = request.query_params
        is_many = self.bool_to_bool(data["is_many"])

        if (not is_many):
            # get according to account_id
            acc_id = self.int_to_int(data["account_id"]) 
            try:
                acc = self.queryset.get(id=acc_id)
            except:
                return JsonResponse(status=400, data={"success": False})

            # acc existance
            # print(acc)
            if (acc):  
                accSeri = AccountSerializer(acc)
                return JsonResponse(status=201, data=accSeri.data) # safe=False guarantees the validity of returning a list of objects
            else:
                # "account does not exist"
                return JsonResponse(status=400, data={"success": False})

        else:
            # user_id re-authenticate for stronger robustness   
            try:
                uid = data["uid"]
                verify_usr = User.objects.get(pk=uid)
                if (not verify_usr.is_authenticated):
                    # user unauthenticated
                    return JsonResponse(status=401, data={"success": False})
                user = verify_usr
            except:
                # user_id not found
                return JsonResponse(status=401, data={"success": False})
            
            # get accounts according to the user
            try:
                usrAcc = self.queryset.filter(userProfile__id=user.user_profile.id)
            except:
                return JsonResponse(status=400, data={"success": False})

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

        # user_id re-authenticate for stronger robustness   
        try:
            uid = data["uid"]
            verify_usr = User.objects.get(pk=uid)
            if (not verify_usr.is_authenticated):
                # user unauthenticated
                return JsonResponse(status=401, data={"success": False})
            user = verify_usr
        except:
            # user_id not found
            return JsonResponse(status=401, data={"success": False})

        # data = json.loads(body)
        if (Account.objects.filter(name=data["name"])) or (data["balance"] < 0):
            # Account name already exists, and the balance should be non-negative
            return JsonResponse(status=400, data={"success": False})

        acc = Account()
        # set foreign key
        acc.userProfile = user.user_profile
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

        try:
            acc = self.queryset.get(id=data["account_id"])
        except:
            return JsonResponse(status=400, data={"success": False})

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
        try:
            delSet = self.queryset.filter(pk__in=delList)
        except:
            return JsonResponse(status=401, data={"success": False})
        
        if delSet:
            delSet.delete()
            return JsonResponse(status=200, data={"success": True})
        else:
            return JsonResponse(status=401, data={"success": False})
    

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
# json provided
class PlanModify(generics.GenericAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = []
    # filter_backends = [ObjectPermissionsFilter]
    # input: "true"/"false", output: T/F
    def bool_to_bool(self, bol):
        if (bol=='true'):
            return True
        else:
            return False

    # input: "4", output: 4
    def int_to_int(self, num):
        return int(num)

    def get(self, request):
        user = request.user
        data = request.query_params
        acc_many = self.bool_to_bool(data["is_account_many"])
        usr_many = self.bool_to_bool(data["is_user_many"])

        if acc_many:
            # Look for the plans of a given account
            accid = self.int_to_int(data["account_id"]) 
            try:
                planset = self.queryset.filter(account__id=accid).order_by("-created_time")
            except:
                return JsonResponse(status=400, data={"success": False})
            
            if not planset:
                # account has no plan 
                return JsonResponse(status=400, data={"success": False})
            plseri = PlanSerializer(planset, many=True)
            return JsonResponse(status=201, data=plseri.data, safe=False)

        elif usr_many:
            # user_id re-authenticate for stronger robustness
            try:
                uid = self.int_to_int(data["uid"])
                verify_usr = User.objects.get(pk=uid)
                if (not verify_usr.is_authenticated):
                    # user unauthenticated
                    return JsonResponse(status=401, data={"success": False})
                user = verify_usr
            except:
                # user_id not found
                return JsonResponse(status=401, data={"success": False})

            # Look for the plans of a given user
            try:
                # print(user)
                upid = user.user_profile.id
            except:
                return JsonResponse(status=400, data={"success": False})

            try:
                planset = self.queryset.filter(userProfile__id=upid).order_by("-created_time")
                # print("filter successful")
            except:
                return JsonResponse(status=400, data={"success": False})
                
            if not planset:
                # user has no plan
                return JsonResponse(status=400, data={"success": False})
            plseri = PlanSerializer(planset, many=True)
            return JsonResponse(status=201, data=plseri.data, safe=False)

        else:
            # Look for a given plan_id's plan
            plan_id = self.int_to_int(data["plan_id"]) 
            try:
                plan = self.queryset.get(id=plan_id)
            except:
                return JsonResponse(status=400, data={"success": False})

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

        # user_id re-authenticate for stronger robustness
        try:
            uid = data["uid"]
            verify_usr = User.objects.get(pk=uid)
            if (not verify_usr.is_authenticated):
                # user unauthenticated
                return JsonResponse(status=401, data={"success": False})
            user = verify_usr
        except:
            # user_id not found
            return JsonResponse(status=401, data={"success": False})

        # fields to change directly: name, description, start_time, end_time, budget
        # fields to change indirectly: remaining, failed (by signal)
        try:
            data["remaining"] = data["budget"]
            if (data["budget"] < 0):
                return JsonResponse(status=400, data={"success": False})
        except:
            return JsonResponse(status=400, data={"success": False})

        plan = Plan()
        plan.userProfile = user.user_profile
        
        try:
            plan.account = Account.objects.get(pk=data["account_id"])
        except:
            return JsonResponse(status=400, data={"success": False})
        
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
        
        # avoid invalid plan_id
        try:
            plan = self.queryset.get(id=data["plan_id"])
        except:
            return JsonResponse(status=400, data={"success": False})
        
        original_buget = plan.budget
        data["remaining"] = plan.remaining
        data["failed"] = plan.failed

        # fields to change directly: name, description, start_time, end_time, budget
        # fields to change indirectly: remaining, failed
        if (original_buget >= data["budget"]):
            # budget decrease
            data["remaining"] -= original_buget - data["budget"]
            # Failure after changing
            if (data["remaining"] <= 0):
                # data["remaining"] = 0
                data["failed"] = True
        else:
            # budget increase
            ori_remain = data["remaining"]
            data["remaining"] += data["budget"] - original_buget
            # revival judgement
            if ((ori_remain <= 0) and (data["remaining"] > 0)):
                data["failed"] = False

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
        try:
            delSet = self.queryset.filter(pk__in=delList)
        except:
            return JsonResponse(status=401, data={"success": False})
        
        if delSet:
            delSet.delete()
            return JsonResponse(status=200, data={"success": True})
        else:
            return JsonResponse(status=200, data={"success": False})
    