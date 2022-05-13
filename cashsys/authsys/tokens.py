from django.contrib.auth.tokens import PasswordResetTokenGenerator
from six import text_type

class TokenGenerator(PasswordResetTokenGenerator):
    """
    Generate the token randomly, according to the hash value of user id and the current time
    """
    def _make_hash_value(self, user, timestamp):
        return ( text_type(user.pk) + text_type(timestamp) )

generate_token = TokenGenerator()
