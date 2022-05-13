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

import warnings
# Fxxking warnings, get away :)
warnings.filterwarnings("ignore")


@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
class RecordModify(generics.GenericAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = []

    # helper functions:
    # input: "true"/"false", output: T/F
    def bool_to_bool(self, bol):
        """
        Helper functions for reusability
        """
        if (bol=='true'):
            return True
        else:
            return False

    # input: "4", output: 4
    def int_to_int(self, num):
        """
        Helper functions for reusability
        """
        return int(num)

    def get(self, request):
        """
        Obtain the corresponding records given input parameters and "many" flags:\n
        "is_many": True, "is_many_time": True -> Obtain all records of a given account, within a time range\n
        "is_many": True, "is_many_time": False -> Obtain recent records according to max_num\n
        "is_many": False, "is_many_time": False -> Obtain a record with record id
        """
        user = request.user
        data = request.query_params
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
                accid = self.int_to_int(data["account_id"])
                maxrec = self.int_to_int(data["record_max_num"])

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
                stt_time = data["start_time"]
                end_time = data["end_time"]
                accid = self.int_to_int(data["account_id"]) 

                # filter the records within the time range
                try:
                    rangeRec = self.queryset.filter(Q(account__id=accid) & Q(start_time__gte=stt_time) & Q(start_time__lte=end_time))
                except:
                    return JsonResponse(status=400, data={"success": False})

                # serialize and return
                incomeRec = rangeRec.filter(is_income=True).order_by("-amount")
                outcomeRec = rangeRec.filter(is_income=False).order_by("-amount")
                incomeSeri = RecordSerializer(incomeRec, many=True, allow_null=True)
                outcomeSeri = RecordSerializer(outcomeRec, many=True, allow_null=True)
                return JsonResponse(status=201, data={"income_records": incomeSeri.data, "outcome_records": outcomeSeri.data})
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
            
            # serialize and obtain the response
            recSeri = RecordSerializer(rec)
            return JsonResponse(status=201, data=recSeri.data)
            
    def post(self, request):
        """
        Add a new record with parameters (record information) inputed:\n
        Return the success status and record information
        """
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

        # initialize record
        rec = Record()

        # avoid null record
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
            rec = recSeri.save() # to invoke signal

            # set plan (troublesome, by finding the overlapping plans and binding), and avoid no plan available
            try:
                validPlans = rec_acc.plans.all().filter(Q(start_time__lte=datetime.now(tz=pytz.utc).replace(tzinfo=None)) & Q(end_time__gte=datetime.now(tz=pytz.utc).replace(tzinfo=None)))
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
        # wrong parameters
        return JsonResponse(status=400, data={"success": False})

    def patch(self, request):
        """
        Modify a record with parameters (modify fields) inputed:\n
        Return new record information and success status
        """
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
        """
        Delete records with a list of record ids inputed:\n
        Return success status
        """
        data = request.data
        delList = data["del_id_list"]

        # filter out the set to be deleted and delete it
        try:
            # print(delList)
            delSet = self.queryset.filter(id__in=delList)
        except:
            # invalid id input
            return JsonResponse(status=401, data={"success": False})

        if delSet.count() != 0:
            delSet.delete()
            return JsonResponse(status=200, data={"success": True})
        else:
            # no such records
            return JsonResponse(status=401, data={"success": False})




    

@method_decorator(login_required, name='dispatch')
# @api_view(["GET", "POST", "PATCH", "DELETE"])
class AccountModify(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = []

    # input: ["true"]/["false"], output: T/F
    def bool_to_bool(self, bol):
        """
        Helper functions for reusability
        """
        if (bol=='true'):
            return True
        else:
            return False

    # input: ["4"], output: 4
    def int_to_int(self, num):
        """
        Helper functions for reusability
        """
        return int(num)
        
    def get(self, request):
        """
        Obtain the corresponding records given input parameters and "is_many" flags:\n
        "is_many": False -> obtain an account given an account id\n
        "is_many": True -> obtain many accounts for a given user\n
        """
        user = request.user
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
            if (acc):  
                accSeri = AccountSerializer(acc)
                return JsonResponse(status=201, data=accSeri.data) 
            else:
                # "account does not exist"
                return JsonResponse(status=400, data={"success": False})

        else:
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
            
            # get accounts according to the user
            try:
                usrAcc = self.queryset.filter(userProfile__id=user.user_profile.id).order_by("-created_time")
            except:
                return JsonResponse(status=400, data={"success": False})

            # empty judgement (ensure no such account yet)
            if usrAcc:
                accSer = AccountSerializer(usrAcc, many=True)
                return JsonResponse(status=201, data=accSer.data, safe=False)
            else:
                return JsonResponse(status=400, data={"success": False})
            
    def post(self, request):
        """
        Add a new account with parameters (account information) inputed:\n
        Return the success status and account information
        """
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
        # wrong parameters
        return JsonResponse(status=400, data={"success": False})

    def patch(self, request):
        """
        Modify an account with parameters (modify fields) inputed:\n
        Return new account information and success status
        """
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
        """
        Delete accounts with a list of account ids inputed:\n
        Return success status
        """
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
class PlanModify(generics.GenericAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = []

    # input: "true"/"false", output: T/F
    def bool_to_bool(self, bol):
        """
        Helper functions for reusability
        """
        if (bol=='true'):
            return True
        else:
            return False

    # input: "4", output: 4
    def int_to_int(self, num):
        """
        Helper functions for reusability
        """
        return int(num)

    # input: "4.0", output: 4.0
    def f_to_f(self, num):
        """
        Helper functions for reusability
        """
        return float(num)

    def get(self, request):
        """
        Obtain the corresponding plans given input parameters and "many" flags:\n
        "is_user_many": False, "is_account_many": True -> Obtain all plans for the given account\n
        "is_user_many": True, "is_account_many": False -> Obtain all plans for the given log-ined user\n
        "is_user_many": False, "is_account_many": False -> Obtain a plan with plan id
        """
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
            seridata = plseri.data
            seridata["success"] = True
            return JsonResponse(status=201, data=seridata, safe=False)

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
            seridata = plseri.data
            seridata["success"] = True
            return JsonResponse(status=201, data=seridata, safe=False)

        else:
            # Look for a given plan_id's plan
            plan_id = self.int_to_int(data["plan_id"]) 
            try:
                plan = self.queryset.get(id=plan_id)
            except:
                return JsonResponse(status=400, data={"success": False})

            # plan existance
            if (plan):  
                plseri = PlanSerializer(plan)
                seridata = plseri.data
                seridata["success"] = True
                return JsonResponse(status=201, data=seridata)
            else:
                # plan does not exist
                return JsonResponse(status=400, data={"success": False})

    def post(self, request):
        """
        Add a new plan with parameters (plan information) inputed:\n
        Return the success status and plan information
        """
        # add new plan
        user = request.user
        data = request.data
        data["budget"] = self.f_to_f(data["budget"])

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
        
        # update the plan's belonging account
        try:
            plan.account = Account.objects.get(pk=data["account_id"])
        except:
            return JsonResponse(status=400, data={"success": False})
        
        # save updated plan
        planSeri = PlanSerializer(plan, data=data, partial=True)
        if planSeri.is_valid():
            planSeri.save()
            pl = planSeri.data
            pl["success"]=True
            return JsonResponse(status=201, data=pl)
        
        # wrong parameters (serializer failure)
        return JsonResponse(status=400, data={"success": False})

    def patch(self, request):
        """
        Modify a plan with parameters (modify fields) inputed:\n
        Return new plan information and success status
        """
        # modify existing plan
        user = request.user
        data = request.data
        
        # avoid invalid plan_id
        try:
            plan = self.queryset.get(id=data["plan_id"])
        except:
            return JsonResponse(status=400, data={"success": False})
        data["budget"] = plan.budget + self.f_to_f(data["budget"])
        original_buget = plan.budget
        data["remaining"] = plan.remaining
        data["failed"] = plan.failed

        # fields to change directly: name, description, start_time, end_time, budget
        # fields to change indirectly: remaining, failed
        if (original_buget >= data["budget"]):
            # budget decrease
            data["remaining"] -= original_buget - data["budget"]
            # Failure after changing
            if (data["remaining"] < 0):
                data["failed"] = True
        else:
            # budget increase
            ori_remain = data["remaining"]
            data["remaining"] += data["budget"] - original_buget
            # revival judgement
            if ((ori_remain < 0) and (data["remaining"] >= 0)):
                data["failed"] = False

        # update changes in database and return
        planSeri = PlanSerializer(plan, data=data, partial=True)
        if planSeri.is_valid():
            planSeri.save() 
            return JsonResponse(status=201, data=planSeri.data)

        # "wrong parameters"
        return JsonResponse(status=400, data={"success": False})
    
    def delete(self, request):
        """
        Delete plan with a list of plan ids inputed:\n
        Return success status
        """
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
    