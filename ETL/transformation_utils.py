import re
from unidecode import unidecode
import unicodedata
import pandas as pd
from config import province_to_capital


def check_capital(location, province):
    # Get the capital city of the province from the dictionary
    capital_denomination = province_to_capital.get(province, "capital").lower()

    clean_location = remove_spanish_accentuation(location).lower()

    # Extract the portion of the string inside parentheses if present
    match = re.search(r'\((.*?)\)', clean_location)
    if match:
        clean_location = match.group(1)

    # Check if the capital city is in the location or if 'capital' is in the location
    if capital_denomination in clean_location:
        return 1
    else:
        return 0


def remove_spanish_accentuation(input_str):
    # Normalize the string to decompose the accented characters
    normalized_str = unicodedata.normalize('NFD', input_str)

    # Filter out the non-spacing marks (which represent the accents)
    unaccented_str = ''.join(char for char in normalized_str if unicodedata.category(char) != 'Mn')

    return unaccented_str


def convert_to_unixtime(item):

    if isinstance(item, pd.Timestamp):
        return int(item.timestamp())
    return item


def convert_to_snake_case(name):

    name = unidecode(name)  # Remove accented characters
    name = re.sub('[^0-9a-zA-Z]+', '_', name)  # Replace any non-alphanumeric characters with underscore
    return name.lower()  # Convert to lower case to get snake_case


def summarize_to_yes(value, consider_as_no = []):
    if value is not None and isinstance(value, str):
        value = value.strip().upper()  # Strip whitespace and convert to lower case

    consider_as_no = [v.strip().upper() for v in consider_as_no] # Strip whitespace and convert to lower case

    if value in ['NO'] + consider_as_no:
        return 'NO'
    elif pd.isnull(value) or value == '' or value is None:
        return None
    else:
        return 'YES'


def clean_gastos(value):
    if value is None:
        return None
    # Extract all numeric values from the string
    string_value = str(value).lower()

    nums = re.findall(r"\d+\.?\d*", string_value)
    nums = [float(n) for n in nums]

    divisor = 1
    if 'año' in string_value or "anual" in string_value:
        divisor = 12
    elif 'semestr' in string_value:
        divisor = 6
    elif 'trimestr' in string_value:
        divisor = 3

    multiplier = 1
    if "más" in string_value:
        multiplier = 1.35

    if len(nums) == 1:
        return nums[0] * multiplier / divisor
    elif len(nums) == 2:
        return ((nums[0] + nums[1]) * multiplier) / (2 * divisor)
    else:
        return None


def clean_to_commons(value, to_group=[], most_commons=[], extra_element='OTROS'):
    if value is None or not isinstance(value, str):
        return None

    string_value = unidecode(value.upper().strip())

    for element_to_group in to_group:
        if element_to_group in string_value:
            return element_to_group

    if string_value in most_commons:
        return string_value
    else:
        return extra_element


def extract_tipo_from_title(value):
    if value is None or not isinstance(value, str):
        return None
    else:
        return unidecode(value.lower().strip().split(" ")[0])


# Define the function to calculate the "mascotas" value
def get_mascotas(row):
    aceptan = row.get('se_aceptan_mascotas', None)
    no_aceptan = row.get('no_se_aceptan_mascotas', None)

    if aceptan is not None and isinstance(aceptan, str):
        return 'YES'
    elif no_aceptan is not None and isinstance(no_aceptan, str):
        return 'NO'
    else:
        return None