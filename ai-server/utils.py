from typing import Optional


def is_valid_jd(jd: Optional[str]) -> bool:
    if jd is None or not jd.strip():
        return False
    if len(jd.strip()) < 10:
        return False
    import re
    if re.fullmatch(r'[a-zA-Z0-9 ]+', jd.strip()):
        return False
    return True