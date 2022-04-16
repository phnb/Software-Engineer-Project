from cashapp.models import Record
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

@receiver(post_save, sender=Record)
def RecordSaveHandler(sender, instance, created, **kwargs):
    # NEED SIGNAL ACCOUNT.balance, PLAN.remaining
    # add/subtract money in ACCOUNT.balance, PLAN.remaining
    # print("invoked!!!")
    # if not created:
    #     print("reall y twice hhhh")
    #     try:
    #         print(kwargs["prev_amount"])
    #     except: 
    #         pass
    # patch-triggering would not make the handler do anything, unless called directly with kwarg
    if created:
        incr = instance.amount
        is_income = instance.is_income
    else:
        try:
            incr = abs(instance.amount - kwargs["prev_amount"])
            is_income = (instance.amount >= kwargs["prev_amount"])
        except: 
            return 0

    if is_income:
        # update account balance
        instance.account.balance += incr
        instance.account.save()

        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining += incr
            plan.save()

    else:
        # update account balance
        instance.account.balance -= incr
        instance.account.save()

        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining -= incr
            if plan.remaining <= 0:
                plan.failed = True
            plan.save()


@receiver(post_delete, sender=Record)
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
  
# post_save.connect(RecordSaveHandler, sender=Record)
# post_delete.connect(RecordDeleteHandler, sender=Record)

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