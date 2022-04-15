from django.db.models import fields
from rest_framework import serializers
from cashapp.models import *

# serializer for normal data fields
# foreign key is separately updated
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        # exclude = ['id', 'created_time', 'modified_time', 'userProfile']


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = '__all__'
        # exclude = ['id', 'created_time', 'modified_time', 'account']


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'
        # exclude = ['id', 'remaining', 'created_time', 'modified_time', 'failed', 'account', 'userProfile']
