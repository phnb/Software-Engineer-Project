from django.db.models import fields
from rest_framework import serializers
from cashapp.models import *

# serializer for normal data fields
# foreign key is separately updated
class AccountSerializer(serializers.ModelSerializer):
    """
    Account serialize for serializing the account data fields and save in the model
    """
    class Meta:
        model = Account
        fields = '__all__'


class RecordSerializer(serializers.ModelSerializer):
    """
    Record serialize for serializing the record data fields and save in the model
    """
    class Meta:
        model = Record
        fields = '__all__'


class PlanSerializer(serializers.ModelSerializer):
    """
    Plan serialize for serializing the plan data fields and save in the model
    """
    class Meta:
        model = Plan
        fields = '__all__'
