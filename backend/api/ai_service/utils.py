

from google import genai
from google.genai import types
import os

from dotenv import load_dotenv
import json

load_dotenv()

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)

model = "gemini-2.0-flash"


def generate_universal(model_name, user_query, system_prompt = "", files = None):
    parts = [types.Part.from_text(text=user_query)]
    
    if files:
        for file in files:
            parts.append(
                types.Part.from_bytes(
                    mime_type="application/pdf",
                    data=file
                )
            )
    
    contents = [
        types.Content(
            role="user",
            parts=parts
        )
    ]
    
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="application/json"
    )
    
    content = client.models.generate_content(
        model=model_name,
        contents=contents,
        config=generate_content_config
    )
    
    return json.loads(content.text)


def get_doctor_details_from_file(file):
    prompt = """
    
    Extract doctor details from the following file given and return the output in this JSON FORMAT:
     
     if some fields are missing then just leave those fields as null
     
     
     EG:
      {
      "practitioner_uuid": "051d3b00-f727-424a-a5fd-b435ddd0ee6e",
      "display_name": "Ashish as",
      "profession": "Therapist",
      "qualifications": "MBBS",
      "education": "Education",
      "gender": "Male",
      "languages_spoken": "English",
      "professional_statement": null,
      "professional_areas_of_interest": {
        "Dermatology": true,
        "Orthopedics": true,
        "Surgery": true,
        "Pediatrics": true
      },
      "link_to_best_practice": null,
      "appointments_count": 0,
      "is_active": true
    }
    
    
    
    
    """
        
    # get doctor details - pass the file content directly as bytes
    doctor_details = generate_universal(model, user_query=prompt, files=[file])
    
    return doctor_details

