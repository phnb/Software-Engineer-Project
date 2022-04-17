import json
from datetime import date, datetime

class complexencoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            print(obj.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
            return obj.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)