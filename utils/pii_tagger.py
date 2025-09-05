import re

PII_KEYWORDS = ["email", "phone", "mobile", "ssn", "name", "dob", "address"]

PII_REGEXES = {
    "email": re.compile(r".*@.*\..*"),
    "phone": re.compile(r"^\+?\d[\d\- ]{7,}$"),
    "ssn": re.compile(r"\d{3}-\d{2}-\d{4}"),
    "dob": re.compile(r"\d{2,4}[/-]\d{1,2}[/-]\d{1,4}"),
    # Add more as needed
}

def is_pii_field(field_name: str, sample_type: str):
    name_lc = field_name.lower()
    for keyword in PII_KEYWORDS:
        if keyword in name_lc:
            return True
    if name_lc in PII_REGEXES and PII_REGEXES[name_lc].match(sample_type):
        return True
    return False
