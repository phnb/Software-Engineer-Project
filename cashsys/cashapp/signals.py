from cashapp.models import Record
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

@receiver(post_save, sender=Record)
def RecordSaveHandler(sender, instance, created, **kwargs):
    """
    When the record is modified, update the account balance and plan remaining
    """
    # Judge whether the record is income and compute the amount of money related
    if created:
        incr = instance.amount
        is_income = instance.is_income
    else:
        try:
            income_bool_dict = {True: 1, False: -1}
            if instance.is_income ^ kwargs["prev_is_income"]:
                incr = abs(income_bool_dict[instance.is_income] * instance.amount + income_bool_dict[kwargs["prev_is_income"]] * kwargs["prev_amount"])
            else:
                incr = abs(instance.amount - kwargs["prev_amount"])
            is_income = ((income_bool_dict[instance.is_income] * instance.amount - income_bool_dict[kwargs["prev_is_income"]] * kwargs["prev_amount"]) >= 0)
        except: 
            return 0

    # update account balance
    if is_income:
        instance.account.balance += incr
        instance.account.save()
    else:
        instance.account.balance -= incr
        instance.account.save()
        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining -= incr
            if plan.remaining < 0:
                plan.failed = True
            plan.save()

@receiver(post_delete, sender=Record)
def RecordDeleteHandler(sender, instance, **kwargs):
    """
    When the record is deleted, update the account balance and plan remaining
    """
    if instance.is_income:
        # update account balance
        instance.account.balance -= instance.amount
        instance.account.save()
        # update plan remaining 
        for plan in instance.plans.all():
            plan.remaining -= instance.amount
            if plan.remaining < 0:
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