from cashapp.models import *

def RecordSaveHandler(sender, instance, created, **kwargs):
    # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
    # add/subtract money in ACCOUNT.balance, PLAN.remaining
    if instance.is_income:
        # update account balance
        instance.account.balance += instance.amount
        instance.account.save()

        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining += instance.amount
            plan.save()

    else:
        # update account balance
        instance.account.balance -= instance.amount
        instance.account.save()

        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining -= instance.amount
            if plan.remaining <= 0:
                plan.failed = True
            plan.save()



def RecordDeleteHandler(sender, instance, **kwargs):
    # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
    if instance.is_income:
        # update account balance
        instance.account.balance -= instance.amount
        instance.account.save()

        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining -= instance.amount
            if plan.remaining <= 0:
                plan.failed = True
            plan.save()

    else:
        # update account balance
        instance.account.balance += instance.amount
        instance.account.save()

        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining += instance.amount
            plan.save()
    # print(instance.id)
  
post_save.connect(RecordSaveHandler, sender=Record)
post_delete.connect(RecordDeleteHandler, sender=Record)

# def PlanSaveHandler(sender, instance, created, **kwargs):
#     print(instance.id)
#     # my code

# def AccountSaveHandler(sender, instance, created, **kwargs):
#     print(instance.id)
#     # my code

# def PlanDeleteHandler(sender, instance, **kwargs):
#     print(instance.id)
    
# def AccountDeleteHandler(sender, instance, **kwargs):
#     print(instance.id)