from django.apps import AppConfig
from django.db.models.signals import post_save, post_delete

class CashappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cashapp'
    # post_save.connect(PlanSaveHandler, sender=Plan)
    # post_delete.connect(PlanDeleteHandler, sender=Plan)

    # post_save.connect(AccountSaveHandler, sender=Account)
    # post_delete.connect(AccountDeleteHandler, sender=Account)
