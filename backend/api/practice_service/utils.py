
from practiceapp.models import PractionerUser, PractionerRegistry

from uuid import uuid4


def register_user(name, email, password):
    try:
        # Check if email already exists
        if PractionerUser.objects.filter(email=email).exists():
            return {"message": "Email already exists"}
            
        practice_user = PractionerUser.objects.create(
            name=name,
            email=email,
            password=password
        )
        practice_user.save()
        return practice_user
    except:
        return {"message": "Something went wrong"}
    
def login_user(email, password):
    try:
        token = str(uuid4())
        practice_user = PractionerUser.objects.get(email=email, password=password)
        practice_user.token = token
        practice_user.save()
        return {"token": token}
    except Exception as e:
        return str(e)
    
    
def get_user_details(token):
    try:
        practice_user = PractionerUser.objects.filter(token=token).first()
        if not practice_user:
            raise Exception("User not found")
        return practice_user
    except Exception as e:
        raise Exception(str(e))
    
def get_practice_details(user_token: str):
    print(user_token)
    try:
        practice_user = PractionerRegistry.objects.filter(token=user_token).first()
        if not practice_user:
            raise Exception("Practice not found")
        return practice_user
    except Exception as e:
        raise Exception(str(e))