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

import warnings
# Fxxking warnings, get away :)
warnings.filterwarnings("ignore")


# Test view functions.
class TestPlanViews(TestCase):
    def setUp(self):
        """
        Setting up the testing environment
        """
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

        self.accountDef2 = Account.objects.create(
            name = "test account 2",
            description = "testing acc descs 2",
            balance = 5200,
            userProfile = self.userProf,
            is_default = False
        )

        # simulate the plans made by the user
        self.planAdef = Plan.objects.create(
            name = "the first default plan",
            description = "Planning every day, ddl far away.",
            start_time = datetime.utcnow(),
            end_time = datetime.utcnow() + timedelta(days=2),
            budget = 5000,
            account = self.accountDef,
            userProfile = self.userProf
        )
        self.planBdef = Plan.objects.create(
            name = "the second default plan",
            description = "Success in life is not how well we execute Plan A; it's how smoothly we cope with Plan B. By Sarah Ban Breathnach",
            start_time = datetime.utcnow(),
            end_time = datetime.utcnow() + timedelta(seconds=2),
            budget = 3000,
            account = self.accountDef,
            userProfile = self.userProf
        )

    # verify the login state
    def test_defaultUsr_login(self):
        """
        Test default user logging in functions
        """
        self.assertEquals(self.user.is_authenticated, True)

    # verify the default account
    def test_defaultUsr_has_default_account(self):
        """
        Test default user's default account's existence
        """
        accs = self.userProf.accounts.filter(is_default=True)
        self.assertEquals(accs.count(), 1)
        self.assertEquals(self.accountDef.id, accs[0].id)

    # test getting plan with plan_id
    def test_GET_plan_with_planid(self):
        """
        Test plan GET method with plan id as input
        """
        # set-up environment codes
        # test codes
        # plan exists
        response = self.client.get(reverse("planViews"), {"is_account_many" : 'false', "is_user_many" : 'false', "plan_id": str(self.planAdef.id)})
        content = response.json()

        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["id"], self.planAdef.id)

        # plan not exists
        response = self.client.get(reverse("planViews"), {"is_account_many" : 'false', "is_user_many" : 'false', "plan_id": str(10000)})
        content = response.json()

        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    def test_GET_plan_with_accid(self):
        """
        Test plan GET method with account id as input
        """
        # set-up codes
        planC = Plan.objects.create(
            name = "Boy, you need the third plan!",
            description = "I've never lost my cool. Even in love affairs. If you have Plan B and Plan C, you are all the time relaxed. By Mikhail Prokhorov",
            start_time = datetime.utcnow(),
            end_time = datetime.utcnow() + timedelta(days=2),
            budget = 2000,
            account = self.accountDef,
            userProfile = self.userProf
        )
        planD = Plan.objects.create(
            name = "Ah man, more plans, better planned.",
            description = "If Plan A isn't working, I have Plan B, Plan C, and even Plan D. By Serena Williams",
            start_time = datetime.utcnow(),
            end_time = datetime.utcnow() + timedelta(days=2),
            budget = 7000,
            account = self.accountDef,
            userProfile = self.userProf
        )

        # success: getting 4 plans full
        response = self.client.get(reverse("planViews"), {"is_account_many" : 'true', "is_user_many" : 'false', "account_id": str(self.accountDef.id)} )
        content = response.json()

        self.assertEquals(response.status_code, 201)
        self.assertEquals(len(content), 4)
        # self.assertEquals(content[0]["id"], planD.id) # checking for the descending order, but not testable due to the async execution 
        
        # error: invalid account id
        response = self.client.get(reverse("planViews"), {"is_account_many" : 'true', "is_user_many" : 'false', "account_id": str(99999)} )
        content = response.json()

        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)


    def test_GET_plan_with_uid(self):
        """
        Test plan GET method with user id as input
        """
        # set-up codes (to simulate user cross-account plans fetching)
        planE = Plan.objects.create(
            name = "How comes plan E! Fantastic, you mush be a careful man!",
            description = "No one has any idea what's going to happen. Not even Elon Musk. That's why he's building those rockets. He wants a 'Plan B' on another world. By Stephen Colbert",
            start_time = datetime.utcnow(),
            end_time = datetime.utcnow() + timedelta(days=2),
            budget = 3000,
            account = self.accountDef2,
            userProfile = self.userProf
        )

        # normal case
        response = self.client.get(reverse("planViews"), {"is_account_many" : 'false', "is_user_many" : 'true', "uid": str(self.user.id)} )
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(len(content), 3)
        # self.assertEquals(content[0]["id"], planE.id) # check returning order (descending), but not testable due to the async execution 

        # error case: uid forgery
        uid = 3
        response = self.client.get(reverse("planViews"), {"is_account_many" : 'false', "is_user_many" : 'true', "uid": str(uid)} )
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)

    def test_POST_plan(self):
        """
        Test plan POST method with new plan information as input
        """
        # set-up codes
        # test codes
        # normal case
        data_dict = {
            "name": "Lazy to make the name.", 
            "description": "Lazy to make the desc. XO", 
            "start_time": datetime.utcnow(), 
            "end_time": datetime.utcnow() + timedelta(days=2), 
            "budget": 3400.5, 
            "account_id": self.accountDef2.id,
            "uid": self.user.id
        }

        response = self.client.post(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["budget"], 3400.5)

        # error case: negative budget
        data_dict = {
            "name": "Lazy to make the name.", 
            "description": "Lazy to make the desc. XO", 
            "start_time": datetime.utcnow(), 
            "end_Time": datetime.utcnow() + timedelta(days=2), 
            "budget": -3400.5, 
            "account_id": self.accountDef2.id,
            "uid": self.user.id
        }
        response = self.client.post(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

        # error case: invalid account id
        data_dict = {
            "name": "Lazy to make the name.", 
            "description": "Lazy to make the desc. XO", 
            "start_time": datetime.utcnow(), 
            "end_Time": datetime.utcnow() + timedelta(days=2), 
            "budget": 8400.5, 
            "account_id": 9999,
            "uid": self.user.id
        }
        response = self.client.post(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    def test_PATCH_plan(self):
        """
        Test plan PATCH method with new plan information as input
        """
        # set-up codes
        # normal case
        data_dict = {
            "name": "Hey, modified!", 
            "description": "Huh, you think I'm gonna write a long sentence? Never! NNEEVVEERR!", 
            "start_time": datetime.utcnow(),
            "end_Time": datetime.utcnow() + timedelta(days=2),
            "budget": 90000, 
            "plan_id": self.planAdef.id
        }
        
        response = self.client.patch(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["name"], "Hey, modified!")

        # error case (plan_id error)
        data_dict = {
            "name": "Hiii modified!", 
            "description": "Huh, you think I'm gonna write a long sentence? Never! NNEEVVEERR!", 
            "start_time": datetime.utcnow(),
            "end_Time": datetime.utcnow() + timedelta(days=2),
            "budget": 40000, 
            "plan_id": 99999
        }

        response = self.client.patch(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    def test_DELETE_plan(self):
        """
        Test plan DELETE method with the list of plan ids to be deleted as input
        """
        # set-up codes
        # create 2 plans
        planF = Plan.objects.create(
            name = "Man, your F'th plan, implementing which faithfully you should never F!",
            description = "If you don't pursue what you think will be most meaningful, you will regret it. Life is long. There is always time for Plan F. But don't begin with it. By Drew Gilpin Faust",
            start_time = datetime.utcnow(),
            end_time = datetime.utcnow() + timedelta(days=2),
            budget = 3400,
            account = self.accountDef2,
            userProfile = self.userProf
        )
        planG = Plan.objects.create(
            name = "God I'm tired, this finally becomes my last plan. XO",
            description = "Plan A is to hitch a ride out of here. But if they want a war, then plan G is to win it.. WIN CSC4001 PROJECT! By Lee Child",
            start_time = datetime.utcnow(),
            end_time = datetime.utcnow() + timedelta(days=2),
            budget = 99999,
            account = self.accountDef2,
            userProfile = self.userProf
        )

        # test codes
        # error case: type error
        data_dict = {
            "del_id_list": ["planF.id", "planG.id"]
        }
        response = self.client.delete(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        # print(content)
        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)

        # error case: no such plan
        data_dict = {
            "del_id_list": [20000, 10000]
        }
        response = self.client.delete(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 200)
        self.assertEquals(content["success"], False)

        # normal case
        data_dict = {
            "del_id_list": [planF.id, planG.id]
        }
        response = self.client.delete(reverse("planViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert plans' validity
        self.assertEquals(response.status_code, 200)
        self.assertEquals(content["success"], True)
