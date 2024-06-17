import os
import re


def parse_slice(string: str) -> slice:
    match = re.match(r"^(-?\d*):(-?\d*):?(-?\d*)$", string)
    if match:
        args = tuple(map(lambda s: int(s) if s else None, match.group(1, 2, 3)))
        return slice(*args)


def get_size(env_key: str, default=5):
    return int(os.environ.get(env_key) or default)


def get_flag(env_key: str, default=False):
    return os.environ.get(env_key) == 'true' or default
