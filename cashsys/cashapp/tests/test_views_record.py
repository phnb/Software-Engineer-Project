from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from cashapp.views.views import RecordModify, AccountModify, PlanModify
from cashapp.tests.utils import complexencoder
from cashapp.models import Record, Account, Plan
from authsys.models import UserProfile
from datetime import datetime
from datetime import timedelta
import json
import pytz

# Test view functions.
class TestRecordViews(TestCase):
    def setUp(self):
        self.client = Client()
        self.record_url = reverse("recordViews")
        self.plan_url = reverse("planViews")
        self.account_url = reverse("accountViews")

        # simulate the log-in state of a test user (the default user)
        self.user = User.objects.create_user(username='testuser', first_name="xiao", last_name="nan", email="119010344@link.cuhk.edu.cn", password='123456')
        login = self.client.login(username='testuser', password='123456')

        # simulate the user profile of the default user
        self.userProf = UserProfile.objects.create(
            user = self.user,
            username = self.user.username,
            first_name = self.user.first_name,
            last_name = self.user.last_name,
            email = self.user.email,
            is_reset_active = False
        )

        # simulate the default account for the default user
        self.accountDef = Account.objects.create(
            name = "test default account",
            description = "testing acc descs",
            balance = 5000,
            userProfile = self.userProf,
            is_default = True
        )

    # verify the login state
    def test_defaultUsr_login(self):
        self.assertEquals(self.user.is_authenticated, True)

    # verify the default account
    def test_defaultUsr_has_default_account(self):
        accs = self.userProf.accounts.filter(is_default=True)
        self.assertEquals(accs.count(), 1)
        self.assertEquals(self.accountDef.id, accs[0].id)

    # test getting record with record_id
    def test_GET_Record_with_id(self):
        # set-up environment codes
        # set-up the record
        rec = Record.objects.create(
            amount = 600,
            name = "I earned some money today hahahahaaa",
            description = "today is lucky, very very lucky",
            is_income = True,
            account = self.accountDef
        )
        recid = rec.id
        
        # simulate client codes (success)
        response = self.client.get(reverse("recordViews"), {"is_many": "false", "record_id": str(recid)})
        content = response.json()

        # verify simulation results
        # print(content)
        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["id"], recid)
        self.assertEquals(content["amount"], 600)
        self.assertEquals(content["is_income"], True)

        # simulate client codes (failure)
        response = self.client.get(reverse("recordViews"), {"is_many": "false", "record_id": "1000"})
        content = response.json()

        # verify simulation results
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    # test getting record with maximum-number of records for a given account 
    def test_GET_Record_with_num(self):
        # set-up codes
        # create 3 records
        rec1 = Record.objects.create(
            amount = 500,
            name = "rec1",
            description = "rec1 has been created",
            is_income = True,
            account = self.accountDef
        )
        rec2 = Record.objects.create(
            amount = 500,
            name = "rec2",
            description = "rec2 has been created",
            is_income = False,
            account = self.accountDef
        )
        rec3 = Record.objects.create(
            amount = 700,
            name = "rec3",
            description = "rec3 has been created",
            is_income = True,
            account = self.accountDef
        )

        # test codes
        # take max=2 records
        response = self.client.get(reverse("recordViews"), {"is_many": "true", "record_max_num": "2", "account_id": str(self.accountDef.id)})
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(len(content), 2)
        self.assertEquals(content[0]["id"], rec1.id) # far(from now) comes first
        self.assertEquals(content[1]["id"], rec2.id)

        # take max=5 records
        response = self.client.get(reverse("recordViews"), {"is_many": "true", "record_max_num": "5", "account_id": str(self.accountDef.id)})
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(len(content), 3)
        # start_time ranked from early to late
        self.assertEquals(content[0]["id"], rec1.id) # far(from now) comes first
        self.assertEquals(content[1]["id"], rec2.id)

    # test getting record within a given time range for a given account
    def test_GET_Record_with_time_and_account(self):
        # set-up codes
        nowtime = datetime.now(tz=pytz.utc).replace(tzinfo=None)
        rec1 = Record.objects.create(
            amount = 500,
            name = "rec1",
            description = "rec1 has been created",
            is_income = True,
            account = self.accountDef
        )
        rec2 = Record.objects.create(
            amount = 200,
            name = "rec2",
            description = "rec2 has been created",
            is_income = False,
            account = self.accountDef
        )
        thentime = datetime.now(tz=pytz.utc).replace(tzinfo=None) + timedelta(days=2)
        # print("nowtime:")
        # print(nowtime)

        # test codes
        # take records within a time range
        response = self.client.get(reverse("recordViews"), {"is_many": "true", "is_many_time": "true", "start_time": nowtime.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), "end_time": thentime.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), "account_id": str(self.accountDef.id)})
        content = response.json()

        # assert records' validity
        # print(content)
        # print("content here!!!!!")
        self.assertEquals(response.status_code, 201)
        self.assertEquals(len(content["income_records"]), 1)
        self.assertEquals(len(content["outcome_records"]), 1)
        self.assertEquals(content["income_records"][0]["id"], rec1.id) 
        self.assertEquals(content["outcome_records"][0]["id"], rec2.id) 

        # Null case
        thentime = thentime + timedelta(seconds=10)
        finaltime = thentime + timedelta(days=2)
        response = self.client.get(reverse("recordViews"), {"is_many": "true", "is_many_time": "true", "start_time": thentime.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), "end_time": finaltime.strftime('%Y-%m-%dT%H:%M:%S.%fZ'), "account_id": str(self.accountDef.id)})
        content = response.json()

        # assert records' validity
        self.assertEquals(content["income_records"], [])
        self.assertEquals(content["outcome_records"], [])

    def test_POST_Record(self):
        # set-up codes
        # normal case
        data_dict = {
            "amount" : 200,
            "name" : "rec2",
            "description" : "rec2 has been created",
            "is_income" : True,
            "account_id" : self.accountDef.id,
            "start_time": datetime.now(tz=pytz.utc).replace(tzinfo=None),
            "uid": self.user.id
        }
        response = self.client.post(reverse("recordViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["name"], "rec2")

        # error case
        data_dict = {
            "amount" : 100,
            "name" : "rec2",
            "description" : "rec2 has been created",
            "is_income" : False,
            "account_id" : 10000,
            "start_time": datetime.now(tz=pytz.utc).replace(tzinfo=None)
        }
        response = self.client.post(reverse("recordViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)
    
    def test_PATCH_Record(self):
        # set-up codes
        rec2 = Record.objects.create(
            amount = 200,
            name = "rec2",
            description = "rec2 has been created",
            is_income = False,
            account = self.accountDef
        )

        # normal case
        data_dict = {
            "record_id": rec2.id,
            "amount" : 400,
            "name" : "rec9",
            "description" : "rec2 has been changed",
            "is_income" : True,
            "start_time": datetime.now(tz=pytz.utc).replace(tzinfo=None)
        }
        response = self.client.patch(reverse("recordViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["is_income"], True)
        self.assertEquals(content["name"], "rec9")

        # error case
        data_dict = {
            "record_id": 10000,
            "amount" : 400,
            "name" : "rec9",
            "description" : "rec2 has been changed",
            "is_income" : True,
            "start_time": datetime.now(tz=pytz.utc).replace(tzinfo=None)
        }
        response = self.client.patch(reverse("recordViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    def test_DELETE_Record(self):
        # set-up codes
        # create 3 records
        rec1 = Record.objects.create(
            amount = 500,
            name = "rec1",
            description = "rec1 has been created",
            is_income = True,
            account = self.accountDef
        )
        rec2 = Record.objects.create(
            amount = 500,
            name = "rec2",
            description = "rec2 has been created",
            is_income = False,
            account = self.accountDef
        )
        rec3 = Record.objects.create(
            amount = 700,
            name = "rec3",
            description = "rec3 has been created",
            is_income = True,
            account = self.accountDef
        )

        # normal case
        data_dict = {
            "del_id_list": [rec1.id, rec2.id]
        }
        response = self.client.delete(reverse("recordViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 200)
        self.assertEquals(content["success"], True)

        # error case: type error
        data_dict = {
            "del_id_list": [20000, 10000]
        }
        response = self.client.delete(reverse("recordViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)

        # error case: no such record
        data_dict = {
            "del_id_list": ["jjj", 10000]
        }
        response = self.client.delete(reverse("recordViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert records' validity
        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)
