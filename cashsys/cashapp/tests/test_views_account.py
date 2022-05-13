from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from cashapp.views.views import RecordModify, AccountModify, PlanModify
from cashapp.models import Record, Account, Plan
from cashapp.tests.utils import complexencoder
from authsys.models import UserProfile
from datetime import datetime
from datetime import timedelta
import json

import warnings
# Fxxking warnings, get away :)
warnings.filterwarnings("ignore")



# Test Account CBV view functions.
class TestAccountViews(TestCase):
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

    # test getting account with account_id
    def test_GET_acc_with_id(self):
        """
        Test account GET method with account id as input
        """
        # account exists
        response = self.client.get(reverse("accountViews"), {"is_many": "false", "account_id": str(self.accountDef.id)})
        content = response.json()

        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["id"], self.accountDef.id)

        # account not exists
        response = self.client.get(reverse("accountViews"), {"is_many": "false", "account_id": str(10000)})
        content = response.json()

        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    def test_GET_acc_with_usr(self):
        """
        Test account GET method with user id as input
        """
        # set-up codes
        # user in (success)
        response = self.client.get(reverse("accountViews"), {"is_many": "true", "uid": self.user.id})
        content = response.json()

        self.assertEquals(response.status_code, 201)
        self.assertLessEqual(1, len(content))
        
        # user logged out (error)
        response = self.client.get(reverse("accountViews"), {"is_many": "true", "uid": 99999})
        content = response.json()

        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)

    def test_POST_acc(self):
        """
        Test account POST method with new account information as input
        """
        # set-up codes
        # normal case
        data_dict = {
            "name" : "recnew",
            "description" : "recnew has been created",
            "balance": 9000,
            "uid": self.user.id
        }
        response = self.client.post(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["balance"], 9000)

        # error case: negative balance
        data_dict = {
            "name" : "rect",
            "description" : "rect has been created",
            "balance": -9000,
            "uid": self.user.id
        }
        response = self.client.post(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

        # error case: repeated account name
        data_dict = {
            "name" : "recnew",
            "description" : "rect has been created",
            "balance": 9000,
            "uid": self.user.id
        }
        response = self.client.post(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    def test_PATCH_acc(self):
        """
        Test account PATCH method with new account information as input
        """
        # set-up codes
        # normal case
        data_dict = {
            "account_id": self.accountDef.id, 
            "name": "accDef", 
            "description": "accDef name changed"
        }
        response = self.client.patch(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 201)
        self.assertEquals(content["name"], "accDef")

        # error case (id error)
        data_dict = {
            "account_id": 100000, 
            "name": "accDef", 
            "description": "accDef name changed"
        }
        response = self.client.patch(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 400)
        self.assertEquals(content["success"], False)

    def test_DELETE_acc(self):
        """
        Test account DELETE method with the list of account ids to be deleted as input
        """
        # set-up codes
        # create 3 accounts
        acc1 = Account.objects.create(
            balance = 5000,
            name = "acc1",
            description = "acc1 has been created",
            userProfile = self.user.user_profile
        )
        acc2 = Account.objects.create(
            balance = 8000,
            name = "acc2",
            description = "acc2 has been created",
            userProfile = self.user.user_profile
        )

        # test codes
        # normal case
        data_dict = {
            "del_id_list": [acc1.id, acc2.id]
        }
        response = self.client.delete(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 200)
        self.assertEquals(content["success"], True)


        # error case: type error
        data_dict = {
            "del_id_list": ["20000", "10000"]
        }
        response = self.client.delete(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)

        # error case: no such account
        data_dict = {
            "del_id_list": [20000, 10000]
        }
        response = self.client.delete(reverse("accountViews"),
                                json.dumps(data_dict, cls=complexencoder),
                                content_type="application/json")
        content = response.json()

        # assert accounts' validity
        self.assertEquals(response.status_code, 401)
        self.assertEquals(content["success"], False)
