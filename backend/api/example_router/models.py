from pydantic import BaseModel


class ExampleRequest(BaseModel):
    """Example request model"""

    name: str
    age: int