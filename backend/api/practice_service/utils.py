
from practiceapp.models import PractionerUser

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